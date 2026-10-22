-- Payslip SaaS Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscription plan enum
CREATE TYPE subscription_plan AS ENUM ('free', 'basic', 'pro');

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  address TEXT,
  tax_number TEXT,
  plan subscription_plan DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  employee_code TEXT,
  position TEXT,
  phone TEXT,
  date_of_birth DATE,
  pin_hash TEXT, -- Hashed PIN for employee access
  salary_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payslips table
CREATE TABLE payslips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  period_month INTEGER NOT NULL CHECK (period_month >= 1 AND period_month <= 12),
  period_year INTEGER NOT NULL CHECK (period_year >= 2020 AND period_year <= 2100),
  gross_salary DECIMAL(12,2) NOT NULL,
  net_salary DECIMAL(12,2) NOT NULL,
  deductions JSONB NOT NULL DEFAULT '{}',
  pdf_url TEXT,
  access_token TEXT UNIQUE DEFAULT uuid_generate_v4()::text,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'void')),
  snapshot JSONB, -- yayınlanırken dondurulan belge verisi
  content_hash TEXT, -- snapshot'ın SHA-256 parmak izi
  voided_at TIMESTAMPTZ,
  void_reason TEXT,
  replaces_payslip_id UUID REFERENCES payslips(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finalized_at TIMESTAMPTZ
  -- Dönem başına tek aktif bordro: unique_active_payslip_per_period (aşağıda)
);

-- Daily usage tracking for rate limiting
CREATE TABLE daily_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  payslips_generated INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT unique_daily_usage UNIQUE (company_id, date)
);

-- Indexes for performance
CREATE INDEX idx_employees_company ON employees(company_id);
CREATE INDEX idx_payslips_company ON payslips(company_id);
CREATE INDEX idx_payslips_employee ON payslips(employee_id);
CREATE INDEX idx_payslips_period ON payslips(period_year, period_month);
CREATE INDEX idx_payslips_access_token ON payslips(access_token);
CREATE INDEX idx_payslips_company_status ON payslips(company_id, status);
CREATE UNIQUE INDEX unique_active_payslip_per_period ON payslips(employee_id, period_month, period_year) WHERE status <> 'void';
CREATE INDEX idx_daily_usage_company_date ON daily_usage(company_id, date);

-- Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Companies
-- Users can only see/modify their own company
CREATE POLICY "Users can view own company" ON companies
  FOR SELECT USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own company" ON companies
  FOR INSERT WITH CHECK (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own company" ON companies
  FOR UPDATE USING (clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for Employees
-- Users can only manage employees in their company
CREATE POLICY "Users can view own company employees" ON employees
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies 
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can insert own company employees" ON employees
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies 
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can update own company employees" ON employees
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM companies 
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can delete own company employees" ON employees
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM companies 
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- RLS Policies for Payslips
CREATE POLICY "Users can view own company payslips" ON payslips
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies 
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can insert own company payslips" ON payslips
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies 
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Public access policy for payslips via access_token (for employees)
CREATE POLICY "Anyone can view payslip with valid token" ON payslips
  FOR SELECT USING (access_token IS NOT NULL AND status IN ('final', 'void'));

-- Yayınlanmış bordroların kilitlenmesi (trigger): docs/migrations/004_payslip_immutability.sql

-- RLS Policies for Daily Usage
CREATE POLICY "Users can view own usage" ON daily_usage
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies 
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can insert own usage" ON daily_usage
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies 
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

CREATE POLICY "Users can update own usage" ON daily_usage
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM companies 
      WHERE clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Saved calculations for short URL sharing
CREATE TABLE saved_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  params JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '90 days',
  view_count INTEGER DEFAULT 0
);

CREATE INDEX idx_saved_calculations_token ON saved_calculations(token);

-- Public access - no RLS needed (anonymous read/write)
ALTER TABLE saved_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert calculations" ON saved_calculations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view calculations by token" ON saved_calculations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update view count" ON saved_calculations
  FOR UPDATE USING (true);

-- ============================================================
-- Çalışan mobil uygulaması (migration 005_employee_app.sql)
-- ============================================================
create table if not exists public.employee_invites (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references public.companies(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete cascade,
  email text not null, -- küçük harfe çevrilmiş
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'revoked')),
  expires_at timestamptz not null default (now() + interval '30 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

-- Çalışan başına tek bekleyen davet
create unique index if not exists unique_pending_invite_per_employee
  on public.employee_invites (employee_id)
  where status = 'pending';
create index if not exists idx_employee_invites_email
  on public.employee_invites (email)
  where status = 'pending';

create table if not exists public.employee_accounts (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null,
  employee_id uuid not null unique
    references public.employees(id) on delete cascade,
  company_id uuid not null references public.companies(id) on delete cascade,
  linked_at timestamptz not null default now()
);

create index if not exists idx_employee_accounts_user
  on public.employee_accounts (clerk_user_id);

create table if not exists public.employee_devices (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null,
  platform text not null check (platform in ('ios', 'android')),
  fcm_token text not null unique,
  app_version text,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index if not exists idx_employee_devices_user
  on public.employee_devices (clerk_user_id);

create table if not exists public.employee_notifications (
  id uuid primary key default uuid_generate_v4(),
  clerk_user_id text not null,
  employee_id uuid references public.employees(id) on delete cascade,
  type text not null
    check (type in ('payslip_issued', 'payslip_voided', 'fs3_issued')),
  title text not null,
  body text not null,
  data jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_employee_notifications_user
  on public.employee_notifications (clerk_user_id, created_at desc);

alter table public.employee_invites enable row level security;
alter table public.employee_accounts enable row level security;
alter table public.employee_devices enable row level security;
alter table public.employee_notifications enable row level security;
