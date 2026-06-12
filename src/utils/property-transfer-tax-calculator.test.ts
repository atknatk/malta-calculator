/**
 * Property Transfer Tax (Art. 5A final withholding tax) scenario tests.
 */

import { describe, it, expect } from "vitest";
import { calculatePropertyTransferTax } from "./property-transfer-tax-calculator";

describe("calculatePropertyTransferTax", () => {
  it("applies the standard 8% rate on the full transfer value", () => {
    const result = calculatePropertyTransferTax({
      transferValue: 300000,
      scenario: "standard",
    });
    expect(result.tax).toBe(24000);
    expect(result.rateApplied).toBe(8);
    expect(result.netProceeds).toBe(276000);
    expect(result.savingsVsStandard).toBe(0);
    expect(result.isExempt).toBe(false);
  });

  it("applies 5% when sold within 5 years (non-project)", () => {
    const result = calculatePropertyTransferTax({
      transferValue: 300000,
      scenario: "within5Years",
    });
    expect(result.tax).toBe(15000);
    expect(result.savingsVsStandard).toBe(9000);
  });

  it("applies 2% for a sole residence sold within 3 years", () => {
    const result = calculatePropertyTransferTax({
      transferValue: 250000,
      scenario: "soleResidenceUnder3",
    });
    expect(result.tax).toBe(5000);
    expect(result.rateApplied).toBe(2);
  });

  it("is fully exempt for a 3+ year sole residence", () => {
    const result = calculatePropertyTransferTax({
      transferValue: 400000,
      scenario: "soleResidence3Plus",
    });
    expect(result.tax).toBe(0);
    expect(result.isExempt).toBe(true);
    expect(result.netProceeds).toBe(400000);
    expect(result.savingsVsStandard).toBe(32000);
  });

  it("applies 10% for property acquired before 2004", () => {
    const result = calculatePropertyTransferTax({
      transferValue: 200000,
      scenario: "pre2004",
    });
    expect(result.tax).toBe(20000);
    expect(result.savingsVsStandard).toBe(0); // standard'dan pahalı, tasarruf yok
  });

  it("taxes only the gain at 12% for property inherited after 24 Nov 1992", () => {
    const result = calculatePropertyTransferTax({
      transferValue: 300000,
      scenario: "inheritedPost1992",
      acquisitionValue: 180000,
    });
    expect(result.taxableBase).toBe(120000);
    expect(result.tax).toBe(14400);
  });

  it("charges no 12% tax when the declared value exceeds the sale price", () => {
    const result = calculatePropertyTransferTax({
      transferValue: 150000,
      scenario: "inheritedPost1992",
      acquisitionValue: 200000,
    });
    expect(result.taxableBase).toBe(0);
    expect(result.tax).toBe(0);
  });

  it("applies 7% for property inherited on/before 24 Nov 1992", () => {
    const result = calculatePropertyTransferTax({
      transferValue: 300000,
      scenario: "inheritedPre1992",
    });
    expect(result.tax).toBe(21000);
  });

  it("deducts brokerage fees from the taxable base", () => {
    const result = calculatePropertyTransferTax({
      transferValue: 300000,
      scenario: "standard",
      brokerageFee: 15000,
    });
    expect(result.taxableBase).toBe(285000);
    expect(result.tax).toBe(22800);
  });

  it("handles a zero transfer value without NaN", () => {
    const result = calculatePropertyTransferTax({
      transferValue: 0,
      scenario: "standard",
    });
    expect(result.tax).toBe(0);
    expect(result.effectiveRate).toBe(0);
  });
});
