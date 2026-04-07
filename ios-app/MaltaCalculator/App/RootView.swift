//
//  RootView.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// Placeholder root view shown by the bootstrap build.
///
/// The real navigation tree (TabView with Home / Salary / Calculators /
/// Guides / Settings) lands in Task 05. For now this view exists so the
/// app launches with a recognisable Malta Calculator surface and so the
/// `DesignSystem.liquidGlass()` modifier is exercised end-to-end.
struct RootView: View {
    var body: some View {
        ZStack {
            backgroundLayer
            VStack(spacing: 16) {
                Image(systemName: "sparkles")
                    .font(.system(size: 60))
                    .foregroundStyle(.tint)
                    .accessibilityHidden(true)
                Text("Malta Calculator")
                    .font(.system(.largeTitle, design: .serif, weight: .bold))
                Text("Coming soon")
                    .foregroundStyle(.secondary)
            }
            .padding(40)
            .liquidGlass()
            .padding()
            .accessibilityElement(children: .combine)
            .accessibilityLabel("Malta Calculator. Coming soon.")
        }
    }

    private var backgroundLayer: some View {
        LinearGradient(
            colors: [
                Color(red: 0.98, green: 0.97, blue: 0.95),
                Color(red: 0.95, green: 0.91, blue: 0.84)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .ignoresSafeArea()
    }
}

#Preview { RootView() }
