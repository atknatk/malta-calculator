import fs from "fs";
import path from "path";
import {
  calculateMonthlyDeductions,
  defaultConfig,
} from "../src/utils/salary-calculator";
import { calculateMortgage } from "../src/utils/mortgage-calculator";
import { calculateLoan } from "../src/utils/loan-calculator";
import { calculateStampDuty } from "../src/utils/stamp-duty-calculator";
import { calculateSavings } from "../src/utils/savings-calculator";
import { calculatePension } from "../src/utils/pension-calculator";
import { calculateOvertime } from "../src/utils/overtime-calculator";
import { calculateVacationLeave } from "../src/utils/vacation-calculator";
import {
  calculateChildrensAllowance,
  calculateBirthBonus,
} from "../src/utils/childrens-allowance-calculator";
import { calculateVehicleRegistrationTax } from "../src/utils/vehicle-registration-tax-calculator";
import { calculateImportVehicle } from "../src/utils/import-vehicle-calculator";
import { Month } from "../src/types/salary-calculator-type";

const outputDir = path.join(
  __dirname,
  "../ios-app/Packages/CalculationKit/Tests/CalculationKitTests/Golden",
);
fs.mkdirSync(outputDir, { recursive: true });

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function write<I, O>(name: string, input: I, expected: O) {
  const payload = { input, expected, generatedAt: new Date().toISOString() };
  fs.writeFileSync(
    path.join(outputDir, `${name}.json`),
    JSON.stringify(payload, null, 2),
  );
  console.log(`✓ ${name}.json`);
}

const MONTHS = [
  Month.January,
  Month.February,
  Month.March,
  Month.April,
  Month.May,
  Month.June,
  Month.July,
  Month.August,
  Month.September,
  Month.October,
  Month.November,
  Month.December,
];

// ── Salary fixtures ──────────────────────────────────────────

// 1. Single, 2026, 25k annual
{
  const config = {
    ...defaultConfig,
    year: 2026,
    simpleTaxType: "single" as const,
    sscCategory: "C" as const,
  };
  const monthlyGross = 25000 / 12;
  const inputs = MONTHS.map((m) => ({
    month: m,
    grossWage: monthlyGross,
    bonus: 0,
    governmentBonus: 0,
    allowanceBonus: 0,
  }));
  const expected = calculateMonthlyDeductions(inputs, config);
  write(
    "salary_2026_single_25k",
    { inputs, config: { ...config, birthDate: "1990-01-01" } },
    expected,
  );
}

// 2. Married + 2 children, 2026, 35k
{
  const config = {
    ...defaultConfig,
    year: 2026,
    simpleTaxType: "married" as const,
    childCount: 2 as const,
    sscCategory: "C" as const,
  };
  const monthlyGross = 35000 / 12;
  const inputs = MONTHS.map((m) => ({
    month: m,
    grossWage: monthlyGross,
    bonus: 0,
    governmentBonus: 0,
    allowanceBonus: 0,
  }));
  const expected = calculateMonthlyDeductions(inputs, config);
  write(
    "salary_2026_married_2child_35k",
    { inputs, config: { ...config, birthDate: "1990-01-01" } },
    expected,
  );
}

// 3. Parent, 2025, 28k
{
  const config = {
    ...defaultConfig,
    year: 2025,
    simpleTaxType: "parent" as const,
    sscCategory: "C" as const,
  };
  const monthlyGross = 28000 / 12;
  const inputs = MONTHS.map((m) => ({
    month: m,
    grossWage: monthlyGross,
    bonus: 0,
    governmentBonus: 0,
    allowanceBonus: 0,
  }));
  const expected = calculateMonthlyDeductions(inputs, config);
  write(
    "salary_2025_parent_28k",
    { inputs, config: { ...config, birthDate: "1990-01-01" } },
    expected,
  );
}

// 4. Pensioner born 1960 (before 1962), 2026, 20k, category A
{
  const config = {
    ...defaultConfig,
    year: 2026,
    simpleTaxType: "single" as const,
    sscCategory: "A" as const,
    birthDate: new Date(1960, 0, 1),
  };
  const monthlyGross = 20000 / 12;
  const inputs = MONTHS.map((m) => ({
    month: m,
    grossWage: monthlyGross,
    bonus: 0,
    governmentBonus: 0,
    allowanceBonus: 0,
  }));
  const expected = calculateMonthlyDeductions(inputs, config);
  write(
    "salary_1962_pensioner_20k",
    { inputs, config: { ...config, birthDate: "1960-01-01" } },
    expected,
  );
}

// ── Mortgage fixtures ────────────────────────────────────────

// 5. 500k, 30y, min deposit (10%)
{
  const input = {
    propertyPrice: 500000,
    depositPercent: 10,
    interestRate: 4.5,
    loanTermYears: 30,
  };
  const output = calculateMortgage(input);
  write("mortgage_500k_30y_min_deposit", input, {
    loanAmount: output.loanAmount,
    depositAmount: output.depositAmount,
    monthlyPayment: round2(output.monthlyPayment),
    totalInterest: round2(output.totalInterest),
    totalCost: round2(output.totalCost),
    ltvRatio: output.ltvRatio,
    numberOfPayments: output.numberOfPayments,
  });
}

// ── Personal Loan fixture ────────────────────────────────────

// 6. 10k, 5y (60 months)
{
  const input = { loanAmount: 10000, interestRate: 7.5, loanTermMonths: 60 };
  const output = calculateLoan(input);
  write("personal_loan_10k_5y", input, {
    monthlyPayment: round2(output.monthlyPayment),
    totalRepayment: round2(output.totalRepayment),
    totalInterest: round2(output.totalInterest),
    numberOfPayments: output.numberOfPayments,
  });
}

// ── Savings fixture ──────────────────────────────────────────

// 7. 100k, 5y, monthly compounding, no contributions
{
  const input = {
    initialDeposit: 100000,
    monthlyContribution: 0,
    interestRate: 3,
    years: 5,
    compoundingFrequency: "monthly" as const,
  };
  const output = calculateSavings(input);
  write("savings_100k_5y_compound", input, {
    finalBalanceGross: round2(output.finalBalanceGross),
    totalContributions: round2(output.totalContributions),
    totalInterestGross: round2(output.totalInterestGross),
    withholdingTax: round2(output.withholdingTax),
    totalInterestNet: round2(output.totalInterestNet),
    finalBalanceNet: round2(output.finalBalanceNet),
  });
}

// ── Pension fixtures ─────────────────────────────────────────

// 8. Two-thirds pension (full eligibility)
{
  const input = {
    birthYear: 1960,
    taxStatus: "single" as const,
    children: 0,
    paidYears: 40,
    averageSalary: 25000,
    deferralYears: 0 as const,
    privatePensionContribution: 0,
  };
  const output = calculatePension(input);
  write("pension_two_thirds", input, {
    isEligible: output.isEligible,
    retirementAge: output.retirementAge,
    requiredYears: output.requiredYears,
    effectiveYears: output.effectiveYears,
    proportion: round2(output.proportion),
    pensionableIncome: round2(output.pensionableIncome),
    isMPICapped: output.isMPICapped,
    baseAnnualPension: round2(output.baseAnnualPension),
    annualPension: round2(output.annualPension),
    monthlyPension: round2(output.monthlyPension),
    annualCola: round2(output.annualCola),
  });
}

// 9. Capped at MPI
{
  const input = {
    birthYear: 1970,
    taxStatus: "single" as const,
    children: 2,
    paidYears: 41,
    averageSalary: 50000,
    deferralYears: 0 as const,
    privatePensionContribution: 3000,
  };
  const output = calculatePension(input);
  write("pension_capped_mpi", input, {
    isEligible: output.isEligible,
    retirementAge: output.retirementAge,
    pensionableIncome: round2(output.pensionableIncome),
    isMPICapped: output.isMPICapped,
    mpi: output.mpi,
    baseAnnualPension: round2(output.baseAnnualPension),
    annualPension: round2(output.annualPension),
    monthlyPension: round2(output.monthlyPension),
    privateTaxCredit: round2(output.privateTaxCredit),
    privateContribution: round2(output.privateContribution),
  });
}

// ── Vacation fixture ─────────────────────────────────────────

// 10. Part-time 20h/week
{
  const input = { weeklyHours: 20, year: 2026 };
  const output = calculateVacationLeave(input);
  write("vacation_part_time_20h", input, {
    baseHours: output.baseHours,
    publicHolidayHours: output.publicHolidayHours,
    totalHours: output.totalHours,
    totalDays: output.totalDays,
    isProRata: output.isProRata,
  });
}

// ── Vehicle Registration Tax fixtures ────────────────────────

// 11. Low CO2 (electric)
{
  const input = {
    co2Emissions: 0,
    vehicleAge: 0,
    engineCapacity: 0,
    fuelType: "electric" as const,
    vehicleValue: 40000,
    isEU: true,
  };
  const output = calculateVehicleRegistrationTax(input);
  write("vehicle_reg_tax_co2_low", input, {
    totalTax: round2(output.totalTax),
    co2Tax: round2(output.co2Tax),
    ageDiscount: round2(output.ageDiscount),
    ecoDiscount: round2(output.ecoDiscount),
    importDuty: round2(output.importDuty),
    vat: round2(output.vat),
  });
}

// 12. High CO2 (diesel, 200g, old)
{
  const input = {
    co2Emissions: 200,
    vehicleAge: 5,
    engineCapacity: 2000,
    fuelType: "diesel" as const,
    vehicleValue: 25000,
    isEU: true,
  };
  const output = calculateVehicleRegistrationTax(input);
  write("vehicle_reg_tax_co2_high", input, {
    totalTax: round2(output.totalTax),
    co2Tax: round2(output.co2Tax),
    ageDiscount: round2(output.ageDiscount),
    ecoDiscount: round2(output.ecoDiscount),
    importDuty: round2(output.importDuty),
    vat: round2(output.vat),
  });
}

// ── Children's Allowance fixture ─────────────────────────────

// 13. 3 kids, low income
{
  const input = {
    grossIncome: 15000,
    sscPaid: 1500,
    rentIncome: 0,
    interestIncome: 0,
    pensionIncome: 0,
    maintenanceIncome: 0,
    otherIncome: 0,
    taxPaid: 500,
    numberOfChildren: 3,
  };
  const output = calculateChildrensAllowance(input);
  write("children_allowance_3kids", input, {
    totalIncome: round2(output.totalIncome),
    netIncome: round2(output.netIncome),
    weeklyPerChild: round2(output.weeklyPerChild),
    yearlyPerChild: round2(output.yearlyPerChild),
    yearlyForAll: round2(output.yearlyForAll),
    quarterlyPayment: round2(output.quarterlyPayment),
    rateType: output.rateType,
  });
}

// ── Import Vehicle fixture ───────────────────────────────────

// 14. Non-EU GBP import
{
  const input = {
    purchasePrice: 15000,
    currency: "GBP" as const,
    vehicleAge: 3,
    co2Emissions: 150,
    engineCapacity: 1800,
    fuelType: "diesel" as const,
    isEU: false,
    shippingCost: 800,
    isNew: false,
  };
  const output = calculateImportVehicle(input);
  write("import_vehicle_total", input, {
    vehicleValueEUR: round2(output.vehicleValueEUR),
    registrationTax: round2(output.registrationTax),
    importDuty: round2(output.importDuty),
    vat: round2(output.vat),
    shippingCostEUR: round2(output.shippingCostEUR),
    vrtFee: round2(output.vrtFee),
    numberPlatesFee: round2(output.numberPlatesFee),
    totalCost: round2(output.totalCost),
    totalTaxesFees: round2(output.totalTaxesFees),
  });
}

console.log("\nDone. 14 new fixtures generated.");
