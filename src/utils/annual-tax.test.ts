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

describe("calculateAnnualTax — Budget 2027 aile dilimleri", () => {
  it("bütçede yayımlanan örneklerle eşleşir", () => {
    // CSB: parent 2+ @ €42.000 → 2026 €5.175, 2027 €3.550
    expect(calculateAnnualTax(42000, 2026, "parent", 2).tax).toBe(5175);
    expect(calculateAnnualTax(42000, 2027, "parent", 2).tax).toBe(3550);
    // RSM: €30.000 için 2027 vergisi
    expect(calculateAnnualTax(30000, 2027, "parent", 1).tax).toBe(2650);
    expect(calculateAnnualTax(30000, 2027, "parent", 2).tax).toBe(900);
    expect(calculateAnnualTax(30000, 2027, "married", 1).tax).toBe(1500);
    expect(calculateAnnualTax(30000, 2027, "married", 2).tax).toBe(0);
  });

  it("çocuksuz kategoriler 2026 ile aynı kalır", () => {
    for (const type of ["single", "married", "parent"] as const) {
      expect(calculateAnnualTax(45000, 2027, type).tax).toBe(
        calculateAnnualTax(45000, 2026, type).tax,
      );
    }
  });

  it("azami tasarruf 2025 married/parent'a göre bütçe rakamlarıyla aynı", () => {
    // €100.000'de fark = 35% dilim indirim farkı
    const married2025 = calculateAnnualTax(100000, 2025, "married").tax;
    const parent2025 = calculateAnnualTax(100000, 2025, "parent").tax;
    expect(
      married2025 - calculateAnnualTax(100000, 2027, "married", 1).tax,
    ).toBe(1450);
    expect(
      married2025 - calculateAnnualTax(100000, 2027, "married", 2).tax,
    ).toBe(4050);
    expect(parent2025 - calculateAnnualTax(100000, 2027, "parent", 1).tax).toBe(
      1150,
    );
    expect(parent2025 - calculateAnnualTax(100000, 2027, "parent", 2).tax).toBe(
      3250,
    );
  });
});
