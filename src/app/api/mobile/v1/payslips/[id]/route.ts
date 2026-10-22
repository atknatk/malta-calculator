import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getEmployments,
  mobileError,
  requireMobileUser,
} from "@/lib/mobile/employee-session";
import { fetchPublishedPayslipDocument } from "@/lib/payslip/document-props";
import { formatFingerprint } from "@/lib/payslip/snapshot";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/mobile/v1/payslips/:id
 * Tek bordronun belge verisi. Yayınlanmış bordro dondurulmuş snapshot'tan
 * gelir; `integrity` parmak izi doğrulamasının sonucudur.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await requireMobileUser();
  if ("response" in session) return session.response;

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return mobileError(404, "not_found", "Payslip not found");
  }

  try {
    const supabase = createAdminClient();
    const employments = await getEmployments(supabase, session.userId);
    const result = await fetchPublishedPayslipDocument(supabase, {
      column: "id",
      value: id,
    });

    // Başka çalışanın bordrosu ile hiç olmayan bordro ayırt edilmez
    if (
      !result ||
      !employments.some((e) => e.employeeId === result.payslip.employee_id)
    ) {
      return mobileError(404, "not_found", "Payslip not found");
    }

    const { payslip, props, integrity } = result;
    return NextResponse.json({
      payslip: {
        id: payslip.id,
        employeeId: payslip.employee_id,
        companyId: payslip.company_id,
        status: payslip.status,
        issuedAt: payslip.finalized_at ?? null,
        voidedAt: payslip.voided_at ?? null,
        voidReason: payslip.void_reason ?? null,
        integrity,
        fingerprint: payslip.content_hash
          ? formatFingerprint(payslip.content_hash)
          : null,
      },
      document: props,
    });
  } catch (error) {
    console.error("Mobile payslip detail error:", error);
    return mobileError(500, "internal", "Could not load the payslip");
  }
}

export const dynamic = "force-dynamic";
