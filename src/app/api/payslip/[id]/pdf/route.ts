/**
 * Yayınlanmış bordronun PDF'i (şirket sahibi) — R2'den
 */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { payslipPdfResponse } from "@/lib/payslip/pdf-response";
import { ISSUED_STATUSES, type PayslipStatus } from "@/utils/payslip-details";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = createAdminClient();

  const { data: company } = await supabase
    .from("companies")
    .select("id")
    .eq("clerk_user_id", userId)
    .single();
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const { data: payslip } = await supabase
    .from("payslips")
    .select("status")
    .eq("id", id)
    .eq("company_id", (company as { id: string }).id)
    .maybeSingle();
  const status = (payslip as { status: PayslipStatus } | null)?.status;
  if (!status || !ISSUED_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Payslip not found" }, { status: 404 });
  }

  return payslipPdfResponse(supabase, id, {
    filenamePrefix: status === "void" ? "VOID" : undefined,
    json: new URL(request.url).searchParams.has("json"),
  });
}
