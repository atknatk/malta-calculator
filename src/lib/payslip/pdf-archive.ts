/**
 * Yayınlanmış bordroların R2 PDF arşivi (sunucu)
 * issuePayslip başarılı olunca PDF yanıttan sonra (after) üretilir ve R2'ye
 * yüklenir; nesne anahtarı ile PDF'in SHA-256'sı payslip_pdf_archives
 * tablosuna bir kez yazılır. Başarısız denemeler cron ile tekrarlanır.
 * Tüm adımlar idempotent: aynı bordro için tekrar çağırmak güvenlidir.
 */
import { createHash } from "crypto";
import { after } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { headR2Object, isR2Configured, putR2Pdf } from "@/lib/r2/client";
import {
  isPdfRendererConfigured,
  renderPayslipPdf,
} from "@/lib/payslip/pdf-renderer";
import { verifySnapshot, type PayslipSnapshot } from "@/lib/payslip/snapshot";
import { ISSUED_STATUSES, type PayslipStatus } from "@/utils/payslip-details";

export const PDF_ARCHIVE_TABLE = "payslip_pdf_archives";

export interface PayslipPdfArchive {
  payslip_id: string;
  company_id: string;
  storage_key: string;
  pdf_sha256: string;
  size_bytes: number;
  content_hash: string;
  archived_at: string;
}

export type ArchiveResult =
  | { status: "archived" | "exists"; archive: PayslipPdfArchive }
  | { status: "skipped" | "failed"; error: string };

export function isPdfArchiveEnabled(): boolean {
  return isR2Configured() && isPdfRendererConfigured();
}

/** R2 nesne anahtarı: payslips/<şirket>/<yıl>/<ay>/<bordro>.pdf */
export function buildArchiveKey(payslip: {
  id: string;
  company_id: string;
  period_year: number;
  period_month: number;
}): string {
  const month = String(payslip.period_month).padStart(2, "0");
  return `payslips/${payslip.company_id}/${payslip.period_year}/${month}/${payslip.id}.pdf`;
}

export function sha256Hex(data: Buffer): string {
  return createHash("sha256").update(data).digest("hex");
}

export async function getPayslipPdfArchive(
  supabase: SupabaseClient,
  payslipId: string,
): Promise<PayslipPdfArchive | null> {
  const { data } = await supabase
    .from(PDF_ARCHIVE_TABLE)
    .select("*")
    .eq("payslip_id", payslipId)
    .maybeSingle();
  return (data as PayslipPdfArchive | null) ?? null;
}

interface ArchivablePayslip {
  id: string;
  company_id: string;
  period_year: number;
  period_month: number;
  status: PayslipStatus;
  snapshot: PayslipSnapshot | null;
  content_hash: string | null;
}

/** Tek bir yayınlanmış bordroyu arşivler (idempotent) */
export async function archivePayslipPdf(
  supabase: SupabaseClient,
  payslipId: string,
): Promise<ArchiveResult> {
  if (!isPdfArchiveEnabled()) {
    return { status: "skipped", error: "PDF archive is not configured" };
  }

  const existing = await getPayslipPdfArchive(supabase, payslipId);
  if (existing) return { status: "exists", archive: existing };

  const { data } = await supabase
    .from("payslips")
    .select(
      "id, company_id, period_year, period_month, status, snapshot, content_hash",
    )
    .eq("id", payslipId)
    .maybeSingle();
  const payslip = data as ArchivablePayslip | null;

  if (!payslip || !ISSUED_STATUSES.includes(payslip.status)) {
    return { status: "skipped", error: "Payslip is not issued" };
  }
  // Yalnızca parmak izi doğrulanan snapshot arşivlenir
  if (!payslip.content_hash || !verifySnapshot(payslip.snapshot, payslip.content_hash)) {
    return { status: "skipped", error: "Payslip snapshot is missing or invalid" };
  }

  try {
    const key = buildArchiveKey(payslip);

    // Önceki deneme R2'ye yükleyip kaydı yazamadıysa nesne zaten vardır;
    // Bucket Lock üzerine yazmaya izin vermez, mevcut nesne kullanılır
    let object = await headR2Object(key);
    if (!object) {
      const pdf = await renderPayslipPdf(payslip.id);
      const pdfSha256 = sha256Hex(pdf);
      try {
        await putR2Pdf(key, pdf, pdfSha256, {
          "payslip-id": payslip.id,
          "content-hash": payslip.content_hash,
        });
        object = { size: pdf.length, sha256: pdfSha256 };
      } catch (error) {
        // Eşzamanlı başka bir deneme önce yüklemiş olabilir
        object = await headR2Object(key);
        if (!object) throw error;
      }
    }
    if (!object.sha256) {
      throw new Error(`R2 object ${key} has no sha256 metadata`);
    }

    const record = {
      payslip_id: payslip.id,
      company_id: payslip.company_id,
      storage_key: key,
      pdf_sha256: object.sha256,
      size_bytes: object.size,
      content_hash: payslip.content_hash,
    };
    const { data: inserted, error } = await supabase
      .from(PDF_ARCHIVE_TABLE)
      .insert(record)
      .select("*")
      .single();

    if (error) {
      // 23505: eşzamanlı deneme kaydı önce yazdı
      if (error.code === "23505") {
        const archive = await getPayslipPdfArchive(supabase, payslip.id);
        if (archive) return { status: "exists", archive };
      }
      throw new Error(error.message);
    }
    return { status: "archived", archive: inserted as PayslipPdfArchive };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Payslip PDF archive failed (${payslipId}):`, message);
    return { status: "failed", error: message };
  }
}

/**
 * Yayınlanan bordroların arşivini yanıt gönderildikten sonra çalıştırır.
 * Toplu yayınlamada da tüm id'lerle bir kez çağrılabilir; sırayla işlenir.
 * Başarısız olanlar /api/cron/archive-payslips tarafından tekrar denenir.
 */
export function schedulePayslipArchive(payslipIds: string[]): void {
  if (payslipIds.length === 0 || !isPdfArchiveEnabled()) return;
  after(async () => {
    const supabase = createAdminClient();
    for (const id of payslipIds) {
      await archivePayslipPdf(supabase, id);
    }
  });
}

/** Arşivlenmemiş yayınlanmış bordroları işler (cron) */
export async function archivePendingPayslips(
  supabase: SupabaseClient,
  limit = 25,
): Promise<{ processed: number; archived: number; failed: string[] }> {
  const { data, error } = await supabase
    .from("payslips_pending_pdf_archive")
    .select("id")
    .order("finalized_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);

  const failed: string[] = [];
  let archived = 0;
  for (const { id } of (data as { id: string }[]) ?? []) {
    const result = await archivePayslipPdf(supabase, id);
    if (result.status === "archived" || result.status === "exists") {
      archived += 1;
    } else {
      failed.push(id);
    }
  }
  return { processed: data?.length ?? 0, archived, failed };
}
