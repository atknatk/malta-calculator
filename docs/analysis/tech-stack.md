# Malta Calculator - Technology Stack

## Core Technologies

| Category  | Technology   | Version |
| --------- | ------------ | ------- |
| Framework | Next.js      | 16.1.6  |
| Language  | TypeScript   | 5.x     |
| Runtime   | React        | 18.x    |
| Styling   | Tailwind CSS | 3.4.1   |

## Frontend Stack

### UI Framework

- **Radix UI** - Headless UI primitives
- **shadcn/ui** - Component library
- **Framer Motion** - Animations (12.29.0)
- **Lucide React** - Icons

### State & Forms

- **React Hook Form** - Form handling (7.51.5)
- **Zod** - Schema validation (3.23.8)
- **nuqs** - URL state management (2.8.6)

### Data Display

- **TanStack React Table** - Data tables (8.17.3)
- **Tremor** - Analytics components (3.17.2)
- **Recharts** - Charts (via Tremor)

## Backend Stack

### Database

- **Supabase** - PostgreSQL + Auth + Storage
- **Row Level Security** - Data protection

### Authentication

- **Clerk** - User authentication (6.37.1)
- **OAuth** - Social login support

### Payments

- **Stripe** - Subscription management (20.3.0)
- **Webhooks** - Payment events

### Storage

- **AWS S3** - File storage (eu-central-1)
- **Company logos** - Brand assets

## Build & Deploy

### Build System

- **npm** - Package manager
- **Next.js Build** - Production builds
- **ESLint** - Code linting

### Deployment

- **Vercel** - Hosting platform
- **Edge Functions** - API routes
- **Image Optimization** - WebP/AVIF

## Key Libraries

| Library      | Purpose             |
| ------------ | ------------------- |
| date-fns     | Date utilities      |
| html2pdf.js  | PDF generation      |
| qrcode.react | QR code generation  |
| xlsx         | Excel file handling |
| Sonner       | Toast notifications |
| GSAP         | Advanced animations |

## Development Tools

- **TypeScript** - Type safety
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Tailwind** - Utility CSS
