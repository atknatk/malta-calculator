# Payslip Generator SaaS - Implementation Plan

## Proje Özeti

Malta Salary Calculator'ı küçük firmalar için uygun fiyatlı (€1/ay), kullanımı kolay bir **Payslip Generator SaaS** platformuna dönüştürmek.

---

## ✅ Alınan Kararlar

| Karar                   | Seçim                                   |
| ----------------------- | --------------------------------------- |
| **Auth**                | Clerk (basit, 100-1000 user için ideal) |
| **Free Tier Watermark** | "Powered by Malta Calculator"           |
| **Fiyatlandırma**       | €1/ay Basic, €5/ay Pro                  |
| **Employee Erişimi**    | Secure link + PIN (magic link değil)    |
| **Mobile App**          | Web bittikten sonra                     |

---

## 🎯 Hedef Kitle

| Segment        | Beklenti                         |
| -------------- | -------------------------------- |
| **Firmalar**   | 100-1000 kullanıcı               |
| **Çalışanlar** | Her firma ~5-50 çalışan (mobile) |

---

## 🏗️ Önerilen Teknik Mimari

### Backend-less Yaklaşım (Tercih Edilen)

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 14)                    │
├─────────────────────────────────────────────────────────────┤
│  Auth: Clerk          │  DB: Supabase        │  Payments    │
│  - Google OAuth       │  - PostgreSQL        │  - Stripe    │
│  - Magic Link         │  - Row Level Sec.    │              │
│  - Session Mgmt       │  - Real-time         │              │
└─────────────────────────────────────────────────────────────┘
```

### Teknoloji Seçimleri

| Kategori           | Seçim                   | Neden                                                |
| ------------------ | ----------------------- | ---------------------------------------------------- |
| **Auth**           | **Clerk**               | Google OAuth, Magic Link, güçlü free tier (10k MAU)  |
| **Database**       | **Supabase**            | PostgreSQL, Row Level Security, Real-time, Free tier |
| **Payments**       | **Stripe**              | Subscription yönetimi, €1 micro-payments desteği     |
| **PDF Generation** | **@react-pdf/renderer** | Client-side PDF, server maliyeti yok                 |
| **Mobile**         | **Expo + React Native** | Web bilgisi ile hızlı geliştirme                     |

---

## 📊 Data Model

```sql
-- Supabase Tables (RLS enabled)

companies (
  id UUID PRIMARY KEY,
  name TEXT,
  logo_url TEXT,
  address TEXT,
  tax_number TEXT,
  clerk_user_id TEXT UNIQUE,  -- Company owner
  plan TEXT DEFAULT 'free',   -- 'free' | 'basic' | 'pro'
  created_at TIMESTAMP
)

employees (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies,
  name TEXT,
  email TEXT,
  employee_code TEXT,
  position TEXT,
  salary_details JSONB,
  created_at TIMESTAMP
)

payslips (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies,
  employee_id UUID REFERENCES employees,
  period_month INTEGER,
  period_year INTEGER,
  gross_salary DECIMAL,
  net_salary DECIMAL,
  deductions JSONB,
  pdf_url TEXT,
  created_at TIMESTAMP,

  -- Rate limiting
  CONSTRAINT unique_payslip_per_period
    UNIQUE (employee_id, period_month, period_year)
)

-- Daily usage tracking for rate limiting
daily_usage (
  id UUID PRIMARY KEY,
  company_id UUID REFERENCES companies,
  date DATE,
  payslips_generated INTEGER DEFAULT 0,

  CONSTRAINT unique_daily_usage UNIQUE (company_id, date)
)
```

---

## 🚦 Rate Limiting & Subscription Tiers

| Plan      | Günlük Limit   | Özellikler                   | Fiyat |
| --------- | -------------- | ---------------------------- | ----- |
| **Free**  | 2 payslip/gün  | Temel payslip, watermark     | €0    |
| **Basic** | 10 payslip/gün | Watermark yok, custom logo   | €1/ay |
| **Pro**   | Sınırsız       | Branding, API access, export | €5/ay |

### Rate Limiting Mekanizması

```typescript
// Supabase Function veya Next.js API Route
async function canGeneratePayslip(companyId: string): Promise<boolean> {
  const today = new Date().toISOString().split("T")[0];
  const plan = await getCompanyPlan(companyId);
  const dailyLimit = PLAN_LIMITS[plan];

  const { data: usage } = await supabase
    .from("daily_usage")
    .select("payslips_generated")
    .eq("company_id", companyId)
    .eq("date", today)
    .single();

  return (usage?.payslips_generated ?? 0) < dailyLimit;
}
```

---

## 🎨 UI/UX Yaklaşımı: Modern Minimal SaaS

Klasik admin paneli yerine **task-focused, wizard-style** arayüz:

### Ana Akışlar

```
1. ONBOARDING (First Time)
   ┌──────────────────────────────────────┐
   │  🏢 Firma Bilgilerinizi Girin        │
   │  ────────────────────────────────    │
   │  [Firma Adı]                         │
   │  [Logo Yükle]                        │
   │  [Adres]                             │
   │                    [Devam →]         │
   └──────────────────────────────────────┘

2. DASHBOARD (Minimal)
   ┌──────────────────────────────────────┐
   │  Merhaba, Firma XYZ 👋               │
   │  ────────────────────────────────    │
   │  [➕ Yeni Payslip Oluştur]           │
   │                                      │
   │  Son Oluşturulanlar:                 │
   │  • Jan 2025 - Ali V. ↓              │
   │  • Jan 2025 - Mehmet K. ↓           │
   │                                      │
   │  Bugün: 1/2 payslip kullandınız     │
   └──────────────────────────────────────┘

3. PAYSLIP WIZARD
   ┌──────────────────────────────────────┐
   │  Step 1/3: Çalışan Bilgileri         │
   │  ────────────────────────────────    │
   │  [Mevcut Çalışan Seç ▼]              │
   │  veya                                │
   │  [+ Yeni Çalışan Ekle]               │
   └──────────────────────────────────────┘

   ┌──────────────────────────────────────┐
   │  Step 2/3: Dönem & Maaş              │
   │  ────────────────────────────────    │
   │  [Ocak ▼] [2025 ▼]                   │
   │  Brüt Maaş: [€ 2,500]                │
   │  ─ Salary Calculator Integration ─   │
   │  Net: €1,850  Tax: €450  SSC: €200   │
   └──────────────────────────────────────┘

   ┌──────────────────────────────────────┐
   │  Step 3/3: Önizleme & İndir          │
   │  ────────────────────────────────    │
   │  ┌────────────────────────────────┐  │
   │  │       [PDF PREVIEW]            │  │
   │  │       Malta Payslip            │  │
   │  └────────────────────────────────┘  │
   │  [↓ PDF İndir]  [📧 Email Gönder]    │
   └──────────────────────────────────────┘
```

---

## 📱 Mobile App Stratejisi (Faz 2)

### Çalışan Erişim Akışı

```
1. Firma, çalışana unique link gönderir
2. Çalışan linke tıklar → Magic Link ile giriş
3. Sadece kendi payslip'lerini görür

Mobile Stack:
- Expo + React Native
- Clerk (same auth, shared users)
- Supabase Real-time (anında payslip bildirimi)
```

---

## 📋 Implementation Phases

### Phase 1: Core Authentication + Database Setup (1-2 gün)

- [ ] Clerk entegrasyonu
  - [ ] Google OAuth yapılandırması
  - [ ] Middleware setup
  - [ ] Protected routes
- [ ] Supabase setup
  - [ ] Tablo oluşturma
  - [ ] Row Level Security policies
  - [ ] TypeScript types oluşturma

### Phase 2: Company Onboarding + Dashboard (2-3 gün)

- [ ] Onboarding wizard
  - [ ] Firma bilgileri formu
  - [ ] Logo upload (Supabase Storage)
- [ ] Minimal dashboard
  - [ ] Son payslip'ler listesi
  - [ ] Günlük kullanım göstergesi
  - [ ] Quick actions

### Phase 3: Payslip Generation (2-3 gün)

- [ ] Payslip wizard
  - [ ] Çalışan seçimi/ekleme
  - [ ] Salary Calculator entegrasyonu (mevcut engine)
  - [ ] PDF preview
- [ ] PDF generation
  - [ ] @react-pdf/renderer ile template
  - [ ] Supabase Storage'a kaydetme
- [ ] Rate limiting uygulaması

### Phase 4: Subscription & Payments (2-3 gün)

- [ ] Stripe entegrasyonu
- [ ] Subscription tiers UI
- [ ] Upgrade/downgrade akışı
- [ ] Billing history

### Phase 5: Employee Access Portal (1-2 gün)

- [ ] Secure link generation (per employee)
- [ ] PIN verification (son 4 hane tel veya doğum tarihi)
- [ ] Payslip viewing
- [ ] Download history

### Phase 6: Mobile App (Web bittikten sonra)

- [ ] Expo project setup
- [ ] Same secure link + PIN auth
- [ ] Push notifications for new payslips

---

## 🔒 Security Considerations

1. **Row Level Security (RLS)**
   - Kullanıcılar sadece kendi firma verilerine erişebilir
   - Çalışanlar sadece kendi payslip'lerini görebilir

2. **Clerk + Supabase Integration**
   - Clerk JWT → Supabase custom claim
   - RLS policies Clerk user_id'ye bağlı

3. **Rate Limiting**
   - Database-level günlük sayaç
   - Plan bazlı limitler

---

## ⚙️ Technical Decisions

### Alternatif Karşılaştırma

| Aspect           | Clerk + Supabase | Firebase + Auth    | Auth.js + Prisma |
| ---------------- | ---------------- | ------------------ | ---------------- |
| **Setup Hızı**   | ⭐⭐⭐           | ⭐⭐               | ⭐               |
| **Free Tier**    | 10k MAU          | 50k MAU            | Sınırsız         |
| **PostgreSQL**   | ✅ Native        | ❌ NoSQL           | ✅ Prisma        |
| **RLS Support**  | ✅ Native        | ❌ Firestore Rules | ❌ App-level     |
| **Mobile Ready** | ✅               | ✅                 | ❌               |

**Tercih: Clerk + Supabase** - En iyi developer experience ve mobile-ready yapı.

---

## Verification Plan

### Manuel Test Adımları

1. **Auth Flow**
   - Google ile giriş yapma
   - Logout ve tekrar login
   - Session persistence kontrolü

2. **Payslip Generation**
   - Yeni çalışan ekleme
   - Payslip oluşturma
   - PDF indirme

3. **Rate Limiting**
   - Free plan ile 3. payslip deneme (engellenecek)
   - Günlük reset kontrolü

---

## 👤 Çalışan Erişim Stratejisi (Hibrit)

**2 Seçenek - Çalışan istediğini seçer:**

```
┌─────────────────────────────────────────────────────────────┐
│  Payslip Erişimi                                            │
│  ─────────────────                                          │
│                                                             │
│  🔐 [Google ile Giriş Yap]     ← Tercih eden için           │
│                                  (tüm payslip'leri görür)   │
│  ────────── veya ──────────                                 │
│                                                             │
│  🔗 Link + PIN ile Devam Et    ← Hızlı erişim               │
│  [abc123] [PIN: ____]            (tek payslip görür)        │
└─────────────────────────────────────────────────────────────┘
```

| Yöntem       | Avantaj                            | Dezavantaj                 |
| ------------ | ---------------------------------- | -------------------------- |
| **Login**    | Tüm payslip'lere tek yerden erişim | Hesap oluşturma gerekli    |
| **Link+PIN** | Anında erişim, hesap yok           | Her payslip için ayrı link |

**Teknik:**

- Login yapan çalışan → Clerk ile employee account
- Link+PIN → Session-less, DB'de hashed PIN kontrolü
- Mobile app → Her iki yöntemi de destekler
