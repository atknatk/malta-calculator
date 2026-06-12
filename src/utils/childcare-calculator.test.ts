/**
 * Free Childcare Scheme saat hakkı testleri (2026).
 */

import { describe, it, expect } from "vitest";
import { calculateChildcare } from "./childcare-calculator";

describe("calculateChildcare", () => {
  it("computes monthly hours from the brochure example (20h/week)", () => {
    const r = calculateChildcare({
      singleParent: true,
      parent1: { activity: "working", weeklyHours: 20 },
    });
    expect(r.eligible).toBe(true);
    // 20 × 52/12 = 86.7 aylık; +%10 = 8.7; +20 yol
    expect(r.baseMonthlyHours).toBe(86.7);
    expect(r.contingencyHours).toBe(8.7);
    expect(r.commuteHours).toBe(20);
    expect(r.totalMonthlyHours).toBe(115.4);
  });

  it("uses the lower-hour parent for couples", () => {
    const r = calculateChildcare({
      singleParent: false,
      parent1: { activity: "working", weeklyHours: 40 },
      parent2: { activity: "working", weeklyHours: 25 },
    });
    expect(r.baseWeeklyHours).toBe(25);
  });

  it("counts a full-time student as 40 hours and part-time as 20", () => {
    const ft = calculateChildcare({
      singleParent: false,
      parent1: { activity: "working", weeklyHours: 45 },
      parent2: { activity: "fullTimeStudent" },
    });
    expect(ft.baseWeeklyHours).toBe(40);

    const pt = calculateChildcare({
      singleParent: false,
      parent1: { activity: "working", weeklyHours: 45 },
      parent2: { activity: "partTimeStudent" },
    });
    expect(pt.baseWeeklyHours).toBe(20);
  });

  it("is ineligible when one parent of a couple is not working or studying", () => {
    const r = calculateChildcare({
      singleParent: false,
      parent1: { activity: "working", weeklyHours: 40 },
      parent2: { activity: "notWorking" },
    });
    expect(r.eligible).toBe(false);
    expect(r.taxRebateAlternative).toBe(2000);
  });

  it("estimates the annual value with a user-provided hourly rate", () => {
    const r = calculateChildcare({
      singleParent: true,
      parent1: { activity: "working", weeklyHours: 40 },
      privateHourlyRate: 5,
    });
    // 40×52/12 = 173.3; +17.3; +20 = 210.6 aylık; ×12×5
    expect(r.totalMonthlyHours).toBe(210.6);
    expect(r.estimatedAnnualValue).toBe(12636);
  });

  it("handles zero hours as ineligible", () => {
    const r = calculateChildcare({
      singleParent: true,
      parent1: { activity: "working", weeklyHours: 0 },
    });
    expect(r.eligible).toBe(false);
  });
});
