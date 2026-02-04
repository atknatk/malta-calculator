# Malta Calculator - API Rules

Bu dosya, Malta Calculator projesindeki API endpoint yapısını ve kurallarını tanımlar.

---

## API Yapısı

### 1. Dosya Konumu

```
src/app/api/
├── salary/
│   └── calculate/
│       └── route.ts        # POST /api/salary/calculate
├── payslip/
│   └── generate/
│       └── route.ts        # POST /api/payslip/generate
├── employee/
│   └── verify-pin/
│       └── route.ts        # POST /api/employee/verify-pin
├── stripe/
│   ├── checkout/
│   │   └── route.ts        # POST /api/stripe/checkout
│   └── webhook/
│       └── route.ts        # POST /api/stripe/webhook
└── og/
    └── route.ts            # GET /api/og (OG image generation)
```

---

## API Route Template

### 2. Temel API Route Yapısı

```typescript
// src/app/api/[endpoint]/route.ts
import { NextRequest, NextResponse } from "next/server";

// POST endpoint
export async function POST(request: NextRequest) {
  try {
    // 1. Request body'yi parse et
    const body = await request.json();

    // 2. Validation
    if (!body.requiredField) {
      return NextResponse.json(
        { error: "Missing required field: requiredField" },
        { status: 400 },
      );
    }

    // 3. İşlemi gerçekleştir
    const result = await processData(body);

    // 4. Başarılı response
    return NextResponse.json(result);
  } catch (error) {
    // 5. Hata yönetimi
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// GET endpoint (opsiyonel - dokümantasyon için)
export async function GET() {
  return NextResponse.json({
    endpoint: "/api/[endpoint]",
    method: "POST",
    description: "Endpoint açıklaması",
    body: {
      requiredField: "string - açıklama",
      optionalField: "number - (optional) açıklama",
    },
    response: {
      result: "type - açıklama",
    },
  });
}
```

---

## Kimlik Doğrulama

### 3. Token Authentication

Public API endpoint'leri için token doğrulama:

```typescript
export async function POST(request: NextRequest) {
  // Token kontrolü
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (token !== process.env.SALARY_API_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // İşleme devam et...
}
```

### 4. Clerk Authentication

Kullanıcı kimlik doğrulaması gerektiren endpoint'ler için:

```typescript
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  // Clerk auth kontrolü
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Kullanıcı bilgilerini al
  // ...
}
```

---

## Validation

### 5. Request Validation Pattern

```typescript
interface RequestBody {
  grossSalary: number;
  year: number;
  taxType: string;
}

function validateRequest(body: unknown): body is RequestBody {
  if (!body || typeof body !== "object") return false;

  const b = body as Record<string, unknown>;

  return (
    typeof b.grossSalary === "number" &&
    b.grossSalary > 0 &&
    typeof b.year === "number" &&
    b.year >= 2020 &&
    b.year <= 2030 &&
    typeof b.taxType === "string"
  );
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!validateRequest(body)) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  // body artık RequestBody tipinde
}
```

---

## Rate Limiting

### 6. Plan-Based Rate Limiting

```typescript
import { createClient } from "@/lib/supabase/server";

async function checkRateLimit(
  companyId: string,
  plan: string,
): Promise<boolean> {
  const supabase = await createClient();

  // Bugünün kullanımını kontrol et
  const today = new Date().toISOString().split("T")[0];

  const { data } = await supabase
    .from("daily_usage")
    .select("payslips_generated")
    .eq("company_id", companyId)
    .eq("date", today)
    .single();

  const used = data?.payslips_generated || 0;

  // Plan limitleri
  const limits = {
    free: 2,
    basic: 10,
    pro: 100,
  };

  const limit = limits[plan as keyof typeof limits] || 2;

  return used < limit;
}

export async function POST(request: NextRequest) {
  // ...auth checks...

  const canProceed = await checkRateLimit(companyId, plan);

  if (!canProceed) {
    return NextResponse.json(
      { error: "Rate limit exceeded for your plan" },
      { status: 429 },
    );
  }

  // İşleme devam et...
}
```

---

## Response Format

### 7. Standart Response Yapıları

#### Başarılı Response

```typescript
// 200 OK
return NextResponse.json({
    success: true,
    data: {
        // result data
    },
});

// veya doğrudan data
return NextResponse.json({
    total: 12345,
    breakdown: { ... },
});
```

#### Hata Response'ları

```typescript
// 400 Bad Request - Validation hatası
return NextResponse.json({ error: "Invalid salary value" }, { status: 400 });

// 401 Unauthorized - Auth hatası
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// 403 Forbidden - Yetki hatası
return NextResponse.json({ error: "Forbidden" }, { status: 403 });

// 404 Not Found
return NextResponse.json({ error: "Resource not found" }, { status: 404 });

// 429 Too Many Requests - Rate limit
return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

// 500 Internal Server Error
return NextResponse.json({ error: "Internal server error" }, { status: 500 });
```

---

## Supabase Entegrasyonu

### 8. Database Operations

```typescript
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // SELECT
  const { data: records, error: selectError } = await supabase
    .from("table_name")
    .select("*")
    .eq("column", value);

  if (selectError) {
    console.error("Database error:", selectError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // INSERT
  const { data: newRecord, error: insertError } = await supabase
    .from("table_name")
    .insert({ column: value })
    .select()
    .single();

  // UPDATE
  const { error: updateError } = await supabase
    .from("table_name")
    .update({ column: newValue })
    .eq("id", recordId);

  // DELETE
  const { error: deleteError } = await supabase
    .from("table_name")
    .delete()
    .eq("id", recordId);
}
```

---

## Stripe Entegrasyonu

### 9. Stripe Webhook

```typescript
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Event handling
  switch (event.type) {
    case "checkout.session.completed":
      // Handle successful checkout
      break;
    case "customer.subscription.updated":
      // Handle subscription update
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
```

---

## Error Handling

### 10. Try-Catch Pattern

```typescript
export async function POST(request: NextRequest) {
  try {
    // İşlemler...
    return NextResponse.json(result);
  } catch (error) {
    // Hata loglama
    console.error("API Error:", {
      endpoint: "/api/endpoint",
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Kullanıcıya genel hata mesajı
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
```

---

## CORS (Gerekirse)

### 11. CORS Headers

```typescript
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(request: NextRequest) {
  // ... işlem ...

  return NextResponse.json(result, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
```

---

## API Endpoint Listesi

### 12. Mevcut Endpoint'ler

| Endpoint                   | Method | Auth             | Açıklama                |
| -------------------------- | ------ | ---------------- | ----------------------- |
| `/api/salary/calculate`    | POST   | Token            | Maaş hesaplama          |
| `/api/payslip/generate`    | POST   | Clerk            | Bordro oluşturma        |
| `/api/employee/verify-pin` | POST   | None             | Çalışan PIN doğrulama   |
| `/api/stripe/checkout`     | POST   | Clerk            | Stripe checkout session |
| `/api/stripe/webhook`      | POST   | Stripe Signature | Stripe webhook          |
| `/api/og`                  | GET    | None             | OG image oluşturma      |

---

## Best Practices

### 13. API Geliştirme Kuralları

1. **Type Safety**: Tüm request/response'lar için TypeScript interface kullan
2. **Validation**: Request body'yi her zaman validate et
3. **Error Handling**: Try-catch ile hataları yakala ve logla
4. **Logging**: Önemli işlemleri logla (production'da hata ayıklama için)
5. **Rate Limiting**: Public endpoint'lerde rate limiting uygula
6. **Authentication**: Hassas endpoint'leri koruma altına al
7. **Documentation**: GET endpoint'te API dokümantasyonu sağla
