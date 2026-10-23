/**
 * Bordro revizyonları
 * Yanlış yayınlanan bordro void edilir ve yerine replaces_payslip_id ile
 * düzeltilmiş bordro çıkarılır. Aynı çalışan + dönem için bu zincir bir
 * bordronun sürümleridir: en son yayınlanmış (final) olan güncel sürümdür,
 * öncekiler "superseded" olarak erişilebilir kalır.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PayslipSnapshot } from "@/lib/payslip/snapshot";
import {
  ISSUED_STATUSES,
  PAYSLIP_STATUS,
  type PayslipStatus,
} from "@/utils/payslip-details";

export interface PayslipVersion {
  id: string;
  status: PayslipStatus;
  accessToken: string;
  replacesPayslipId: string | null;
  payslipNumber: string;
  revisionNumber: number;
  issuedAt: string | null;
  voidedAt: string | null;
  voidReason: string | null;
}

interface VersionRow {
  id: string;
  status: PayslipStatus;
  access_token: string;
  replaces_payslip_id: string | null;
  finalized_at: string | null;
  voided_at: string | null;
  void_reason: string | null;
  payslip_number: string | null;
  revision_number: number | null;
}

/** "EXA-2026-10-ABCD-R2" → "EXA-2026-10-ABCD" */
export function baseRevisionNumber(payslipNumber: string): string {
  return payslipNumber.replace(/-R\d+$/, "");
}

/** Düzeltilmiş bordronun numarası: ilk sürümün numarası + "-R<n>" */
export function buildRevisionPayslipNumber(
  replacedNumber: string,
  revisionNumber: number,
): string {
  return `${baseRevisionNumber(replacedNumber)}-R${revisionNumber}`;
}

/**
 * Satırları sürüm sırasına dizer (ilk sürüm başta). replaces_payslip_id
 * zinciri izlenir; zincire bağlı olmayan satırlar yayın tarihine göre
 * sona eklenir.
 */
export function orderVersions(rows: VersionRow[]): PayslipVersion[] {
  const byReplaced = new Map<string, VersionRow>();
  for (const row of rows) {
    if (row.replaces_payslip_id) byReplaced.set(row.replaces_payslip_id, row);
  }
  const ids = new Set(rows.map((row) => row.id));
  const roots = rows
    .filter((row) => !row.replaces_payslip_id || !ids.has(row.replaces_payslip_id))
    .sort((a, b) => (a.finalized_at ?? "").localeCompare(b.finalized_at ?? ""));

  const ordered: VersionRow[] = [];
  const seen = new Set<string>();
  for (const root of roots) {
    let current: VersionRow | undefined = root;
    while (current && !seen.has(current.id)) {
      ordered.push(current);
      seen.add(current.id);
      current = byReplaced.get(current.id);
    }
  }

  return ordered.map((row, index) => ({
    id: row.id,
    status: row.status,
    accessToken: row.access_token,
    replacesPayslipId: row.replaces_payslip_id,
    payslipNumber: row.payslip_number ?? "",
    revisionNumber: row.revision_number ?? index + 1,
    issuedAt: row.finalized_at,
    voidedAt: row.voided_at,
    voidReason: row.void_reason,
  }));
}

/** Bir bordronun tüm yayınlanmış sürümleri (aynı çalışan + dönem) */
export async function loadPayslipVersions(
  supabase: SupabaseClient,
  payslip: {
    company_id: string;
    employee_id: string;
    period_year: number;
    period_month: number;
  },
): Promise<PayslipVersion[]> {
  const { data, error } = await supabase
    .from("payslips")
    .select(
      `id, status, access_token, replaces_payslip_id, finalized_at, voided_at,
       void_reason, payslip_number:snapshot->document->>payslipNumber,
       revision_number:snapshot->document->revision->number`,
    )
    .eq("company_id", payslip.company_id)
    .eq("employee_id", payslip.employee_id)
    .eq("period_year", payslip.period_year)
    .eq("period_month", payslip.period_month)
    .in("status", ISSUED_STATUSES);

  if (error || !data) return [];
  return orderVersions(data as unknown as VersionRow[]);
}

/** Güncel sürüm: zincirdeki son yayınlanmış (void olmayan) bordro */
export function currentVersion(
  versions: PayslipVersion[],
): PayslipVersion | null {
  for (let i = versions.length - 1; i >= 0; i -= 1) {
    if (versions[i].status === PAYSLIP_STATUS.FINAL) return versions[i];
  }
  return null;
}

/** Yayınlanırken belgeye yazılacak revizyon bilgisi (ilk sürümde yok) */
export async function resolveRevision(
  supabase: SupabaseClient,
  replacesPayslipId: string | null | undefined,
): Promise<{ number: number; replacesNumber: string } | undefined> {
  if (!replacesPayslipId) return undefined;
  const { data } = await supabase
    .from("payslips")
    .select("snapshot")
    .eq("id", replacesPayslipId)
    .maybeSingle();
  const replaced = (data?.snapshot as PayslipSnapshot | null)?.document;
  if (!replaced) return undefined;
  return {
    number: (replaced.revision?.number ?? 1) + 1,
    replacesNumber: replaced.payslipNumber,
  };
}
