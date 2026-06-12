/**
 * Bonus tax (FSS marjinal) senaryo testleri — 2026 single dilimleri:
 * 0% ≤12.000; 15% 12.001–16.000 (−1.800); 25% 16.001–60.000 (−3.400); 35% 60.001+ (−9.400)
 */

import { describe, it, expect } from "vitest";
import { calculateBonusTax } from "./bonus-tax-calculator";

describe("calculateBonusTax", () => {
  it("taxes a bonus at the 25% marginal rate for a mid earner", () => {
    const r = calculateBonusTax({
      annualSalary: 30000,
      bonusAmount: 2000,
      taxType: "single",
      childCount: 0,
    });
    // 30000: 30000×0.25−3400 = 4100; 32000: 32000×0.25−3400 = 4600
    expect(r.salaryOnlyTax).toBe(4100);
    expect(r.bonusTax).toBe(500);
    expect(r.netBonus).toBe(1500);
    expect(r.bonusEffectiveRate).toBe(25);
    expect(r.pushesToHigherBracket).toBe(false);
  });

  it("is tax-free when salary + bonus stays inside the 0% band", () => {
    const r = calculateBonusTax({
      annualSalary: 10000,
      bonusAmount: 1500,
      taxType: "single",
      childCount: 0,
    });
    expect(r.bonusTax).toBe(0);
    expect(r.netBonus).toBe(1500);
  });

  it("detects when the bonus pushes income into a higher bracket", () => {
    const r = calculateBonusTax({
      annualSalary: 59000,
      bonusAmount: 3000,
      taxType: "single",
      childCount: 0,
    });
    // 59000 → %25 dilim; 62000 → %35 dilim
    expect(r.pushesToHigherBracket).toBe(true);
    expect(r.marginalRate).toBe(35);
    // 59000×0.25−3400 = 11350; 62000×0.35−9400 = 12300 → bonus vergisi 950
    expect(r.bonusTax).toBe(950);
  });

  it("uses married brackets when selected", () => {
    const r = calculateBonusTax({
      annualSalary: 14000,
      bonusAmount: 1000,
      taxType: "married",
      childCount: 0,
    });
    // Married 0% bandı €15.000'e kadar → 14k + 1k hâlâ vergisiz
    expect(r.bonusTax).toBe(0);
  });

  it("handles zero bonus", () => {
    const r = calculateBonusTax({
      annualSalary: 30000,
      bonusAmount: 0,
      taxType: "single",
      childCount: 0,
    });
    expect(r.bonusTax).toBe(0);
    expect(r.bonusEffectiveRate).toBe(0);
  });
});
