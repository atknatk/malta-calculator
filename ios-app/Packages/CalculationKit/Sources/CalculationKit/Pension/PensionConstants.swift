import Foundation

/// 2026 pension calculation constants.
///
/// Sources: Social Security Act Cap. 318, LN 53/2026,
/// Department of Social Security schedules.
public enum PensionConstants {
    /// Maximum Pensionable Income for 2026 (MPI = max pension / (2/3)).
    public static let mpi2026: Money = 29_083
    /// Weekly COLA addition for pensioners in 2026 (EUR/week).
    public static let weeklyColaPensioner2026: Money = 10
    /// Minimum SSC contribution years to qualify for any state pension.
    public static let minContributionYears: Int = 10
    /// Maximum private pension contribution eligible for tax credit.
    public static let privatePensionMaxContribution: Money = 3_000
    /// Tax credit rate applied to private pension contributions (25 %).
    public static let privatePensionTaxCreditRate: Decimal = Decimal(string: "0.25") ?? 0
    /// Absolute cap on the private pension tax credit.
    public static let privatePensionMaxCredit: Money = 750
    /// LN 53/2026 — 100 % pension income exemption up to this limit.
    public static let pensionExemptionLimit2026: Money = 37_104
}
