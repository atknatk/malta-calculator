import Foundation

/// Input parameters for the Malta mortgage calculator.
public struct MortgageInput: Sendable, Codable, Equatable {
    /// Property purchase price in EUR.
    public var propertyPrice: Money
    /// Deposit percentage (minimum 10%).
    public var depositPercent: Decimal
    /// Annual interest rate as percentage (e.g. 4.5 for 4.5%).
    public var interestRate: Decimal
    /// Loan term in years (5--40).
    public var loanTermYears: Int

    /// Creates a new mortgage input.
    public init(
        propertyPrice: Money,
        depositPercent: Decimal,
        interestRate: Decimal,
        loanTermYears: Int
    ) {
        self.propertyPrice = propertyPrice
        self.depositPercent = depositPercent
        self.interestRate = interestRate
        self.loanTermYears = loanTermYears
    }
}
