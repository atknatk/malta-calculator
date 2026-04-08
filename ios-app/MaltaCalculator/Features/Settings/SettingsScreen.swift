//
//  SettingsScreen.swift
//  MaltaCalculator
//

import SwiftUI

/// Placeholder Settings screen.
///
/// The full settings with localization, theme, and year override
/// is implemented in Task 12.
struct SettingsScreen: View {
    var body: some View {
        ContentUnavailableView(
            label: {
                Label(
                    String(localized: "settings.placeholder.title"),
                    systemImage: "gearshape.fill"
                )
            },
            description: {
                Text("settings.placeholder.description")
            }
        )
        .foregroundStyle(.tint)
        .navigationTitle(String(localized: "tab.settings"))
        .accessibilityLabel(String(localized: "settings.placeholder.accessibilityLabel"))
    }
}

#Preview { NavigationStack { SettingsScreen() } }
