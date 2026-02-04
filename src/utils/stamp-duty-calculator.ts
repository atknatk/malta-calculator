/**
 * Malta Stamp Duty Calculator
 * Based on Malta Property Transfer Regulations
 */

export interface StampDutyInput {
  /** Property purchase price in EUR */
  propertyPrice: number;
  /** Whether buyer is a first-time property buyer */
  isFirstTimeBuyer: boolean;
}

export interface StampDutyOutput {
  /** Stamp duty amount in EUR */
  stampDuty: number;
  /** Effective rate as percentage */
  effectiveRate: number;
  /** Amount exempted (for first-time buyers) */
  exemptedAmount: number;
  /** Taxable amount */
  taxableAmount: number;
  /** Savings compared to standard rate */
  savings: number;
  /** Description of the calculation */
  description: string;
}

/**
 * Stamp duty rates and thresholds
 */
const STANDARD_RATE = 0.05; // 5%
const FIRST_TIME_BUYER_EXEMPTION = 200000; // €200,000

/**
 * Calculate stamp duty on property purchase
 */
export function calculateStampDuty(input: StampDutyInput): StampDutyOutput {
  const { propertyPrice, isFirstTimeBuyer } = input;

  let taxableAmount: number;
  let exemptedAmount: number;
  let description: string;

  if (isFirstTimeBuyer) {
    // First-time buyers: exempt on first €200,000
    exemptedAmount = Math.min(propertyPrice, FIRST_TIME_BUYER_EXEMPTION);
    taxableAmount = Math.max(0, propertyPrice - FIRST_TIME_BUYER_EXEMPTION);
    description = `First-time buyer: €${FIRST_TIME_BUYER_EXEMPTION.toLocaleString()} exemption applied`;
  } else {
    // Standard buyers: 5% on full amount
    exemptedAmount = 0;
    taxableAmount = propertyPrice;
    description = "Standard rate of 5% on full property value";
  }

  const stampDuty = taxableAmount * STANDARD_RATE;
  const effectiveRate =
    propertyPrice > 0 ? (stampDuty / propertyPrice) * 100 : 0;
  const standardDuty = propertyPrice * STANDARD_RATE;
  const savings = standardDuty - stampDuty;

  return {
    stampDuty,
    effectiveRate,
    exemptedAmount,
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
    firstTimeBuyerExemption: FIRST_TIME_BUYER_EXEMPTION,
    maxSavings: FIRST_TIME_BUYER_EXEMPTION * STANDARD_RATE, // €10,000
  };
}
