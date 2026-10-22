-- Yayınlanmış bordroların PDF arşivi (Cloudflare R2)
--
-- Bordro yayınlandığında sunucuda PDF üretilir ve Bucket Lock'lu R2 bucket'ına
-- yüklenir. Her bordro için tek bir arşiv kaydı tutulur: R2 nesne anahtarı,
-- PDF'in SHA-256'sı ve PDF üretilirken kullanılan snapshot'ın parmak izi
-- (payslips.content_hash). Kayıt bir kez yazılır; güncellenemez ve silinemez.
--
-- payslips tablosuna dokunulmaz: yayınlanmış satırlar 004'teki trigger ile
-- kilitli olduğu için arşiv bilgisi ayrı tabloda tutulur.
--
-- Bilinçli arşiv temizliği (yasal saklama süresi dolunca) için aynı
-- transaction içinde: SET LOCAL app.allow_payslip_purge = 'on';
--
-- Bu migration, ilgili kod deploy edilmeden ÖNCE çalıştırılmalı.

create table if not exists public.payslip_pdf_archives (
  payslip_id uuid primary key
    references public.payslips(id) on delete restrict,
  company_id uuid not null
    references public.companies(id) on delete restrict,
  storage_key text not null unique,
  pdf_sha256 text not null check (pdf_sha256 ~ '^[0-9a-f]{64}$'),
  size_bytes integer not null check (size_bytes > 0),
  content_hash text not null,
  archived_at timestamptz not null default now()
);

create index if not exists payslip_pdf_archives_company_idx
  on public.payslip_pdf_archives (company_id, archived_at);

-- Yalnızca sunucu (service role) erişir; anon/authenticated için policy yok
alter table public.payslip_pdf_archives enable row level security;

create or replace function public.protect_payslip_pdf_archives()
returns trigger
language plpgsql
as $$
begin
  if coalesce(current_setting('app.allow_payslip_purge', true), '') = 'on' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  raise exception 'Payslip PDF archive record % is immutable', old.payslip_id
    using errcode = 'P0001';
end;
$$;

drop trigger if exists protect_payslip_pdf_archives on public.payslip_pdf_archives;
create trigger protect_payslip_pdf_archives
  before update or delete on public.payslip_pdf_archives
  for each row execute function public.protect_payslip_pdf_archives();

-- Arşivlenmeyi bekleyen yayınlanmış bordrolar (cron tekrar denemesi için).
-- Void edilmiş bordro da yayınlandığı haliyle arşivlenir.
create or replace view public.payslips_pending_pdf_archive
with (security_invoker = true) as
select p.id, p.company_id, p.finalized_at
from public.payslips p
where p.status in ('final', 'void')
  and p.snapshot is not null
  and p.content_hash is not null
  and not exists (
    select 1 from public.payslip_pdf_archives a where a.payslip_id = p.id
  );
