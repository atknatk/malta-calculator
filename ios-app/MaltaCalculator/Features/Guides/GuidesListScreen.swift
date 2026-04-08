//
//  GuidesListScreen.swift
//  MaltaCalculator
//

import SwiftUI

/// Placeholder Guides list screen.
///
/// The full markdown reader experience is implemented in Task 09.
struct GuidesListScreen: View {
    var body: some View {
        ContentUnavailableView(
            label: {
                Label(
                    String(localized: "guides.placeholder.title"),
                    systemImage: "book.fill"
                )
            },
            description: {
                Text("guides.placeholder.description")
            }
        )
        .foregroundStyle(.tint)
        .navigationTitle(String(localized: "tab.guides"))
        .accessibilityLabel(String(localized: "guides.placeholder.accessibilityLabel"))
    }
}

#Preview { NavigationStack { GuidesListScreen() } }
