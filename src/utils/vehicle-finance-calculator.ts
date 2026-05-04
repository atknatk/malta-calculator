/**
 * Malta Vehicle Finance / Hire Purchase Calculator
 *
 * Modeli: Toplam tutar - Depozit (peşinat) - Finanse edilen tutar
 * Aylık taksit standart amortizasyon (PMT) formülü ile hesaplanır:
 *   PMT = P × [r(1+r)^n] / [(1+r)^n - 1]
 *
 * Malta tipik değerleri (2026):
 *   - Bayi/finans şirketi: 25% depozit, 60 ay, 8% yıllık faiz (örnek)
 *   - HSBC Malta Car Loan: 6.50% IR / 6.70% APRC, 0% deposit, max 7 yıl
 *   - BOV Motor Loan: 4.75% (variable), 0% deposit, max 15 yıl
 *   - APS, BNF, Banif: 5-9% civarı
 *   - Finance House: 5.5% base rate, deposit %0-25 (araç değerine göre)
 */

export interface VehicleFinanceInput {
  /** Aracın/varlığın toplam fiyatı (EUR) */
  totalPrice: number;
  /** Depozit oranı (yüzde, örn: 25 = %25) */
  depositPercent: number;
  /** Geri ödeme süresi (ay) */
  termMonths: number;
  /** Yıllık faiz oranı (yüzde, örn: 8 = %8) */
  annualInterestRate: number;
}

export interface VehicleFinanceMonthlyRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface VehicleFinanceResult {
  /** Peşin ödenen depozit tutarı */
  depositAmount: number;
  /** Finanse edilen tutar (loan amount) */
  financedAmount: number;
  /** Aylık taksit */
  monthlyPayment: number;
  /** Toplam taksit ödemesi (taksit × ay) */
  totalRepayment: number;
  /** Toplam faiz */
  totalInterest: number;
  /** Genel toplam (depozit + toplam taksit) */
  grandTotal: number;
  /** Etkin yıllık faiz oranı */
  effectiveAnnualRate: number;
  /** Aylık amortizasyon planı */
  schedule: VehicleFinanceMonthlyRow[];
}

/** Malta vehicle finance constraints (2026 piyasa) */
export const VEHICLE_FINANCE_CONSTRAINTS = {
  MIN_PRICE: 5_000,
  MAX_PRICE: 200_000,
  MIN_DEPOSIT_PERCENT: 0,
  MAX_DEPOSIT_PERCENT: 80,
  MIN_TERM_MONTHS: 12,
  MAX_TERM_MONTHS: 120,
  MIN_RATE: 0,
  MAX_RATE: 25,
  // Defaults align with the typical Malta dealer hire-purchase quote
  DEFAULT_PRICE: 25_000,
  DEFAULT_DEPOSIT_PERCENT: 25,
  DEFAULT_TERM_MONTHS: 60,
  DEFAULT_RATE: 8,
} as const;

/**
 * Malta finans piyasası referans oranları (2026, yıllık faiz):
 *  - HSBC, BOV, APS gibi banka kaynakları + bayi finans şirketleri.
 *  - Bilgi amaçlıdır; kesin oran kullanıcının yıllık faiz girdisidir.
 */
export const MALTA_LENDER_BENCHMARKS = [
  { name: "BOV Motor Loan", rate: 4.75, type: "Bank (variable)" },
  { name: "APS Bank", rate: 5.5, type: "Bank" },
  { name: "Finance House (base)", rate: 5.5, type: "Finance company" },
  { name: "HSBC Car Loan", rate: 6.5, type: "Bank (fixed)" },
  { name: "BNF Bank", rate: 7.0, type: "Bank" },
  { name: "Dealer hire purchase", rate: 8.0, type: "Dealer" },
  { name: "Used car finance", rate: 9.0, type: "Finance company" },
] as const;

/** Calculate vehicle finance with deposit + amortization */
export function calculateVehicleFinance(
  input: VehicleFinanceInput,
): VehicleFinanceResult {
  const totalPrice = Math.max(0, input.totalPrice);
  const depositPercent = Math.max(0, Math.min(100, input.depositPercent));
  const termMonths = Math.max(1, Math.round(input.termMonths));
  const annualRate = Math.max(0, input.annualInterestRate);

  const depositAmount = totalPrice * (depositPercent / 100);
  const financedAmount = totalPrice - depositAmount;
  const monthlyRate = annualRate / 100 / 12;

  let monthlyPayment: number;
  if (financedAmount <= 0) {
    monthlyPayment = 0;
  } else if (monthlyRate === 0) {
    monthlyPayment = financedAmount / termMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, termMonths);
    monthlyPayment = (financedAmount * (monthlyRate * factor)) / (factor - 1);
  }

  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalRepayment - financedAmount);
  const grandTotal = depositAmount + totalRepayment;

  const schedule = generateSchedule(
    financedAmount,
    monthlyRate,
    monthlyPayment,
    termMonths,
  );

  return {
    depositAmount,
    financedAmount,
    monthlyPayment,
    totalRepayment,
    totalInterest,
    grandTotal,
    effectiveAnnualRate: annualRate,
    schedule,
  };
}

function generateSchedule(
  principal: number,
  monthlyRate: number,
  monthlyPayment: number,
  termMonths: number,
): VehicleFinanceMonthlyRow[] {
  const schedule: VehicleFinanceMonthlyRow[] = [];
  let balance = principal;

  for (let month = 1; month <= termMonths; month++) {
    if (balance <= 0) break;

    const interest = balance * monthlyRate;
    const principalPart = Math.min(monthlyPayment - interest, balance);
    balance -= principalPart;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal: principalPart,
      interest,
      remainingBalance: Math.max(0, balance),
    });
  }

  return schedule;
}

/** Format EUR with no decimals (display-friendly) */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/** Format EUR with 2 decimals (precise) */
export function formatCurrencyPrecise(value: number): string {
  return new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Convert months to "X years Y months" */
export function formatTerm(months: number): string {
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  if (years === 0) return `${months} months`;
  if (remaining === 0) return `${years} year${years > 1 ? "s" : ""}`;
  return `${years}y ${remaining}m`;
}
