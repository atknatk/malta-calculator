/**
 * QR doğrulama erişimi
 * Turnstile captcha'sı geçilirse yayınlanmış bordronun tam belgesini
 * göstermek için imzalı, kısa ömürlü bir çerez verir.
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClientIp, verifyTurnstileToken } from "@/lib/turnstile";
import {
  ACCESS_SCOPE,
  accessCookieName,
  accessCookieOptions,
  createAccessCookieValue,
} from "@/lib/payslip/access-cookie";
import { PAYSLIP_STATUS } from "@/utils/payslip-details";

const VERIFY_ACCESS_MAX_AGE = 60 * 60; // 1 saat

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      token?: string;
      captchaToken?: string;
    };

    if (!body.token || typeof body.token !== "string") {
      return NextResponse.json(
        { success: false, error: "Verification code is required" },
        { status: 400 },
      );
    }

    const captchaOk = await verifyTurnstileToken(
      body.captchaToken,
      getClientIp(request.headers),
    );
    if (!captchaOk) {
      return NextResponse.json(
        { success: false, error: "Security check failed. Please try again." },
        { status: 403 },
      );
    }

    const supabase = createAdminClient();
    const { data: payslip } = await supabase
      .from("payslips")
      .select("id")
      .eq("access_token", body.token)
      .eq("status", PAYSLIP_STATUS.FINAL)
      .maybeSingle();

    if (!payslip) {
      return NextResponse.json(
        { success: false, error: "Payslip not found" },
        { status: 404 },
      );
    }

    const payslipId = (payslip as { id: string }).id;
    const cookieStore = await cookies();
    cookieStore.set(
      accessCookieName(ACCESS_SCOPE.VERIFY, payslipId),
      createAccessCookieValue(
        ACCESS_SCOPE.VERIFY,
        payslipId,
        VERIFY_ACCESS_MAX_AGE,
      ),
      accessCookieOptions(VERIFY_ACCESS_MAX_AGE),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify access error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 },
    );
  }
}
