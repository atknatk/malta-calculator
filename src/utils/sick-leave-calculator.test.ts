/**
 * Sick leave + sickness benefit 2026 senaryo testleri.
 */

import { describe, it, expect } from "vitest";
import { calculateSickLeave } from "./sick-leave-calculator";

describe("calculateSickLeave", () => {
  it("pays full wage during the employer period", () => {
    // 5 gün hasta, hak 10 gün → tamamı işverenden, benefit yok
    const r = calculateSickLeave({
      weeklyGrossSalary: 500,
      sickDays: 5,
      maritalStatus: "singleOrOther",
    });
    expect(r.employerDays).toBe(5);
    expect(r.employerPay).toBe(500);
    expect(r.benefitDays).toBe(0);
    expect(r.incomeLoss).toBe(0);
  });

  it("switches to sickness benefit after employer entitlement runs out", () => {
    // 20 gün hasta, 10 gün işveren → kalan 10 gün benefit (bekleme işverence karşılandı)
    const r = calculateSickLeave({
      weeklyGrossSalary: 500,
      sickDays: 20,
      maritalStatus: "singleOrOther",
    });
    expect(r.employerDays).toBe(10);
    expect(r.employerPay).toBe(1000);
    expect(r.unpaidWaitingDays).toBe(0);
    expect(r.benefitDays).toBe(10);
    expect(r.dailyBenefitRate).toBe(17.21);
    expect(r.benefitPay).toBe(172.1);
    expect(r.totalIncome).toBe(1172.1);
  });

  it("uses the higher married rate", () => {
    const r = calculateSickLeave({
      weeklyGrossSalary: 500,
      sickDays: 15,
      maritalStatus: "marriedMaintainingSpouse",
    });
    expect(r.dailyBenefitRate).toBe(25.81);
    expect(r.benefitPay).toBe(129.05); // 5 gün × 25.81
  });

  it("applies 3 waiting days when there is no employer entitlement", () => {
    const r = calculateSickLeave({
      weeklyGrossSalary: 500,
      sickDays: 10,
      maritalStatus: "singleOrOther",
      employerPaidDays: 0,
    });
    expect(r.employerDays).toBe(0);
    expect(r.unpaidWaitingDays).toBe(3);
    expect(r.benefitDays).toBe(7);
  });

  it("respects a custom WRO employer entitlement", () => {
    // Örn. klerikal WRO: 20 gün tam maaş
    const r = calculateSickLeave({
      weeklyGrossSalary: 600,
      sickDays: 25,
      maritalStatus: "singleOrOther",
      employerPaidDays: 20,
    });
    expect(r.employerDays).toBe(20);
    expect(r.employerPay).toBe(2400);
    expect(r.benefitDays).toBe(5);
  });

  it("caps benefit days at 156 per year", () => {
    const r = calculateSickLeave({
      weeklyGrossSalary: 500,
      sickDays: 200,
      maritalStatus: "singleOrOther",
      employerPaidDays: 10,
    });
    expect(r.benefitDays).toBe(156);
    expect(r.exceedsAnnualCap).toBe(true);
  });

  it("handles zero days without NaN", () => {
    const r = calculateSickLeave({
      weeklyGrossSalary: 500,
      sickDays: 0,
      maritalStatus: "singleOrOther",
    });
    expect(r.totalIncome).toBe(0);
    expect(r.incomeLoss).toBe(0);
  });
});
