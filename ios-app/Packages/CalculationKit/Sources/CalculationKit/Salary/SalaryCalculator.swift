import Foundation

/// Malta Salary Calculator — cumulative income tax, SSC, and COLA.
///
/// Ports the TypeScript implementation in `src/utils/salary-calculator.ts`
/// to Swift using `Decimal`-only arithmetic for financial accuracy.
///
/// Reference: `src/utils/salary-calculator.ts`
public struct SalaryCalculator: Sendable {
    /// The salary calculator configuration (tax type, SSC category, benefits, etc.).
    public let config: SalaryCalculatorConfig
    /// The Malta tax configuration containing brackets, SSC rates, and COLA.
    public let taxConfig: MaltaTaxConfig

    /// Creates a new salary calculator with the given configuration.
    public init(config: SalaryCalculatorConfig, taxConfig: MaltaTaxConfig) {
        self.config = config
        self.taxConfig = taxConfig
    }

    /// Computes monthly salary breakdowns for each input period.
    ///
    /// - Parameter inputs: An array of monthly salary inputs (typically 12 months).
    /// - Returns: An array of `SalaryOutput` values, one per input month.
    /// - Throws: `CalculationError.invalidYear` if the year is not in config,
    ///           `CalculationError.corruptedConfig` if brackets are missing.
    public func calculate(inputs: [SalaryInput]) throws -> [SalaryOutput] {
        guard let yearConfig = taxConfig.years[config.year] else {
            throw CalculationError.invalidYear(config.year)
        }

        let effectiveTaxType = resolveTaxRateType(
            year: config.year,
            simpleType: config.simpleTaxType,
            childCount: config.childCount
        )

        guard let taxBrackets = yearConfig.brackets[effectiveTaxType]
            ?? yearConfig.brackets[.single]
        else {
            throw CalculationError.corruptedConfig(
                reason: "No brackets for \(effectiveTaxType) in \(config.year)"
            )
        }

        let sscCalculator = SSCCalculator(
            sscRates: yearConfig.ssc,
            sscCategory: config.sscCategory,
            isBornBefore1962: DateHelpers.isBornBefore1962(config.birthDate)
        )

        let monthlyNonTaxBenefit = config.yearlyNonTaxBenefit / 12
        let monthlyTaxBenefit = config.yearlyTaxableBenefit / 12
        let totalAnnualGross = inputs.map(\.grossWage).reduce(0, +)

        var cumulativeIncomeBase: Money = 0
        var cumulativeTax: Money = 0
        var outputs: [SalaryOutput] = []
        outputs.reserveCapacity(inputs.count)

        for (index, input) in inputs.enumerated() {
            let grossWage = input.grossWage.nonNegative
            let inputBonus = input.bonus.nonNegative
            let inputGovBonus = input.governmentBonus.nonNegative
            let safeAllowanceBonus = input.allowanceBonus.nonNegative

            let weeksInMonth = config.weeksPerMonthOverride
                ?? input.weeksInMonth
                ?? DateHelpers.weeksForMonth(year: config.year, month: input.month)

            let basicSalary = grossWage
            let nonTaxBenefit = monthlyNonTaxBenefit
            let taxBenefit = monthlyTaxBenefit

            let monthlyBonusFallback = config.monthlyBonus
            let bonus = inputBonus > 0 ? inputBonus : monthlyBonusFallback
            let autoCOLA: Money = config.enableCOLA
                ? yearConfig.cola.amount(for: input.month)
                : 0
            let governmentBonus = inputGovBonus > 0 ? inputGovBonus : autoCOLA
            let halfAdditional = safeAllowanceBonus / 2

            let grossTotal = basicSalary + nonTaxBenefit + taxBenefit
                + bonus + governmentBonus + halfAdditional

            let sscBase = sscCalculator.calculateBase(
                basicSalary: basicSalary,
                weeksInMonth: weeksInMonth
            )
            let sscTax = sscCalculator.calculateTax(
                sscBase: sscBase,
                weeksInMonth: weeksInMonth
            )

            let incomeBase = grossTotal - nonTaxBenefit
            cumulativeIncomeBase += incomeBase

            let incomeTax = calculateMonthlyIncomeTax(
                incomeBase: incomeBase,
                cumulativeIncomeBase: cumulativeIncomeBase,
                previousCumulativeTax: cumulativeTax,
                monthIndex: index,
                annualGross: totalAnnualGross,
                taxBrackets: taxBrackets
            )
            cumulativeTax += incomeTax

            let net = grossTotal - sscTax - incomeTax
            let paid = net + halfAdditional
            let discr = grossTotal - paid

            outputs.append(SalaryOutput(
                month: input.month,
                grossWage: grossWage,
                basicSalary: basicSalary,
                nonTaxBenefit: nonTaxBenefit.rounded(),
                taxBenefit: taxBenefit.rounded(),
                bonus: bonus,
                governmentBonus: governmentBonus,
                grossTotal: grossTotal.rounded(),
                sscBase: sscBase.rounded(),
                sscTax: sscTax.rounded(),
                incomeBase: incomeBase.rounded(),
                cumulativeIncomeBase: cumulativeIncomeBase.rounded(),
                cumulativeTax: cumulativeTax.rounded(),
                incomeTax: incomeTax.rounded(),
                net: net.rounded(),
                paid: paid.rounded(),
                discr: discr.rounded()
            ))
        }

        return outputs
    }

    /// Monthly income tax using Malta's cumulative system.
    ///
    /// Projects annual income from the year-to-date cumulative base,
    /// applies the matching bracket rate and deduction, then subtracts
    /// previously paid cumulative tax to derive this month's portion.
    private func calculateMonthlyIncomeTax(
        incomeBase: Money,
        cumulativeIncomeBase: Money,
        previousCumulativeTax: Money,
        monthIndex: Int,
        annualGross: Money,
        taxBrackets: [MaltaTaxConfig.TaxBracket]
    ) -> Money {
        guard let bracket = findTaxBracket(for: annualGross, in: taxBrackets),
              bracket.rate > 0
        else { return 0 }

        if monthIndex == 0 {
            let yearlyProjectedTax = incomeBase * 12 * bracket.rate - bracket.deduction
            return Swift.max(0, yearlyProjectedTax / 12)
        } else {
            let monthNumber = Decimal(monthIndex + 1)
            let projectedAnnualIncome = (cumulativeIncomeBase / monthNumber) * 12
            let yearlyProjectedTax = projectedAnnualIncome * bracket.rate - bracket.deduction
            let monthlyTax = (yearlyProjectedTax / 12) * monthNumber - previousCumulativeTax
            return Swift.max(0, monthlyTax)
        }
    }

    /// Finds the tax bracket that contains the given annual income.
    ///
    /// Falls back to the last bracket if no exact match is found.
    private func findTaxBracket(
        for annualIncome: Money,
        in brackets: [MaltaTaxConfig.TaxBracket]
    ) -> MaltaTaxConfig.TaxBracket? {
        for bracket in brackets where annualIncome >= bracket.min && annualIncome <= bracket.max {
            return bracket
        }
        return brackets.last
    }
}
