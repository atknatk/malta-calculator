/**
 * Malta Class 2 SSC (Self-Occupied) Hesaplayıcısı — 2026
 * Önceki yılın yıllık net gelirine göre haftalık katkı:
 *   SA  (≤ €12.543,72)                        → €36,18/hafta (sabit minimum)
 *   SB  (€12.543,73 – üst eşik)               → yıllık net gelirin %15'i ÷ 52
 *   SC1 (> €25.500, doğum ≤ 31.12.1961)       → €73,56/hafta (sabit maksimum)
 *   SC2 (> €29.083,36, doğum ≥ 01.01.1962)    → €83,89/hafta (sabit maksimum)
 * Ödeme: yılda 3 taksit (Nisan, Ağustos, Aralık).
 * İstisna: part-time self-occupied kadınlar, <25 yaş öğrenciler ve emekliler
 * SA eşiğinin altında kazanıyorsa kazancın %15'ini ödemeyi seçebilir.
 * Kaynak: MTCA Class 2 Social Security Contribution Rates 2026
 */

const CLASS2_2026 = {
  SA_MAX_INCOME: 12543.72,
  SA_WEEKLY_RATE: 36.18,
  SB_RATE: 0.15,
  SC_THRESHOLD_OLD: 25500, // doğum ≤ 31.12.1961
  SC_THRESHOLD_NEW: 29083.36, // doğum ≥ 01.01.1962
  SC_WEEKLY_OLD: 73.56,
  SC_WEEKLY_NEW: 83.89,
  WEEKS_PER_YEAR: 52,
  INSTALMENTS: 3, // Nisan, Ağustos, Aralık
} as const;

export type Class2Category = "SA" | "SB" | "SC";

export interface SelfEmployedSSCInput {
  /** Önceki yılın yıllık net geliri (EUR) */
  annualNetIncome: number;
  /** 1962 öncesi doğumlu mu */
  bornBefore1962: boolean;
  /** SA istisnası: part-time kadın / <25 öğrenci / emekli — kazancın %15'i seçeneği */
  useReducedPartTimeRate?: boolean;
}

export interface SelfEmployedSSCOutput {
  /** Uygulanan kategori */
  category: Class2Category;
  /** Haftalık katkı (EUR) */
  weeklyContribution: number;
  /** Yıllık toplam katkı (52 hafta, EUR) */
  annualContribution: number;
  /** Taksit başına tutar (3 taksit: Nisan/Ağustos/Aralık) */
  perInstalment: number;
  /** Katkının gelire oranı (yüzde) */
  effectiveRate: number;
  /** Açıklama */
  description: string;
}

/**
 * 2026 Class 2 SSC haftalık katkısını hesaplar
 */
export function calculateSelfEmployedSSC(
  input: SelfEmployedSSCInput,
): SelfEmployedSSCOutput {
  const income = Math.max(0, input.annualNetIncome);
  const scThreshold = input.bornBefore1962
    ? CLASS2_2026.SC_THRESHOLD_OLD
    : CLASS2_2026.SC_THRESHOLD_NEW;
  const scWeekly = input.bornBefore1962
    ? CLASS2_2026.SC_WEEKLY_OLD
    : CLASS2_2026.SC_WEEKLY_NEW;

  let category: Class2Category;
  let weeklyContribution: number;
  let description: string;

  if (income <= CLASS2_2026.SA_MAX_INCOME) {
    category = "SA";
    if (input.useReducedPartTimeRate) {
      // İstisna grubu: kazancın %15'i (haftalığa bölünmüş)
      weeklyContribution =
        Math.round(
          ((income * CLASS2_2026.SB_RATE) / CLASS2_2026.WEEKS_PER_YEAR) * 100,
        ) / 100;
      description =
        "SA exception: as a part-time self-occupied woman, student under 25 or pensioner you may pay 15% of your actual earnings instead of the standard SA minimum.";
    } else {
      weeklyContribution = CLASS2_2026.SA_WEEKLY_RATE;
      description = `Category SA: income up to €${CLASS2_2026.SA_MAX_INCOME.toLocaleString("en-MT")} pays the flat minimum of €${CLASS2_2026.SA_WEEKLY_RATE}/week.`;
    }
  } else if (income <= scThreshold) {
    category = "SB";
    weeklyContribution =
      Math.round(
        ((income * CLASS2_2026.SB_RATE) / CLASS2_2026.WEEKS_PER_YEAR) * 100,
      ) / 100;
    description =
      "Category SB: 15% of last year's annual net income, divided into 52 weekly contributions.";
  } else {
    category = "SC";
    weeklyContribution = scWeekly;
    description = `Category SC: income above €${scThreshold.toLocaleString("en-MT")} pays the capped maximum of €${scWeekly}/week (born ${input.bornBefore1962 ? "before 1962" : "1962 or later"}).`;
  }

  const annualContribution =
    Math.round(weeklyContribution * CLASS2_2026.WEEKS_PER_YEAR * 100) / 100;
  const perInstalment =
    Math.round((annualContribution / CLASS2_2026.INSTALMENTS) * 100) / 100;

  return {
    category,
    weeklyContribution,
    annualContribution,
    perInstalment,
    effectiveRate: income > 0 ? (annualContribution / income) * 100 : 0,
    description,
  };
}

/**
 * UI için 2026 tablosu
 */
export function getClass2Info() {
  return CLASS2_2026;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
