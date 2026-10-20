/**
 * Malta First-Time Buyer Teşvik Hesaplayıcısı — 2026
 * - Damga vergisi muafiyeti: ilk €200.000 (Budget 2026 ile kalıcılaştırıldı);
 *   kalan %5 standart oranda.
 * - UCA / 20+ yıl boş / geleneksel mülkler: ilk €750.000 muafiyet (tüm alıcılar)
 *   + nakit grant: €15.000 Malta / €30.000 Gozo (FTB).
 * - Property Acquisition Grant (Housing Authority, Ağustos 2026 şartnamesi):
 *   €10.000 (10 yıl × €1.000) — 1 Oca 2022 sonrası ilk konut, banka kredisiyle.
 *   EU Disability Card sahibi FTB: €20.000 (10 × €2.000).
 *   Çiftte mülk birinin ilk evi değilse: €5.000 (engelli kartıyla €10.000).
 *   Second-time buyer (başka konutu yok, 1 Oca 2026 sonrası tek/birincil konut):
 *   €10.000'e kadar (daha önce alınan grant düşülür).
 * - Deposit Assistance Scheme: €250.000'a kadar mülklerde %10 depozito desteği (bilgi).
 * Kaynak: housingauthority.gov.mt (FTB-E10K-Grant-ENG-2026.pdf), Budget 2026
 * (CC Malta), firsthome.mt — 2026
 */

const FTB_2026 = {
  STANDARD_DUTY_RATE: 0.05,
  FTB_EXEMPTION: 200000, // ilk €200.000 muaf
  UCA_EXEMPTION: 750000, // UCA / boş / geleneksel mülklerde ilk €750.000 muaf
  GRANT_TOTAL: 10000, // 10 yıl × €1.000
  GRANT_DISABILITY: 20000, // EU Disability Card: 10 yıl × €2.000
  GRANT_JOINT_NON_FTB: 5000, // çiftte biri FTB değil: 10 yıl × €500
  GRANT_JOINT_NON_FTB_DISABILITY: 10000, // aynı durum + engelli kartı
  GRANT_YEARS: 10,
  SECOND_TIME_BUYER_FROM: "2026-01-01",
  UCA_GRANT_MALTA: 15000,
  UCA_GRANT_GOZO: 30000,
  DEPOSIT_SCHEME_CAP: 250000,
} as const;

export type BuyerType = "first-time" | "second-time";

export interface FirstTimeBuyerInput {
  /** Mülk fiyatı (EUR) */
  propertyPrice: number;
  /** UCA içinde / 20+ yıldır boş / geleneksel Malta mimarisi mi */
  isUCAOrVacant: boolean;
  /** Mülk Gozo'da mı (UCA grant tutarını etkiler) */
  isGozo: boolean;
  /** Banka kredisiyle mi alınıyor (€10.000 grant şartı) */
  withBankLoan: boolean;
  /** İlk kez mi, ikinci kez mi alıyor (varsayılan: first-time) */
  buyerType?: BuyerType;
  /** Başvurulardan birinde geçerli EU Disability Card var mı */
  hasDisabilityCard?: boolean;
  /** Ortak alımda mülk başvuranlardan birinin ilk evi değil mi */
  jointWithNonFirstTimeBuyer?: boolean;
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

  const isSecondTime = input.buyerType === "second-time";

  // Second-time buyer €200.000 FTB muafiyetinden yararlanamaz; UCA muafiyeti
  // tüm alıcılara açıktır
  const exemptionCap = input.isUCAOrVacant
    ? FTB_2026.UCA_EXEMPTION
    : isSecondTime
      ? 0
      : FTB_2026.FTB_EXEMPTION;
  const exemptAmount = Math.min(price, exemptionCap);
  const taxableAmount = Math.max(0, price - exemptionCap);

  const stampDutyDue =
    Math.round(taxableAmount * FTB_2026.STANDARD_DUTY_RATE * 100) / 100;
  const standardDuty =
    Math.round(price * FTB_2026.STANDARD_DUTY_RATE * 100) / 100;
  const stampDutySaved = Math.round((standardDuty - stampDutyDue) * 100) / 100;

  const ftbGrant = input.withBankLoan ? getGrantAmount(input) : 0;
  // UCA nakit grant yalnızca ilk kez alıcılar için
  const ucaGrant =
    input.isUCAOrVacant && !isSecondTime
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
 * Property Acquisition Grant tutarı (Housing Authority şartnamesi madde 3)
 */
function getGrantAmount(input: FirstTimeBuyerInput): number {
  if (input.buyerType === "second-time") return FTB_2026.GRANT_TOTAL;
  if (input.jointWithNonFirstTimeBuyer) {
    return input.hasDisabilityCard
      ? FTB_2026.GRANT_JOINT_NON_FTB_DISABILITY
      : FTB_2026.GRANT_JOINT_NON_FTB;
  }
  return input.hasDisabilityCard
    ? FTB_2026.GRANT_DISABILITY
    : FTB_2026.GRANT_TOTAL;
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
