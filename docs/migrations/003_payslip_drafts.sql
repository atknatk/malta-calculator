-- Payslip drafts (taslak bordro)
-- Bir bordro önce 'draft' olarak kaydedilip düzenlenebilir, sonra 'final'
-- olarak yayınlanır. Taslaklar çalışana / doğrulama sayfasına gösterilmez ve
-- aylık plan limitine sayılmaz; limit yalnızca yayınlanan bordroları sayar.
--
-- Mevcut tüm bordrolar 'final' kabul edilir (davranış değişmez).
-- Bu migration, taslak özelliğini içeren kod deploy edilmeden ÖNCE çalıştırılmalı.

alter table public.payslips
  add column if not exists status text not null default 'final',
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists finalized_at timestamptz;

alter table public.payslips
  drop constraint if exists payslips_status_check;
alter table public.payslips
  add constraint payslips_status_check check (status in ('draft', 'final'));

-- Mevcut bordrolar: yayın tarihi = oluşturulma tarihi
update public.payslips
  set finalized_at = created_at, updated_at = created_at
  where status = 'final' and finalized_at is null;

create index if not exists idx_payslips_company_status
  on public.payslips (company_id, status);
create index if not exists idx_payslips_finalized_at
  on public.payslips (company_id, finalized_at);

-- Token ile herkese açık okuma yalnızca yayınlanmış bordrolar için
drop policy if exists "Anyone can view payslip with valid token" on public.payslips;
create policy "Anyone can view payslip with valid token" on public.payslips
  for select using (access_token is not null and status = 'final');
