/**
 * Malta Net-to-Gross Salary Calculator
 *
 * Hedef net'i veren brüt maaşı bisection ile bulur. Forward fonksiyonu
 * (calculateMonthlyDeductions) monoton artan olduğu için ikiye bölme garantili
 * yakınsar. ~25 iterasyonda 0.005 € altına iner.
 *
 * İki çalışma modu (`includeBonusesInTarget`):
 *
 *   - true  → Hedef = toplam yıllık net (bonus + allowance + COLA dahil).
 *             Forward bonuslarla çalıştırılır; bisection target = total net.
 *
 *   - false → Hedef = "salary-only net". Yani: bonus/allowance hariç yalnızca
 *             ana maaşın ürettiği net hedefe eşitlenir. İki fazlı:
 *               1) Bonus/allowance olmadan bisection → salary-only gross.
 *               2) Bulunan gross + bonus + allowance ile final forward pass
 *                  (görüntülenecek aylık tablo bunu içerir).
 *             Bu yaklaşım yaklaşımsal subtraction'a göre matematiksel olarak
 *             daha temiz: bonusun marjinal vergi etkisini "tahmin etmek" yerine
 *             bisection'dan dışlıyoruz.
 *
 * Kaynak: src/utils/salary-calculator.ts (forward)
 */

import {
  calculateMonthlyDeductions,
  defaultConfig,
} from "@/utils/salary-calculator";
import {
  Month,
  type MonthlySalaryInput,
  type MonthlySalaryOutput,
  type SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";

export type MonthlyBonuses = Partial<Record<Month, number>>;

export interface NetToGrossInput {
  /** Yıllık hedef net (€). includeBonusesInTarget=true ise bonus+allowance dahil */
  targetAnnualNet: number;
  /** Bonus ve allowance hedefe dahil mi? false = sadece maaş netini hedefler */
  includeBonusesInTarget: boolean;
  /** Aylık allowance bonusu (her ay) */
  allowanceBonus: number;
  /** Per-month bonuses */
  monthlyBonuses: MonthlyBonuses;
}

export interface NetToGrossResult {
  /** Bulunan yıllık brüt maaş */
  annualGross: number;
  /** Aylık brüt maaş */
  monthlyGross: number;
  /** Aylık breakdown (bonus & allowance dahil edilmiş final görüntü) */
  monthly: MonthlySalaryOutput[];
  /** Yakınsama metadata'sı */
  iterations: number;
  /** Son hata (|targetNet - achievedNet|) */
  finalError: number;
  /** Bisection tolerans içinde yakınsadı mı? */
  converged: boolean;
}

const TOLERANCE = 0.005;
const MAX_ITERATIONS = 60;
const MAX_BOUND_DOUBLINGS = 10;

/**
 * Verilen yıllık brüt için aylık breakdown üretir.
 * `includeBonusAllowance=false` ise bonus & allowance sıfırlanır — salary-only
 * bisection bu modu kullanır.
 */
function runForward(
  annualGross: number,
  input: NetToGrossInput,
  config: SalaryCalculatorConfig,
  includeBonusAllowance: boolean,
): MonthlySalaryOutput[] {
  const monthlyGross =
    annualGross > 0 ? Number((annualGross / 12).toFixed(2)) : 0;

  const salaryInput: MonthlySalaryInput[] = Object.values(Month).map(
    (month) => ({
      month,
      grossWage: monthlyGross,
      bonus: includeBonusAllowance ? input.monthlyBonuses[month] || 0 : 0,
      allowanceBonus: includeBonusAllowance ? input.allowanceBonus : 0,
    }),
  );

  return calculateMonthlyDeductions(salaryInput, config);
}

function sumNet(monthly: MonthlySalaryOutput[]): number {
  return monthly.reduce((sum, m) => sum + m.net, 0);
}

/**
 * Bisection iç döngüsü. Belirli bir "include flag" altında, hedef net'i veren
 * brüt'ü arar. Ortak helper — her iki mod aynı algoritmayı kullanır.
 */
function bisectGross(
  target: number,
  input: NetToGrossInput,
  config: SalaryCalculatorConfig,
  includeBonusAllowance: boolean,
): {
  gross: number;
  monthly: MonthlySalaryOutput[];
  iterations: number;
  finalError: number;
  converged: boolean;
} {
  let low = target;
  let high = target * 3;

  // Üst sınır kontrolü: high'ın net'i target'tan büyük olmalı
  let boundDoublings = 0;
  while (boundDoublings < MAX_BOUND_DOUBLINGS) {
    const highMonthly = runForward(high, input, config, includeBonusAllowance);
    if (sumNet(highMonthly) >= target) break;
    high *= 2;
    boundDoublings++;
  }

  let mid = (low + high) / 2;
  let iterations = 0;
  let achieved = 0;
  let lastMonthly: MonthlySalaryOutput[] = [];

  for (iterations = 0; iterations < MAX_ITERATIONS; iterations++) {
    mid = (low + high) / 2;
    lastMonthly = runForward(mid, input, config, includeBonusAllowance);
    achieved = sumNet(lastMonthly);

    const error = achieved - target;
    if (Math.abs(error) < TOLERANCE) break;

    if (achieved < target) low = mid;
    else high = mid;

    if (high - low < TOLERANCE) break;
  }

  const finalError = Math.abs(achieved - target);
  // Forward calc rounds each month to 2 decimals; cumulative rounding can leave
  // up to ~0.5 € residual even when bisection has converged on the gross.
  // Use a practical "1 € on annual basis" threshold for the converged flag.
  const converged = finalError < 1;

  return {
    gross: mid,
    monthly: lastMonthly,
    iterations,
    finalError,
    converged,
  };
}

/**
 * Hedef net'i veren yıllık brüt maaşı bisection ile bulur.
 *
 * @param input - Hedef net ve bonus/allowance konfigürasyonu
 * @param configInput - Salary calculator config override'ı (year, tax type, vb.)
 * @returns Brüt maaş + aylık breakdown + yakınsama metadata'sı
 */
export function calculateGrossFromNet(
  input: NetToGrossInput,
  configInput: Partial<SalaryCalculatorConfig> = {},
): NetToGrossResult {
  const config: SalaryCalculatorConfig = { ...defaultConfig, ...configInput };
  const target = Math.max(0, input.targetAnnualNet);

  // Edge case: hedef 0 veya negatif
  if (target <= 0) {
    const monthly = runForward(0, input, config, true);
    return {
      annualGross: 0,
      monthlyGross: 0,
      monthly,
      iterations: 0,
      finalError: 0,
      converged: true,
    };
  }

  const result = bisectGross(
    target,
    input,
    config,
    input.includeBonusesInTarget, // true ise bonusla bisect, false ise salary-only bisect
  );

  // Salary-only modda: bulunan gross'la final pass — bonus & allowance dahil
  // edilmiş aylık tabloyu görüntüleyecek. (includeBonusesInTarget=true modda
  // bisection zaten bonusla yapıldığı için tablo doğrudan kullanılabilir.)
  const displayMonthly = input.includeBonusesInTarget
    ? result.monthly
    : runForward(result.gross, input, config, true);

  const annualGross = Math.round(result.gross * 100) / 100;
  const monthlyGross = Math.round((annualGross / 12) * 100) / 100;

  return {
    annualGross,
    monthlyGross,
    monthly: displayMonthly,
    iterations: result.iterations,
    finalError: result.finalError,
    converged: result.converged,
  };
}
