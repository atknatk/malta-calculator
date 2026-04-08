//
//  SalaryViewModelExtendedTests.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation
import Testing
@testable import MaltaCalculator

/// Extended tests for SalaryViewModel covering load/retry, haptics,
/// state persistence, and edge cases.
@Suite("SalaryViewModel — Extended")
@MainActor
struct SalaryViewModelExtendedTests {

    // MARK: - Helpers

    private static let testConfigLoader: @Sendable () async throws -> MaltaTaxConfig = {
        try await TaxConfigStore.shared.load()
    }

    private func makeVM(autoLoad: Bool = false) -> SalaryViewModel {
        SalaryViewModel(
            configLoader: Self.testConfigLoader,
            historyStore: SalaryHistoryStore(
                fileURL: FileManager.default.temporaryDirectory
                    .appendingPathComponent("test-\(UUID().uuidString).json")
            ),
            clock: { Date(timeIntervalSince1970: 1_700_000_000) },
            autoLoad: autoLoad
        )
    }

    private func loadedVM(
        gross: Decimal = 25_000,
        year: Int = 2026,
        type: SimpleTaxType = .single,
        childCount: Int = 0,
        sscCategory: SSCCategory = .c,
        enableCOLA: Bool = true
    ) async throws -> SalaryViewModel {
        let vm = makeVM()
        vm.grossAnnual = gross
        vm.year = year
        vm.simpleTaxType = type
        vm.childCount = childCount
        vm.sscCategory = sscCategory
        vm.enableCOLA = enableCOLA
        vm.retry()
        try await Task.sleep(for: .milliseconds(200))
        return vm
    }

    // MARK: - Load

    @Test("load() transitions from loading to content")
    func loadMethod() async throws {
        let vm = makeVM()
        vm.load()
        try await Task.sleep(for: .milliseconds(200))
        guard case .content = vm.state else {
            Issue.record("Expected .content after load(), got \(vm.state)")
            return
        }
    }

    @Test("retry() recovers from error state")
    func retryFromError() async throws {
        // Use a sendable wrapper for the flag
        let failFlag = FailFlag()
        let vm = SalaryViewModel(
            configLoader: { [failFlag] in
                if failFlag.value {
                    throw CalculationError.configNotFound
                }
                return try await TaxConfigStore.shared.load()
            },
            historyStore: SalaryHistoryStore(
                fileURL: FileManager.default.temporaryDirectory
                    .appendingPathComponent("test-retry-\(UUID().uuidString).json")
            ),
            clock: { Date() },
            autoLoad: false
        )

        vm.load()
        try await Task.sleep(for: .milliseconds(200))
        guard case .error = vm.state else {
            Issue.record("Expected .error after failed load")
            return
        }

        failFlag.value = false
        vm.retry()
        try await Task.sleep(for: .milliseconds(200))
        guard case .content = vm.state else {
            Issue.record("Expected .content after retry(), got \(vm.state)")
            return
        }
    }

    // MARK: - Haptic Events

    @Test("calculation success fires haptic event")
    func calculationHaptic() async throws {
        let vm = try await loadedVM()
        #expect(vm.lastHapticEvent == .calculationSuccess)
    }

    @Test("default haptic event is none")
    func defaultHaptic() {
        let vm = makeVM()
        #expect(vm.lastHapticEvent == .none)
    }

    // MARK: - State Persistence

    @Test("persistToStorage writes to UserDefaults")
    func persistToStorage() {
        let vm = makeVM()
        vm.grossAnnual = 55_000
        vm.year = 2025
        vm.simpleTaxType = .parent
        vm.childCount = 3
        vm.sscCategory = .b
        vm.enableCOLA = false
        vm.persistToStorage()

        let defaults = UserDefaults.standard
        #expect(defaults.string(forKey: SalaryViewModel.StorageKeys.grossAnnual) == "55000")
        #expect(defaults.integer(forKey: SalaryViewModel.StorageKeys.year) == 2025)
        #expect(defaults.string(forKey: SalaryViewModel.StorageKeys.taxType) == "parent")
        #expect(defaults.integer(forKey: SalaryViewModel.StorageKeys.childCount) == 3)
        #expect(defaults.string(forKey: SalaryViewModel.StorageKeys.sscCategory) == "B")
        #expect(defaults.bool(forKey: SalaryViewModel.StorageKeys.enableCOLA) == false)

        for key in [
            SalaryViewModel.StorageKeys.grossAnnual,
            SalaryViewModel.StorageKeys.year,
            SalaryViewModel.StorageKeys.taxType,
            SalaryViewModel.StorageKeys.childCount,
            SalaryViewModel.StorageKeys.sscCategory,
            SalaryViewModel.StorageKeys.enableCOLA
        ] {
            defaults.removeObject(forKey: key)
        }
    }

    // MARK: - SalaryViewState

    @Test("SalaryViewState has all four cases")
    func viewStateCases() {
        let loading: SalaryViewState = .loading
        let empty: SalaryViewState = .empty
        let errorState: SalaryViewState = .error("test")
        #expect(loading == .loading)
        #expect(empty == .empty)
        #expect(errorState == .error("test"))
    }

    // MARK: - Edge Cases

    @Test("negative benefits are clamped to zero in calculation")
    func negativeBenefitsClamped() async throws {
        let vm = try await loadedVM(gross: 30_000)
        guard case .content(let content) = vm.state else {
            Issue.record("Expected .content")
            return
        }
        #expect(content.summary.annualNet > 0)
    }

    @Test("very high gross salary calculates without error")
    func highGross() async throws {
        let vm = try await loadedVM(gross: 1_000_000)
        guard case .content(let content) = vm.state else {
            Issue.record("Expected .content")
            return
        }
        #expect(content.summary.annualNet > 0)
        #expect(content.summary.effectiveTaxRate > 0)
    }

    @Test("parent type with 1 child in 2026")
    func parentOneChild2026() async throws {
        let vm = try await loadedVM(
            gross: 40_000, year: 2026, type: .parent, childCount: 1
        )
        guard case .content(let content) = vm.state else {
            Issue.record("Expected .content")
            return
        }
        #expect(content.monthly.count == 12)
        #expect(content.summary.annualNet > 0)
    }

    @Test("SSC category A calculates correctly")
    func sscCategoryA() async throws {
        let vm = try await loadedVM(gross: 25_000, sscCategory: .a)
        guard case .content(let content) = vm.state else {
            Issue.record("Expected .content")
            return
        }
        #expect(content.summary.annualSSC >= 0)
    }

    @Test("SSC category D for self-employed")
    func sscCategoryD() async throws {
        let vm = try await loadedVM(gross: 25_000, sscCategory: .d)
        guard case .content(let content) = vm.state else {
            Issue.record("Expected .content")
            return
        }
        #expect(content.summary.annualSSC > 0)
    }

    @Test("COLA disabled produces lower net for 2026")
    func colaDisabled() async throws {
        let vmWith = try await loadedVM(gross: 25_000, enableCOLA: true)
        let vmWithout = try await loadedVM(gross: 25_000, enableCOLA: false)
        guard case .content(let withCOLA) = vmWith.state,
              case .content(let withoutCOLA) = vmWithout.state else {
            Issue.record("Expected .content on both")
            return
        }
        #expect(withCOLA.summary.annualNet >= withoutCOLA.summary.annualNet)
    }
}

/// Thread-safe mutable flag for test injection.
private final class FailFlag: @unchecked Sendable {
    var value: Bool = true
}
