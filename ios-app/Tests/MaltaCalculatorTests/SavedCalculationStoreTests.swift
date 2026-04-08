//
//  SavedCalculationStoreTests.swift
//  MaltaCalculatorTests
//

import Foundation
import SwiftData
import Testing
@testable import MaltaCalculator

/// Single shared in-memory container used across every SwiftData test in
/// this file. SwiftData on iOS 26 becomes unstable when multiple
/// `ModelContainer`s covering the same `@Model` types are created in the
/// same process, so the tests share one container and rely on
/// `deleteAll` / context resets for isolation.
@MainActor
private enum TestContainer {
    static let shared: ModelContainer = {
        let config = ModelConfiguration(isStoredInMemoryOnly: true)
        do {
            return try ModelContainer(
                for: SavedCalculation.self,
                CalculatorUsage.self,
                GuideBookmark.self,
                UserPreferences.self,
                configurations: config
            )
        } catch {
            fatalError("Failed to build test ModelContainer: \(error)")
        }
    }()

    static func freshContext() -> ModelContext {
        let context = ModelContext(shared)
        // Wipe every model type so tests start from a clean slate.
        try? context.delete(model: SavedCalculation.self)
        try? context.delete(model: CalculatorUsage.self)
        try? context.delete(model: GuideBookmark.self)
        try? context.delete(model: UserPreferences.self)
        try? context.save()
        return context
    }
}

@Suite("SavedCalculationStore", .serialized)
@MainActor
struct SavedCalculationStoreTests {
    /// Returns a fresh store backed by the shared in-memory container.
    private func makeStore() throws -> SavedCalculationStore {
        SavedCalculationStore(context: TestContainer.freshContext())
    }

    @Test("save then refresh shows item")
    func saveAndRefresh() throws {
        let store = try makeStore()
        try store.save(
            calculatorID: "salary",
            title: "Test",
            summary: "€1,000",
            inputs: ["gross": "30000"]
        )
        #expect(store.items.count == 1)
        #expect(store.items.first?.title == "Test")
    }

    @Test("pin moves item to top")
    func pin() throws {
        let store = try makeStore()
        try store.save(calculatorID: "salary", title: "A", summary: "", inputs: [String: String]())
        try store.save(calculatorID: "salary", title: "B", summary: "", inputs: [String: String]())
        // Newest first, so "A" is at index 1.
        let older = store.items[1]
        store.togglePin(older)
        #expect(store.items.first?.pinned == true)
        #expect(store.items.first?.title == older.title)
        #expect(store.pinnedItems.count == 1)
    }

    @Test("delete removes item")
    func delete() throws {
        let store = try makeStore()
        try store.save(calculatorID: "salary", title: "X", summary: "", inputs: [String: String]())
        store.delete(store.items[0])
        #expect(store.items.isEmpty)
    }

    @Test("deleteAll empties store")
    func deleteAllClears() throws {
        let store = try makeStore()
        for index in 0..<5 {
            try store.save(
                calculatorID: "salary",
                title: "\(index)",
                summary: "",
                inputs: [String: String]()
            )
        }
        try store.deleteAll()
        #expect(store.items.isEmpty)
    }

    @Test("filter by calculator id")
    func filterByCalculator() throws {
        let store = try makeStore()
        try store.save(calculatorID: "salary", title: "S", summary: "", inputs: [String: String]())
        try store.save(calculatorID: "mortgage", title: "M", summary: "", inputs: [String: String]())
        #expect(store.items(forCalculator: "salary").count == 1)
        #expect(store.items(forCalculator: "mortgage").count == 1)
    }

    @Test("decodeInputs round-trips typed payload")
    func decodeRoundTrip() throws {
        let store = try makeStore()
        let payload = ["gross": "30000", "year": "2026"]
        try store.save(calculatorID: "salary", title: "T", summary: "", inputs: payload)
        let item = try #require(store.items.first)
        let decoded = store.decodeInputs(of: item, as: [String: String].self)
        #expect(decoded == payload)
    }

    @Test("updateNotes writes through and refreshes")
    func updateNotes() throws {
        let store = try makeStore()
        try store.save(calculatorID: "salary", title: "T", summary: "", inputs: [String: String]())
        let item = try #require(store.items.first)
        store.updateNotes(item, notes: "hello")
        #expect(store.items.first?.notes == "hello")
    }
}

@Suite("UserPreferencesStore", .serialized)
@MainActor
struct UserPreferencesStoreTests {
    private func makeStore() throws -> UserPreferencesStore {
        UserPreferencesStore(context: TestContainer.freshContext())
    }

    @Test("creates singleton on first launch")
    func createsSingleton() throws {
        let store = try makeStore()
        #expect(store.preferences.id == "default")
        #expect(store.preferences.currencyCode == "EUR")
        #expect(store.preferences.iCloudSyncEnabled == false)
        #expect(store.theme == .system)
    }

    @Test("theme setter persists via update")
    func themePersists() throws {
        let store = try makeStore()
        store.theme = .dark
        #expect(store.preferences.themeRawValue == "dark")
        #expect(store.theme == .dark)
    }
}
