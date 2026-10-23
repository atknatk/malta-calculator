/**
 * Toplu bordro (Pro): seçilen çalışanlar için dönem taslaklarını oluşturur /
 * günceller ve seçilen taslakları toplu yayınlar. Yayınlama her bordro için
 * issuePayslip üzerinden yapılır (snapshot + parmak izi); veritabanı
 * trigger'ı doğrudan final yazmayı zaten reddeder.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ISSUED_STATUSES,
  PAYSLIP_STATUS,
  type PayslipStatus,
} from "@/utils/payslip-details";
import { issuePayslip } from "@/lib/payslip/issue";
import { schedulePayslipArchive } from "@/lib/payslip/pdf-archive";
import { generateShortToken } from "@/lib/payslip/token";
import {
  computeMonthlyPayslip,
  normalizeSalaryConfig,
  type PayslipSalaryConfig,
} from "@/lib/payslip/compute";

/** Tek istekte işlenebilecek en fazla çalışan (Pro limiti) */
export const BULK_MAX_ITEMS = 100;
const CONCURRENCY = 5;

export interface BulkDraftItem {
  employeeId: string;
  salaryConfig: Partial<PayslipSalaryConfig>;
  bonus?: number;
  allowance?: number;
  notes?: string;
}

export interface BulkItemResult {
  employeeId?: string;
  payslipId?: string;
  success: boolean;
  error?: string;
}

/** Sırayı koruyarak en fazla `limit` işi aynı anda çalıştırır */
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await fn(items[index]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

/** Bu ay yayınlanan bordro sayısı (sonradan void edilenler dahil) */
export async function countIssuedThisMonth(
  supabase: SupabaseClient,
  companyId: string,
): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1,
  ).toISOString();
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  ).toISOString();

  const { count } = await supabase
    .from("payslips")
    .select("*", { count: "exact", head: true })
    .eq("company_id", companyId)
    .in("status", ISSUED_STATUSES)
    .gte("finalized_at", startOfMonth)
    .lte("finalized_at", endOfMonth);

  return count ?? 0;
}

interface PeriodPayslipRow {
  id: string;
  employee_id: string;
  status: PayslipStatus;
  voided_at: string | null;
}

/** Dönem taslaklarını hesaplar ve kaydeder (çalışan + dönem başına tek taslak) */
export async function saveBulkDrafts(
  supabase: SupabaseClient,
  companyId: string,
  period: { month: number; year: number },
  items: BulkDraftItem[],
): Promise<BulkItemResult[]> {
  const employeeIds = [...new Set(items.map((i) => i.employeeId))];

  const [{ data: employees }, { data: periodRows }] = await Promise.all([
    supabase
      .from("employees")
      .select("id")
      .eq("company_id", companyId)
      .in("id", employeeIds),
    supabase
      .from("payslips")
      .select("id, employee_id, status, voided_at")
      .eq("company_id", companyId)
      .eq("period_month", period.month)
      .eq("period_year", period.year)
      .in("employee_id", employeeIds),
  ]);

  const ownEmployees = new Set(
    ((employees as { id: string }[] | null) ?? []).map((e) => e.id),
  );
  const rows = (periodRows as PeriodPayslipRow[] | null) ?? [];
  const seen = new Set<string>();

  return mapWithConcurrency(items, CONCURRENCY, async (item) => {
    const { employeeId } = item;
    if (seen.has(employeeId)) {
      return { employeeId, success: false, error: "Duplicate employee" };
    }
    seen.add(employeeId);

    if (!ownEmployees.has(employeeId)) {
      return { employeeId, success: false, error: "Employee not found" };
    }

    const own = rows.filter((r) => r.employee_id === employeeId);
    const active = own.find((r) => r.status !== PAYSLIP_STATUS.VOID);
    if (active?.status === PAYSLIP_STATUS.FINAL) {
      return {
        employeeId,
        payslipId: active.id,
        success: false,
        error: "Already issued for this period",
      };
    }

    const { config, error: configError } = normalizeSalaryConfig(
      item.salaryConfig,
    );
    if (!config) return { employeeId, success: false, error: configError };

    const { payslip, error: computeError } = computeMonthlyPayslip({
      periodMonth: period.month,
      periodYear: period.year,
      salaryConfig: config,
      bonus: item.bonus,
      allowance: item.allowance,
      notes: item.notes,
    });
    if (!payslip) return { employeeId, success: false, error: computeError };

    // Dönemin void edilmiş bordrosu varsa yeni taslak onun düzeltmesidir
    const latestVoid = own
      .filter((r) => r.status === PAYSLIP_STATUS.VOID)
      .sort((a, b) => (b.voided_at ?? "").localeCompare(a.voided_at ?? ""))[0];

    const now = new Date().toISOString();
    const values = {
      employee_id: employeeId,
      period_month: period.month,
      period_year: period.year,
      gross_salary: payslip.grossSalary,
      net_salary: payslip.netSalary,
      // salaryConfig deductions jsonb içinde saklanır (ayrı kolon yok)
      deductions: { ...payslip.deductions, salaryConfig: payslip.salaryConfig },
      status: PAYSLIP_STATUS.DRAFT,
      updated_at: now,
      ...(latestVoid ? { replaces_payslip_id: latestVoid.id } : {}),
    };

    const { data, error } = active
      ? await supabase
          .from("payslips")
          .update(values)
          .eq("id", active.id)
          .eq("company_id", companyId)
          .eq("status", PAYSLIP_STATUS.DRAFT)
          .select("id")
          .maybeSingle()
      : await supabase
          .from("payslips")
          .insert({
            ...values,
            company_id: companyId,
            access_token: generateShortToken(8),
          })
          .select("id")
          .maybeSingle();

    if (error || !data) {
      console.error("Error saving bulk draft:", error);
      return {
        employeeId,
        success: false,
        error:
          error?.code === "23505"
            ? "A payslip for this period was created meanwhile"
            : "Failed to save draft",
      };
    }
    return { employeeId, payslipId: (data as { id: string }).id, success: true };
  });
}

/**
 * Taslakları yayınlar. Aylık limit aşılmasın diye en fazla `remaining`
 * bordro yayınlanır; kalanlar taslak olarak kalır.
 */
export async function issueBulkPayslips(
  supabase: SupabaseClient,
  companyId: string,
  payslipIds: string[],
  remaining: number,
): Promise<BulkItemResult[]> {
  const unique = [...new Set(payslipIds)];
  const allowed = unique.slice(0, Math.max(0, remaining));
  const overLimit = unique.slice(allowed.length);

  const issued = await mapWithConcurrency(
    allowed,
    CONCURRENCY,
    async (payslipId): Promise<BulkItemResult> => {
      const result = await issuePayslip(supabase, payslipId, companyId, {
        archivePdf: false,
      });
      return { payslipId, ...result };
    },
  );

  // PDF arşivi yanıttan sonra tek kuyrukta, sırayla (bkz. pdf-archive)
  schedulePayslipArchive(
    issued
      .filter((item) => item.success && item.payslipId)
      .map((item) => item.payslipId as string),
  );

  return [
    ...issued,
    ...overLimit.map((payslipId) => ({
      payslipId,
      success: false,
      error: "Monthly payslip limit reached",
    })),
  ];
}
