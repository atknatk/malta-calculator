import { describe, expect, it } from "vitest";
import {
  calculateTcnBudget2027,
  type TcnBudget2027Input,
} from "./tcn-budget-2027-calculator";

const base: TcnBudget2027Input = {
  status: "tcn",
  permitAction: "renewal",
  permitHolders: 1,
  usesPublicTransport: false,
  monthlyTransportCost: 33,
  drives: false,
  drivingExempt: false,
  drivingMonths: 12,
  receivedAtypicalCheque: false,
  newChildcareChildren: 0,
  monthlyChildcareCost: 400,
  childcareMonths: 12,
};

describe("calculateTcnBudget2027", () => {
  it("renewal costs €150 fee + €400 contribution, €400 more than 2026", () => {
    const r = calculateTcnBudget2027(base);
    expect(r.totalYearly).toBe(550);
    expect(r.totalExtraYearly).toBe(400);
    expect(r.employerShare).toBe(150);
  });

  it("new application shows the full €800 fee plus €400", () => {
    const r = calculateTcnBudget2027({ ...base, permitAction: "new" });
    expect(r.items.find((i) => i.key === "permit")?.cost).toBe(800);
    expect(r.totalYearly).toBe(1200);
    expect(r.totalExtraYearly).toBe(600);
    expect(r.employerShare).toBe(800);
    expect(r.householdShare).toBe(400);
  });

  it("driving fee is €83 × months, €996 for a full year", () => {
    const r = calculateTcnBudget2027({ ...base, drives: true });
    expect(r.items.find((i) => i.key === "driving")?.extraCost).toBe(996);
  });

  it("driving-job exemption removes the licence fee", () => {
    const r = calculateTcnBudget2027({
      ...base,
      drives: true,
      drivingExempt: true,
    });
    expect(r.items.find((i) => i.key === "driving")).toBeUndefined();
  });

  it("adds transport, atypical cheque and childcare", () => {
    const r = calculateTcnBudget2027({
      ...base,
      permitHolders: 2,
      usesPublicTransport: true,
      receivedAtypicalCheque: true,
      newChildcareChildren: 1,
    });
    // 800 + 396 + 150 + 4800 (+ 2 × €150 yenileme ücreti, değişmedi)
    expect(r.totalExtraYearly).toBe(6146);
    expect(r.totalYearly).toBe(6446);
  });

  it("EU citizens and long-term residents are not affected", () => {
    expect(
      calculateTcnBudget2027({ ...base, status: "euCitizen" }).affected,
    ).toBe(false);
    expect(
      calculateTcnBudget2027({ ...base, status: "longTermResident" })
        .totalExtraYearly,
    ).toBe(0);
  });
});
