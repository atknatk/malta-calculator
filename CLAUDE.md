# Malta Calculator - Claude Code Project Rules

Bu dosya, Claude Code'un Malta Calculator projesinde çalışırken bilmesi gereken kuralları ve bağlamı içerir.

## Proje Hakkında

**Malta Calculator**, Malta'da yaşayan ve çalışan kişiler için kapsamlı bir finansal hesaplama platformudur.

### Ana Özellikler

1. **Halka Açık Hesaplayıcılar** - 28+ ücretsiz finansal araç
2. **B2B Bordro Sistemi** - Şirketler için ücretli abonelik (Stripe)
3. **Blog/Rehberler** - SEO odaklı içerik (30+ yazı)

---

## Tech Stack

| Kategori  | Teknoloji                        |
| --------- | -------------------------------- |
| Framework | Next.js 16+ (App Router)         |
| Dil       | TypeScript (strict mode)         |
| UI        | React 18, Tailwind CSS, Radix UI |
| Animasyon | Framer Motion                    |
| Backend   | Supabase (PostgreSQL)            |
| Auth      | Clerk                            |
| Ödeme     | Stripe                           |
| Form      | React Hook Form + Zod            |
| Hosting   | Vercel                           |

---

## Dosya Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Backend API'ler
│   ├── blog/              # Blog yazıları
│   ├── calculators/       # Hesaplayıcı sayfaları
│   ├── dashboard/         # Şirket paneli (auth)
│   ├── employees/         # Çalışan yönetimi
│   ├── payslip/           # Bordro yönetimi
│   └── salary/            # Ana maaş hesaplayıcı
├── components/            # Paylaşılan bileşenler
│   ├── ui/               # Radix UI bileşenleri
│   ├── layout/           # Layout bileşenleri
│   └── marketing/        # Pazarlama bileşenleri
├── config/               # Vergi/SSC yapılandırmaları
├── utils/                # Hesaplama fonksiyonları
├── lib/                  # Supabase client'ları
└── types/                # TypeScript tipleri
```

---

## Önemli Dosyalar

| Dosya                            | Açıklama                            |
| -------------------------------- | ----------------------------------- |
| `src/config/malta-tax-config.ts` | Vergi dilimleri, SSC oranları, COLA |
| `src/app/shared-metadata.ts`     | SEO metadata sabitleri              |
| `src/components/json-ld.tsx`     | Structured data bileşenleri         |
| `src/app/sitemap.ts`             | Sitemap yapılandırması              |
| `src/utils/salary-calculator.ts` | Ana maaş hesaplama motoru           |

---

## Kodlama Kuralları

### Dosya İsimlendirme

- Bileşenler: `kebab-case.tsx` (örn: `salary-calculator.tsx`)
- Utility: `kebab-case.ts` (örn: `mortgage-calculator.ts`)
- Sayfaya özel bileşenler: `_components/` klasöründe

### Bileşen Yapısı

```tsx
// Client component için
"use client";

// Import sıralaması
import { useState, useMemo } from "react"; // 1. React
import { motion } from "framer-motion"; // 2. Üçüncü parti
import { Calculator, Euro } from "lucide-react"; // 3. İkonlar
import { cn } from "@/lib/utils"; // 4. Yerel utility
import { NumericInput } from "@/components/ui/numeric-input"; // 5. Bileşenler
```

### TypeScript

- Interface tercih et (extend edilebilir)
- Explicit return types kullan
- Enum yerine `const object` kullan

### Styling

- `cn()` helper ile conditional classes
- Gradient kartlar: `from-primary/5 via-background to-secondary/5`
- Glass efekt: `glass border border-primary/20`

---

## Malta Vergi Sistemi (2026)

### Vergi Kategorileri

- Single (Bekar)
- Married (Evli) - 0, 1, 2+ çocuk
- Parent (Ebeveyn) - 0, 1, 2+ çocuk

### SSC Kategorileri

| Kategori | Açıklama      | Haftalık Max                  |
| -------- | ------------- | ----------------------------- |
| A        | Emekli        | €6.62                         |
| B        | Part-time     | €22.94                        |
| C        | Full-time     | €55.93 (yeni) / €49.04 (eski) |
| D        | Self-employed | €55.93 (yeni) / €49.04 (eski) |

### COLA (Cost of Living Adjustment)

- Q1/Q3: €121.16
- Q2/Q4: €135.10

### SSC Haftalık Cap

€559.31 (2026)

---

## SEO Kuralları

### Metadata Gereksinimleri

- Title: < 60 karakter
- Description: 150-160 karakter
- Keywords: 5-10 ilgili anahtar kelime
- Canonical URL zorunlu

### JSON-LD Bileşenleri

| Bileşen            | Kullanım                 |
| ------------------ | ------------------------ |
| `BreadcrumbJsonLd` | Her sayfada zorunlu      |
| `CalculatorJsonLd` | Hesaplayıcı sayfalarında |
| `ArticleJsonLd`    | Blog yazılarında         |
| `CustomFAQJsonLd`  | FAQ içeren sayfalarda    |

### Statik Sayfa Ayarları

Her public sayfa sonuna ekle:

```typescript
export const revalidate = false;
export const dynamic = "force-static";
```

---

## Veritabanı (Supabase)

| Tablo         | Açıklama                    |
| ------------- | --------------------------- |
| `companies`   | Şirket bilgileri, plan tipi |
| `employees`   | Çalışan kayıtları           |
| `payslips`    | Bordro belgeleri            |
| `daily_usage` | Günlük kullanım takibi      |

### Supabase Client Kullanımı

```typescript
// Client-side
import { createClient } from "@/lib/supabase/client";

// Server-side
import { createClient } from "@/lib/supabase/server";
```

---

## Komutlar

```bash
npm run dev     # Development server
npm run build   # Production build
npm run lint    # ESLint kontrolü
```

---

## Custom Slash Commands

Bu projede kullanılabilir özel komutlar:

| Komut             | Açıklama                                              |
| ----------------- | ----------------------------------------------------- |
| `/new-calculator` | Yeni hesaplayıcı oluşturma workflow'u                 |
| `/new-blog`       | Yeni blog yazısı oluşturma workflow'u                 |
| `/build`          | Build ve doğrulama adımları                           |
| `/seo-check`      | SEO kontrolü ve rapor şablonu                         |
| `/payroll`        | Malta bordro hesaplama kuralları                      |
| `/quick-ref`      | Hızlı referans (dosya yolları, importlar, patternlar) |

---

## Dikkat Edilecekler

1. **Hesaplama Doğruluğu**: Tüm hesaplamalar `Payroll Working.xlsx` ile uyumlu olmalı
2. **Statik Sayfalar**: Public sayfalar `force-static` ile oluşturulur
3. **Türkçe Yorumlar**: Kod içi yorumlar Türkçe olabilir
4. **İngilizce UI**: Kullanıcı arayüzü tamamen İngilizce
5. **Malta Odaklı**: Tüm içerik Malta'ya özgü

---

## Referanslar

- Malta CFR: https://cfr.gov.mt (Vergi oranları)
- Malta Social Security: https://socialsecurity.gov.mt (SSC oranları)
- Payroll Working.xlsx: Hesaplama referans dosyası
