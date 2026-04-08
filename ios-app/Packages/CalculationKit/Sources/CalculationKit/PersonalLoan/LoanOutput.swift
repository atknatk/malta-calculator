import Foundation

/// Result of the personal loan calculation.
public struct LoanOutput: Sendable, Codable, Equatable {
    /// Monthly payment amount.
    public let monthlyPayment: Money
    /// Total amount to repay.
    public let totalRepayment: Money
    /// Total interest paid.
    public let totalInterest: Money
    /// Effective annual rate.
    public let effectiveAnnualRate: Decimal
    /// Number of payments.
    public let numberOfPayments: Int
    /// Monthly amortization schedule.
    public let monthlySchedule: [LoanMonthlyPayment]
}

/// One month in the loan amortization schedule.
public struct LoanMonthlyPayment: Sendable, Codable, Equatable {
    /// Month number (1-based).
    public let month: Int
    /// Total payment for this month.
    public let payment: Money
    /// Principal portion of the payment.
    public let principal: Money
    /// Interest portion of the payment.
    public let interest: Money
    /// Outstanding balance at end of month.
    public let remainingBalance: Money
}
