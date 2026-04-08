//
//  SettingsNavigationStack.swift
//  MaltaCalculator
//

import SwiftUI

/// Navigation container for the Settings tab.
struct SettingsNavigationStack: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        @Bindable var router = appState.settingsRouter

        NavigationStack(path: $router.path) {
            SettingsScreen()
                .navigationDestination(for: SettingsDestination.self) { destination in
                    destinationView(for: destination)
                }
        }
    }

    @ViewBuilder
    private func destinationView(for destination: SettingsDestination) -> some View {
        switch destination {
        case .about:
            ComingSoonScreen()
                .navigationTitle(String(localized: "settings.about.title"))
        case .disclaimer:
            DisclaimerScreen()
        case .acknowledgements:
            AcknowledgementsScreen()
        case .whatsNew:
            WhatsNewScreen()
        }
    }
}
