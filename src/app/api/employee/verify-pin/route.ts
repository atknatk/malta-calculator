import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { getClientIp, verifyTurnstileToken } from "@/lib/turnstile";
import {
  ACCESS_SCOPE,
  accessCookieName,
  accessCookieOptions,
  createAccessCookieValue,
} from "@/lib/payslip/access-cookie";
import { firstRelation } from "@/lib/payslip/document-props";

const EMPLOYEE_ACCESS_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { payslipId, pin, captchaToken } = body as {
      payslipId?: string;
      pin?: string;
      captchaToken?: string;
    };

    if (!payslipId || !pin) {
      return NextResponse.json(
        { success: false, error: "Payslip ID and PIN are required" },
        { status: 400 },
      );
    }

    // Validate PIN format (DDMMYYYY)
    if (!/^\d{8}$/.test(pin)) {
      return NextResponse.json(
        { success: false, error: "Invalid PIN format. Use DDMMYYYY format." },
        { status: 400 },
      );
    }

    // Kaba kuvvet denemelerine karşı her denemede captcha
    const captchaOk = await verifyTurnstileToken(
      captchaToken,
      getClientIp(request.headers),
    );
    if (!captchaOk) {
      return NextResponse.json(
        { success: false, error: "Security check failed. Please try again." },
        { status: 403 },
      );
    }

    // Parse PIN to date
    const day = parseInt(pin.substring(0, 2), 10);
    const month = parseInt(pin.substring(2, 4), 10);
    const year = parseInt(pin.substring(4, 8), 10);

    // Basic validation
    if (
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 1900 ||
      year > 2100
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid date. Please enter a valid date." },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    // Get payslip with employee
    const { data: payslip, error } = await supabase
      .from("payslips")
      .select(
        `
                id,
                employee:employees(
                    date_of_birth
                )
            `,
      )
      .eq("id", payslipId)
      .eq("status", "final")
      .single();

    if (error || !payslip) {
      return NextResponse.json(
        { success: false, error: "Payslip not found" },
        { status: 404 },
      );
    }

    // Supabase tekil ilişkiyi nesne olarak döndürür (eski kod dizi
    // varsaydığı için doğum tarihi hiç okunmuyor, her PIN kabul ediliyordu)
    const employee = firstRelation(
      (payslip as { employee: unknown }).employee as
        | { date_of_birth: string | null }
        | { date_of_birth: string | null }[]
        | null,
    );

    // Doğum tarihi yoksa PIN gerekmez; varsa birebir eşleşmeli
    if (employee?.date_of_birth) {
      // YYYY-MM-DD metninden karşılaştır (saat dilimi kaymasını önler)
      const [dobYear, dobMonth, dobDay] = employee.date_of_birth
        .substring(0, 10)
        .split("-")
        .map(Number);

      if (day !== dobDay || month !== dobMonth || year !== dobYear) {
        return NextResponse.json(
          { success: false, error: "Incorrect PIN. Please try again." },
          { status: 401 },
        );
      }
    }

    // Set signed authentication cookie
    const cookieStore = await cookies();
    cookieStore.set(
      accessCookieName(ACCESS_SCOPE.EMPLOYEE, payslipId),
      createAccessCookieValue(
        ACCESS_SCOPE.EMPLOYEE,
        payslipId,
        EMPLOYEE_ACCESS_MAX_AGE,
      ),
      accessCookieOptions(EMPLOYEE_ACCESS_MAX_AGE),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PIN verification error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 },
    );
  }
}
