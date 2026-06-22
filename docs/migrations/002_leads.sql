-- Lead capture for partner referrals (mortgage broker / personal loan / etc.)
-- Inserts happen ONLY via the service-role admin client in /api/leads.
-- RLS is enabled with no policies → anon/authenticated cannot read or write;
-- the service role bypasses RLS for the API insert.

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  purpose     text not null,            -- e.g. 'mortgage', 'personal-loan'
  name        text not null,
  email       text not null,
  phone       text,
  message     text,
  consent     boolean not null default false,
  source_page text,
  status      text not null default 'new'  -- new | contacted | converted | rejected
);

alter table public.leads enable row level security;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_purpose_idx on public.leads (purpose);
