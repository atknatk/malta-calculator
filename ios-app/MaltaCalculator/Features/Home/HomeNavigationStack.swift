//
//  HomeNavigationStack.swift
//  MaltaCalculator
//

import SwiftUI

/// Navigation container for the Home tab.
struct HomeNavigationStack: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        @Bindable var router = appState.homeRouter

        NavigationStack(path: $router.path) {
            HomeScreen()
                .navigationDestination(for: HomeDestination.self) { destination in
                    destinationView(for: destination)
                }
        }
    }

    @ViewBuilder
    private func destinationView(for destination: HomeDestination) -> some View {
        switch destination {
        case .calculator(let id):
            CalculatorDetailFactory.view(for: id)
        case .guide:
            ComingSoonScreen()
                .navigationTitle(String(localized: "guides.title"))
                .accessibilityLabel(
                    String(localized: "screen.comingSoon.label")
                )
        }
    }
}
