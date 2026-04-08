//
//  ViewModelStateMachineTests.swift
//  MaltaCalculator
//
//  Comprehensive state machine tests verifying that all ViewModels
//  follow the ViewState pattern: loading → content, loading → error → retry → content.
//

import CalculationKit
import Foundation
import Testing
@testable import MaltaCalculator

// MARK: - Salary ViewModel State Machine

@Suite("SalaryViewModel State Machine")
@MainActor
struct SalaryViewModelStateMachineTests {

    private static let testConfigLoader: @Sendable () async throws -> MaltaTaxConfig = {
        try await TaxConfigStore.shared.load()
    }

    private func makeVM() -> SalaryViewModel {
        SalaryViewModel(
            configLoader: Self.testConfigLoader,
            historyStore: SalaryHistoryStore(
                fileURL: FileManager.default.temporaryDirectory
                    .appendingPathComponent("sm-test-\(UUID().uuidString).json")
            ),
            clock: { Date(timeIntervalSince1970: 1_700_000_000) },
            autoLoad: false
        )
    }

    @Test("initial state is loading before load()")
    func initialState() {
        let vm = makeVM()
        #expect(vm.state == .loading)
    }

    @Test("loading → content on successful load")
    func loadingToContent() async throws {
        let vm = makeVM()
        vm.load()
        try await Task.sleep(for: .milliseconds(300))
        guard case .content = vm.state else {
            Issue.record("Expected .content, got \(vm.state)")
            return
        }
    }

    @Test("loading → error when config fails")
    func loadingToError() async throws {
        let vm = SalaryViewModel(
            configLoader: { throw CalculationError.configNotFound },
            historyStore: SalaryHistoryStore(
                fileURL: FileManager.default.temporaryDirectory
                    .appendingPathComponent("sm-err-\(UUID().uuidString).json")
            ),
            clock: { Date() },
            autoLoad: false
        )
        vm.load()
        try await Task.sleep(for: .milliseconds(300))
        guard case .error = vm.state else {
            Issue.record("Expected .error, got \(vm.state)")
            return
        }
    }

    @Test("error → content on successful retry")
    func errorToContentOnRetry() async throws {
        let flag = FailFlagSendable()
        let vm = SalaryViewModel(
            configLoader: { [flag] in
                if flag.value {
                    throw CalculationError.configNotFound
                }
                return try await TaxConfigStore.shared.load()
            },
            historyStore: SalaryHistoryStore(
                fileURL: FileManager.default.temporaryDirectory
                    .appendingPathComponent("sm-retry-\(UUID().uuidString).json")
            ),
            clock: { Date() },
            autoLoad: false
        )

        // First load fails
        vm.load()
        try await Task.sleep(for: .milliseconds(300))
        guard case .error = vm.state else {
            Issue.record("Expected .error after failed load")
            return
        }

        // Fix the error source, then retry
        flag.value = false
        vm.retry()
        try await Task.sleep(for: .milliseconds(300))
        guard case .content = vm.state else {
            Issue.record("Expected .content after retry, got \(vm.state)")
            return
        }
    }

    @Test("content persists after recalculation with new inputs")
    func contentPersistsAfterRecalc() async throws {
        let vm = makeVM()
        vm.load()
        try await Task.sleep(for: .milliseconds(300))
        guard case .content = vm.state else {
            Issue.record("Expected initial .content")
            return
        }

        // Change inputs
        vm.grossAnnual = 50_000
        vm.simpleTaxType = .married
        vm.childCount = 2
        vm.retry()
        try await Task.sleep(for: .milliseconds(300))

        guard case .content(let content) = vm.state else {
            Issue.record("Expected .content after input change")
            return
        }
        #expect(content.summary.annualGross > 0)
    }
}

// MARK: - Calculators Hub ViewModel State Machine

@Suite("CalculatorsViewModel State Machine")
@MainActor
struct CalculatorsViewModelStateMachineTests {

    @Test("initial state is content (catalog loads synchronously)")
    func initialState() {
        let vm = CalculatorsViewModel()
        guard case .content = vm.state else {
            Issue.record("Expected .content on init")
            return
        }
    }

    @Test("retry restores content")
    func retryRestoresContent() {
        let vm = CalculatorsViewModel()
        vm.retry()
        guard case .content = vm.state else {
            Issue.record("Expected .content after retry")
            return
        }
        #expect(!vm.allItems.isEmpty)
    }

    @Test("search producing no results doesn't crash")
    func searchNoResults() {
        let vm = CalculatorsViewModel()
        vm.searchText = "zzz_nonexistent_calculator_xyz"
        #expect(vm.filteredItems.isEmpty)
        // Should still be in content state, just with empty results
        guard case .content = vm.state else {
            Issue.record("Expected .content even with empty search")
            return
        }
    }
}

// MARK: - Mortgage ViewModel State Machine

@Suite("MortgageViewModel State Machine")
@MainActor
struct MortgageViewModelStateMachineTests {

    @Test("has output after init (auto-calculates)")
    func initialOutput() {
        let vm = MortgageViewModel()
        #expect(vm.output != nil)
    }

    @Test("output updates after input change")
    func outputUpdatesOnInputChange() {
        let vm = MortgageViewModel()
        let initialPayment = vm.output?.monthlyPayment
        vm.propertyPrice = 500_000
        vm.recalculate()
        #expect(vm.output?.monthlyPayment != initialPayment)
    }

    @Test("reset produces consistent default output")
    func resetConsistent() {
        let vm = MortgageViewModel()
        vm.propertyPrice = 999_999
        vm.interestRate = 15
        vm.reset()
        #expect(vm.output != nil)
        #expect(vm.propertyPrice == 300_000)
    }
}

// MARK: - Personal Loan ViewModel State Machine

@Suite("PersonalLoanViewModel State Machine")
@MainActor
struct PersonalLoanViewModelStateMachineTests {

    @Test("has output after init")
    func initialOutput() {
        let vm = PersonalLoanViewModel()
        #expect(vm.output != nil)
    }

    @Test("recalculate with changed input produces new output")
    func recalcUpdates() {
        let vm = PersonalLoanViewModel()
        let initial = vm.output?.monthlyPayment
        vm.loanAmount = 50_000
        vm.recalculate()
        #expect(vm.output?.monthlyPayment != initial)
    }

    @Test("reset restores defaults")
    func resetDefaults() {
        let vm = PersonalLoanViewModel()
        vm.loanAmount = 1
        vm.reset()
        #expect(vm.loanAmount == 10_000)
        #expect(vm.output != nil)
    }
}

// MARK: - Stamp Duty ViewModel State Machine

@Suite("StampDutyViewModel State Machine")
@MainActor
struct StampDutyViewModelStateMachineTests {

    @Test("initial output available")
    func initialOutput() {
        let vm = StampDutyViewModel()
        #expect(vm.output != nil)
    }

    @Test("toggle first-time buyer changes output")
    func ftbToggle() {
        let vm = StampDutyViewModel()
        vm.isFirstTimeBuyer = false
        vm.recalculate()
        let standardDuty = vm.output?.stampDuty

        vm.isFirstTimeBuyer = true
        vm.recalculate()
        let ftbDuty = vm.output?.stampDuty

        #expect(ftbDuty ?? 0 <= standardDuty ?? 0,
                "FTB duty should be ≤ standard duty")
    }
}

// MARK: - Savings Interest ViewModel State Machine

@Suite("SavingsInterestViewModel State Machine")
@MainActor
struct SavingsVMStateMachineTests {

    @Test("initial output available")
    func initialOutput() {
        let vm = SavingsInterestViewModel()
        #expect(vm.output != nil)
    }

    @Test("changing rate updates growth")
    func rateChangeUpdates() {
        let vm = SavingsInterestViewModel()
        let initial = vm.output?.totalInterestGross
        vm.annualRate = 10
        vm.recalculate()
        #expect(vm.output?.totalInterestGross != initial)
    }
}

// MARK: - Guides Store State Machine

@Suite("GuidesStore State Machine")
@MainActor
struct GuidesStoreStateMachineTests {

    private func makeStore() -> GuidesStore {
        let suite = "state-test-\(UUID().uuidString)"
        guard let defaults = UserDefaults(suiteName: suite) else {
            fatalError("Failed to create isolated UserDefaults suite")
        }
        return GuidesStore(userDefaults: defaults)
    }

    @Test("initial state is content with all guides")
    func initialState() {
        let store = makeStore()
        if case .content(let guides) = store.state {
            #expect(!guides.isEmpty)
        } else {
            Issue.record("Expected .content on init, got \(store.state)")
        }
    }

    @Test("search transition: content → content (filtered)")
    func searchTransition() {
        let store = makeStore()
        store.searchText = "tax"
        if case .content(let guides) = store.state {
            #expect(!guides.isEmpty)
            #expect(guides.count < store.allGuides.count)
        } else if store.state == .empty {
            // No guides match "tax" — acceptable
        } else {
            Issue.record("Expected .content or .empty for search")
        }
    }

    @Test("search transition: content → empty for no matches")
    func searchToEmpty() {
        let store = makeStore()
        store.searchText = "zzz_no_match_ever_zzz"
        #expect(store.state == .empty)
    }

    @Test("clear search restores all guides")
    func clearSearch() {
        let store = makeStore()
        store.searchText = "zzz"
        #expect(store.state == .empty)
        store.searchText = ""
        if case .content(let guides) = store.state {
            #expect(guides.count == store.allGuides.count)
        } else {
            Issue.record("Expected .content after clearing search")
        }
    }
}

// MARK: - Thread-Safe Helper

private final class FailFlagSendable: @unchecked Sendable {
    var value: Bool = true
}
