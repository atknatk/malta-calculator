/**
 * Tek ay bordro hesabı (sunucu / saf fonksiyon)
 * Toplu bordro akışı maaş API'sine gitmeden aynı hesap motorunu kullanır.
 * Bonus ve ödenek o ayın vergiye tabi brütüne eklenir; FSS vergisi ve
 * net maaş bunlar dahil hesaplanır (sihirbazdaki "vergi sonrası ekleme"
 * hatası burada yok).
 */
import {
  type ChildCount,
  type SSCCategory,
  type SimpleTaxType,
  type TaxRateType,
} from "@/config/malta-tax-config";
import {
  Month,
  type MonthlySalaryInput,
  type SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";
import {
  buildEmploymentConfig,
  calculateMonthlyDeductions,
} from "@/utils/salary-calculator";
import {
  calculateEmployerContributions,
  getLastWorkingDay,
} from "@/utils/payslip-details";

export const TAX_TYPES = ["single", "married", "parent"] as const;
export const SSC_CATEGORIES = ["A", "B", "C", "D"] as const;

export type PayslipTaxType = (typeof TAX_TYPES)[number];
export type PayslipSSCCategory = (typeof SSC_CATEGORIES)[number];

/** deductions.salaryConfig ile aynı şekil */
export interface PayslipSalaryConfig {
  annualGross: number;
  taxType: PayslipTaxType;
  childCount: number;
  sscCategory: PayslipSSCCategory;
  birthYear: number;
  startDate?: string;
  previousTaxableIncome?: number;
  previousTaxPaid?: number;
  includeStartWeekSSC?: boolean;
}

export interface PayslipComputeInput {
  periodMonth: number;
  periodYear: number;
  salaryConfig: PayslipSalaryConfig;
  bonus?: number;
  allowance?: number;
  payDate?: string;
  leaveHoursTaken?: number;
  notes?: string;
}

export interface ComputedPayslip {
  grossSalary: number;
  netSalary: number;
  deductions: {
    incomeTax: number;
    sscEmployee: number;
    sscEmployer: number;
    maternityFund: number;
    sscBase: number;
    cola: number;
    bonus: number;
    allowance: number;
    sscWeeks: number;
    employmentRatio: number;
    payDate: string;
    leaveHoursTaken: number;
    periodStartDate?: string;
    notes?: string;
  };
  salaryConfig: PayslipSalaryConfig;
}

const MONTHS = Object.values(Month);
const round2 = (value: number): number => Math.round(value * 100) / 100;
const money = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? round2(n) : 0;
};

/** Gelen config'i doğrular ve normalize eder; hata metni döner */
export function normalizeSalaryConfig(
  raw: Partial<PayslipSalaryConfig> | null | undefined,
  currentYear = new Date().getFullYear(),
): { config?: PayslipSalaryConfig; error?: string } {
  if (!raw) return { error: "Salary details are missing" };

  const annualGross = Number(raw.annualGross);
  if (!Number.isFinite(annualGross) || annualGross <= 0) {
    return { error: "Annual gross salary must be greater than €0" };
  }
  if (annualGross > 10_000_000) {
    return { error: "Annual gross salary must be at most €10,000,000" };
  }
  if (!TAX_TYPES.includes(raw.taxType as PayslipTaxType)) {
    return { error: "Invalid tax status" };
  }
  if (!SSC_CATEGORIES.includes(raw.sscCategory as PayslipSSCCategory)) {
    return { error: "Invalid SSC category" };
  }
  const birthYear = Number(raw.birthYear ?? 1990);
  if (
    !Number.isInteger(birthYear) ||
    birthYear < 1900 ||
    birthYear > currentYear - 16
  ) {
    return { error: `Birth year must be between 1900 and ${currentYear - 16}` };
  }

  return {
    config: {
      annualGross: round2(annualGross),
      taxType: raw.taxType as PayslipTaxType,
      childCount:
        raw.taxType === "single"
          ? 0
          : Math.min(2, Math.max(0, Math.trunc(Number(raw.childCount) || 0))),
      sscCategory: raw.sscCategory as PayslipSSCCategory,
      birthYear,
      ...(raw.startDate ? { startDate: raw.startDate } : {}),
      previousTaxableIncome: money(raw.previousTaxableIncome),
      previousTaxPaid: money(raw.previousTaxPaid),
      includeStartWeekSSC: raw.includeStartWeekSSC ?? true,
    },
  };
}

/**
 * Önceki bir bordronun config'ini yeni döneme taşır: işe başlama tarihi ve
 * önceki işveren (FS3) bilgisi yalnızca aynı vergi yılında geçerlidir.
 */
export function carryOverSalaryConfig(
  config: PayslipSalaryConfig,
  fromYear: number,
  toYear: number,
): PayslipSalaryConfig {
  if (fromYear === toYear) return config;
  const rest = { ...config };
  delete rest.startDate;
  return { ...rest, previousTaxableIncome: 0, previousTaxPaid: 0 };
}

/** Bir çalışan + dönem için bordro tutarlarını hesaplar */
export function computeMonthlyPayslip(
  input: PayslipComputeInput,
): { payslip?: ComputedPayslip; error?: string } {
  const { periodMonth, periodYear, salaryConfig } = input;
  if (
    !Number.isInteger(periodMonth) ||
    periodMonth < 1 ||
    periodMonth > 12 ||
    !Number.isInteger(periodYear) ||
    periodYear < 2020
  ) {
    return { error: "Invalid period" };
  }

  if (salaryConfig.startDate) {
    const [startYear, startMonth] = salaryConfig.startDate
      .split("-")
      .map(Number);
    if (
      startYear > periodYear ||
      (startYear === periodYear && startMonth > periodMonth)
    ) {
      return { error: "This period is before the employee's start date" };
    }
  }

  const bonus = money(input.bonus);
  const allowance = money(input.allowance);
  const monthIndex = periodMonth - 1;

  const config: SalaryCalculatorConfig = {
    year: periodYear,
    taxRateType: salaryConfig.taxType as TaxRateType,
    simpleTaxType: salaryConfig.taxType as SimpleTaxType,
    childCount: salaryConfig.childCount as ChildCount,
    sscCategory: salaryConfig.sscCategory as SSCCategory,
    birthDate: new Date(salaryConfig.birthYear, 0, 1),
    yearlyNonTaxBenefit: 0,
    yearlyTaxableBenefit: 0,
    monthlyBonus: 0,
    enableCOLA: true,
    ...buildEmploymentConfig({
      year: periodYear,
      startDate: salaryConfig.startDate,
      previousTaxableIncome: salaryConfig.previousTaxableIncome,
      previousTaxPaid: salaryConfig.previousTaxPaid,
      includeStartWeekSSC: salaryConfig.includeStartWeekSSC === true,
    }),
  };

  // Maaş API'si ile aynı aylık brüt; bonus + ödenek yalnızca bordro ayında,
  // vergiye tabi gelir olarak eklenir
  const monthlyGross = Number((salaryConfig.annualGross / 12).toFixed(2));
  const salaries: MonthlySalaryInput[] = MONTHS.map((month, index) => ({
    month,
    grossWage: monthlyGross,
    allowanceBonus: 0,
    ...(index === monthIndex ? { bonus: round2(bonus + allowance) } : {}),
  }));

  const month = calculateMonthlyDeductions(salaries, config)[monthIndex];
  if (!month || month.employmentRatio === 0) {
    return { error: "The employee is not employed in this period" };
  }

  const employer = calculateEmployerContributions({
    sscEmployee: month.sscTax,
    sscBase: month.sscBase,
    sscWeeks: month.sscWeeks ?? 0,
  });
  const notes = input.notes?.trim().substring(0, 500);
  const employmentRatio = month.employmentRatio ?? 1;

  return {
    payslip: {
      grossSalary: month.grossTotal,
      netSalary: month.net,
      deductions: {
        incomeTax: month.incomeTax,
        sscEmployee: month.sscTax,
        sscEmployer: employer.sscEmployer,
        maternityFund: employer.maternityFund,
        sscBase: month.sscBase,
        cola: month.governmentBonus,
        bonus,
        allowance,
        sscWeeks: month.sscWeeks ?? 0,
        employmentRatio,
        payDate: input.payDate || getLastWorkingDay(periodYear, periodMonth),
        leaveHoursTaken: Math.max(0, Number(input.leaveHoursTaken) || 0),
        ...(employmentRatio < 1 && salaryConfig.startDate
          ? { periodStartDate: salaryConfig.startDate }
          : {}),
        ...(notes ? { notes } : {}),
      },
      salaryConfig,
    },
  };
}
