# SEO Denetimi + Monetizasyon Haritası — Malta Calculator

> **Tarih:** 2026-06-22 · **Tür:** Salt okunur analiz (kod değiştirilmedi)
> **Kapsam:** 31 aktif hesaplayıcı + 44 blog/rehber + salary/net-to-gross
> **Amaç:** Affiliate + sınırlı AdSense yerleşimini doğru sayfalara konumlandırmak (bkz. [MONETIZATION_PLAN.md](./MONETIZATION_PLAN.md))

---

## A. Genel durum

SEO temeli **sağlam**: tüm hesaplayıcılarda canonical, BreadcrumbJsonLd, CalculatorJsonLd, 5'erli FAQ JSON-LD, `force-static`/`revalidate=false` mevcut; sitemap tüm aktif hesaplayıcıları kapsıyor. Düzeltmeler iyileştirme niteliğinde, kırık bir şey yok.

---

## B. Önceliklendirilmiş SEO bulguları

### 🔴 Yüksek

1. **11 sayfada description < 150 karakter** (zayıf içerik sinyali). Sayfalar: stamp-duty, vacation, overtime, notice-period, retirement-age, road-license, vrt, drivers-license, import-vehicle, calculators index, (vehicle-registration-tax sınırda ~151).
2. **`/salary` çelişkisi:** sitemap'te priority 0.9 ile var ama sayfa `robots: { index:false }`. Sitemap'ten çıkarılmalı (canonical zaten ana sayfaya işaret ediyor — bu doğru).
3. **Hesaplayıcılar arası iç bağlantı (related calculators) sıfır.** Sadece her sayfada tek bir `RelatedGuide` (blog'a) var. Hem SEO link-equity hem dönüşüm için kayıp. Örnek eksik bağlar: stamp-duty↔property-transfer-tax↔first-time-buyer; mortgage↔stamp-duty; self-employed-tax↔self-employed-ssc; rental-tax↔property-transfer-tax; maternity↔sick-leave↔in-work-benefit.

### 🟡 Orta

4. **Title > 60 karakter:** vrt (64), children-allowance (62), family-reunification (62), ana sayfa (61).
5. **vehicle-registration-fee:** `RelatedGuide` yok + CalculatorJsonLd description çok kısa.
6. **Sitemap lastModified yanlış:** vehicle-registration-fee ve vrt hâlâ `2026-02-04` görünüyor (sonradan aktive edildiler).

### 🟢 Düşük

7. salary ve net-to-gross manuel `SoftwareApplication` schema kullanıyor — CalculatorJsonLd ile standartlaştırılabilir (işlevsel sorun değil).
8. Çok kısa title'lara "Malta 2026" eklenebilir: mortgage (38), overtime (38), savings-interest (46), vacation/notice-period (43).

> **Not:** İç bağlantı (#3) düzeltmesi aynı zamanda monetizasyonu da güçlendirir — "related calculators" widget'ı, affiliate kartının doğal komşusu.

---

## C. Monetizasyon sayfa haritası

### Dikey dağılımı (76 sayfa)

| Dikey                           | Sayfa sayısı | Ana fırsat                                    |
| ------------------------------- | ------------ | --------------------------------------------- |
| **TAX / RELOCATION** (en güçlü) | 22           | Tax/relocation danışmanı lead, HQP, expat tax |
| **BANK RATE COMPARISON**        | 16           | Mortgage broker, oran kıyaslama, mevduat      |
| **BROKER / INVESTMENT**         | 10           | eToro/XTB, pension/PRS                        |
| **WISE**                        | 10           | Money transfer, expat, salary, multi-currency |
| **REVOLUT**                     | 6            | Neobank, günlük bankacılık, araç finansman    |
| **NONE (nötr)**                 | 12           | İstihdam hukuku/idari — affiliate uymaz       |

### En değerli ilk sayfalar (yüksek niyet × çoklu dikey uyumu)

| Sıra | Sayfa                                                           | Dikey(ler)                   | Yerleşecek offer                                    |
| ---- | --------------------------------------------------------------- | ---------------------------- | --------------------------------------------------- |
| 1    | `/` (ana sayfa, salary)                                         | WISE                         | **Affiliate only** — AdSense YOK (ana sayfa kuralı) |
| 2    | `/calculators/mortgage`                                         | Bank rate + Revolut          | Banka oran kıyaslama linki + (ileride) broker lead  |
| 3    | `/calculators/expatriate-tax` (HQP)                             | Tax/reloc + Wise             | Wise + tax danışmanı lead                           |
| 4    | `/calculators/bank-interest-tax`                                | Bank rate + tax + broker     | Banka oran + broker                                 |
| 5    | `/calculators/savings-interest`                                 | Broker + bank rate + Revolut | eToro/XTB + savings oran                            |
| 6    | `/calculators/self-employed-tax`                                | Tax/reloc                    | Tax danışmanı / muhasebe                            |
| 7    | `/calculators/rental-tax`                                       | Tax + bank rate              | Tax danışmanı                                       |
| 8    | `/calculators/first-time-buyer`                                 | Bank rate                    | Mortgage oran + broker lead                         |
| 9    | `/calculators/pension`                                          | Broker/investment            | eToro/XTB / PRS                                     |
| 10   | `/calculators/property-transfer-tax`, `/calculators/stamp-duty` | Bank rate + tax              | Banka oran + tax                                    |

> Blog tarafında en değerli eşler: malta-mortgage-guide, malta-bank-interest-tax-guide, malta-expat-tax-hqp-scheme, malta-savings-interest-guide, malta-rental-income-tax-15-percent (hepsi karşılık gelen hesaplayıcıya ve offer'a bağlanmalı).

### AdSense slotu nereye? (Kanal C kuralı)

Yalnızca yeni kurulacak **niş "para" sayfaları**: `/calculators/malta-savings-rates` ve `/calculators/malta-mortgage-rates` (banka oran kıyaslama). Mevcut hesaplayıcılara, ana sayfaya, bloglara AdSense YOK.

---

## D. Önerilen iş sırası (denetim sonucu)

1. **Affiliate altyapısı (Faz 1):** `affiliate-offers.ts` + `<AffiliateCard>` + tıklama takibi. İlk yerleşim: Wise → ana sayfa + expatriate-tax; eToro/XTB → savings-interest + pension; Revolut → mortgage + vehicle-finance. (Hesaplar onaylanınca `active:true`.)
2. **Banka oran kıyaslama (Faz 2):** savings + mortgage sayfaları (ikisi birden), ECB MIR API + manuel `bank_products`. AdSense slotu burada.
3. **SEO düzeltmeleri (paralel, hızlı kazanç):** description'ları 150+'a çıkar, 4 uzun title'ı kısalt, `/salary`'yi sitemap'ten çıkar, "Related Calculators" widget'ı ekle (hem SEO hem affiliate komşuluğu).

---

## E. Ham veri kaynağı

Bu rapor iki paralel salt-okunur ajan taramasının sentezidir: (1) sayfa envanteri + dikey eşleştirme, (2) metadata/JSON-LD/sitemap/intent denetimi. Detaylı per-sayfa karakter sayıları gerektiğinde tekrar üretilebilir.
