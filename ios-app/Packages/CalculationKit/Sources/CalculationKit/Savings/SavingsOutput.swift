import Foundation

/// Result of the savings interest calculation.
public struct SavingsOutput: Sendable, Codable, Equatable {
    /// Final balance before withholding tax.
    public let finalBalanceGross: Money
    /// Total contributions (initial + monthly).
    public let totalContributions: Money
    /// Total interest earned before tax.
    public let totalInterestGross: Money
    /// Total withholding tax deducted (15%).
    public let withholdingTax: Money
    /// Total interest after tax.
    public let totalInterestNet: Money
    /// Final balance after tax.
    public let finalBalanceNet: Money
    /// Effective annual yield after tax as percentage.
    public let effectiveYieldNet: Decimal
    /// Year-by-year breakdown.
    public let yearlyBreakdown: [YearlySavings]
}

/// One year in the savings breakdown.
public struct YearlySavings: Sendable, Codable, Equatable {
    /// Year number (1-based).
    public let year: Int
    /// Balance at the start of the year.
    public let balanceStart: Money
    /// Total contributions during the year.
    public let contributions: Money
    /// Gross interest earned during the year.
    public let interestGross: Money
    /// Withholding tax deducted during the year.
    public let withholdingTax: Money
    /// Net interest after tax for the year.
    public let interestNet: Money
    /// Balance at the end of the year.
    public let balanceEnd: Money
}
