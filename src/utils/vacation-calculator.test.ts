/**
 * Yıllık izin testleri.
 * 192 saat + hafta sonuna denk gelen resmi tatil başına 8 saat.
 * 2024 → 240 saat, 2025 → 224 saat (CC Malta), 2026 → 216 saat (PwC)
 */

import { describe, it, expect } from "vitest";
import {
  calculateVacationLeave,
  getPublicHolidayInfo,
} from "./vacation-calculator";

describe("calculateVacationLeave", () => {
  it.each([
    [2024, 6, 240],
    [2025, 4, 224],
    [2026, 3, 216],
    [2027, 3, 216],
  ])("counts weekend public holidays for %i", (year, count, hours) => {
    expect(getPublicHolidayInfo(year).count).toBe(count);
    expect(calculateVacationLeave({ weeklyHours: 40, year }).totalHours).toBe(
      hours,
    );
  });

  it("pro-rates part-time entitlement", () => {
    const r = calculateVacationLeave({ weeklyHours: 20, year: 2026 });
    expect(r.totalHours).toBe(108);
  });
});
