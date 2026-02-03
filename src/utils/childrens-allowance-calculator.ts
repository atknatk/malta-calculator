/**
 * Malta Children's Allowance Calculator
 *
 * Based on official Malta Social Security Department rules:
 * - https://socialsecurity.gov.mt/en/information-and-applications-for-benefits-and-services/family-benefits/childrens-allowance-annual-income-less-than-threshold/
 * - https://socialsecurity.gov.mt/en/information-and-applications-for-benefits-and-services/family-benefits/childrens-allowance-annual-income-exceeds-threshold/
 *
 * Last updated: 2026
 */

// Constants from official Malta Social Security
export const CA_CONSTANTS = {
    // Income thresholds
    MAX_INCOME_THRESHOLD: 30000,      // €30,000 - Maximum income for variable rate
    MIN_INCOME_THRESHOLD: 8170,       // €8,170 - Below this, maximum rate applies
    MID_INCOME_THRESHOLD: 23068,      // €23,068 - Between this and max, minimum rate applies

    // Weekly rates per child
    MAX_WEEKLY_RATE: 27.29,           // €27.29 - Maximum weekly rate per child
    MIN_WEEKLY_RATE: 8.66,            // €8.66 - Minimum guaranteed weekly rate per child

    // Calculation parameters
    PERCENTAGE: 6.5,                  // 6.50% applied to income difference
    WEEKS_PER_YEAR: 52,

    // Child Birth/Adoption Bonus
    BIRTH_BONUS_FIRST_CHILD: 1000,    // €1,000 for 1st child
    BIRTH_BONUS_SECOND_CHILD: 1500,   // €1,500 for 2nd child
    BIRTH_BONUS_THIRD_PLUS: 2000,     // €2,000 for 3rd child and beyond

    // Payment frequency
    PAYMENT_WEEKS: 13,                // Paid every 13 weeks (quarterly)
} as const;

/**
 * Input for Children's Allowance calculation
 */
export interface ChildrensAllowanceInput {
    // Income sources
    grossIncome: number;              // Annual Gross Income from Employment / Social Security Benefits
    sscPaid: number;                  // Amount of Social Security Contributions Paid
    rentIncome: number;               // Property Rental Income and/or Ground Rents Income
    interestIncome: number;           // Interests earned from Bank Deposits
    pensionIncome: number;            // Income Treasury/Service/Foreign Pensions
    maintenanceIncome: number;        // Spouse or Partner's Maintenance
    otherIncome: number;              // Any other income
    taxPaid: number;                  // Tax Paid (deducted from 2025 onwards)

    // Family details
    numberOfChildren: number;         // Number of children under 16
}

/**
 * Result of Children's Allowance calculation
 */
export interface ChildrensAllowanceResult {
    // Calculated income
    totalIncome: number;
    netIncome: number;

    // Weekly rates
    weeklyPerChild: number;
    weeklyForAll: number;

    // Yearly rates
    yearlyPerChild: number;
    yearlyForAll: number;

    // Quarterly payment (every 13 weeks)
    quarterlyPayment: number;

    // Status
    isAboveThreshold: boolean;
    rateType: 'maximum' | 'variable' | 'minimum' | 'fixed';

    // Reference values
    maxWeeklyRate: number;
    minWeeklyRate: number;
    incomeThreshold: number;
}

/**
 * Child Birth/Adoption Bonus calculation
 */
export interface BirthBonusResult {
    childOrder: number;
    bonusAmount: number;
}

/**
 * Calculate Children's Allowance based on household income
 *
 * Formula (from official source):
 * "The calculation of the rate is based upon the difference between the maximum
 * acceptable income under this scheme (€30,000) and your actual income, as long
 * as the actual income does not exceed the maximum. A 6.50 percent is then applied
 * to the result and the amount is divided by 52 to determine the weekly rate,
 * which rate cannot be lower than the minimum of €8.66 and cannot exceed the
 * maximum of €27.29."
 */
export function calculateChildrensAllowance(input: ChildrensAllowanceInput): ChildrensAllowanceResult {
    const {
        grossIncome,
        sscPaid,
        rentIncome,
        interestIncome,
        pensionIncome,
        maintenanceIncome,
        otherIncome,
        taxPaid,
        numberOfChildren,
    } = input;

    // Calculate total income from all sources
    const totalIncome = grossIncome + rentIncome + interestIncome + pensionIncome + maintenanceIncome + otherIncome;

    // Calculate net income (SSC and Tax are deducted from 2025 onwards)
    const netIncome = Math.max(0, totalIncome - sscPaid - taxPaid);

    let weeklyPerChild: number;
    let rateType: ChildrensAllowanceResult['rateType'];

    if (netIncome <= CA_CONSTANTS.MIN_INCOME_THRESHOLD) {
        // Very low income - Maximum rate applies
        weeklyPerChild = CA_CONSTANTS.MAX_WEEKLY_RATE;
        rateType = 'maximum';
    } else if (netIncome <= CA_CONSTANTS.MAX_INCOME_THRESHOLD) {
        // Variable rate calculation
        // Weekly Rate = (30,000 - Net Income) × 6.5% / 52
        const incomeDifference = CA_CONSTANTS.MAX_INCOME_THRESHOLD - netIncome;
        const yearlyAmount = incomeDifference * (CA_CONSTANTS.PERCENTAGE / 100);
        weeklyPerChild = yearlyAmount / CA_CONSTANTS.WEEKS_PER_YEAR;

        // Clamp between min and max rates
        weeklyPerChild = Math.max(CA_CONSTANTS.MIN_WEEKLY_RATE, Math.min(CA_CONSTANTS.MAX_WEEKLY_RATE, weeklyPerChild));

        // Determine if it's variable or minimum rate
        if (netIncome > CA_CONSTANTS.MID_INCOME_THRESHOLD) {
            rateType = 'minimum';
        } else {
            rateType = 'variable';
        }
    } else {
        // Income exceeds threshold - Fixed minimum rate
        weeklyPerChild = CA_CONSTANTS.MIN_WEEKLY_RATE;
        rateType = 'fixed';
    }

    // Round to 2 decimal places
    weeklyPerChild = Math.round(weeklyPerChild * 100) / 100;

    // Calculate totals
    const weeklyForAll = weeklyPerChild * numberOfChildren;
    const yearlyPerChild = weeklyPerChild * CA_CONSTANTS.WEEKS_PER_YEAR;
    const yearlyForAll = yearlyPerChild * numberOfChildren;
    const quarterlyPayment = weeklyForAll * CA_CONSTANTS.PAYMENT_WEEKS;

    return {
        totalIncome: Math.round(totalIncome * 100) / 100,
        netIncome: Math.round(netIncome * 100) / 100,
        weeklyPerChild,
        weeklyForAll: Math.round(weeklyForAll * 100) / 100,
        yearlyPerChild: Math.round(yearlyPerChild * 100) / 100,
        yearlyForAll: Math.round(yearlyForAll * 100) / 100,
        quarterlyPayment: Math.round(quarterlyPayment * 100) / 100,
        isAboveThreshold: netIncome > CA_CONSTANTS.MAX_INCOME_THRESHOLD,
        rateType,
        maxWeeklyRate: CA_CONSTANTS.MAX_WEEKLY_RATE,
        minWeeklyRate: CA_CONSTANTS.MIN_WEEKLY_RATE,
        incomeThreshold: CA_CONSTANTS.MAX_INCOME_THRESHOLD,
    };
}

/**
 * Calculate Child Birth or Adoption Bonus
 */
export function calculateBirthBonus(childOrder: number): BirthBonusResult {
    let bonusAmount: number;

    if (childOrder <= 0) {
        bonusAmount = 0;
    } else if (childOrder === 1) {
        bonusAmount = CA_CONSTANTS.BIRTH_BONUS_FIRST_CHILD;
    } else if (childOrder === 2) {
        bonusAmount = CA_CONSTANTS.BIRTH_BONUS_SECOND_CHILD;
    } else {
        bonusAmount = CA_CONSTANTS.BIRTH_BONUS_THIRD_PLUS;
    }

    return {
        childOrder,
        bonusAmount,
    };
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-MT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat("en-MT", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Get rate type description
 */
export function getRateTypeDescription(rateType: ChildrensAllowanceResult['rateType']): string {
    switch (rateType) {
        case 'maximum':
            return 'Maximum rate (income below €8,170)';
        case 'variable':
            return 'Variable rate based on income';
        case 'minimum':
            return 'Minimum guaranteed rate';
        case 'fixed':
            return 'Fixed rate (income exceeds €30,000)';
        default:
            return 'Unknown';
    }
}
