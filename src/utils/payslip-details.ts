/**
 * Payslip yardımcıları
 * Bordro belgesinde gösterilen türetilmiş değerler: ödeme günü, işveren
 * katkıları (SSC + Maternity Fund), yıllık izin hakkı ve belge numarası.
 */
import { calculateVacationLeave } from "@/utils/vacation-calculator";

export const PAYSLIP_STATUS = {
  DRAFT: "draft",
  FINAL: "final",
  VOID: "void",
} as const;

/** Yayınlanmış (final) ya da sonradan geçersiz kılınmış (void) bordrolar */
export const ISSUED_STATUSES: PayslipStatus[] = ["final", "void"];

export type PayslipStatus =
  (typeof PAYSLIP_STATUS)[keyof typeof PAYSLIP_STATUS];

/** Malta Maternity Leave Trust Fund: işveren, SSC matrahının %0.3'ünü öder */
export const MATERNITY_FUND_RATE = 0.003;

/** Haftalık 40 saatlik tam zamanlı çalışmada aylık standart saat */
export const STANDARD_MONTHLY_HOURS = 173.33;

const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Ayın son iş günü (Pzt-Cuma). Varsayılan ödeme günü olarak kullanılır.
 * Dönüş: YYYY-MM-DD
 */
export function getLastWorkingDay(year: number, month: number): string {
  const date = new Date(year, month, 0); // month: 1-12 → ayın son günü
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() - 1);
  }
  return toIsoDate(date);
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export interface EmployerContributionInput {
  sscEmployee: number;
  /** Dönemin toplam SSC matrahı (haftalık matrah × hafta) */
  sscBase: number;
  sscWeeks: number;
}

export interface EmployerContributions {
  sscEmployer: number;
  maternityFund: number;
  total: number;
}

/**
 * İşveren katkıları
 * - Class 1 SSC: işveren, çalışan payıyla aynı tutarı öder
 * - Maternity Fund: haftalık SSC matrahının %0.3'ü × hafta (haftalık yuvarlama)
 */
export function calculateEmployerContributions({
  sscEmployee,
  sscBase,
  sscWeeks,
}: EmployerContributionInput): EmployerContributions {
  const sscEmployer = round2(Math.max(0, sscEmployee));
  if (sscEmployer === 0 || sscWeeks <= 0 || sscBase <= 0) {
    return { sscEmployer, maternityFund: 0, total: sscEmployer };
  }
  const weeklyMaternity = round2((sscBase / sscWeeks) * MATERNITY_FUND_RATE);
  const maternityFund = round2(weeklyMaternity * sscWeeks);
  return {
    sscEmployer,
    maternityFund,
    total: round2(sscEmployer + maternityFund),
  };
}

/**
 * Yıllık izin hakkı (saat). İşe yıl içinde başlayanlar için çalışılan gün
 * oranında kıst hesaplanır.
 */
export function calculateLeaveEntitlement(
  year: number,
  startDate?: string | null,
  weeklyHours = 40,
): number {
  const { totalHours } = calculateVacationLeave({ weeklyHours, year });
  if (!startDate) return totalHours;

  const start = new Date(`${startDate}T00:00:00`);
  if (isNaN(start.getTime()) || start.getFullYear() < year) return totalHours;
  if (start.getFullYear() > year) return 0;

  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  const dayMs = 24 * 60 * 60 * 1000;
  const daysInYear = Math.round((yearEnd.getTime() - yearStart.getTime()) / dayMs) + 1;
  const employedDays = Math.round((yearEnd.getTime() - start.getTime()) / dayMs) + 1;
  return round2((totalHours * employedDays) / daysInYear);
}

/** Şirket önekli okunabilir belge numarası: ABC-2026-10-1F2E */
export function buildPayslipNumber(
  companyName: string,
  periodYear: number,
  periodMonth: number,
  payslipId: string,
): string {
  const prefix =
    companyName.replace(/[^A-Za-z]/g, "").substring(0, 3).toUpperCase() ||
    "PAY";
  return `${prefix}-${periodYear}-${String(periodMonth).padStart(2, "0")}-${payslipId.substring(0, 4).toUpperCase()}`;
}

/** 30th Oct 2026 biçiminde tarih */
export function formatOrdinalDate(value: string | Date): string {
  const date =
    typeof value === "string"
      ? new Date(value.length === 10 ? `${value}T00:00:00` : value)
      : value;
  if (isNaN(date.getTime())) return "-";
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  return `${day}${suffix} ${month} ${date.getFullYear()}`;
}
