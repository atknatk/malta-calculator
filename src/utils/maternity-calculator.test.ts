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
    expect(r.last4WeeksPay).toBe(917.76); // 229.44 × 4
    expect(r.totalPay).toBe(7917.76);
    // Kayıp: 18 hafta tam maaş 9000 − 7917.76
    expect(r.incomeLossVsFullSalary).toBe(1082.24);
  });

  it("pays a self-occupied mother €229.44 × 14 + MLB × 4", () => {
    const r = calculateMaternity({
      weeklyGrossSalary: 600,
      status: "selfOccupied",
    });
    expect(r.first14WeeklyRate).toBe(229.44);
    expect(r.first14WeeksPay).toBe(3212.16);
    expect(r.first14Source).toBe("government");
    expect(r.last4WeeksPay).toBe(917.76);
    expect(r.totalWeeks).toBe(18);
  });

  it("pays the flat €147.95 × 14 to those not entitled to employer leave", () => {
    const r = calculateMaternity({
      weeklyGrossSalary: 0,
      status: "notEntitled",
    });
    expect(r.totalWeeks).toBe(14);
    expect(r.first14WeeksPay).toBe(2071.3);
    expect(r.last4WeeksPay).toBe(0);
    expect(r.totalPay).toBe(2071.3);
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
    expect(r.totalPay).toBe(917.76);
    expect(r.incomeLossVsFullSalary).toBe(0);
  });
});
