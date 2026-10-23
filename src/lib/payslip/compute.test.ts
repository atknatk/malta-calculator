import { describe, it, expect } from "vitest";
import {
  carryOverSalaryConfig,
  computeMonthlyPayslip,
  normalizeSalaryConfig,
  type PayslipSalaryConfig,
} from "./compute";

const config: PayslipSalaryConfig = {
  annualGross: 30000,
  taxType: "single",
  childCount: 0,
  sscCategory: "C",
  birthYear: 1990,
};

describe("computeMonthlyPayslip", () => {
  it("brüt = temel + COLA, net = brüt − vergi − SSC", () => {
    const { payslip } = computeMonthlyPayslip({
      periodMonth: 9,
      periodYear: 2026,
      salaryConfig: config,
    });
    expect(payslip).toBeDefined();
    const p = payslip!;
    expect(p.grossSalary).toBeCloseTo(2500 + p.deductions.cola, 2);
    expect(p.netSalary).toBeCloseTo(
      p.grossSalary - p.deductions.incomeTax - p.deductions.sscEmployee,
      2,
    );
    expect(p.deductions.sscEmployer).toBe(p.deductions.sscEmployee);
  });

  it("bonus ve ödenek vergilendirilir (vergi sonrası eklenmez)", () => {
    const base = computeMonthlyPayslip({
      periodMonth: 9,
      periodYear: 2026,
      salaryConfig: config,
    }).payslip!;
    const withExtras = computeMonthlyPayslip({
      periodMonth: 9,
      periodYear: 2026,
      salaryConfig: config,
      bonus: 1000,
      allowance: 200,
    }).payslip!;

    expect(withExtras.grossSalary).toBeCloseTo(base.grossSalary + 1200, 2);
    expect(withExtras.deductions.incomeTax).toBeGreaterThan(
      base.deductions.incomeTax,
    );
    expect(withExtras.netSalary).toBeLessThan(base.netSalary + 1200);
    expect(withExtras.deductions.bonus).toBe(1000);
    expect(withExtras.deductions.allowance).toBe(200);
  });

  it("işe başlamadan önceki dönemi reddeder", () => {
    const result = computeMonthlyPayslip({
      periodMonth: 3,
      periodYear: 2026,
      salaryConfig: { ...config, startDate: "2026-05-04" },
    });
    expect(result.error).toMatch(/before the employee's start date/);
  });

  it("kıst ayda dönem başlangıcını yazar", () => {
    const { payslip } = computeMonthlyPayslip({
      periodMonth: 5,
      periodYear: 2026,
      salaryConfig: { ...config, startDate: "2026-05-18" },
    });
    expect(payslip!.deductions.employmentRatio).toBeLessThan(1);
    expect(payslip!.deductions.periodStartDate).toBe("2026-05-18");
  });
});

describe("normalizeSalaryConfig", () => {
  it("geçersiz değerleri reddeder", () => {
    expect(normalizeSalaryConfig({ ...config, annualGross: 0 }).error).toBe(
      "Annual gross salary must be greater than €0",
    );
    expect(
      normalizeSalaryConfig({
        ...config,
        taxType: "x" as PayslipSalaryConfig["taxType"],
      }).error,
    ).toBe("Invalid tax status");
  });

  it("bekarlarda çocuk sayısını sıfırlar", () => {
    expect(
      normalizeSalaryConfig({ ...config, childCount: 2 }).config!.childCount,
    ).toBe(0);
  });
});

describe("carryOverSalaryConfig", () => {
  it("yeni yılda başlangıç tarihi ve önceki işveren bilgisini düşürür", () => {
    const carried = carryOverSalaryConfig(
      {
        ...config,
        startDate: "2025-06-02",
        previousTaxableIncome: 5000,
        previousTaxPaid: 400,
      },
      2025,
      2026,
    );
    expect(carried.startDate).toBeUndefined();
    expect(carried.previousTaxableIncome).toBe(0);
    expect(carried.previousTaxPaid).toBe(0);
  });
});
