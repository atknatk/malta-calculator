/**
 * First-time buyer teşvik paketi testleri (2026).
 */

import { describe, it, expect } from "vitest";
import { calculateFirstTimeBuyer } from "./first-time-buyer-calculator";

describe("calculateFirstTimeBuyer", () => {
  it("exempts the first €200,000 and charges 5% on the rest", () => {
    const r = calculateFirstTimeBuyer({
      propertyPrice: 300000,
      isUCAOrVacant: false,
      isGozo: false,
      withBankLoan: true,
    });
    expect(r.exemptAmount).toBe(200000);
    expect(r.stampDutyDue).toBe(5000); // 100k × 5%
    expect(r.stampDutySaved).toBe(10000); // 200k × 5%
  });

  it("pays no duty when the price is within the exemption", () => {
    const r = calculateFirstTimeBuyer({
      propertyPrice: 180000,
      isUCAOrVacant: false,
      isGozo: false,
      withBankLoan: true,
    });
    expect(r.stampDutyDue).toBe(0);
    expect(r.stampDutySaved).toBe(9000);
  });

  it("includes the €10,000 grant only with a bank loan", () => {
    const withLoan = calculateFirstTimeBuyer({
      propertyPrice: 250000,
      isUCAOrVacant: false,
      isGozo: false,
      withBankLoan: true,
    });
    const cash = calculateFirstTimeBuyer({
      propertyPrice: 250000,
      isUCAOrVacant: false,
      isGozo: false,
      withBankLoan: false,
    });
    expect(withLoan.ftbGrant).toBe(10000);
    expect(withLoan.ftbGrantPerYear).toBe(1000);
    expect(cash.ftbGrant).toBe(0);
  });

  it("extends the exemption to €750,000 for UCA properties and adds the grant", () => {
    const r = calculateFirstTimeBuyer({
      propertyPrice: 500000,
      isUCAOrVacant: true,
      isGozo: false,
      withBankLoan: true,
    });
    expect(r.stampDutyDue).toBe(0); // 500k < 750k muafiyet
    expect(r.stampDutySaved).toBe(25000);
    expect(r.ucaGrant).toBe(15000);
    expect(r.totalBenefits).toBe(50000); // 25000 + 10000 + 15000
  });

  it("doubles the UCA grant in Gozo", () => {
    const r = calculateFirstTimeBuyer({
      propertyPrice: 400000,
      isUCAOrVacant: true,
      isGozo: true,
      withBankLoan: true,
    });
    expect(r.ucaGrant).toBe(30000);
  });

  it("flags deposit scheme eligibility up to €250,000", () => {
    expect(
      calculateFirstTimeBuyer({
        propertyPrice: 240000,
        isUCAOrVacant: false,
        isGozo: false,
        withBankLoan: true,
      }).depositSchemeEligible,
    ).toBe(true);
    expect(
      calculateFirstTimeBuyer({
        propertyPrice: 260000,
        isUCAOrVacant: false,
        isGozo: false,
        withBankLoan: true,
      }).depositSchemeEligible,
    ).toBe(false);
  });
});
