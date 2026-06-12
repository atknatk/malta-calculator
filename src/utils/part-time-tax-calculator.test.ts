/**
 * Part-time %10 rejimi (TA22/TA23) senaryo testleri.
 */

import { describe, it, expect } from "vitest";
import {
  calculatePartTimeTax,
  PART_TIME_CAPS,
} from "./part-time-tax-calculator";

describe("calculatePartTimeTax", () => {
  it("caps the 10% regime at €10,000 for employment (TA23)", () => {
    const r = calculatePartTimeTax({
      partTimeIncome: 12000,
      workType: "employment",
      otherIncome: 30000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.cap).toBe(PART_TIME_CAPS.employment);
    expect(r.cappedAmount).toBe(10000);
    expect(r.excessAmount).toBe(2000);
    expect(r.flatTaxPortion).toBe(1000);
    // Aşan 2000, 30k üzerine %25 marjinalde: 500
    expect(r.excessTax).toBe(500);
    expect(r.flatOptionTax).toBe(1500);
  });

  it("caps the 10% regime at €12,000 for self-employment (TA22)", () => {
    const r = calculatePartTimeTax({
      partTimeIncome: 12000,
      workType: "selfEmployment",
      otherIncome: 30000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.cap).toBe(PART_TIME_CAPS.selfEmployment);
    expect(r.excessAmount).toBe(0);
    expect(r.flatOptionTax).toBe(1200);
  });

  it("recommends flat 10% for someone at the 25% marginal rate", () => {
    const r = calculatePartTimeTax({
      partTimeIncome: 8000,
      workType: "employment",
      otherIncome: 30000,
      taxType: "single",
      childCount: 0,
    });
    // Beyan: 30k→38k %25 marjinal = 2000 > %10 = 800
    expect(r.declareOptionTax).toBe(2000);
    expect(r.recommended).toBe("flat");
    expect(r.savings).toBe(1200);
  });

  it("recommends declaring for a low earner inside the 0% band", () => {
    const r = calculatePartTimeTax({
      partTimeIncome: 6000,
      workType: "employment",
      otherIncome: 0,
      taxType: "single",
      childCount: 0,
    });
    // Toplam 6.000 < 12.000 vergisiz dilim → beyan vergisi 0, %10 = 600
    expect(r.declareOptionTax).toBe(0);
    expect(r.recommended).toBe("declare");
    expect(r.savings).toBe(600);
  });

  it("handles zero part-time income", () => {
    const r = calculatePartTimeTax({
      partTimeIncome: 0,
      workType: "employment",
      otherIncome: 20000,
      taxType: "single",
      childCount: 0,
    });
    expect(r.flatOptionTax).toBe(0);
    expect(r.declareOptionTax).toBe(0);
    expect(r.recommended).toBe("equal");
  });
});
