/**
 * Malta Stamp Duty Calculator
 * Based on Malta Property Transfer Regulations
 */

/**
 * Alıcı tipi
 * - standard: 5% tüm bedel üzerinden
 * - first_time: ilk €200,000 muaf, kalan %5 (Budget 2026 ile kalıcı)
 * - owner_occupier: ilk kez almayan ama ana konut (sole ordinary residence)
 *   alan kişi — ilk €200,000 için %3.5, kalan %5
 */
export type BuyerType = "standard" | "first_time" | "owner_occupier";

export interface StampDutyInput {
  /** Property purchase price in EUR */
  propertyPrice: number;
  /** Buyer type */
  buyerType: BuyerType;
}

export interface StampDutyOutput {
  /** Stamp duty amount in EUR */
  stampDuty: number;
  /** Effective rate as percentage */
  effectiveRate: number;
  /** Amount exempted (for first-time buyers) */
  exemptedAmount: number;
  /** Amount charged at the reduced 3.5% rate (owner-occupiers) */
  reducedRateAmount: number;
  /** Amount charged at the standard 5% rate */
  taxableAmount: number;
  /** Savings compared to standard rate */
  savings: number;
  /** Description of the calculation */
  description: string;
}

/**
 * Stamp duty rates and thresholds (Duty on Documents and Transfers Act, Cap. 364)
 */
const STANDARD_RATE = 0.05; // 5%
const REDUCED_RATE = 0.035; // 3.5% - ana konut (owner-occupier)
const FIRST_TIME_BUYER_EXEMPTION = 200000; // €200,000
const OWNER_OCCUPIER_REDUCED_BAND = 200000; // €200,000

/**
 * Calculate stamp duty on property purchase
 */
export function calculateStampDuty(input: StampDutyInput): StampDutyOutput {
  const { propertyPrice, buyerType } = input;
  const price = Math.max(0, propertyPrice);

  let exemptedAmount = 0;
  let reducedRateAmount = 0;
  let description: string;

  if (buyerType === "first_time") {
    exemptedAmount = Math.min(price, FIRST_TIME_BUYER_EXEMPTION);
    description = `First-time buyer: no duty on the first €${FIRST_TIME_BUYER_EXEMPTION.toLocaleString()}, 5% on the excess`;
  } else if (buyerType === "owner_occupier") {
    reducedRateAmount = Math.min(price, OWNER_OCCUPIER_REDUCED_BAND);
    description = `Main residence: 3.5% on the first €${OWNER_OCCUPIER_REDUCED_BAND.toLocaleString()}, 5% on the excess`;
  } else {
    description = "Standard rate of 5% on full property value";
  }

  const taxableAmount = price - exemptedAmount - reducedRateAmount;
  const stampDuty =
    taxableAmount * STANDARD_RATE + reducedRateAmount * REDUCED_RATE;
  const effectiveRate = price > 0 ? (stampDuty / price) * 100 : 0;
  const standardDuty = price * STANDARD_RATE;
  const savings = standardDuty - stampDuty;

  return {
    stampDuty,
    effectiveRate,
    exemptedAmount,
    reducedRateAmount,
    taxableAmount,
    savings,
    description,
  };
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

/**
 * Get stamp duty info
 */
export function getStampDutyInfo() {
  return {
    standardRate: STANDARD_RATE * 100,
    reducedRate: REDUCED_RATE * 100,
    firstTimeBuyerExemption: FIRST_TIME_BUYER_EXEMPTION,
    ownerOccupierReducedBand: OWNER_OCCUPIER_REDUCED_BAND,
    maxSavings: FIRST_TIME_BUYER_EXEMPTION * STANDARD_RATE, // €10,000
  };
}
