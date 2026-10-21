/**
 * Road licence testleri — Transport Malta SOPV 33 (v15, 1 Ocak 2026).
 */

import { describe, it, expect } from "vitest";
import {
  calculateRoadLicense,
  type RoadLicenseInput,
} from "./road-license-calculator";

const car: RoadLicenseInput = {
  vehicleType: "car",
  fuelType: "petrol",
  manufactureYear: 2021,
  registeredBefore2009: false,
  engineCapacity: 1400,
  co2Emissions: 140,
  co2Standard: "nedc",
  licenceYear: 2026,
};

describe("calculateRoadLicense", () => {
  it("uses the NEDC CO2 band and age for post-2009 cars", () => {
    expect(calculateRoadLicense(car).annualFee).toBe(170); // 131-140, yaş 5
    expect(
      calculateRoadLicense({ ...car, manufactureYear: 2006, co2Emissions: 260 })
        .annualFee,
    ).toBe(1125); // >250, yaş 14+
  });

  it("uses wider WLTP bands", () => {
    expect(
      calculateRoadLicense({
        ...car,
        co2Standard: "wltp",
        manufactureYear: 2024,
        co2Emissions: 130,
      }).annualFee,
    ).toBe(125); // 126-175 WLTP, yaş 2
  });

  it("uses engine capacity for cars registered before 2009", () => {
    const pre = { ...car, registeredBefore2009: true, manufactureYear: 2006 };
    expect(
      calculateRoadLicense({ ...pre, engineCapacity: 1600 }).annualFee,
    ).toBe(232);
    expect(
      calculateRoadLicense({
        ...pre,
        fuelType: "diesel",
        manufactureYear: 2019,
        engineCapacity: 2200,
      }).annualFee,
    ).toBe(489);
  });

  it("charges EVs nothing for years 0-5 and €10 after", () => {
    const ev = { ...car, fuelType: "electric" as const };
    expect(
      calculateRoadLicense({ ...ev, manufactureYear: 2021 }).annualFee,
    ).toBe(0);
    expect(
      calculateRoadLicense({ ...ev, manufactureYear: 2020 }).annualFee,
    ).toBe(10);
  });

  it("charges motorcycles by engine capacity", () => {
    expect(
      calculateRoadLicense({
        ...car,
        vehicleType: "motorcycle",
        manufactureYear: 2020,
        engineCapacity: 600,
      }).annualFee,
    ).toBe(91);
  });
});
