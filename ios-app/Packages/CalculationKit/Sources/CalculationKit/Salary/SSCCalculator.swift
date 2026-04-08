import Foundation

/// Internal helper that computes Social Security Contributions.
struct SSCCalculator: Sendable {
    /// SSC rates for the calculation year.
    let sscRates: MaltaTaxConfig.SSCRates
    /// Employee's SSC category (A, B, C, or D).
    let sscCategory: SSCCategory
    /// Whether the employee was born before 1 January 1962.
    let isBornBefore1962: Bool

    /// Ten percent rate expressed as a safe Decimal (avoids force-unwrapped string init).
    private let tenPercentRate: Decimal = 1

    /// Calculates the weekly SSC base with cap applied.
    func calculateBase(basicSalary: Money, weeksInMonth: Int) -> Money {
        let weeklyEquivalent = (basicSalary * 12) / 52
        let weeklyCap = isBornBefore1962 ? sscRates.weeklyCapOld : sscRates.weeklyCapNew
        let weeks = Decimal(weeksInMonth)

        if weeklyEquivalent < weeklyCap {
            return weeklyEquivalent * weeks
        }
        return weeklyCap * weeks
    }

    /// Calculates the SSC tax based on category.
    func calculateTax(sscBase: Money, weeksInMonth: Int) -> Money {
        let weeks = Decimal(weeksInMonth)

        switch sscCategory {
        case .a:
            return (sscRates.categoryA * weeks).rounded(to: 2)
        case .b:
            let weeklyCapped = (sscRates.categoryB * weeks).rounded(to: 2)
            let tenPercent = (sscBase * tenPercentRate / 10).rounded(to: 2)
            return Swift.min(weeklyCapped, tenPercent)
        case .c:
            let categoryRate = isBornBefore1962 ? sscRates.categoryCOld : sscRates.categoryCNew
            let weeklyCapped = (categoryRate * weeks).rounded(to: 2)
            let tenPercent = (sscBase * tenPercentRate / 10).rounded(to: 2)
            return Swift.min(weeklyCapped, tenPercent)
        case .d:
            let categoryRate = isBornBefore1962 ? sscRates.categoryDOld : sscRates.categoryDNew
            return (categoryRate * weeks).rounded(to: 2)
        }
    }
}
