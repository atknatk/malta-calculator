/**
 * Yıllık vergi yardımcısı — dilim sınırları. Dilimler tam sayı sınırlı
 * (16.000 / 16.001); aradaki küsuratlı gelir son dilime (%35) düşmemeli.
 */

import { describe, it, expect } from "vitest";
import { calculateAdditionalTax, calculateAnnualTax } from "./annual-tax";

describe("calculateAnnualTax — küsuratlı gelir", () => {
  it("iki dilim arasındaki gelir üst dilimden vergilenir", () => {
    // 16000.50 × 0.25 − 3400
    const single = calculateAnnualTax(16000.5, 2026, "single");
    expect(single.tax).toBe(600.13);
    expect(single.marginalRate).toBe(0.25);

    // 23000.50 × 0.25 − 4550
    expect(calculateAnnualTax(23000.5, 2026, "married").tax).toBe(1200.13);
  });

  it("tam sayı sınırlarda sonuç değişmez", () => {
    expect(calculateAnnualTax(16000, 2026, "single")).toMatchObject({
      tax: 600,
      marginalRate: 0.15,
    });
    expect(calculateAnnualTax(16001, 2026, "single")).toMatchObject({
      tax: 600.25,
      marginalRate: 0.25,
    });
  });

  it("sınırı küsuratla aşan ek gelirin vergisi sıfırlanmaz", () => {
    // 15999.50 + 1 = 16000.50: 600.13 − (15999.50 × 0.15 − 1800)
    const r = calculateAdditionalTax(15999.5, 1, 2026, "single");
    expect(r.tax).toBeCloseTo(0.2, 1);
    expect(r.marginalRate).toBe(0.25);
  });
});
