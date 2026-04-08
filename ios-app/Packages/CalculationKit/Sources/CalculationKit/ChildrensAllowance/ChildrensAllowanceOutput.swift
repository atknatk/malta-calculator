import Foundation

/// Rate type classification for children's allowance.
public enum AllowanceRateType: String, Codable, Sendable {
    case maximum
    case variable
    case minimum
    case fixed
}

/// Result of the children's allowance calculation.
public struct ChildrensAllowanceOutput: Sendable, Codable, Equatable {
    /// Total income from all sources.
    public let totalIncome: Money
    /// Net income after SSC and tax deductions.
    public let netIncome: Money
    /// Weekly rate per child.
    public let weeklyPerChild: Money
    /// Weekly rate for all children.
    public let weeklyForAll: Money
    /// Yearly rate per child.
    public let yearlyPerChild: Money
    /// Yearly rate for all children.
    public let yearlyForAll: Money
    /// Quarterly payment (every 13 weeks).
    public let quarterlyPayment: Money
    /// Whether income is above the threshold.
    public let isAboveThreshold: Bool
    /// The applicable rate type.
    public let rateType: AllowanceRateType
}

/// Result of the birth bonus calculation.
public struct BirthBonusResult: Sendable, Codable, Equatable {
    /// Birth order of the child.
    public let childOrder: Int
    /// Bonus amount in EUR.
    public let bonusAmount: Money
}
