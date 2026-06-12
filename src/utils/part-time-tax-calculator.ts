/**
 * Malta Part-Time %10 Vergi Hesaplayıcısı
 * TA23 (part-time çalışan): ilk €10.000 için opsiyonel %10 nihai vergi.
 * TA22 (part-time self-employed): ilk €12.000 için opsiyonel %10 nihai vergi.
 * Üst sınırı aşan kısım beyannamede progresif oranda vergilenir.
 * Alternatif: tamamını beyan edip progresif oran (düşük gelirde daha avantajlı olabilir).
 * Kaynak: mtca.gov.mt — Part-Time Employment (TA23) / Self-Employed (TA22), 2026
 */

import { calculateAdditionalTax } from "./annual-tax";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";

const FLAT_RATE = 0.1; // %10 nihai vergi

/** %10 rejimi üst sınırları (yıllık, EUR) */
export const PART_TIME_CAPS = {
  employment: 10000, // TA23
  selfEmployment: 12000, // TA22
} as const;

export type PartTimeWorkType = keyof typeof PART_TIME_CAPS;

export interface PartTimeTaxInput {
  /** Yıllık part-time gelir (EUR) */
  partTimeIncome: number;
  /** Part-time iş türü: employment (TA23) | selfEmployment (TA22) */
  workType: PartTimeWorkType;
  /** Ana işten / diğer kaynaklardan yıllık gelir (EUR) */
  otherIncome: number;
  /** Vergi kategorisi */
  taxType: SimpleTaxType;
  /** Çocuk sayısı (2026+ dilimleri) */
  childCount: ChildCount;
  /** Hesap yılı */
  year?: number;
}

export interface PartTimeTaxOutput {
  /** %10 rejiminin kapsadığı tutar (cap'e kadar) */
  cappedAmount: number;
  /** Cap üstünde kalan ve progresif vergilenen tutar */
  excessAmount: number;
  /** Seçenek A: %10 rejimi toplam vergi (cap × %10 + aşan kısmın marjinal vergisi) */
  flatOptionTax: number;
  /** Seçenek A'nın %10'luk kısmı */
  flatTaxPortion: number;
  /** Seçenek A'nın aşan kısım vergisi */
  excessTax: number;
  /** Seçenek B: tamamını beyan etmenin ilave vergisi */
  declareOptionTax: number;
  /** Seçenek B'de uygulanan marjinal oran (yüzde) */
  declareMarginalRate: number;
  /** Önerilen seçenek */
  recommended: "flat" | "declare" | "equal";
  /** Önerilen seçenekle tasarruf (EUR) */
  savings: number;
  /** Uygulanan cap (EUR) */
  cap: number;
}

/**
 * %10 part-time rejimi ile tam beyanı karşılaştırır
 */
export function calculatePartTimeTax(
  input: PartTimeTaxInput,
): PartTimeTaxOutput {
  const year = input.year ?? 2026;
  const income = Math.max(0, input.partTimeIncome);
  const otherIncome = Math.max(0, input.otherIncome);
  const cap = PART_TIME_CAPS[input.workType];

  // Seçenek A — %10 nihai vergi: cap'e kadar %10, aşan kısım beyanda marjinal
  const cappedAmount = Math.min(income, cap);
  const excessAmount = Math.max(0, income - cap);
  const flatTaxPortion = Math.round(cappedAmount * FLAT_RATE * 100) / 100;
  const excessTax = calculateAdditionalTax(
    otherIncome,
    excessAmount,
    year,
    input.taxType,
    input.childCount,
  ).tax;
  const flatOptionTax = Math.round((flatTaxPortion + excessTax) * 100) / 100;

  // Seçenek B — tamamını beyan: part-time gelir diğer gelirin üstüne eklenir
  const declare = calculateAdditionalTax(
    otherIncome,
    income,
    year,
    input.taxType,
    input.childCount,
  );

  const diff = Math.round((declare.tax - flatOptionTax) * 100) / 100;
  let recommended: PartTimeTaxOutput["recommended"];
  if (Math.abs(diff) < 0.01) {
    recommended = "equal";
  } else {
    recommended = diff > 0 ? "flat" : "declare";
  }

  return {
    cappedAmount,
    excessAmount,
    flatOptionTax,
    flatTaxPortion,
    excessTax,
    declareOptionTax: declare.tax,
    declareMarginalRate: declare.marginalRate * 100,
    recommended,
    savings: Math.abs(diff),
    cap,
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
