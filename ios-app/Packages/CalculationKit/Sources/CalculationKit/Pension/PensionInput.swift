import Foundation

/// Deferral years (0--4) for pension bonus calculation.
///
/// Malta's deferred pension scheme allows retirees to postpone their
/// pension by up to four years in exchange for a cumulative bonus rate.
public enum DeferralYears: Int, CaseIterable, Codable, Sendable {
    /// No deferral.
    case zero = 0
    /// One-year deferral (5 % bonus).
    case one = 1
    /// Two-year deferral (10 % bonus).
    case two = 2
    /// Three-year deferral (18 % bonus).
    case three = 3
    /// Four-year deferral (29 % bonus).
    case four = 4
}

/// Input for the Malta state pension calculator.
///
/// All monetary fields use ``Money`` (`Decimal`) to avoid floating-point errors.
public struct PensionInput: Sendable, Codable, Equatable {
    /// Year the person was born.
    public var birthYear: Int
    /// Simplified tax/marital status.
    public var taxStatus: SimpleTaxType
    /// Number of dependent children (capped at 3 for credit purposes).
    public var children: Int
    /// Total years of paid SSC contributions.
    public var paidYears: Int
    /// Best-years average gross annual salary in EUR.
    public var averageSalary: Money
    /// Number of years the pension is deferred (0--4).
    public var deferralYears: DeferralYears
    /// Annual private pension contribution in EUR.
    public var privatePensionContribution: Money

    /// Creates a new pension input.
    public init(
        birthYear: Int,
        taxStatus: SimpleTaxType,
        children: Int,
        paidYears: Int,
        averageSalary: Money,
        deferralYears: DeferralYears,
        privatePensionContribution: Money
    ) {
        self.birthYear = birthYear
        self.taxStatus = taxStatus
        self.children = children
        self.paidYears = paidYears
        self.averageSalary = averageSalary
        self.deferralYears = deferralYears
        self.privatePensionContribution = privatePensionContribution
    }
}
