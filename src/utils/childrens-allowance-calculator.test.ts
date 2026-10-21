/**
 * Children's Allowance 2026 senaryo testleri.
 */

import { describe, it, expect } from "vitest";
import { calculateChildrensAllowance } from "./childrens-allowance-calculator";

const base = {
  grossIncome: 0,
  sscPaid: 0,
  rentIncome: 0,
  interestIncome: 0,
  pensionIncome: 0,
  maintenanceIncome: 0,
  otherIncome: 0,
  taxPaid: 0,
  numberOfChildren: 1,
};

describe("calculateChildrensAllowance", () => {
  it("pays the maximum €27.29/week and €910 supplement on low income", () => {
    const r = calculateChildrensAllowance({ ...base, grossIncome: 8000 });
    expect(r.weeklyPerChild).toBe(27.29);
    expect(r.supplementPerChild).toBe(910);
    expect(r.yearlyTotalWithSupplement).toBe(2329.08); // 1419.08 + 910
  });

  it("applies 6.5% of (€30,000 − net income) / 52 in the variable band", () => {
    const r = calculateChildrensAllowance({
      ...base,
      grossIncome: 20000,
      numberOfChildren: 2,
    });
    expect(r.weeklyPerChild).toBe(12.5); // 10000 × 6.5% / 52
    expect(r.supplementForAll).toBe(1820);
    expect(r.quarterlyPaymentWithSupplement).toBe(780); // 25 × 13 + 455
  });

  it("pays the €8.66 minimum and €640 supplement above €30,000", () => {
    const r = calculateChildrensAllowance({ ...base, grossIncome: 45000 });
    expect(r.rateType).toBe("fixed");
    expect(r.weeklyPerChild).toBe(8.66);
    expect(r.supplementPerChild).toBe(640);
  });
});
