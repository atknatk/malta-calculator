import Foundation

/// Input for the personal loan calculator.
public struct LoanInput: Sendable, Codable, Equatable {
    /// Loan amount in EUR.
    public var loanAmount: Money
    /// Annual interest rate as percentage (e.g. 7.5 for 7.5%).
    public var interestRate: Decimal
    /// Loan term in months.
    public var loanTermMonths: Int

    /// Creates a new personal loan input.
    public init(loanAmount: Money, interestRate: Decimal, loanTermMonths: Int) {
        self.loanAmount = loanAmount
        self.interestRate = interestRate
        self.loanTermMonths = loanTermMonths
    }
}
