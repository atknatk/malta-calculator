/**
 * Malta Bonus Tax Calculator
 * Bonuslar (13. maaş, performans, yıl sonu) FSS altında normal gelire eklenir
 * ve marjinal oranda vergilenir: vergi = yıllıkVergi(maaş + bonus) − yıllıkVergi(maaş).
 * SSC bonus üzerinden alınmaz (temel haftalık ücrete uygulanır).
 * Kaynak: mtca.gov.mt FSS kuralları, 2026 dilimleri
 */

import { calculateAnnualTax, calculateAdditionalTax } from "./annual-tax";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";

export interface BonusTaxInput {
  /** Yıllık brüt maaş (bonus hariç, EUR) */
  annualSalary: number;
  /** Bonus tutarı (EUR) */
  bonusAmount: number;
  /** Vergi kategorisi */
  taxType: SimpleTaxType;
  /** Çocuk sayısı (2026+ dilimleri) */
  childCount: ChildCount;
  /** Hesap yılı */
  year?: number;
}

export interface BonusTaxOutput {
  /** Bonusa düşen vergi (EUR) */
  bonusTax: number;
  /** Vergi sonrası net bonus (EUR) */
  netBonus: number;
  /** Bonusa uygulanan efektif oran (yüzde) */
  bonusEffectiveRate: number;
  /** Bonus sonrası marjinal dilim oranı (yüzde) */
  marginalRate: number;
  /** Sadece maaşın yıllık vergisi (EUR) */
  salaryOnlyTax: number;
  /** Maaş + bonus toplam yıllık vergi (EUR) */
  totalTax: number;
  /** Bonus, geliri bir üst dilime taşıyor mu */
  pushesToHigherBracket: boolean;
}

/**
 * Bonusun marjinal vergisini hesaplar
 */
export function calculateBonusTax(input: BonusTaxInput): BonusTaxOutput {
  const year = input.year ?? 2026;
  const annualSalary = Math.max(0, input.annualSalary);
  const bonusAmount = Math.max(0, input.bonusAmount);

  const salaryOnly = calculateAnnualTax(
    annualSalary,
    year,
    input.taxType,
    input.childCount,
  );
  const additional = calculateAdditionalTax(
    annualSalary,
    bonusAmount,
    year,
    input.taxType,
    input.childCount,
  );

  return {
    bonusTax: additional.tax,
    netBonus: Math.round((bonusAmount - additional.tax) * 100) / 100,
    bonusEffectiveRate: additional.effectiveRate,
    marginalRate: additional.marginalRate * 100,
    salaryOnlyTax: salaryOnly.tax,
    totalTax: Math.round((salaryOnly.tax + additional.tax) * 100) / 100,
    pushesToHigherBracket: additional.marginalRate > salaryOnly.marginalRate,
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
