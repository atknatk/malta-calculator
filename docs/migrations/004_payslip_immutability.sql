-- Yayınlanmış bordroların kilitlenmesi (immutability)
--
-- 1. Yayınlanırken belgenin tüm verisi `snapshot` (jsonb) olarak dondurulur ve
--    SHA-256 parmak izi `content_hash` alanına yazılır. Yayınlanmış bordro hep
--    bu snapshot'tan gösterilir; şirket/çalışan bilgisi sonradan değişse de
--    bordro değişmez.
-- 2. Yayınlanmış ('final') ve geçersiz kılınmış ('void') bordrolar Postgres
--    seviyesinde değiştirilemez ve silinemez (service role dahil). Tek izinli
--    geçiş: final → void (gerekçe zorunlu). Çalışan/şirket silinince cascade
--    ile bordroların silinmesi de engellenir.
-- 3. Void edilen dönemin yerine yeni bordro çıkarılabilir (replaces_payslip_id).
--
-- Bilinçli arşiv temizliği (yasal saklama süresi dolunca) için aynı
-- transaction içinde: SET LOCAL app.allow_payslip_purge = 'on';
--
-- Bu migration, ilgili kod deploy edilmeden ÖNCE çalıştırılmalı.

alter table public.payslips
  add column if not exists snapshot jsonb,
  add column if not exists content_hash text,
  add column if not exists voided_at timestamptz,
  add column if not exists void_reason text,
  add column if not exists replaces_payslip_id uuid
    references public.payslips(id) on delete restrict;

-- Yeni bordrolar her zaman taslak olarak başlar
alter table public.payslips alter column status set default 'draft';

alter table public.payslips
  drop constraint if exists payslips_status_check;
alter table public.payslips
  add constraint payslips_status_check
  check (status in ('draft', 'final', 'void'));

-- Dönem başına tek aktif bordro (void olanlar hariç)
alter table public.payslips
  drop constraint if exists unique_payslip_per_period;
create unique index if not exists unique_active_payslip_per_period
  on public.payslips (employee_id, period_month, period_year)
  where status <> 'void';

create or replace function public.protect_issued_payslips()
returns trigger
language plpgsql
as $$
declare
  mutable_on_void constant text[] :=
    array['status', 'voided_at', 'void_reason', 'updated_at'];
  mutable_on_backfill constant text[] :=
    array['snapshot', 'content_hash'];
begin
  if coalesce(current_setting('app.allow_payslip_purge', true), '') = 'on' then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.status <> 'draft' then
      raise exception 'Payslips must be created as drafts and then issued'
        using errcode = 'P0001';
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    if old.status <> 'draft' then
      raise exception 'Issued payslip % cannot be deleted', old.id
        using errcode = 'P0001';
    end if;
    return old;
  end if;

  -- UPDATE
  if old.status = 'void' then
    raise exception 'Voided payslip % is read-only', old.id
      using errcode = 'P0001';
  end if;

  if old.status = 'final' then
    -- final → void: yalnızca void alanları değişebilir, gerekçe zorunlu
    if new.status = 'void'
       and new.voided_at is not null
       and length(btrim(coalesce(new.void_reason, ''))) > 0
       and (to_jsonb(new) - mutable_on_void) = (to_jsonb(old) - mutable_on_void)
    then
      return new;
    end if;

    -- Eski (snapshot'sız) yayınlanmış bordroları bir kez dondurma
    if old.snapshot is null
       and new.snapshot is not null
       and new.content_hash is not null
       and (to_jsonb(new) - mutable_on_backfill) = (to_jsonb(old) - mutable_on_backfill)
    then
      return new;
    end if;

    raise exception 'Issued payslip % is immutable', old.id
      using errcode = 'P0001';
  end if;

  -- old.status = 'draft'
  if new.status = 'void' then
    raise exception 'Drafts are deleted, not voided' using errcode = 'P0001';
  end if;
  if new.status = 'final'
     and (new.snapshot is null or new.content_hash is null or new.finalized_at is null)
  then
    raise exception 'Issuing payslip % requires snapshot, content_hash and finalized_at', old.id
      using errcode = 'P0001';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_issued_payslips on public.payslips;
create trigger protect_issued_payslips
  before insert or update or delete on public.payslips
  for each row execute function public.protect_issued_payslips();

-- Token ile herkese açık okuma: yayınlanmış ve void bordrolar (void uyarısı
-- doğrulama sayfasında gösterilir), taslaklar asla
drop policy if exists "Anyone can view payslip with valid token" on public.payslips;
create policy "Anyone can view payslip with valid token" on public.payslips
  for select using (access_token is not null and status in ('final', 'void'));
