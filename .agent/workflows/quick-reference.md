# Malta Calculator - Quick Reference

Bu dosya, sık kullanılan işlemler için hızlı referans sağlar.

---

## Hızlı Komutlar

### Build & Test

```bash
# Build kontrolü
npm run build

# Development server
npm run dev

# Lint kontrolü
npm run lint
```

---

## Yeni Sayfa Ekleme Checklist

### Hesaplayıcı Sayfası

- [ ] `src/utils/[name]-calculator.ts` - Hesaplama fonksiyonu
- [ ] `src/app/calculators/[slug]/_components/[name]-calculator.tsx` - UI bileşeni
- [ ] `src/app/calculators/[slug]/page.tsx` - Sayfa (metadata + JSON-LD)
- [ ] `src/app/calculators/page.tsx` - Kategoriye ekle (available: true)
- [ ] `src/app/sitemap.ts` - activeCalculators array'ine ekle
- [ ] `npm run build` - Doğrulama

### Blog Yazısı

- [ ] `src/app/blog/[slug]/page.tsx` - Sayfa oluştur
- [ ] `src/app/blog/page.tsx` - blogPosts array'ine ekle
- [ ] `src/app/sitemap.ts` - blogPages array'ine ekle
- [ ] `npm run build` - Doğrulama

---

## Import Şablonları

### Sayfa için Standart Import'lar

```tsx
import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";
```

### Calculator Bileşeni için Import'lar

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Euro, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
```

### Blog Yazısı için Import'lar

```tsx
import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Calculator,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
```

---

## Sık Kullanılan Snippet'ler

### Metadata Template

```tsx
export const metadata: Metadata = {
  ...defaultMetadata,
  title: "[Başlık] | Malta Calculator",
  description: "[150-160 karakter]",
  keywords: ["malta", "calculator", "keyword"],
  alternates: { canonical: `${SITE_URL}/[path]` },
  openGraph: { ...ogMetadata, title: "[Başlık]", url: `${SITE_URL}/[path]` },
  twitter: { ...twitterMetadata, title: "[Başlık]" },
};
```

### Statik Export

```tsx
export const revalidate = false;
export const dynamic = "force-static";
```

### ToggleGroup Component

```tsx
interface ToggleGroupProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}

function ToggleGroup<T extends string>({
  value,
  onChange,
  options,
  className,
}: ToggleGroupProps<T>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-medium transition-all",
            value === option.value
              ? "bg-primary text-white shadow-lg"
              : "bg-muted hover:bg-muted/80 text-muted-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
```

### Currency Formatter

```tsx
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
```

---

## Kategori Renkleri

| Kategori        | Gradient                        |
| --------------- | ------------------------------- |
| Employment      | `from-amber-500 to-orange-600`  |
| Family          | `from-pink-500 to-rose-600`     |
| Property        | `from-emerald-500 to-green-600` |
| Banking         | `from-sky-500 to-blue-600`      |
| Retirement      | `from-blue-500 to-cyan-600`     |
| Self-Employment | `from-violet-500 to-purple-600` |
| Leave           | `from-teal-500 to-emerald-600`  |
| Transport       | `from-slate-500 to-zinc-600`    |
| Immigration     | `from-indigo-500 to-violet-600` |

---

## Lucide İkon Referansı

### Sık Kullanılan İkonlar

```tsx
import {
  Calculator, // Genel hesaplayıcı
  Euro, // Para/maaş
  Percent, // Yüzde/vergi
  Info, // Bilgi kutusu
  AlertTriangle, // Uyarı
  Calendar, // Tarih
  Clock, // Zaman/okuma süresi
  ArrowLeft, // Geri
  ArrowRight, // İleri
  Briefcase, // İş/çalışma
  Home, // Ev/mülk
  Car, // Araç
  Baby, // Aile/çocuk
  Palmtree, // Emeklilik
  Landmark, // Banka
  Users, // Kişiler
  BookOpen, // Blog/okuma
  Sparkles, // Öne çıkan
} from "lucide-react";
```

---

## Tailwind Sınıf Referansı

### Kart Stilleri

```tsx
// Standart kart
"p-6 rounded-2xl bg-card border border-border";

// Gradient input kartı
"p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50";

// Gradient result kartı
"p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20";
```

### Badge Stilleri

```tsx
// Primary badge
"px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium";

// Coming soon badge
"px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-full";
```

### Button Stilleri

```tsx
// Primary button
"px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors";

// Toggle aktif
"px-4 py-2 rounded-xl bg-primary text-white shadow-lg";

// Toggle pasif
"px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground";
```

### Text Gradient

```tsx
// Primary gradient
"text-gradient";

// Secondary gradient
"text-gradient-secondary";
```

---

## Dosya İsimlendirme Kuralları

| Tip             | Format                    | Örnek                                   |
| --------------- | ------------------------- | --------------------------------------- |
| Sayfa           | `page.tsx`                | `src/app/calculators/mortgage/page.tsx` |
| Layout          | `layout.tsx`              | `src/app/calculators/layout.tsx`        |
| Bileşen         | `kebab-case.tsx`          | `mortgage-calculator.tsx`               |
| Utility         | `kebab-case.ts`           | `mortgage-calculator.ts`                |
| Tip             | `kebab-case-type.ts`      | `salary-calculator-type.ts`             |
| Blog slug       | `malta-[konu]-guide-2026` | `malta-mortgage-guide-2026`             |
| Calculator slug | `[konu]`                  | `mortgage`, `stamp-duty`                |
