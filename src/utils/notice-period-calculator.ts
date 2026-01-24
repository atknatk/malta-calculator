/**
 * Malta Notice Period Calculator
 * Based on Employment and Industrial Relations Act - Article 36(5)
 */

export interface NoticePeriodInput {
    /** Total months of continuous service */
    monthsOfService: number;
    /** Whether employee is in probation period */
    isInProbation?: boolean;
}

export interface NoticePeriodOutput {
    /** Notice period in weeks */
    weeks: number;
    /** Notice period in calendar days (approximate) */
    days: number;
    /** Description of the service bracket */
    serviceBracket: string;
    /** Whether during probation */
    isInProbation: boolean;
}

/**
 * Notice period brackets as per Malta Employment and Industrial Relations Act
 * Article 36(5) - Indefinite contracts
 */
const NOTICE_PERIOD_BRACKETS = [
    { minMonths: 0, maxMonths: 1, weeks: 0, description: "Less than 1 month (Probation)" },
    { minMonths: 1, maxMonths: 6, weeks: 1, description: "1 to 6 months" },
    { minMonths: 6, maxMonths: 24, weeks: 2, description: "6 months to 2 years" },
    { minMonths: 24, maxMonths: 48, weeks: 4, description: "2 to 4 years" },
    { minMonths: 48, maxMonths: 84, weeks: 8, description: "4 to 7 years" },
    { minMonths: 84, maxMonths: 96, weeks: 9, description: "7 to 8 years" },
    { minMonths: 96, maxMonths: 108, weeks: 10, description: "8 to 9 years" },
    { minMonths: 108, maxMonths: 120, weeks: 11, description: "9 to 10 years" },
    { minMonths: 120, maxMonths: Infinity, weeks: 12, description: "More than 10 years" },
] as const;

/**
 * Calculate notice period based on months of service
 */
export function calculateNoticePeriod(input: NoticePeriodInput): NoticePeriodOutput {
    const { monthsOfService, isInProbation = false } = input;

    // During probation with less than 1 month: no notice required
    if (isInProbation && monthsOfService < 1) {
        return {
            weeks: 0,
            days: 0,
            serviceBracket: "Less than 1 month (Probation)",
            isInProbation: true,
        };
    }

    // During probation with more than 1 month: 1 week notice
    if (isInProbation && monthsOfService >= 1) {
        return {
            weeks: 1,
            days: 7,
            serviceBracket: "Probation period (more than 1 month)",
            isInProbation: true,
        };
    }

    // Find the appropriate bracket
    const bracket = NOTICE_PERIOD_BRACKETS.find(
        (b) => monthsOfService >= b.minMonths && monthsOfService < b.maxMonths
    );

    if (!bracket) {
        // Default to maximum (10+ years)
        return {
            weeks: 12,
            days: 84,
            serviceBracket: "More than 10 years",
            isInProbation: false,
        };
    }

    return {
        weeks: bracket.weeks,
        days: bracket.weeks * 7,
        serviceBracket: bracket.description,
        isInProbation: false,
    };
}

/**
 * Convert years and months to total months
 */
export function toMonths(years: number, months: number): number {
    return years * 12 + months;
}

/**
 * Format notice period for display
 */
export function formatNoticePeriod(weeks: number): string {
    if (weeks === 0) return "No notice required";
    if (weeks === 1) return "1 week";
    return `${weeks} weeks`;
}
