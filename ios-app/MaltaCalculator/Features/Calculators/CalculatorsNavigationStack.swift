//
//  CalculatorsNavigationStack.swift
//  MaltaCalculator
//

import SwiftUI

/// Navigation container for the Calculators tab.
struct CalculatorsNavigationStack: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        @Bindable var router = appState.calculatorsRouter

        NavigationStack(path: $router.path) {
            CalculatorsHubScreen()
                .navigationDestination(for: CalculatorsDestination.self) { destination in
                    destinationView(for: destination)
                }
        }
    }

    @ViewBuilder
    private func destinationView(for destination: CalculatorsDestination) -> some View {
        switch destination {
        case .detail(let id, let params):
            CalculatorDetailFactory.view(for: id, initialParams: params)
        case .history:
            ComingSoonScreen()
                .navigationTitle(String(localized: "calculators.history.title"))
        case .savedDetail:
            ComingSoonScreen()
                .navigationTitle(String(localized: "calculators.savedDetail.title"))
        }
    }
}
