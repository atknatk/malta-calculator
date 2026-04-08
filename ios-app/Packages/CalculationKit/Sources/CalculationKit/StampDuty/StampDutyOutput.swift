import Foundation

/// Result of the stamp duty calculation.
public struct StampDutyOutput: Sendable, Codable, Equatable {
    /// Stamp duty amount in EUR.
    public let stampDuty: Money
    /// Effective rate as percentage.
    public let effectiveRate: Decimal
    /// Amount exempted (for first-time buyers).
    public let exemptedAmount: Money
    /// Taxable amount after exemptions.
    public let taxableAmount: Money
    /// Savings compared to standard rate.
    public let savings: Money
}
