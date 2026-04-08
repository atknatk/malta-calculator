//
//  MaltaCalculatorApp.swift
//  MaltaCalculator
//

import SwiftUI

/// Application entry point.
///
/// Hosts the ``RootView`` which contains the five-tab navigation
/// structure. Persistence (SwiftData) and further scene configuration
/// land in later tasks.
@main
struct MaltaCalculatorApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
                .tint(.accentColor)
        }
    }
}
