/**
 * Malta In-Work Benefit Hesaplayıcısı — 2026
 * Çalışan ebeveynlere, 23 yaş altı hanede yaşayan çocuk başına yıllık yardım.
 * 2026 bantları (Basic Year 2024 geliri üzerinden):
 *   Tek ebeveyn:        €6.600 – €24.180,99 → çocuk başına yılda en fazla €1.627
 *                       €24.181 – €35.000   → çocuk başına €327
 *   Çift (ikisi çalışan): €10.000 – €36.846,99 (düşük kazanan ≥ €3.000)
 *                                            → çocuk başına en fazla €1.627
 *                       €36.847 – €50.000   → çocuk başına €327
 *   Çift (tek çalışan): €6.600 – €27.180,99 → çocuk başına en fazla €856
 *                       €27.181 – €35.000   → çocuk başına €327
 * Ödeme: çeyreklik (Ocak/Nisan/Temmuz/Ekim ilk cumartesi).
 * Tam tutar resmî DSS ölçeğine göre gelirle azalır — bu araç bant maksimumunu gösterir.
 * Kaynak: socialsecurity.gov.mt — In-Work Benefit, 2026
 */

export type HouseholdType =
  | "singleParent"
  | "coupleBothWorking"
  | "coupleOneWorking";

interface BenefitBand {
  minIncome: number;
  fullBandMax: number; // tam oran bandının üst sınırı
  fullRatePerChild: number; // tam bandın çocuk başına yıllık maksimumu
  reducedBandMax: number; // indirimli (sabit) bandın üst sınırı
  reducedRatePerChild: number;
}

const BANDS_2026: Record<HouseholdType, BenefitBand> = {
  singleParent: {
    minIncome: 6600,
    fullBandMax: 24180.99,
    fullRatePerChild: 1627,
    reducedBandMax: 35000,
    reducedRatePerChild: 327,
  },
  coupleBothWorking: {
    minIncome: 10000,
    fullBandMax: 36846.99,
    fullRatePerChild: 1627,
    reducedBandMax: 50000,
    reducedRatePerChild: 327,
  },
  coupleOneWorking: {
    minIncome: 6600,
    fullBandMax: 27180.99,
    fullRatePerChild: 856,
    reducedBandMax: 35000,
    reducedRatePerChild: 327,
  },
} as const;

/** Çift (ikisi çalışan) için düşük kazananın alt sınırı */
const SECOND_EARNER_MINIMUM = 3000;

export interface InWorkBenefitInput {
  /** Hane tipi */
  householdType: HouseholdType;
  /** Yıllık net istihdam geliri (çiftlerde toplam, EUR) */
  annualIncome: number;
  /** 23 yaş altı, hanede yaşayan çocuk sayısı */
  childCount: number;
  /** Düşük kazanan ebeveynin geliri (sadece ikisi çalışan çiftlerde) */
  lowerEarnerIncome?: number;
}

export interface InWorkBenefitOutput {
  /** Uygun mu */
  eligible: boolean;
  /** Uygun değilse nedeni */
  ineligibleReason?: string;
  /** Bant: full (yüksek oran) | reduced (sabit €327) */
  band?: "full" | "reduced";
  /** Çocuk başına yıllık maksimum (EUR) */
  maxPerChild: number;
  /** Toplam yıllık maksimum (EUR) */
  annualMax: number;
  /** Çeyreklik ödeme başına maksimum (EUR) */
  quarterlyMax: number;
  /** İkisi-çalışan çift, düşük kazanan kuralı yüzünden tek-çalışan bandına düştü mü */
  reroutedToOneWorking: boolean;
}

/**
 * 2026 In-Work Benefit uygunluğunu ve bant maksimumunu hesaplar
 */
export function calculateInWorkBenefit(
  input: InWorkBenefitInput,
): InWorkBenefitOutput {
  const income = Math.max(0, input.annualIncome);
  const children = Math.max(0, Math.floor(input.childCount));

  const none: Omit<InWorkBenefitOutput, "eligible" | "ineligibleReason"> = {
    maxPerChild: 0,
    annualMax: 0,
    quarterlyMax: 0,
    reroutedToOneWorking: false,
  };

  if (children === 0) {
    return {
      eligible: false,
      ineligibleReason:
        "The In-Work Benefit requires at least one child under 23 living in your household.",
      ...none,
    };
  }

  // İkisi çalışan çiftte düşük kazanan €3.000 altındaysa tek-çalışan kuralları uygulanır
  let householdType = input.householdType;
  let rerouted = false;
  if (
    householdType === "coupleBothWorking" &&
    (input.lowerEarnerIncome ?? 0) < SECOND_EARNER_MINIMUM
  ) {
    householdType = "coupleOneWorking";
    rerouted = true;
  }

  const band = BANDS_2026[householdType];

  if (income < band.minIncome) {
    return {
      eligible: false,
      ineligibleReason: `Annual employment income must be at least €${band.minIncome.toLocaleString("en-MT")} for this household type.`,
      ...none,
      reroutedToOneWorking: rerouted,
    };
  }

  if (income > band.reducedBandMax) {
    return {
      eligible: false,
      ineligibleReason: `Annual income above €${band.reducedBandMax.toLocaleString("en-MT")} exceeds the limit for this household type.`,
      ...none,
      reroutedToOneWorking: rerouted,
    };
  }

  const inFullBand = income <= band.fullBandMax;
  const maxPerChild = inFullBand
    ? band.fullRatePerChild
    : band.reducedRatePerChild;
  const annualMax = maxPerChild * children;

  return {
    eligible: true,
    band: inFullBand ? "full" : "reduced",
    maxPerChild,
    annualMax,
    quarterlyMax: Math.round((annualMax / 4) * 100) / 100,
    reroutedToOneWorking: rerouted,
  };
}

/**
 * UI için 2026 bant tablosu
 */
export function getInWorkBenefitBands(): Record<HouseholdType, BenefitBand> {
  return BANDS_2026;
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
