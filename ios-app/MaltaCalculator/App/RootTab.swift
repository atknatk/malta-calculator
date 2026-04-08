//
//  RootTab.swift
//  MaltaCalculator
//

import SwiftUI

/// The five primary tabs in the app.
enum RootTab: String, Hashable, CaseIterable, Identifiable, Sendable {
    case home
    case salary
    case calculators
    case guides
    case settings

    var id: String { rawValue }

    /// Localized tab title.
    var title: LocalizedStringResource {
        switch self {
        case .home: "tab.home"
        case .salary: "tab.salary"
        case .calculators: "tab.calculators"
        case .guides: "tab.guides"
        case .settings: "tab.settings"
        }
    }

    /// SF Symbol name for the tab icon.
    var systemImage: String {
        switch self {
        case .home: "sparkles"
        case .salary: "eurosign.circle.fill"
        case .calculators: "function"
        case .guides: "book.fill"
        case .settings: "gearshape.fill"
        }
    }

    /// Accessibility hint describing what happens when the tab is tapped.
    var accessibilityHint: LocalizedStringResource {
        switch self {
        case .home: "tab.home.hint"
        case .salary: "tab.salary.hint"
        case .calculators: "tab.calculators.hint"
        case .guides: "tab.guides.hint"
        case .settings: "tab.settings.hint"
        }
    }
}
