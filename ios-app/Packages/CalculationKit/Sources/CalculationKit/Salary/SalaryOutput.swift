import Foundation

/// Output for a single monthly salary calculation.
public struct SalaryOutput: Sendable, Codable, Equatable {
    /// The calendar month this output represents.
    public let month: Month
    /// Original gross wage from the input.
    public let grossWage: Money
    /// Basic salary (gross wage after clamping to non-negative).
    public let basicSalary: Money
    /// Monthly non-taxable benefit (yearly / 12).
    public let nonTaxBenefit: Money
    /// Monthly taxable benefit (yearly / 12).
    public let taxBenefit: Money
    /// Bonus applied this month.
    public let bonus: Money
    /// Government bonus / COLA applied this month.
    public let governmentBonus: Money
    /// Total gross including all benefits and bonuses.
    public let grossTotal: Money
    /// SSC contribution base (weekly equivalent capped and multiplied by weeks).
    public let sscBase: Money
    /// Social Security Contribution tax for this month.
    public let sscTax: Money
    /// Taxable income base (grossTotal minus non-tax benefit).
    public let incomeBase: Money
    /// Running cumulative income base up to and including this month.
    public let cumulativeIncomeBase: Money
    /// Running cumulative income tax up to and including this month.
    public let cumulativeTax: Money
    /// Income tax deducted this month.
    public let incomeTax: Money
    /// Net pay after SSC and income tax.
    public let net: Money
    /// Amount actually paid (net plus half of allowance bonus).
    public let paid: Money
    /// Discrepancy between gross total and paid amount.
    public let discr: Money
}

/// Annual summary computed from 12 monthly outputs.
public struct SalarySummary: Sendable, Codable, Equatable {
    /// Total gross income for the year.
    public let annualGross: Money
    /// Total SSC paid for the year.
    public let annualSSC: Money
    /// Total income tax paid for the year.
    public let annualIncomeTax: Money
    /// Total net income for the year.
    public let annualNet: Money
    /// Average monthly net income.
    public let averageMonthlyNet: Money
    /// Effective combined tax rate (SSC + income tax as a fraction of gross).
    public let effectiveTaxRate: Decimal

    /// Computes an annual summary from an array of monthly outputs.
    public init(from months: [SalaryOutput]) {
        self.annualGross = months.map(\.grossTotal).reduce(0, +)
        self.annualSSC = months.map(\.sscTax).reduce(0, +)
        self.annualIncomeTax = months.map(\.incomeTax).reduce(0, +)
        self.annualNet = months.map(\.net).reduce(0, +)
        self.averageMonthlyNet = months.isEmpty ? 0 : (annualNet / Decimal(months.count))
        self.effectiveTaxRate = annualGross > 0
            ? (annualSSC + annualIncomeTax) / annualGross
            : 0
    }
}
