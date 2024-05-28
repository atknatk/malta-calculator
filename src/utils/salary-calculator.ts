import { Month, type MonthlySalaryInput, type MonthlySalaryOutput } from "@/types/salary-calculator-type";


function calculateIncomeTax(
    income: number,
    brackets: { threshold: number, rate: number }[]
): number {
    let tax = 0;

    for (let i = 0; i < brackets.length; i++) {
        const { threshold, rate } = brackets[i];
        const nextThreshold = i < brackets.length - 1 ? brackets[i + 1].threshold : Infinity;

        if (income > threshold) {
            const taxableIncome = Math.min(income, nextThreshold) - threshold;
            tax += taxableIncome * rate;
        } else {
            break;
        }
    }

    return tax;
}

const brackets = [
    { threshold: 0, rate: 0 },
    { threshold: 9100, rate: 0.15 },
    { threshold: 14500, rate: 0.25 },
    { threshold: 60000, rate: 0.35 }
];

// const income = 70000;
// const tax = calculateIncomeTax(income, brackets);
// console.log(`The calculated income tax is: ${tax}`);


function calculateMonthlyDeductions(salaryInput: MonthlySalaryInput[]): MonthlySalaryOutput[] {
    const taxBrackets = [
        { threshold: 0, rate: 0 },
        { threshold: 9100, rate: 0.15 },
        { threshold: 14500, rate: 0.25 },
        { threshold: 60000, rate: 0.35 }
    ];

    return salaryInput.map(({ month, grossSalary, additionalAmount }) => {
        // Örnek hesaplama formülleri
        const basicSalary = grossSalary * 0.8;
        const nonTaxBenefit = grossSalary * 0.05;
        const taxBenefit = grossSalary * 0.05;
        const bonus = grossSalary * 0.1;
        const halfAdditional = additionalAmount / 2; // Eklenen miktarın yarısı
        const grossTotal = basicSalary + nonTaxBenefit + taxBenefit + bonus + halfAdditional; // Yarıyı ekle

        const sscBase = grossTotal * 0.8;
        const sscTax = sscBase * 0.14;
        const incomeBase = grossTotal - sscTax;
        const kumulativeIncomeBase = incomeBase; // Kumulatif gelir tabanı, aylık hesaplamada değiştirilebilir
        const incomeTax = calculateIncomeTax(incomeBase + halfAdditional, taxBrackets); // Yarıyı vergiye ekle
        const governmentBonus = bonus;
        const net = incomeBase - incomeTax + governmentBonus + halfAdditional; // Yarıyı nete ekle
        const paid = net;
        const discr = grossTotal - paid;

        return {
            month,
            grossSalary,
            basicSalary,
            nonTaxBenefit,
            taxBenefit,
            bonus,
            grossTotal,
            sscBase,
            sscTax,
            incomeBase,
            kumulativeIncomeBase,
            incomeTax,
            governmentBonus,
            net,
            paid,
            discr
        };
    });
}

// Örnek kullanım:
// Örnek kullanım:
const monthlySalaries: MonthlySalaryInput[] = [
    { month: Month.January, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.February, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.March, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.April, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.May, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.June, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.July, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.August, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.September, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.October, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.November, grossSalary: 3000, additionalAmount: 500 },
    { month: Month.December, grossSalary: 3000, additionalAmount: 500 },
];


const monthlySalaryOutputs = calculateMonthlyDeductions(monthlySalaries);
console.log(monthlySalaryOutputs);
