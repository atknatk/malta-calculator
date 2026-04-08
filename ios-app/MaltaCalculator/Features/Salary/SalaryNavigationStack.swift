//
//  SalaryNavigationStack.swift
//  MaltaCalculator
//

import SwiftUI

/// Navigation container for the Salary tab.
struct SalaryNavigationStack: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        @Bindable var router = appState.salaryRouter

        NavigationStack(path: $router.path) {
            SalaryScreen()
                .navigationDestination(for: SalaryDestination.self) { destination in
                    destinationView(for: destination)
                }
        }
    }

    @ViewBuilder
    private func destinationView(for destination: SalaryDestination) -> some View {
        switch destination {
        case .history:
            ComingSoonScreen()
                .navigationTitle(String(localized: "salary.history.title"))
        }
    }
}
