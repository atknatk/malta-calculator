//
//  UserPreferencesStore.swift
//  MaltaCalculator
//

import Foundation
import Observation
import SwiftData
import SwiftUI
import os

/// `@Observable` wrapper that surfaces the singleton ``UserPreferences``
/// row and guarantees its existence on first launch.
@Observable
@MainActor
final class UserPreferencesStore {
    /// The persistent singleton preference row.
    private(set) var preferences: UserPreferences

    private let context: ModelContext
    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "UserPreferencesStore"
    )

    init(context: ModelContext) {
        self.context = context
        let descriptor = FetchDescriptor<UserPreferences>(
            predicate: #Predicate { $0.id == "default" }
        )
        if let existing = (try? context.fetch(descriptor))?.first {
            self.preferences = existing
        } else {
            let fresh = UserPreferences()
            context.insert(fresh)
            do {
                try context.save()
            } catch {
                // Non-fatal: the in-memory value is still valid.
            }
            self.preferences = fresh
        }
    }

    /// Mutates the preference row inside a closure and persists.
    func update(_ block: (UserPreferences) -> Void) {
        block(preferences)
        do {
            try context.save()
        } catch {
            log.error("save failed: \(error.localizedDescription, privacy: .public)")
        }
    }

    /// Typed accessor for the user's theme choice.
    var theme: AppTheme {
        get { AppTheme(rawValue: preferences.themeRawValue) ?? .system }
        set {
            update { $0.themeRawValue = newValue.rawValue }
        }
    }

    /// Typed accessor for the iCloud opt-in toggle.
    var iCloudSyncEnabled: Bool {
        get { preferences.iCloudSyncEnabled }
        set {
            update { $0.iCloudSyncEnabled = newValue }
            // Mirror to UserDefaults so the next launch can build the
            // ModelContainer with the right CloudKit configuration
            // before the SwiftData context is available.
            UserDefaults.standard.set(newValue, forKey: UserPreferencesStore.iCloudDefaultsKey)
        }
    }

    /// `UserDefaults` key used by ``MaltaCalculatorApp`` before the
    /// SwiftData context exists.
    static let iCloudDefaultsKey = "iCloudSyncEnabled"
}
