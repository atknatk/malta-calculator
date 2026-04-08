//
//  SettingsViewModelTests.swift
//  MaltaCalculatorTests
//

import Foundation
import SwiftData
import Testing

@testable import MaltaCalculator

@Suite("SettingsViewModel")
@MainActor
struct SettingsViewModelTests {
    private func makeContext() throws -> ModelContext {
        let schema = Schema([
            SavedCalculation.self,
            CalculatorUsage.self,
            GuideBookmark.self,
            UserPreferences.self
        ])
        let config = ModelConfiguration(
            schema: schema,
            isStoredInMemoryOnly: true
        )
        let container = try ModelContainer(
            for: schema,
            configurations: [config]
        )
        return ModelContext(container)
    }

    @Test("appVersion returns a valid version string")
    func appVersion() throws {
        let context = try makeContext()
        let vm = SettingsViewModel(modelContext: context)
        #expect(vm.appVersion.contains("("))
    }

    @Test("taxConfigVersion defaults to 2026.1")
    func taxConfigVersion() throws {
        let context = try makeContext()
        let vm = SettingsViewModel(modelContext: context)
        #expect(vm.taxConfigVersion == "2026.1")
    }

    @Test("setTheme persists choice in preferences store")
    func setTheme() throws {
        let context = try makeContext()
        let vm = SettingsViewModel(modelContext: context)
        vm.setTheme(.dark)
        #expect(vm.preferencesStore.theme == .dark)
    }

    @Test("setDefaultYear persists year in preferences store")
    func setDefaultYear() throws {
        let context = try makeContext()
        let vm = SettingsViewModel(modelContext: context)
        vm.setDefaultYear(2024)
        #expect(vm.preferencesStore.preferences.defaultYear == 2024)
    }

    @Test("setICloudSyncEnabled triggers restart alert")
    func iCloudToggle() throws {
        let context = try makeContext()
        let vm = SettingsViewModel(modelContext: context)
        vm.setICloudSyncEnabled(true)
        #expect(vm.showingICloudRestartAlert)
        #expect(vm.preferencesStore.iCloudSyncEnabled)
    }

    @Test("savedCount returns 0 initially")
    func savedCount() throws {
        let context = try makeContext()
        let vm = SettingsViewModel(modelContext: context)
        #expect(vm.savedCount == 0)
    }

    @Test("bookmarkedCount returns 0 initially")
    func bookmarkedCount() throws {
        let context = try makeContext()
        let vm = SettingsViewModel(modelContext: context)
        #expect(vm.bookmarkedCount == 0)
    }

    @Test("clearHistory removes saved calculations")
    func clearHistory() throws {
        let context = try makeContext()
        let calc = SavedCalculation(
            calculatorID: "salary",
            title: "Test",
            inputsJSON: Data(),
            summary: "Test summary"
        )
        context.insert(calc)
        try context.save()

        let vm = SettingsViewModel(modelContext: context)
        #expect(vm.savedCount == 1)
        vm.clearHistory()
        #expect(vm.savedCount == 0)
    }

    @Test("clearBookmarks removes guide bookmarks")
    func clearBookmarks() throws {
        let context = try makeContext()
        let bookmark = GuideBookmark(slug: "test-guide")
        context.insert(bookmark)
        try context.save()

        let vm = SettingsViewModel(modelContext: context)
        #expect(vm.bookmarkedCount == 1)
        vm.clearBookmarks()
        #expect(vm.bookmarkedCount == 0)
    }

    @Test("exportAllData produces non-nil export data")
    func exportAllData() throws {
        let context = try makeContext()
        let vm = SettingsViewModel(modelContext: context)
        vm.exportAllData()
        #expect(vm.exportedData != nil)
        #expect(vm.exportedURL != nil)
        #expect(vm.showingExportSheet)
    }
}
