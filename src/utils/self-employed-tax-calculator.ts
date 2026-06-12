/**
 * Malta Self-Employed (Self-Occupied) Vergi Hesaplayıcısı — 2026
 * Net kâr (gelir − gider) progresif dilimlerde vergilenir; üstüne Class 2 SSC.
 * Provisional Tax taksitleri: %20 (30 Nisan), %30 (31 Ağustos), %50 (21 Aralık).
 * Kaynak: mtca.gov.mt PT Booklet + 2026 dilimleri; Class 2 motoru yeniden kullanılır.
 */

import { calculateAnnualTax } from "./annual-tax";
import { calculateSelfEmployedSSC } from "./self-employed-ssc-calculator";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";

/** Provisional tax taksit oranları ve vade etiketleri */
export const PT_INSTALMENTS = [
  { label: "30 April", share: 0.2 },
  { label: "31 August", share: 0.3 },
  { label: "21 December", share: 0.5 },
] as const;

export interface SelfEmployedTaxInput {
  /** Yıllık brüt gelir / ciro (EUR) */
  grossRevenue: number;
  /** İndirilebilir işletme giderleri (EUR) */
  businessExpenses: number;
  /** Vergi kategorisi */
  taxType: SimpleTaxType;
  /** Çocuk sayısı (2026+ dilimleri) */
  childCount: ChildCount;
  /** 1962 öncesi doğumlu mu (Class 2 SC eşiği için) */
  bornBefore1962: boolean;
  /** Hesap yılı */
  year?: number;
}

export interface SelfEmployedTaxOutput {
  /** Vergiye tabi net kâr (EUR) */
  netProfit: number;
  /** Yıllık gelir vergisi (EUR) */
  incomeTax: number;
  /** Marjinal vergi oranı (yüzde) */
  marginalRate: number;
  /** Class 2 SSC yıllık toplam (EUR) */
  sscAnnual: number;
  /** Class 2 kategorisi (SA/SB/SC) */
  sscCategory: string;
  /** Vergi + SSC toplamı (EUR) */
  totalBurden: number;
  /** Tüm kesintiler sonrası net gelir (EUR) */
  netIncome: number;
  /** Toplam yükün net kâra oranı (yüzde) */
  effectiveRate: number;
  /** Provisional tax taksitleri (gelir vergisi üzerinden) */
  ptInstalments: Array<{ label: string; amount: number }>;
}

/**
 * Self-employed yıllık vergi + Class 2 SSC yükünü hesaplar
 */
export function calculateSelfEmployedTax(
  input: SelfEmployedTaxInput,
): SelfEmployedTaxOutput {
  const year = input.year ?? 2026;
  const revenue = Math.max(0, input.grossRevenue);
  const expenses = Math.max(0, input.businessExpenses);
  const netProfit = Math.max(0, revenue - expenses);

  const tax = calculateAnnualTax(
    netProfit,
    year,
    input.taxType,
    input.childCount,
  );

  // Class 2 SSC önceki yılın net gelirine dayanır; tahmin için cari kâr kullanılır
  const ssc = calculateSelfEmployedSSC({
    annualNetIncome: netProfit,
    bornBefore1962: input.bornBefore1962,
  });

  const totalBurden =
    Math.round((tax.tax + ssc.annualContribution) * 100) / 100;
  const netIncome = Math.round((netProfit - totalBurden) * 100) / 100;

  return {
    netProfit,
    incomeTax: tax.tax,
    marginalRate: tax.marginalRate * 100,
    sscAnnual: ssc.annualContribution,
    sscCategory: ssc.category,
    totalBurden,
    netIncome,
    effectiveRate: netProfit > 0 ? (totalBurden / netProfit) * 100 : 0,
    ptInstalments: PT_INSTALMENTS.map((i) => ({
      label: i.label,
      amount: Math.round(tax.tax * i.share * 100) / 100,
    })),
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
