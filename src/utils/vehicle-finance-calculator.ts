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
 *
 * Finance House SECCI (Standard European Consumer Credit Information) yapısı:
 *   - Processing Fee 4.75% — kredi tutarına bindirilir, ANAPARAYA AMORTIZE
 *   - Financing & Factoring Fee — tek seferlik €, ANAPARAYA AMORTIZE
 *   - Bills of Exchange Fee €10/ay × süre — toplamı ANAPARAYA AMORTIZE
 *     (her ay ayrı ödeme DEĞİL — bonoların pul/tescil bedeli olarak baştan finanse edilir)
 *   - APR = bu üç ücreti içerir; kotasyondaki "5.5% IR" → "13.82% APR"
 *
 * SECCI doğrulama: €13.000 / 72ay / 5.5% IR / 4.75% processing / €1.982,50 factoring
 *                  / €720 bills (= €10×72) → P=€16.320 → PMT=€266,63 → APR 13,82% ✓
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
  /** Tek seferlik banking/onboarding fee (kredi tutarının % olarak, ana paraya bindirilir) */
  bankingFeePercent?: number;
  /** Aylık draft / HP bill fee (€, her taksite eklenir) */
  monthlyDraftFee?: number;
  /** Tek seferlik financing & maintenance fee (€, finanse edilir) */
  maintenanceFee?: number;
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
  /** Ücret eklenmemiş kredi tutarı (price - deposit) */
  baseLoanAmount: number;
  /** Banking/onboarding fee tutarı (€) */
  bankingFeeAmount: number;
  /** Maintenance fee tutarı (€) */
  maintenanceFeeAmount: number;
  /** Toplam draft fee (€10/ay × n) */
  totalDraftFees: number;
  /** Tüm ücretlerin toplamı */
  totalFees: number;
  /** Faize tabi finanse edilen tutar (base loan + banking fee + maintenance fee) */
  financedAmount: number;
  /** Aylık taksit (amortizasyon + draft fee) */
  monthlyPayment: number;
  /** Sadece amortizasyon kısmı (draft fee hariç) */
  monthlyAmortizedPart: number;
  /** Toplam taksit ödemesi (taksit × ay) */
  totalRepayment: number;
  /** Toplam saf faiz */
  totalInterest: number;
  /** Toplam borçlanma maliyeti (faiz + tüm ücretler) */
  totalCostOfBorrowing: number;
  /** Genel toplam (depozit + toplam taksit) */
  grandTotal: number;
  /** Nominal yıllık faiz oranı (kullanıcı girdisi) */
  nominalAnnualRate: number;
  /** APRC — tüm ücretleri içeren etkin yıllık oran (%) */
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
  MAX_BANKING_FEE_PERCENT: 10,
  MAX_MONTHLY_DRAFT_FEE: 25,
  MAX_MAINTENANCE_FEE: 10_000,
  // Defaults align with the typical Malta dealer hire-purchase quote
  DEFAULT_PRICE: 25_000,
  DEFAULT_DEPOSIT_PERCENT: 25,
  DEFAULT_TERM_MONTHS: 60,
  DEFAULT_RATE: 8,
  DEFAULT_BANKING_FEE_PERCENT: 0,
  DEFAULT_MONTHLY_DRAFT_FEE: 0,
  DEFAULT_MAINTENANCE_FEE: 0,
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

/**
 * Hazır ücret presetleri (Malta dealer/finans şirketi gerçek kotasyonları).
 * Bunlar kullanıcı tek tıkla uygulayabilir.
 */
export const FEE_PRESETS = [
  {
    name: "Bank loan (no fees)",
    description: "Pure interest only — typical Maltese bank car loan",
    bankingFeePercent: 0,
    monthlyDraftFee: 0,
    maintenanceFee: 0,
  },
  {
    name: "Finance House HP (light)",
    description: "4.75% processing fee + €10/mo bills of exchange",
    bankingFeePercent: 4.75,
    monthlyDraftFee: 10,
    maintenanceFee: 0,
  },
  {
    name: "Finance House SECCI (full)",
    description:
      "Real €13k / 72mo example: 4.75% processing + €10 BoE + €1,982.50 factoring → 13.82% APR",
    bankingFeePercent: 4.75,
    monthlyDraftFee: 10,
    maintenanceFee: 1982.5,
  },
] as const;

/**
 * Late payment fee schedule (Finance House SECCI).
 * Sadece bilgi amaçlı — hesaplamaya dahil edilmez.
 */
export const LATE_PAYMENT_FEES = [
  { months: 1, fee: 10 },
  { months: 2, fee: 20 },
  { months: 3, fee: 30 },
  { months: 4, fee: 40 },
  { months: 5, fee: 50 },
] as const;

/**
 * Default-related (non-payment) fees from a typical Maltese SECCI.
 * Bilgi amaçlı; hesaplamaya dahil edilmez.
 */
export const DEFAULT_FEES = [
  { name: "Direct Debit rejected", fee: 15 },
  { name: "Returned cheque", fee: 20 },
  { name: "Final warning letter", fee: 20 },
  { name: "Legal letter", fee: 25 },
  { name: "Legal administration fee", fee: 50 },
  { name: "CRA pressure letter", fee: 14 },
  { name: "Hypothec registration (boats)", fee: 49 },
] as const;

/** Calculate vehicle finance with deposit + fees + amortization + APRC */
export function calculateVehicleFinance(
  input: VehicleFinanceInput,
): VehicleFinanceResult {
  const totalPrice = Math.max(0, input.totalPrice);
  const depositPercent = Math.max(0, Math.min(100, input.depositPercent));
  const termMonths = Math.max(1, Math.round(input.termMonths));
  const annualRate = Math.max(0, input.annualInterestRate);
  const bankingFeePct = Math.max(0, input.bankingFeePercent ?? 0);
  const monthlyDraftFee = Math.max(0, input.monthlyDraftFee ?? 0);
  const maintenanceFee = Math.max(0, input.maintenanceFee ?? 0);

  const depositAmount = totalPrice * (depositPercent / 100);
  const baseLoanAmount = totalPrice - depositAmount;

  // Banking/Processing fee % is applied on the base loan amount
  const bankingFeeAmount = baseLoanAmount * (bankingFeePct / 100);
  const maintenanceFeeAmount = maintenanceFee;
  // Bills of exchange / draft charges: total cost is added to principal upfront
  // (not paid alongside each instalment) — matches Finance House SECCI convention.
  const totalDraftFees = monthlyDraftFee * termMonths;

  // Faize tabi anapara = base loan + TÜM ücretler (banking + maintenance + drafts)
  const financedAmount =
    baseLoanAmount + bankingFeeAmount + maintenanceFeeAmount + totalDraftFees;
  const monthlyRate = annualRate / 100 / 12;

  let monthlyAmortizedPart: number;
  if (financedAmount <= 0) {
    monthlyAmortizedPart = 0;
  } else if (monthlyRate === 0) {
    monthlyAmortizedPart = financedAmount / termMonths;
  } else {
    const factor = Math.pow(1 + monthlyRate, termMonths);
    monthlyAmortizedPart =
      (financedAmount * (monthlyRate * factor)) / (factor - 1);
  }

  // Aylık ödeme = amortize edilmiş kısım (drafts artık anaparada)
  const monthlyPayment = monthlyAmortizedPart;
  const totalRepayment = monthlyPayment * termMonths;
  const totalInterest = Math.max(
    0,
    monthlyAmortizedPart * termMonths - financedAmount,
  );
  const totalFees = bankingFeeAmount + maintenanceFeeAmount + totalDraftFees;
  const totalCostOfBorrowing = totalInterest + totalFees;
  const grandTotal = depositAmount + totalRepayment;

  // APRC: borçlu cebine sadece baseLoanAmount değer giriyor (araç fiyatı eksi peşinat),
  // her ay monthlyPayment ödüyor — bu ilişkiyi sağlayan etkin yıllık oran.
  const effectiveAnnualRate = solveAPRC(
    baseLoanAmount,
    monthlyPayment,
    termMonths,
  );

  const schedule = generateSchedule(
    financedAmount,
    monthlyRate,
    monthlyAmortizedPart,
    termMonths,
  );

  return {
    depositAmount,
    baseLoanAmount,
    bankingFeeAmount,
    maintenanceFeeAmount,
    totalDraftFees,
    totalFees,
    financedAmount,
    monthlyPayment,
    monthlyAmortizedPart,
    totalRepayment,
    totalInterest,
    totalCostOfBorrowing,
    grandTotal,
    nominalAnnualRate: annualRate,
    effectiveAnnualRate,
    schedule,
  };
}

/**
 * APRC çözücü: bisection ile aylık efektif oranı bulur,
 * yıllık % cinsinden döner.
 *
 * loanReceived = sum_{t=1..n} monthlyPayment / (1 + r/12)^t denklemini çözer.
 */
function solveAPRC(
  loanReceived: number,
  monthlyPayment: number,
  termMonths: number,
): number {
  if (loanReceived <= 0 || monthlyPayment <= 0 || termMonths <= 0) return 0;

  const totalPaid = monthlyPayment * termMonths;
  if (totalPaid <= loanReceived) return 0;

  const presentValue = (rMonthly: number): number => {
    if (rMonthly < 1e-12) return monthlyPayment * termMonths;
    return (
      (monthlyPayment * (1 - Math.pow(1 + rMonthly, -termMonths))) / rMonthly
    );
  };

  let lo = 0;
  let hi = 5; // 500%/month — fazlasıyla yeterli
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const pv = presentValue(mid);
    if (pv > loanReceived) {
      lo = mid;
    } else {
      hi = mid;
    }
    if (hi - lo < 1e-12) break;
  }
  return ((lo + hi) / 2) * 12 * 100;
}

function generateSchedule(
  principal: number,
  monthlyRate: number,
  monthlyAmortizedPart: number,
  termMonths: number,
): VehicleFinanceMonthlyRow[] {
  const schedule: VehicleFinanceMonthlyRow[] = [];
  let balance = principal;

  for (let month = 1; month <= termMonths; month++) {
    if (balance <= 0) break;

    const interest = balance * monthlyRate;
    const principalPart = Math.min(monthlyAmortizedPart - interest, balance);
    balance -= principalPart;

    schedule.push({
      month,
      payment: monthlyAmortizedPart,
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
