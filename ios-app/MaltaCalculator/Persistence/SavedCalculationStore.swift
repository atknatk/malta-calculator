//
//  SavedCalculationStore.swift
//  MaltaCalculator
//

import Foundation
import Observation
import SwiftData
import os

/// `@Observable` store wrapping ``SavedCalculation`` CRUD.
///
/// Views bind to ``items`` / ``pinnedItems`` and call mutating methods;
/// the store takes care of SwiftData persistence and re-publishing the
/// sorted snapshot after every mutation.
@Observable
@MainActor
final class SavedCalculationStore {
    /// All saved entries, pinned first then most-recently-updated first.
    private(set) var items: [SavedCalculation] = []
    /// Convenience subset of ``items`` where `pinned == true`.
    private(set) var pinnedItems: [SavedCalculation] = []

    private let context: ModelContext
    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()
    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()
    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "SavedCalculationStore"
    )

    init(context: ModelContext) {
        self.context = context
    }

    // MARK: - Read

    /// Re-fetches all entries from the backing store.
    func refresh() {
        let fetched = (try? context.fetch(FetchDescriptor<SavedCalculation>())) ?? []
        // Pinned entries always appear first; ties preserve updatedAt order.
        items = fetched.sorted { lhs, rhs in
            if lhs.pinned != rhs.pinned { return lhs.pinned }
            return lhs.updatedAt > rhs.updatedAt
        }
        pinnedItems = items.filter(\.pinned)
    }

    /// Returns the entries belonging to a specific calculator.
    func items(forCalculator id: String) -> [SavedCalculation] {
        items.filter { $0.calculatorID == id }
    }

    // MARK: - Create

    /// Inserts an already-encoded entry.
    @discardableResult
    func saveRaw(
        calculatorID: String,
        title: String,
        summary: String,
        inputsJSON: Data,
        tags: [String] = [],
        notes: String? = nil
    ) throws -> SavedCalculation {
        let item = SavedCalculation(
            calculatorID: calculatorID,
            title: title,
            inputsJSON: inputsJSON,
            summary: summary,
            tags: tags,
            notes: notes
        )
        context.insert(item)
        try context.save()
        refresh()
        return item
    }

    /// Encodes the typed `inputs` payload and inserts a new entry.
    @discardableResult
    func save<T: Encodable>(
        calculatorID: String,
        title: String,
        summary: String,
        inputs: T,
        tags: [String] = [],
        notes: String? = nil
    ) throws -> SavedCalculation {
        let data = try encoder.encode(inputs)
        return try saveRaw(
            calculatorID: calculatorID,
            title: title,
            summary: summary,
            inputsJSON: data,
            tags: tags,
            notes: notes
        )
    }

    // MARK: - Update

    /// Toggles the pinned state and re-sorts.
    func togglePin(_ item: SavedCalculation) {
        item.pinned.toggle()
        item.updatedAt = .now
        persist()
        refresh()
    }

    /// Overwrites the notes field.
    func updateNotes(_ item: SavedCalculation, notes: String?) {
        item.notes = notes
        item.updatedAt = .now
        persist()
        refresh()
    }

    // MARK: - Delete

    /// Deletes a single entry.
    func delete(_ item: SavedCalculation) {
        context.delete(item)
        persist()
        refresh()
    }

    /// Removes every saved calculation. Used by Settings > Reset.
    func deleteAll() throws {
        for item in items {
            context.delete(item)
        }
        try context.save()
        refresh()
    }

    // MARK: - Decode

    /// Decodes the stored JSON payload into a typed value.
    func decodeInputs<T: Decodable>(of item: SavedCalculation, as type: T.Type) -> T? {
        do {
            return try decoder.decode(type, from: item.inputsJSON)
        } catch {
            log.error("decode failed: \(error.localizedDescription, privacy: .public)")
            return nil
        }
    }

    // MARK: - Helpers

    private func persist() {
        do {
            try context.save()
        } catch {
            log.error("save failed: \(error.localizedDescription, privacy: .public)")
        }
    }
}
