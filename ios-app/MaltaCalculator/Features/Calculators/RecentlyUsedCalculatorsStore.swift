//
//  RecentlyUsedCalculatorsStore.swift
//  MaltaCalculator
//

import Foundation
import Observation
import os

/// Stores the user's five most recently opened calculators in `UserDefaults`.
///
/// SwiftData persistence for calculation history ships in a later task; for
/// the Calculators Hub we only need a lightweight LRU of IDs, so a plain
/// `UserDefaults`-backed store keeps the Hub self-contained.
@Observable
@MainActor
final class RecentlyUsedCalculatorsStore {
    /// Maximum number of entries retained.
    static let maxEntries = 5

    /// The ordered list of recently-used IDs, most-recent first.
    private(set) var ids: [CalculatorID] = []

    private let defaults: UserDefaults
    private let storageKey = "calculators.recentlyUsed.v1"
    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "RecentlyUsedCalculatorsStore"
    )

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        load()
    }

    /// Record an interaction with a calculator. The ID is moved to the front
    /// of the list; older entries beyond ``maxEntries`` are discarded.
    func record(_ id: CalculatorID) {
        var updated = ids.filter { $0 != id }
        updated.insert(id, at: 0)
        if updated.count > Self.maxEntries {
            updated = Array(updated.prefix(Self.maxEntries))
        }
        ids = updated
        persist()
    }

    /// Reset the stored list. Used by tests and Settings reset actions.
    func clear() {
        ids = []
        defaults.removeObject(forKey: storageKey)
    }

    // MARK: - Persistence

    private func load() {
        guard let raw = defaults.array(forKey: storageKey) as? [String] else { return }
        ids = raw.compactMap(CalculatorID.init(rawValue:))
    }

    private func persist() {
        defaults.set(ids.map(\.rawValue), forKey: storageKey)
    }
}
