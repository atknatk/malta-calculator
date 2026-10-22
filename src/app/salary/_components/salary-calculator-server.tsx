/**
 * Server-side salary calculator wrapper
 * Bu component SSR hesaplama yapar ve sonuçları client component'a geçirir
 */
import {
  Month,
  MonthlySalaryInput,
  SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";
import {
  buildEmploymentConfig,
  calculateMonthlyDeductions,
  summarizeMonthlyDeductions,
} from "@/utils/salary-calculator";
import {
  SSCCategory,
  TaxRateType,
  SimpleTaxType,
  ChildCount,
} from "@/config/malta-tax-config";
import { SalaryCalculatorClient } from "./salary-calculator";
import type { SalarySearchParams } from "../search-params";

interface SalaryCalculatorServerProps {
  initialParams: SalarySearchParams;
  children: React.ReactNode;
}

/**
 * URL params'tan SalaryCalculatorConfig oluştur
 */
function buildConfig(params: SalarySearchParams): SalaryCalculatorConfig {
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
    ...buildEmploymentConfig({
      year: parseInt(params.year),
      startDate: params.startDate,
      startOfMonth: params.startOfMonth,
      endOfMonth: params.endOfMonth,
      previousTaxableIncome: params.prevIncome,
      previousTaxPaid: params.prevTax,
    }),
  };
}

/**
 * URL params'tan MonthlySalaryInput[] oluştur
 */
function buildMonthlySalaries(
  params: SalarySearchParams,
): MonthlySalaryInput[] {
  const monthlySalaries: MonthlySalaryInput[] = [];
  const monthlyGross =
    params.salary > 0 ? Number((params.salary / 12).toFixed(2)) : 0;

  for (const month of Object.values(Month)) {
    monthlySalaries.push({
      month,
      allowanceBonus: params.allowanceBonus,
      grossWage: monthlyGross,
    });
  }

  return monthlySalaries;
}

export function SalaryCalculatorServer({
  initialParams,
  children,
}: SalaryCalculatorServerProps) {
  // Server-side hesaplama
  const config = buildConfig(initialParams);
  const monthlySalaries = buildMonthlySalaries(initialParams);
  const calculatedData = calculateMonthlyDeductions(monthlySalaries, config);
  const summary = summarizeMonthlyDeductions(calculatedData);

  return (
    <SalaryCalculatorClient
      initialData={calculatedData}
      initialSummary={summary}
      initialParams={initialParams}
    >
      {children}
    </SalaryCalculatorClient>
  );
}
