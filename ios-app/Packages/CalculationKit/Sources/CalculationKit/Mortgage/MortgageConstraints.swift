import Foundation

/// Malta mortgage constraints.
public enum MortgageConstraints {
    /// Minimum deposit percentage (10%).
    public static let minDepositPercent: Decimal = 10
    /// Maximum loan-to-value ratio (90%).
    public static let maxLTV: Decimal = 90
    /// Minimum loan term in years.
    public static let minTermYears: Int = 5
    /// Maximum loan term in years.
    public static let maxTermYears: Int = 40
    /// Default annual interest rate (4.5%).
    public static let defaultInterestRate: Decimal = Decimal(string: "4.5") ?? 4
}
