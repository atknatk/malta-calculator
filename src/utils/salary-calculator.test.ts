/**
 * Maaş hesaplayıcı — yıl ortası işe başlama, kıst ay ve önceki işveren (FS3)
 * senaryoları. FSS Main Method kümülatif hesap: dönem no = takvim ayı.
 */

import { describe, it, expect } from "vitest";
import {
  calculateMonthlyDeductions,
  calculateYearEndTaxPosition,
  summarizeMonthlyDeductions,
  parseDateOnly,
  buildEmploymentConfig,
} from "./salary-calculator";
import {
  Month,
  type MonthlySalaryInput,
  type SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";

function monthlyInputs(annualSalary: number): MonthlySalaryInput[] {
  return Object.values(Month).map((month) => ({
    month,
    grossWage: Number((annualSalary / 12).toFixed(2)),
  }));
}

function config(
  overrides: Partial<SalaryCalculatorConfig> = {},
): SalaryCalculatorConfig {
  return {
    year: 2026,
    taxRateType: "single",
    simpleTaxType: "single",
    childCount: 0,
    sscCategory: "C",
    birthDate: new Date(1990, 0, 1),
    yearlyNonTaxBenefit: 0,
    yearlyTaxableBenefit: 0,
    enableCOLA: true,
    ...overrides,
  };
}

const sum = (values: number[]): number =>
  Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100;

describe("calculateMonthlyDeductions — tam yıl", () => {
  it("başlangıç tarihi yoksa tüm yıl çalışılmış sayılır ve COLA tam ödenir", () => {
    const data = calculateMonthlyDeductions(monthlyInputs(30000), config());

    expect(data.every((d) => d.employmentRatio === 1)).toBe(true);
    expect(data[2].governmentBonus).toBe(121.16); // Mart
    expect(data[5].governmentBonus).toBe(135.1); // Haziran
    expect(sum(data.map((d) => d.incomeTax))).toBe(4228.16);

    const position = calculateYearEndTaxPosition(data, config());
    expect(Math.abs(position.balance)).toBeLessThan(0.05);
  });
});

describe("calculateMonthlyDeductions — yıl ortası işe başlama", () => {
  it("21 Ekim girişte Ekim kıst, önceki aylar boş, SSC çalışılan haftaya göre", () => {
    const cfg = config({ employmentStartDate: new Date(2026, 9, 21) });
    const data = calculateMonthlyDeductions(monthlyInputs(30000), cfg);

    for (const row of data.slice(0, 9)) {
      expect(row.employmentRatio).toBe(0);
      expect(row.grossTotal).toBe(0);
      expect(row.sscTax).toBe(0);
      expect(row.incomeTax).toBe(0);
    }

    const october = data[9];
    // 21–31 Ekim = 11/31 gün
    expect(october.employmentRatio).toBeCloseTo(11 / 31, 4);
    expect(october.basicSalary).toBe(887.1);
    // 21 Ekim 2026 Çarşamba → dönemdeki tek Pazartesi 26 Ekim: 1 hafta
    expect(october.sscTax).toBe(55.93);

    // Aralık statutory bonus: Tem–Ara (184 gün) içinde 72 gün çalışıldı
    expect(data[11].governmentBonus).toBe(52.87);

    // ~€5.9k gerçek gelir 0% diliminde → vergi yok
    expect(sum(data.map((d) => d.incomeTax))).toBe(0);

    const summary = summarizeMonthlyDeductions(data)!;
    expect(summary.monthsWorked).toBe(3);
    expect(summary.monthly.gross).toBeCloseTo(summary.annual.gross / 3, 6);
  });

  it("Temmuz girişte tam yıl gibi vergi kesilmez; kesinti gerçek yıllık vergiye eşit", () => {
    const fullYear = calculateMonthlyDeductions(monthlyInputs(60000), config());
    const cfg = config({ employmentStartDate: new Date(2026, 6, 1) });
    const halfYear = calculateMonthlyDeductions(monthlyInputs(60000), cfg);

    const fullYearJulyTax = fullYear[6].incomeTax;
    const halfYearJulyTax = halfYear[6].incomeTax;
    expect(halfYearJulyTax).toBeLessThan(fullYearJulyTax);

    const halfYearTax = sum(halfYear.map((d) => d.incomeTax));
    const position = calculateYearEndTaxPosition(halfYear, cfg);
    expect(halfYearTax).toBeCloseTo(position.annualTaxLiability, 1);
    expect(halfYearTax).toBeLessThan(
      sum(fullYear.slice(6).map((d) => d.incomeTax)),
    );
  });

  it("işten ayrılınca sonraki aylar boş kalır ve fazla kesinti iade olarak görünür", () => {
    const cfg = config({ employmentEndDate: new Date(2026, 5, 30) });
    const data = calculateMonthlyDeductions(monthlyInputs(30000), cfg);

    expect(data.slice(6).every((d) => d.grossTotal === 0)).toBe(true);
    const position = calculateYearEndTaxPosition(data, cfg);
    expect(position.balance).toBeLessThan(0);
  });
});

describe("calculateMonthlyDeductions — önceki işveren (FS3)", () => {
  it("önceki matrah ve vergi kümülatife eklenir, toplam kesinti yıllık vergiye eşitlenir", () => {
    const cfg = config({
      simpleTaxType: "parent",
      childCount: 1,
      employmentStartDate: new Date(2026, 5, 1),
      previousEmployment: { taxableIncome: 11500, taxPaid: 1000 },
    });
    const data = calculateMonthlyDeductions(monthlyInputs(30000), cfg);

    const june = data[5];
    expect(june.cumulativeIncomeBase).toBeCloseTo(11500 + june.incomeBase, 2);
    expect(june.cumulativeTax).toBeCloseTo(1000 + june.incomeTax, 2);

    const position = calculateYearEndTaxPosition(data, cfg);
    expect(position.annualTaxableIncome).toBeCloseTo(
      11500 + sum(data.map((d) => d.incomeBase)),
      2,
    );
    expect(Math.abs(position.balance)).toBeLessThan(0.05);
  });

  it("önceki işverende fazla vergi ödendiyse bu işverende kesinti yapılmaz", () => {
    const cfg = config({
      employmentStartDate: new Date(2026, 8, 1),
      previousEmployment: { taxableIncome: 8000, taxPaid: 3000 },
    });
    const data = calculateMonthlyDeductions(monthlyInputs(24000), cfg);

    expect(sum(data.map((d) => d.incomeTax))).toBe(0);
    expect(calculateYearEndTaxPosition(data, cfg).balance).toBeLessThan(0);
  });
});

describe("vergi dilimi sınırları — küsuratlı yıllık gelir", () => {
  // Dilimler tam sayı sınırlı (16000 / 16001); aradaki gelir %35'e düşmemeli
  it("iki dilim arasındaki gelir üst dilimden vergilenir", () => {
    const single = config({
      previousEmployment: { taxableIncome: 16000.5, taxPaid: 0 },
    });
    // 16000.50 × %25 − 3400
    expect(calculateYearEndTaxPosition([], single).annualTaxLiability).toBe(
      600.13,
    );

    const married = config({
      taxRateType: "married",
      simpleTaxType: "married",
      previousEmployment: { taxableIncome: 23000.5, taxPaid: 0 },
    });
    // 23000.50 × %25 − 4550
    expect(calculateYearEndTaxPosition([], married).annualTaxLiability).toBe(
      1200.13,
    );
  });

  it("aylık kesinti sınırın hemen üstündeki gelirle aynı dilimde kalır", () => {
    // 1333.375 × 12 = 16000.50 (ikili sistemde tam temsil edilir)
    const gap = calculateMonthlyDeductions(
      Object.values(Month).map((month) => ({ month, grossWage: 1333.375 })),
      config(),
    );
    // 1333.42 × 12 = 16001.04
    const above = calculateMonthlyDeductions(monthlyInputs(16001), config());

    const gapTax = sum(gap.map((d) => d.incomeTax));
    expect(gapTax).toBeGreaterThan(0);
    expect(Math.abs(gapTax - sum(above.map((d) => d.incomeTax)))).toBeLessThan(
      1,
    );
  });
});

describe("parseDateOnly", () => {
  it("YYYY-MM-DD metnini yerel tarihe çevirir", () => {
    const date = parseDateOnly("2026-10-21")!;
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(21);
  });

  it("geçersiz veya boş değerde undefined döner", () => {
    expect(parseDateOnly("")).toBeUndefined();
    expect(parseDateOnly("21/10/2026")).toBeUndefined();
    expect(parseDateOnly(undefined)).toBeUndefined();
  });
});

describe("buildEmploymentConfig", () => {
  it("startDate startOfMonth'tan önceliklidir, endOfMonth ayın son günü olur", () => {
    const result = buildEmploymentConfig({
      year: 2026,
      startDate: "2026-10-21",
      startOfMonth: "May",
      endOfMonth: "November",
      previousTaxableIncome: 0,
      previousTaxPaid: 0,
    });
    expect(result.employmentStartDate).toEqual(new Date(2026, 9, 21));
    expect(result.employmentEndDate).toEqual(new Date(2026, 10, 30));
    expect(result.previousEmployment).toBeUndefined();
  });

  it("varsayılanlarda tüm yıl; eski startOfMonth linkleri ayın 1'inden başlar", () => {
    expect(
      buildEmploymentConfig({
        year: 2026,
        startOfMonth: "January",
        endOfMonth: "December",
      }),
    ).toEqual({
      employmentStartDate: undefined,
      employmentEndDate: undefined,
      previousEmployment: undefined,
      includeStartWeekSSC: false,
    });
    expect(
      buildEmploymentConfig({ year: 2026, startOfMonth: "May" })
        .employmentStartDate,
    ).toEqual(new Date(2026, 4, 1));
  });

  it("başka yıla ait startDate yok sayılır, önceki işveren değerleri eklenir", () => {
    const result = buildEmploymentConfig({
      year: 2026,
      startDate: "2025-03-01",
      previousTaxableIncome: 8000,
      previousTaxPaid: 500,
    });
    expect(result.employmentStartDate).toBeUndefined();
    expect(result.previousEmployment).toEqual({
      taxableIncome: 8000,
      taxPaid: 500,
    });
  });
});

describe("calculateMonthlyDeductions — başlangıç haftası SSC", () => {
  it("Çarşamba başlayanda başlangıç haftası seçilirse 2 hafta SSC kesilir", () => {
    const cfg = config({
      employmentStartDate: new Date(2026, 9, 21),
      includeStartWeekSSC: true,
    });
    const october = calculateMonthlyDeductions(monthlyInputs(30000), cfg)[9];
    // 19–25 Ekim haftası (başlangıç) + 26 Ekim Pazartesi
    expect(october.sscWeeks).toBe(2);
    expect(october.sscTax).toBe(111.86);
  });

  it("seçenek kapalıyken yalnızca başlangıçtan sonraki Pazartesiler sayılır", () => {
    const cfg = config({ employmentStartDate: new Date(2026, 9, 21) });
    expect(
      calculateMonthlyDeductions(monthlyInputs(30000), cfg)[9].sscWeeks,
    ).toBe(1);
  });

  it("ayın 1'i Perşembe başlayanda başlangıç haftası tam aya eklenir", () => {
    // 1 Ekim 2026 Perşembe: Pazartesiler 5, 12, 19, 26 + 28 Eyl haftası
    const cfg = config({
      employmentStartDate: new Date(2026, 9, 1),
      includeStartWeekSSC: true,
    });
    const data = calculateMonthlyDeductions(monthlyInputs(30000), cfg);
    expect(data[9].sscWeeks).toBe(5);
    expect(data[10].sscWeeks).toBe(5); // Kasım değişmez
  });

  it("Pazartesi veya hafta sonu başlayanda ek hafta eklenmez", () => {
    const monday = config({
      employmentStartDate: new Date(2026, 9, 19),
      includeStartWeekSSC: true,
    });
    const saturday = config({
      employmentStartDate: new Date(2026, 9, 24),
      includeStartWeekSSC: true,
    });
    expect(
      calculateMonthlyDeductions(monthlyInputs(30000), monday)[9].sscWeeks,
    ).toBe(2);
    expect(
      calculateMonthlyDeductions(monthlyInputs(30000), saturday)[9].sscWeeks,
    ).toBe(1);
  });
});
