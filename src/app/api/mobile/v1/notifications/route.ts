import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { mobileError, requireMobileUser } from "@/lib/mobile/employee-session";

/** GET /api/mobile/v1/notifications — son 50 bildirim ve okunmamış sayısı */
export async function GET(): Promise<NextResponse> {
  const session = await requireMobileUser();
  if ("response" in session) return session.response;

  const supabase = createAdminClient();
  const [{ data, error }, { count }] = await Promise.all([
    supabase
      .from("employee_notifications")
      .select("id, type, title, body, data, read_at, created_at")
      .eq("clerk_user_id", session.userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("employee_notifications")
      .select("id", { count: "exact", head: true })
      .eq("clerk_user_id", session.userId)
      .is("read_at", null),
  ]);
  if (error) {
    console.error("Mobile notifications error:", error);
    return mobileError(500, "internal", "Could not load notifications");
  }

  return NextResponse.json({
    unreadCount: count ?? 0,
    notifications: (data ?? []).map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      body: row.body,
      data: row.data,
      readAt: row.read_at,
      createdAt: row.created_at,
    })),
  });
}

export const dynamic = "force-dynamic";
