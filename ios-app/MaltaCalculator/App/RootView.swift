//
//  RootView.swift
//  MaltaCalculator
//

import SwiftUI

/// Root view containing the five-tab navigation structure.
///
/// On iOS 26, the tab bar renders as a floating Liquid Glass surface.
/// On iOS 18, it falls back to the standard UITabBar with tint applied.
/// ``AppState`` is injected into the environment so all descendant views
/// can access the selected tab and per-tab routers.
struct RootView: View {
    @State private var appState = AppState()

    var body: some View {
        TabView(selection: $appState.selectedTab) {
            ForEach(RootTab.allCases) { tab in
                tabContent(for: tab)
                    .tabItem {
                        Label(tab.title, systemImage: tab.systemImage)
                    }
                    .tag(tab)
                    .accessibilityHint(tab.accessibilityHint)
            }
        }
        .tabViewStyle(.sidebarAdaptable)
        .tint(.accentColor)
        .environment(appState)
        .onOpenURL { url in
            appState.handle(url: url)
        }
    }

    @ViewBuilder
    private func tabContent(for tab: RootTab) -> some View {
        switch tab {
        case .home:
            HomeNavigationStack()
        case .salary:
            SalaryNavigationStack()
        case .calculators:
            CalculatorsNavigationStack()
        case .guides:
            GuidesNavigationStack()
        case .settings:
            SettingsNavigationStack()
        }
    }
}

#Preview { RootView() }
