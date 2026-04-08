//
//  DeepLinkDestination.swift
//  MaltaCalculator
//

import Foundation

/// Represents a resolved deep link target within the app.
enum DeepLinkDestination: Hashable, Sendable {
    /// Navigate to a specific calculator with optional query parameters.
    case calculator(CalculatorID, params: [String: String])
    /// Navigate to the salary calculator with optional query parameters.
    case salary(params: [String: String])
    /// Navigate to a specific guide by its slug.
    case guide(slug: String)
    /// Navigate to the settings tab.
    case settings
}
