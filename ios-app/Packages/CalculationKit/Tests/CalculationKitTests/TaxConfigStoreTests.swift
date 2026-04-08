import Testing
import Foundation
@testable import CalculationKit

@Suite("TaxConfigStore")
struct TaxConfigStoreTests {

    @Test("loads and caches config")
    func loadCaches() async throws {
        let store = TaxConfigStore.shared
        let first = try await store.load()
        let second = try await store.load()
        #expect(first.years.count == second.years.count)
        #expect(first.version == second.version)
    }

    @Test("version is 2026.1")
    func version() async throws {
        let config = try await TaxConfigStore.shared.load()
        #expect(config.version == "2026.1")
    }

    @Test("generatedAt is a non-empty ISO string")
    func generatedAt() async throws {
        let config = try await TaxConfigStore.shared.load()
        #expect(!config.generatedAt.isEmpty)
        #expect(config.generatedAt.contains("T"))
    }

    @Test("all 7 years are present (2020-2026)")
    func allYears() async throws {
        let config = try await TaxConfigStore.shared.load()
        #expect(config.availableYears == [2020, 2021, 2022, 2023, 2024, 2025, 2026])
    }

    @Test("2026 contains 7 tax rate types")
    func allTaxTypes2026() async throws {
        let config = try await TaxConfigStore.shared.load()
        let year2026 = try #require(config.years[2026])
        #expect(year2026.brackets.count == 7)
        #expect(year2026.brackets[.married] != nil)
        #expect(year2026.brackets[.marriedOneChild] != nil)
        #expect(year2026.brackets[.marriedTwoPlus] != nil)
        #expect(year2026.brackets[.parent] != nil)
        #expect(year2026.brackets[.parentOneChild] != nil)
        #expect(year2026.brackets[.parentTwoPlus] != nil)
        #expect(year2026.brackets[.single] != nil)
    }

    @Test("2024 has 3 tax types (no children variants)")
    func threeTypes2024() async throws {
        let config = try await TaxConfigStore.shared.load()
        let year2024 = try #require(config.years[2024])
        #expect(year2024.brackets.count == 3)
    }

    @Test("SSC weekly cap 2026 new is 559.31")
    func ssc2026() async throws {
        let config = try await TaxConfigStore.shared.load()
        let ssc = try #require(config.ssc(for: 2026))
        #expect(ssc.weeklyCapNew == Decimal(string: "559.31"))
        #expect(ssc.minimumWage == Decimal(string: "225"))
    }

    @Test("COLA for June 2026 is 135.10")
    func cola2026() async throws {
        let config = try await TaxConfigStore.shared.load()
        #expect(config.cola(for: 2026, month: .june) == Decimal(string: "135.1"))
        #expect(config.cola(for: 2026, month: .march) == Decimal(string: "121.16"))
    }

    @Test("COLA for 2020 is zero (no COLA data)")
    func cola2020IsZero() async throws {
        let config = try await TaxConfigStore.shared.load()
        #expect(config.cola(for: 2020, month: .march) == 0)
        #expect(config.cola(for: 2020, month: .june) == 0)
    }

    @Test("Infinity bracket max parsed correctly")
    func infinityMax() async throws {
        let config = try await TaxConfigStore.shared.load()
        let single2026 = try #require(config.brackets(for: 2026, type: .single).last)
        #expect(single2026.max == Decimal.greatestFiniteMagnitude)
        #expect(single2026.rate == Decimal(string: "0.35"))
        #expect(single2026.deduction == Decimal(string: "9400"))
    }

    @Test("brackets fallback: 2024 married_1child falls back to married")
    func bracketFallback() async throws {
        let config = try await TaxConfigStore.shared.load()
        let fallback = config.brackets(for: 2024, type: .marriedOneChild)
        let married = config.brackets(for: 2024, type: .married)
        #expect(!fallback.isEmpty)
        #expect(fallback == married)
    }

    @Test("brackets for non-existent year returns empty")
    func bracketsNonExistentYear() async throws {
        let config = try await TaxConfigStore.shared.load()
        let brackets = config.brackets(for: 1990, type: .single)
        #expect(brackets.isEmpty)
    }

    @Test("isChildCountEffective for 2026 is true")
    func childCountEffective2026() {
        #expect(MaltaTaxConfig.isChildCountEffective(year: 2026) == true)
    }

    @Test("isChildCountEffective for 2025 is false")
    func childCountEffective2025() {
        #expect(MaltaTaxConfig.isChildCountEffective(year: 2025) == false)
    }
}

@Suite("resolveTaxRateType")
struct ResolveTaxRateTypeTests {

    @Test("2025 married with 1 child falls back to married")
    func resolveFallback() {
        let type = resolveTaxRateType(year: 2025, simpleType: .married, childCount: 1)
        #expect(type == .married)
    }

    @Test("2026 married with 2 children")
    func resolve2026TwoChildren() {
        let type = resolveTaxRateType(year: 2026, simpleType: .married, childCount: 2)
        #expect(type == .marriedTwoPlus)
    }

    @Test("2026 parent with 1 child")
    func resolve2026ParentOneChild() {
        let type = resolveTaxRateType(year: 2026, simpleType: .parent, childCount: 1)
        #expect(type == .parentOneChild)
    }

    @Test("2026 single ignores child count")
    func resolve2026Single() {
        let type = resolveTaxRateType(year: 2026, simpleType: .single, childCount: 3)
        #expect(type == .single)
    }

    @Test("2026 married with 0 children")
    func resolve2026MarriedNoChildren() {
        let type = resolveTaxRateType(year: 2026, simpleType: .married, childCount: 0)
        #expect(type == .married)
    }

    @Test("2026 parent with 0 children")
    func resolve2026ParentNoChildren() {
        let type = resolveTaxRateType(year: 2026, simpleType: .parent, childCount: 0)
        #expect(type == .parent)
    }
}

@Suite("DateHelpers")
struct DateHelpersTests {

    @Test("mondays in Feb 2026 is 4")
    func mondaysFeb2026() {
        let count = DateHelpers.mondaysInMonth(year: 2026, monthIndex: 1)
        // February 2026: 2, 9, 16, 23 → 4 Mondays
        #expect(count == 4)
    }

    @Test("mondays in Jan 2026 is 4")
    func mondaysJan2026() {
        let count = DateHelpers.mondaysInMonth(year: 2026, monthIndex: 0)
        // January 2026: 5, 12, 19, 26 → 4 Mondays
        #expect(count == 4)
    }

    @Test("mondays in March 2026 is 5")
    func mondaysMar2026() {
        let count = DateHelpers.mondaysInMonth(year: 2026, monthIndex: 2)
        // March 2026: 2, 9, 16, 23, 30 → 5 Mondays
        #expect(count == 5)
    }

    @Test("weeksForMonth matches mondaysInMonth")
    func weeksForMonth() {
        let byIndex = DateHelpers.mondaysInMonth(year: 2026, monthIndex: 5)
        let byMonth = DateHelpers.weeksForMonth(year: 2026, month: .june)
        #expect(byIndex == byMonth)
    }

    @Test("weeksPerMonthForYear returns all 12 months")
    func weeksPerYear() {
        let result = DateHelpers.weeksPerMonthForYear(2026)
        #expect(result.count == 12)
        // Total Mondays in 2026 should be 52
        let total = result.values.reduce(0, +)
        #expect(total == 52)
    }

    @Test("isBornBefore1962 for 1960")
    func bornBefore1962() {
        let calendar = Calendar(identifier: .gregorian)
        let date = calendar.date(from: DateComponents(year: 1960, month: 6, day: 15))!
        #expect(DateHelpers.isBornBefore1962(date) == true)
    }

    @Test("isBornBefore1962 for 1970")
    func bornAfter1962() {
        let calendar = Calendar(identifier: .gregorian)
        let date = calendar.date(from: DateComponents(year: 1970, month: 1, day: 1))!
        #expect(DateHelpers.isBornBefore1962(date) == false)
    }
}

@Suite("TaxConfigStore Concurrency")
struct TaxConfigStoreConcurrencyTests {
    @Test("Concurrent loads produce identical results")
    func concurrentLoads() async throws {
        let results = try await withThrowingTaskGroup(of: MaltaTaxConfig.self) { group in
            for _ in 0..<10 {
                group.addTask {
                    try await TaxConfigStore.shared.load()
                }
            }
            var configs: [MaltaTaxConfig] = []
            for try await config in group {
                configs.append(config)
            }
            return configs
        }
        #expect(results.count == 10)
        let first = results[0]
        for config in results.dropFirst() {
            #expect(config.availableYears == first.availableYears)
            #expect(config.version == first.version)
        }
    }
}
