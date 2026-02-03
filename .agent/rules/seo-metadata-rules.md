# Malta Calculator - SEO & Metadata Kuralları

Bu dosya, Malta Calculator projesindeki SEO optimizasyonu ve metadata standartlarını tanımlar.

---

## Temel SEO Yapısı

### 1. Shared Metadata Kullanımı

Her sayfa `src/app/shared-metadata.ts` dosyasındaki sabitleri kullanmalıdır:

```typescript
import {
    defaultMetadata,
    ogMetadata,
    twitterMetadata,
    SITE_URL,
    SITE_NAME,
} from "@/app/shared-metadata";
```

### 2. Sayfa Metadata Yapısı

```typescript
export const metadata: Metadata = {
    ...defaultMetadata,
    title: "[Sayfa Başlığı] | Malta Calculator",
    description: "[150-160 karakter açıklama]",
    keywords: ["keyword1", "keyword2", "keyword3", ...],
    alternates: {
        canonical: `${SITE_URL}/[path]`,
    },
    openGraph: {
        ...ogMetadata,
        title: "[OG Başlığı]",
        url: `${SITE_URL}/[path]`,
        type: "website", // veya "article" blog için
    },
    twitter: {
        ...twitterMetadata,
        title: "[Twitter Başlığı]",
    },
};
```

---

## JSON-LD Structured Data

### 3. Kullanılabilir JSON-LD Bileşenleri

Tüm JSON-LD bileşenleri `src/components/json-ld.tsx` dosyasındadır:

| Bileşen | Kullanım Alanı |
|---------|----------------|
| `ArticleJsonLd` | Blog yazıları |
| `BreadcrumbJsonLd` | Tüm sayfalar (navigasyon) |
| `CalculatorJsonLd` | Hesaplayıcı sayfaları |
| `CustomFAQJsonLd` | FAQ içeren sayfalar |
| `CollectionPageJsonLd` | Liste sayfaları (/calculators, /blog) |
| `WebApplicationJsonLd` | Ana sayfa |
| `OrganizationJsonLd` | Hakkımızda sayfası |
| `WebsiteJsonLd` | Ana layout |

### 4. BreadcrumbJsonLd (Her Sayfada Zorunlu)

```tsx
<BreadcrumbJsonLd
    items={[
        { name: "Home", url: SITE_URL },
        { name: "Calculators", url: `${SITE_URL}/calculators` },
        { name: "[Calculator Name]", url: `${SITE_URL}/calculators/[slug]` },
    ]}
/>
```

### 5. CalculatorJsonLd (Hesaplayıcılar İçin)

```tsx
<CalculatorJsonLd
    name="[Calculator Name] Malta"
    description="[Açıklama]"
    slug="[slug]"
    category="[Kategori] Calculator"
    features={[
        "Feature 1",
        "Feature 2",
        "Feature 3",
    ]}
/>
```

### 6. ArticleJsonLd (Blog Yazıları İçin)

```tsx
<ArticleJsonLd
    title="[Başlık]"
    description="[Açıklama]"
    slug="[slug]"
    datePublished="YYYY-MM-DD"
    dateModified="YYYY-MM-DD" // opsiyonel
/>
```

### 7. CustomFAQJsonLd (SSS İçin)

```tsx
<CustomFAQJsonLd
    questions={[
        {
            question: "Soru 1?",
            answer: "Cevap 1"
        },
        {
            question: "Soru 2?",
            answer: "Cevap 2"
        },
    ]}
/>
```

---

## SEO Checklist

### 8. Metadata Kontrolleri

- [ ] **Title tag**: < 60 karakter
- [ ] **Meta description**: 150-160 karakter
- [ ] **Keywords**: 5-10 ilgili anahtar kelime
- [ ] **Canonical URL**: Doğru URL ayarlandı
- [ ] **OpenGraph title**: Ayarlandı
- [ ] **OpenGraph URL**: Doğru URL
- [ ] **OpenGraph type**: "website" veya "article"
- [ ] **Twitter card**: summary_large_image

### 9. JSON-LD Kontrolleri

- [ ] **BreadcrumbJsonLd**: Her sayfada var
- [ ] **CalculatorJsonLd**: Hesaplayıcılarda var (3-5 feature)
- [ ] **ArticleJsonLd**: Blog yazılarında var (datePublished zorunlu)
- [ ] **CustomFAQJsonLd**: 3-5 ilgili soru/cevap

### 10. İçerik Kontrolleri

- [ ] **H1**: Sayfa başlığıyla eşleşir (sadece 1 tane)
- [ ] **H2-H6**: Hiyerarşik sıralama
- [ ] **Internal links**: İlgili sayfalara/hesaplayıcılara bağlantı
- [ ] **External links**: Resmi kaynaklara (rel="noopener noreferrer")
- [ ] **Alt text**: Görsellerde açıklama

---

## Sitemap Yönetimi

### 11. Sitemap Güncelleme

Yeni sayfa eklendiğinde `src/app/sitemap.ts` dosyası güncellenmelidir:

```typescript
// Blog sayfası için
{ url: `${baseUrl}/blog/[slug]`, priority: 0.8, changeFrequency: "yearly" as const },

// Aktif hesaplayıcı için (activeCalculators array'ine ekle)
"[calculator-slug]",

// Coming soon hesaplayıcı için (comingSoonCalculators array'ine ekle)
"[calculator-slug]",
```

### 12. Priority Değerleri

| Sayfa Tipi | Priority |
|------------|----------|
| Ana sayfa | 1.0 |
| Salary calculator | 0.9 |
| Calculators index | 0.9 |
| Aktif hesaplayıcılar | 0.8 |
| Blog yazıları | 0.8-0.9 |
| Company sayfaları | 0.3-0.6 |
| Coming soon | 0.5 |

---

## URL Yapısı

### 13. URL Kuralları

```
# Hesaplayıcılar
/calculators                    # Ana liste
/calculators/[slug]             # Hesaplayıcı sayfası

# Blog
/blog                           # Blog ana sayfa
/blog/[slug]                    # Blog yazısı

# Slug formatı
kebab-case-format
malta-[konu]-guide-2026        # Blog slug örneği
[konu]-[detay]                 # Calculator slug örneği
```

### 14. Slug İsimlendirme

- Küçük harf kullan
- Kelimeler tire (-) ile ayrılır
- Türkçe karakter kullanma
- Yıl bilgisi blog yazılarında eklenir (örn: -2026)
- Kısa ve açıklayıcı ol

---

## Performans ve Statik Oluşturma

### 15. Statik Sayfa Ayarları

Her sayfa dosyasının sonuna ekle:

```typescript
export const revalidate = false;          // Tamamen statik (build-time)
export const dynamic = 'force-static';    // Bu segmenti statik olmaya zorla
```

---

## Keyword Stratejisi

### 16. Anahtar Kelime Kategorileri

**Ana Anahtar Kelimeler:**
- Malta salary calculator
- Malta tax calculator
- Malta net salary
- Malta SSC calculator

**Hesaplayıcı Anahtar Kelimeleri:**
- Malta [calculator-name] calculator
- Malta [topic] 2026
- [topic] Malta

**Blog Anahtar Kelimeleri:**
- Malta [topic] guide
- Malta [topic] 2026
- How to [action] in Malta

### 17. Long-tail Anahtar Kelimeler

Her sayfa için 3-5 long-tail anahtar kelime hedefle:
```
"Malta gross to net salary calculator"
"How to calculate tax in Malta 2026"
"Malta SSC contributions for employees"
```

---

## Referanslar

- Google Search Central: https://developers.google.com/search/docs
- Schema.org: https://schema.org
- Open Graph Protocol: https://ogp.me
- Twitter Cards: https://developer.twitter.com/en/docs/twitter-for-websites/cards
