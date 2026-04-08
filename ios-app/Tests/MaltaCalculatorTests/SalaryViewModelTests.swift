//
//  SalaryViewModelTests.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation
import Testing
@testable import MaltaCalculator

@Suite("SalaryViewModel")
@MainActor
struct SalaryViewModelTests {

    // MARK: - Helpers

    /// A config loader that returns the shared bundled config synchronously
    /// (avoids flaky timing by loading config on test's actor).
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

    /// Loads config + recalculates, then returns the VM.
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
        // Manually trigger config load + calculate
        vm.retry()
        // Give the task a chance to resolve
        try await Task.sleep(for: .milliseconds(200))
        return vm
    }

    // MARK: - Default State

    @Test("default inputs produce 12-month content state")
    func defaultCalculation() async throws {
        let vm = try await loadedVM()
        guard case .content(let content) = vm.state else {
            Issue.record("Expected .content, got \(vm.state)")
            return
        }
        #expect(content.monthly.count == 12)
        #expect(content.summary.annualGross > 0)
        #expect(content.summary.annualNet > 0)
        #expect(content.summary.annualNet <= content.summary.annualGross)
    }

    // MARK: - Child Count

    @Test("child count respected for 2026 married — lower tax than single")
    func childCount2026Married() async throws {
        let singleVM = try await loadedVM(gross: 40_000, type: .single)
        let married2VM = try await loadedVM(gross: 40_000, type: .married, childCount: 2)
        guard case .content(let single) = singleVM.state,
              case .content(let married) = married2VM.state else {
            Issue.record("Expected .content on both")
            return
        }
        // Married with 2 children should pay less income tax
        #expect(married.summary.annualIncomeTax <= single.summary.annualIncomeTax)
    }

    @Test("child count ignored for pre-2026 years")
    func childCountPre2026() async throws {
        let vm0 = try await loadedVM(year: 2024, type: .married, childCount: 0)
        let vm2 = try await loadedVM(year: 2024, type: .married, childCount: 2)
        guard case .content(let c0) = vm0.state,
              case .content(let c2) = vm2.state else {
            Issue.record("Expected .content")
            return
        }
        // Before 2026, child count has no effect
        #expect(c0.summary.annualIncomeTax == c2.summary.annualIncomeTax)
    }

    @Test("child count ignored for single even in 2026")
    func childCountIgnoredForSingle() async throws {
        let vm0 = try await loadedVM(gross: 40_000, year: 2026, type: .single, childCount: 0)
        let vm2 = try await loadedVM(gross: 40_000, year: 2026, type: .single, childCount: 2)
        guard case .content(let c0) = vm0.state,
              case .content(let c2) = vm2.state else {
            Issue.record("Expected .content")
            return
        }
        #expect(c0.summary.annualIncomeTax == c2.summary.annualIncomeTax)
    }

    // MARK: - Deep Link

    @Test("deep link applies gross and year params")
    func deepLink() async throws {
        let vm = makeVM()
        vm.applyInitialParams(["gross": "50000", "year": "2025", "type": "married"])
        #expect(vm.grossAnnual == 50_000)
        #expect(vm.year == 2025)
        #expect(vm.simpleTaxType == .married)
    }

    @Test("deep link applies childCount and ssc params")
    func deepLinkChildAndSSC() {
        let vm = makeVM()
        vm.applyInitialParams(["childCount": "2", "ssc": "D"])
        #expect(vm.childCount == 2)
        #expect(vm.sscCategory == .d)
    }

    @Test("deep link ignores invalid values")
    func deepLinkInvalid() {
        let vm = makeVM()
        let originalGross = vm.grossAnnual
        vm.applyInitialParams(["gross": "abc", "year": "1999"])
        // Should remain at defaults
        #expect(vm.grossAnnual == originalGross)
        #expect(vm.year == 2026)
    }

    @Test("deep link clamps negative gross to zero")
    func deepLinkNegativeGross() {
        let vm = makeVM()
        vm.applyInitialParams(["gross": "-5000"])
        #expect(vm.grossAnnual == 0)
    }

    @Test("deep link caps child count at 10")
    func deepLinkChildCountCap() {
        let vm = makeVM()
        vm.applyInitialParams(["childCount": "99"])
        #expect(vm.childCount == 10)
    }

    // MARK: - Reset

    @Test("reset restores all inputs to defaults")
    func reset() {
        let vm = makeVM()
        vm.grossAnnual = 75_000
        vm.year = 2024
        vm.simpleTaxType = .married
        vm.childCount = 3
        vm.sscCategory = .a
        vm.enableCOLA = false
        vm.expandedMonths = [.january, .march]

        vm.reset()

        #expect(vm.grossAnnual == 25_000)
        #expect(vm.year == 2026)
        #expect(vm.simpleTaxType == .single)
        #expect(vm.childCount == 0)
        #expect(vm.sscCategory == .c)
        #expect(vm.enableCOLA == true)
        #expect(vm.expandedMonths.isEmpty)
    }

    @Test("reset fires reset haptic event")
    func resetHaptic() {
        let vm = makeVM()
        vm.reset()
        #expect(vm.lastHapticEvent == .reset)
    }

    // MARK: - Zero Gross

    @Test("zero gross produces minimal output without error")
    func zeroGross() async throws {
        let vm = try await loadedVM(gross: 0, enableCOLA: false)
        guard case .content(let content) = vm.state else {
            Issue.record("Expected .content")
            return
        }
        #expect(content.summary.annualIncomeTax == 0)
        // With 0 gross and no COLA, SSC should be 0
        #expect(content.summary.annualSSC == 0)
    }

    // MARK: - Toggle Month Expansion

    @Test("toggleMonthExpansion adds and removes months")
    func toggleMonth() {
        let vm = makeVM()
        vm.toggleMonthExpansion(.january)
        #expect(vm.expandedMonths.contains(.january))
        vm.toggleMonthExpansion(.january)
        #expect(!vm.expandedMonths.contains(.january))
    }

    // MARK: - Save

    @Test("save writes entry to history store")
    func saveToHistory() async throws {
        let vm = try await loadedVM()
        let saved = vm.save()
        #expect(saved == true)
        #expect(vm.showingSaveConfirmation == true)
    }

    @Test("save returns false when state is not content")
    func saveWithoutContent() {
        let vm = makeVM()
        // State is .loading, no content
        let saved = vm.save()
        #expect(saved == false)
    }

    @Test("save fires save haptic event")
    func saveHaptic() async throws {
        let vm = try await loadedVM()
        vm.save()
        #expect(vm.lastHapticEvent == .save)
    }

    // MARK: - Share Content

    @Test("buildShareContent returns payload when content available")
    func shareContent() async throws {
        let vm = try await loadedVM(gross: 30_000)
        let content = vm.buildShareContent()
        #expect(content != nil)
        #expect(content?.year == 2026)
        #expect((content?.annualGross ?? 0) > 0)
    }

    @Test("buildShareContent returns nil when state is not content")
    func shareContentNil() {
        let vm = makeVM()
        #expect(vm.buildShareContent() == nil)
    }

    @Test("buildShareRenderer returns renderer when content available")
    func shareRenderer() async throws {
        let vm = try await loadedVM(gross: 30_000)
        let renderer = vm.buildShareRenderer()
        #expect(renderer != nil)
    }

    @Test("buildShareRenderer returns nil without content")
    func shareRendererNil() {
        let vm = makeVM()
        #expect(vm.buildShareRenderer() == nil)
    }

    // MARK: - Derived Properties

    @Test("isChildCountApplicable depends on year and tax type")
    func childCountApplicability() {
        let vm = makeVM()
        vm.year = 2026
        vm.simpleTaxType = .married
        #expect(vm.isChildCountApplicable == true)

        vm.simpleTaxType = .single
        #expect(vm.isChildCountApplicable == false)

        vm.simpleTaxType = .parent
        vm.year = 2024
        #expect(vm.isChildCountApplicable == false)
    }

    @Test("isCOLASupported depends on year")
    func colaSupport() {
        let vm = makeVM()
        vm.year = 2026
        #expect(vm.isCOLASupported == true)
        vm.year = 2023
        #expect(vm.isCOLASupported == false)
    }

    @Test("isBornBefore1962 checks birth date year")
    func bornBefore1962() {
        let vm = makeVM()
        let cal = Calendar(identifier: .gregorian)
        vm.birthDate = cal.date(from: DateComponents(year: 1960, month: 6, day: 15)) ?? Date()
        #expect(vm.isBornBefore1962 == true)
        vm.birthDate = cal.date(from: DateComponents(year: 1980, month: 1, day: 1)) ?? Date()
        #expect(vm.isBornBefore1962 == false)
    }

    // MARK: - SalarySavedPayload

    @Test("makePayload captures current inputs")
    func makePayload() {
        let vm = makeVM()
        vm.grossAnnual = 42_000
        vm.year = 2025
        vm.simpleTaxType = .parent
        vm.childCount = 1
        vm.sscCategory = .d
        vm.enableCOLA = false
        let payload = vm.makePayload()
        #expect(payload.grossAnnual == 42_000)
        #expect(payload.year == 2025)
        #expect(payload.simpleTaxType == .parent)
        #expect(payload.childCount == 1)
        #expect(payload.sscCategory == .d)
        #expect(payload.enableCOLA == false)
    }

    // MARK: - Insights

    @Test("insightBullets non-empty when content available")
    func insightBullets() async throws {
        let vm = try await loadedVM()
        let bullets = vm.insightBullets
        #expect(!bullets.isEmpty)
    }

    @Test("insightBullets includes child bracket hint for 2026 married")
    func insightBulletsChildHint() async throws {
        let vm = try await loadedVM(gross: 30_000, year: 2026, type: .married)
        let bullets = vm.insightBullets
        let hasChildHint = bullets.contains { $0.contains("child") || $0.contains("Child") }
        #expect(hasChildHint)
    }

    @Test("insightBullets empty when state is not content")
    func insightBulletsEmpty() {
        let vm = makeVM()
        #expect(vm.insightBullets.isEmpty)
    }

}

// Extended VM tests (load/retry, haptics, persistence, edge cases)
// are in SalaryViewModelExtendedTests.swift.

// Additional test suites (SalaryShareContent, SalarySavedPayload,
// SalaryInsights, SalaryHistoryStore) are in SalarySupplementaryTests.swift.
