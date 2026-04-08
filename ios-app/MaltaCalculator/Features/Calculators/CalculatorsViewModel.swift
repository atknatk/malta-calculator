//
//  CalculatorsViewModel.swift
//  MaltaCalculator
//

import Foundation
import Observation

/// Aggregate statistics used to render the Hub's stats bar.
struct CalculatorsHubStatistics: Equatable, Sendable {
    let active: Int
    let soon: Int
    let categories: Int
}

/// View-state for the Calculators Hub — mirrors the infrastructure pattern
/// used by other features so the view can switch on a single enum.
enum CalculatorsViewState: Equatable {
    case loading
    case content(items: [CalculatorCatalogItem])
    case empty
    case error(String)
}

/// `@Observable` view model that owns the Calculators Hub state.
@Observable
@MainActor
final class CalculatorsViewModel {
    /// Full catalog, loaded once on init.
    private(set) var allItems: [CalculatorCatalogItem] = []

    /// All items grouped by their category, preserving declaration order.
    private(set) var groupedItems: [CalculatorCategory: [CalculatorCatalogItem]] = [:]

    /// Filtered slice driven by `searchText` + `selectedCategory`.
    private(set) var filteredItems: [CalculatorCatalogItem] = []

    /// Current view-state for the hub.
    private(set) var state: CalculatorsViewState = .loading

    /// The user's most-recently used calculators (max 5).
    private(set) var recentlyUsed: [CalculatorCatalogItem] = []

    /// Search query. Mutations trigger `applyFilter()`.
    var searchText: String = "" {
        didSet { applyFilter() }
    }

    /// Active category filter. `nil` shows all categories.
    private(set) var selectedCategory: CalculatorCategory?

    private let recentsStore: RecentlyUsedCalculatorsStore

    init(recentsStore: RecentlyUsedCalculatorsStore = RecentlyUsedCalculatorsStore()) {
        self.recentsStore = recentsStore
        load()
    }

    /// Load the catalog from the ``CalculatorID`` enum and refresh recents.
    func load() {
        state = .loading
        let items = CalculatorCatalogItem.all
        allItems = items
        groupedItems = Dictionary(grouping: items, by: \.category)
        filteredItems = items
        refreshRecents()
        state = items.isEmpty ? .empty : .content(items: items)
    }

    /// Retry loading — used by `DSErrorState`.
    func retry() { load() }

    /// Record that the user opened a calculator so it appears in "Recently Used".
    func recordUsage(_ id: CalculatorID) {
        recentsStore.record(id)
        refreshRecents()
    }

    /// Set the selected category filter.
    func selectCategory(_ category: CalculatorCategory?) {
        selectedCategory = category
        applyFilter()
    }

    /// Aggregate statistics shown in the stats bar.
    var statistics: CalculatorsHubStatistics {
        let active = allItems.count { $0.available }
        let soon = allItems.count - active
        let categories = Set(allItems.map(\.category)).count
        return CalculatorsHubStatistics(active: active, soon: soon, categories: categories)
    }

    // MARK: - Filtering

    private func applyFilter() {
        let trimmed = searchText.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        var result = allItems
        if let category = selectedCategory {
            result = result.filter { $0.category == category }
        }
        if !trimmed.isEmpty {
            result = result.filter { item in
                item.title.lowercased().contains(trimmed)
                    || item.subtitle.lowercased().contains(trimmed)
            }
        }
        filteredItems = result
    }

    private func refreshRecents() {
        let ids = recentsStore.ids
        recentlyUsed = ids.compactMap { id in
            allItems.first { $0.id == id }
        }
    }
}
