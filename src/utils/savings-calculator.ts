/**
 * Malta Savings Interest Calculator
 * Compound interest calculation with Malta withholding tax:
 * - Formula: A = P(1 + r/n)^(nt)
 * - 15% final withholding tax on interest income
 */

export interface SavingsInput {
    /** Initial deposit amount in EUR */
    initialDeposit: number;
    /** Monthly contribution in EUR (optional) */
    monthlyContribution: number;
    /** Annual interest rate as percentage */
    interestRate: number;
    /** Investment period in years */
    years: number;
    /** Compounding frequency: "monthly" | "yearly" */
    compoundingFrequency: "monthly" | "yearly";
}

export interface SavingsOutput {
    /** Final balance before tax */
    finalBalanceGross: number;
    /** Total contributions (initial + monthly) */
    totalContributions: number;
    /** Total interest earned (gross) */
    totalInterestGross: number;
    /** Withholding tax amount (15%) */
    withholdingTax: number;
    /** Total interest after tax */
    totalInterestNet: number;
    /** Final balance after tax */
    finalBalanceNet: number;
    /** Effective annual yield after tax */
    effectiveYieldNet: number;
    /** Yearly breakdown */
    yearlyBreakdown: YearlySavings[];
}

export interface YearlySavings {
    year: number;
    balanceStart: number;
    contributions: number;
    interestGross: number;
    withholdingTax: number;
    interestNet: number;
    balanceEnd: number;
}

/** Malta savings tax constants */
export const SAVINGS_CONSTANTS = {
    WITHHOLDING_TAX_RATE: 0.15, // 15% final withholding tax on interest
    DEFAULT_INTEREST_RATE: 3.0,
    MIN_YEARS: 1,
    MAX_YEARS: 50,
} as const;

/**
 * Calculate compound interest with Malta withholding tax
 * Formula: A = P(1 + r/n)^(nt)
 * 
 * With regular contributions:
 * A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
 */
export function calculateSavings(input: SavingsInput): SavingsOutput {
    const { initialDeposit, monthlyContribution, interestRate, years, compoundingFrequency } = input;

    const n = compoundingFrequency === "monthly" ? 12 : 1;
    const r = interestRate / 100;
    const periodicRate = r / n;

    const yearlyBreakdown: YearlySavings[] = [];
    let balance = initialDeposit;
    let totalContributions = initialDeposit;
    let totalInterestGross = 0;
    let totalWithholdingTax = 0;

    for (let year = 1; year <= years; year++) {
        const balanceStart = balance;
        let yearInterestGross = 0;
        const yearContributions = monthlyContribution * 12;
        totalContributions += yearContributions;

        // Calculate interest for each period in the year
        const periodsPerYear = n;
        const monthlyAddition = compoundingFrequency === "monthly" ? monthlyContribution : 0;
        const yearlyAddition = compoundingFrequency === "yearly" ? yearContributions : 0;

        for (let period = 1; period <= periodsPerYear; period++) {
            // Add monthly contribution at start of period (if monthly compounding)
            if (compoundingFrequency === "monthly") {
                balance += monthlyAddition;
            }

            // Calculate interest for this period
            const periodInterest = balance * periodicRate;
            yearInterestGross += periodInterest;
            balance += periodInterest;
        }

        // Add yearly contribution at end of year (if yearly compounding)
        if (compoundingFrequency === "yearly") {
            balance += yearlyAddition;
        }

        // Calculate withholding tax on year's interest
        const yearWithholdingTax = yearInterestGross * SAVINGS_CONSTANTS.WITHHOLDING_TAX_RATE;
        const yearInterestNet = yearInterestGross - yearWithholdingTax;

        totalInterestGross += yearInterestGross;
        totalWithholdingTax += yearWithholdingTax;

        yearlyBreakdown.push({
            year,
            balanceStart,
            contributions: yearContributions,
            interestGross: yearInterestGross,
            withholdingTax: yearWithholdingTax,
            interestNet: yearInterestNet,
            balanceEnd: balance,
        });
    }

    const finalBalanceGross = balance;
    const totalInterestNet = totalInterestGross - totalWithholdingTax;
    const finalBalanceNet = totalContributions + totalInterestNet;

    // Calculate effective annual yield after tax
    const effectiveYieldNet = totalContributions > 0
        ? ((finalBalanceNet / totalContributions) - 1) / years * 100
        : 0;

    return {
        finalBalanceGross,
        totalContributions,
        totalInterestGross,
        withholdingTax: totalWithholdingTax,
        totalInterestNet,
        finalBalanceNet,
        effectiveYieldNet,
        yearlyBreakdown,
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
 * Format currency with decimals
 */
export function formatCurrencyDecimal(amount: number): string {
    return new Intl.NumberFormat("en-MT", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Get savings info constants
 */
export function getSavingsInfo() {
    return {
        withholdingTaxRate: SAVINGS_CONSTANTS.WITHHOLDING_TAX_RATE * 100,
        defaultInterestRate: SAVINGS_CONSTANTS.DEFAULT_INTEREST_RATE,
        minYears: SAVINGS_CONSTANTS.MIN_YEARS,
        maxYears: SAVINGS_CONSTANTS.MAX_YEARS,
    };
}
