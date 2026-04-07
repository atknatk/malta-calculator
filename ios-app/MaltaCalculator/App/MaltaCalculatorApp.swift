//
//  MaltaCalculatorApp.swift
//  MaltaCalculator
//

import SwiftData
import SwiftUI

/// Application entry point.
///
/// The bootstrap (Task 01) ships only the placeholder `RootView`. Real
/// navigation, persistence, and feature wiring land in Task 05 and beyond.
@main
struct MaltaCalculatorApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
                .tint(.accentColor)
        }
    }
}
