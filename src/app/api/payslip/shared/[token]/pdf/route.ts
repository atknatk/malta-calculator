/**
 * Paylaşılan bordronun PDF'i (çalışan linki / QR doğrulama) — R2'den
 * Erişim, sayfadaki ile aynı imzalı çerezlerle doğrulanır (PIN ya da
 * captcha). ?version=<id> ile aynı bordronun önceki sürümleri indirilir.
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ACCESS_SCOPE,
  accessCookieName,
  isValidAccessCookie,
} from "@/lib/payslip/access-cookie";
import { payslipPdfResponse } from "@/lib/payslip/pdf-response";
import {
  currentVersion,
  loadPayslipVersions,
} from "@/lib/payslip/revisions";
import { firstRelation } from "@/lib/payslip/document-props";
import { ISSUED_STATUSES, PAYSLIP_STATUS } from "@/utils/payslip-details";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
): Promise<NextResponse> {
  const { token } = await params;
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("payslips")
    .select(
      "id, company_id, employee_id, period_year, period_month, employee:employees(date_of_birth)",
    )
    .eq("access_token", token)
    .in("status", ISSUED_STATUSES)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ error: "Payslip not found" }, { status: 404 });
  }
  const payslip = data as {
    id: string;
    company_id: string;
    employee_id: string;
    period_year: number;
    period_month: number;
    employee: { date_of_birth: string | null } | { date_of_birth: string | null }[] | null;
  };

  const cookieStore = await cookies();
  const hasCookie = (scope: typeof ACCESS_SCOPE.EMPLOYEE | typeof ACCESS_SCOPE.VERIFY) =>
    isValidAccessCookie(
      scope,
      payslip.id,
      cookieStore.get(accessCookieName(scope, payslip.id))?.value,
    );
  const needsPin = Boolean(firstRelation(payslip.employee)?.date_of_birth);
  if (
    needsPin &&
    !hasCookie(ACCESS_SCOPE.EMPLOYEE) &&
    !hasCookie(ACCESS_SCOPE.VERIFY)
  ) {
    return NextResponse.json({ error: "Not authorised" }, { status: 401 });
  }

  // Aynı bordronun sürümleri arasından istenen
  const versions = await loadPayslipVersions(supabase, payslip);
  const requestedId = request.nextUrl.searchParams.get("version") || payslip.id;
  const version = versions.find((item) => item.id === requestedId);
  if (!version) {
    return NextResponse.json({ error: "Payslip not found" }, { status: 404 });
  }

  const isVoid = version.status === PAYSLIP_STATUS.VOID;
  return payslipPdfResponse(supabase, version.id, {
    filenamePrefix: isVoid
      ? currentVersion(versions)
        ? "SUPERSEDED"
        : "VOID"
      : undefined,
    json: request.nextUrl.searchParams.has("json"),
  });
}
