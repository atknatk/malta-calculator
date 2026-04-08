//
//  CalculatorsHubScreen.swift
//  MaltaCalculator
//

import SwiftUI

/// Placeholder Calculators hub showing the grid of available calculators.
///
/// The full grid with categories and search is implemented in Task 07.
struct CalculatorsHubScreen: View {
    var body: some View {
        ContentUnavailableView(
            label: {
                Label(
                    String(localized: "calculators.placeholder.title"),
                    systemImage: "function"
                )
            },
            description: {
                Text("calculators.placeholder.description")
            }
        )
        .foregroundStyle(.tint)
        .navigationTitle(String(localized: "tab.calculators"))
        .accessibilityLabel(String(localized: "calculators.placeholder.accessibilityLabel"))
    }
}

#Preview { NavigationStack { CalculatorsHubScreen() } }
