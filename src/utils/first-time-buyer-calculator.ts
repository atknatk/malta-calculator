/**
 * Malta First-Time Buyer Teşvik Hesaplayıcısı — 2026
 * - Damga vergisi muafiyeti: ilk €200.000 (Budget 2026 ile kalıcılaştırıldı);
 *   kalan %5 standart oranda.
 * - UCA / 20+ yıl boş / geleneksel mülkler: ilk €750.000 muafiyet (tüm alıcılar)
 *   + nakit grant: €15.000 Malta / €30.000 Gozo (FTB).
 * - FTB Grant: €10.000 (10 yıl × €1.000) — ilk birincil konut, banka kredisiyle,
 *   1 Oca 2024 – 31 Ara 2026 arası alımlar.
 * - Deposit Assistance Scheme: €250.000'a kadar mülklerde %10 depozito desteği (bilgi).
 * Kaynak: servizz.gov.mt (Grant for First-time Buyers), Budget 2026 (CC Malta),
 * firsthome.mt — 2026
 */

const FTB_2026 = {
  STANDARD_DUTY_RATE: 0.05,
  FTB_EXEMPTION: 200000, // ilk €200.000 muaf
  UCA_EXEMPTION: 750000, // UCA / boş / geleneksel mülklerde ilk €750.000 muaf
  GRANT_TOTAL: 10000, // 10 yıl × €1.000
  GRANT_YEARS: 10,
  UCA_GRANT_MALTA: 15000,
  UCA_GRANT_GOZO: 30000,
  DEPOSIT_SCHEME_CAP: 250000,
} as const;

export interface FirstTimeBuyerInput {
  /** Mülk fiyatı (EUR) */
  propertyPrice: number;
  /** UCA içinde / 20+ yıldır boş / geleneksel Malta mimarisi mi */
  isUCAOrVacant: boolean;
  /** Mülk Gozo'da mı (UCA grant tutarını etkiler) */
  isGozo: boolean;
  /** Banka kredisiyle mi alınıyor (€10.000 grant şartı) */
  withBankLoan: boolean;
}

export interface FirstTimeBuyerOutput {
  /** Muafiyet uygulanan tutar (EUR) */
  exemptAmount: number;
  /** Ödenecek damga vergisi (EUR) */
  stampDutyDue: number;
  /** Standart 5%'e göre damga vergisi tasarrufu (EUR) */
  stampDutySaved: number;
  /** €10.000 FTB grant hakkı (EUR) */
  ftbGrant: number;
  /** Yıllık grant taksidi (EUR) */
  ftbGrantPerYear: number;
  /** UCA nakit grant (EUR) */
  ucaGrant: number;
  /** Toplam teşvik paketi (EUR) */
  totalBenefits: number;
  /** Deposit Assistance Scheme kapsamında mı */
  depositSchemeEligible: boolean;
}

/**
 * First-time buyer teşvik paketini hesaplar
 */
export function calculateFirstTimeBuyer(
  input: FirstTimeBuyerInput,
): FirstTimeBuyerOutput {
  const price = Math.max(0, input.propertyPrice);

  const exemptionCap = input.isUCAOrVacant
    ? FTB_2026.UCA_EXEMPTION
    : FTB_2026.FTB_EXEMPTION;
  const exemptAmount = Math.min(price, exemptionCap);
  const taxableAmount = Math.max(0, price - exemptionCap);

  const stampDutyDue =
    Math.round(taxableAmount * FTB_2026.STANDARD_DUTY_RATE * 100) / 100;
  const standardDuty =
    Math.round(price * FTB_2026.STANDARD_DUTY_RATE * 100) / 100;
  const stampDutySaved = Math.round((standardDuty - stampDutyDue) * 100) / 100;

  const ftbGrant = input.withBankLoan ? FTB_2026.GRANT_TOTAL : 0;
  const ucaGrant = input.isUCAOrVacant
    ? input.isGozo
      ? FTB_2026.UCA_GRANT_GOZO
      : FTB_2026.UCA_GRANT_MALTA
    : 0;

  return {
    exemptAmount,
    stampDutyDue,
    stampDutySaved,
    ftbGrant,
    ftbGrantPerYear: ftbGrant / FTB_2026.GRANT_YEARS,
    ucaGrant,
    totalBenefits:
      Math.round((stampDutySaved + ftbGrant + ucaGrant) * 100) / 100,
    depositSchemeEligible: price <= FTB_2026.DEPOSIT_SCHEME_CAP,
  };
}

/**
 * UI için 2026 kuralları
 */
export function getFTBRules() {
  return FTB_2026;
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
