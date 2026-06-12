/**
 * Malta Sick Leave & Sickness Benefit Hesaplayıcısı — 2026
 * İşveren izni: EIRA varsayılanı yılda 2 çalışma haftası (10 iş günü) tam maaş;
 * sektör WRO'ları farklı haklar verebilir (alan düzenlenebilir).
 * Sickness Benefit (DSS): hastalığın 4. gününden itibaren, 6 günlük hafta,
 * yılda en fazla 156 gün. 2026 günlük oranlar:
 *   €25,81 — evli/birlikte yaşayan, eşi tam zamanlı çalışmıyor
 *   €17,21 — bekar veya eşi tam zamanlı çalışan
 * 156 kesintisiz günden sonra artırılmış oran: €34,42 / €25,81.
 * Kaynak: socialsecurity.gov.mt — Sickness Benefit, 2026
 */

const RATES_2026 = {
  DAILY_MARRIED: 25.81, // eşine bakan evli
  DAILY_SINGLE: 17.21, // bekar / eşi tam zamanlı çalışıyor
  INCREASED_MARRIED: 34.42,
  INCREASED_SINGLE: 25.81,
  WAITING_DAYS: 3, // ilk 3 gün benefit ödenmez
  MAX_BENEFIT_DAYS: 156, // yıllık üst sınır
  DEFAULT_EMPLOYER_DAYS: 10, // EIRA varsayılanı: 2 çalışma haftası
  WORKING_DAYS_PER_WEEK: 5,
} as const;

export type SickMaritalStatus = "marriedMaintainingSpouse" | "singleOrOther";

export interface SickLeaveInput {
  /** Haftalık brüt maaş (EUR) */
  weeklyGrossSalary: number;
  /** Bu hastalıkta toplam iş günü */
  sickDays: number;
  /** Medeni durum (benefit oranı için) */
  maritalStatus: SickMaritalStatus;
  /** İşverenin tam maaş ödediği gün hakkı (WRO'ya göre; varsayılan 10) */
  employerPaidDays?: number;
}

export interface SickLeaveOutput {
  /** İşverence tam maaş ödenen gün sayısı */
  employerDays: number;
  /** İşveren döneminin toplamı (EUR) */
  employerPay: number;
  /** Benefit ödenen gün sayısı */
  benefitDays: number;
  /** Günlük benefit oranı (EUR) */
  dailyBenefitRate: number;
  /** Benefit toplamı (EUR) */
  benefitPay: number;
  /** Bekleme günleri yüzünden ödemesiz kalan gün */
  unpaidWaitingDays: number;
  /** Toplam gelir (EUR) */
  totalIncome: number;
  /** Aynı dönemde tam maaş alınsaydı (EUR) */
  fullSalaryEquivalent: number;
  /** Gelir kaybı (EUR) */
  incomeLoss: number;
  /** 156 günlük yıllık benefit sınırı aşıldı mı */
  exceedsAnnualCap: boolean;
}

/**
 * Hastalık dönemi gelirini hesaplar: işveren dönemi + DSS sickness benefit
 */
export function calculateSickLeave(input: SickLeaveInput): SickLeaveOutput {
  const weekly = Math.max(0, input.weeklyGrossSalary);
  const sickDays = Math.max(0, Math.floor(input.sickDays));
  const employerEntitlement = Math.max(
    0,
    input.employerPaidDays ?? RATES_2026.DEFAULT_EMPLOYER_DAYS,
  );
  const dailyWage = weekly / RATES_2026.WORKING_DAYS_PER_WEEK;

  const dailyBenefitRate =
    input.maritalStatus === "marriedMaintainingSpouse"
      ? RATES_2026.DAILY_MARRIED
      : RATES_2026.DAILY_SINGLE;

  // İşveren dönemi: tam maaş
  const employerDays = Math.min(sickDays, employerEntitlement);
  const employerPay = Math.round(employerDays * dailyWage * 100) / 100;

  // Kalan günler: sickness benefit. Bekleme (ilk 3 gün) işveren dönemince
  // karşılanmadıysa ödemesiz kalır.
  const remainingDays = sickDays - employerDays;
  const waitingAlreadyCovered = Math.min(employerDays, RATES_2026.WAITING_DAYS);
  const unpaidWaitingDays = Math.min(
    remainingDays,
    RATES_2026.WAITING_DAYS - waitingAlreadyCovered,
  );
  const benefitDays = Math.min(
    Math.max(0, remainingDays - unpaidWaitingDays),
    RATES_2026.MAX_BENEFIT_DAYS,
  );
  const benefitPay = Math.round(benefitDays * dailyBenefitRate * 100) / 100;

  const totalIncome = Math.round((employerPay + benefitPay) * 100) / 100;
  const fullSalaryEquivalent = Math.round(sickDays * dailyWage * 100) / 100;
  const incomeLoss = Math.max(
    0,
    Math.round((fullSalaryEquivalent - totalIncome) * 100) / 100,
  );

  return {
    employerDays,
    employerPay,
    benefitDays,
    dailyBenefitRate,
    benefitPay,
    unpaidWaitingDays,
    totalIncome,
    fullSalaryEquivalent,
    incomeLoss,
    exceedsAnnualCap:
      remainingDays - unpaidWaitingDays > RATES_2026.MAX_BENEFIT_DAYS,
  };
}

/**
 * UI için 2026 oranları
 */
export function getSickLeaveRates() {
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
