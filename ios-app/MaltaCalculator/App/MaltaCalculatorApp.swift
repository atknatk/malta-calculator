//
//  MaltaCalculatorApp.swift
//  MaltaCalculator
//

import SwiftData
import SwiftUI

/// Application entry point.
///
/// Hosts the ``RootView`` which contains the five-tab navigation
/// structure, and wires up the SwiftData ``ModelContainer`` for the
/// persistence layer (Task 10). iCloud sync is opt-in: the container
/// is built with `.none` by default and only uses CloudKit when the
/// user has flipped the toggle in Settings on a previous launch.
@main
struct MaltaCalculatorApp: App {
    @AppStorage(SettingsViewModel.themeDefaultsKey) private var themeRaw: String = AppTheme.system.rawValue

    private var theme: AppTheme {
        AppTheme(rawValue: themeRaw) ?? .system
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .tint(.accentColor)
                .preferredColorScheme(theme.colorScheme)
        }
        .modelContainer(MaltaCalculatorApp.makeContainer())
    }

    /// Builds the SwiftData container used by the app.
    ///
    /// The iCloud preference is mirrored to `UserDefaults` so it can be
    /// read before the SwiftData context exists.
    static func makeContainer() -> ModelContainer {
        let schema = Schema([
            SavedCalculation.self,
            CalculatorUsage.self,
            GuideBookmark.self,
            UserPreferences.self
        ])

        let useICloud = UserDefaults.standard.bool(
            forKey: UserPreferencesStore.iCloudDefaultsKey
        )

        let configuration: ModelConfiguration
        if useICloud {
            configuration = ModelConfiguration(
                schema: schema,
                isStoredInMemoryOnly: false,
                cloudKitDatabase: .private("iCloud.com.maltacalculator.app")
            )
        } else {
            configuration = ModelConfiguration(
                schema: schema,
                isStoredInMemoryOnly: false,
                cloudKitDatabase: .none
            )
        }

        do {
            return try ModelContainer(for: schema, configurations: [configuration])
        } catch {
            // Fall back to an in-memory container so the app still
            // launches if the on-disk store is unreadable (e.g. during
            // a botched migration). The user's next action will be
            // prompted to reset the store from Settings.
            let fallback = ModelConfiguration(
                schema: schema,
                isStoredInMemoryOnly: true
            )
            do {
                return try ModelContainer(for: schema, configurations: [fallback])
            } catch {
                fatalError("Failed to create SwiftData container: \(error)")
            }
        }
    }
}
