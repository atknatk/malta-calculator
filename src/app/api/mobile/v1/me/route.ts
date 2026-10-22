import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  claimPendingInvites,
  getEmployments,
  getVerifiedEmails,
  mobileError,
  requireMobileUser,
} from "@/lib/mobile/employee-session";

/**
 * GET /api/mobile/v1/me
 * Bekleyen davetleri doğrulanmış e-postayla hesaba bağlar ve kullanıcının
 * işveren kayıtlarını döner. Uygulama girişten sonra ilk bunu çağırır.
 */
export async function GET(): Promise<NextResponse> {
  const session = await requireMobileUser();
  if ("response" in session) return session.response;

  try {
    const supabase = createAdminClient();
    const emails = await getVerifiedEmails(session.userId);
    await claimPendingInvites(supabase, session.userId, emails);
    const employments = await getEmployments(supabase, session.userId);

    return NextResponse.json({
      user: { id: session.userId, emails },
      employments,
    });
  } catch (error) {
    console.error("Mobile me error:", error);
    return mobileError(500, "internal", "Something went wrong");
  }
}

/**
 * DELETE /api/mobile/v1/me
 * Uygulama içinden hesap silme (App Store zorunluluğu). Eşlemeler, cihazlar
 * ve bildirimler silinir; bordrolar şirketin kaydı olarak kalır. Kullanıcı
 * aynı zamanda bir şirket hesabıysa Clerk kullanıcısı silinmez.
 */
export async function DELETE(): Promise<NextResponse> {
  const session = await requireMobileUser();
  if ("response" in session) return session.response;

  try {
    const supabase = createAdminClient();
    const { userId } = session;

    await supabase
      .from("employee_notifications")
      .delete()
      .eq("clerk_user_id", userId);
    await supabase
      .from("employee_devices")
      .delete()
      .eq("clerk_user_id", userId);
    await supabase
      .from("employee_accounts")
      .delete()
      .eq("clerk_user_id", userId);

    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("clerk_user_id", userId)
      .maybeSingle();
    if (!company) {
      const client = await clerkClient();
      await client.users.deleteUser(userId);
    }

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Mobile account delete error:", error);
    return mobileError(500, "internal", "Could not delete the account");
  }
}

export const dynamic = "force-dynamic";
