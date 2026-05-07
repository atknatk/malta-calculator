/**
 * Malta Family Reunification Calculator
 *
 * Two schemes for family member applications:
 * 1. Family Reunification (S.L. 217.6): Average Wage (Gross) + 20% per family member
 * 2. Family Member Policy: €18,940 Net + 20% of median wage per family member
 *
 * Source: Identità Malta
 * - https://legislation.mt/eli/sl/217.6/eng/pdf
 * - https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-members-policy/
 */

// Malta wage figures used by the two family-sponsorship schemes.
// - averageWageGross: NSO Malta 2025 average annual gross wage (S.L. 217.06).
// - medianWageNet: median net wage referenced by Identità's Family Member
//   Policy as of June 2024. "Net" means gross income minus income tax and
//   social security contributions (Identità definition).
// Sources:
// - https://nso.gov.mt
// - https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-members-policy/
export const WAGE_DATA = {
  year: 2025,
  averageWageGross: 24_976,
  medianWageNet: 18_940,
  medianWageNetReference: "June 2024",
  averageWageGrossMonthly: 2_081,
  averageWageGrossWeekly: 480,
};

// Key Employee Initiative / Specialist Employee Initiative threshold under the
// Family Member Policy. Allows sponsors to skip the 12-month tenure rule when
// gross income meets these enhanced limits (per Identità, June 2024).
export const KEI_THRESHOLDS = {
  baseSponsorPlusOneDependent: 50_000,
  perAdditionalDependent: 6_000,
};

export type SchemeType = "family-reunification" | "family-member-policy";

export interface FamilyReunificationInput {
  /** Number of family members to sponsor (spouse, children, dependents) */
  familyMemberCount: number;
  /** Which scheme to calculate */
  scheme: SchemeType;
  /** Optional: Override the base wage (for custom calculations) */
  customBaseWage?: number;
}

export interface FamilyReunificationOutput {
  /** Minimum required income */
  minimumRequired: number;
  /** Type of income (gross or net) */
  incomeType: "gross" | "net";
  /** Base wage used in calculation */
  baseWage: number;
  /** Additional amount for family members */
  additionalAmount: number;
  /** Percentage added per family member */
  percentagePerMember: number;
  /** Breakdown per family member */
  breakdown: {
    base: number;
    perMemberAddition: number;
    totalAddition: number;
  };
  /** Scheme name */
  schemeName: string;
  /** Human-readable description */
  description: string;
  /** Source legislation */
  source: string;
}

/**
 * Calculate minimum salary requirement for family reunification
 */
export function calculateFamilyReunification(
  input: FamilyReunificationInput,
): FamilyReunificationOutput {
  const { familyMemberCount, scheme, customBaseWage } = input;

  if (scheme === "family-reunification") {
    // Family Reunification (S.L. 217.6)
    // Base: Average Wage (Gross) + 20% for each family member
    const baseWage = customBaseWage ?? WAGE_DATA.averageWageGross;
    const percentagePerMember = 20;
    const perMemberAddition = baseWage * (percentagePerMember / 100);
    const totalAddition = perMemberAddition * familyMemberCount;
    const minimumRequired = baseWage + totalAddition;

    return {
      minimumRequired,
      incomeType: "gross",
      baseWage,
      additionalAmount: totalAddition,
      percentagePerMember,
      breakdown: {
        base: baseWage,
        perMemberAddition,
        totalAddition,
      },
      schemeName: "Family Reunification (S.L. 217.6)",
      description: `You need a minimum annual gross salary of €${formatNumber(minimumRequired)} to sponsor ${familyMemberCount} family member${familyMemberCount > 1 ? "s" : ""} under the Family Reunification scheme.`,
      source: "https://legislation.mt/eli/sl/217.6/eng/pdf",
    };
  } else {
    // Family Member Policy
    // Base: €18,940 Net + 20% of median wage for each family member
    const baseWage = customBaseWage ?? WAGE_DATA.medianWageNet;
    const percentagePerMember = 20;
    const perMemberAddition =
      WAGE_DATA.medianWageNet * (percentagePerMember / 100);
    const totalAddition = perMemberAddition * familyMemberCount;
    const minimumRequired = baseWage + totalAddition;

    return {
      minimumRequired,
      incomeType: "net",
      baseWage,
      additionalAmount: totalAddition,
      percentagePerMember,
      breakdown: {
        base: baseWage,
        perMemberAddition,
        totalAddition,
      },
      schemeName: "Family Member Policy",
      description: `You need a minimum annual net salary of €${formatNumber(minimumRequired)} to sponsor ${familyMemberCount} family member${familyMemberCount > 1 ? "s" : ""} under the Family Member Policy.`,
      source:
        "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-members-policy/",
    };
  }
}

/**
 * Compare both schemes for a given number of family members
 */
export function compareBothSchemes(familyMemberCount: number): {
  familyReunification: FamilyReunificationOutput;
  familyMemberPolicy: FamilyReunificationOutput;
} {
  return {
    familyReunification: calculateFamilyReunification({
      familyMemberCount,
      scheme: "family-reunification",
    }),
    familyMemberPolicy: calculateFamilyReunification({
      familyMemberCount,
      scheme: "family-member-policy",
    }),
  };
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-MT", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format currency with Euro symbol
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Get scheme info for display
 */
export function getSchemeInfo(scheme: SchemeType): {
  name: string;
  shortDescription: string;
  incomeType: "gross" | "net";
  sourceUrl: string;
} {
  if (scheme === "family-reunification") {
    return {
      name: "Family Reunification (S.L. 217.6)",
      shortDescription: "Average wage (gross) + 20% per family member",
      incomeType: "gross",
      sourceUrl: "https://legislation.mt/eli/sl/217.6/eng/pdf",
    };
  }
  return {
    name: "Family Member Policy",
    shortDescription: "€18,940 net + 20% of median wage per family member",
    incomeType: "net",
    sourceUrl:
      "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-members-policy/",
  };
}

/**
 * Get monthly breakdown of required salary
 */
export function getMonthlyBreakdown(annualSalary: number): {
  annual: number;
  monthly: number;
  weekly: number;
} {
  return {
    annual: annualSalary,
    monthly: Math.ceil(annualSalary / 12),
    weekly: Math.ceil(annualSalary / 52),
  };
}

/**
 * Minimum gross income required for KEI/Specialist holders to apply for the
 * Family Member Policy without serving the 12-month sponsor tenure period.
 * Identità: €50,000 for sponsor + 1 dependent, €6,000 per additional dependent.
 */
export function calculateKeiThreshold(familyMemberCount: number): number {
  if (familyMemberCount <= 1) {
    return KEI_THRESHOLDS.baseSponsorPlusOneDependent;
  }
  return (
    KEI_THRESHOLDS.baseSponsorPlusOneDependent +
    KEI_THRESHOLDS.perAdditionalDependent * (familyMemberCount - 1)
  );
}
