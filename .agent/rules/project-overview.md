# Malta Calculator - Project Overview

Bu dosya, Malta Calculator projesinin genel yapısını ve AI asistanın bilmesi gereken temel bilgileri içerir.

---

## Proje Hakkında

**Malta Calculator**, Malta'da yaşayan ve çalışan kişiler için kapsamlı bir finansal hesaplama platformudur.

### Ana Özellikler

1. **Halka Açık Hesaplayıcılar** - Ücretsiz finansal araçlar
2. **B2B Bordro Sistemi** - Şirketler için ücretli abonelik
3. **Blog/Rehberler** - SEO odaklı içerik

---

## Teknoloji Stack'i

| Kategori | Teknoloji |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Dil | TypeScript (strict) |
| UI | React 18, Tailwind CSS, Radix UI |
| Animasyon | Framer Motion, GSAP |
| Backend | Supabase (PostgreSQL) |
| Auth | Clerk |
| Ödeme | Stripe |
| Form | React Hook Form + Zod |
| Hosting | Vercel |

---

## Dosya Yapısı Özeti

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API'ler
│   ├── blog/              # 30+ blog yazısı
│   ├── calculators/       # 14+ aktif hesaplayıcı
│   ├── dashboard/         # Şirket paneli (auth)
│   ├── employees/         # Çalışan yönetimi (auth)
│   ├── payslip/           # Bordro yönetimi (auth)
│   └── salary/            # Ana maaş hesaplayıcı
├── components/            # Paylaşılan bileşenler
├── config/               # Vergi/SSC yapılandırmaları
├── utils/                # Hesaplama fonksiyonları
└── types/                # TypeScript tipleri
```

---

## Önemli Dosyalar

### Yapılandırma Dosyaları
| Dosya | Açıklama |
|-------|----------|
| `src/config/malta-tax-config.ts` | Vergi dilimleri, SSC oranları, COLA |
| `src/app/shared-metadata.ts` | SEO metadata sabitleri |
| `src/components/json-ld.tsx` | Structured data bileşenleri |
| `src/app/sitemap.ts` | Sitemap yapılandırması |

### Ana Hesaplayıcılar
| Dosya | Açıklama |
|-------|----------|
| `src/utils/salary-calculator.ts` | Maaş hesaplama motoru |
| `src/utils/mortgage-calculator.ts` | Mortgage hesaplama |
| `src/utils/stamp-duty-calculator.ts` | Damga vergisi |
| `src/utils/vacation-calculator.ts` | İzin günleri |

### Layout Bileşenleri
| Bileşen | Kullanım |
|---------|----------|
| `MarketingLayout` | Public sayfalar |
| `Shell` | İçerik wrapper |
| `BackButton` | Geri navigasyon |

---

## Sayfa Türleri

### 1. Hesaplayıcı Sayfası
- Konum: `/src/app/calculators/[slug]/page.tsx`
- Bileşen: `/src/app/calculators/[slug]/_components/[name]-calculator.tsx`
- Utility: `/src/utils/[name]-calculator.ts`

### 2. Blog Sayfası
- Konum: `/src/app/blog/[slug]/page.tsx`
- Liste: `/src/app/blog/page.tsx` (blogPosts array)

### 3. Dashboard Sayfası (Auth Gerekli)
- Konum: `/src/app/dashboard/`, `/src/app/payslip/`, `/src/app/employees/`

---

## Veritabanı Tabloları

| Tablo | Açıklama |
|-------|----------|
| `companies` | Şirket bilgileri, plan tipi |
| `employees` | Çalışan kayıtları |
| `payslips` | Bordro belgeleri |
| `daily_usage` | Günlük kullanım takibi |

---

## Abonelik Planları

| Plan | Aylık Bordro | Özellikler |
|------|--------------|------------|
| Free | 2 | Temel özellikler |
| Basic | 10 | Sınırsız çalışan |
| Pro | 100 | Öncelikli destek |

---

## Malta Vergi Sistemi

### Vergi Kategorileri (2026)
- Single (Bekar)
- Married (Evli) - 0, 1, 2+ çocuk
- Parent (Ebeveyn) - 0, 1, 2+ çocuk

### SSC Kategorileri
- A: Emekli
- B: Part-time
- C: Full-time (standart)
- D: Self-employed

### COLA (Cost of Living Adjustment)
- Üç ayda bir ödenen devlet desteği
- 2026: Q1/Q3 = €121.16, Q2/Q4 = €135.10

---

## Geliştirme Kuralları

### Yeni Hesaplayıcı Eklerken
1. Utility fonksiyonu oluştur: `src/utils/[name]-calculator.ts`
2. Bileşen oluştur: `src/app/calculators/[slug]/_components/`
3. Sayfa oluştur: `src/app/calculators/[slug]/page.tsx`
4. Listeye ekle: `src/app/calculators/page.tsx`
5. Sitemap'e ekle: `src/app/sitemap.ts`

### Yeni Blog Yazısı Eklerken
1. Sayfa oluştur: `src/app/blog/[slug]/page.tsx`
2. Listeye ekle: `src/app/blog/page.tsx` (blogPosts array)
3. Sitemap'e ekle: `src/app/sitemap.ts`

### SEO Gereksinimleri
- Title < 60 karakter
- Description 150-160 karakter
- BreadcrumbJsonLd her sayfada
- CalculatorJsonLd hesaplayıcılarda
- ArticleJsonLd blog yazılarında

---

## Referans Dosyaları

- **Bordro Hesaplama**: `Payroll Working.xlsx`
- **Vergi Oranları**: Malta CFR (https://cfr.gov.mt)
- **SSC Oranları**: Malta Social Security (https://socialsecurity.gov.mt)

---

## AI Asistan için Notlar

1. **Hesaplama Doğruluğu**: Tüm hesaplamalar `Payroll Working.xlsx` ile uyumlu olmalı
2. **Statik Sayfalar**: Public sayfalar `force-static` ile statik oluşturulur
3. **Türkçe Yorumlar**: Kod içi yorumlar Türkçe olabilir
4. **İngilizce UI**: Kullanıcı arayüzü tamamen İngilizce
5. **Malta Odaklı**: Tüm içerik Malta'ya özgü
