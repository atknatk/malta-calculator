import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getEmployments,
  mobileError,
  parseYear,
  requireMobileUser,
} from "@/lib/mobile/employee-session";
import { buildPayslipList } from "@/lib/mobile/payslip-list";
import { fetchMobilePayslipRows } from "@/lib/mobile/queries";

/**
 * GET /api/mobile/v1/payslips?year=2026&employeeId=<uuid>
 * Kullanıcının yayınlanmış ve geçersiz kılınmış bordroları, yeni dönem önce.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await requireMobileUser();
  if ("response" in session) return session.response;

  try {
    const supabase = createAdminClient();
    const employments = await getEmployments(supabase, session.userId);
    const filter = request.nextUrl.searchParams.get("employeeId");
    const employeeIds = employments
      .map((employment) => employment.employeeId)
      .filter((id) => !filter || id === filter);

    const rows = await fetchMobilePayslipRows(
      supabase,
      employeeIds,
      parseYear(request.nextUrl.searchParams.get("year")),
    );
    return NextResponse.json({ payslips: buildPayslipList(rows) });
  } catch (error) {
    console.error("Mobile payslips error:", error);
    return mobileError(500, "internal", "Could not load payslips");
  }
}

export const dynamic = "force-dynamic";
