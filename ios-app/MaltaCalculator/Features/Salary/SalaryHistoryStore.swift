//
//  SalaryHistoryStore.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation
import Observation
import os

/// A single saved-salary entry persisted in the history store.
struct SalaryHistoryEntry: Codable, Identifiable, Equatable, Sendable {
    /// Stable identifier.
    let id: UUID
    /// Human-readable title (e.g. "Salary 2026 — €30,000").
    let title: String
    /// Short summary line (e.g. "Net €1,890/mo").
    let summary: String
    /// Wall-clock time the entry was created.
    let createdAt: Date
    /// The full snapshot of inputs so the entry can be re-opened later.
    let payload: SalarySavedPayload
}

/// Lightweight JSON-backed history store for saved salary calculations.
///
/// Persists to `Application Support/salary-history.json` so saved
/// calculations survive app relaunches. This is the v1 implementation
/// that sits in front of the future SwiftData model — the serialised
/// shape is identical to ``SalaryHistoryEntry`` so the migration to
/// SwiftData in Task 12 is a straight decoder swap.
@Observable
@MainActor
final class SalaryHistoryStore {
    /// Shared on-disk store used by the Salary feature.
    static let shared = SalaryHistoryStore()

    /// All saved entries, newest first.
    private(set) var entries: [SalaryHistoryEntry] = []

    private let fileURL: URL
    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return encoder
    }()
    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return decoder
    }()
    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "SalaryHistoryStore"
    )

    /// Creates a store backed by `Application Support/salary-history.json`,
    /// or an injected URL when writing tests.
    init(fileURL: URL? = nil) {
        if let fileURL {
            self.fileURL = fileURL
        } else {
            let fm = FileManager.default
            let dir: URL
            if let appSupport = try? fm.url(
                for: .applicationSupportDirectory,
                in: .userDomainMask,
                appropriateFor: nil,
                create: true
            ) {
                dir = appSupport
            } else {
                dir = fm.temporaryDirectory
            }
            self.fileURL = dir.appendingPathComponent("salary-history.json")
        }
        loadFromDisk()
    }

    /// Appends a new history entry and persists to disk.
    func add(_ entry: SalaryHistoryEntry) {
        entries.insert(entry, at: 0)
        saveToDisk()
    }

    /// Removes the entry with the given identifier.
    func remove(id: UUID) {
        entries.removeAll { $0.id == id }
        saveToDisk()
    }

    /// Removes all saved entries (used by Settings > Reset).
    func removeAll() {
        entries.removeAll()
        saveToDisk()
    }

    // MARK: - Persistence

    private func loadFromDisk() {
        guard FileManager.default.fileExists(atPath: fileURL.path) else { return }
        do {
            let data = try Data(contentsOf: fileURL)
            entries = try decoder.decode([SalaryHistoryEntry].self, from: data)
        } catch {
            log.error("Failed to read history: \(error.localizedDescription, privacy: .public)")
            entries = []
        }
    }

    private func saveToDisk() {
        do {
            let data = try encoder.encode(entries)
            try data.write(to: fileURL, options: [.atomic])
        } catch {
            log.error("Failed to write history: \(error.localizedDescription, privacy: .public)")
        }
    }
}
