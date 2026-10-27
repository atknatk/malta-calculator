/**
 * Maaş sayfası görünüm hesapları — motor çıktısıyla tutarlılık
 */

import { describe, it, expect } from "vitest";
import {
  calculateMonthlyDeductions,
  summarizeMonthlyDeductions,
} from "@/utils/salary-calculator";
import {
  Month,
  type SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";
import {
  buildMonthlyInputs,
  columnTotal,
  findTaxBandRate,
  formatEuro,
  partialMonthLabel,
  shareOf,
  summarizeTotals,
} from "./salary-view";

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

const blank = Array(12).fill(null);

describe("buildMonthlyInputs", () => {
  it("yıllık brütü 12'ye böler, tablo düzenlemesi o ayın ücretini ezer", () => {
    const wages = [...blank];
    wages[5] = 3000;
    const inputs = buildMonthlyInputs({
      annualSalary: 35000,
      wageOverrides: wages,
      allowance: 50,
      bonuses: { [Month.March]: 500 },
    });

    expect(inputs[0].grossWage).toBe(2916.67);
    expect(inputs[5].grossWage).toBe(3000);
    expect(inputs[2].bonus).toBe(500);
    expect(inputs[0].bonus).toBe(0);
    expect(inputs.every((i) => i.allowanceBonus === 50)).toBe(true);
  });
});

describe("summarizeTotals", () => {
  it("tam yılda motor özetiyle aynı toplamları verir", () => {
    const data = calculateMonthlyDeductions(
      buildMonthlyInputs({
        annualSalary: 30000,
        wageOverrides: blank,
        allowance: 0,
        bonuses: {},
      }),
      config(),
    );
    const totals = summarizeTotals(data);
    const summary = summarizeMonthlyDeductions(data)!;

    expect(totals.tax).toBeCloseTo(summary.annual.tax, 2);
    expect(totals.ssc).toBeCloseTo(summary.annual.ssc, 2);
    expect(totals.paid).toBeCloseTo(summary.annual.net, 2);
    expect(totals.grossPay).toBeCloseTo(summary.annual.gross, 2);
    expect(totals.statutoryBonus).toBeCloseTo(512.52, 2);
    expect(totals.monthsWorked).toBe(12);
    expect(totals.tax).toBeCloseTo(4228.16, 2);
  });

  it("ödeneğin vergisiz yarısı brüte ve ödenen nete eklenir", () => {
    const data = calculateMonthlyDeductions(
      buildMonthlyInputs({
        annualSalary: 30000,
        wageOverrides: blank,
        allowance: 100,
        bonuses: {},
      }),
      config(),
    );
    const totals = summarizeTotals(data);
    const summary = summarizeMonthlyDeductions(data)!;

    expect(totals.allowanceHalf).toBeCloseTo(600, 2);
    expect(totals.paid).toBeCloseTo(summary.annual.net + 600, 2);
    expect(totals.grossPay).toBeCloseTo(summary.annual.gross + 600, 2);
    expect(
      shareOf(totals.paid, totals) +
        shareOf(totals.tax, totals) +
        shareOf(totals.ssc, totals),
    ).toBeCloseTo(1, 6);
  });
});

describe("findTaxBandRate", () => {
  it("2026 single: €30,000 %25 diliminde, €12,000 vergisiz", () => {
    const run = (salary: number) => {
      const c = config();
      const data = calculateMonthlyDeductions(
        buildMonthlyInputs({
          annualSalary: salary,
          wageOverrides: blank,
          allowance: 0,
          bonuses: {},
        }),
        c,
      );
      return findTaxBandRate(data, c);
    };
    expect(run(30000)).toBe(0.25);
    expect(run(12000)).toBe(0);
    expect(run(80000)).toBe(0.35);
  });

  it("önceki işverendeki matrah dilime eklenir", () => {
    const c = config({
      previousEmployment: { taxableIncome: 50000, taxPaid: 9000 },
    });
    const data = calculateMonthlyDeductions(
      buildMonthlyInputs({
        annualSalary: 24000,
        wageOverrides: blank,
        allowance: 0,
        bonuses: {},
      }),
      c,
    );
    expect(findTaxBandRate(data, c)).toBe(0.35);
  });
});

describe("tablo yardımcıları", () => {
  it("ücret sütununun toplamı kıst temel ücret, kümülatif sütunun toplamı yok", () => {
    const c = config({ employmentStartDate: new Date(2026, 6, 15) });
    const data = calculateMonthlyDeductions(
      buildMonthlyInputs({
        annualSalary: 36000,
        wageOverrides: blank,
        allowance: 0,
        bonuses: {},
      }),
      c,
    );
    const basic = data.reduce((t, r) => t + r.basicSalary, 0);

    expect(columnTotal(data, "wage")).toBeCloseTo(basic, 2);
    expect(columnTotal(data, "cum")).toBeNull();
    expect(partialMonthLabel(data[6], 6, c.employmentStartDate)).toBe(
      "From 15 Jul",
    );
    expect(partialMonthLabel(data[7], 7, c.employmentStartDate)).toBeNull();
    expect(partialMonthLabel(data[0], 0, c.employmentStartDate)).toBeNull();
  });

  it("para biçimi €1,234.50", () => {
    expect(formatEuro(1234.5)).toBe("€1,234.50");
  });
});
