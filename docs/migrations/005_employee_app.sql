-- Çalışan mobil uygulaması (Faz 1)
--
-- 1. employee_invites: şirket, çalışanı e-posta adresiyle uygulamaya davet
--    eder. Çalışan uygulamaya aynı e-postayla (Clerk, doğrulanmış e-posta)
--    giriş yapınca bekleyen davet otomatik olarak hesabına bağlanır.
-- 2. employee_accounts: Clerk kullanıcısı → employees satırı eşlemesi.
--    Bir kişi birden çok işverende çalışabilir (1 hesap → N çalışan kaydı),
--    bir çalışan kaydı ise en fazla bir hesaba bağlıdır.
-- 3. employee_devices: push bildirimleri için FCM token'ları.
-- 4. employee_notifications: uygulama içi bildirim kutusu.
--
-- Tüm tablolara yalnızca sunucu (service role) erişir; RLS açık ve politika
-- yok, yani anon/authenticated rolleri hiçbir satırı göremez.
--
-- Bu migration, ilgili kod deploy edilmeden ÖNCE çalıştırılmalı.

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
