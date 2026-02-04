# Malta Calculator - Project Structure Analysis

## Overview

**Malta Calculator** is a Next.js 16+ application providing financial calculators and payroll services for Malta.

## Project Type

- **Single Next.js Application** (NOT a monorepo)
- **Framework**: Next.js 16+ with App Router
- **Deployment**: Vercel

## Directory Structure

```
malta-calculator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # Backend API routes
│   │   ├── blog/              # 35+ blog posts
│   │   ├── calculators/       # 28+ calculator pages
│   │   ├── dashboard/         # Authenticated company panel
│   │   ├── employees/         # Employee management
│   │   ├── payslip/           # Payslip management
│   │   ├── settings/          # User settings
│   │   └── timer/             # Countdown timer feature
│   │
│   ├── components/            # Reusable React components
│   │   ├── ui/               # shadcn UI components (Radix based)
│   │   ├── layout/           # Layout components
│   │   └── marketing/        # Marketing components
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── supabase/         # Database clients
│   │   ├── s3/               # AWS S3 client
│   │   └── stripe.ts         # Stripe configuration
│   │
│   ├── utils/                 # Calculator functions
│   ├── config/               # Configuration files
│   ├── types/                # TypeScript definitions
│   ├── hooks/                # React hooks
│   └── providers/            # Context providers
│
├── public/                    # Static assets
├── .claude/                   # Claude Code configuration
│   ├── agents/               # Subagents
│   ├── skills/               # Skills (commands)
│   └── settings.json         # Project settings
│
└── docs/                      # Documentation
    ├── analysis/             # Project analysis
    └── tasks/                # Task tracking
```

## Key Features

1. **28+ Public Calculators** - Free financial tools
2. **35+ Blog Posts** - SEO-optimized content
3. **B2B Payroll System** - Subscription-based (Stripe)
4. **Employee Management** - Dashboard for companies
5. **PDF Payslip Generation** - With QR verification

## File Categories

### Configuration
- `src/config/malta-tax-config.ts` - Tax rates, SSC, COLA
- `src/app/shared-metadata.ts` - SEO metadata
- `next.config.mjs` - Next.js configuration
- `tailwind.config.ts` - Styling configuration

### Calculations
- `src/utils/salary-calculator.ts` - Main salary engine
- `src/utils/*-calculator.ts` - Various calculators

### Components
- `src/components/ui/` - Base UI components
- `src/components/layout/` - Layout wrappers
- `src/components/json-ld.tsx` - Structured data

### API Routes
- `/api/salary/calculate` - Salary calculation
- `/api/payslip/generate` - PDF generation
- `/api/stripe/` - Payment handling
