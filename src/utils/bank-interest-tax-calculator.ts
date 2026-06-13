/**
 * Malta Bank Interest Tax Calculator
 * Yerel banka mevduat faizi için iki rota karşılaştırması:
 *  - Seçenek A: %15 nihai stopaj (final withholding tax) — banka kaynağında keser,
 *    nihaidir, beyan gerekmez. (Income Tax Act Cap. 123, Investment Income
 *    Provisions, Art. 33–41.)
 *  - Seçenek B: brüt al + beyan et — faiz diğer gelire eklenip progresif gelir
 *    vergisi tarifesinde (0–%35) vergilenir; geri çevrilemez %15 yerine marjinal
 *    oran uygulanır.
 * Düşük gelirli mukimde (gelir 0% dilimde) Seçenek B genelde €0 vergi doğurur ve
 * %15'ten avantajlıdır. Yüksek gelirde (25–35% dilim) %15 stopaj daha ucuzdur.
 * Kaynak: mtca.gov.mt / cfr.gov.mt — Investment Income; PwC Malta Tax Summaries 2026.
 */

import { calculateAdditionalTax, type AnnualTaxResult } from "./annual-tax";
import type { ChildCount, SimpleTaxType } from "@/config/malta-tax-config";

const WITHHOLDING_RATE = 0.15; // %15 nihai stopaj (final withholding tax)

export interface BankInterestTaxInput {
  /** Yıllık brüt banka faizi (EUR) */
  interest: number;
  /** Faiz dışındaki yıllık gelir (maaş, emekli maaşı vb.) — progresif kıyas için */
  otherIncome: number;
  /** Vergi kategorisi */
  taxType: SimpleTaxType;
  /** Çocuk sayısı (2026+ dilimleri için) */
  childCount: ChildCount;
  /** Hesap yılı (basis year) */
  year?: number;
}

export interface BankInterestTaxOutput {
  /** Seçenek A — %15 nihai stopaj tutarı */
  withholdingTax: number;
  /** Stopaj sonrası elinize geçen net faiz */
  netInterestAfterWithholding: number;
  /** Seçenek B — brüt beyanda faizin yarattığı ilave progresif vergi */
  declareTax: number;
  /** Seçenek B'de brüt beyandan sonra elde kalan net faiz */
  netInterestAfterDeclaring: number;
  /** Seçenek B'de uygulanan marjinal oran (yüzde) */
  declareMarginalRate: number;
  /** Brüt beyanda faizin efektif vergi oranı (yüzde) */
  declareEffectiveRate: number;
  /** Önerilen rota */
  recommended: "withholding" | "declare" | "equal";
  /** İki rota arasındaki fark (pozitif = önerilenle yıllık tasarruf) */
  savings: number;
}

/**
 * %15 nihai stopaj ile brüt-beyan (progresif) rotasını karşılaştırır
 */
export function calculateBankInterestTax(
  input: BankInterestTaxInput,
): BankInterestTaxOutput {
  const year = input.year ?? 2026;
  const interest = Math.max(0, input.interest);
  const otherIncome = Math.max(0, input.otherIncome);

  // Seçenek A — %15 nihai stopaj (brüt faiz üzerinden, indirim yok)
  const withholdingTax = Math.round(interest * WITHHOLDING_RATE * 100) / 100;
  const netInterestAfterWithholding =
    Math.round((interest - withholdingTax) * 100) / 100;

  // Seçenek B — faizi brüt al, diğer gelirin üzerine ekleyip progresif vergi
  const declare: AnnualTaxResult = calculateAdditionalTax(
    otherIncome,
    interest,
    year,
    input.taxType,
    input.childCount,
  );
  const netInterestAfterDeclaring =
    Math.round((interest - declare.tax) * 100) / 100;

  const diff = Math.round((declare.tax - withholdingTax) * 100) / 100;
  let recommended: BankInterestTaxOutput["recommended"];
  if (Math.abs(diff) < 0.01) {
    recommended = "equal";
  } else {
    recommended = diff > 0 ? "withholding" : "declare";
  }

  return {
    withholdingTax,
    netInterestAfterWithholding,
    declareTax: declare.tax,
    netInterestAfterDeclaring,
    declareMarginalRate: declare.marginalRate * 100,
    declareEffectiveRate:
      interest > 0 ? Math.round((declare.tax / interest) * 1000) / 10 : 0,
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
