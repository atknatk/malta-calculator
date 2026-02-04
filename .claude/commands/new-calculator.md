# New Calculator Workflow

Yeni bir hesaplayıcı oluşturmak için bu workflow'u takip et.

## Kullanıcıdan alınacak bilgiler:
- Hesaplayıcı adı (İngilizce)
- Hesaplama mantığı ve formüller
- Hangi kategoriye ait (Financial, Property, Employment, Government Benefits, Vehicle)

## Adımlar

### 1. Utility Fonksiyonu Oluştur
Dosya: `src/utils/{{name}}-calculator.ts`

```typescript
// Sabitler (yıl ve kaynak belirt)
const CONSTANTS = {
    RATE_2026: 0.15,
} as const;

// Input interface
export interface {{Name}}Input {
    value: number;
    option: string;
}

// Output interface
export interface {{Name}}Result {
    total: number;
    breakdown: {
        item1: number;
        item2: number;
    };
}

// Ana hesaplama fonksiyonu
export function calculate{{Name}}(input: {{Name}}Input): {{Name}}Result {
    // Hesaplama mantığı
    return { total: 0, breakdown: { item1: 0, item2: 0 } };
}

// Yardımcı fonksiyonlar
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-MT", {
        style: "currency",
        currency: "EUR",
    }).format(value);
}
```

### 2. Calculator Component Oluştur
Dosya: `src/app/calculators/{{slug}}/_components/{{slug}}-calculator.tsx`

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Euro, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import { calculate{{Name}}, formatCurrency } from "@/utils/{{slug}}-calculator";

export function {{Name}}Calculator() {
    const [value, setValue] = useState(0);

    const result = useMemo(() => {
        return calculate{{Name}}({ value });
    }, [value]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Calculator className="h-4 w-4" /> Category
                </div>
                <h1 className="font-cal text-3xl md:text-4xl font-bold">{{Title}}</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">Description</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                >
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-6">
                        {/* NumericInput controls */}
                    </div>
                </motion.div>

                {/* Result Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-6">
                        {/* Result display */}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
```

### 3. Calculator Page Oluştur
Dosya: `src/app/calculators/{{slug}}/page.tsx`

```tsx
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { {{Name}}Calculator } from "./_components/{{slug}}-calculator";
import { BreadcrumbJsonLd, CalculatorJsonLd, CustomFAQJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "{{Title}} | Malta Calculator",
    description: "{{Description 150-160 karakter}}",
    keywords: ["malta", "{{keyword1}}", "{{keyword2}}", "calculator", "2026"],
    alternates: { canonical: `${SITE_URL}/calculators/{{slug}}` },
    openGraph: {
        ...ogMetadata,
        title: "{{Title}}",
        url: `${SITE_URL}/calculators/{{slug}}`,
    },
    twitter: {
        ...twitterMetadata,
        title: "{{Title}}",
    },
};

export default function {{Name}}CalculatorPage() {
    return (
        <MarketingLayout>
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", url: SITE_URL },
                    { name: "Calculators", url: `${SITE_URL}/calculators` },
                    { name: "{{Title}}", url: `${SITE_URL}/calculators/{{slug}}` },
                ]}
            />
            <CalculatorJsonLd
                name="{{Title}} Malta"
                description="{{Description}}"
                slug="{{slug}}"
                category="{{Category}} Calculator"
                features={["Feature 1", "Feature 2", "Feature 3"]}
            />
            <CustomFAQJsonLd
                questions={[
                    { question: "FAQ 1?", answer: "Answer 1" },
                    { question: "FAQ 2?", answer: "Answer 2" },
                ]}
            />
            <main role="main" aria-label="{{Title}}">
                <BackButton href="/calculators" />
                <Shell className="max-w-4xl py-8">
                    <{{Name}}Calculator />
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;
export const dynamic = 'force-static';
```

### 4. Calculators Listesine Ekle
Dosya: `src/app/calculators/page.tsx`

İlgili kategoriye ekle:
```typescript
{
    name: "{{Title}}",
    href: "/calculators/{{slug}}",
    description: "{{Short description}}",
    icon: IconName,
    available: true,
}
```

### 5. Sitemap'e Ekle
Dosya: `src/app/sitemap.ts`

`activeCalculators` array'ine ekle:
```typescript
"{{slug}}",
```

### 6. Build Kontrolü
```bash
npm run build
```

## SEO Checklist
- [ ] Title < 60 karakter
- [ ] Description 150-160 karakter
- [ ] 5-10 keyword
- [ ] Canonical URL
- [ ] BreadcrumbJsonLd
- [ ] CalculatorJsonLd (3-5 feature)
- [ ] CustomFAQJsonLd (3-5 soru)
- [ ] Sitemap güncellendi
- [ ] Calculators listesine eklendi
