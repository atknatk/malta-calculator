import Foundation

/// Simplified tax status used by the UI layer.
public enum SimpleTaxType: String, CaseIterable, Codable, Sendable {
    case single
    case married
    case parent
}

/// Full tax-rate category including child-count variants (2026+).
public enum TaxRateType: String, CaseIterable, Codable, Sendable {
    case single
    case married
    case marriedOneChild = "married_1child"
    case marriedTwoPlus = "married_2plus"
    case parent
    case parentOneChild = "parent_1child"
    case parentTwoPlus = "parent_2plus"
}

/// SSC contribution category.
public enum SSCCategory: String, CaseIterable, Codable, Sendable {
    case a = "A" // Under 18
    case b = "B" // Part-time or below minimum wage
    case c = "C" // Full-time employee
    case d = "D" // Self-employed
}

/// Resolves a simplified tax type and child count to the full `TaxRateType`.
///
/// Before 2026, child count has no effect on tax brackets.
public func resolveTaxRateType(
    year: Int,
    simpleType: SimpleTaxType,
    childCount: Int = 0
) -> TaxRateType {
    guard year >= 2026 else {
        switch simpleType {
        case .single: return .single
        case .married: return .married
        case .parent: return .parent
        }
    }

    switch simpleType {
    case .single:
        return .single
    case .married:
        switch childCount {
        case 0: return .married
        case 1: return .marriedOneChild
        default: return .marriedTwoPlus
        }
    case .parent:
        switch childCount {
        case 0: return .parent
        case 1: return .parentOneChild
        default: return .parentTwoPlus
        }
    }
}
