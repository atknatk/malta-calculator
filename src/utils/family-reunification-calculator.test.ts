import { describe, it, expect } from "vitest";
import {
  calculateFamilyReunification,
  calculateKeiThreshold,
  estimateAnnualNet,
  getEligibility,
  WAGE_DATA,
} from "./family-reunification-calculator";

describe("calculateFamilyReunification", () => {
  it("S.L. 217.06 uses the NSO 2025 average gross wage + 20% per member", () => {
    const result = calculateFamilyReunification({
      familyMemberCount: 1,
      scheme: "family-reunification",
    });
    expect(WAGE_DATA.averageWageGross).toBe(25_730);
    expect(result.minimumRequired).toBeCloseTo(30_876, 0);
    expect(result.incomeType).toBe("gross");
  });

  it("S.L. 217.06 for spouse + 2 children", () => {
    const result = calculateFamilyReunification({
      familyMemberCount: 3,
      scheme: "family-reunification",
    });
    expect(result.minimumRequired).toBeCloseTo(41_168, 0);
  });

  it("Family Member Policy defaults to Identità's €18,940 median", () => {
    const result = calculateFamilyReunification({
      familyMemberCount: 1,
      scheme: "family-member-policy",
    });
    expect(result.minimumRequired).toBeCloseTo(22_728, 0);
    expect(result.incomeType).toBe("net");
  });

  it("Family Member Policy projection uses the NSO 2025 median", () => {
    const result = calculateFamilyReunification({
      familyMemberCount: 2,
      scheme: "family-member-policy",
      medianBasis: "nso-latest",
    });
    // 22,266 × 1.4
    expect(result.minimumRequired).toBeCloseTo(31_172.4, 1);
  });
});

describe("calculateKeiThreshold", () => {
  it("is €50,000 for one dependant and +€6,000 per extra", () => {
    expect(calculateKeiThreshold(1)).toBe(50_000);
    expect(calculateKeiThreshold(3)).toBe(62_000);
  });
});

describe("estimateAnnualNet", () => {
  it("returns less than gross for a typical salary", () => {
    const net = estimateAnnualNet(30_000);
    expect(net).toBeGreaterThan(20_000);
    expect(net).toBeLessThan(30_000);
  });

  it("returns 0 for no salary", () => {
    expect(estimateAnnualNet(0)).toBe(0);
  });
});

describe("getEligibility", () => {
  it("single permit holder after 6 months waits 6 more for FMP and 18 for S.L. 217.06", () => {
    const routes = getEligibility({
      permitType: "single-permit",
      monthsResident: 6,
      familyMemberCount: 1,
    });
    const fmp = routes.find((r) => r.route === "family-member-policy");
    const fr = routes.find((r) => r.route === "family-reunification");
    expect(fmp?.monthsRemaining).toBe(6);
    expect(fr?.monthsRemaining).toBe(18);
    expect(routes.some((r) => r.route === "kei-sei-fast-track")).toBe(false);
    expect(fmp?.meetsIncome).toBeUndefined();
  });

  it("KEI holder can use the fast-track immediately when earning €50,000+", () => {
    const routes = getEligibility({
      permitType: "kei",
      monthsResident: 0,
      familyMemberCount: 1,
      grossAnnualSalary: 55_000,
    });
    const fast = routes.find((r) => r.route === "kei-sei-fast-track");
    expect(fast?.monthsRemaining).toBe(0);
    expect(fast?.meetsIncome).toBe(true);
  });

  it("SEI holder on €30,000 does not meet the fast-track threshold", () => {
    const routes = getEligibility({
      permitType: "sei",
      monthsResident: 0,
      familyMemberCount: 2,
      grossAnnualSalary: 30_000,
    });
    const fast = routes.find((r) => r.route === "kei-sei-fast-track");
    expect(fast?.requiredIncome).toBe(56_000);
    expect(fast?.meetsIncome).toBe(false);
  });

  it("Blue Card holder has no waiting period", () => {
    const routes = getEligibility({
      permitType: "blue-card",
      monthsResident: 0,
      familyMemberCount: 1,
    });
    expect(routes[0].route).toBe("blue-card");
    expect(routes[0].monthsRemaining).toBe(0);
  });

  it("tests the Family Member Policy against estimated net income", () => {
    const routes = getEligibility({
      permitType: "single-permit",
      monthsResident: 24,
      familyMemberCount: 1,
      grossAnnualSalary: 32_000,
    });
    const fmp = routes.find((r) => r.route === "family-member-policy");
    const fr = routes.find((r) => r.route === "family-reunification");
    expect(fmp?.comparedIncome).toBeLessThan(32_000);
    expect(fmp?.meetsIncome).toBe(true);
    expect(fr?.meetsIncome).toBe(true);
    expect(fr?.monthsRemaining).toBe(0);
  });
});
