/**
 * Malta Free Childcare Scheme Hesaplayıcısı — 2026
 * Hak edilen ücretsiz saat (aylık) = düşük çalışan ebeveynin aylık çalışma saati
 *   (haftalık × 52 ÷ 12) + %10 kontenjan + 20 saat yol payı.
 * Öğrenciler: part-time 20 saat/hafta, full-time 40 saat/hafta sayılır.
 * Uygunluk: her iki ebeveyn de çalışıyor/okuyor olmalı; çocuk 3 ay – Kinder 1.
 * Şemadan yararlanmayanlar: kayıtlı merkez için yılda çocuk başına
 * €2.000'a kadar vergi indirimi alternatifi.
 * Kaynak: jobsplus.gov.mt / childcaremalta.mt Free Childcare Scheme broşürü, 2026
 */

const SCHEME_2026 = {
  CONTINGENCY_RATE: 0.1, // aylık çalışma saatinin %10'u
  COMMUTE_HOURS_MONTHLY: 20,
  PART_TIME_STUDENT_WEEKLY: 20,
  FULL_TIME_STUDENT_WEEKLY: 40,
  WEEKS_PER_MONTH: 52 / 12,
  TAX_REBATE_ALTERNATIVE: 2000, // şema dışı kalanlara yıllık/çocuk
} as const;

export type ParentActivity =
  | "working"
  | "fullTimeStudent"
  | "partTimeStudent"
  | "notWorking";

export interface ChildcareParent {
  activity: ParentActivity;
  /** Haftalık çalışma saati (yalnızca working için) */
  weeklyHours?: number;
}

export interface ChildcareInput {
  /** Tek ebeveyn mi */
  singleParent: boolean;
  parent1: ChildcareParent;
  /** Çift ise ikinci ebeveyn */
  parent2?: ChildcareParent;
  /** Özel kreş saatlik ücreti (EUR) — tasarruf tahmini için, kullanıcı girer */
  privateHourlyRate?: number;
}

export interface ChildcareOutput {
  /** Uygun mu */
  eligible: boolean;
  /** Uygun değilse nedeni */
  ineligibleReason?: string;
  /** Hakka esas haftalık saat (düşük ebeveyn) */
  baseWeeklyHours: number;
  /** Aylık çalışma saati karşılığı */
  baseMonthlyHours: number;
  /** %10 kontenjan saati (aylık) */
  contingencyHours: number;
  /** Yol payı (aylık) */
  commuteHours: number;
  /** Toplam aylık ücretsiz saat */
  totalMonthlyHours: number;
  /** Haftalık eşdeğeri */
  weeklyEquivalent: number;
  /** Verilen saatlik ücretle yıllık tasarruf tahmini (EUR) */
  estimatedAnnualValue: number;
  /** Şema dışı vergi indirimi alternatifi (EUR/yıl/çocuk) */
  taxRebateAlternative: number;
}

function effectiveWeeklyHours(parent: ChildcareParent): number | null {
  switch (parent.activity) {
    case "working":
      return Math.max(0, parent.weeklyHours ?? 0);
    case "fullTimeStudent":
      return SCHEME_2026.FULL_TIME_STUDENT_WEEKLY;
    case "partTimeStudent":
      return SCHEME_2026.PART_TIME_STUDENT_WEEKLY;
    case "notWorking":
      return null; // uygunluğu bozar
  }
}

/**
 * Free Childcare Scheme aylık saat hakkını hesaplar
 */
export function calculateChildcare(input: ChildcareInput): ChildcareOutput {
  const rate = Math.max(0, input.privateHourlyRate ?? 0);

  const none: Omit<ChildcareOutput, "eligible" | "ineligibleReason"> = {
    baseWeeklyHours: 0,
    baseMonthlyHours: 0,
    contingencyHours: 0,
    commuteHours: 0,
    totalMonthlyHours: 0,
    weeklyEquivalent: 0,
    estimatedAnnualValue: 0,
    taxRebateAlternative: SCHEME_2026.TAX_REBATE_ALTERNATIVE,
  };

  const hours1 = effectiveWeeklyHours(input.parent1);
  const hours2 = input.singleParent
    ? Infinity // tek ebeveyn: yalnızca kendi saati sayılır
    : effectiveWeeklyHours(input.parent2 ?? { activity: "notWorking" });

  if (hours1 === null || hours2 === null) {
    return {
      eligible: false,
      ineligibleReason: input.singleParent
        ? "The parent must be in employment or education to qualify."
        : "Both parents must be in employment or education to qualify for the Free Childcare Scheme.",
      ...none,
    };
  }

  // Hak, daha az çalışan/okuyan ebeveynin saatine göre belirlenir
  const baseWeeklyHours = Math.min(hours1, hours2);

  if (baseWeeklyHours <= 0) {
    return {
      eligible: false,
      ineligibleReason: "Weekly working hours must be greater than zero.",
      ...none,
    };
  }

  const baseMonthlyHours =
    Math.round(baseWeeklyHours * SCHEME_2026.WEEKS_PER_MONTH * 10) / 10;
  const contingencyHours =
    Math.round(baseMonthlyHours * SCHEME_2026.CONTINGENCY_RATE * 10) / 10;
  const commuteHours = SCHEME_2026.COMMUTE_HOURS_MONTHLY;
  const totalMonthlyHours =
    Math.round((baseMonthlyHours + contingencyHours + commuteHours) * 10) / 10;
  const weeklyEquivalent =
    Math.round((totalMonthlyHours / SCHEME_2026.WEEKS_PER_MONTH) * 10) / 10;

  return {
    eligible: true,
    baseWeeklyHours,
    baseMonthlyHours,
    contingencyHours,
    commuteHours,
    totalMonthlyHours,
    weeklyEquivalent,
    estimatedAnnualValue: Math.round(totalMonthlyHours * 12 * rate * 100) / 100,
    taxRebateAlternative: SCHEME_2026.TAX_REBATE_ALTERNATIVE,
  };
}

/**
 * UI için şema sabitleri
 */
export function getChildcareScheme() {
  return SCHEME_2026;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
