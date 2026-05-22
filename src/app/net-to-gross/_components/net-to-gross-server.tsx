/**
 * Server-side net-to-gross calculator wrapper
 * SSR ile bisection sonucunu hesaplar ve client'a geçirir.
 */
import type { SalaryCalculatorConfig } from "@/types/salary-calculator-type";
import {
  SSCCategory,
  TaxRateType,
  SimpleTaxType,
  ChildCount,
} from "@/config/malta-tax-config";
import {
  calculateGrossFromNet,
  type MonthlyBonuses,
} from "@/utils/net-to-gross-calculator";
import { NetToGrossCalculatorClient } from "./net-to-gross-client";
import type { NetToGrossSearchParams } from "../search-params";

interface NetToGrossCalculatorServerProps {
  initialParams: NetToGrossSearchParams;
}

function buildConfig(params: NetToGrossSearchParams): SalaryCalculatorConfig {
  return {
    year: parseInt(params.year),
    taxRateType: params.taxType as TaxRateType,
    simpleTaxType: params.taxType as SimpleTaxType,
    childCount: (params.childCount ?? 0) as ChildCount,
    sscCategory: params.sscCategory as SSCCategory,
    birthDate: new Date(params.birthYear, 0, 1),
    yearlyNonTaxBenefit: params.yearlyNonTaxBenefit,
    yearlyTaxableBenefit: params.yearlyTaxableBenefit,
    monthlyBonus: params.monthlyBonus,
    enableCOLA: true,
  };
}

function parseMonthlyBonuses(raw: string): MonthlyBonuses {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as MonthlyBonuses;
  } catch {
    return {};
  }
}

export function NetToGrossCalculatorServer({
  initialParams,
}: NetToGrossCalculatorServerProps) {
  const config = buildConfig(initialParams);
  const monthlyBonuses = parseMonthlyBonuses(initialParams.monthlyBonuses);

  const result = calculateGrossFromNet(
    {
      targetAnnualNet: initialParams.net,
      includeBonusesInTarget: initialParams.includeBonusesInTarget,
      allowanceBonus: initialParams.allowanceBonus,
      monthlyBonuses,
    },
    config,
  );

  return (
    <NetToGrossCalculatorClient
      initialData={result.monthly}
      initialAnnualGross={result.annualGross}
      initialMonthlyGross={result.monthlyGross}
      initialParams={initialParams}
    />
  );
}
