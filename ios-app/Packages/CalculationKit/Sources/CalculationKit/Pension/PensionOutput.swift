import Foundation

/// Result of the Malta state pension calculation.
public struct PensionOutput: Sendable, Codable, Equatable {

    // MARK: - Eligibility

    /// Whether the contributor meets the minimum contribution-year threshold.
    public let isEligible: Bool
    /// Statutory retirement age based on birth year.
    public let retirementAge: Int
    /// Total SSC years required for a full pension.
    public let requiredYears: Int

    // MARK: - Contribution Progression

    /// Actual paid SSC contribution years.
    public let paidYears: Int
    /// Extra credited years for raising children.
    public let childCredits: Int
    /// Paid years plus child credits.
    public let effectiveYears: Int
    /// Ratio of effective years to required years (0--1).
    public let proportion: Decimal

    // MARK: - Pensionable Income

    /// Average salary after applying the MPI cap.
    public let pensionableIncome: Money
    /// Whether the salary exceeds the Maximum Pensionable Income.
    public let isMPICapped: Bool
    /// Maximum Pensionable Income used in the calculation.
    public let mpi: Money

    // MARK: - Core Pension Numbers

    /// Two-thirds formula result before COLA and deferral.
    public let baseAnnualPension: Money
    /// Deferral bonus percentage (0.00--0.29).
    public let deferralBonusRate: Decimal
    /// Absolute bonus amount from deferral.
    public let deferralBonusAmount: Money
    /// Annual COLA addition for pensioners.
    public let annualCola: Money
    /// Final annual pension (base + deferral + COLA).
    public let annualPension: Money
    /// Monthly pension (annual / 12).
    public let monthlyPension: Money
    /// Weekly pension (annual / 52).
    public let weeklyPension: Money

    // MARK: - Private Pension

    /// Capped private pension contribution used for tax credit.
    public let privateContribution: Money
    /// Tax credit earned from the private pension contribution.
    public let privateTaxCredit: Money

    // MARK: - Tax on Pension (2026)

    /// Whether the full pension is under the exemption threshold.
    public let isPensionFullyExempt: Bool
    /// LN 53/2026 exemption ceiling.
    public let pensionExemptionLimit: Money
    /// Portion of pension that is taxable after exemption.
    public let taxablePensionAfterExemption: Money

    // MARK: - Totals

    /// State pension plus private pension tax credit.
    public let totalAnnualIncome: Money

    // MARK: - Metadata

    /// Diagnostic warnings produced during calculation.
    public let warnings: [String]
}
