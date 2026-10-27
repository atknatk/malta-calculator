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
  it("renewal adds only the €400 infrastructure contribution", () => {
    const r = calculateTcnBudget2027(base);
    expect(r.totalExtraYearly).toBe(400);
    expect(r.employerShare).toBe(0);
  });

  it("new application adds €200 fee increase (employer) plus €400", () => {
    const r = calculateTcnBudget2027({ ...base, permitAction: "new" });
    expect(r.totalExtraYearly).toBe(600);
    expect(r.employerShare).toBe(200);
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
    // 800 + 396 + 150 + 4800
    expect(r.totalExtraYearly).toBe(6146);
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
