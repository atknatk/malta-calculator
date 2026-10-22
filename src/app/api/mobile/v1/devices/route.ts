import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { mobileError, requireMobileUser } from "@/lib/mobile/employee-session";

const registerSchema = z.object({
  fcmToken: z.string().min(20).max(4096),
  platform: z.enum(["ios", "android"]),
  appVersion: z.string().max(32).optional(),
});

const unregisterSchema = z.object({
  fcmToken: z.string().min(20).max(4096),
});

/**
 * POST /api/mobile/v1/devices
 * Push token kaydı. Aynı token başka kullanıcıdaysa (cihazda hesap
 * değişti) bu kullanıcıya taşınır.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const session = await requireMobileUser();
  if ("response" in session) return session.response;

  const parsed = registerSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return mobileError(400, "invalid_request", "Invalid device payload");
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("employee_devices").upsert(
    {
      clerk_user_id: session.userId,
      fcm_token: parsed.data.fcmToken,
      platform: parsed.data.platform,
      app_version: parsed.data.appVersion ?? null,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "fcm_token" },
  );
  if (error) {
    console.error("Device register error:", error);
    return mobileError(500, "internal", "Could not register the device");
  }
  return NextResponse.json({ registered: true });
}

/** DELETE /api/mobile/v1/devices — çıkışta push token'ını siler */
export async function DELETE(request: Request): Promise<NextResponse> {
  const session = await requireMobileUser();
  if ("response" in session) return session.response;

  const parsed = unregisterSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return mobileError(400, "invalid_request", "Invalid device payload");
  }

  const supabase = createAdminClient();
  await supabase
    .from("employee_devices")
    .delete()
    .eq("clerk_user_id", session.userId)
    .eq("fcm_token", parsed.data.fcmToken);
  return NextResponse.json({ unregistered: true });
}

export const dynamic = "force-dynamic";
