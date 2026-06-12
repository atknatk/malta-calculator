/**
 * Self-employed vergi + Class 2 SSC entegrasyon testleri (2026 single dilimleri).
 */

import { describe, it, expect } from "vitest";
import { calculateSelfEmployedTax } from "./self-employed-tax-calculator";

describe("calculateSelfEmployedTax", () => {
  it("taxes net profit at progressive rates and adds Class 2 SSC", () => {
    const r = calculateSelfEmployedTax({
      grossRevenue: 40000,
      businessExpenses: 10000,
      taxType: "single",
      childCount: 0,
      bornBefore1962: false,
    });
    expect(r.netProfit).toBe(30000);
    // 30000×0.25−3400 = 4100
    expect(r.incomeTax).toBe(4100);
    expect(r.marginalRate).toBe(25);
    // SB: 30000... hayır — 30.000 > 29.083,36 → SC2 €83.89×52 = 4362.28
    expect(r.sscCategory).toBe("SC");
    expect(r.sscAnnual).toBe(4362.28);
    expect(r.totalBurden).toBe(8462.28);
    expect(r.netIncome).toBe(21537.72);
  });

  it("splits provisional tax 20/30/50", () => {
    const r = calculateSelfEmployedTax({
      grossRevenue: 40000,
      businessExpenses: 10000,
      taxType: "single",
      childCount: 0,
      bornBefore1962: false,
    });
    expect(r.ptInstalments[0]).toEqual({ label: "30 April", amount: 820 });
    expect(r.ptInstalments[1]).toEqual({ label: "31 August", amount: 1230 });
    expect(r.ptInstalments[2]).toEqual({ label: "21 December", amount: 2050 });
  });

  it("pays no income tax inside the 0% band but still pays SSC", () => {
    const r = calculateSelfEmployedTax({
      grossRevenue: 15000,
      businessExpenses: 4000,
      taxType: "single",
      childCount: 0,
      bornBefore1962: false,
    });
    expect(r.netProfit).toBe(11000);
    expect(r.incomeTax).toBe(0);
    expect(r.sscCategory).toBe("SA"); // 11.000 ≤ 12.543,72
    expect(r.sscAnnual).toBe(1881.36);
  });

  it("clamps expenses above revenue to zero profit", () => {
    const r = calculateSelfEmployedTax({
      grossRevenue: 10000,
      businessExpenses: 15000,
      taxType: "single",
      childCount: 0,
      bornBefore1962: false,
    });
    expect(r.netProfit).toBe(0);
    expect(r.incomeTax).toBe(0);
    expect(r.effectiveRate).toBe(0);
  });

  it("uses the lower SC cap for those born before 1962", () => {
    const r = calculateSelfEmployedTax({
      grossRevenue: 60000,
      businessExpenses: 0,
      taxType: "single",
      childCount: 0,
      bornBefore1962: true,
    });
    expect(r.sscAnnual).toBe(3825.12); // 73.56 × 52
  });
});
