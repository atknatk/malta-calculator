import { SSCCategory, TaxRateType } from "@/config/malta-tax-config";

export type MonthlySalaryInput = {
    month: Month;
    grossWage: number;
    bonus?: number;           // Aylık bonus (varsayılan: 0)
    governmentBonus?: number; // Devlet bonusu (COLA vb.) (varsayılan: 0)
    allowanceBonus?: number;  // Ek ödenek (varsayılan: 0)
    weeksInMonth?: number;    // Ayda kaç hafta (varsayılan: 4 veya 5)
};

export type MonthlySalaryOutput = {
    month: Month;
    grossWage: number;
    basicSalary: number;
    nonTaxBenefit: number;
    taxBenefit: number;
    bonus: number;
    governmentBonus: number;
    grossTotal: number;
    sscBase: number;
    sscTax: number;
    incomeBase: number;
    cumulativeIncomeBase: number;
    cumulativeTax: number;
    incomeTax: number;
    net: number;
    paid: number;
    discr: number;
};

export type SalaryCalculatorConfig = {
    year: number;
    taxRateType: TaxRateType;
    sscCategory: SSCCategory;
    birthDate: Date;
    yearlyNonTaxBenefit: number;  // Yıllık vergi dışı yan hak (varsayılan: 0)
    yearlyTaxableBenefit: number; // Yıllık vergiye tabi yan hak (varsayılan: 0)
    monthlyBonus?: number;        // Aylık bonus
    governmentBonus?: number;     // Devlet bonusu (aylık) - deprecated, use enableCOLA
    enableCOLA?: boolean;         // COLA otomatik hesaplama (varsayılan: true)
    weeksPerMonthOverride?: number; // Sabit hafta sayısı (null = otomatik)
};

export enum Month {
    January = "January",
    February = "February",
    March = "March",
    April = "April",
    May = "May",
    June = "June",
    July = "July",
    August = "August",
    September = "September",
    October = "October",
    November = "November",
    December = "December"
}

// Ayda varsayılan hafta sayısı (bazı aylar 5 hafta olabilir)
// Not: Bu değerler Malta SSC hesabı için standart değerlerdir
export const weeksPerMonth: Record<Month, number> = {
    [Month.January]: 4,
    [Month.February]: 4,
    [Month.March]: 5,
    [Month.April]: 4,
    [Month.May]: 4,
    [Month.June]: 5,
    [Month.July]: 4,
    [Month.August]: 4,
    [Month.September]: 4,
    [Month.October]: 5,
    [Month.November]: 4,
    [Month.December]: 5,
};

// Toplam yıllık hafta sayısı (52)
export const TOTAL_WEEKS_PER_YEAR = 52;
