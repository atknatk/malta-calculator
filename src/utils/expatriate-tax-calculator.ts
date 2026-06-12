/**
 * Malta Highly Skilled Individuals (HSI) Vergi Hesaplayıcısı — LN 20/2026
 * 1 Ocak 2026'dan itibaren eski HQP/QEIC/havacılık/denizcilik/family office
 * şemalarını birleştiren yeni çerçeve:
 *   - Uygun istihdam gelirinde %15 sabit oran (dilimsiz, indirimsiz)
 *   - Minimum yıllık gelir: €65.000 (her 5 yılda €10.000 artar)
 *   - €7.000.000 üzeri gelir %35
 *   - Süre: 5 yıl + iki kez 5 yıl uzatma; tüm haklar 31 Aralık 2040'ta sona erer
 * Kaynak: L.N. 20 of 2026 — Tax Treatment of Highly Skilled Individuals Rules
 */

import { calculateAnnualTax } from "./annual-tax";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";

const HSI_2026 = {
  FLAT_RATE: 0.15,
  MIN_INCOME: 65000,
  HIGH_INCOME_CAP: 7000000, // üzeri %35
  HIGH_INCOME_RATE: 0.35,
  BENEFIT_YEARS: 5,
  MAX_RENEWALS: 2,
  SUNSET_DATE: "31 December 2040",
} as const;

export interface ExpatriateTaxInput {
  /** Yıllık brüt istihdam geliri (EUR) */
  annualIncome: number;
  /** Kıyas için standart vergi kategorisi */
  taxType: SimpleTaxType;
  /** Çocuk sayısı (standart kıyas için) */
  childCount: ChildCount;
  /** Hesap yılı */
  year?: number;
}

export interface ExpatriateTaxOutput {
  /** Gelir HSI eşiğini karşılıyor mu */
  eligible: boolean;
  /** HSI altında toplam vergi (EUR) */
  hsiTax: number;
  /** HSI efektif oranı (yüzde) */
  hsiEffectiveRate: number;
  /** Standart progresif vergiler (EUR) */
  standardTax: number;
  /** Standart marjinal oran (yüzde) */
  standardMarginalRate: number;
  /** HSI ile yıllık tasarruf (EUR; negatifse standart daha iyi) */
  savings: number;
  /** %35'lik dilime giren kısım (EUR) */
  amountAbove7M: number;
  /** Eşiğe kalan fark (uygun değilse, EUR) */
  shortfallToThreshold: number;
}

/**
 * HSI %15 sabit oranını standart progresif vergiyle karşılaştırır
 */
export function calculateExpatriateTax(
  input: ExpatriateTaxInput,
): ExpatriateTaxOutput {
  const year = input.year ?? 2026;
  const income = Math.max(0, input.annualIncome);

  const eligible = income >= HSI_2026.MIN_INCOME;
  const amountAbove7M = Math.max(0, income - HSI_2026.HIGH_INCOME_CAP);
  const flatPortion = Math.min(income, HSI_2026.HIGH_INCOME_CAP);

  const hsiTax = eligible
    ? Math.round(
        (flatPortion * HSI_2026.FLAT_RATE +
          amountAbove7M * HSI_2026.HIGH_INCOME_RATE) *
          100,
      ) / 100
    : 0;

  const standard = calculateAnnualTax(
    income,
    year,
    input.taxType,
    input.childCount,
  );

  return {
    eligible,
    hsiTax,
    hsiEffectiveRate: eligible && income > 0 ? (hsiTax / income) * 100 : 0,
    standardTax: standard.tax,
    standardMarginalRate: standard.marginalRate * 100,
    savings: eligible ? Math.round((standard.tax - hsiTax) * 100) / 100 : 0,
    amountAbove7M,
    shortfallToThreshold: eligible ? 0 : HSI_2026.MIN_INCOME - income,
  };
}

/**
 * UI için HSI kuralları
 */
export function getHSIRules() {
  return HSI_2026;
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
