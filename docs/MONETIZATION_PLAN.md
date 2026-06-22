# Malta Calculator — Gelir / Monetizasyon Planı

> **Durum:** Plan aşaması — henüz uygulamaya başlanmadı.
> **Son güncelleme:** 2026-06-22
> **Sahip:** Atakan
> **İlke:** Temiz, güvenilir, doğru bilgi. Reklam çöplüğü YOK. Gelir = affiliate + lead-gen.

---

## 0. Felsefe ve Sınırlar

Bu site bir **finansal hesaplama ve doğru bilgi platformu**. Gelir bunu desteklemeli, gölgelememeli.

**YAPACAKLARIMIZ**

- Bağlama (context) oturan, az sayıda, kaliteli affiliate yerleşimi.
- Her hesaplayıcının doğal "bir sonraki adımı" olan servisleri önermek.
- Yüksek bilet değerli lead-gen (mortgage broker, relocation/tax danışmanı).
- Tam şeffaflık: `rel="sponsored"`, açık disclosure, "indikatif — sağlayıcıdan teyit alın".

**YAPMAYACAKLARIMIZ**

- **Ana sayfa, genel hesaplayıcı ve içerik sayfalarına display reklam koymak.** AdSense yalnızca "gelir umulan" niş sayfalarda (banka/oran kıyaslama gibi) ve küçük, rahatsız etmeyen tek bir slotta olacak (bkz. Kanal C).
- iGaming / bahis affiliate'i (Malta'nın en kârlı dikeyi olsa da markayı kirletir → kesin HAYIR).
- Pop-up, interstitial, otomatik yönlendirme, agresif/büyük banner, sticky reklam.
- Yanlış/eski faiz oranı göstermek. Her oran kaynaklı ve tarihli olacak.

**Başarı kriteri:** Bir kullanıcı siteden ayrılırken "bu site bana satış yapmaya çalıştı" değil, "bu site bana doğru bilgiyi verdi ve faydalı bir sonraki adımı önerdi" demeli.

---

## 1. Gelir Kanalları (öncelik sırasıyla)

### Kanal A — Contextual Affiliate (ana motor)

| Servis                                             | Ödeme                     | Cookie      | Doğal eşleştiği yer                   | Öncelik |
| -------------------------------------------------- | ------------------------- | ----------- | ------------------------------------- | ------- |
| **Wise** (Partnerize)                              | £10–50 CPA                | **365 gün** | Salary, expat, cost-of-living, döviz  | 🟢 P0   |
| **Revolut**                                        | Satış başına £500'e kadar | 14 gün      | Neobank, günlük bankacılık            | 🟢 P1   |
| **eToro / XTB / Trading212 / Interactive Brokers** | $100–250 CPA              | 60 gün      | Compound interest, yatırım, emeklilik | 🟢 P1   |
| **MeDirect** (Malta, doğrudan anlaşma)             | Görüşülecek               | —           | Savings / deposit / bank interest     | 🟡 P1   |

> **Wise = açık ara en iyi başlangıç.** 365 günlük cookie sektör rekoru, marka tertemiz, kitleye birebir uyuyor.

### Kanal B — Yüksek Bilet Lead-Gen (Malta'ya özgü, en yüksek getiri/işlem)

| Partner tipi                              | Model                           | Eşleştiği içerik             | Öncelik |
| ----------------------------------------- | ------------------------------- | ---------------------------- | ------- |
| Malta **mortgage broker**                 | CPL (form → broker)             | Mortgage, first-time buyer   | 🟡 P2   |
| **Tax / relocation danışmanı**            | Introducer fee (manuel anlaşma) | 15% rejim, expat tax, salary | 🟡 P2   |
| **Residency / golden visa** lisanslı ajan | Introducer fee (yüksek)         | Residency/relocation içeriği | 🔵 P3   |

> Malta küçük → hacim düşük ama **işlem başına değer çok yüksek**. Tek bir relocation lead'i yüzlerce affiliate tıklamasına bedel. Bunlar manuel iş anlaşması gerektirir (otomatik ağ yok).

### Kanal C — Display / AdSense (yalnızca niş "para" sayfalarında, küçük ve sınırlı)

**Bu, başlangıçta uygulanacak ilk display yaklaşımıdır** — geniş değil, hedefli.

**Nerede OLACAK:**

- Yalnızca gelir umulan niş sayfalar: banka oran kıyaslama (`/malta-savings-rates`, `/malta-mortgage-rates`) ve benzeri finansal-niyetli sayfalar.
- Sayfa başına **tek**, küçük, içerik akışını bölmeyen bir slot (örn. sonuç tablosunun altında responsive bir birim).

**Nerede OLMAYACAK:**

- ❌ Ana sayfa.
- ❌ Genel hesaplayıcılar ve blog/rehber içerik sayfaları.
- ❌ Büyük, sticky, pop-up, in-content veya itici hiçbir format.

**Kurallar:**

- Aynı sayfada affiliate kartı varsa, display reklam onunla yarışmamalı — affiliate önce, display en altta/kenarda küçük.
- "Temizlik metriği" bozulursa (bounce/time-on-page) slot kaldırılır.
- Trafik oturduğunda AdSense yerine **Ezoic** değerlendirilebilir (geo şartı yok, finans RPM $5–15) — yine aynı "yalnızca niş sayfa, küçük slot" kuralıyla.
- Raptive muhtemelen uygun değil (trafik Malta-ağırlıklı, %50 US/UK şartı).

### Kanal D — İleride: Premium / B2B

- Mevcut **B2B payroll/Stripe** sistemi zaten var (bu planın kapsamı dışı, ama gelir portföyünün parçası).
- İleride: reklamsız "pro" hesaplayıcı paketi, indirilebilir raporlar.

---

## 2. Teknik Mimari

### 2.1 Veri-odaklı offer katmanı

Tek bir merkezi config + (gerekirse) Supabase tablosu. Hardcode link DAĞITMA.

```
src/config/affiliate-offers.ts     # Offer tanımları (slug, başlık, açıklama, URL, payout tipi, kategori, disclosure)
src/config/calculator-offer-map.ts # Hangi hesaplayıcı → hangi offer(lar)
```

Her offer kaydı:

- `id`, `provider`, `category` (banking | transfer | investment | advisory | mortgage)
- `affiliateUrl` (tracking parametreli), `displayUrl`
- `headline`, `subtext`, `cta`
- `disclosure` (zorunlu metin)
- `active` (bool — anlaşma yoksa kapalı), `rel: "sponsored nofollow"`
- `regions` (örn. sadece EU/Malta'da göster)

### 2.2 Tekrar kullanılabilir bileşenler

```
src/components/affiliate/affiliate-card.tsx     # Tek, temiz, contextual kart
src/components/affiliate/affiliate-disclosure.tsx # "Bu bir sponsorlu bağlantıdır" satırı
src/components/affiliate/rate-comparison-table.tsx # Banka-banka oran tablosu
```

- Tasarım dili mevcut UI'ye uymalı (glass, `from-primary/5 ...`, Radix, `cn()`).
- Outbound link: `rel="sponsored noopener"`, `target="_blank"`, tıklama event'i (analytics).
- Her kartta görünür disclosure + "indikatif" uyarısı.

### 2.3 Tıklama / dönüşüm takibi

- Outbound tıklamaları analytics event'i olarak logla (hangi offer, hangi sayfa).
- UTM/subID ile hangi hesaplayıcıdan dönüşüm geldiğini ölç.
- Basit bir `/go/[offer]` redirect route'u opsiyonel (link yönetimini merkezileştirir, cloak DEĞİL — şeffaf).

### 2.4 Banka Oranları Kıyaslama Özelliği

**Veri kaynağı stratejisi (2 katman):**

1. **Resmî agrega (otomatik):** ECB Data Portal MIR (SDMX REST API) + Central Bank of Malta → "Malta ortalama konut/mevduat faizi" grafiği. Ücretsiz, yasal, API'li.
2. **Banka-banka ürün oranları (manuel/CMS):** `bank_products` config/Supabase tablosu. ~6 retail banka olduğu için elle yönetilebilir. Her satırda: banka, ürün, oran, APR, koşul, **kaynak URL, last_updated**.

**Sayfalar:**

- `/calculators/malta-mortgage-rates` — banka-banka konut kredisi kıyaslama
- `/calculators/malta-savings-rates` — mevduat/deposit kıyaslama (MeDirect affiliate için ideal)
- Mevcut hesaplayıcılarla bağ: oranı seç → taksidi hesapla.

**Veri doğruluğu kuralı:** Hiçbir oran kaynaksız/tarihsiz yayınlanmaz. "Son güncelleme: X · Kaynak: [banka]" zorunlu. Stale veri riskini azaltmak için güncelleme takvimi (çeyreklik).

---

## 3. Contextual Eşleştirme Haritası

Temizliğin sırrı: rastgele banner değil, her hesaplayıcının doğal sonraki adımı.

| Hesaplayıcı / İçerik                     | Birincil offer             | İkincil                        |
| ---------------------------------------- | -------------------------- | ------------------------------ |
| Salary / income tax / 15% rejim          | Wise                       | Tax advisory lead              |
| Savings / deposit / bank interest        | MeDirect / banka kıyaslama | Neobank                        |
| Mortgage / first-time buyer              | Mortgage broker lead       | Banka kıyaslama                |
| Compound interest / investment / pension | eToro / XTB / IBKR         | —                              |
| Expat / cost of living / relocation      | Wise                       | Relocation/residency danışmanı |
| Currency / money transfer                | Wise                       | Revolut                        |

**Yerleşim kuralı:** Sayfa başına **en fazla 1 birincil + 1 ikincil** offer. Sonuç bloğunun ALTINDA (hesap önce, öneri sonra). Asla hesaplama akışının ortasında değil.

---

## 4. Hukuki / Uyumluluk

- **Affiliate disclosure:** Her sponsorlu kartta görünür metin + `rel="sponsored"`.
- **Finansal doğruluk (AB):** Oranlarda APR/REER, "temsili örnek", "indikatif — banka teyit etmeli" uyarısı.
- **Sorumluluk reddi:** "Finansal tavsiye değildir" satırı ilgili sayfalarda.
- **GDPR / çerez:** Affiliate tracking çerezleri için consent banner kontrolü (mevcut durum gözden geçirilecek).
- **Vergi:** Affiliate geliri için fatura/muhasebe süreci (Malta şirketi üzerinden).

---

## 5. Fazlı Yol Haritası

### Faz 0 — Hesap açılışları (kod yok, paralel yürür) — ONAYLANDI

- [ ] Wise Partnerize başvurusu (P0)
- [ ] eToro / XTB partner başvurusu (P1)
- [ ] Revolut affiliate başvurusu (P1)
- [ ] ~~MeDirect doğrudan anlaşma~~ — şimdilik ertelendi (ileride değerlendirilecek)
- [ ] (P2) 1-2 Malta mortgage broker + 1 tax/relocation danışmanı ile görüşme

### Faz 1 — Affiliate altyapısı (kod)

- [ ] `affiliate-offers.ts` + `calculator-offer-map.ts` config
- [ ] `<AffiliateCard>` + `<AffiliateDisclosure>` bileşenleri (mevcut UI diline uygun)
- [ ] Outbound tıklama analytics event'i
- [ ] İlk yerleşim: Wise → salary/expat hesaplayıcıları (sadece onaylı offer'lar `active: true`)

### Faz 2 — Banka oranları kıyaslama

- [ ] `bank_products` veri modeli + seed (gerçek, kaynaklı oranlarla)
- [ ] ECB MIR API util'i (piyasa ortalaması grafiği)
- [ ] `/malta-savings-rates` ve `/malta-mortgage-rates` sayfaları (SEO + JSON-LD)
- [ ] MeDirect affiliate entegrasyonu (anlaşma gelince)

### Faz 3 — Yüksek bilet lead-gen

- [ ] Mortgage broker / tax danışmanı CPL form + lead yönlendirme
- [ ] Residency/relocation içerik + lisanslı ajan introducer

### Faz 4 — Ölçüm & optimizasyon

- [ ] Offer bazlı dönüşüm raporu
- [ ] Düşük performanslı yerleşimleri kaldır, iyi olanları genişlet
- [ ] (Opsiyonel) Ezoic değerlendirmesi — yalnızca temizlikten ödün vermeden

---

## 6. KPI / Ölçüm

- Outbound tıklama oranı (hesaplayıcı bazında)
- Affiliate dönüşüm / komisyon (offer bazında)
- Lead-gen: gönderilen lead / kapanan iş
- **Temizlik metriği:** sayfa başına offer sayısı ≤ 2, bounce rate ve "time on page" bozulmamalı

---

## 7. Kararlar (Atakan onayladı — 2026-06-22)

1. **Başlangıç adımı → SEO denetimi.** Önce mevcut sayfaları tarayıp trafik/niyet haritası çıkar; affiliate ve AdSense yerleşimini ona göre yap. ✅
2. **Açılacak affiliate hesapları → Wise (Partnerize), eToro/XTB, Revolut.** MeDirect şimdilik kapsam dışı (ileride doğrudan anlaşma değerlendirilebilir). ✅
3. **Banka oran kıyaslama → savings + mortgage, ikisi birden.** Tek seferde tam kapsam. ✅
4. **Display/AdSense → yalnızca niş "para" sayfalarında** (banka/oran kıyaslama), ana sayfada değil, küçük ve rahatsız etmeyen tek slot. İlk display yaklaşımı budur. ✅ (bkz. Kanal C)

---

## Referanslar (araştırma kaynakları)

- Wise Affiliate (Partnerize): https://wise.com/gb/affiliate-program/ — £10–50 CPA, 365 gün cookie
- Revolut Affiliate: https://www.revolut.com/en-US/become-a-revolut-affiliate/
- eToro Affiliate: https://wecantrack.com/programs/etoro-affiliate-program/ — $250'e kadar CPA
- ECB MIR (Malta faiz verisi, API): https://data.ecb.europa.eu/data/datasets/MIR
- Central Bank of Malta faiz: https://www.centralbankmalta.org/interest-rates-and-key-financial-market-rates
- MeDirect mevduat oranları: https://www.medirect.com.mt/save/fixed-term-deposit/
- Display ağ karşılaştırması: https://eastondev.com/blog/en/posts/media/20260110-adsense-alternatives-comparison/
