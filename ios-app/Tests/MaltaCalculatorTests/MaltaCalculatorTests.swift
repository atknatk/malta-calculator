//
//  MaltaCalculatorTests.swift
//  MaltaCalculator
//

import Foundation
import Testing
@testable import MaltaCalculator

// MARK: - DeepLinkParser Tests

@Suite("DeepLinkParser")
struct DeepLinkParserTests {
    let parser = DeepLinkParser()

    // MARK: - Calculator Deep Links

    @Test("parses calculator mortgage link with params")
    func calculatorMortgage() throws {
        let url = try #require(URL(string: "maltacalc://calculators/mortgage?price=300000&rate=4.5"))
        let destination = try #require(parser.parse(url))
        #expect(destination == .calculator(.mortgage, params: ["price": "300000", "rate": "4.5"]))
    }

    @Test("parses calculator stamp-duty link")
    func calculatorStampDuty() throws {
        let url = try #require(URL(string: "maltacalc://calculators/stamp-duty?price=250000"))
        let destination = try #require(parser.parse(url))
        #expect(destination == .calculator(.stampDuty, params: ["price": "250000"]))
    }

    @Test("parses calculator link without params")
    func calculatorNoParams() throws {
        let url = try #require(URL(string: "maltacalc://calculators/pension"))
        let destination = try #require(parser.parse(url))
        #expect(destination == .calculator(.pension, params: [:]))
    }

    @Test("returns nil for unknown calculator ID")
    func unknownCalculatorID() throws {
        let url = try #require(URL(string: "maltacalc://calculators/unknown-calc"))
        #expect(parser.parse(url) == nil)
    }

    @Test("returns nil for calculator path without ID")
    func calculatorNoID() throws {
        let url = try #require(URL(string: "maltacalc://calculators"))
        #expect(parser.parse(url) == nil)
    }

    // MARK: - Salary Deep Links

    @Test("parses salary link with params")
    func salaryWithParams() throws {
        let url = try #require(URL(string: "maltacalc://salary?gross=30000&year=2026"))
        let destination = try #require(parser.parse(url))
        if case .salary(let params) = destination {
            #expect(params["gross"] == "30000")
            #expect(params["year"] == "2026")
        } else {
            Issue.record("Expected .salary destination")
        }
    }

    @Test("parses salary link without params")
    func salaryNoParams() throws {
        let url = try #require(URL(string: "maltacalc://salary"))
        let destination = try #require(parser.parse(url))
        if case .salary(let params) = destination {
            #expect(params.isEmpty)
        } else {
            Issue.record("Expected .salary destination")
        }
    }

    // MARK: - Guide Deep Links

    @Test("parses guide link")
    func guide() throws {
        let url = try #require(URL(string: "maltacalc://guides/malta-mortgage-guide-2026"))
        let destination = try #require(parser.parse(url))
        #expect(destination == .guide(slug: "malta-mortgage-guide-2026"))
    }

    @Test("returns nil for guide path without slug")
    func guideNoSlug() throws {
        let url = try #require(URL(string: "maltacalc://guides"))
        #expect(parser.parse(url) == nil)
    }

    // MARK: - Settings Deep Link

    @Test("parses settings link")
    func settings() throws {
        let url = try #require(URL(string: "maltacalc://settings"))
        let destination = try #require(parser.parse(url))
        #expect(destination == .settings)
    }

    // MARK: - Edge Cases

    @Test("ignores unknown scheme")
    func unknownScheme() throws {
        let url = try #require(URL(string: "ftp://maltacalc/salary"))
        #expect(parser.parse(url) == nil)
    }

    @Test("ignores unknown host")
    func unknownHost() throws {
        let url = try #require(URL(string: "maltacalc://payments"))
        #expect(parser.parse(url) == nil)
    }

    @Test("parses universal link for calculator")
    func universalLinkCalculator() throws {
        let url = try #require(
            URL(string: "https://maltacalculator.com/app/calculators/mortgage?price=300000")
        )
        let destination = try #require(parser.parse(url))
        #expect(destination == .calculator(.mortgage, params: ["price": "300000"]))
    }

    @Test("parses universal link for guide")
    func universalLinkGuide() throws {
        let url = try #require(
            URL(string: "https://maltacalculator.com/app/guides/malta-tax-guide")
        )
        let destination = try #require(parser.parse(url))
        #expect(destination == .guide(slug: "malta-tax-guide"))
    }

    @Test("parses all vehicle calculator deep links")
    func vehicleCalculators() throws {
        let cases: [(String, CalculatorID)] = [
            ("vehicle-registration-fee", .vehicleRegistrationFee),
            ("vehicle-registration-tax", .vehicleRegistrationTax),
            ("road-license", .roadLicense),
            ("drivers-license", .driversLicense),
            ("vrt", .vrt),
            ("import-vehicle", .importVehicle)
        ]
        for (rawValue, expectedID) in cases {
            let url = try #require(URL(string: "maltacalc://calculators/\(rawValue)"))
            let destination = try #require(parser.parse(url))
            #expect(destination == .calculator(expectedID, params: [:]))
        }
    }
}

// MARK: - CalculatorID Tests

@Suite("CalculatorID")
struct CalculatorIDTests {
    @Test("all cases have unique raw values")
    func uniqueRawValues() {
        let rawValues = CalculatorID.allCases.map(\.rawValue)
        #expect(Set(rawValues).count == rawValues.count)
    }

    @Test("all cases have a non-empty display name")
    func displayNames() {
        for id in CalculatorID.allCases {
            #expect(!id.displayName.isEmpty, "displayName is empty for \(id.rawValue)")
        }
    }

    @Test("all cases have a non-empty system image")
    func systemImages() {
        for id in CalculatorID.allCases {
            #expect(!id.systemImage.isEmpty, "systemImage is empty for \(id.rawValue)")
        }
    }

    @Test("count matches expected 29 calculators (18 active + 11 coming soon)")
    func count() {
        #expect(CalculatorID.allCases.count == 29)
        #expect(CalculatorID.allCases.count(where: { $0.isAvailable }) == 18)
        #expect(CalculatorID.allCases.count(where: { !$0.isAvailable }) == 11)
    }

    @Test("every id has a subtitle and a category")
    func subtitlesAndCategories() {
        for id in CalculatorID.allCases {
            #expect(!id.subtitle.isEmpty, "subtitle missing for \(id.rawValue)")
            _ = id.category
        }
    }

    @Test("all nine categories are represented")
    func categoryCoverage() {
        let represented = Set(CalculatorID.allCases.map(\.category))
        #expect(represented == Set(CalculatorCategory.allCases))
    }
}

// MARK: - Calculators Hub ViewModel Tests

@Suite("CalculatorsViewModel")
@MainActor
struct CalculatorsViewModelTests {
    private func makeVM() -> CalculatorsViewModel {
        let suite = "test-\(UUID().uuidString)"
        let defaults = UserDefaults(suiteName: suite) ?? .standard
        defaults.removePersistentDomain(forName: suite)
        let store = RecentlyUsedCalculatorsStore(defaults: defaults)
        return CalculatorsViewModel(recentsStore: store)
    }

    @Test("loads full catalog on init")
    func loadsCatalog() {
        let vm = makeVM()
        #expect(vm.allItems.count == CalculatorID.allCases.count)
        if case .content(let items) = vm.state {
            #expect(items.count == CalculatorID.allCases.count)
        } else {
            Issue.record("state should be .content")
        }
    }

    @Test("statistics match enum")
    func statistics() {
        let vm = makeVM()
        #expect(vm.statistics.active == 18)
        #expect(vm.statistics.soon == 11)
        #expect(vm.statistics.categories == 9)
    }

    @Test("search filters case-insensitively on title")
    func searchFilter() {
        let vm = makeVM()
        vm.searchText = "MORTGAGE"
        #expect(vm.filteredItems.contains(where: { $0.id == .mortgage }))
        #expect(vm.filteredItems.allSatisfy {
            $0.title.lowercased().contains("mortgage")
                || $0.subtitle.lowercased().contains("mortgage")
        })
    }

    @Test("search with whitespace is treated as empty")
    func searchWhitespace() {
        let vm = makeVM()
        vm.searchText = "   "
        #expect(vm.filteredItems.count == vm.allItems.count)
    }

    @Test("selectCategory narrows filtered items")
    func categoryFilter() {
        let vm = makeVM()
        vm.selectCategory(.banking)
        #expect(vm.filteredItems.allSatisfy { $0.category == .banking })
        #expect(!vm.filteredItems.isEmpty)
    }

    @Test("recordUsage updates recently-used LRU")
    func recentUsageLRU() {
        let vm = makeVM()
        vm.recordUsage(.salary)
        vm.recordUsage(.mortgage)
        vm.recordUsage(.pension)
        #expect(vm.recentlyUsed.map(\.id) == [.pension, .mortgage, .salary])

        // Re-record an existing item; it moves to the front.
        vm.recordUsage(.salary)
        #expect(vm.recentlyUsed.first?.id == .salary)
        #expect(vm.recentlyUsed.count == 3)
    }

    @Test("recently used is capped at 5 entries")
    func recentUsageCapped() {
        let vm = makeVM()
        let ids: [CalculatorID] = [
            .salary, .mortgage, .pension, .vacation, .stampDuty, .overtime
        ]
        for id in ids { vm.recordUsage(id) }
        #expect(vm.recentlyUsed.count == 5)
        #expect(vm.recentlyUsed.first?.id == .overtime)
        #expect(!vm.recentlyUsed.contains(where: { $0.id == .salary }))
    }
}

// MARK: - RootTab Tests

@Suite("RootTab")
struct RootTabTests {
    @Test("all cases have unique IDs")
    func uniqueIDs() {
        let ids = RootTab.allCases.map(\.id)
        #expect(Set(ids).count == ids.count)
    }

    @Test("count is 5 tabs")
    func count() {
        #expect(RootTab.allCases.count == 5)
    }

    @Test("all cases have a non-empty system image")
    func systemImages() {
        for tab in RootTab.allCases {
            #expect(!tab.systemImage.isEmpty, "systemImage is empty for \(tab.rawValue)")
        }
    }
}
