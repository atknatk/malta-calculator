/**
 * Malta Family Reunification Calculator
 *
 * Two schemes for family member applications:
 * 1. Family Reunification (S.L. 217.06): Average Wage (Gross) + 20% per family member
 * 2. Family Member Policy: Median wage (net income test) + 20% of median wage per family member
 *
 * Source: Identità Malta
 * - https://legislation.mt/eli/sl/217.6/eng/pdf
 * - https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-members-policy/
 * - https://identita.gov.mt/wp-content/uploads/2025/09/FAQs-Residence-Permits-Malta-002.pdf
 */

import { calculateMonthlyDeductions } from "@/utils/salary-calculator";
import type { SimpleTaxType, ChildCount } from "@/config/malta-tax-config";
import { Month, type MonthlySalaryInput } from "@/types/salary-calculator-type";

// Malta wage figures used by the two family-sponsorship schemes.
// - averageWageGross: S.L. 217.06 Reg. 2 defines "average wage" as the average
//   annual gross wage published by NSO in the Labour Force Survey. NSO LFS mean
//   annual basic salary 2025 = €25,730 (dataset updated 11 Dec 2025).
// - medianWageNet: median wage still quoted by Identità's Family Member Policy
//   (NSO release of 12 June 2024, policy v5.3 updated 4 April 2025). The sponsor's
//   *net* income (gross minus income tax and SSC) is compared against it.
// - nsoLatestMedian: NSO LFS median annual basic salary 2025 = €22,266 (dataset
//   updated 25 Sep 2025). Identità says the policy figure "may be reviewed" when
//   NSO publishes a new median, so we show it as a projection.
// Sources:
// - https://nso.gov.mt/labour_market/
// - https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-members-policy/
export const WAGE_DATA = {
  year: 2025,
  averageWageGross: 25_730,
  averageWageGrossReference: "NSO LFS 2025",
  medianWageNet: 18_940,
  medianWageNetReference: "June 2024",
  nsoLatestMedian: 22_266,
  nsoLatestMedianYear: 2025,
  lastReviewed: "October 2026",
};

// Key Employee Initiative / Specialist Employee Initiative threshold under the
// Family Member Policy. Allows sponsors with an Approval in Principle to skip
// the 12-month tenure rule (Identità, April 2025; SIGMA FAQ September 2025).
export const KEI_THRESHOLDS = {
  baseSponsorPlusOneDependent: 50_000,
  perAdditionalDependent: 6_000,
};

// Minimum gross salary for the permit itself (Identità, effective August 2025).
// Note: SEI holders on €30,000 do not meet the €50,000 family fast-track.
export const PERMIT_SALARY_FLOORS = {
  kei: 45_000,
  sei: 30_000,
};

// Minimum lawful residence before the sponsor may apply (in months).
// S.L. 217.06 Reg. 13 allows up to two years; Identità applies the full two years.
export const WAITING_PERIODS = {
  familyReunification: 24,
  familyMemberPolicy: 12,
};

export type SchemeType = "family-reunification" | "family-member-policy";

// Which median the Family Member Policy calculation is based on
export type MedianBasis = "identita" | "nso-latest";

export type SponsorPermitType = "single-permit" | "kei" | "sei" | "blue-card";

export interface FamilyReunificationInput {
  /** Number of family members to sponsor (spouse, children, dependents) */
  familyMemberCount: number;
  /** Which scheme to calculate */
  scheme: SchemeType;
  /** Family Member Policy only: Identità's published median or NSO's latest */
  medianBasis?: MedianBasis;
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
  const {
    familyMemberCount,
    scheme,
    medianBasis = "identita",
    customBaseWage,
  } = input;

  if (scheme === "family-reunification") {
    // Family Reunification (S.L. 217.06)
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
      schemeName: "Family Reunification (S.L. 217.06)",
      description: `You need a minimum annual gross basic salary of €${formatNumber(minimumRequired)} to sponsor ${familyMemberCount} family member${familyMemberCount > 1 ? "s" : ""} under the Family Reunification scheme.`,
      source: "https://legislation.mt/eli/sl/217.6/eng/pdf",
    };
  } else {
    // Family Member Policy
    // Base: median wage + 20% of the median wage for each family member
    const medianWage =
      medianBasis === "nso-latest"
        ? WAGE_DATA.nsoLatestMedian
        : WAGE_DATA.medianWageNet;
    const baseWage = customBaseWage ?? medianWage;
    const percentagePerMember = 20;
    const perMemberAddition = baseWage * (percentagePerMember / 100);
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
      description: `You need a minimum annual net income of €${formatNumber(minimumRequired)} to sponsor ${familyMemberCount} family member${familyMemberCount > 1 ? "s" : ""} under the Family Member Policy${medianBasis === "nso-latest" ? ` if Identità adopts the NSO ${WAGE_DATA.nsoLatestMedianYear} median` : ""}.`,
      source:
        "https://identita.gov.mt/expatriates-unit-main-page/noneu-nationals/non-employment-permits/family-members-policy/",
    };
  }
}

/**
 * Compare both schemes for a given number of family members
 */
export function compareBothSchemes(
  familyMemberCount: number,
  medianBasis: MedianBasis = "identita",
): {
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
      medianBasis,
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
      name: "Family Reunification (S.L. 217.06)",
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

/**
 * Estimate annual net income (gross minus income tax and SSC) for a gross
 * annual basic salary, using the 2026 payroll engine. COLA/statutory bonuses
 * are excluded so the estimate stays conservative.
 */
export function estimateAnnualNet(
  annualGross: number,
  simpleTaxType: SimpleTaxType = "single",
  childCount: ChildCount = 0,
): number {
  if (annualGross <= 0) return 0;
  const monthlyGross = annualGross / 12;
  const input: MonthlySalaryInput[] = Object.values(Month).map((month) => ({
    month,
    grossWage: monthlyGross,
  }));
  const output = calculateMonthlyDeductions(input, {
    year: 2026,
    taxRateType: "single",
    simpleTaxType,
    childCount,
    sscCategory: "C",
    birthDate: new Date(1990, 0, 1),
    yearlyNonTaxBenefit: 0,
    yearlyTaxableBenefit: 0,
    enableCOLA: false,
  });
  return output.reduce((sum, m) => sum + m.net, 0);
}

export type RouteKey =
  | "family-reunification"
  | "family-member-policy"
  | "kei-sei-fast-track"
  | "blue-card";

export interface EligibilityInput {
  permitType: SponsorPermitType;
  /** Months of lawful residence in Malta so far */
  monthsResident: number;
  familyMemberCount: number;
  /** Gross annual basic salary; omit to skip the income test */
  grossAnnualSalary?: number;
  simpleTaxType?: SimpleTaxType;
  childCount?: ChildCount;
}

export interface RouteEligibility {
  route: RouteKey;
  label: string;
  /** Months of residence required before applying */
  requiredMonths: number;
  /** Months still to wait (0 = can apply now) */
  monthsRemaining: number;
  /** Required income for this route */
  requiredIncome: number;
  incomeType: "gross" | "net";
  /** Income compared against the requirement (net is an estimate) */
  comparedIncome?: number;
  /** undefined when no salary was entered */
  meetsIncome?: boolean;
  note: string;
}

/**
 * Which routes are open to the sponsor, how long they still have to wait and
 * whether their salary meets each route's income test.
 */
export function getEligibility(input: EligibilityInput): RouteEligibility[] {
  const {
    permitType,
    monthsResident,
    familyMemberCount,
    grossAnnualSalary,
    simpleTaxType = "single",
    childCount = 0,
  } = input;
  const hasSalary = grossAnnualSalary !== undefined && grossAnnualSalary > 0;
  const estimatedNet = hasSalary
    ? estimateAnnualNet(grossAnnualSalary, simpleTaxType, childCount)
    : undefined;
  const remaining = (required: number): number =>
    Math.max(0, required - Math.max(0, monthsResident));

  const routes: RouteEligibility[] = [];

  // EU Blue Card: family may apply once the sponsor holds an Approval in
  // Principle (S.L. 217.27, Identità SIGMA FAQ 2025/26)
  if (permitType === "blue-card") {
    routes.push({
      route: "blue-card",
      label: "EU Blue Card family route",
      requiredMonths: 0,
      monthsRemaining: 0,
      requiredIncome: 0,
      incomeType: "gross",
      note: "No waiting period once you hold an Approval in Principle. Spouse, minor and dependent adult children are covered and may work immediately.",
    });
  }

  // KEI / SEI fast-track under the Family Member Policy
  if (permitType === "kei" || permitType === "sei") {
    const requiredIncome = calculateKeiThreshold(familyMemberCount);
    routes.push({
      route: "kei-sei-fast-track",
      label: "KEI / SEI fast-track",
      requiredMonths: 0,
      monthsRemaining: 0,
      requiredIncome,
      incomeType: "gross",
      comparedIncome: hasSalary ? grossAnnualSalary : undefined,
      meetsIncome: hasSalary ? grossAnnualSalary >= requiredIncome : undefined,
      note:
        permitType === "sei"
          ? `No 12-month wait with an Approval in Principle. The SEI permit itself only needs €${formatNumber(PERMIT_SALARY_FLOORS.sei)}, but the family fast-track needs €${formatNumber(requiredIncome)} gross, €100,000 health cover per dependant and a private school application for school-age children.`
          : "No 12-month wait with an Approval in Principle. Requires €100,000 health cover per dependant and a private school application for school-age children.",
    });
  }

  const fmp = calculateFamilyReunification({
    familyMemberCount,
    scheme: "family-member-policy",
  });
  routes.push({
    route: "family-member-policy",
    label: "Family Member Policy",
    requiredMonths: WAITING_PERIODS.familyMemberPolicy,
    monthsRemaining: remaining(WAITING_PERIODS.familyMemberPolicy),
    requiredIncome: fmp.minimumRequired,
    incomeType: "net",
    comparedIncome: estimatedNet,
    meetsIncome:
      estimatedNet !== undefined
        ? estimatedNet >= fmp.minimumRequired
        : undefined,
    note: "12 months from the date your first residence permit was issued. Income is tested net of tax and SSC.",
  });

  const fr = calculateFamilyReunification({
    familyMemberCount,
    scheme: "family-reunification",
  });
  routes.push({
    route: "family-reunification",
    label: "Family Reunification (S.L. 217.06)",
    requiredMonths: WAITING_PERIODS.familyReunification,
    monthsRemaining: remaining(WAITING_PERIODS.familyReunification),
    requiredIncome: fr.minimumRequired,
    incomeType: "gross",
    comparedIncome: hasSalary ? grossAnnualSalary : undefined,
    meetsIncome: hasSalary
      ? grossAnnualSalary >= fr.minimumRequired
      : undefined,
    note: "Identità requires 2 years of lawful residence and a permit valid for at least 1 year. Only basic gross salary counts — no overtime or bonuses.",
  });

  return routes;
}
