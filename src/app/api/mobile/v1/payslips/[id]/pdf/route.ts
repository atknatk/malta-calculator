import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getEmployments,
  mobileError,
  requireMobileUser,
} from "@/lib/mobile/employee-session";
import { isPdfArchiveEnabled } from "@/lib/payslip/pdf-archive";
import { payslipPdfResponse } from "@/lib/payslip/pdf-response";
import { ISSUED_STATUSES } from "@/utils/payslip-details";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * GET /api/mobile/v1/payslips/:id/pdf
 * Yayınlanmış bordronun PDF'i: R2'deki dosyaya kısa ömürlü imzalı
 * bağlantıyla yönlendirir (302). Web'de indirilenle birebir aynı dosyadır.
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
  if (!isPdfArchiveEnabled()) {
    return mobileError(503, "unavailable", "PDF downloads are not enabled");
  }

  try {
    const supabase = createAdminClient();
    const employments = await getEmployments(supabase, session.userId);
    const { data } = await supabase
      .from("payslips")
      .select("employee_id")
      .eq("id", id)
      .in("status", ISSUED_STATUSES)
      .maybeSingle();
    const employeeId = (data as { employee_id: string } | null)?.employee_id;

    if (!employeeId || !employments.some((e) => e.employeeId === employeeId)) {
      return mobileError(404, "not_found", "Payslip not found");
    }
    return payslipPdfResponse(supabase, id);
  } catch (error) {
    console.error("Mobile payslip PDF error:", error);
    return mobileError(500, "internal", "Could not load the PDF");
  }
}

export const dynamic = "force-dynamic";
export const maxDuration = 60;
