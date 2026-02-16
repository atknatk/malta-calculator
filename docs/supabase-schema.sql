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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint: one payslip per employee per month
  CONSTRAINT unique_payslip_per_period UNIQUE (employee_id, period_month, period_year)
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
  FOR SELECT USING (access_token IS NOT NULL);

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
