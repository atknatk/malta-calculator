//
//  SettingsRouter.swift
//  MaltaCalculator
//

import Observation
import SwiftUI

/// Navigation destinations within the Settings tab.
enum SettingsDestination: Hashable, Sendable {
    /// Show the about screen.
    case about
    /// Show the legal disclaimer screen.
    case disclaimer
    /// Show the acknowledgements screen.
    case acknowledgements
    /// Show the release notes / changelog.
    case whatsNew
}

/// Manages navigation state for the Settings tab.
@Observable
@MainActor
final class SettingsRouter {
    /// The navigation path for the Settings stack.
    var path = NavigationPath()

    /// Push a destination onto the navigation stack.
    func push(_ destination: SettingsDestination) {
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
