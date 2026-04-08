//
//  AppState.swift
//  MaltaCalculator
//

import Observation
import SwiftUI
import os

/// Central application state that owns per-tab routers and handles deep links.
///
/// Injected into the environment from ``RootView`` so any descendant can
/// read `selectedTab` or access the appropriate router.
@Observable
@MainActor
final class AppState {
    /// The currently selected tab.
    var selectedTab: RootTab = .home

    /// Per-tab navigation routers.
    let homeRouter = HomeRouter()
    let salaryRouter = SalaryRouter()
    let calculatorsRouter = CalculatorsRouter()
    let guidesRouter = GuidesRouter()
    let settingsRouter = SettingsRouter()

    /// Resolves incoming URLs to in-app destinations.
    let deepLinkParser = DeepLinkParser()

    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "AppState"
    )

    /// Handle an incoming deep link URL.
    ///
    /// - Parameter url: The URL to parse and route.
    func handle(url: URL) {
        guard let destination = deepLinkParser.parse(url) else {
            log.info("Ignored unrecognised URL: \(url.absoluteString, privacy: .public)")
            return
        }
        log.info("Routing deep link: \(url.absoluteString, privacy: .public)")
        route(to: destination)
    }

    // MARK: - Private

    private func route(to destination: DeepLinkDestination) {
        switch destination {
        case .calculator(let id, let params):
            selectedTab = .calculators
            calculatorsRouter.push(.detail(id, params: params))

        case .salary(let params):
            selectedTab = .salary
            salaryRouter.reset(with: params)

        case .guide(let slug):
            selectedTab = .guides
            guidesRouter.push(.reader(slug))

        case .settings:
            selectedTab = .settings
        }
    }
}
