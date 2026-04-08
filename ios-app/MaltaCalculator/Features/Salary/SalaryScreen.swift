//
//  SalaryScreen.swift
//  MaltaCalculator
//

import SwiftUI

/// Placeholder Salary calculator screen.
///
/// The full salary playground experience is implemented in Task 06.
struct SalaryScreen: View {
    var body: some View {
        ContentUnavailableView(
            label: {
                Label(
                    String(localized: "salary.placeholder.title"),
                    systemImage: "eurosign.circle.fill"
                )
            },
            description: {
                Text("salary.placeholder.description")
            }
        )
        .foregroundStyle(.tint)
        .navigationTitle(String(localized: "tab.salary"))
        .accessibilityLabel(String(localized: "salary.placeholder.accessibilityLabel"))
    }
}

#Preview { NavigationStack { SalaryScreen() } }
