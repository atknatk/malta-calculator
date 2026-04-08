import Foundation

/// Personal loan constraints.
public enum LoanConstraints {
    /// Minimum loan amount in EUR.
    public static let minAmount: Money = 1000
    /// Maximum loan amount in EUR.
    public static let maxAmount: Money = 100_000
    /// Minimum loan term in months.
    public static let minTermMonths: Int = 6
    /// Maximum loan term in months (7 years).
    public static let maxTermMonths: Int = 84
    /// Default annual interest rate (7.5%).
    public static let defaultInterestRate: Decimal = Decimal(string: "7.5") ?? 7
}
