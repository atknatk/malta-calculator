import Foundation

/// Malta Mortgage Calculator using standard amortization formula.
///
/// PMT = P x [r(1+r)^n] / [(1+r)^n - 1]
///
/// Where:
/// - P = Principal (loan amount)
/// - r = Monthly interest rate (annual rate / 12)
/// - n = Total number of payments (years x 12)
public struct MortgageCalculator: Sendable {

    /// Creates a new mortgage calculator.
    public init() {}

    /// Calculates mortgage payments and amortization schedule.
    /// - Parameter input: The mortgage parameters.
    /// - Returns: A ``MortgageOutput`` containing payment details and yearly schedule.
    public func calculate(input: MortgageInput) -> MortgageOutput {
        // Enforce minimum deposit
        let effectiveDepositPercent = Swift.max(
            input.depositPercent,
            MortgageConstraints.minDepositPercent
        )

        // Calculate loan amount
        let depositAmount = (input.propertyPrice * effectiveDepositPercent) / 100
        let loanAmount = input.propertyPrice - depositAmount
        let ltvRatio = 100 - effectiveDepositPercent

        // Monthly interest rate and number of payments
        let monthlyRate = input.interestRate / 100 / 12
        let numberOfPayments = input.loanTermYears * 12

        // Calculate monthly payment using amortization formula
        let monthlyPayment: Money
        if monthlyRate == 0 {
            // No interest case
            monthlyPayment = loanAmount / Decimal(numberOfPayments)
        } else {
            let factor = decimalPow(1 + monthlyRate, numberOfPayments)
            monthlyPayment = (loanAmount * (monthlyRate * factor)) / (factor - 1)
        }

        // Calculate totals
        let totalCost = monthlyPayment * Decimal(numberOfPayments)
        let totalInterest = totalCost - loanAmount

        // Generate yearly amortization schedule
        let yearlySchedule = generateYearlySchedule(
            principal: loanAmount,
            monthlyRate: monthlyRate,
            monthlyPayment: monthlyPayment,
            years: input.loanTermYears
        )

        return MortgageOutput(
            loanAmount: loanAmount.rounded(),
            depositAmount: depositAmount.rounded(),
            monthlyPayment: monthlyPayment.rounded(),
            totalInterest: totalInterest.rounded(),
            totalCost: totalCost.rounded(),
            ltvRatio: ltvRatio,
            effectiveAnnualRate: input.interestRate,
            numberOfPayments: numberOfPayments,
            yearlySchedule: yearlySchedule
        )
    }

    // MARK: - Private Helpers

    /// Generates a yearly amortization schedule.
    private func generateYearlySchedule(
        principal: Money,
        monthlyRate: Decimal,
        monthlyPayment: Money,
        years: Int
    ) -> [YearlyPayment] {
        var schedule: [YearlyPayment] = []
        var remainingBalance = principal

        for year in 1...years {
            var yearlyPrincipal: Money = 0
            var yearlyInterest: Money = 0

            for _ in 1...12 {
                guard remainingBalance > 0 else { break }
                let interestPayment = remainingBalance * monthlyRate
                let principalPayment = Swift.min(
                    monthlyPayment - interestPayment,
                    remainingBalance
                )
                yearlyInterest += interestPayment
                yearlyPrincipal += principalPayment
                remainingBalance -= principalPayment
            }

            schedule.append(YearlyPayment(
                year: year,
                principalPaid: yearlyPrincipal.rounded(),
                interestPaid: yearlyInterest.rounded(),
                totalPaid: (yearlyPrincipal + yearlyInterest).rounded(),
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
