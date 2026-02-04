---
name: new-calculator
description: Create a new Malta-specific calculator with full SEO setup
argument-hint: <calculator name in English>
allowed-tools: Read Write Edit Bash Glob Grep
---

# New Calculator Workflow

Create a new calculator: **$ARGUMENTS**

## Required Information

Before starting, gather:
1. Calculator name (English)
2. Calculation logic and formulas
3. Category (Financial, Property, Employment, Government Benefits, Vehicle)
4. Malta-specific constants/rates (with sources)

## Step 1: Create Utility Function

File: `src/utils/{slug}-calculator.ts`

```typescript
// Constants with year and source reference
const CONSTANTS = {
    RATE_2026: 0.15,  // Source: Malta CFR
} as const;

// Input interface
export interface {Name}Input {
    value: number;
    option: string;
}

// Output interface
export interface {Name}Result {
    total: number;
    breakdown: {
        item1: number;
        item2: number;
    };
}

// Main calculation function
export function calculate{Name}(input: {Name}Input): {Name}Result {
    // Implementation
    return { total: 0, breakdown: { item1: 0, item2: 0 } };
}

// Helper functions
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-MT", {
        style: "currency",
        currency: "EUR",
    }).format(value);
}
```

## Step 2: Create Calculator Component

File: `src/app/calculators/{slug}/_components/{slug}-calculator.tsx`

Follow the established pattern with:
- "use client" directive
- motion animations from framer-motion
- Two-column layout (inputs | results)
- Gradient card styling
- NumericInput components

## Step 3: Create Calculator Page

File: `src/app/calculators/{slug}/page.tsx`

Include:
- Proper metadata (title < 60 chars, description 150-160 chars)
- BreadcrumbJsonLd
- CalculatorJsonLd (3-5 features)
- CustomFAQJsonLd (3-5 questions)
- Static export settings

## Step 4: Add to Calculator List

File: `src/app/calculators/page.tsx`

Add to appropriate category:
```typescript
{
    name: "{Title}",
    href: "/calculators/{slug}",
    description: "{Short description}",
    icon: IconName,
    available: true,
}
```

## Step 5: Update Sitemap

File: `src/app/sitemap.ts`

Add to `activeCalculators` array:
```typescript
"{slug}",
```

## Step 6: Build Check

```bash
npm run build
```

## SEO Checklist

- [ ] Title < 60 characters
- [ ] Description 150-160 characters
- [ ] 5-10 relevant keywords
- [ ] Canonical URL set
- [ ] BreadcrumbJsonLd added
- [ ] CalculatorJsonLd with 3-5 features
- [ ] CustomFAQJsonLd with 3-5 questions
- [ ] Added to sitemap
- [ ] Added to calculators list
- [ ] Build passes
