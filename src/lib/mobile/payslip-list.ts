/**
 * Çalışan uygulaması bordro listesi ve yıl özeti (saf fonksiyonlar)
 * Liste yalnızca yayınlanmış (final) ve geçersiz kılınmış (void) bordroları
 * içerir; özet yalnızca final bordroları toplar.
 */
import { buildPayslipNumber } from "@/utils/payslip-details";

export interface MobilePayslipRow {
  id: string;
  employee_id: string;
  company_id: string;
  period_month: number;
  period_year: number;
  gross_salary: number | string;
  net_salary: number | string;
  deductions: unknown;
  status: "final" | "void";
  finalized_at: string | null;
  voided_at: string | null;
  void_reason: string | null;
  replaces_payslip_id: string | null;
  companyName: string;
}

export interface MobilePayslipListItem {
  id: string;
  employeeId: string;
  companyId: string;
  companyName: string;
  payslipNumber: string;
  periodMonth: number;
  periodYear: number;
  grossSalary: number;
  netSalary: number;
  incomeTax: number;
  sscEmployee: number;
  status: "final" | "void";
  issuedAt: string | null;
  voidedAt: string | null;
  voidReason: string | null;
  replacesPayslipId: string | null;
  replacedByPayslipId: string | null;
}

export interface MobileYearSummary {
  employeeId: string;
  companyId: string;
  companyName: string;
  year: number;
  payslipCount: number;
  grossTotal: number;
  netTotal: number;
  taxTotal: number;
  sscTotal: number;
}

function toNumber(value: unknown): number {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : 0;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function readDeduction(deductions: unknown, key: string): number {
  if (!deductions || typeof deductions !== "object") return 0;
  return toNumber((deductions as Record<string, unknown>)[key]);
}

/** Yeni dönem önce; void bordro, yerine çıkarılan bordroya bağlanır */
export function buildPayslipList(
  rows: MobilePayslipRow[],
): MobilePayslipListItem[] {
  const replacedBy = new Map<string, string>();
  for (const row of rows) {
    if (row.replaces_payslip_id)
      replacedBy.set(row.replaces_payslip_id, row.id);
  }

  return rows
    .map((row) => ({
      id: row.id,
      employeeId: row.employee_id,
      companyId: row.company_id,
      companyName: row.companyName,
      payslipNumber: buildPayslipNumber(
        row.companyName,
        row.period_year,
        row.period_month,
        row.id,
      ),
      periodMonth: row.period_month,
      periodYear: row.period_year,
      grossSalary: toNumber(row.gross_salary),
      netSalary: toNumber(row.net_salary),
      incomeTax: readDeduction(row.deductions, "incomeTax"),
      sscEmployee: readDeduction(row.deductions, "sscEmployee"),
      status: row.status,
      issuedAt: row.finalized_at,
      voidedAt: row.voided_at,
      voidReason: row.void_reason,
      replacesPayslipId: row.replaces_payslip_id,
      replacedByPayslipId: replacedBy.get(row.id) ?? null,
    }))
    .sort(
      (a, b) =>
        b.periodYear - a.periodYear ||
        b.periodMonth - a.periodMonth ||
        (b.issuedAt ?? "").localeCompare(a.issuedAt ?? ""),
    );
}

/** İşveren başına yıl toplamları (yalnızca final bordrolar) */
export function summarizeYear(
  rows: MobilePayslipRow[],
  year: number,
): MobileYearSummary[] {
  const byEmployee = new Map<string, MobileYearSummary>();
  for (const row of rows) {
    if (row.status !== "final" || row.period_year !== year) continue;
    const summary = byEmployee.get(row.employee_id) ?? {
      employeeId: row.employee_id,
      companyId: row.company_id,
      companyName: row.companyName,
      year,
      payslipCount: 0,
      grossTotal: 0,
      netTotal: 0,
      taxTotal: 0,
      sscTotal: 0,
    };
    summary.payslipCount += 1;
    summary.grossTotal = round2(
      summary.grossTotal + toNumber(row.gross_salary),
    );
    summary.netTotal = round2(summary.netTotal + toNumber(row.net_salary));
    summary.taxTotal = round2(
      summary.taxTotal + readDeduction(row.deductions, "incomeTax"),
    );
    summary.sscTotal = round2(
      summary.sscTotal + readDeduction(row.deductions, "sscEmployee"),
    );
    byEmployee.set(row.employee_id, summary);
  }
  return [...byEmployee.values()];
}
