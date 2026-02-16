import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { nanoid } from "nanoid";

// In-memory rate limiting (IP basina 10 req/dk)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in a minute." },
      { status: 429 },
    );
  }

  let body: { params: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.params || typeof body.params !== "object") {
    return NextResponse.json(
      { error: "Missing or invalid params" },
      { status: 400 },
    );
  }

  const token = nanoid(8);

  const supabase = createAdminClient();
  const { error } = await supabase.from("saved_calculations").insert({
    token,
    params: body.params as any,
    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  });

  if (error) {
    console.error("Failed to save calculation:", error);
    return NextResponse.json(
      { error: "Failed to save calculation" },
      { status: 500 },
    );
  }

  return NextResponse.json({ shortUrl: `/s/${token}`, token });
}
