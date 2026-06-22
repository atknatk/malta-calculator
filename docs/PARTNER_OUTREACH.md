# Partner Outreach — Lead-Gen (Kanal B)

> Amaç: Malta'da bir **mortgage broker** ve/veya **tax / relocation danışmanı**
> ile lead-gen (CPL/introducer) anlaşması yapmak. Anlaşma + gizlilik gözden
> geçirmesi sonrası `NEXT_PUBLIC_LEADGEN_ENABLED=true` ile form açılır
> (altyapı hazır — bkz. [MONETIZATION_PLAN.md](./MONETIZATION_PLAN.md) Kanal B).

## Konuşma noktaları (her iki taraf için)

- maltacalculator.com: Malta'ya özel ücretsiz finansal hesaplayıcılar + rehberler.
- Aylık ~2.000 kullanıcı / ~2.500 oturum, **yüksek niyetli** kitle: maaş, vergi,
  mortgage, mevduat hesaplayan; Malta'ya taşınan; hesap açan kişiler.
- Mortgage / first-time-buyer / expat-tax / oran-kıyaslama sayfalarında
  doğrudan satın-alma niyeti anında lead yakalama.
- Temiz, şeffaf yerleşim — spam yok, açık disclosure. Marka güveni korunur.
- Lead formu hazır; yalnızca senin onayınla canlıya alınır.

## Model (öner)

- **CPL** (lead başına ücret) veya **CPA** (kapanan iş başına). Nitelikli lead
  tanımı + ücret üzerinde anlaş. Aylık fatura.
- Pilot: ilk ay düşük hacimle dene, dönüşümü ölç, sonra ölçekle.

---

## E-posta 1 — Mortgage broker

**Konu:** Qualified Malta mortgage leads from maltacalculator.com

Hi [Name],

I run maltacalculator.com, Malta's free financial-calculator and guide
platform. Each month around 2,000 people use our mortgage, first-time-buyer
and bank rate-comparison pages — most are actively planning a property
purchase in Malta.

I'd like to refer these high-intent users to a trusted local mortgage broker.
On the relevant pages I can show a clean, optional "request a callback" form
(clear consent, no spam) and pass you the leads.

Would you be open to a simple cost-per-lead or cost-per-completed-case
arrangement? Happy to start with a small pilot so you can judge lead quality
before we scale.

Best,
Atakan Atik · maltacalculator.com · atknatk@gmail.com

---

## E-posta 2 — Tax / relocation / residency danışmanı

**Konu:** Referral partnership — expats relocating to Malta

Hi [Name],

maltacalculator.com helps residents and expats understand Malta tax, salary
and relocation. Many of our visitors are moving to Malta or optimising their
tax position (15% schemes, expat/HQP, rental and bank-interest tax) — exactly
the people who need professional advice.

I'd like to refer these qualified enquiries to a reputable Malta tax/relocation
advisor via a clean, consent-based contact form on the relevant pages.

Could we set up a referral (introducer-fee or cost-per-lead) arrangement? I'm
happy to run a small pilot first so you can assess lead quality.

Best,
Atakan Atik · maltacalculator.com · atknatk@gmail.com

---

## Anlaşma sonrası teknik adımlar (özet)

1. `leads` tablosunu oluştur: `docs/migrations/002_leads.sql` (Supabase).
2. `.env`: `SUPABASE_SERVICE_ROLE_KEY` (varsa) + `NEXT_PUBLIC_LEADGEN_ENABLED=true`.
3. Gizlilik metnini gözden geçir (lead verisinin partnere iletildiğini belirt).
4. Lead yönlendirme: şimdilik Supabase'te birikir; partnere e-posta/CSV ya da
   webhook ile iletme eklenebilir (söyle, yaparım).
