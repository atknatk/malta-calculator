//
//  SalarySupplementaryTests.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation
import Testing
@testable import MaltaCalculator

// MARK: - SalaryShareContent Tests

@Suite("SalaryShareContent")
struct SalaryShareContentTests {

    @Test("SalaryShareContent conforms to Equatable and Sendable")
    func conformances() {
        let first = SalaryShareContent(
            year: 2026,
            annualGross: 30_000,
            annualNet: 22_000,
            annualSSC: 3_000,
            annualIncomeTax: 5_000,
            monthlyNet: 1_833,
            effectiveTaxRate: Decimal(string: "0.267") ?? 0
        )
        let second = first
        #expect(first == second)
    }
}

// MARK: - SalarySavedPayload Tests

@Suite("SalarySavedPayload")
struct SalarySavedPayloadTests {

    @Test("payload encodes and decodes symmetrically")
    func codableRoundTrip() throws {
        let original = SalarySavedPayload(
            grossAnnual: 42_000,
            year: 2025,
            simpleTaxType: .parent,
            childCount: 1,
            sscCategory: .d,
            birthDate: Date(timeIntervalSince1970: 631_152_000),
            yearlyNonTaxBenefit: 500,
            yearlyTaxableBenefit: 1_000,
            enableCOLA: false
        )
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601

        let data = try encoder.encode(original)
        let decoded = try decoder.decode(SalarySavedPayload.self, from: data)
        #expect(decoded == original)
    }
}

// MARK: - SalaryInsights Tests

@Suite("SalaryInsights")
@MainActor
struct SalaryInsightsTests {

    private static let testConfigLoader: @Sendable () async throws -> MaltaTaxConfig = {
        try await TaxConfigStore.shared.load()
    }

    /// Helper that calculates a summary from CalculationKit directly.
    private func makeSummary(
        gross: Decimal = 30_000,
        year: Int = 2026,
        type: SimpleTaxType = .single
    ) async throws -> SalarySummary {
        let taxConfig = try await Self.testConfigLoader()
        let config = SalaryCalculatorConfig(
            year: year,
            simpleTaxType: type,
            childCount: 0,
            sscCategory: .c,
            birthDate: SalaryViewModel.defaultBirthDate,
            yearlyNonTaxBenefit: 0,
            yearlyTaxableBenefit: 0,
            monthlyBonus: 0,
            enableCOLA: true
        )
        let inputs = Month.allCases.map { month in
            SalaryInput(
                month: month,
                grossWage: gross / 12,
                bonus: 0,
                governmentBonus: 0,
                allowanceBonus: 0
            )
        }
        let calculator = SalaryCalculator(config: config, taxConfig: taxConfig)
        let outputs = try calculator.calculate(inputs: inputs)
        return SalarySummary(from: outputs)
    }

    @Test("bullets include effective rate text")
    func effectiveRate() async throws {
        let summary = try await makeSummary()
        let insights = SalaryInsights(
            summary: summary,
            year: 2026,
            simpleTaxType: .single
        )
        #expect(insights.bullets.contains { $0.contains("%") })
    }

    @Test("bullets include child bracket for 2026 married")
    func childBracketHint() async throws {
        let summary = try await makeSummary(type: .married)
        let insights = SalaryInsights(
            summary: summary,
            year: 2026,
            simpleTaxType: .married
        )
        let hasChild = insights.bullets.contains { $0.lowercased().contains("child") }
        #expect(hasChild)
    }

    @Test("bullets do NOT include child bracket for single")
    func noChildBracketForSingle() async throws {
        let summary = try await makeSummary()
        let insights = SalaryInsights(
            summary: summary,
            year: 2026,
            simpleTaxType: .single
        )
        let hasChild = insights.bullets.contains { $0.lowercased().contains("child") }
        #expect(!hasChild)
    }

    @Test("bullets include private pension advice")
    func privatePension() async throws {
        let summary = try await makeSummary()
        let insights = SalaryInsights(
            summary: summary,
            year: 2026,
            simpleTaxType: .single
        )
        let hasPension = insights.bullets.contains { $0.lowercased().contains("pension") }
        #expect(hasPension)
    }
}

// MARK: - SalaryHistoryStore Tests

@Suite("SalaryHistoryStore")
@MainActor
struct SalaryHistoryStoreTests {

    private func makePayload(
        gross: Decimal = 25_000,
        year: Int = 2026
    ) -> SalarySavedPayload {
        SalarySavedPayload(
            grossAnnual: gross,
            year: year,
            simpleTaxType: .single,
            childCount: 0,
            sscCategory: .c,
            birthDate: Date(),
            yearlyNonTaxBenefit: 0,
            yearlyTaxableBenefit: 0,
            enableCOLA: true
        )
    }

    @Test("add and remove entries")
    func addRemove() {
        let store = SalaryHistoryStore(
            fileURL: FileManager.default.temporaryDirectory
                .appendingPathComponent("test-history-\(UUID().uuidString).json")
        )
        let entry = SalaryHistoryEntry(
            id: UUID(),
            title: "Test",
            summary: "Summary",
            createdAt: Date(),
            payload: makePayload()
        )
        store.add(entry)
        #expect(store.entries.count == 1)
        store.remove(id: entry.id)
        #expect(store.entries.isEmpty)
    }

    @Test("removeAll clears all entries")
    func removeAll() {
        let store = SalaryHistoryStore(
            fileURL: FileManager.default.temporaryDirectory
                .appendingPathComponent("test-history-\(UUID().uuidString).json")
        )
        let payload = makePayload()
        store.add(SalaryHistoryEntry(
            id: UUID(), title: "A", summary: "a",
            createdAt: Date(), payload: payload
        ))
        store.add(SalaryHistoryEntry(
            id: UUID(), title: "B", summary: "b",
            createdAt: Date(), payload: payload
        ))
        #expect(store.entries.count == 2)
        store.removeAll()
        #expect(store.entries.isEmpty)
    }

    @Test("persists and restores from disk")
    func diskPersistence() {
        let url = FileManager.default.temporaryDirectory
            .appendingPathComponent("test-persist-\(UUID().uuidString).json")

        let payload = SalarySavedPayload(
            grossAnnual: 30_000,
            year: 2025,
            simpleTaxType: .married,
            childCount: 1,
            sscCategory: .c,
            birthDate: Date(timeIntervalSince1970: 631_152_000),
            yearlyNonTaxBenefit: 0,
            yearlyTaxableBenefit: 0,
            enableCOLA: true
        )
        let entry = SalaryHistoryEntry(
            id: UUID(),
            title: "Persist Test",
            summary: "Net \u{20AC}1,890/mo",
            createdAt: Date(timeIntervalSince1970: 1_700_000_000),
            payload: payload
        )

        // Write
        let store1 = SalaryHistoryStore(fileURL: url)
        store1.add(entry)

        // Read back in a new store instance
        let store2 = SalaryHistoryStore(fileURL: url)
        #expect(store2.entries.count == 1)
        #expect(store2.entries.first?.title == "Persist Test")

        // Cleanup
        try? FileManager.default.removeItem(at: url)
    }
}
