# SEO Check Workflow

Bir sayfanın SEO optimizasyonunu kontrol etmek için bu workflow'u takip et.

## Kullanıcıdan alınacak bilgiler:

- Kontrol edilecek sayfa yolu (örn: `/calculators/mortgage`)

## Kontrol Adımları

### 1. Metadata Kontrolü

Sayfa dosyasında (`page.tsx`) şunları kontrol et:

```typescript
export const metadata: Metadata = {
    ...defaultMetadata,
    title: "...",        // < 60 karakter
    description: "...",  // 150-160 karakter
    keywords: [...],     // 5-10 ilgili kelime
    alternates: {
        canonical: `${SITE_URL}/...`,  // Doğru URL
    },
    openGraph: {
        ...ogMetadata,
        title: "...",
        url: `${SITE_URL}/...`,
    },
    twitter: {
        ...twitterMetadata,
        title: "...",
    },
};
```

### 2. JSON-LD Kontrolü

Sayfada şu bileşenlerin varlığını kontrol et:

| Sayfa Tipi    | Gerekli JSON-LD                                           |
| ------------- | --------------------------------------------------------- |
| Hesaplayıcı   | `BreadcrumbJsonLd`, `CalculatorJsonLd`, `CustomFAQJsonLd` |
| Blog          | `BreadcrumbJsonLd`, `ArticleJsonLd`                       |
| Liste Sayfası | `BreadcrumbJsonLd`, `CollectionPageJsonLd`                |
| Diğer         | `BreadcrumbJsonLd` (minimum)                              |

### 3. İçerik Kontrolü

**Başlıklar:**

- [ ] Tek H1 var mı?
- [ ] H1, title ile tutarlı mı?
- [ ] H2-H6 hiyerarşik mi?

**Linkler:**

- [ ] Internal linkler var mı? (ilgili hesaplayıcılar, bloglar)
- [ ] External linkler `rel="noopener noreferrer"` içeriyor mu?

**Görseller:**

- [ ] Alt text var mı?
- [ ] Next.js Image component kullanılıyor mu?

### 4. Sitemap Kontrolü

`src/app/sitemap.ts` dosyasında sayfa mevcut mu?

### 5. Statik Ayarlar Kontrolü

Dosya sonunda şunlar var mı?

```typescript
export const revalidate = false;
export const dynamic = "force-static";
```

## SEO Raporu Şablonu

```
## SEO Report: [Sayfa Adı]

### Metadata
- Title: [✓/✗] [Karakter sayısı]/60
- Description: [✓/✗] [Karakter sayısı]/160
- Keywords: [✓/✗] [Adet] keywords
- Canonical: [✓/✗]
- OpenGraph: [✓/✗]
- Twitter: [✓/✗]

### JSON-LD
- BreadcrumbJsonLd: [✓/✗]
- CalculatorJsonLd: [✓/✗/N/A]
- ArticleJsonLd: [✓/✗/N/A]
- CustomFAQJsonLd: [✓/✗]

### Content
- H1: [✓/✗]
- Heading Hierarchy: [✓/✗]
- Internal Links: [✓/✗]
- External Links: [✓/✗]

### Technical
- Sitemap: [✓/✗]
- Static Export: [✓/✗]

### Recommendations
1. [Öneri 1]
2. [Öneri 2]
```

## Yaygın SEO Sorunları

### Title çok uzun

**Sorun**: Title > 60 karakter
**Çözüm**: Kısalt, en önemli kelimeleri başa al

### Description eksik veya kısa

**Sorun**: Description < 150 veya > 160 karakter
**Çözüm**: 150-160 karakter arasında, call-to-action içeren açıklama yaz

### Canonical URL yanlış

**Sorun**: URL trailing slash veya www tutarsızlığı
**Çözüm**: `SITE_URL` sabitini kullan, tutarlı format

### JSON-LD eksik

**Sorun**: Structured data yok
**Çözüm**: İlgili JSON-LD bileşenlerini ekle

### FAQ eksik

**Sorun**: CustomFAQJsonLd yok
**Çözüm**: 3-5 ilgili soru/cevap ekle (Google rich results için)

## Referans Kaynaklar

- Google Search Central: https://developers.google.com/search/docs
- Schema.org: https://schema.org
- Rich Results Test: https://search.google.com/test/rich-results
