/**
 * Malta yıllık gelir vergisi yardımcısı
 * Tek seferlik (yıllık toplam) progresif vergi hesabı — rental-tax, bonus-tax,
 * part-time gibi karşılaştırma hesaplayıcılarının ortak motoru.
 * Dilim formu: vergi = gelir × oran − indirim (malta-tax-config ile aynı).
 */

import {
  getTaxBracketsForYear,
  resolveTaxRateType,
  type ChildCount,
  type SimpleTaxType,
  type TaxBracket,
} from "@/config/malta-tax-config";

export interface AnnualTaxResult {
  /** Yıllık toplam gelir vergisi (EUR) */
  tax: number;
  /** Gelirin düştüğü dilimin oranı (ör. 0.25) */
  marginalRate: number;
  /** Vergi / gelir (yüzde, ör. 14.3) */
  effectiveRate: number;
}

function findBracket(income: number, brackets: TaxBracket[]): TaxBracket {
  for (const bracket of brackets) {
    if (income >= bracket.min && income <= bracket.max) {
      return bracket;
    }
  }
  return brackets[brackets.length - 1];
}

/**
 * Yıllık gelir üzerinden Malta gelir vergisini hesaplar
 */
export function calculateAnnualTax(
  annualIncome: number,
  year: number,
  taxType: SimpleTaxType,
  childCount: ChildCount = 0,
): AnnualTaxResult {
  if (annualIncome <= 0) {
    return { tax: 0, marginalRate: 0, effectiveRate: 0 };
  }

  const rateType = resolveTaxRateType(year, taxType, childCount);
  const brackets = getTaxBracketsForYear(year, rateType);
  const bracket = findBracket(annualIncome, brackets);

  const tax = Math.max(
    0,
    Math.round((annualIncome * bracket.rate - bracket.deduction) * 100) / 100,
  );

  return {
    tax,
    marginalRate: bracket.rate,
    effectiveRate: annualIncome > 0 ? (tax / annualIncome) * 100 : 0,
  };
}

/**
 * Mevcut gelirin ÜZERİNE eklenen ekstra gelirin yarattığı ilave vergi
 * (bonus, kira karı, part-time gelir beyanı gibi marjinal senaryolar için)
 */
export function calculateAdditionalTax(
  baseIncome: number,
  additionalIncome: number,
  year: number,
  taxType: SimpleTaxType,
  childCount: ChildCount = 0,
): AnnualTaxResult {
  const base = calculateAnnualTax(baseIncome, year, taxType, childCount);
  const combined = calculateAnnualTax(
    baseIncome + additionalIncome,
    year,
    taxType,
    childCount,
  );

  const tax = Math.max(0, Math.round((combined.tax - base.tax) * 100) / 100);

  return {
    tax,
    marginalRate: combined.marginalRate,
    effectiveRate: additionalIncome > 0 ? (tax / additionalIncome) * 100 : 0,
  };
}
