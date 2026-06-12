/**
 * Malta Rental Income Tax Calculator
 * TA24: %15 nihai stopaj (brüt kira, indirim yok) — Income Tax Act Art. 31D
 * Alternatif: progresif beyan — indirimler: ground rent, lisans ücreti,
 * kredi faizi + kalan üzerinden %20 bakım indirimi (maintenance allowance).
 * Kaynak: mtca.gov.mt — Tax on Rental Income (TA24), 2026
 */

import { calculateAdditionalTax, type AnnualTaxResult } from "./annual-tax";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";

const FLAT_RATE = 0.15; // TA24 nihai stopaj
const MAINTENANCE_ALLOWANCE = 0.2; // %20 bakım indirimi

export interface RentalTaxInput {
  /** Yıllık brüt kira geliri (EUR) */
  grossRent: number;
  /** Kira dışındaki yıllık gelir (maaş vb.) — progresif kıyas için */
  otherIncome: number;
  /** Vergi kategorisi */
  taxType: SimpleTaxType;
  /** Çocuk sayısı (2026+ dilimleri için) */
  childCount: ChildCount;
  /** Yıllık ground rent / kira ödemesi (EUR) */
  groundRent?: number;
  /** Guest Houses Act lisans ücreti (EUR) */
  licenceFee?: number;
  /** Mülk edinme/iyileştirme kredisi faizi (EUR) */
  loanInterest?: number;
  /** Hesap yılı */
  year?: number;
}

export interface RentalTaxOutput {
  /** TA24 %15 nihai vergi (brüt üzerinden) */
  flatTax: number;
  /** Progresif rota: indirimler sonrası vergiye tabi net kira karı */
  taxableProfit: number;
  /** %20 bakım indirimi tutarı */
  maintenanceAllowance: number;
  /** Toplam indirimler (ground rent + lisans + faiz + bakım) */
  totalDeductions: number;
  /** Progresif rotada kira karının yarattığı ilave vergi */
  progressiveTax: number;
  /** Progresif rotada uygulanan marjinal oran (yüzde) */
  progressiveMarginalRate: number;
  /** Önerilen seçenek */
  recommended: "flat" | "progressive" | "equal";
  /** İki seçenek arasındaki fark (pozitif = önerilen seçenekle tasarruf) */
  savings: number;
}

/**
 * %15 nihai stopaj ile progresif beyan rotasını karşılaştırır
 */
export function calculateRentalTax(input: RentalTaxInput): RentalTaxOutput {
  const year = input.year ?? 2026;
  const grossRent = Math.max(0, input.grossRent);
  const groundRent = Math.max(0, input.groundRent ?? 0);
  const licenceFee = Math.max(0, input.licenceFee ?? 0);
  const loanInterest = Math.max(0, input.loanInterest ?? 0);

  // Seçenek A — TA24: brüt kiranın %15'i, indirim yok
  const flatTax = Math.round(grossRent * FLAT_RATE * 100) / 100;

  // Seçenek B — progresif: %20 bakım indirimi (ground rent ve lisans
  // düşüldükten sonraki tutar üzerinden), faiz ayrıca düşülür
  const afterFixedCosts = Math.max(0, grossRent - groundRent - licenceFee);
  const maintenanceAllowance =
    Math.round(afterFixedCosts * MAINTENANCE_ALLOWANCE * 100) / 100;
  const taxableProfit = Math.max(
    0,
    afterFixedCosts - maintenanceAllowance - loanInterest,
  );
  const totalDeductions =
    Math.min(grossRent, groundRent + licenceFee) +
    maintenanceAllowance +
    Math.min(loanInterest, afterFixedCosts - maintenanceAllowance);

  const progressive: AnnualTaxResult = calculateAdditionalTax(
    Math.max(0, input.otherIncome),
    taxableProfit,
    year,
    input.taxType,
    input.childCount,
  );

  const diff = Math.round((progressive.tax - flatTax) * 100) / 100;
  let recommended: RentalTaxOutput["recommended"];
  if (Math.abs(diff) < 0.01) {
    recommended = "equal";
  } else {
    recommended = diff > 0 ? "flat" : "progressive";
  }

  return {
    flatTax,
    taxableProfit,
    maintenanceAllowance,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    progressiveTax: progressive.tax,
    progressiveMarginalRate: progressive.marginalRate * 100,
    recommended,
    savings: Math.abs(diff),
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
