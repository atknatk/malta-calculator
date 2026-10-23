/**
 * Yayınlanmış bordro PDF'ini R2'den verir (sunucu)
 * PDF henüz arşivlenmemişse (yayından hemen sonra ya da önceki deneme
 * başarısızsa) o an üretilip R2'ye yazılır; ardından kısa ömürlü imzalı
 * bağlantıya yönlendirilir. Bucket herkese açık değildir.
 */
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  archivePayslipPdf,
  getPayslipPdfArchive,
} from "@/lib/payslip/pdf-archive";
import { buildPayslipFilename } from "@/lib/payslip/download-pdf";
import { getR2DownloadUrl } from "@/lib/r2/client";
import type { PayslipSnapshot } from "@/lib/payslip/snapshot";

export async function payslipPdfResponse(
  supabase: SupabaseClient,
  payslipId: string,
  /** Dosya adı öneki, ör. "SUPERSEDED" (eski sürüm) */
  options: {
    filenamePrefix?: string;
    /** true: { url } JSON döner (istemci hata olursa tarayıcıda çizer) */
    json?: boolean;
  } = {},
): Promise<NextResponse> {
  let archive = await getPayslipPdfArchive(supabase, payslipId);
  if (!archive) {
    const result = await archivePayslipPdf(supabase, payslipId);
    if (result.status !== "archived" && result.status !== "exists") {
      return NextResponse.json(
        { error: "PDF is not available yet, please try again shortly" },
        { status: 503 },
      );
    }
    archive = result.archive;
  }

  const { data } = await supabase
    .from("payslips")
    .select("snapshot")
    .eq("id", payslipId)
    .maybeSingle();
  const document = (data?.snapshot as PayslipSnapshot | null)?.document;

  try {
    const url = await getR2DownloadUrl(
      archive.storage_key,
      buildPayslipFilename(
        document?.payslipNumber,
        document?.employee.name,
        options.filenamePrefix,
      ),
    );
    return options.json ? NextResponse.json({ url }) : NextResponse.redirect(url);
  } catch (error) {
    console.error("Payslip PDF download failed:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
