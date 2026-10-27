/**
 * Maaş sayfasının görünüm hesapları: motor (src/utils/salary-calculator.ts)
 * çıktısından sonuç paneli, tablo ve özet metinleri üretir. Motoru değiştirmez.
 */
import {
  getTaxBracketsForYear,
  resolveTaxRateType,
} from "@/config/malta-tax-config";
import {
  Month,
  type MonthlySalaryInput,
  type MonthlySalaryOutput,
  type SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";

export const MONTHS = Object.values(Month);

const moneyFormatter = new Intl.NumberFormat("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const wholeFormatter = new Intl.NumberFormat("en-GB", {
  maximumFractionDigits: 0,
});

/** €2,816.40 */
export function formatEuro(value: number): string {
  return `€${moneyFormatter.format(value)}`;
}

/** €42,000 */
export function formatEuroWhole(value: number): string {
  return `€${wholeFormatter.format(Math.round(value))}`;
}

export function formatPercent(fraction: number): string {
  return `${(fraction * 100).toFixed(1)}%`;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

interface MonthlyInputParams {
  annualSalary: number;
  /** Tablodan düzenlenen aylık brüt ücretler (null = yıllık / 12) */
  wageOverrides: (number | null)[];
  allowance: number;
  bonuses: Partial<Record<Month, number>>;
}

export function buildMonthlyInputs({
  annualSalary,
  wageOverrides,
  allowance,
  bonuses,
}: MonthlyInputParams): MonthlySalaryInput[] {
  const evenWage =
    annualSalary > 0 ? Number((annualSalary / 12).toFixed(2)) : 0;
  return MONTHS.map((month, index) => ({
    month,
    grossWage: wageOverrides[index] ?? evenWage,
    allowanceBonus: allowance,
    bonus: bonuses[month] || 0,
  }));
}

export interface SalaryTotals {
  /** Brüt toplam + ödeneğin vergisiz yarısı (sonuç panelindeki "Gross pay") */
  grossPay: number;
  tax: number;
  ssc: number;
  /** Ödenen net (ödeneğin vergisiz yarısı dahil) */
  paid: number;
  statutoryBonus: number;
  allowanceHalf: number;
  basic: number;
  monthsWorked: number;
}

export function summarizeTotals(data: MonthlySalaryOutput[]): SalaryTotals {
  const sum = (pick: (row: MonthlySalaryOutput) => number) =>
    data.reduce((total, row) => total + pick(row), 0);
  const allowanceHalf = sum((row) => row.paid - row.net);
  return {
    grossPay: sum((row) => row.grossTotal) + allowanceHalf,
    tax: sum((row) => row.incomeTax),
    ssc: sum((row) => row.sscTax),
    paid: sum((row) => row.paid),
    statutoryBonus: sum((row) => row.governmentBonus),
    allowanceHalf,
    basic: sum((row) => row.basicSalary),
    monthsWorked: data.filter((row) => row.employmentRatio > 0).length,
  };
}

/** Kesintilerin brüt içindeki payı (sonuç çubuğu ve "you keep" yüzdesi) */
export function shareOf(value: number, totals: SalaryTotals): number {
  return totals.grossPay > 0 ? value / totals.grossPay : 0;
}

/**
 * Motorun dilim seçimiyle aynı: bu yıl kazanılan temel ücret + önceki
 * işverendeki matrah üzerinden marjinal oran
 */
export function findTaxBandRate(
  data: MonthlySalaryOutput[],
  config: SalaryCalculatorConfig,
): number {
  const taxType = config.simpleTaxType
    ? resolveTaxRateType(
        config.year,
        config.simpleTaxType,
        config.childCount ?? 0,
      )
    : config.taxRateType;
  const brackets = getTaxBracketsForYear(config.year, taxType);
  const annual =
    data.reduce((total, row) => total + row.basicSalary, 0) +
    (config.previousEmployment?.taxableIncome ?? 0);
  const bracket =
    brackets.find((b) => annual <= b.max) ?? brackets[brackets.length - 1];
  return bracket?.rate ?? 0;
}

export function resultNote(totals: SalaryTotals): string {
  const notes: string[] = [];
  if (totals.statutoryBonus > 0) {
    notes.push(
      `Gross includes ${formatEuro(totals.statutoryBonus)} in statutory bonuses, paid in March, June, September and December.`,
    );
  }
  if (totals.allowanceHalf > 0) {
    notes.push(
      "Half of your allowance is taxed; the other half is paid on top.",
    );
  }
  return notes.length > 0
    ? notes.join(" ")
    : "Enter your gross salary to see your breakdown.";
}

// ==================== AYLIK DÖKÜM SÜTUNLARI ====================

export const BREAKDOWN_COLUMNS = [
  { key: "wage", label: "Gross wage" },
  { key: "bonus", label: "Bonus" },
  { key: "gov", label: "Statutory bonus" },
  { key: "nonTax", label: "Non-tax benefit" },
  { key: "taxBen", label: "Taxable benefit" },
  { key: "g", label: "Gross total" },
  { key: "base", label: "SSC base" },
  { key: "s", label: "SSC" },
  { key: "inc", label: "Income base" },
  { key: "cum", label: "Cumulative income" },
  { key: "t", label: "Income tax" },
  { key: "n", label: "Net" },
  { key: "paid", label: "Paid" },
] as const;

export type BreakdownColumnKey = (typeof BREAKDOWN_COLUMNS)[number]["key"];

export const DESKTOP_DEFAULT_COLUMNS: BreakdownColumnKey[] = [
  "wage",
  "bonus",
  "g",
  "s",
  "t",
  "n",
  "paid",
];
export const TABLET_DEFAULT_COLUMNS: BreakdownColumnKey[] = [
  "wage",
  "bonus",
  "s",
  "t",
  "paid",
];

const COLUMN_FIELD: Record<
  Exclude<BreakdownColumnKey, "wage" | "bonus">,
  keyof MonthlySalaryOutput
> = {
  gov: "governmentBonus",
  nonTax: "nonTaxBenefit",
  taxBen: "taxBenefit",
  g: "grossTotal",
  base: "sscBase",
  s: "sscTax",
  inc: "incomeBase",
  cum: "cumulativeIncomeBase",
  t: "incomeTax",
  n: "net",
  paid: "paid",
};

export function columnValue(
  row: MonthlySalaryOutput,
  key: Exclude<BreakdownColumnKey, "wage" | "bonus">,
): number {
  return Number(row[COLUMN_FIELD[key]]) || 0;
}

/** Toplam satırı: ücret sütunu kıst temel ücretin toplamı, kümülatif sütun yok */
export function columnTotal(
  data: MonthlySalaryOutput[],
  key: BreakdownColumnKey,
): number | null {
  if (key === "cum") return null;
  if (key === "wage")
    return round2(data.reduce((t, r) => t + r.basicSalary, 0));
  if (key === "bonus") return round2(data.reduce((t, r) => t + r.bonus, 0));
  return round2(data.reduce((t, r) => t + columnValue(r, key), 0));
}

/** Kıst ay etiketi: "From 15 Mar" (başlangıç ayı ve tam olmayan ay) */
export function partialMonthLabel(
  row: MonthlySalaryOutput,
  index: number,
  startDate?: Date,
): string | null {
  if (row.employmentRatio <= 0 || row.employmentRatio >= 1) return null;
  if (startDate && startDate.getMonth() === index) {
    return `From ${startDate.getDate()} ${MONTHS[index].slice(0, 3)}`;
  }
  return null;
}
