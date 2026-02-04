/**
 * Malta Personal Loan Calculator
 * Standard loan amortization calculation
 * PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
 */

export interface LoanInput {
  /** Loan amount in EUR */
  loanAmount: number;
  /** Annual interest rate as percentage (e.g., 7.5 for 7.5%) */
  interestRate: number;
  /** Loan term in months */
  loanTermMonths: number;
}

export interface LoanOutput {
  /** Monthly payment */
  monthlyPayment: number;
  /** Total amount to repay */
  totalRepayment: number;
  /** Total interest paid */
  totalInterest: number;
  /** Effective annual rate */
  effectiveAnnualRate: number;
  /** Number of payments */
  numberOfPayments: number;
  /** Monthly amortization schedule */
  monthlySchedule: MonthlyPayment[];
}

export interface MonthlyPayment {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

/** Personal loan constraints */
export const LOAN_CONSTRAINTS = {
  MIN_AMOUNT: 1000,
  MAX_AMOUNT: 100000,
  MIN_TERM_MONTHS: 6,
  MAX_TERM_MONTHS: 84, // 7 years
  DEFAULT_INTEREST_RATE: 7.5,
} as const;

/**
 * Calculate personal loan payments using standard amortization formula
 */
export function calculateLoan(input: LoanInput): LoanOutput {
  const { loanAmount, interestRate, loanTermMonths } = input;

  // Calculate monthly interest rate
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTermMonths;

  // Calculate monthly payment using amortization formula
  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numberOfPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, numberOfPayments);
    monthlyPayment = (loanAmount * (monthlyRate * factor)) / (factor - 1);
  }

  // Calculate totals
  const totalRepayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalRepayment - loanAmount;

  // Effective annual rate
  const effectiveAnnualRate = interestRate;

  // Generate monthly amortization schedule
  const monthlySchedule = generateMonthlySchedule(
    loanAmount,
    monthlyRate,
    monthlyPayment,
    numberOfPayments,
  );

  return {
    monthlyPayment,
    totalRepayment,
    totalInterest,
    effectiveAnnualRate,
    numberOfPayments,
    monthlySchedule,
  };
}

/**
 * Generate monthly amortization schedule
 */
function generateMonthlySchedule(
  principal: number,
  monthlyRate: number,
  monthlyPayment: number,
  numberOfPayments: number,
): MonthlyPayment[] {
  const schedule: MonthlyPayment[] = [];
  let remainingBalance = principal;

  for (let month = 1; month <= numberOfPayments; month++) {
    const interest = remainingBalance * monthlyRate;
    const principalPayment = Math.min(
      monthlyPayment - interest,
      remainingBalance,
    );
    remainingBalance -= principalPayment;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest,
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
 * Get loan info constants
 */
export function getLoanInfo() {
  return {
    minAmount: LOAN_CONSTRAINTS.MIN_AMOUNT,
    maxAmount: LOAN_CONSTRAINTS.MAX_AMOUNT,
    minTermMonths: LOAN_CONSTRAINTS.MIN_TERM_MONTHS,
    maxTermMonths: LOAN_CONSTRAINTS.MAX_TERM_MONTHS,
    defaultInterestRate: LOAN_CONSTRAINTS.DEFAULT_INTEREST_RATE,
  };
}

/**
 * Convert months to human-readable format
 */
export function formatLoanTerm(months: number): string {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) return `${months} months`;
  if (remainingMonths === 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${years} year${years > 1 ? "s" : ""} ${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
}
