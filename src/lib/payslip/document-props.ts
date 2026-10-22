/**
 * Bordro belgesi verisi (sunucu)
 * Şirket paneli, çalışan görüntüleme ve QR doğrulama sayfaları aynı belgeyi
 * aynı hesaplamalarla gösterir.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PayslipDocumentProps } from "@/app/payslip/[id]/_components/payslip-document";
import {
  PAYSLIP_STATUS,
  buildPayslipNumber,
  calculateEmployerContributions,
  calculateLeaveEntitlement,
  type PayslipStatus,
} from "@/utils/payslip-details";

export interface PayslipRecord {
  id: string;
  company_id: string;
  employee_id: string;
  period_month: number;
  period_year: number;
  gross_salary: number;
  net_salary: number;
  deductions: unknown;
  access_token: string;
  status: PayslipStatus;
  created_at: string;
  updated_at: string;
}

export interface PayslipCompanyRecord {
  name: string;
  address: string | null;
  tax_number: string | null;
  logo_url: string | null;
  plan: "free" | "basic" | "pro";
}

export interface PayslipEmployeeRecord {
  name: string;
  position: string | null;
  employee_code: string | null;
  email: string | null;
  address?: string | null;
  id_number?: string | null;
  ss_number?: string | null;
  department?: string | null;
  section?: string | null;
  unit?: string | null;
  grade?: string | null;
}

export interface YearToDateTotals {
  grossTotal: number;
  taxTotal: number;
  sscTotal: number;
  netTotal: number;
  leaveHoursTaken: number;
}

interface StoredDeductions {
  incomeTax: number;
  sscEmployee: number;
  sscEmployer?: number;
  maternityFund?: number;
  sscBase?: number;
  cola?: number;
  bonus?: number;
  allowance?: number;
  sscWeeks?: number;
  periodStartDate?: string; // Kıst ay: işe başlama tarihi (YYYY-MM-DD)
  employmentRatio?: number;
  payDate?: string;
  leaveHoursTaken?: number;
  notes?: string;
  salaryConfig?: {
    annualGross?: number;
    taxType?: "single" | "married" | "parent";
    childCount?: number;
    sscCategory?: string;
    birthYear?: number;
    startDate?: string;
  };
}

export const EMPTY_YTD: YearToDateTotals = {
  grossTotal: 0,
  taxTotal: 0,
  sscTotal: 0,
  netTotal: 0,
  leaveHoursTaken: 0,
};

/**
 * Yıl başından bu döneme kadar toplamlar. Yalnızca yayınlanmış bordrolar
 * sayılır; görüntülenen bordro taslaksa kendi tutarları da eklenir.
 * Çağıran taraf şirket sahipliğini / erişimi önceden doğrulamalıdır.
 */
export async function fetchYearToDateTotals(
  supabase: SupabaseClient,
  params: {
    companyId: string;
    employeeId: string;
    year: number;
    upToMonth: number;
    currentDraft?: Pick<
      PayslipRecord,
      "gross_salary" | "net_salary" | "deductions"
    >;
  },
): Promise<YearToDateTotals> {
  const { data: payslips, error } = await supabase
    .from("payslips")
    .select("gross_salary, net_salary, deductions")
    .eq("employee_id", params.employeeId)
    .eq("company_id", params.companyId)
    .eq("status", PAYSLIP_STATUS.FINAL)
    .eq("period_year", params.year)
    .lte("period_month", params.upToMonth);

  if (error || !payslips) {
    console.error("Error fetching YTD totals:", error);
    return { ...EMPTY_YTD };
  }

  const rows = params.currentDraft
    ? [...payslips, params.currentDraft]
    : payslips;
  const totals = { ...EMPTY_YTD };

  for (const payslip of rows) {
    totals.grossTotal += payslip.gross_salary || 0;
    totals.netTotal += payslip.net_salary || 0;
    const deductions = payslip.deductions as Partial<StoredDeductions> | null;
    if (deductions) {
      totals.taxTotal += deductions.incomeTax || 0;
      totals.sscTotal += deductions.sscEmployee || 0;
      totals.leaveHoursTaken += deductions.leaveHoursTaken || 0;
    }
  }

  return totals;
}

/** Bordro satırından PayslipDocument prop'larını üretir */
export function buildPayslipDocumentProps(
  payslip: PayslipRecord,
  company: PayslipCompanyRecord,
  employee: PayslipEmployeeRecord,
  ytdTotals: YearToDateTotals,
): PayslipDocumentProps {
  const deductions = payslip.deductions as StoredDeductions;
  const salaryConfig = deductions.salaryConfig;

  // Temel ücret = brüt − ekler
  const basicSalary =
    payslip.gross_salary -
    (deductions.cola || 0) -
    (deductions.bonus || 0) -
    (deductions.allowance || 0);

  // İşveren katkıları: eski bordrolarda kayıtlı değilse SSC matrahından türet
  const sscWeeks = deductions.sscWeeks ?? 4;
  const employerContributions =
    deductions.sscEmployer !== undefined
      ? {
          sscEmployer: deductions.sscEmployer,
          maternityFund: deductions.maternityFund ?? 0,
        }
      : deductions.sscBase !== undefined
        ? calculateEmployerContributions({
            sscEmployee: deductions.sscEmployee,
            sscBase: deductions.sscBase,
            sscWeeks,
          })
        : undefined;

  // Yıllık izin: kayıtlı izin saatleri olan bordrolarda gösterilir
  const leave =
    deductions.leaveHoursTaken !== undefined
      ? {
          entitledHours: calculateLeaveEntitlement(
            payslip.period_year,
            salaryConfig?.startDate,
          ),
          takenThisPeriod: deductions.leaveHoursTaken,
          takenToDate: ytdTotals.leaveHoursTaken,
        }
      : undefined;

  return {
    company: {
      name: company.name,
      address: company.address,
      tax_number: company.tax_number,
      logo_url: company.logo_url,
      plan: company.plan,
    },
    employee: {
      name: employee.name,
      position: employee.position,
      employee_code: employee.employee_code,
      email: employee.email,
      address: employee.address,
      id_number: employee.id_number,
      ss_number: employee.ss_number,
      department: employee.department,
      section: employee.section,
      unit: employee.unit,
      grade: employee.grade,
    },
    periodMonth: payslip.period_month,
    periodYear: payslip.period_year,
    grossSalary: payslip.gross_salary,
    netSalary: payslip.net_salary,
    incomeTax: deductions.incomeTax,
    sscEmployee: deductions.sscEmployee,
    createdAt: payslip.created_at,
    updatedAt: payslip.updated_at,
    payslipNumber: buildPayslipNumber(
      company.name,
      payslip.period_year,
      payslip.period_month,
      payslip.id,
    ),
    ytdTotals,
    salaryConfig,
    earnings: {
      basicSalary,
      cola: deductions.cola || 0,
      bonus: deductions.bonus || 0,
      allowance: deductions.allowance || 0,
    },
    sscWeeks,
    periodStartDate: deductions.periodStartDate,
    employmentRatio: deductions.employmentRatio,
    payDate: deductions.payDate,
    employerContributions,
    leave,
    notes: deductions.notes,
    status: payslip.status,
    accessToken: payslip.access_token,
  };
}

/** Supabase ilişkileri tek nesne ya da dizi döndürebilir */
export function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

/**
 * Herkese açık sayfalar için yayınlanmış bordroyu tüm belge verisiyle yükler.
 * Taslaklar asla döndürülmez. Erişim kontrolü (PIN / captcha) çağıranda.
 */
export async function fetchPublishedPayslipDocument(
  supabase: SupabaseClient,
  lookup: { column: "access_token" | "id"; value: string },
): Promise<{
  payslip: PayslipRecord;
  company: PayslipCompanyRecord;
  employee: PayslipEmployeeRecord & { date_of_birth?: string | null };
  props: PayslipDocumentProps;
} | null> {
  const { data, error } = await supabase
    .from("payslips")
    .select(
      `
      *,
      employee:employees(*),
      company:companies(name, address, tax_number, logo_url, plan)
    `,
    )
    .eq(lookup.column, lookup.value)
    .eq("status", PAYSLIP_STATUS.FINAL)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as PayslipRecord & {
    employee: unknown;
    company: unknown;
  };
  const employee = firstRelation(
    row.employee as PayslipEmployeeRecord | PayslipEmployeeRecord[] | null,
  );
  const company = firstRelation(
    row.company as PayslipCompanyRecord | PayslipCompanyRecord[] | null,
  );
  if (!employee || !company) return null;

  const ytdTotals = await fetchYearToDateTotals(supabase, {
    companyId: row.company_id,
    employeeId: row.employee_id,
    year: row.period_year,
    upToMonth: row.period_month,
  });

  return {
    payslip: row,
    company,
    employee,
    props: buildPayslipDocumentProps(row, company, employee, ytdTotals),
  };
}
