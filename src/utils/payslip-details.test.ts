/**
 * Payslip yardımcı testleri.
 * Maternity Fund: haftalık tavan €559.31 × %0.3 = €1.68/hafta → 5 hafta €8.40
 */

import { describe, it, expect } from "vitest";
import {
  buildPayslipNumber,
  calculateEmployerContributions,
  calculateLeaveEntitlement,
  formatOrdinalDate,
  getLastWorkingDay,
} from "./payslip-details";

describe("getLastWorkingDay", () => {
  it("returns the last weekday of the month", () => {
    expect(getLastWorkingDay(2026, 10)).toBe("2026-10-30"); // 31 Ekim Cumartesi
    expect(getLastWorkingDay(2026, 5)).toBe("2026-05-29"); // 31 Mayıs Pazar
    expect(getLastWorkingDay(2026, 12)).toBe("2026-12-31"); // Perşembe
  });
});

describe("calculateEmployerContributions", () => {
  it("matches employee SSC and adds 0.3% maternity fund at the weekly cap", () => {
    const result = calculateEmployerContributions({
      sscEmployee: 279.65,
      sscBase: 559.31 * 5,
      sscWeeks: 5,
    });
    expect(result.sscEmployer).toBe(279.65);
    expect(result.maternityFund).toBe(8.4);
    expect(result.total).toBe(288.05);
  });

  it("returns zero maternity fund when no SSC is due", () => {
    const result = calculateEmployerContributions({
      sscEmployee: 0,
      sscBase: 0,
      sscWeeks: 0,
    });
    expect(result).toEqual({ sscEmployer: 0, maternityFund: 0, total: 0 });
  });
});

describe("calculateLeaveEntitlement", () => {
  it("gives the full statutory entitlement without a start date", () => {
    expect(calculateLeaveEntitlement(2026)).toBe(216);
  });

  it("pro-rates by days employed for a mid-year starter", () => {
    // 1 Ekim → 92 gün / 365
    expect(calculateLeaveEntitlement(2026, "2026-10-01")).toBeCloseTo(
      (216 * 92) / 365,
      2,
    );
  });

  it("ignores start dates from earlier years", () => {
    expect(calculateLeaveEntitlement(2026, "2024-03-15")).toBe(216);
  });
});

describe("buildPayslipNumber", () => {
  it("uses a letters-only company prefix", () => {
    expect(buildPayslipNumber("3D Labs Ltd", 2026, 3, "abcd1234")).toBe(
      "DLA-2026-03-ABCD",
    );
  });
});

describe("formatOrdinalDate", () => {
  it.each([
    ["2026-10-01", "1st Oct 2026"],
    ["2026-10-02", "2nd Oct 2026"],
    ["2026-10-11", "11th Oct 2026"],
    ["2026-10-22", "22nd Oct 2026"],
    ["2026-10-30", "30th Oct 2026"],
  ])("formats %s", (input, expected) => {
    expect(formatOrdinalDate(input)).toBe(expected);
  });
});
