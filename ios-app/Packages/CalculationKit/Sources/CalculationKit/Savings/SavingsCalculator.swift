import Foundation

/// Malta Savings Interest Calculator.
///
/// Compound interest with Malta's 15% final withholding tax on interest income.
///
/// Formula: A = P(1 + r/n)^(nt) + PMT x [((1 + r/n)^(nt) - 1) / (r/n)]
///
/// Where:
/// - P = Initial deposit
/// - r = Annual interest rate
/// - n = Compounding periods per year
/// - t = Number of years
/// - PMT = Regular contribution
public struct SavingsCalculator: Sendable {

    /// Malta withholding tax rate on interest income (15%).
    private static let withholdingTaxRate: Decimal = Decimal(string: "0.15") ?? 0

    /// Default annual interest rate (3%).
    public static let defaultInterestRate: Decimal = 3

    /// Minimum investment period in years.
    public static let minYears: Int = 1

    /// Maximum investment period in years.
    public static let maxYears: Int = 50

    /// Creates a new savings calculator.
    public init() {}

    /// Calculates compound savings growth with Malta withholding tax.
    /// - Parameter input: The savings parameters.
    /// - Returns: A ``SavingsOutput`` containing balances, tax, and yearly breakdown.
    public func calculate(input: SavingsInput) -> SavingsOutput {
        let n: Int = input.compoundingFrequency == .monthly ? 12 : 1
        let r = input.interestRate / 100
        let periodicRate = r / Decimal(n)

        var yearlyBreakdown: [YearlySavings] = []
        var balance = input.initialDeposit
        var totalContributions = input.initialDeposit
        var totalInterestGross: Money = 0
        var totalWithholdingTax: Money = 0

        for year in 1...input.years {
            let balanceStart = balance
            var yearInterestGross: Money = 0
            let yearContributions = input.monthlyContribution * 12
            totalContributions += yearContributions

            let periodsPerYear = n

            for _ in 1...periodsPerYear {
                // Add monthly contribution at start of period (if monthly compounding)
                if input.compoundingFrequency == .monthly {
                    balance += input.monthlyContribution
                }

                // Calculate interest for this period
                let periodInterest = balance * periodicRate
                yearInterestGross += periodInterest
                balance += periodInterest

            }

            // Add yearly contributions at end of year (if yearly compounding)
            if input.compoundingFrequency == .yearly {
                balance += yearContributions
            }

            // Calculate withholding tax on this year's interest
            let yearWithholdingTax = yearInterestGross * Self.withholdingTaxRate
            let yearInterestNet = yearInterestGross - yearWithholdingTax

            totalInterestGross += yearInterestGross
            totalWithholdingTax += yearWithholdingTax

            yearlyBreakdown.append(YearlySavings(
                year: year,
                balanceStart: balanceStart.rounded(),
                contributions: yearContributions.rounded(),
                interestGross: yearInterestGross.rounded(),
                withholdingTax: yearWithholdingTax.rounded(),
                interestNet: yearInterestNet.rounded(),
                balanceEnd: balance.rounded()
            ))
        }

        let finalBalanceGross = balance
        let totalInterestNet = totalInterestGross - totalWithholdingTax
        let finalBalanceNet = totalContributions + totalInterestNet

        // Calculate effective annual yield after tax
        let effectiveYieldNet: Decimal = totalContributions > 0
            ? ((finalBalanceNet / totalContributions - 1) / Decimal(input.years)) * 100
            : 0

        return SavingsOutput(
            finalBalanceGross: finalBalanceGross.rounded(),
            totalContributions: totalContributions.rounded(),
            totalInterestGross: totalInterestGross.rounded(),
            withholdingTax: totalWithholdingTax.rounded(),
            totalInterestNet: totalInterestNet.rounded(),
            finalBalanceNet: finalBalanceNet.rounded(),
            effectiveYieldNet: effectiveYieldNet.rounded(),
            yearlyBreakdown: yearlyBreakdown
        )
    }
}
