/**
 * Bordro yayınlama (sunucu)
 * Taslak → final geçişi tek yerden yapılır: belge verisi o anki haliyle
 * dondurulur (snapshot) ve SHA-256 parmak izi yazılır. Veritabanı trigger'ı
 * snapshot'sız yayınlamayı ve yayınlanmış satırın değiştirilmesini reddeder.
 */
import { after } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildPayslipDocumentProps,
  fetchYearToDateTotals,
  firstRelation,
  type PayslipCompanyRecord,
  type PayslipEmployeeRecord,
  type PayslipRecord,
} from "@/lib/payslip/document-props";
import { createSnapshot } from "@/lib/payslip/snapshot";
import { schedulePayslipArchive } from "@/lib/payslip/pdf-archive";
import {
  buildRevisionPayslipNumber,
  resolveRevision,
} from "@/lib/payslip/revisions";
import { notifyPayslipEvent } from "@/lib/notify/employee-notify";
import { PAYSLIP_STATUS } from "@/utils/payslip-details";

const PAYSLIP_WITH_RELATIONS = `
  *,
  employee:employees(*),
  company:companies(name, address, tax_number, logo_url, plan)
`;

async function loadPayslipWithRelations(
  supabase: SupabaseClient,
  payslipId: string,
  companyId: string,
): Promise<{
  payslip: PayslipRecord;
  company: PayslipCompanyRecord;
  employee: PayslipEmployeeRecord;
} | null> {
  const { data } = await supabase
    .from("payslips")
    .select(PAYSLIP_WITH_RELATIONS)
    .eq("id", payslipId)
    .eq("company_id", companyId)
    .maybeSingle();

  if (!data) return null;
  const row = data as PayslipRecord & { employee: unknown; company: unknown };
  const employee = firstRelation(
    row.employee as PayslipEmployeeRecord | PayslipEmployeeRecord[] | null,
  );
  const company = firstRelation(
    row.company as PayslipCompanyRecord | PayslipCompanyRecord[] | null,
  );
  if (!employee || !company) return null;
  return { payslip: row, company, employee };
}

export interface IssuePayslipOptions {
  /**
   * Yanıttan sonra PDF'i R2'ye arşivle (varsayılan: true). Toplu yayınlamada
   * false verip sonunda schedulePayslipArchive(ids) bir kez çağrılabilir.
   */
  archivePdf?: boolean;
}

/** Taslağı yayınlar: snapshot + parmak izi ile birlikte final yapar */
export async function issuePayslip(
  supabase: SupabaseClient,
  payslipId: string,
  companyId: string,
  options: IssuePayslipOptions = {},
): Promise<{ success: boolean; error?: string }> {
  const loaded = await loadPayslipWithRelations(supabase, payslipId, companyId);
  if (!loaded || loaded.payslip.status !== PAYSLIP_STATUS.DRAFT) {
    return { success: false, error: "Draft not found or already issued" };
  }

  const { payslip, company, employee } = loaded;
  const issuedAt = new Date().toISOString();

  // YTD: önceki yayınlanmış bordrolar + bu bordro
  const ytdTotals = await fetchYearToDateTotals(supabase, {
    companyId,
    employeeId: payslip.employee_id,
    year: payslip.period_year,
    upToMonth: payslip.period_month,
    currentDraft: payslip,
  });

  const document = buildPayslipDocumentProps(
    { ...payslip, status: PAYSLIP_STATUS.FINAL, updated_at: issuedAt },
    company,
    employee,
    ytdTotals,
  );

  // Düzeltilmiş bordro: ilk sürümün numarası + "-R<n>" ve revizyon bilgisi
  const revision = await resolveRevision(supabase, payslip.replaces_payslip_id);
  if (revision) {
    document.revision = revision;
    document.payslipNumber = buildRevisionPayslipNumber(
      revision.replacesNumber,
      revision.number,
    );
  }
  const { snapshot, contentHash } = createSnapshot(document, issuedAt);

  const { data, error } = await supabase
    .from("payslips")
    .update({
      status: PAYSLIP_STATUS.FINAL,
      finalized_at: issuedAt,
      updated_at: issuedAt,
      snapshot,
      content_hash: contentHash,
    })
    .eq("id", payslipId)
    .eq("company_id", companyId)
    .eq("status", PAYSLIP_STATUS.DRAFT)
    .select("id");

  if (error) {
    console.error("Error issuing payslip:", error);
    return { success: false, error: "Failed to issue payslip" };
  }
  if (!data || data.length === 0) {
    return { success: false, error: "Draft not found or already issued" };
  }
  scheduleEmployeeNotification(supabase, payslipId, "payslip_issued");
  if (options.archivePdf !== false) {
    schedulePayslipArchive([payslipId]);
  }
  return { success: true };
}

/**
 * Kilitleme öncesi yayınlanmış (snapshot'sız) bordroyu bir kez dondurur.
 * Trigger yalnızca snapshot/content_hash'in ilk kez yazılmasına izin verir.
 */
export async function freezeLegacyPayslip(
  supabase: SupabaseClient,
  payslip: PayslipRecord,
  company: PayslipCompanyRecord,
  employee: PayslipEmployeeRecord,
): Promise<void> {
  if (payslip.status !== PAYSLIP_STATUS.FINAL || payslip.snapshot) return;

  const ytdTotals = await fetchYearToDateTotals(supabase, {
    companyId: payslip.company_id,
    employeeId: payslip.employee_id,
    year: payslip.period_year,
    upToMonth: payslip.period_month,
  });
  const document = buildPayslipDocumentProps(
    payslip,
    company,
    employee,
    ytdTotals,
  );
  const { snapshot, contentHash } = createSnapshot(
    document,
    payslip.finalized_at || payslip.created_at,
  );

  const { error } = await supabase
    .from("payslips")
    .update({ snapshot, content_hash: contentHash })
    .eq("id", payslip.id)
    .is("snapshot", null);

  if (error) {
    console.error("Error freezing legacy payslip:", error);
  }
}

/** Yayınlanmış bordroyu geçersiz kılar (gerekçe zorunlu); silinmez */
export async function voidIssuedPayslip(
  supabase: SupabaseClient,
  payslipId: string,
  companyId: string,
  reason: string,
): Promise<{ success: boolean; error?: string }> {
  const trimmed = reason.trim();
  if (trimmed.length < 5) {
    return {
      success: false,
      error: "Please give a reason (min. 5 characters)",
    };
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("payslips")
    .update({
      status: PAYSLIP_STATUS.VOID,
      voided_at: now,
      void_reason: trimmed.substring(0, 500),
      updated_at: now,
    })
    .eq("id", payslipId)
    .eq("company_id", companyId)
    .eq("status", PAYSLIP_STATUS.FINAL)
    .select("id");

  if (error) {
    console.error("Error voiding payslip:", error);
    return { success: false, error: "Failed to void payslip" };
  }
  if (!data || data.length === 0) {
    return { success: false, error: "Issued payslip not found" };
  }
  scheduleEmployeeNotification(supabase, payslipId, "payslip_voided");
  return { success: true };
}

/**
 * Uygulamaya bağlı çalışana bildirim, yanıt döndükten sonra gönderilir
 * (bordro akışını yavaşlatmaz, hata durumunda etkilemez).
 */
function scheduleEmployeeNotification(
  supabase: SupabaseClient,
  payslipId: string,
  type: "payslip_issued" | "payslip_voided",
): void {
  try {
    after(() => notifyPayslipEvent(supabase, payslipId, type));
  } catch {
    // İstek bağlamı dışında (ör. script) çağrıldı: hemen gönder
    void notifyPayslipEvent(supabase, payslipId, type);
  }
}
