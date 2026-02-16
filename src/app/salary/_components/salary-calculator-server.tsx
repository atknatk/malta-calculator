/**
 * Server-side salary calculator wrapper
 * Bu component SSR hesaplama yapar ve sonuçları client component'a geçirir
 */
import {
  Month,
  MonthlySalaryInput,
  MonthlySalaryOutput,
  SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";
import { calculateMonthlyDeductions } from "@/utils/salary-calculator";
import {
  SSCCategory,
  TaxRateType,
  SimpleTaxType,
  ChildCount,
} from "@/config/malta-tax-config";
import { SalaryCalculatorClient } from "./salary-calculator";
import type { SalarySearchParams } from "../search-params";

const defaultParams: SalarySearchParams = {
  salary: 25000,
  year: new Date().getFullYear().toString(),
  taxType: "single",
  childCount: 0,
  sscCategory: "C",
  startOfMonth: "January",
  endOfMonth: "December",
  birthYear: 1990,
  yearlyNonTaxBenefit: 0,
  yearlyTaxableBenefit: 0,
  monthlyBonus: 0,
  allowanceBonus: 0,
  monthlyBonuses: "",
};

interface SalaryCalculatorServerProps {
  initialParams?: SalarySearchParams;
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

/**
 * Özet hesapla
 */
function calculateSummary(data: MonthlySalaryOutput[]) {
  if (data.length === 0) return null;

  const totalGross = data.reduce((sum, d) => sum + d.grossTotal, 0);
  const totalSSC = data.reduce((sum, d) => sum + d.sscTax, 0);
  const totalTax = data.reduce((sum, d) => sum + d.incomeTax, 0);
  const totalNet = data.reduce((sum, d) => sum + d.net, 0);

  return {
    annual: {
      gross: totalGross,
      ssc: totalSSC,
      tax: totalTax,
      net: totalNet,
    },
    monthly: {
      gross: totalGross / 12,
      ssc: totalSSC / 12,
      tax: totalTax / 12,
      net: totalNet / 12,
    },
  };
}

export function SalaryCalculatorServer({
  initialParams,
  children,
}: SalaryCalculatorServerProps) {
  const params = initialParams ?? defaultParams;
  const config = buildConfig(params);
  const monthlySalaries = buildMonthlySalaries(params);
  const calculatedData = calculateMonthlyDeductions(monthlySalaries, config);
  const summary = calculateSummary(calculatedData);

  return (
    <SalaryCalculatorClient
      initialData={calculatedData}
      initialSummary={summary}
      initialParams={params}
    >
      {children}
    </SalaryCalculatorClient>
  );
}
