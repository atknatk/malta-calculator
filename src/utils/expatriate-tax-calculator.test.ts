/**
 * HSI (LN 20/2026) %15 sabit oran testleri.
 */

import { describe, it, expect } from "vitest";
import { calculateExpatriateTax } from "./expatriate-tax-calculator";

describe("calculateExpatriateTax", () => {
  it("applies 15% flat above the €65,000 threshold", () => {
    const r = calculateExpatriateTax({
      annualIncome: 100000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.eligible).toBe(true);
    expect(r.hsiTax).toBe(15000);
    expect(r.hsiEffectiveRate).toBe(15);
    // Standart: 100000×0.35−9400 = 25600 → tasarruf 10600
    expect(r.standardTax).toBe(25600);
    expect(r.savings).toBe(10600);
  });

  it("is not eligible below €65,000 and reports the shortfall", () => {
    const r = calculateExpatriateTax({
      annualIncome: 50000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.eligible).toBe(false);
    expect(r.hsiTax).toBe(0);
    expect(r.shortfallToThreshold).toBe(15000);
  });

  it("taxes income above €7M at 35%", () => {
    const r = calculateExpatriateTax({
      annualIncome: 8000000,
      taxType: "single",
      childCount: 0,
    });
    // 7M×0.15 + 1M×0.35 = 1.050.000 + 350.000
    expect(r.hsiTax).toBe(1400000);
    expect(r.amountAbove7M).toBe(1000000);
  });

  it("is exactly eligible at the €65,000 threshold", () => {
    const r = calculateExpatriateTax({
      annualIncome: 65000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.eligible).toBe(true);
    expect(r.hsiTax).toBe(9750);
    // Standart: 65000×0.35−9400 = 13350 → HSI kazançlı
    expect(r.savings).toBe(3600);
  });

  it("handles zero income without NaN", () => {
    const r = calculateExpatriateTax({
      annualIncome: 0,
      taxType: "single",
      childCount: 0,
    });
    expect(r.eligible).toBe(false);
    expect(r.hsiEffectiveRate).toBe(0);
  });
});
