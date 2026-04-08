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
/// `DesignSystem` components are exercised end-to-end.
struct RootView: View {
    var body: some View {
        ZStack {
            MeshBackground()
            VStack(spacing: DSSpacing.md) {
                Image(systemName: "sparkles")
                    .font(.system(size: 60))
                    .foregroundStyle(DSColor.maltaGold)
                    .accessibilityHidden(true)
                GradientText("Malta Calculator", font: DSFont.displayS)
                Text("Coming soon")
                    .font(DSFont.bodyM)
                    .foregroundStyle(DSColor.textSecondary)
            }
            .padding(DSSpacing.xxl)
            .liquidGlass()
            .padding()
            .accessibilityElement(children: .combine)
            .accessibilityLabel("Malta Calculator. Coming soon.")
        }
    }
}

#Preview { RootView() }
