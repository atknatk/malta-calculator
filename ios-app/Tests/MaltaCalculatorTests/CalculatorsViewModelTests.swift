//
//  CalculatorsViewModelTests.swift
//  MaltaCalculatorTests
//
//  Tests for the Calculators Hub view model — catalog loading,
//  filtering, category selection, and recently-used tracking.
//

import Foundation
import Testing
@testable import MaltaCalculator

@Suite("CalculatorsViewModel")
@MainActor
struct CalculatorsViewModelTests {

    // MARK: - Initial State

    @Test("loads catalog on init and transitions to content")
    func loadsOnInit() {
        let vm = CalculatorsViewModel()
        guard case .content = vm.state else {
            Issue.record("Expected .content state, got \(vm.state)")
            return
        }
        #expect(!vm.allItems.isEmpty)
        #expect(!vm.filteredItems.isEmpty)
    }

    @Test("allItems matches filteredItems when no filter applied")
    func noFilterShowsAll() {
        let vm = CalculatorsViewModel()
        #expect(vm.allItems.count == vm.filteredItems.count)
    }

    @Test("groupedItems covers all categories present in catalog")
    func groupedItemsCoversCategories() {
        let vm = CalculatorsViewModel()
        let expectedCategories = Set(vm.allItems.map(\.category))
        #expect(Set(vm.groupedItems.keys) == expectedCategories)
    }

    @Test("statistics returns correct counts")
    func statistics() {
        let vm = CalculatorsViewModel()
        let stats = vm.statistics
        let activeCount = vm.allItems.count { $0.available }
        let soonCount = vm.allItems.count - activeCount
        let categoryCount = Set(vm.allItems.map(\.category)).count

        #expect(stats.active == activeCount)
        #expect(stats.soon == soonCount)
        #expect(stats.categories == categoryCount)
    }

    // MARK: - Search Filtering

    @Test("search text filters items by title")
    func searchByTitle() {
        let vm = CalculatorsViewModel()
        vm.searchText = "mortgage"
        let filtered = vm.filteredItems
        #expect(!filtered.isEmpty)
        for item in filtered {
            let matchesTitle = item.title.lowercased().contains("mortgage")
            let matchesSubtitle = item.subtitle.lowercased().contains("mortgage")
            #expect(matchesTitle || matchesSubtitle, "Item '\(item.title)' doesn't match 'mortgage'")
        }
    }

    @Test("search text is case insensitive")
    func searchCaseInsensitive() {
        let vm = CalculatorsViewModel()
        vm.searchText = "PENSION"
        let upperResults = vm.filteredItems

        vm.searchText = "pension"
        let lowerResults = vm.filteredItems

        #expect(upperResults.count == lowerResults.count)
    }

    @Test("empty search text shows all items")
    func emptySearchShowsAll() {
        let vm = CalculatorsViewModel()
        vm.searchText = "xyz_nonexistent"
        #expect(vm.filteredItems.isEmpty)

        vm.searchText = ""
        #expect(vm.filteredItems.count == vm.allItems.count)
    }

    @Test("whitespace-only search shows all items")
    func whitespaceSearchShowsAll() {
        let vm = CalculatorsViewModel()
        vm.searchText = "   "
        #expect(vm.filteredItems.count == vm.allItems.count)
    }

    @Test("no results for gibberish search")
    func noResults() {
        let vm = CalculatorsViewModel()
        vm.searchText = "zzz_not_a_calculator_name"
        #expect(vm.filteredItems.isEmpty)
    }

    // MARK: - Category Selection

    @Test("selecting a category filters to that category only")
    func categoryFilter() {
        let vm = CalculatorsViewModel()
        guard let firstCategory = vm.allItems.first?.category else {
            Issue.record("No items in catalog")
            return
        }
        vm.selectCategory(firstCategory)
        #expect(vm.selectedCategory == firstCategory)
        for item in vm.filteredItems {
            #expect(item.category == firstCategory)
        }
    }

    @Test("clearing category shows all items")
    func clearCategoryShowsAll() {
        let vm = CalculatorsViewModel()
        let firstCategory = vm.allItems.first?.category
        vm.selectCategory(firstCategory)
        let filteredCount = vm.filteredItems.count

        vm.selectCategory(nil)
        #expect(vm.selectedCategory == nil)
        #expect(vm.filteredItems.count > filteredCount)
        #expect(vm.filteredItems.count == vm.allItems.count)
    }

    @Test("category + search compound filter works")
    func compoundFilter() {
        let vm = CalculatorsViewModel()
        guard let firstCategory = vm.allItems.first?.category else {
            return
        }
        vm.selectCategory(firstCategory)
        let categoryOnly = vm.filteredItems.count

        // Add a search term — should narrow further or stay same
        vm.searchText = "a"
        #expect(vm.filteredItems.count <= categoryOnly)
    }

    // MARK: - Recently Used

    @Test("recordUsage adds item to recentlyUsed")
    func recordUsage() {
        let store = RecentlyUsedCalculatorsStore()
        let vm = CalculatorsViewModel(recentsStore: store)
        guard let firstItem = vm.allItems.first else {
            Issue.record("No items in catalog")
            return
        }
        vm.recordUsage(firstItem.id)
        #expect(!vm.recentlyUsed.isEmpty)
        #expect(vm.recentlyUsed.first?.id == firstItem.id)
    }

    @Test("recently used does not exceed 5")
    func recentlyUsedCap() {
        let store = RecentlyUsedCalculatorsStore()
        let vm = CalculatorsViewModel(recentsStore: store)
        // Record more than 5 unique items
        for item in vm.allItems.prefix(7) {
            vm.recordUsage(item.id)
        }
        #expect(vm.recentlyUsed.count <= 5)
    }

    // MARK: - Load / Retry

    @Test("retry reloads the catalog")
    func retry() {
        let vm = CalculatorsViewModel()
        let initialCount = vm.allItems.count
        vm.retry()
        #expect(vm.allItems.count == initialCount)
        guard case .content = vm.state else {
            Issue.record("Expected .content after retry")
            return
        }
    }
}
