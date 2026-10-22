/**
 * Çalışan uygulaması bordro sorguları (sunucu)
 * Çağıran, employeeIds'in oturumdaki kullanıcıya ait olduğunu
 * (getEmployments) önceden doğrulamalıdır.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { firstRelation } from "@/lib/payslip/document-props";
import { ISSUED_STATUSES } from "@/utils/payslip-details";
import type { MobilePayslipRow } from "@/lib/mobile/payslip-list";

export async function fetchMobilePayslipRows(
  supabase: SupabaseClient,
  employeeIds: string[],
  year?: number | null,
): Promise<MobilePayslipRow[]> {
  if (employeeIds.length === 0) return [];

  let query = supabase
    .from("payslips")
    .select(
      "id, employee_id, company_id, period_month, period_year, gross_salary, net_salary, deductions, status, finalized_at, voided_at, void_reason, replaces_payslip_id, company:companies(name)",
    )
    .in("employee_id", employeeIds)
    .in("status", ISSUED_STATUSES);
  if (year) query = query.eq("period_year", year);

  const { data, error } = await query;
  if (error) throw error;

  return (
    (data ?? []) as unknown as (Omit<MobilePayslipRow, "companyName"> & {
      company: { name: string } | { name: string }[] | null;
    })[]
  ).map(({ company, ...row }) => ({
    ...row,
    companyName: firstRelation(company)?.name ?? "",
  }));
}
