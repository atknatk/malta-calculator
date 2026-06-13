/**
 * Bank interest tax (%15 nihai stopaj vs brüt-beyan progresif) senaryo testleri.
 */

import { describe, it, expect } from "vitest";
import { calculateBankInterestTax } from "./bank-interest-tax-calculator";

describe("calculateBankInterestTax", () => {
  it("computes the 15% final withholding tax on gross interest", () => {
    const r = calculateBankInterestTax({
      interest: 1000,
      otherIncome: 30000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.withholdingTax).toBe(150);
    expect(r.netInterestAfterWithholding).toBe(850);
  });

  it("recommends declaring gross for a low earner below the tax-free band", () => {
    // 2026 single: ilk €12.000 vergisiz. 9.000 + 1.000 faiz = 10.000 → progresif 0
    const r = calculateBankInterestTax({
      interest: 1000,
      otherIncome: 9000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.declareTax).toBe(0);
    expect(r.declareMarginalRate).toBe(0);
    expect(r.recommended).toBe("declare");
    expect(r.savings).toBe(150);
    expect(r.netInterestAfterDeclaring).toBe(1000);
  });

  it("recommends 15% withholding for a high earner in the 25% band", () => {
    const r = calculateBankInterestTax({
      interest: 1000,
      otherIncome: 50000,
      taxType: "single",
      childCount: 0,
    });
    // declare: 50k→9100, 51k→9350, ilave 250 > 150 stopaj
    expect(r.declareTax).toBe(250);
    expect(r.declareMarginalRate).toBe(25);
    expect(r.recommended).toBe("withholding");
    expect(r.savings).toBe(100);
  });

  it("handles a partial-threshold case just over €12,000", () => {
    const r = calculateBankInterestTax({
      interest: 1000,
      otherIncome: 11500,
      taxType: "single",
      childCount: 0,
    });
    // base 11500 → 0; combined 12500 → 12500*0.15 − 1800 = 75
    expect(r.declareTax).toBe(75);
    expect(r.recommended).toBe("declare");
  });

  it("uses the higher married tax-free band (no tax up to €15,000)", () => {
    // Evli, çocuksuz 2026: ilk €15.000 vergisiz. 13.000 + 1.000 = 14.000 → 0
    const r = calculateBankInterestTax({
      interest: 1000,
      otherIncome: 13000,
      taxType: "married",
      childCount: 0,
    });
    expect(r.declareTax).toBe(0);
    expect(r.recommended).toBe("declare");
  });

  it("handles zero interest without NaN", () => {
    const r = calculateBankInterestTax({
      interest: 0,
      otherIncome: 20000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.withholdingTax).toBe(0);
    expect(r.declareTax).toBe(0);
    expect(r.declareEffectiveRate).toBe(0);
  });
});
