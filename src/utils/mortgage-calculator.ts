/**
 * Malta Mortgage Calculator
 * Standard mortgage calculation with Malta requirements:
 * - 10% minimum deposit (LTV max 90%)
 * - Variable/Fixed rate options
 * - Standard amortization formula
 */

export interface MortgageInput {
  /** Property purchase price in EUR */
  propertyPrice: number;
  /** Deposit percentage (minimum 10%) */
  depositPercent: number;
  /** Annual interest rate as percentage (e.g., 4.5 for 4.5%) */
  interestRate: number;
  /** Loan term in years (5-40) */
  loanTermYears: number;
}

export interface MortgageOutput {
  /** Loan amount (principal) */
  loanAmount: number;
  /** Required deposit amount */
  depositAmount: number;
  /** Monthly payment */
  monthlyPayment: number;
  /** Total interest paid over loan term */
  totalInterest: number;
  /** Total cost (principal + interest) */
  totalCost: number;
  /** Loan-to-Value ratio as percentage */
  ltvRatio: number;
  /** Effective annual rate */
  effectiveAnnualRate: number;
  /** Total number of payments */
  numberOfPayments: number;
  /** Yearly amortization schedule */
  yearlySchedule: YearlyPayment[];
}

export interface YearlyPayment {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  remainingBalance: number;
}

/** Malta mortgage constraints */
export const MORTGAGE_CONSTRAINTS = {
  MIN_DEPOSIT_PERCENT: 10,
  MAX_LTV: 90,
  MIN_TERM_YEARS: 5,
  MAX_TERM_YEARS: 40,
  DEFAULT_INTEREST_RATE: 4.5,
} as const;

/**
 * Calculate mortgage payments using standard amortization formula
 * PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
 *
 * Where:
 * P = Principal (loan amount)
 * r = Monthly interest rate (annual rate / 12)
 * n = Total number of payments (years × 12)
 */
export function calculateMortgage(input: MortgageInput): MortgageOutput {
  const { propertyPrice, depositPercent, interestRate, loanTermYears } = input;

  // Enforce minimum deposit
  const effectiveDepositPercent = Math.max(
    depositPercent,
    MORTGAGE_CONSTRAINTS.MIN_DEPOSIT_PERCENT,
  );

  // Calculate loan amount
  const depositAmount = (propertyPrice * effectiveDepositPercent) / 100;
  const loanAmount = propertyPrice - depositAmount;
  const ltvRatio = 100 - effectiveDepositPercent;

  // Calculate monthly interest rate and number of payments
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermYears * 12;

  // Calculate monthly payment using amortization formula
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    // No interest case
    monthlyPayment = loanAmount / numberOfPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, numberOfPayments);
    monthlyPayment = (loanAmount * (monthlyRate * factor)) / (factor - 1);
  }

  // Calculate totals
  const totalCost = monthlyPayment * numberOfPayments;
  const totalInterest = totalCost - loanAmount;

  // Effective annual rate (for display purposes, same as input for standard loans)
  const effectiveAnnualRate = interestRate;

  // Generate yearly amortization schedule
  const yearlySchedule = generateYearlySchedule(
    loanAmount,
    monthlyRate,
    monthlyPayment,
    loanTermYears,
  );

  return {
    loanAmount,
    depositAmount,
    monthlyPayment,
    totalInterest,
    totalCost,
    ltvRatio,
    effectiveAnnualRate,
    numberOfPayments,
    yearlySchedule,
  };
}

/**
 * Generate yearly amortization schedule
 */
function generateYearlySchedule(
  principal: number,
  monthlyRate: number,
  monthlyPayment: number,
  years: number,
): YearlyPayment[] {
  const schedule: YearlyPayment[] = [];
  let remainingBalance = principal;

  for (let year = 1; year <= years; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let month = 1; month <= 12; month++) {
      if (remainingBalance <= 0) break;

      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = Math.min(
        monthlyPayment - interestPayment,
        remainingBalance,
      );

      yearlyInterest += interestPayment;
      yearlyPrincipal += principalPayment;
      remainingBalance -= principalPayment;
    }

    schedule.push({
      year,
      principalPaid: yearlyPrincipal,
      interestPaid: yearlyInterest,
      totalPaid: yearlyPrincipal + yearlyInterest,
      remainingBalance: Math.max(0, remainingBalance),
    });

    if (remainingBalance <= 0) break;
  }

  return schedule;
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
 * Get mortgage info constants
 */
export function getMortgageInfo() {
  return {
    minDepositPercent: MORTGAGE_CONSTRAINTS.MIN_DEPOSIT_PERCENT,
    maxLtv: MORTGAGE_CONSTRAINTS.MAX_LTV,
    minTermYears: MORTGAGE_CONSTRAINTS.MIN_TERM_YEARS,
    maxTermYears: MORTGAGE_CONSTRAINTS.MAX_TERM_YEARS,
    defaultInterestRate: MORTGAGE_CONSTRAINTS.DEFAULT_INTEREST_RATE,
  };
}
