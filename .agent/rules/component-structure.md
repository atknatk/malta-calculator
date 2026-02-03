# Malta Calculator - Component Structure Rules

Bu dosya, Malta Calculator projesindeki bileşen yapılarını ve kalıplarını tanımlar.

---

## Sayfa Yapısı

### 1. Temel Sayfa Template'i

```tsx
import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import { BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "[Sayfa Başlığı] | Malta Calculator",
    description: "[Açıklama]",
    keywords: [...],
    alternates: { canonical: `${SITE_URL}/[path]` },
    openGraph: { ...ogMetadata, title: "[Başlık]", url: `${SITE_URL}/[path]` },
    twitter: { ...twitterMetadata, title: "[Başlık]" },
};

export default function PageName() {
    return (
        <MarketingLayout>
            <BreadcrumbJsonLd items={[...]} />
            {/* Diğer JSON-LD bileşenleri */}
            <main role="main" aria-label="[Sayfa Açıklaması]">
                <Shell className="py-12">
                    {/* Sayfa içeriği */}
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;
export const dynamic = 'force-static';
```

---

## Calculator Bileşen Yapısı

### 2. Calculator Component Template

```tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Euro, Info, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import { calculateXxx, formatCurrency } from "@/utils/xxx-calculator";

// ToggleGroup bileşeni (seçenekler için)
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
                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export function XxxCalculator() {
    // State tanımları
    const [inputValue, setInputValue] = useState(50000);
    const [option, setOption] = useState<"option1" | "option2">("option1");

    // Memoized hesaplama
    const result = useMemo(() => {
        return calculateXxx({ value: inputValue, option });
    }, [inputValue, option]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <Calculator className="h-4 w-4" />
                    Category Name
                </div>
                <h1 className="font-cal text-3xl md:text-4xl font-bold">
                    [Calculator Name]
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    [Kısa açıklama]
                </p>
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
                        {/* Input kontrolleri */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Input Label
                            </label>
                            <NumericInput
                                value={inputValue}
                                onValueChange={setInputValue}
                                min={0}
                                max={1000000}
                                prefix="€"
                            />
                        </div>

                        {/* Toggle seçenekleri */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Option Label
                            </label>
                            <ToggleGroup
                                value={option}
                                onChange={setOption}
                                options={[
                                    { value: "option1", label: "Option 1" },
                                    { value: "option2", label: "Option 2" },
                                ]}
                            />
                        </div>
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
                        {/* Ana sonuç */}
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground mb-2">
                                Result Label
                            </div>
                            <div className="text-4xl md:text-5xl font-bold text-gradient">
                                {formatCurrency(result.total)}
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-3 pt-4 border-t border-border/50">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Item 1</span>
                                <span className="font-medium">{formatCurrency(result.breakdown.item1)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Item 2</span>
                                <span className="font-medium">{formatCurrency(result.breakdown.item2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Info box */}
                    <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex gap-3">
                            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                                <strong className="text-foreground">Important Note:</strong>{" "}
                                [Önemli bilgi veya açıklama]
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
```

---

## Blog Yazısı Yapısı

### 3. Blog Post Template

```tsx
import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, Calculator } from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "[Başlık] | Malta Calculator",
    description: "[150-160 karakter açıklama]",
    keywords: ["keyword1", "keyword2", ...],
    alternates: { canonical: `${SITE_URL}/blog/[slug]` },
    openGraph: {
        ...ogMetadata,
        title: "[Başlık]",
        url: `${SITE_URL}/blog/[slug]`,
        type: "article",
    },
    twitter: { ...twitterMetadata, title: "[Başlık]" },
};

export default function BlogPostPage() {
    return (
        <MarketingLayout>
            <ArticleJsonLd
                title="[Başlık]"
                description="[Açıklama]"
                slug="[slug]"
                datePublished="YYYY-MM-DD"
            />
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", url: SITE_URL },
                    { name: "Blog", url: `${SITE_URL}/blog` },
                    { name: "[Kısa Başlık]", url: `${SITE_URL}/blog/[slug]` },
                ]}
            />
            <main role="main" aria-label="[Konu]">
                <Shell className="max-w-4xl py-12">
                    {/* Back button */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>

                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        {/* Header */}
                        <header className="not-prose mb-10">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                    [Kategori]
                                </span>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        [Tarih]
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        [X] min read
                                    </span>
                                </div>
                            </div>
                            <h1 className="font-cal text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                                [Ana Başlık]
                            </h1>
                            <p className="text-xl text-muted-foreground">
                                [Alt başlık/Özet]
                            </p>
                        </header>

                        {/* Table of Contents */}
                        <nav className="not-prose p-6 rounded-2xl bg-muted/30 border border-border/50 mb-10">
                            <h2 className="font-semibold mb-4">Table of Contents</h2>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#section-1" className="text-muted-foreground hover:text-primary transition-colors">
                                        1. Section Title
                                    </a>
                                </li>
                                {/* Diğer bölümler */}
                            </ul>
                        </nav>

                        {/* Content Sections */}
                        <section id="section-1">
                            <h2>Section Title</h2>
                            <p>Content...</p>
                        </section>

                        {/* CTA */}
                        <div className="not-prose mt-12 p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                                        <Calculator className="h-8 w-8 text-primary" />
                                    </div>
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl font-bold mb-2">
                                        Try Our [Calculator Name]
                                    </h3>
                                    <p className="text-muted-foreground">
                                        [CTA açıklaması]
                                    </p>
                                </div>
                                <Link
                                    href="/calculators/[slug]"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    Calculate Now
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;
export const dynamic = 'force-static';
```

---

## UI Bileşenleri

### 4. Sık Kullanılan UI Pattern'leri

#### Badge/Chip
```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
    <Icon className="h-4 w-4" />
    <span>Badge Text</span>
</div>
```

#### Card
```tsx
<div className="p-6 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-lg transition-all">
    {/* Card içeriği */}
</div>
```

#### Gradient Card
```tsx
<div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50">
    {/* İçerik */}
</div>
```

#### Result Card (Calculator için)
```tsx
<div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20">
    {/* Sonuç içeriği */}
</div>
```

#### Info Box
```tsx
<div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
    <div className="flex gap-3">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> [Bilgi]
        </div>
    </div>
</div>
```

#### Warning Box
```tsx
<div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
    <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
            <strong className="text-foreground">Warning:</strong> [Uyarı]
        </div>
    </div>
</div>
```

---

## Layout Bileşenleri

### 5. MarketingLayout

Tüm public sayfalar `MarketingLayout` kullanır:
- Header (navigasyon)
- Footer
- Tema desteği

```tsx
<MarketingLayout>
    {children}
</MarketingLayout>
```

### 6. Shell

İçerik wrapper'ı:

```tsx
<Shell className="py-12">           {/* Standart padding */}
<Shell className="max-w-4xl py-12"> {/* Blog için dar genişlik */}
<Shell className="py-8">            {/* Calculator için */}
```

### 7. BackButton

Hesaplayıcılar için geri butonu:

```tsx
import { BackButton } from "@/components/layout/back-button";

<BackButton href="/calculators" />
```

---

## Animasyon Pattern'leri

### 8. Framer Motion Animasyonları

```tsx
// Fade in from top
<motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
>

// Fade in from left (input section)
<motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
>

// Fade in from right (result section)
<motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
>

// Stagger effect (liste elemanları için)
{items.map((item, index) => (
    <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
    >
))}
```

---

## Form Bileşenleri

### 9. NumericInput

```tsx
import { NumericInput } from "@/components/ui/numeric-input";

<NumericInput
    value={value}
    onValueChange={setValue}
    min={0}
    max={1000000}
    prefix="€"           // veya suffix="%"
/>
```

### 10. Select

```tsx
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

<Select value={value} onValueChange={setValue}>
    <SelectTrigger>
        <SelectValue placeholder="Select..." />
    </SelectTrigger>
    <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
    </SelectContent>
</Select>
```

---

## Responsive Tasarım

### 11. Breakpoint'ler

```tsx
// Mobile first yaklaşım
<div className="
    text-2xl          // mobile
    md:text-3xl       // tablet (768px+)
    lg:text-4xl       // desktop (1024px+)
">

// Grid layout
<div className="
    grid
    grid-cols-1       // mobile: 1 sütun
    sm:grid-cols-2    // small: 2 sütun
    lg:grid-cols-3    // large: 3 sütun
    gap-4
">

// Flex direction
<div className="
    flex
    flex-col          // mobile: dikey
    md:flex-row       // tablet+: yatay
    gap-6
">
```
