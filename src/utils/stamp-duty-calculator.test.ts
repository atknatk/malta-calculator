/**
 * Damga vergisi testleri (Cap. 364).
 * Standart %5; first-time buyer ilk €200.000 muaf; ana konut (owner-occupier) ilk €200.000 %3,5
 */

import { describe, it, expect } from "vitest";
import { calculateStampDuty } from "./stamp-duty-calculator";

describe("calculateStampDuty", () => {
  it("charges 5% on the full value for standard buyers", () => {
    expect(
      calculateStampDuty({ propertyPrice: 350000, buyerType: "standard" })
        .stampDuty,
    ).toBe(17500);
  });

  it("exempts the first €200,000 for first-time buyers", () => {
    const r = calculateStampDuty({
      propertyPrice: 350000,
      buyerType: "first_time",
    });
    expect(r.stampDuty).toBe(7500);
    expect(r.savings).toBe(10000);
  });

  it("charges 3.5% on the first €200,000 for main residence buyers", () => {
    const r = calculateStampDuty({
      propertyPrice: 350000,
      buyerType: "owner_occupier",
    });
    expect(r.stampDuty).toBe(14500);
    expect(r.reducedRateAmount).toBe(200000);
    expect(r.savings).toBe(3000);
  });
});
