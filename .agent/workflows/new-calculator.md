---
description: how to create a new calculator with full SEO
---

# New Calculator Workflow

This workflow guides you through creating a new calculator for the Malta Calculator website.

## Prerequisites
- Understand the calculation logic and formulas
- Research official Malta sources for accurate data

## Steps

### 1. Research Existing Structure
// turbo
View existing calculator structure to understand the pattern:
```
/src/app/calculators/page.tsx                    # Calculator categories list
/src/app/calculators/[calculator]/_components/   # Calculator component
/src/app/calculators/[calculator]/page.tsx       # Calculator page
/src/utils/[calculator]-calculator.ts            # Calculation utility
/src/components/marketing/menu-box.tsx           # Homepage featured calculators
```

### 2. Create Utility Function
Create calculation utility at `/src/utils/[name]-calculator.ts`:
```typescript
// Input/Output interfaces
// Main calculation function
// Helper functions (formatCurrency, etc.)
// Constants with year/source documentation
```

### 3. Create Calculator Component
Create component at `/src/app/calculators/[name]/_components/[name]-calculator.tsx`:
```typescript
"use client";

// imports
// state management with useState
// calculations with useMemo
// UI with motion animations
// Input controls (NumericInput, ToggleGroup)
// Result display with breakdown
// Info boxes with important notes
```

### 4. Create Calculator Page
Create page at `/src/app/calculators/[name]/page.tsx`:
```typescript
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { YourCalculator } from "./_components/your-calculator";
import { BreadcrumbJsonLd, CalculatorJsonLd, CustomFAQJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "[Calculator Name] | Malta Calculator",
    description: "[Description]",
    keywords: [...],
    alternates: { canonical: `${SITE_URL}/calculators/[slug]` },
    openGraph: { ... },
    twitter: { ... },
};

export default function CalculatorPage() {
    return (
        <MarketingLayout>
            <BreadcrumbJsonLd items={[
                { name: "Home", url: SITE_URL },
                { name: "Calculators", url: `${SITE_URL}/calculators` },
                { name: "[Calculator Name]", url: `${SITE_URL}/calculators/[slug]` },
            ]} />
            <CalculatorJsonLd
                name="[Calculator Name] Malta"
                description="[Description]"
                slug="[slug]"
                category="[Category] Calculator"
                features={["Feature 1", "Feature 2", ...]}
            />
            <CustomFAQJsonLd
                questions={[
                    { question: "FAQ 1?", answer: "Answer 1" },
                    { question: "FAQ 2?", answer: "Answer 2" },
                ]}
            />
            <main role="main" aria-label="[Calculator Name]">
                <BackButton href="/calculators" />
                <Shell className="max-w-4xl py-8">
                    <YourCalculator />
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;
export const dynamic = 'force-static';
```

### 5. Add to Calculators List
Update `/src/app/calculators/page.tsx`:
- Add to existing category or create new category
- Set `available: true`
- Import any needed icons from lucide-react

### 6. Add to Homepage (Optional)
If featured, update `/src/components/marketing/menu-box.tsx`:
```typescript
{
    href: "/calculators/[slug]",
    title: "[Calculator Name]",
    description: "[Short description]",
    icon: IconName,
    gradient: "from-color-500/20 via-color-500/10 to-color-500/5",
    iconBg: "bg-gradient-to-br from-color-500 to-color-600",
    available: true,
    badge: "New",
},
```

### 7. Update Sitemap
Update `/src/app/sitemap.ts`:
- Add to `activeCalculators` array

### 8. Create Blog Post (Optional)
Follow `/new-blog-post` workflow to create companion blog post.

### 9. Verify
// turbo
```bash
npm run build
```

Then verify in browser:
- Calculator page loads
- Calculations are correct
- Appears in /calculators list
- Appears on homepage (if added)
- JSON-LD present in source

## Component Structure

### Calculator Component Template
```tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { IconName, Euro, Calculator, Info, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { NumericInput } from "@/components/ui/numeric-input";
import { calculateXxx, formatCurrency } from "@/utils/xxx-calculator";

// ToggleGroup component for options
function ToggleGroup<T extends string>({...}) { ... }

export function XxxCalculator() {
    const [inputValue, setInputValue] = useState(defaultValue);
    const [option, setOption] = useState<OptionType>("default");
    
    const result = useMemo(() => {
        return calculateXxx({ inputValue, option });
    }, [inputValue, option]);
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    <IconName className="h-4 w-4" /> Category
                </div>
                <h1 className="font-cal text-3xl md:text-4xl font-bold">[Calculator Name]</h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">[Description]</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50 space-y-6">
                        {/* Input controls */}
                    </div>
                </motion.div>

                {/* Result Section */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 space-y-6">
                        {/* Result display with breakdown */}
                    </div>
                    {/* Info boxes */}
                </motion.div>
            </div>
        </div>
    );
}
```

## SEO Checklist
- [ ] Title tag < 60 characters
- [ ] Meta description 150-160 characters
- [ ] 5-10 relevant keywords
- [ ] Canonical URL set
- [ ] OpenGraph metadata
- [ ] Twitter card metadata
- [ ] BreadcrumbJsonLd
- [ ] CalculatorJsonLd (with features)
- [ ] CustomFAQJsonLd (3-5 relevant FAQs)
- [ ] Added to sitemap (`activeCalculators` array)
- [ ] Added to calculators list page
- [ ] Internal links to related pages
