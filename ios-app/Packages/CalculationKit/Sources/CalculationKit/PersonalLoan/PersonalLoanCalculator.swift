import Foundation

/// Malta Personal Loan Calculator using standard amortization formula.
///
/// PMT = P x [r(1+r)^n] / [(1+r)^n - 1]
///
/// Where:
/// - P = Principal (loan amount)
/// - r = Monthly interest rate (annual rate / 12)
/// - n = Total number of payments
public struct PersonalLoanCalculator: Sendable {

    /// Creates a new personal loan calculator.
    public init() {}

    /// Calculates personal loan payments and monthly amortization schedule.
    /// - Parameter input: The loan parameters.
    /// - Returns: A ``LoanOutput`` containing payment details and monthly schedule.
    public func calculate(input: LoanInput) -> LoanOutput {
        let monthlyRate = input.interestRate / 100 / 12
        let numberOfPayments = input.loanTermMonths

        // Calculate monthly payment using amortization formula
        let monthlyPayment: Money
        if monthlyRate == 0 {
            monthlyPayment = input.loanAmount / Decimal(numberOfPayments)
        } else {
            let factor = decimalPow(1 + monthlyRate, numberOfPayments)
            monthlyPayment = (input.loanAmount * (monthlyRate * factor)) / (factor - 1)
        }

        // Calculate totals
        let totalRepayment = monthlyPayment * Decimal(numberOfPayments)
        let totalInterest = totalRepayment - input.loanAmount

        // Generate monthly amortization schedule
        let monthlySchedule = generateMonthlySchedule(
            principal: input.loanAmount,
            monthlyRate: monthlyRate,
            monthlyPayment: monthlyPayment,
            numberOfPayments: numberOfPayments
        )

        return LoanOutput(
            monthlyPayment: monthlyPayment.rounded(),
            totalRepayment: totalRepayment.rounded(),
            totalInterest: totalInterest.rounded(),
            effectiveAnnualRate: input.interestRate,
            numberOfPayments: numberOfPayments,
            monthlySchedule: monthlySchedule
        )
    }

    // MARK: - Private Helpers

    /// Generates a monthly amortization schedule.
    private func generateMonthlySchedule(
        principal: Money,
        monthlyRate: Decimal,
        monthlyPayment: Money,
        numberOfPayments: Int
    ) -> [LoanMonthlyPayment] {
        var schedule: [LoanMonthlyPayment] = []
        var remainingBalance = principal

        for month in 1...numberOfPayments {
            guard remainingBalance > 0 else { break }

            let interest = remainingBalance * monthlyRate
            let principalPayment = Swift.min(
                monthlyPayment - interest,
                remainingBalance
            )
            remainingBalance -= principalPayment

            schedule.append(LoanMonthlyPayment(
                month: month,
                payment: monthlyPayment.rounded(),
                principal: principalPayment.rounded(),
                interest: interest.rounded(),
                remainingBalance: Swift.max(0, remainingBalance).rounded()
            ))

            guard remainingBalance > 0 else { break }
        }

        return schedule
    }

    /// Integer exponentiation for `Decimal`.
    private func decimalPow(_ base: Decimal, _ exponent: Int) -> Decimal {
        guard exponent > 0 else { return 1 }
        var result: Decimal = 1
        for _ in 0..<exponent {
            result *= base
        }
        return result
    }
}
