/**
 * Malta Maternity & Paternity Leave Hesaplayıcısı — 2026
 * Çalışanlar: 18 hafta doğum izni = 14 hafta işveren (tam maaş)
 *   + 4 hafta devlet Maternity Leave Benefit (€213,54/hafta).
 * Self-occupied: 14 hafta Maternity Benefit €221,78/hafta + 4 hafta MLB €213,54.
 * İşveren ödemeli izne hak kazanmayanlar: 14 hafta flat Maternity Benefit €140,29/hafta.
 * Babalar: 10 iş günü ücretli babalık izni (tam maaş, işveren).
 * Kaynak: socialsecurity.gov.mt — Maternity Benefit / Maternity Leave Benefit, 2026
 */

const RATES_2026 = {
  MLB_WEEKLY: 213.54, // 4 haftalık devlet Maternity Leave Benefit
  MLB_WEEKS: 4,
  EMPLOYER_WEEKS: 14, // işveren tam maaş
  BENEFIT_FLAT_WEEKLY: 140.29, // istihdam dışı / hak kazanmayan
  BENEFIT_SELF_OCCUPIED_WEEKLY: 221.78,
  BENEFIT_WEEKS: 14,
  PATERNITY_DAYS: 10, // iş günü, tam ücretli
} as const;

export type MaternityStatus = "employed" | "selfOccupied" | "notEntitled";

export interface MaternityInput {
  /** Haftalık brüt maaş (EUR) — employed için işveren dönemini hesaplar */
  weeklyGrossSalary: number;
  /** Durum: çalışan / self-occupied / işveren iznine hak kazanmayan */
  status: MaternityStatus;
}

export interface MaternityOutput {
  /** Toplam izin süresi (hafta) */
  totalWeeks: number;
  /** İlk 14 haftanın toplam geliri (EUR) */
  first14WeeksPay: number;
  /** İlk 14 haftanın haftalık oranı (EUR) */
  first14WeeklyRate: number;
  /** İlk 14 haftayı kim ödüyor */
  first14Source: "employer" | "government";
  /** Son 4 haftanın toplamı (MLB, EUR) — hak yoksa 0 */
  last4WeeksPay: number;
  /** 18 haftalık toplam gelir (EUR) */
  totalPay: number;
  /** Tam maaşla kıyasla fark (EUR, pozitif = kayıp) */
  incomeLossVsFullSalary: number;
  /** Babalık izni bilgisi */
  paternityDays: number;
}

/**
 * 2026 doğum izni gelirini hesaplar
 */
export function calculateMaternity(input: MaternityInput): MaternityOutput {
  const weekly = Math.max(0, input.weeklyGrossSalary);

  let first14WeeklyRate: number;
  let first14Source: MaternityOutput["first14Source"];
  let last4WeeksPay: number;
  let totalWeeks: number;

  switch (input.status) {
    case "employed":
      // 14 hafta işveren tam maaş + 4 hafta MLB
      first14WeeklyRate = weekly;
      first14Source = "employer";
      last4WeeksPay = RATES_2026.MLB_WEEKLY * RATES_2026.MLB_WEEKS;
      totalWeeks = 18;
      break;
    case "selfOccupied":
      // 14 hafta self-occupied Maternity Benefit + 4 hafta MLB
      first14WeeklyRate = RATES_2026.BENEFIT_SELF_OCCUPIED_WEEKLY;
      first14Source = "government";
      last4WeeksPay = RATES_2026.MLB_WEEKLY * RATES_2026.MLB_WEEKS;
      totalWeeks = 18;
      break;
    case "notEntitled":
      // Sadece 14 hafta flat Maternity Benefit
      first14WeeklyRate = RATES_2026.BENEFIT_FLAT_WEEKLY;
      first14Source = "government";
      last4WeeksPay = 0;
      totalWeeks = 14;
      break;
  }

  const first14WeeksPay =
    Math.round(first14WeeklyRate * RATES_2026.EMPLOYER_WEEKS * 100) / 100;
  const totalPay = Math.round((first14WeeksPay + last4WeeksPay) * 100) / 100;
  const fullSalaryForPeriod = weekly * totalWeeks;
  const incomeLossVsFullSalary = Math.max(
    0,
    Math.round((fullSalaryForPeriod - totalPay) * 100) / 100,
  );

  return {
    totalWeeks,
    first14WeeksPay,
    first14WeeklyRate,
    first14Source,
    last4WeeksPay,
    totalPay,
    incomeLossVsFullSalary,
    paternityDays: RATES_2026.PATERNITY_DAYS,
  };
}

/**
 * UI için 2026 oranları
 */
export function getMaternityRates() {
  return RATES_2026;
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
