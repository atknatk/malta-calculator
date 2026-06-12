/**
 * Rental tax (TA24 %15 vs progresif) senaryo testleri.
 */

import { describe, it, expect } from "vitest";
import { calculateRentalTax } from "./rental-tax-calculator";

describe("calculateRentalTax", () => {
  it("computes the 15% flat tax on gross rent", () => {
    const r = calculateRentalTax({
      grossRent: 12000,
      otherIncome: 30000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.flatTax).toBe(1800);
  });

  it("applies the 20% maintenance allowance after ground rent and licence", () => {
    const r = calculateRentalTax({
      grossRent: 10000,
      otherIncome: 0,
      taxType: "single",
      childCount: 0,
      groundRent: 500,
      licenceFee: 500,
    });
    // (10000 − 1000) = 9000; %20 = 1800; matrah 7200
    expect(r.maintenanceAllowance).toBe(1800);
    expect(r.taxableProfit).toBe(7200);
  });

  it("deducts loan interest after the maintenance allowance", () => {
    const r = calculateRentalTax({
      grossRent: 10000,
      otherIncome: 0,
      taxType: "single",
      childCount: 0,
      loanInterest: 3000,
    });
    // 10000 − 2000 (bakım) − 3000 (faiz) = 5000
    expect(r.taxableProfit).toBe(5000);
  });

  it("recommends progressive for a low-income landlord (0% band)", () => {
    // Diğer gelir yok: 2026 single ilk €12.000 vergisiz → progresif vergi 0
    const r = calculateRentalTax({
      grossRent: 9000,
      otherIncome: 0,
      taxType: "single",
      childCount: 0,
    });
    expect(r.progressiveTax).toBe(0);
    expect(r.recommended).toBe("progressive");
    expect(r.savings).toBe(r.flatTax);
  });

  it("recommends flat 15% for a high earner at the 35% marginal rate", () => {
    const r = calculateRentalTax({
      grossRent: 12000,
      otherIncome: 70000,
      taxType: "single",
      childCount: 0,
    });
    // Marjinal %35 > %15 → flat kazanır
    expect(r.recommended).toBe("flat");
    expect(r.progressiveMarginalRate).toBe(35);
    expect(r.progressiveTax).toBeGreaterThan(r.flatTax);
  });

  it("handles zero rent without NaN", () => {
    const r = calculateRentalTax({
      grossRent: 0,
      otherIncome: 20000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.flatTax).toBe(0);
    expect(r.progressiveTax).toBe(0);
    expect(r.taxableProfit).toBe(0);
  });
});
