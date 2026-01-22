/**
 * Malta Salary Calculator
 * Excel formüllerine uygun hesaplama mantığı
 * Kaynak: Payroll Working.xlsx ve .agent/rules/malta-payroll-rules.md
 */

import {
    getTaxBracketsForYear,
    getSSCRatesForYear,
    getCOLAForMonth,
    isBornBefore1962,
    type TaxBracket,
    type SSCRates,
    type SSCCategory,
    type TaxRateType,
} from "@/config/malta-tax-config";

import {
    Month,
    weeksPerMonth,
    type MonthlySalaryInput,
    type MonthlySalaryOutput,
    type SalaryCalculatorConfig,
} from "@/types/salary-calculator-type";

// ==================== SSC HESAPLAMA ====================

/**
 * Haftalık SSC Base hesaplar (cap uygulanır)
 * Excel formülü: IF((B*12)/52 < CAP, (B*12)/52 * weeks, CAP * weeks)
 */
function calculateSSCBase(
    basicSalary: number,
    weeksInMonth: number,
    weeklyCap: number
): number {
    const weeklyEquivalent = (basicSalary * 12) / 52;

    if (weeklyEquivalent < weeklyCap) {
        return weeklyEquivalent * weeksInMonth;
    }
    return weeklyCap * weeksInMonth;
}

/**
 * SSC Tax hesaplar (kategori bazlı)
 * Excel formülleri: Kategori A, B, C, D için farklı hesaplamalar
 */
function calculateSSCTax(
    sscBase: number,
    weeksInMonth: number,
    sscCategory: SSCCategory,
    sscRates: SSCRates,
    isBornBefore1962Flag: boolean
): number {
    switch (sscCategory) {
        case 'A':
            // 18 yaş altı - sabit haftalık oran
            return sscRates.categoryA * weeksInMonth;

        case 'B':
            // Part-time veya minimum ücret altı
            // MIN(categoryB * weeks, sscBase * 0.10)
            return Math.min(
                sscRates.categoryB * weeksInMonth,
                Math.round(sscBase * 0.10 * 100) / 100
            );

        case 'C':
            // Tam zamanlı çalışan
            if (isBornBefore1962Flag) {
                return Math.min(
                    sscRates.categoryCOld * weeksInMonth,
                    Math.round(sscBase * 0.10 * 100) / 100
                );
            }
            return Math.min(
                sscRates.categoryCNew * weeksInMonth,
                Math.round(sscBase * 0.10 * 100) / 100
            );

        case 'D':
            // Tavan üstü gelir - sabit haftalık oran
            if (isBornBefore1962Flag) {
                return sscRates.categoryDOld * weeksInMonth;
            }
            return sscRates.categoryDNew * weeksInMonth;

        default:
            return 0;
    }
}

// ==================== VERGİ HESAPLAMA ====================

/**
 * Yıllık gelir için uygulanacak vergi dilimini bulur
 */
function findTaxBracket(annualIncome: number, brackets: TaxBracket[]): TaxBracket | null {
    for (const bracket of brackets) {
        if (annualIncome >= bracket.min && annualIncome <= bracket.max) {
            return bracket;
        }
    }
    // Gelir son dilimin üstündeyse son dilimi kullan
    return brackets[brackets.length - 1];
}

/**
 * Aylık gelir vergisi hesaplar (kümülatif sistem)
 * 
 * İlk ay: (((incomeBase * 12) * rate) - deduction) / 12
 * Sonraki aylar: (((cumulativeIncomeBase / month * 12) * rate) - deduction) / 12 * month - previousCumulativeTax
 */
function calculateMonthlyIncomeTax(
    incomeBase: number,
    cumulativeIncomeBase: number,
    previousCumulativeTax: number,
    monthIndex: number,
    annualGross: number,
    taxBrackets: TaxBracket[]
): number {
    const bracket = findTaxBracket(annualGross, taxBrackets);

    if (!bracket || bracket.rate === 0) {
        return 0;
    }

    if (monthIndex === 0) {
        // İlk ay
        const yearlyProjectedTax = (incomeBase * 12 * bracket.rate) - bracket.deduction;
        return Math.max(0, yearlyProjectedTax / 12);
    } else {
        // Sonraki aylar (kümülatif hesaplama)
        const monthNumber = monthIndex + 1;
        const projectedAnnualIncome = (cumulativeIncomeBase / monthNumber) * 12;
        const yearlyProjectedTax = (projectedAnnualIncome * bracket.rate) - bracket.deduction;
        const monthlyTax = (yearlyProjectedTax / 12) * monthNumber - previousCumulativeTax;
        return Math.max(0, monthlyTax);
    }
}

// ==================== ANA HESAPLAMA FONKSİYONU ====================

/**
 * Varsayılan konfigurasyon
 */
export const defaultConfig: SalaryCalculatorConfig = {
    year: 2025,
    taxRateType: 'single',
    sscCategory: 'C',
    birthDate: new Date(1990, 0, 1),
    yearlyNonTaxBenefit: 1170,  // €97.50 * 12
    yearlyTaxableBenefit: 1170, // €97.50 * 12
    enableCOLA: true,           // COLA otomatik hesaplanır
};

/**
 * Aylık maaş kesintilerini hesaplar
 */
export function calculateMonthlyDeductions(
    salaryInput: MonthlySalaryInput[],
    config: SalaryCalculatorConfig = defaultConfig
): MonthlySalaryOutput[] {
    // Config'den değerleri al
    const taxBrackets = getTaxBracketsForYear(config.year, config.taxRateType);
    const sscRates = getSSCRatesForYear(config.year);
    const isBornBefore1962Flag = isBornBefore1962(config.birthDate);

    // Haftalık SSC cap (doğum tarihine göre)
    const weeklyCap = isBornBefore1962Flag
        ? sscRates.weeklyCapOld
        : sscRates.weeklyCapNew;

    // Aylık sabit değerler
    const monthlyNonTaxBenefit = config.yearlyNonTaxBenefit / 12;
    const monthlyTaxBenefit = config.yearlyTaxableBenefit / 12;

    // Yıllık brüt (vergi dilimi belirlemek için)
    const totalAnnualGross = salaryInput.reduce((sum, s) => sum + s.grossWage, 0);

    // Kümülatif değerler
    let cumulativeIncomeBase = 0;
    let cumulativeTax = 0;

    return salaryInput.map((input, index) => {
        const { month } = input;
        // NaN koruması: grossWage, bonus, governmentBonus ve allowanceBonus için
        const grossWage = isNaN(Number(input.grossWage)) ? 0 : Number(input.grossWage);
        const inputBonus = isNaN(Number(input.bonus)) ? 0 : Number(input.bonus);
        const inputGovBonus = isNaN(Number(input.governmentBonus)) ? 0 : Number(input.governmentBonus);
        const safeAllowanceBonus = isNaN(Number(input.allowanceBonus)) ? 0 : Number(input.allowanceBonus);

        // Hafta sayısı: override varsa onu kullan, yoksa input'tan, o da yoksa default
        const weeksInMonth = config.weeksPerMonthOverride ?? input.weeksInMonth ?? weeksPerMonth[month];

        // Temel hesaplamalar
        const basicSalary = grossWage;
        const nonTaxBenefit = monthlyNonTaxBenefit;
        const taxBenefit = monthlyTaxBenefit;

        // Bonus ve Government Bonus (COLA)
        const bonus = inputBonus || (config.monthlyBonus ?? 0);
        // COLA: Eğer enableCOLA true ise otomatik olarak ay bazlı COLA ekle
        const autoCOLA = config.enableCOLA ? getCOLAForMonth(config.year, month) : 0;
        const governmentBonus = inputGovBonus || autoCOLA;
        const halfAdditional = safeAllowanceBonus / 2;

        // Brüt toplam
        const grossTotal = basicSalary + nonTaxBenefit + taxBenefit + bonus + governmentBonus + halfAdditional;

        // SSC hesaplama
        const sscBase = calculateSSCBase(basicSalary, weeksInMonth, weeklyCap);
        const sscTax = calculateSSCTax(
            sscBase,
            weeksInMonth,
            config.sscCategory,
            sscRates,
            isBornBefore1962Flag
        );

        // Income Base (vergiye tabi gelir)
        // Excel: Income Base = Gross Total - Non-Tax Benefit
        const incomeBase = grossTotal - nonTaxBenefit;

        // Kümülatif gelir tabanı
        cumulativeIncomeBase += incomeBase;

        // Gelir vergisi hesaplama (kümülatif sistem)
        const incomeTax = calculateMonthlyIncomeTax(
            incomeBase,
            cumulativeIncomeBase,
            cumulativeTax,
            index,
            totalAnnualGross,
            taxBrackets
        );

        // Kümülatif vergi güncelle
        cumulativeTax += incomeTax;

        // Net maaş
        // Excel: Net = Gross Total - SSC Tax - Income Tax
        const net = grossTotal - sscTax - incomeTax;
        const paid = net + halfAdditional; // Allowance bonus'un diğer yarısı
        const discr = grossTotal - paid;

        return {
            month,
            grossWage,
            basicSalary,
            nonTaxBenefit: Math.round(nonTaxBenefit * 100) / 100,
            taxBenefit: Math.round(taxBenefit * 100) / 100,
            bonus,
            governmentBonus,
            grossTotal: Math.round(grossTotal * 100) / 100,
            sscBase: Math.round(sscBase * 100) / 100,
            sscTax: Math.round(sscTax * 100) / 100,
            incomeBase: Math.round(incomeBase * 100) / 100,
            cumulativeIncomeBase: Math.round(cumulativeIncomeBase * 100) / 100,
            cumulativeTax: Math.round(cumulativeTax * 100) / 100,
            incomeTax: Math.round(incomeTax * 100) / 100,
            net: Math.round(net * 100) / 100,
            paid: Math.round(paid * 100) / 100,
            discr: Math.round(discr * 100) / 100,
        };
    });
}

// ==================== ESKİ FONKSİYON (GERİYE UYUMLULUK) ====================

/**
 * @deprecated Yeni calculateMonthlyDeductions fonksiyonunu config ile kullanın
 */
export function calculateMonthlyDeductionsLegacy(
    salaryInput: MonthlySalaryInput[]
): MonthlySalaryOutput[] {
    return calculateMonthlyDeductions(salaryInput, defaultConfig);
}
