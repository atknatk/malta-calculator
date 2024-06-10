export type MonthlySalaryInput = {
    month: Month;
    grossWage: number;
    //additionalAmount: number;
    allowanceBonus: number;
};

export type MonthlySalaryOutput = {
    month: Month;
    grossWage: number;
    basicSalary: number;
    nonTaxBenefit: number;
    taxBenefit: number;
    bonus: number;
    grossTotal: number;
    sscBase: number;
    sscTax: number;
    incomeBase: number;
    kumulativeIncomeBase: number;
    incomeTax: number;
    governmentBonus: number;
    net: number;
    paid: number;
    discr: number;
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
