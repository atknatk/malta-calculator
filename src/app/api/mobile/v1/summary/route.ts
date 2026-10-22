import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getEmployments,
  mobileError,
  parseYear,
  requireMobileUser,
} from "@/lib/mobile/employee-session";
import { summarizeYear } from "@/lib/mobile/payslip-list";
import { fetchMobilePayslipRows } from "@/lib/mobile/queries";

/**
 * GET /api/mobile/v1/summary?year=2026
 * İşveren başına yıl toplamları (brüt, net, vergi, SSC); yalnızca final
 * bordrolar sayılır. Ana ekran ve FS3 öncesi takip için.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const session = await requireMobileUser();
  if ("response" in session) return session.response;

  const year =
    parseYear(request.nextUrl.searchParams.get("year")) ??
    new Date().getFullYear();

  try {
    const supabase = createAdminClient();
    const employments = await getEmployments(supabase, session.userId);
    const rows = await fetchMobilePayslipRows(
      supabase,
      employments.map((employment) => employment.employeeId),
      year,
    );
    return NextResponse.json({ year, employers: summarizeYear(rows, year) });
  } catch (error) {
    console.error("Mobile summary error:", error);
    return mobileError(500, "internal", "Could not load the summary");
  }
}

export const dynamic = "force-dynamic";
