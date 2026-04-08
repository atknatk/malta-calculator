//
//  CalculatorsRouter.swift
//  MaltaCalculator
//

import Observation
import SwiftUI

/// Navigation destinations within the Calculators tab.
enum CalculatorsDestination: Hashable, Sendable {
    /// Show a specific calculator detail screen.
    case detail(CalculatorID, params: [String: String] = [:])
    /// Show the calculation history list.
    case history
    /// Show a saved calculation detail.
    case savedDetail(UUID)
}

/// Manages navigation state for the Calculators tab.
@Observable
@MainActor
final class CalculatorsRouter {
    /// The navigation path for the Calculators stack.
    var path = NavigationPath()

    /// Push a destination onto the navigation stack.
    func push(_ destination: CalculatorsDestination) {
        path.append(destination)
    }

    /// Pop the top destination from the navigation stack.
    func pop() {
        guard !path.isEmpty else { return }
        path.removeLast()
    }

    /// Reset the navigation stack to root.
    func popToRoot() {
        path.removeLast(path.count)
    }

    /// Reset the navigation stack entirely.
    func reset() {
        path = NavigationPath()
    }
}
