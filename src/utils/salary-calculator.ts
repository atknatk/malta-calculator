import { Month, type MonthlySalaryInput, type MonthlySalaryOutput } from "@/types/salary-calculator-type";

const taxBrackets = [
    { threshold: 0, rate: 0 },
    { threshold: 9100, rate: 0.15 },
    { threshold: 14500, rate: 0.25 },
    { threshold: 60000, rate: 0.35 }
];

const  calculateIncomeTax = (
    income: number,
    previousIncome: number,
    brackets: { threshold: number, rate: number }[]
): number => {
    let tax = 0;
    const totalIncome = income + previousIncome;

    for (let i = 0; i < brackets.length; i++) {
        const { threshold, rate } = brackets[i];
        const nextThreshold = i < brackets.length - 1 ? brackets[i + 1].threshold : Infinity;

        if (totalIncome > threshold) {
            const taxableIncome = Math.min(totalIncome, nextThreshold) - threshold;
            const previousTaxableIncome = Math.min(previousIncome, nextThreshold) - threshold;
            const incomeToTax = taxableIncome - Math.max(previousTaxableIncome, 0);
            tax += Math.max(incomeToTax, 0) * rate;
        } else {
            break;
        }
    }

    return tax;
}




// const income = 70000;
// const tax = calculateIncomeTax(income, brackets);
// console.log(`The calculated income tax is: ${tax}`);


export function calculateMonthlyDeductions(salaryInput: MonthlySalaryInput[]): MonthlySalaryOutput[] {
  
    let cumilative = 0;
    let kumulativeIncomeBase = 0;
    return salaryInput.map(({ month, grossWage, allowanceBonus }) => {
        // Örnek hesaplama formülleri
        debugger;
        
        const basicSalary = grossWage * 0.8;
        const nonTaxBenefit = 97.5;
        const taxBenefit = 97.5;
        const bonus = grossWage * 0.1;
        const halfAdditional = allowanceBonus / 2; // Eklenen miktarın yarısı
        const grossTotal = basicSalary + nonTaxBenefit + taxBenefit + bonus + halfAdditional; // Yarıyı ekle

        const sscBase = grossTotal * 0.8;
        const sscTax = sscBase * 0.14;
        const incomeBase = grossTotal - sscTax;
        kumulativeIncomeBase += incomeBase; // Kumulatif gelir tabanı, aylık hesaplamada değiştirilebilir
        const incomeTax = calculateIncomeTax(incomeBase + halfAdditional,cumilative ,  taxBrackets); // Yarıyı vergiye ekle
        const governmentBonus = bonus;
        const net = incomeBase - incomeTax + governmentBonus + halfAdditional; // Yarıyı nete ekle
        const paid = net;
        const discr = grossTotal - paid;
        cumilative += grossWage;
        return {
            month,
            grossWage,
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
