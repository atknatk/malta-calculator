import Foundation

/// Scheme type for family reunification calculation.
public enum SchemeType: String, CaseIterable, Codable, Sendable {
    case familyReunification = "family-reunification"
    case familyMemberPolicy = "family-member-policy"
}

/// Input for the family reunification calculator.
public struct FamilyReunificationInput: Sendable, Codable, Equatable {
    /// Number of family members to sponsor.
    public var familyMemberCount: Int
    /// Which scheme to calculate.
    public var scheme: SchemeType
    /// Optional custom base wage override.
    public var customBaseWage: Money?

    public init(familyMemberCount: Int, scheme: SchemeType, customBaseWage: Money? = nil) {
        self.familyMemberCount = familyMemberCount
        self.scheme = scheme
        self.customBaseWage = customBaseWage
    }
}
