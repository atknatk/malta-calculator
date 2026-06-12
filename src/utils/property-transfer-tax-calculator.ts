/**
 * Malta Property Transfer Tax (Final Withholding Tax) Calculator
 * Seller-side tax on transfers of immovable property — Income Tax Act, Article 5A.
 * Rates: 8% standard, 5% (<5 years, non-project), 2% (sole residence <3 years),
 * 10% (acquired before 1 Jan 2004), 7% / 12% (inherited), 0% (3+ year sole residence).
 * Source: Malta Tax & Customs Administration (mtca.gov.mt), 2026.
 */

export type PropertyTransferScenario =
  | "standard"
  | "within5Years"
  | "soleResidenceUnder3"
  | "soleResidence3Plus"
  | "pre2004"
  | "inheritedPost1992"
  | "inheritedPre1992";

export interface PropertyTransferTaxInput {
  /** Transfer (selling) price in EUR */
  transferValue: number;
  /** Which rate scenario applies to the sale */
  scenario: PropertyTransferScenario;
  /** Acquisition value declared in the causa mortis deed (inherited after 24 Nov 1992 only) */
  acquisitionValue?: number;
  /** Licensed estate agency/brokerage fee — deductible from the taxable base */
  brokerageFee?: number;
}

export interface PropertyTransferTaxOutput {
  /** Final withholding tax due in EUR */
  tax: number;
  /** Rate applied as a percentage (e.g. 8) */
  rateApplied: number;
  /** Base the rate was applied to (after brokerage fee / acquisition value deductions) */
  taxableBase: number;
  /** Tax as percentage of the full transfer value */
  effectiveRate: number;
  /** Transfer value minus tax */
  netProceeds: number;
  /** Saving compared to the standard 8% rate (0 when standard or higher) */
  savingsVsStandard: number;
  /** True when the transfer is fully exempt */
  isExempt: boolean;
  /** Description of the calculation */
  description: string;
}

/** Final withholding tax rates per scenario */
const SCENARIO_RATES: Record<PropertyTransferScenario, number> = {
  standard: 0.08,
  within5Years: 0.05,
  soleResidenceUnder3: 0.02,
  soleResidence3Plus: 0,
  pre2004: 0.1,
  inheritedPost1992: 0.12,
  inheritedPre1992: 0.07,
} as const;

const SCENARIO_DESCRIPTIONS: Record<PropertyTransferScenario, string> = {
  standard:
    "Standard rate: 8% final withholding tax on the transfer value. Paid by the seller via the notary on the deed of sale.",
  within5Years:
    "Reduced rate: 5% applies when the property is sold within 5 years of acquisition and does not form part of a project.",
  soleResidenceUnder3:
    "Reduced rate: 2% applies when your sole residence is sold within 3 years of acquisition.",
  soleResidence3Plus:
    "Exempt: a property owned and occupied as your sole ordinary residence for at least 3 consecutive years and sold within 12 months of vacating it pays no property transfer tax.",
  pre2004:
    "Higher rate: 10% applies to property acquired before 1 January 2004.",
  inheritedPost1992:
    "Inherited after 24 November 1992: 12% on the difference between the transfer value and the acquisition value declared in the causa mortis deed.",
  inheritedPre1992:
    "Inherited on or before 24 November 1992: 7% final withholding tax on the transfer value.",
} as const;

/**
 * Calculate the seller's final withholding tax on a Malta property transfer
 */
export function calculatePropertyTransferTax(
  input: PropertyTransferTaxInput,
): PropertyTransferTaxOutput {
  const { transferValue, scenario } = input;
  const brokerageFee = Math.max(0, input.brokerageFee ?? 0);
  const acquisitionValue = Math.max(0, input.acquisitionValue ?? 0);

  const rate = SCENARIO_RATES[scenario];

  // Vergi matrahı: transfer değeri eksi acente ücreti; miras (post-1992) için kazanç üzerinden
  const valueAfterFees = Math.max(0, transferValue - brokerageFee);
  const taxableBase =
    scenario === "inheritedPost1992"
      ? Math.max(0, valueAfterFees - acquisitionValue)
      : valueAfterFees;

  // Cente yuvarla — float hatalarını önler (örn. 300000 * 0.07)
  const tax = Math.round(taxableBase * rate * 100) / 100;
  const effectiveRate = transferValue > 0 ? (tax / transferValue) * 100 : 0;
  const netProceeds = transferValue - tax;

  const standardTax =
    Math.round(valueAfterFees * SCENARIO_RATES.standard * 100) / 100;
  const savingsVsStandard = Math.max(0, standardTax - tax);

  return {
    tax,
    rateApplied: rate * 100,
    taxableBase,
    effectiveRate,
    netProceeds,
    savingsVsStandard,
    isExempt: scenario === "soleResidence3Plus",
    description: SCENARIO_DESCRIPTIONS[scenario],
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
 * Scenario metadata for UI option lists
 */
export function getScenarioOptions(): Array<{
  value: PropertyTransferScenario;
  label: string;
  detail: string;
  rateLabel: string;
}> {
  return [
    {
      value: "standard",
      label: "Standard sale",
      detail: "Owned 5+ years, or part of a project",
      rateLabel: "8%",
    },
    {
      value: "within5Years",
      label: "Sold within 5 years",
      detail: "Not part of a project",
      rateLabel: "5%",
    },
    {
      value: "soleResidenceUnder3",
      label: "Sole residence, sold within 3 years",
      detail: "Declared as your only residence",
      rateLabel: "2%",
    },
    {
      value: "soleResidence3Plus",
      label: "Sole residence for 3+ years",
      detail: "Sold within 12 months of moving out",
      rateLabel: "Exempt",
    },
    {
      value: "pre2004",
      label: "Acquired before 2004",
      detail: "Bought before 1 January 2004",
      rateLabel: "10%",
    },
    {
      value: "inheritedPost1992",
      label: "Inherited after 24 Nov 1992",
      detail: "12% on the gain over the declared value",
      rateLabel: "12%",
    },
    {
      value: "inheritedPre1992",
      label: "Inherited on/before 24 Nov 1992",
      detail: "Flat rate on the transfer value",
      rateLabel: "7%",
    },
  ];
}
