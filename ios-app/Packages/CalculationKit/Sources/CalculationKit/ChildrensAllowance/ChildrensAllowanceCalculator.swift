import Foundation

/// Malta Children's Allowance Calculator.
///
/// Based on official Malta Social Security Department rules.
public struct ChildrensAllowanceCalculator: Sendable {
    public init() {}

    /// Calculates children's allowance based on household income.
    public func calculate(input: ChildrensAllowanceInput) -> ChildrensAllowanceOutput {
        let c = ChildrensAllowanceConstants.self

        let totalIncome = input.grossIncome + input.rentIncome + input.interestIncome
            + input.pensionIncome + input.maintenanceIncome + input.otherIncome

        let netIncome = Swift.max(0, totalIncome - input.sscPaid - input.taxPaid)

        var weeklyPerChild: Money
        let rateType: AllowanceRateType

        if netIncome <= c.minIncomeThreshold {
            weeklyPerChild = c.maxWeeklyRate
            rateType = .maximum
        } else if netIncome <= c.maxIncomeThreshold {
            let incomeDifference = c.maxIncomeThreshold - netIncome
            let yearlyAmount = incomeDifference * (c.percentage / 100)
            weeklyPerChild = yearlyAmount / Decimal(c.weeksPerYear)

            weeklyPerChild = Swift.max(c.minWeeklyRate, Swift.min(c.maxWeeklyRate, weeklyPerChild))

            if netIncome > c.midIncomeThreshold {
                rateType = .minimum
            } else {
                rateType = .variable
            }
        } else {
            weeklyPerChild = c.minWeeklyRate
            rateType = .fixed
        }

        weeklyPerChild = weeklyPerChild.rounded(to: 2)

        let children = Decimal(input.numberOfChildren)
        let weeklyForAll = weeklyPerChild * children
        let yearlyPerChild = weeklyPerChild * Decimal(c.weeksPerYear)
        let yearlyForAll = yearlyPerChild * children
        let quarterlyPayment = weeklyForAll * Decimal(c.paymentWeeks)

        return ChildrensAllowanceOutput(
            totalIncome: totalIncome.rounded(to: 2),
            netIncome: netIncome.rounded(to: 2),
            weeklyPerChild: weeklyPerChild,
            weeklyForAll: weeklyForAll.rounded(to: 2),
            yearlyPerChild: yearlyPerChild.rounded(to: 2),
            yearlyForAll: yearlyForAll.rounded(to: 2),
            quarterlyPayment: quarterlyPayment.rounded(to: 2),
            isAboveThreshold: netIncome > c.maxIncomeThreshold,
            rateType: rateType
        )
    }

    /// Calculates the birth/adoption bonus for a given child order.
    public func birthBonus(order: Int) -> BirthBonusResult {
        let amount: Money
        if order <= 0 {
            amount = 0
        } else if order == 1 {
            amount = ChildrensAllowanceConstants.birthBonusFirstChild
        } else if order == 2 {
            amount = ChildrensAllowanceConstants.birthBonusSecondChild
        } else {
            amount = ChildrensAllowanceConstants.birthBonusThirdPlus
        }
        return BirthBonusResult(childOrder: order, bonusAmount: amount)
    }
}
