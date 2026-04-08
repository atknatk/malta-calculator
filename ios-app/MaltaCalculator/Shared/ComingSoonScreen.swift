//
//  ComingSoonScreen.swift
//  MaltaCalculator
//

import SwiftUI

/// Placeholder screen shown for features not yet implemented.
struct ComingSoonScreen: View {
    /// Optional calculator ID for calculator-specific placeholders.
    let id: CalculatorID?

    init(id: CalculatorID? = nil) {
        self.id = id
    }

    var body: some View {
        ContentUnavailableView(
            label: {
                Label(
                    String(localized: "screen.comingSoon.title"),
                    systemImage: "hourglass.circle.fill"
                )
            },
            description: {
                if let id {
                    Text("screen.comingSoon.calculatorDescription \(id.displayName)")
                } else {
                    Text("screen.comingSoon.description")
                }
            }
        )
        .foregroundStyle(.tint)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(String(localized: "screen.comingSoon.accessibilityLabel"))
    }
}

#Preview("Generic") {
    ComingSoonScreen()
}

#Preview("Calculator") {
    ComingSoonScreen(id: .mortgage)
}
