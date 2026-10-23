/**
 * Registration tax testleri — Transport Malta SOPV 02 v38 (Ocak 2026).
 */

import { describe, it, expect } from "vitest";
import {
  calculateM1RegistrationTax,
  getCo2RatePercent,
  getLengthRatePercent,
  getNonEuMinimumTax,
} from "./malta-registration-tax";
import { calculateImportVehicle } from "./import-vehicle-calculator";
import { calculateVRT } from "./vrt-calculator";

describe("SOPV 02 rate tables", () => {
  it("WLTP band boundaries", () => {
    expect(getCo2RatePercent(120, "wltp", 0)).toBe(0.04);
    expect(getCo2RatePercent(121, "wltp", 0)).toBe(0.045);
    expect(getCo2RatePercent(261, "wltp", 0)).toBe(0.143);
  });

  it("NEDC columns by Euro standard", () => {
    expect(getCo2RatePercent(130, "nedc", 0)).toBe(0.09); // Euro 6
    expect(getCo2RatePercent(130, "nedc", 1)).toBe(0.17); // Euro 5
    expect(getCo2RatePercent(300, "nedc", 3)).toBe(0.47);
    // PM > 0.005 dizel, Euro 4 (latest-2)
    expect(getCo2RatePercent(130, "nedc", 2, true)).toBe(0.36);
  });

  it("length bands", () => {
    expect(getLengthRatePercent(3450)).toBe(0.002);
    expect(getLengthRatePercent(4280)).toBe(0.0028);
    expect(getLengthRatePercent(4771)).toBe(0.0034);
  });
});

describe("calculateM1RegistrationTax", () => {
  it("WLTP petrol: 130 g/km, 4,280 mm, RV €18,000", () => {
    const r = calculateM1RegistrationTax({
      co2: 130,
      lengthMm: 4280,
      registrationValue: 18000,
      fuelType: "petrol",
      testCycle: "wltp",
      euroGap: 0,
    });
    expect(r.co2Tax).toBe(1053); // 130 × 18000 × 0.045%
    expect(r.lengthTax).toBe(2157); // 4280 × 18000 × 0.0028%
    expect(r.total).toBe(3210);
  });

  it("hybrid CO2 reduced by 30%", () => {
    const r = calculateM1RegistrationTax({
      co2: 150,
      lengthMm: 4000,
      registrationValue: 20000,
      fuelType: "hybrid",
      testCycle: "wltp",
      euroGap: 0,
    });
    expect(r.adjustedCo2).toBe(105);
    expect(r.co2RatePercent).toBe(0.04);
  });

  it("BEV and PHEV are exempt", () => {
    for (const fuelType of ["electric", "plugin_hybrid"] as const) {
      const r = calculateM1RegistrationTax({
        co2: 30,
        lengthMm: 4700,
        registrationValue: 50000,
        fuelType,
        testCycle: "wltp",
        euroGap: 0,
      });
      expect(r.exempt).toBe(true);
      expect(r.total).toBe(0);
    }
  });
});

describe("non-EU minimum tax", () => {
  it("only applies above 5 years", () => {
    expect(getNonEuMinimumTax(120, 5)).toBe(0);
    expect(getNonEuMinimumTax(120, 6)).toBe(1100);
    expect(getNonEuMinimumTax(120, 10)).toBe(3172);
    expect(getNonEuMinimumTax(300, 20)).toBe(37437);
  });
});

describe("calculateImportVehicle", () => {
  const year = new Date().getFullYear();

  it("EU used car: no duty, no VAT, no VAT on reg tax; €15 + €70 fees", () => {
    const r = calculateImportVehicle({
      purchasePrice: 18000,
      currency: "EUR",
      modelYear: year - 3,
      co2Emissions: 130,
      co2TestCycle: "wltp",
      lengthMm: 4280,
      fuelType: "petrol",
      isEU: true,
      shippingCost: 300,
      isNew: false,
    });
    expect(r.importDuty).toBe(0);
    expect(r.vatOnCustoms).toBe(0);
    expect(r.registrationTax).toBe(3210);
    expect(r.vrtFee).toBe(0);
    expect(r.inspectionFee).toBe(0);
    expect(r.totalTaxesFees).toBe(3210 + 15 + 70);
  });

  it("non-EU used car over 5 years pays at least the minimum tax", () => {
    const r = calculateImportVehicle({
      purchasePrice: 3000,
      currency: "EUR",
      modelYear: year - 10,
      co2Emissions: 120,
      co2TestCycle: "nedc",
      lengthMm: 4000,
      fuelType: "petrol",
      isEU: false,
      shippingCost: 1000,
      isNew: false,
    });
    expect(r.minimumTaxApplied).toBe(true);
    expect(r.registrationTax).toBe(3172);
    expect(r.inspectionFee).toBe(55);
    expect(r.vrtRequired).toBe(true);
    // Gümrük + KDV CIF üzerinden; reg tax'a KDV yok
    expect(r.importDuty).toBe(400);
    expect(r.vatOnCustoms).toBe(792);
  });

  it("new BEV grant: €6,000 above €40,000, +€1,000 scrappage", () => {
    const r = calculateImportVehicle({
      purchasePrice: 45000,
      currency: "EUR",
      modelYear: year,
      co2Emissions: 0,
      lengthMm: 4720,
      fuelType: "electric",
      isEU: true,
      shippingCost: 200,
      isNew: true,
      applyEvGrant: true,
      evGrantWithScrappage: true,
    });
    expect(r.registrationTax).toBe(0);
    expect(r.vatOnCustoms).toBe(8136);
    expect(r.evGrant).toBe(7000);
  });

  it("vintage 50+ years pays 0% registration tax", () => {
    const r = calculateImportVehicle({
      purchasePrice: 20000,
      currency: "EUR",
      modelYear: year - 55,
      co2Emissions: 300,
      lengthMm: 4500,
      fuelType: "petrol",
      isEU: true,
      shippingCost: 0,
      isNew: false,
    });
    expect(r.vintageFullExemption).toBe(true);
    expect(r.registrationTax).toBe(0);
  });
});

describe("calculateVRT (S.L. 65.15)", () => {
  it("car: €30.27, re-test 50%, every 2 years after year 4", () => {
    const r = calculateVRT({
      vehicleType: "car",
      vehicleAge: 6,
      isRetest: false,
    });
    expect(r.testFee).toBe(30.27);
    expect(r.retestFee).toBe(15.14);
    expect(r.nextTestDue).toBe(24);
  });

  it("car over 160,000 km: annual", () => {
    const r = calculateVRT({
      vehicleType: "car",
      vehicleAge: 6,
      isRetest: false,
      mileageKm: 170000,
    });
    expect(r.nextTestDue).toBe(12);
  });

  it("new car: first test at 4 years", () => {
    const r = calculateVRT({
      vehicleType: "car",
      vehicleAge: 1,
      isRetest: false,
    });
    expect(r.nextTestDue).toBe(36);
  });
});
