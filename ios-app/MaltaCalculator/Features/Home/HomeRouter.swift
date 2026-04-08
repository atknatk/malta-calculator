//
//  HomeRouter.swift
//  MaltaCalculator
//

import Observation
import SwiftUI

/// Navigation destinations within the Home tab.
enum HomeDestination: Hashable, Sendable {
    /// Navigate to a featured calculator.
    case calculator(CalculatorID)
    /// Navigate to a featured guide.
    case guide(slug: String)
}

/// Manages navigation state for the Home tab.
@Observable
@MainActor
final class HomeRouter {
    /// The navigation path for the Home stack.
    var path = NavigationPath()

    /// Push a destination onto the navigation stack.
    func push(_ destination: HomeDestination) {
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
}
