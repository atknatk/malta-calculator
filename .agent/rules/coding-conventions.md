# Malta Calculator - Coding Conventions

Bu dosya, Malta Calculator projesindeki kodlama standartlarını ve kurallarını tanımlar.

---

## Genel Kurallar

### 1. Dil ve Çerçeve
- **TypeScript** kullanılmalıdır (strict mode aktif)
- **Next.js 14+ App Router** mimarisi kullanılır
- **React 18+** ile fonksiyonel bileşenler tercih edilir

### 2. Dosya İsimlendirme
```
# Sayfalar ve Layout'lar
page.tsx                    # Sayfa bileşeni
layout.tsx                  # Layout bileşeni
loading.tsx                 # Loading state
error.tsx                   # Error boundary

# Bileşenler
kebab-case.tsx              # örn: salary-calculator.tsx
_components/                # Sayfaya özel bileşenler klasörü

# Utility dosyaları
kebab-case.ts               # örn: salary-calculator.ts
kebab-case-type.ts          # Tip tanımları için
```

### 3. Klasör Yapısı
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoint'leri
│   ├── blog/              # Blog sayfaları
│   ├── calculators/       # Hesaplayıcı sayfaları
│   └── [page]/            # Diğer sayfalar
├── components/            # Paylaşılan bileşenler
│   ├── ui/               # Temel UI bileşenleri
│   ├── layout/           # Layout bileşenleri
│   └── marketing/        # Pazarlama bileşenleri
├── config/               # Yapılandırma dosyaları
├── hooks/                # Custom React hooks
├── lib/                  # Utility kütüphaneleri
├── types/                # TypeScript tip tanımları
└── utils/                # Hesaplama ve yardımcı fonksiyonlar
```

---

## Bileşen Kuralları

### 4. Bileşen Yapısı
```tsx
// Client component için
"use client";

// Import sıralaması
import { useState, useMemo } from "react";           // 1. React
import { motion } from "framer-motion";              // 2. Üçüncü parti
import { Calculator, Euro } from "lucide-react";    // 3. İkonlar
import { cn } from "@/lib/utils";                    // 4. Yerel utility
import { NumericInput } from "@/components/ui/numeric-input"; // 5. Bileşenler
import { calculateXxx } from "@/utils/xxx-calculator"; // 6. Fonksiyonlar

// Tip tanımları (interface tercih et)
interface ComponentProps {
    value: number;
    onChange: (value: number) => void;
}

// Bileşen tanımı
export function ComponentName({ value, onChange }: ComponentProps) {
    // State tanımları
    const [localState, setLocalState] = useState(defaultValue);

    // Memoized hesaplamalar
    const result = useMemo(() => {
        return calculateSomething(value);
    }, [value]);

    // Event handlers
    const handleChange = (newValue: number) => {
        onChange(newValue);
    };

    // Render
    return (
        <div className="...">
            {/* JSX içeriği */}
        </div>
    );
}
```

### 5. Server vs Client Components
```tsx
// Server Component (varsayılan) - veri çekme, metadata
// page.tsx, layout.tsx genelde server component

// Client Component - interaktivite gerektiğinde
"use client"; // Dosyanın başına ekle

// Ne zaman "use client" kullan:
// - useState, useEffect, useMemo gibi hook'lar
// - onClick, onChange gibi event handler'lar
// - Browser API'leri (window, document)
// - Animasyonlar (framer-motion)
```

---

## Styling Kuralları

### 6. Tailwind CSS
```tsx
// cn() helper kullan (class-variance-authority ile)
import { cn } from "@/lib/utils";

<div className={cn(
    "base-classes",
    condition && "conditional-classes",
    className
)} />

// Sık kullanılan pattern'ler
// Kart: "p-6 rounded-2xl bg-card border border-border"
// Gradient kart: "p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50"
// Glass efekt: "glass border border-primary/20"
// Badge: "px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
```

### 7. Animasyonlar
```tsx
import { motion } from "framer-motion";

// Fade in + slide
<motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
>

// Stagger children için index kullan
transition={{ delay: index * 0.1 }}
```

---

## TypeScript Kuralları

### 8. Tip Tanımları
```typescript
// Interface tercih et (extend edilebilir)
interface CalculatorInput {
    grossSalary: number;
    year: number;
    taxType: TaxRateType;
}

// Union types için type kullan
type TaxRateType = "single" | "married" | "parent";

// Enum yerine const object
const TAX_CATEGORIES = {
    SINGLE: "single",
    MARRIED: "married",
    PARENT: "parent",
} as const;

// Tip export et
export type { CalculatorInput, TaxRateType };
```

### 9. Fonksiyon Tipleri
```typescript
// Explicit return types kullan
function calculateTax(input: TaxInput): TaxResult {
    // ...
}

// Arrow function için de
const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-MT", {
        style: "currency",
        currency: "EUR",
    }).format(value);
};
```

---

## Hesaplayıcı Kuralları

### 10. Calculator Utility Yapısı
```typescript
// src/utils/xxx-calculator.ts

// Sabitler
const CONSTANTS = {
    RATE_2026: 0.15,
    MIN_VALUE: 1000,
} as const;

// Input interface
export interface XxxInput {
    value: number;
    option: string;
}

// Output interface
export interface XxxResult {
    total: number;
    breakdown: {
        item1: number;
        item2: number;
    };
}

// Ana hesaplama fonksiyonu
export function calculateXxx(input: XxxInput): XxxResult {
    // Hesaplama mantığı
    return {
        total: 0,
        breakdown: { item1: 0, item2: 0 },
    };
}

// Yardımcı fonksiyonlar
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-MT", {
        style: "currency",
        currency: "EUR",
    }).format(value);
}
```

---

## API Kuralları

### 11. API Route Yapısı
```typescript
// src/app/api/[endpoint]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation
        if (!body.requiredField) {
            return NextResponse.json(
                { error: "Missing required field" },
                { status: 400 }
            );
        }

        // İşlem
        const result = await processData(body);

        return NextResponse.json(result);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
```

---

## Veritabanı Kuralları

### 12. Supabase Kullanımı
```typescript
// Client-side
import { createClient } from "@/lib/supabase/client";

// Server-side
import { createClient } from "@/lib/supabase/server";

// Admin (service role)
import { createAdminClient } from "@/lib/supabase/admin";

// Tip güvenli sorgular
const { data, error } = await supabase
    .from("table_name")
    .select("*")
    .eq("column", value);

if (error) throw error;
```

---

## Test ve Doğrulama

### 13. Build Kontrolü
```bash
# Her değişiklikten sonra
npm run build

# Lint kontrolü
npm run lint
```

### 14. Hesaplama Doğrulama
- Hesaplayıcı fonksiyonları `Payroll Working.xlsx` referans dosyasıyla karşılaştırılmalı
- Resmi Malta kaynakları (CFR, Social Security) kullanılmalı

---

## Git Commit Kuralları

### 15. Commit Mesajları
```
feat: Yeni özellik eklendi
fix: Hata düzeltildi
docs: Dokümantasyon güncellendi
style: Kod formatı değişiklikleri
refactor: Kod yeniden yapılandırması
test: Test eklendi/güncellendi
chore: Build/config değişiklikleri
```

---

## Referanslar

- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Supabase: https://supabase.com/docs
- Malta CFR: https://cfr.gov.mt
- Malta Social Security: https://socialsecurity.gov.mt
