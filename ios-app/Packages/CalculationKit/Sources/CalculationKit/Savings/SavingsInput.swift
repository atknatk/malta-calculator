import Foundation

/// Compounding frequency for savings calculations.
public enum CompoundingFrequency: String, CaseIterable, Codable, Sendable {
    /// Interest compounds every month.
    case monthly
    /// Interest compounds once per year.
    case yearly
}

/// Input for the savings interest calculator.
public struct SavingsInput: Sendable, Codable, Equatable {
    /// Initial deposit amount in EUR.
    public var initialDeposit: Money
    /// Monthly contribution in EUR.
    public var monthlyContribution: Money
    /// Annual interest rate as percentage (e.g. 3.0 for 3%).
    public var interestRate: Decimal
    /// Investment period in years.
    public var years: Int
    /// Compounding frequency (monthly or yearly).
    public var compoundingFrequency: CompoundingFrequency

    /// Creates a new savings input.
    public init(
        initialDeposit: Money,
        monthlyContribution: Money,
        interestRate: Decimal,
        years: Int,
        compoundingFrequency: CompoundingFrequency
    ) {
        self.initialDeposit = initialDeposit
        self.monthlyContribution = monthlyContribution
        self.interestRate = interestRate
        self.years = years
        self.compoundingFrequency = compoundingFrequency
    }
}
