/**
 * Class 2 SSC (self-occupied) 2026 senaryo testleri.
 * Tablo: SA ≤ €12.543,72 → €36,18; SB %15/52; SC1 > €25.500 → €73,56; SC2 > €29.083,36 → €83,89
 */

import { describe, it, expect } from "vitest";
import { calculateSelfEmployedSSC } from "./self-employed-ssc-calculator";

describe("calculateSelfEmployedSSC", () => {
  it("applies the SA flat minimum for low income", () => {
    const r = calculateSelfEmployedSSC({
      annualNetIncome: 10000,
      bornBefore1962: false,
    });
    expect(r.category).toBe("SA");
    expect(r.weeklyContribution).toBe(36.18);
    expect(r.annualContribution).toBe(1881.36);
    expect(r.perInstalment).toBe(627.12);
  });

  it("applies the SB 15% formula in the middle band", () => {
    const r = calculateSelfEmployedSSC({
      annualNetIncome: 20000,
      bornBefore1962: false,
    });
    expect(r.category).toBe("SB");
    // 20000 × 0.15 / 52 = 57.69
    expect(r.weeklyContribution).toBe(57.69);
  });

  it("caps at SC2 €83.89 for high earners born 1962+", () => {
    const r = calculateSelfEmployedSSC({
      annualNetIncome: 50000,
      bornBefore1962: false,
    });
    expect(r.category).toBe("SC");
    expect(r.weeklyContribution).toBe(83.89);
    expect(r.annualContribution).toBe(4362.28);
  });

  it("caps at SC1 €73.56 for high earners born before 1962", () => {
    const r = calculateSelfEmployedSSC({
      annualNetIncome: 50000,
      bornBefore1962: true,
    });
    expect(r.category).toBe("SC");
    expect(r.weeklyContribution).toBe(73.56);
  });

  it("uses the lower SC threshold for those born before 1962", () => {
    // 27.000: 1962+ için hâlâ SB; 1962 öncesi için SC
    const newRules = calculateSelfEmployedSSC({
      annualNetIncome: 27000,
      bornBefore1962: false,
    });
    const oldRules = calculateSelfEmployedSSC({
      annualNetIncome: 27000,
      bornBefore1962: true,
    });
    expect(newRules.category).toBe("SB");
    expect(oldRules.category).toBe("SC");
  });

  it("applies the reduced 15%-of-earnings option for eligible SA cases", () => {
    const r = calculateSelfEmployedSSC({
      annualNetIncome: 5000,
      bornBefore1962: false,
      useReducedPartTimeRate: true,
    });
    expect(r.category).toBe("SA");
    // 5000 × 0.15 / 52 = 14.42
    expect(r.weeklyContribution).toBe(14.42);
  });

  it("handles zero income without NaN", () => {
    const r = calculateSelfEmployedSSC({
      annualNetIncome: 0,
      bornBefore1962: false,
    });
    expect(r.effectiveRate).toBe(0);
    expect(Number.isFinite(r.annualContribution)).toBe(true);
  });
});
