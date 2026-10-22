/**
 * Arşivlenmiş bordro PDF'ini indirir (şirket sahibi)
 * R2 bucket'ı herkese açık değildir; kısa ömürlü imzalı bağlantıya yönlendirir.
 */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPayslipPdfArchive } from "@/lib/payslip/pdf-archive";
import { buildPayslipFilename } from "@/lib/payslip/download-pdf";
import { getR2DownloadUrl } from "@/lib/r2/client";
import type { PayslipSnapshot } from "@/lib/payslip/snapshot";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
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

  const archive = await getPayslipPdfArchive(supabase, id);
  if (!archive || archive.company_id !== (company as { id: string }).id) {
    return NextResponse.json({ error: "Archived PDF not found" }, { status: 404 });
  }

  const { data: payslip } = await supabase
    .from("payslips")
    .select("snapshot")
    .eq("id", id)
    .maybeSingle();
  const document = (payslip?.snapshot as PayslipSnapshot | null)?.document;

  try {
    const url = await getR2DownloadUrl(
      archive.storage_key,
      buildPayslipFilename(document?.payslipNumber, document?.employee.name),
    );
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Archived PDF download failed:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
