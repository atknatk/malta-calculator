//
//  SalaryRouter.swift
//  MaltaCalculator
//

import Observation
import SwiftUI

/// Navigation destinations within the Salary tab.
enum SalaryDestination: Hashable, Sendable {
    /// Show the salary calculation history.
    case history
}

/// Manages navigation state for the Salary tab.
@Observable
@MainActor
final class SalaryRouter {
    /// The navigation path for the Salary stack.
    var path = NavigationPath()

    /// Optional initial parameters from a deep link.
    var initialParams: [String: String] = [:]

    /// Push a destination onto the navigation stack.
    func push(_ destination: SalaryDestination) {
        path.append(destination)
    }

    /// Pop the top destination from the navigation stack.
    func pop() {
        guard !path.isEmpty else { return }
        path.removeLast()
    }

    /// Reset the navigation stack and apply deep link parameters.
    func reset(with params: [String: String]) {
        path = NavigationPath()
        initialParams = params
    }
}
