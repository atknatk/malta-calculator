import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { mobileError, requireMobileUser } from "@/lib/mobile/employee-session";

const readSchema = z.union([
  z.object({ ids: z.array(z.string().uuid()).min(1).max(100) }),
  z.object({ all: z.literal(true) }),
]);

/**
 * POST /api/mobile/v1/notifications/read
 * Gövde: { "ids": [...] } ya da { "all": true }
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await requireMobileUser();
  if ("response" in session) return session.response;

  const parsed = readSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return mobileError(400, "invalid_request", "Invalid payload");
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("employee_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("clerk_user_id", session.userId)
    .is("read_at", null);
  if ("ids" in parsed.data) query = query.in("id", parsed.data.ids);

  const { error } = await query;
  if (error) {
    console.error("Mark notifications read error:", error);
    return mobileError(500, "internal", "Could not update notifications");
  }
  return NextResponse.json({ updated: true });
}

export const dynamic = "force-dynamic";
