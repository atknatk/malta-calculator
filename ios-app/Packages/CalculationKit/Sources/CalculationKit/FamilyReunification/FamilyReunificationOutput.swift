import Foundation

/// Result of the family reunification calculation.
public struct FamilyReunificationOutput: Sendable, Codable, Equatable {
    /// Minimum required income.
    public let minimumRequired: Money
    /// Type of income (gross or net).
    public let incomeType: String
    /// Base wage used in calculation.
    public let baseWage: Money
    /// Additional amount for family members.
    public let additionalAmount: Money
    /// Percentage added per family member.
    public let percentagePerMember: Decimal
    /// Base amount in the breakdown.
    public let breakdownBase: Money
    /// Per-member addition in the breakdown.
    public let breakdownPerMemberAddition: Money
    /// Total addition in the breakdown.
    public let breakdownTotalAddition: Money
    /// Scheme name.
    public let schemeName: String
}
