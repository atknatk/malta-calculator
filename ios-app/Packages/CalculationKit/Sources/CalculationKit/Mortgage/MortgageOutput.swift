import Foundation

/// Result of the mortgage calculation.
public struct MortgageOutput: Sendable, Codable, Equatable {
    /// Loan amount (principal).
    public let loanAmount: Money
    /// Required deposit amount.
    public let depositAmount: Money
    /// Monthly payment.
    public let monthlyPayment: Money
    /// Total interest paid over loan term.
    public let totalInterest: Money
    /// Total cost (principal + interest).
    public let totalCost: Money
    /// Loan-to-Value ratio as percentage.
    public let ltvRatio: Decimal
    /// Effective annual rate.
    public let effectiveAnnualRate: Decimal
    /// Total number of payments.
    public let numberOfPayments: Int
    /// Yearly amortization schedule.
    public let yearlySchedule: [YearlyPayment]
}

/// One year in the amortization schedule.
public struct YearlyPayment: Sendable, Codable, Equatable {
    /// Year number (1-based).
    public let year: Int
    /// Principal paid in this year.
    public let principalPaid: Money
    /// Interest paid in this year.
    public let interestPaid: Money
    /// Total paid in this year (principal + interest).
    public let totalPaid: Money
    /// Outstanding balance at end of year.
    public let remainingBalance: Money
}
