//
//  SettingsViewModel.swift
//  MaltaCalculator
//

import Foundation
import Observation
import SwiftData
import SwiftUI
import os

/// Observable view model backing the Settings tab.
///
/// Owns handles to ``UserPreferencesStore`` and ``SavedCalculationStore``
/// and exposes derived counters, the app version, and destructive
/// actions (clear history, clear bookmarks, export). Views bind to the
/// view model and never touch SwiftData directly.
@Observable
@MainActor
final class SettingsViewModel {
    /// Preference row store. Public so the view can bind to typed setters.
    let preferencesStore: UserPreferencesStore
    /// Saved calculation store used to derive the count + bulk delete.
    let calculationsStore: SavedCalculationStore
    /// The owning SwiftData context.
    let modelContext: ModelContext

    /// Toggles the "Clear History?" destructive confirmation alert.
    var showingClearHistoryAlert: Bool = false
    /// Toggles the "Clear Bookmarks?" destructive confirmation alert.
    var showingClearBookmarksAlert: Bool = false
    /// Toggles the "Restart Required" informational alert.
    var showingICloudRestartAlert: Bool = false
    /// Toggles presentation of the export share sheet.
    var showingExportSheet: Bool = false
    /// Last successfully exported data blob (raw JSON bytes).
    var exportedData: Data?
    /// On-disk URL of the last export, suitable for a share sheet.
    var exportedURL: URL?
    /// Bookmark count, refreshed on ``refreshDerived()``.
    private(set) var bookmarkedCount: Int = 0
    /// Human readable storage footprint, refreshed on ``refreshDerived()``.
    private(set) var storageUsed: String = "—"

    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "SettingsViewModel"
    )

    /// Create a view model bound to the given SwiftData context.
    init(modelContext: ModelContext) {
        self.modelContext = modelContext
        self.preferencesStore = UserPreferencesStore(context: modelContext)
        self.calculationsStore = SavedCalculationStore(context: modelContext)
        self.calculationsStore.refresh()
        refreshDerived()
    }

    /// Number of saved calculations currently on disk.
    var savedCount: Int { calculationsStore.items.count }

    /// Human readable "1.0.0 (42)" version string.
    var appVersion: String {
        let info = Bundle.main.infoDictionary ?? [:]
        let version = info["CFBundleShortVersionString"] as? String ?? "?"
        let build = info["CFBundleVersion"] as? String ?? "?"
        return "\(version) (\(build))"
    }

    /// Cached tax config version surfaced by ``UserPreferences``.
    var taxConfigVersion: String {
        preferencesStore.preferences.taxConfigVersion ?? "2026.1"
    }

    /// Refreshes computed counts (bookmarks, storage) for display.
    func refreshDerived() {
        let descriptor = FetchDescriptor<GuideBookmark>()
        bookmarkedCount = (try? modelContext.fetch(descriptor).count) ?? 0
        storageUsed = Self.computeStorageUsed(for: modelContext)
    }

    /// Destructive: delete all saved calculations.
    func clearHistory() {
        do {
            try calculationsStore.deleteAll()
        } catch {
            log.error("clearHistory failed: \(error.localizedDescription, privacy: .public)")
        }
    }

    /// Destructive: delete all guide bookmarks.
    func clearBookmarks() {
        let descriptor = FetchDescriptor<GuideBookmark>()
        guard let bookmarks = try? modelContext.fetch(descriptor) else { return }
        for bookmark in bookmarks {
            modelContext.delete(bookmark)
        }
        do {
            try modelContext.save()
        } catch {
            log.error("clearBookmarks save failed: \(error.localizedDescription, privacy: .public)")
        }
        refreshDerived()
    }

    /// Build the export file and arm the share sheet.
    func exportAllData() {
        let exporter = ExportService(context: modelContext)
        do {
            exportedData = try exporter.exportAllCalculations()
            exportedURL = try exporter.writeExportToTemporaryFile()
            showingExportSheet = exportedURL != nil
        } catch {
            log.error("exportAllData failed: \(error.localizedDescription, privacy: .public)")
            exportedData = nil
            exportedURL = nil
            showingExportSheet = false
        }
    }

    /// Update the persisted theme choice.
    func setTheme(_ theme: AppTheme) {
        preferencesStore.theme = theme
        UserDefaults.standard.set(theme.rawValue, forKey: Self.themeDefaultsKey)
    }

    /// Toggle iCloud sync and surface the "restart required" alert.
    func setICloudSyncEnabled(_ enabled: Bool) {
        preferencesStore.iCloudSyncEnabled = enabled
        showingICloudRestartAlert = true
    }

    /// Update the default tax year preference.
    func setDefaultYear(_ year: Int) {
        preferencesStore.update { $0.defaultYear = year }
    }

    /// `UserDefaults` key mirrored so the app root can read the theme
    /// before SwiftData is available.
    static let themeDefaultsKey = "appThemeRaw"

    private static func computeStorageUsed(for context: ModelContext) -> String {
        guard let url = context.container.configurations.first?.url else {
            return "—"
        }
        let size = (try? FileManager.default.attributesOfItem(atPath: url.path)[.size] as? Int) ?? 0
        return ByteCountFormatter.string(fromByteCount: Int64(size), countStyle: .file)
    }
}
