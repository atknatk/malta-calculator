/**
 * Two-Thirds pension testleri (DSS 2026).
 * MPI: €29.083 (1962+), €25.500 (1962 öncesi)
 * Erteleme: %6,5 / %13,5 / %21 / %29
 * Çocuk kredisi: 1962+ ilk 3 çocuk 4 yıl, 4.'den itibaren 2 yıl; 1962 öncesi 2 / 1 yıl
 */

import { describe, it, expect } from "vitest";
import {
  calculatePension,
  getChildCredits,
  getDeferralBonusRate,
  getMPI,
} from "./pension-calculator";

const base = {
  taxStatus: "single" as const,
  children: 0,
  paidYears: 42,
  averageSalary: 40000,
  deferralYears: 0 as const,
  privatePensionContribution: 0,
};

describe("pension calculator", () => {
  it("uses the birth-year specific MPI", () => {
    expect(getMPI(1960)).toBe(25500);
    expect(getMPI(1970)).toBe(29083);
    expect(
      calculatePension({ ...base, birthYear: 1960 }).pensionableIncome,
    ).toBe(25500);
    expect(
      calculatePension({ ...base, birthYear: 1980 }).pensionableIncome,
    ).toBe(29083);
  });

  it("applies the DSS deferral schedule", () => {
    expect([0, 1, 2, 3, 4].map((y) => getDeferralBonusRate(y as 0))).toEqual([
      0, 0.065, 0.135, 0.21, 0.29,
    ]);
  });

  it("counts child credits beyond the third child", () => {
    expect(getChildCredits(1970, 3)).toBe(12);
    expect(getChildCredits(1970, 5)).toBe(16);
    expect(getChildCredits(1960, 3)).toBe(6);
    expect(getChildCredits(1960, 4)).toBe(7);
  });

  it("has no add-on to a newly awarded pension beyond 2/3 of MPI", () => {
    const r = calculatePension({ ...base, birthYear: 1980 });
    expect(r.annualPension).toBeCloseTo((29083 * 2) / 3, 2);
  });

  it("requires 30 years if born before 1952 and 42 years from 1976", () => {
    expect(calculatePension({ ...base, birthYear: 1950 }).requiredYears).toBe(
      30,
    );
    expect(calculatePension({ ...base, birthYear: 1976 }).requiredYears).toBe(
      42,
    );
  });

  it("caps deferral at pension age and needs full contributions", () => {
    // 1954 doğumlu: emeklilik yaşı 62 → en fazla 1 yıl erteleme
    const capped = calculatePension({
      ...base,
      birthYear: 1954,
      deferralYears: 4,
    });
    expect(capped.appliedDeferralYears).toBe(1);
    expect(capped.deferralBonusRate).toBe(0.065);
    // Eksik katkı → erken emeklilik yok → erteleme artışı yok
    const short = calculatePension({
      ...base,
      birthYear: 1980,
      paidYears: 30,
      deferralYears: 4,
    });
    expect(short.deferralBonusRate).toBe(0);
    const full = calculatePension({
      ...base,
      birthYear: 1980,
      deferralYears: 4,
    });
    expect(full.deferralBonusRate).toBe(0.29);
  });
});
