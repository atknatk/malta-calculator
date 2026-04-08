//
//  HomeScreen.swift
//  MaltaCalculator
//

import SwiftUI

/// Placeholder Home screen showing featured calculators and recent activity.
///
/// The real implementation arrives in a later task. For now this shows a
/// `ContentUnavailableView` so the tab is navigable and testable.
struct HomeScreen: View {
    var body: some View {
        ContentUnavailableView(
            label: {
                Label(
                    String(localized: "home.placeholder.title"),
                    systemImage: "sparkles"
                )
            },
            description: {
                Text("home.placeholder.description")
            }
        )
        .foregroundStyle(.tint)
        .navigationTitle(String(localized: "tab.home"))
        .accessibilityLabel(String(localized: "home.placeholder.accessibilityLabel"))
    }
}

#Preview { NavigationStack { HomeScreen() } }
