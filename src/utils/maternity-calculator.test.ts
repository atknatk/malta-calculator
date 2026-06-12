/**
 * Maternity/paternity 2026 senaryo testleri.
 */

import { describe, it, expect } from "vitest";
import { calculateMaternity } from "./maternity-calculator";

describe("calculateMaternity", () => {
  it("pays an employed mother 14 weeks full salary + 4 weeks MLB", () => {
    const r = calculateMaternity({
      weeklyGrossSalary: 500,
      status: "employed",
    });
    expect(r.totalWeeks).toBe(18);
    expect(r.first14WeeksPay).toBe(7000);
    expect(r.first14Source).toBe("employer");
    expect(r.last4WeeksPay).toBe(854.16); // 213.54 × 4
    expect(r.totalPay).toBe(7854.16);
    // Kayıp: 18 hafta tam maaş 9000 − 7854.16
    expect(r.incomeLossVsFullSalary).toBe(1145.84);
  });

  it("pays a self-occupied mother €221.78 × 14 + MLB × 4", () => {
    const r = calculateMaternity({
      weeklyGrossSalary: 600,
      status: "selfOccupied",
    });
    expect(r.first14WeeklyRate).toBe(221.78);
    expect(r.first14WeeksPay).toBe(3104.92);
    expect(r.first14Source).toBe("government");
    expect(r.last4WeeksPay).toBe(854.16);
    expect(r.totalWeeks).toBe(18);
  });

  it("pays the flat €140.29 × 14 to those not entitled to employer leave", () => {
    const r = calculateMaternity({
      weeklyGrossSalary: 0,
      status: "notEntitled",
    });
    expect(r.totalWeeks).toBe(14);
    expect(r.first14WeeksPay).toBe(1964.06);
    expect(r.last4WeeksPay).toBe(0);
    expect(r.totalPay).toBe(1964.06);
  });

  it("reports 10 working days of paternity leave", () => {
    const r = calculateMaternity({
      weeklyGrossSalary: 500,
      status: "employed",
    });
    expect(r.paternityDays).toBe(10);
  });

  it("handles zero salary without NaN", () => {
    const r = calculateMaternity({ weeklyGrossSalary: 0, status: "employed" });
    expect(r.totalPay).toBe(854.16);
    expect(r.incomeLossVsFullSalary).toBe(0);
  });
});
