//
//  CalculatorCategory.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// A grouping bucket used to organise calculators on the Calculators Hub.
///
/// Ordering of `allCases` defines the default display order on the hub.
enum CalculatorCategory: String, CaseIterable, Hashable, Sendable, Codable {
    case employment
    case family
    case property
    case banking
    case retirement
    case selfEmployment = "self_employment"
    case leave
    case transport
    case immigration

    /// Localized section title for this category.
    var title: String {
        switch self {
        case .employment: String(localized: "calculators.category.employment")
        case .family: String(localized: "calculators.category.family")
        case .property: String(localized: "calculators.category.property")
        case .banking: String(localized: "calculators.category.banking")
        case .retirement: String(localized: "calculators.category.retirement")
        case .selfEmployment: String(localized: "calculators.category.selfEmployment")
        case .leave: String(localized: "calculators.category.leave")
        case .transport: String(localized: "calculators.category.transport")
        case .immigration: String(localized: "calculators.category.immigration")
        }
    }

    /// SF Symbol displayed in the section header.
    var symbolName: String {
        switch self {
        case .employment: "briefcase.fill"
        case .family: "figure.2.and.child.holdinghands"
        case .property: "house.fill"
        case .banking: "building.columns.fill"
        case .retirement: "leaf.fill"
        case .selfEmployment: "person.crop.circle.badge.checkmark"
        case .leave: "calendar"
        case .transport: "car.fill"
        case .immigration: "airplane"
        }
    }

    /// Gradient color pair used for the category badge.
    var gradientColors: [Color] {
        switch self {
        case .employment: DSColor.categoryEmployment
        case .family: DSColor.categoryFamily
        case .property: DSColor.categoryProperty
        case .banking: DSColor.categoryBanking
        case .retirement: DSColor.categoryRetirement
        case .selfEmployment: DSColor.categorySelfEmp
        case .leave: DSColor.categoryLeave
        case .transport: DSColor.categoryTransport
        case .immigration: DSColor.categoryImmigration
        }
    }
}
