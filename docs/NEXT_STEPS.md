# Monetizasyon — Durum & Sıradaki Adımlar

> Son güncelleme: 2026-06-22 · Detaylı plan: [MONETIZATION_PLAN.md](./MONETIZATION_PLAN.md)
> Başvuru metinleri: [AFFILIATE_APPLICATION.md](./AFFILIATE_APPLICATION.md)

## ✅ Tamamlandı (hepsi main'de, build temiz, tüm sayfalar statik)

- Monetizasyon planı + SEO denetimi (docs)
- SEO hızlı düzeltmeleri: 10 meta description (150–160), 4 uzun title, sitemap (/salary çıkarıldı), vehicle-registration-fee
- `RelatedCalculators` iç-bağlantı widget'ı → 31 hesaplayıcının tamamı + tek kaynak registry (`src/config/calculators.ts`)
- Dormant affiliate altyapısı: `affiliate-offers.ts` (hepsi `active:false`), `calculator-offer-map.ts`, `<AffiliateCard>` → tüm sayfalara + homepage'e bağlı (görünmez)
- Code review + uygulanan fixler
- **Banka oran kıyaslama sayfaları:** `/calculators/malta-mortgage-rates`, `/calculators/malta-savings-rates`
  - Mortgage: HSBC, BNF, APS (oranlı) + BOV, Lombard (On request) — 5 banka
  - Savings: fixed-term pivot (MeDirect, BNF, APS, HSBC) + flexible (MeMax %2.00, Revolut/Wise Variable)
  - ECB piyasa-ortalaması kutusu (statik, kaynaklı: mortgage %2.05 / deposit %2.31, Nis 2026)
  - Dormant `<AdSlot>` (env yoksa hiçbir şey render etmez) — sadece bu niş sayfalarda
- Affiliate başvuru metinleri (description, keywords, profil alanları)

## ⏳ Senin aksiyonunu bekleyen (ben ilerletemem)

- [ ] **Affiliate hesapları:** Wise / eToro / XTB / Revolut başvuruları → onay
- [ ] **Aktivasyon:** onay gelince `src/config/affiliate-offers.ts`'te ilgili offer `active:true` + gerçek tracking `href` (tek dosya)
- [ ] **AdSense:** hesap onayı → `.env`'e `NEXT_PUBLIC_ADSENSE_CLIENT` + `NEXT_PUBLIC_ADSENSE_SLOT_RATES`
- [ ] **BOV / Lombard oranları:** telefon/e-posta teyidiyle "On request" → gerçek sayı
- [ ] **Lead-gen anlaşmaları (yüksek bilet):** 1–2 Malta mortgage broker + 1 tax/relocation danışmanı

## 🔧 Ben yapabilirim (söylediğinde)

- [x] **Media kit** — [docs/media-kit.html](./media-kit.html) (tarayıcıda aç → PDF kaydet, stat placeholder'larını doldur)
- [ ] **Faz 3 lead-gen formları:** mortgage broker / tax danışmanı için form + yönlendirme
- [ ] **Canlı ECB MIR entegrasyonu** (build-time fetch + try/catch fallback) — şimdilik statik sabit kullanıyoruz (build güvenliği için)
- [ ] **Tabloları zenginleştir:** doğrulandıkça daha çok banka/ürün (kişisel kredi, green home loan vb.)
- [x] **Blog → oran sayfası iç bağlantıları** — mortgage, expat-mortgage, savings guide'lara eklendi (bank-interest & first-time-buyer templated CTA kullanıyor; transitif link var, atlandı)
- [x] **Kısa title'lara "Malta 2026"** — mortgage, savings-interest, overtime, vacation, notice-period
- [x] **`/salary` dormant Wise slotu** — homepage ile tutarlı
- [ ] **(Atlandı, gerekçeli)** salary/net-to-gross `SoftwareApplication`→`CalculatorJsonLd`: mevcut şema geçerli/çalışıyor, değer düşük
