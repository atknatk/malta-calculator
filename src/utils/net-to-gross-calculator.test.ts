/**
 * Round-trip tests for net-to-gross calculator.
 * Goal: forward(reverse(net)) ≈ net within tolerance for various configurations.
 */

import { describe, it, expect } from "vitest";
import { calculateGrossFromNet } from "./net-to-gross-calculator";
import { calculateMonthlyDeductions } from "./salary-calculator";
import {
  Month,
  type MonthlySalaryInput,
  type SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";

const baseConfig: SalaryCalculatorConfig = {
  year: 2026,
  taxRateType: "single",
  simpleTaxType: "single",
  childCount: 0,
  sscCategory: "C",
  birthDate: new Date(1990, 0, 1),
  yearlyNonTaxBenefit: 0,
  yearlyTaxableBenefit: 0,
  monthlyBonus: 0,
  enableCOLA: true,
};

/**
 * Helper: run the forward calculation with the same inputs the bisection used
 * for display, return total annual net.
 */
function forwardNet(
  annualGross: number,
  config: SalaryCalculatorConfig,
  opts: {
    allowanceBonus?: number;
    monthlyBonuses?: Record<string, number>;
  } = {},
): number {
  const monthlyGross = Number((annualGross / 12).toFixed(2));
  const input: MonthlySalaryInput[] = Object.values(Month).map((month) => ({
    month,
    grossWage: monthlyGross,
    bonus: opts.monthlyBonuses?.[month] || 0,
    allowanceBonus: opts.allowanceBonus || 0,
  }));
  const out = calculateMonthlyDeductions(input, config);
  return out.reduce((s, m) => s + m.net, 0);
}

describe("calculateGrossFromNet — round-trip", () => {
  it("converges to within 1 EUR for a typical single 2026 case (no bonuses)", () => {
    const target = 20000;
    const result = calculateGrossFromNet(
      {
        targetAnnualNet: target,
        includeBonusesInTarget: true,
        allowanceBonus: 0,
        monthlyBonuses: {},
      },
      baseConfig,
    );

    expect(result.converged).toBe(true);
    expect(result.finalError).toBeLessThan(1);

    // Round-trip: forward(result.gross) should produce ~target
    const achievedNet = forwardNet(result.annualGross, baseConfig);
    expect(Math.abs(achievedNet - target)).toBeLessThan(1);
  });

  it("handles target 0 cleanly", () => {
    const result = calculateGrossFromNet(
      {
        targetAnnualNet: 0,
        includeBonusesInTarget: true,
        allowanceBonus: 0,
        monthlyBonuses: {},
      },
      baseConfig,
    );

    expect(result.annualGross).toBe(0);
    expect(result.converged).toBe(true);
  });

  it("handles high target (SSC cap territory)", () => {
    const target = 50000;
    const result = calculateGrossFromNet(
      {
        targetAnnualNet: target,
        includeBonusesInTarget: true,
        allowanceBonus: 0,
        monthlyBonuses: {},
      },
      baseConfig,
    );

    expect(result.converged).toBe(true);
    const achievedNet = forwardNet(result.annualGross, baseConfig);
    expect(Math.abs(achievedNet - target)).toBeLessThan(1);
  });

  it("married + 2 children 2026 — child count affects brackets", () => {
    const target = 30000;
    const config: SalaryCalculatorConfig = {
      ...baseConfig,
      taxRateType: "married",
      simpleTaxType: "married",
      childCount: 2,
    };

    const result = calculateGrossFromNet(
      {
        targetAnnualNet: target,
        includeBonusesInTarget: true,
        allowanceBonus: 0,
        monthlyBonuses: {},
      },
      config,
    );

    expect(result.converged).toBe(true);
    const achievedNet = forwardNet(result.annualGross, config);
    expect(Math.abs(achievedNet - target)).toBeLessThan(1);
  });

  it("includeBonusesInTarget=true with monthly bonuses (target = total net)", () => {
    const target = 25000;
    const monthlyBonuses = { [Month.December]: 1500, [Month.March]: 500 };

    const result = calculateGrossFromNet(
      {
        targetAnnualNet: target,
        includeBonusesInTarget: true,
        allowanceBonus: 0,
        monthlyBonuses,
      },
      baseConfig,
    );

    expect(result.converged).toBe(true);

    // Forward run with same bonuses should produce ~target
    const achievedNet = forwardNet(result.annualGross, baseConfig, {
      monthlyBonuses,
    });
    expect(Math.abs(achievedNet - target)).toBeLessThan(1);
  });

  it("includeBonusesInTarget=false: salary alone nets target; bonuses added on top", () => {
    const target = 20000;
    const monthlyBonuses = { [Month.December]: 1000 };

    const result = calculateGrossFromNet(
      {
        targetAnnualNet: target,
        includeBonusesInTarget: false,
        allowanceBonus: 0,
        monthlyBonuses,
      },
      baseConfig,
    );

    expect(result.converged).toBe(true);

    // Forward WITHOUT bonuses (salary alone) should equal target
    const salaryOnlyNet = forwardNet(result.annualGross, baseConfig, {
      monthlyBonuses: {},
    });
    expect(Math.abs(salaryOnlyNet - target)).toBeLessThan(1);

    // Forward WITH bonuses should exceed target (bonuses add net on top)
    const fullNet = forwardNet(result.annualGross, baseConfig, {
      monthlyBonuses,
    });
    expect(fullNet).toBeGreaterThan(target);
  });

  it("includeBonusesInTarget=false with allowance: same salary-only invariant", () => {
    const target = 18000;
    const allowanceBonus = 100;

    const result = calculateGrossFromNet(
      {
        targetAnnualNet: target,
        includeBonusesInTarget: false,
        allowanceBonus,
        monthlyBonuses: {},
      },
      baseConfig,
    );

    expect(result.converged).toBe(true);

    const salaryOnlyNet = forwardNet(result.annualGross, baseConfig, {
      allowanceBonus: 0,
    });
    expect(Math.abs(salaryOnlyNet - target)).toBeLessThan(1);
  });
});

describe("calculateGrossFromNet — output shape", () => {
  it("returns 12 monthly breakdown rows", () => {
    const result = calculateGrossFromNet(
      {
        targetAnnualNet: 20000,
        includeBonusesInTarget: true,
        allowanceBonus: 0,
        monthlyBonuses: {},
      },
      baseConfig,
    );

    expect(result.monthly).toHaveLength(12);
    expect(result.monthly[0].month).toBe(Month.January);
    expect(result.monthly[11].month).toBe(Month.December);
  });

  it("monthlyGross ≈ annualGross / 12", () => {
    const result = calculateGrossFromNet(
      {
        targetAnnualNet: 20000,
        includeBonusesInTarget: true,
        allowanceBonus: 0,
        monthlyBonuses: {},
      },
      baseConfig,
    );

    expect(
      Math.abs(result.monthlyGross - result.annualGross / 12),
    ).toBeLessThan(0.02);
  });

  it("iterations stays bounded (<60)", () => {
    const result = calculateGrossFromNet(
      {
        targetAnnualNet: 20000,
        includeBonusesInTarget: true,
        allowanceBonus: 0,
        monthlyBonuses: {},
      },
      baseConfig,
    );

    expect(result.iterations).toBeLessThan(60);
  });
});
