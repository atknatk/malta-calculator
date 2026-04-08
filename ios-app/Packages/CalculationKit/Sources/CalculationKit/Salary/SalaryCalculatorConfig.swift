import Foundation

/// Configuration for the salary calculator — tax type, SSC category, benefits, etc.
public struct SalaryCalculatorConfig: Sendable, Codable, Equatable {
    /// Tax year to calculate for.
    public var year: Int
    /// Simplified tax filing status.
    public var simpleTaxType: SimpleTaxType
    /// Number of dependent children (affects bracket selection from 2026+).
    public var childCount: Int
    /// Social Security Contribution category.
    public var sscCategory: SSCCategory
    /// Employee's date of birth (used for pre-1962 SSC cap).
    public var birthDate: Date
    /// Yearly non-taxable benefit (e.g. meal vouchers).
    public var yearlyNonTaxBenefit: Money
    /// Yearly taxable benefit (e.g. company car).
    public var yearlyTaxableBenefit: Money
    /// Monthly bonus to apply when input bonus is zero.
    public var monthlyBonus: Money
    /// Whether to auto-apply COLA in quarterly months.
    public var enableCOLA: Bool
    /// Optional override for weeks-per-month (bypasses calendar calculation).
    public var weeksPerMonthOverride: Int?

    /// Creates a new salary calculator configuration.
    public init(
        year: Int = 2026,
        simpleTaxType: SimpleTaxType = .single,
        childCount: Int = 0,
        sscCategory: SSCCategory = .c,
        birthDate: Date = DateComponents(calendar: .init(identifier: .gregorian),
                                         year: 1990, month: 1, day: 1).date ?? Date(),
        yearlyNonTaxBenefit: Money = 0,
        yearlyTaxableBenefit: Money = 0,
        monthlyBonus: Money = 0,
        enableCOLA: Bool = true,
        weeksPerMonthOverride: Int? = nil
    ) {
        self.year = year
        self.simpleTaxType = simpleTaxType
        self.childCount = childCount
        self.sscCategory = sscCategory
        self.birthDate = birthDate
        self.yearlyNonTaxBenefit = yearlyNonTaxBenefit
        self.yearlyTaxableBenefit = yearlyTaxableBenefit
        self.monthlyBonus = monthlyBonus
        self.enableCOLA = enableCOLA
        self.weeksPerMonthOverride = weeksPerMonthOverride
    }

    /// Default configuration for a single, full-time employee born 1990.
    public static let `default` = SalaryCalculatorConfig()
}
