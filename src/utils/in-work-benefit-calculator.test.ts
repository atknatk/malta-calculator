/**
 * In-Work Benefit 2026 senaryo testleri.
 */

import { describe, it, expect } from "vitest";
import { calculateInWorkBenefit } from "./in-work-benefit-calculator";

describe("calculateInWorkBenefit", () => {
  it("gives a single parent the full band max", () => {
    const r = calculateInWorkBenefit({
      householdType: "singleParent",
      annualIncome: 18000,
      childCount: 2,
    });
    expect(r.eligible).toBe(true);
    expect(r.band).toBe("full");
    expect(r.maxPerChild).toBe(1627);
    expect(r.annualMax).toBe(3254);
    expect(r.quarterlyMax).toBe(813.5);
  });

  it("gives the reduced €327 rate in the upper band", () => {
    const r = calculateInWorkBenefit({
      householdType: "singleParent",
      annualIncome: 30000,
      childCount: 1,
    });
    expect(r.eligible).toBe(true);
    expect(r.band).toBe("reduced");
    expect(r.maxPerChild).toBe(327);
  });

  it("rejects income below the minimum threshold", () => {
    const r = calculateInWorkBenefit({
      householdType: "singleParent",
      annualIncome: 5000,
      childCount: 1,
    });
    expect(r.eligible).toBe(false);
    expect(r.annualMax).toBe(0);
  });

  it("rejects income above the band ceiling", () => {
    const r = calculateInWorkBenefit({
      householdType: "coupleBothWorking",
      annualIncome: 55000,
      childCount: 2,
      lowerEarnerIncome: 20000,
    });
    expect(r.eligible).toBe(false);
  });

  it("applies couple-both-working full band up to €36,846.99", () => {
    const r = calculateInWorkBenefit({
      householdType: "coupleBothWorking",
      annualIncome: 36000,
      childCount: 3,
      lowerEarnerIncome: 10000,
    });
    expect(r.eligible).toBe(true);
    expect(r.band).toBe("full");
    expect(r.annualMax).toBe(4881);
  });

  it("reroutes couple to one-working rules when lower earner is under €3,000", () => {
    const r = calculateInWorkBenefit({
      householdType: "coupleBothWorking",
      annualIncome: 20000,
      childCount: 1,
      lowerEarnerIncome: 2000,
    });
    expect(r.reroutedToOneWorking).toBe(true);
    expect(r.eligible).toBe(true);
    expect(r.maxPerChild).toBe(856); // tek-çalışan bandının oranı
  });

  it("caps couple-one-working at €856 per child", () => {
    const r = calculateInWorkBenefit({
      householdType: "coupleOneWorking",
      annualIncome: 20000,
      childCount: 2,
    });
    expect(r.maxPerChild).toBe(856);
    expect(r.annualMax).toBe(1712);
  });

  it("requires at least one child", () => {
    const r = calculateInWorkBenefit({
      householdType: "singleParent",
      annualIncome: 18000,
      childCount: 0,
    });
    expect(r.eligible).toBe(false);
  });
});
