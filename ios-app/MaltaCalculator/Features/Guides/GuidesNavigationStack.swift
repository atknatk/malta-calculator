//
//  GuidesNavigationStack.swift
//  MaltaCalculator
//

import SwiftUI

/// Navigation container for the Guides tab.
struct GuidesNavigationStack: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        @Bindable var router = appState.guidesRouter

        NavigationStack(path: $router.path) {
            GuidesListScreen()
                .navigationDestination(for: GuidesDestination.self) { destination in
                    destinationView(for: destination)
                }
        }
    }

    @ViewBuilder
    private func destinationView(for destination: GuidesDestination) -> some View {
        switch destination {
        case .reader:
            ComingSoonScreen()
                .navigationTitle(String(localized: "guides.reader.title"))
        case .bookmarks:
            ComingSoonScreen()
                .navigationTitle(String(localized: "guides.bookmarks.title"))
        }
    }
}
