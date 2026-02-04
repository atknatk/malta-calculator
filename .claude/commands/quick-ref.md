# Quick Reference

Sık kullanılan dosya yolları ve komutlar.

---

## Önemli Dosyalar

### Yapılandırma

| Dosya                            | Açıklama                            |
| -------------------------------- | ----------------------------------- |
| `src/config/malta-tax-config.ts` | Vergi dilimleri, SSC oranları, COLA |
| `src/app/shared-metadata.ts`     | SEO metadata sabitleri              |
| `src/components/json-ld.tsx`     | Structured data bileşenleri         |
| `src/app/sitemap.ts`             | Sitemap yapılandırması              |

### Hesaplayıcılar

| Dosya                                | Açıklama           |
| ------------------------------------ | ------------------ |
| `src/utils/salary-calculator.ts`     | Ana maaş hesaplama |
| `src/utils/mortgage-calculator.ts`   | Mortgage hesaplama |
| `src/utils/stamp-duty-calculator.ts` | Damga vergisi      |
| `src/utils/vacation-calculator.ts`   | İzin günleri       |

### Layout Bileşenleri

| Bileşen           | Dosya                                        |
| ----------------- | -------------------------------------------- |
| `MarketingLayout` | `src/components/layout/marketing-layout.tsx` |
| `Shell`           | `src/components/dashboard/shell.tsx`         |
| `BackButton`      | `src/components/layout/back-button.tsx`      |

### UI Bileşenleri

| Bileşen        | Dosya                                 |
| -------------- | ------------------------------------- |
| `NumericInput` | `src/components/ui/numeric-input.tsx` |
| `Button`       | `src/components/ui/button.tsx`        |
| `Card`         | `src/components/ui/card.tsx`          |

---

## Klasör Yapısı

```
src/
├── app/
│   ├── api/               # Backend API'ler
│   ├── blog/              # Blog yazıları
│   ├── calculators/       # Hesaplayıcılar
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── _components/
│   ├── dashboard/         # Şirket paneli
│   ├── employees/         # Çalışan yönetimi
│   ├── payslip/           # Bordro yönetimi
│   └── salary/            # Ana maaş hesaplayıcı
├── components/
│   ├── ui/               # Radix UI bileşenleri
│   ├── layout/           # Layout bileşenleri
│   └── marketing/        # Pazarlama bileşenleri
├── config/               # Yapılandırma
├── utils/                # Hesaplama fonksiyonları
├── lib/                  # Supabase client'ları
└── types/                # TypeScript tipleri
```

---

## Komutlar

```bash
npm run dev     # Development server (localhost:3000)
npm run build   # Production build
npm run lint    # ESLint kontrolü
npm start       # Production server
```

---

## Sık Kullanılan Import'lar

```typescript
// Metadata
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";

// Layout
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";

// JSON-LD
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  ArticleJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

// UI
import { NumericInput } from "@/components/ui/numeric-input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Animation
import { motion } from "framer-motion";

// Icons
import { Calculator, Euro, Info, ArrowRight } from "lucide-react";
```

---

## Statik Sayfa Ayarları

Her public sayfa sonuna ekle:

```typescript
export const revalidate = false;
export const dynamic = "force-static";
```

---

## Styling Patterns

### Gradient Kart

```tsx
className =
  "p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50";
```

### Result Kart

```tsx
className =
  "p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20";
```

### Badge

```tsx
className =
  "px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium";
```

### Info Box

```tsx
className = "p-4 rounded-xl bg-blue-500/10 border border-blue-500/20";
```

### Warning Box

```tsx
className = "p-4 rounded-xl bg-amber-500/10 border border-amber-500/20";
```

---

## Animation Patterns

### Fade In + Slide

```tsx
<motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
>
```

### Stagger Children

```tsx
transition={{ delay: index * 0.1 }}
```

---

## Veritabanı Tabloları

| Tablo         | Açıklama                    |
| ------------- | --------------------------- |
| `companies`   | Şirket bilgileri, plan tipi |
| `employees`   | Çalışan kayıtları           |
| `payslips`    | Bordro belgeleri            |
| `daily_usage` | Günlük kullanım takibi      |

---

## API Endpoints

| Endpoint                   | Method | Açıklama         |
| -------------------------- | ------ | ---------------- |
| `/api/salary/calculate`    | POST   | Maaş hesaplama   |
| `/api/payslip/generate`    | POST   | Bordro oluşturma |
| `/api/employee/verify-pin` | POST   | PIN doğrulama    |
| `/api/stripe/checkout`     | POST   | Ödeme başlatma   |
