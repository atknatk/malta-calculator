//
//  GuidesRouter.swift
//  MaltaCalculator
//

import Observation
import SwiftUI

/// Navigation destinations within the Guides tab.
enum GuidesDestination: Hashable, Sendable {
    /// Show a guide reader for the given slug.
    case reader(String)
    /// Show the bookmarked guides list.
    case bookmarks
}

/// Manages navigation state for the Guides tab.
@Observable
@MainActor
final class GuidesRouter {
    /// The navigation path for the Guides stack.
    var path = NavigationPath()

    /// Push a destination onto the navigation stack.
    func push(_ destination: GuidesDestination) {
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
