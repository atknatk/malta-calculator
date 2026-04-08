//
//  SalaryViewModel.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation
import Observation
import os

/// View-model for the Salary playground screen.
///
/// Owns the tax-config load, debounced recalculation, state restoration
/// (via `@AppStorage`-compatible keys), share-content derivation, and
/// history persistence. The view is passive — it only reads state and
/// calls methods here.
@Observable
@MainActor
final class SalaryViewModel {

    // MARK: - Inputs

    /// Annual gross salary in euros.
    var grossAnnual: Decimal = 25_000
    /// Tax year (2020 ... 2026).
    var year: Int = 2026
    /// Simplified tax type.
    var simpleTaxType: SimpleTaxType = .single
    /// Number of dependent children (2026+).
    var childCount: Int = 0
    /// SSC contribution category.
    var sscCategory: SSCCategory = .c
    /// Employee date of birth.
    var birthDate: Date = SalaryViewModel.defaultBirthDate
    /// Yearly non-taxable benefits.
    var yearlyNonTaxBenefit: Decimal = 0
    /// Yearly taxable benefits.
    var yearlyTaxableBenefit: Decimal = 0
    /// Whether COLA is automatically applied.
    var enableCOLA: Bool = true

    // MARK: - Outputs

    /// Screen rendering state.
    private(set) var state: SalaryViewState = .loading
    /// Whether a debounced recalculation is currently in flight.
    private(set) var isCalculating: Bool = false

    // MARK: - UI state

    /// Set of monthly rows the user has expanded.
    var expandedMonths: Set<Month> = []
    /// Whether the benefits disclosure group is open.
    var showingBenefitsSection: Bool = false
    /// Whether the share sheet is presented.
    var showingShareSheet: Bool = false
    /// Whether the save-confirmation alert is presented.
    var showingSaveConfirmation: Bool = false
    /// Whether the reset confirmation dialog is presented.
    var showingResetConfirmation: Bool = false

    /// Haptic event fired by the VM for the view to observe.
    ///
    /// The view uses `.sensoryFeedback` keyed on this value so haptics
    /// stay out of the VM's pure logic while remaining testable.
    var lastHapticEvent: HapticEvent = .none

    // MARK: - Internal

    private var recalcTask: Task<Void, Never>?
    private var taxConfig: MaltaTaxConfig?

    /// Injected config loader — defaults to the shared bundled store.
    /// Replaceable from tests via ``init(configLoader:historyStore:)``.
    private let configLoader: @Sendable () async throws -> MaltaTaxConfig
    private let historyStore: SalaryHistoryStore
    private let clock: @Sendable () -> Date

    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "SalaryViewModel"
    )

    /// The default birth date used when no date has been restored yet.
    static var defaultBirthDate: Date {
        DateComponents(
            calendar: Calendar(identifier: .gregorian),
            year: 1990, month: 1, day: 1
        ).date ?? Date(timeIntervalSince1970: 631_152_000)
    }

    // MARK: - Init

    /// Creates a new view model.
    ///
    /// - Parameters:
    ///   - configLoader: Closure that loads the ``MaltaTaxConfig``. Defaults
    ///     to ``TaxConfigStore/shared``.
    ///   - historyStore: History store used to persist saved calculations.
    ///     Defaults to ``SalaryHistoryStore/shared``.
    ///   - clock: Closure returning the current wall-clock date (injectable
    ///     for deterministic tests).
    ///   - autoLoad: When true, the view model kicks off config loading and
    ///     an initial recalculation immediately. Tests set this to `false`
    ///     so they can inject state before the first computation.
    init(
        configLoader: (@Sendable () async throws -> MaltaTaxConfig)? = nil,
        historyStore: SalaryHistoryStore = .shared,
        clock: @escaping @Sendable () -> Date = { Date() },
        autoLoad: Bool = true
    ) {
        self.configLoader = configLoader ?? { try await TaxConfigStore.shared.load() }
        self.historyStore = historyStore
        self.clock = clock

        if autoLoad {
            restoreFromStorage()
            Task { [weak self] in
                await self?.loadConfigAndCalculate()
            }
        }
    }

    // MARK: - Public API

    /// Loads tax configuration and performs an initial calculation.
    ///
    /// Called automatically on init when `autoLoad` is true. Can be called
    /// manually to trigger a fresh config load (e.g. after a config update).
    func load() {
        state = .loading
        Task { [weak self] in
            await self?.loadConfigAndCalculate()
        }
    }

    /// Applies deep-link parameters on top of the current state.
    ///
    /// Supported keys: `gross`, `year`, `type` (`single|married|parent`),
    /// `childCount`, `ssc` (`A|B|C|D`).
    func applyInitialParams(_ params: [String: String]) {
        if let grossStr = params["gross"], let gross = Decimal(string: grossStr) {
            grossAnnual = gross.nonNegative
        }
        if let yearStr = params["year"], let yearValue = Int(yearStr),
           SalaryViewModel.supportedYears.contains(yearValue) {
            year = yearValue
        }
        if let typeStr = params["type"]?.lowercased(),
           let type = SimpleTaxType(rawValue: typeStr) {
            simpleTaxType = type
        }
        if let childStr = params["childCount"], let count = Int(childStr), count >= 0 {
            childCount = min(count, 10)
        }
        if let sscStr = params["ssc"]?.uppercased(),
           let category = SSCCategory(rawValue: sscStr) {
            sscCategory = category
        }
        scheduleRecalculation(debounceMs: 0)
    }

    /// Schedules a debounced recalculation — coalesces bursts of input.
    func scheduleRecalculation(debounceMs: Int = 80) {
        recalcTask?.cancel()
        let delay = max(0, debounceMs)
        recalcTask = Task { [weak self] in
            if delay > 0 {
                try? await Task.sleep(for: .milliseconds(delay))
            }
            guard !Task.isCancelled else { return }
            await self?.recalculate()
        }
    }

    /// Resets every input to its default value and re-runs the calculation.
    func reset() {
        grossAnnual = 25_000
        year = 2026
        simpleTaxType = .single
        childCount = 0
        sscCategory = .c
        birthDate = Self.defaultBirthDate
        yearlyNonTaxBenefit = 0
        yearlyTaxableBenefit = 0
        enableCOLA = true
        expandedMonths.removeAll()
        lastHapticEvent = .reset
        persistToStorage()
        scheduleRecalculation(debounceMs: 0)
    }

    /// Toggles the expansion state of a month row.
    func toggleMonthExpansion(_ month: Month) {
        if expandedMonths.contains(month) {
            expandedMonths.remove(month)
        } else {
            expandedMonths.insert(month)
        }
    }

    /// Persists the current calculation to the history store.
    ///
    /// - Returns: `true` when a new history entry was written.
    @discardableResult
    func save() -> Bool {
        guard case .content(let content) = state else { return false }
        let payload = makePayload()
        let title = String(
            localized: "salary.save.entryTitle \(String(year)) \(grossAnnual.eur)"
        )
        let summary = String(
            localized: "salary.save.entrySummary \(content.summary.averageMonthlyNet.eur)"
        )
        let entry = SalaryHistoryEntry(
            id: UUID(),
            title: title,
            summary: summary,
            createdAt: clock(),
            payload: payload
        )
        historyStore.add(entry)
        showingSaveConfirmation = true
        lastHapticEvent = .save
        return true
    }

    /// Builds the numeric payload used for PNG/PDF share exports.
    func buildShareContent() -> SalaryShareContent? {
        guard case .content(let content) = state else { return nil }
        return SalaryShareContent(
            year: year,
            annualGross: content.summary.annualGross,
            annualNet: content.summary.annualNet,
            annualSSC: content.summary.annualSSC,
            annualIncomeTax: content.summary.annualIncomeTax,
            monthlyNet: content.summary.averageMonthlyNet,
            effectiveTaxRate: content.summary.effectiveTaxRate
        )
    }

    /// Creates a ``SalaryShareRenderer`` for the current calculation result.
    func buildShareRenderer() -> SalaryShareRenderer? {
        guard let content = buildShareContent() else { return nil }
        return SalaryShareRenderer(content: content)
    }

    /// Serialises the current inputs as a history payload.
    func makePayload() -> SalarySavedPayload {
        SalarySavedPayload(
            grossAnnual: grossAnnual,
            year: year,
            simpleTaxType: simpleTaxType,
            childCount: childCount,
            sscCategory: sscCategory,
            birthDate: birthDate,
            yearlyNonTaxBenefit: yearlyNonTaxBenefit,
            yearlyTaxableBenefit: yearlyTaxableBenefit,
            enableCOLA: enableCOLA
        )
    }

    /// Persists the current input state to UserDefaults for next launch.
    func persistToStorage() {
        let defaults = UserDefaults.standard
        defaults.set(
            (grossAnnual as NSDecimalNumber).stringValue,
            forKey: StorageKeys.grossAnnual
        )
        defaults.set(year, forKey: StorageKeys.year)
        defaults.set(simpleTaxType.rawValue, forKey: StorageKeys.taxType)
        defaults.set(childCount, forKey: StorageKeys.childCount)
        defaults.set(sscCategory.rawValue, forKey: StorageKeys.sscCategory)
        defaults.set(enableCOLA, forKey: StorageKeys.enableCOLA)
    }

    // MARK: - Accessors

    /// Derived convenience: the current monthly breakdown (empty until calculation completes).
    var monthly: [SalaryOutput] {
        if case .content(let content) = state { return content.monthly }
        return []
    }

    /// Derived convenience: the current annual summary.
    var summary: SalarySummary? {
        if case .content(let content) = state { return content.summary }
        return nil
    }

    /// Derived convenience: the current error message, or nil.
    var errorMessage: String? {
        if case .error(let message) = state { return message }
        return nil
    }

    /// Whether the child-count input is applicable to the current selection.
    var isChildCountApplicable: Bool {
        year >= 2026 && simpleTaxType != .single
    }

    /// Whether the birth-date value results in the pre-1962 SSC branch.
    var isBornBefore1962: Bool {
        let calendar = Calendar(identifier: .gregorian)
        return calendar.component(.year, from: birthDate) < 1962
    }

    /// Whether COLA is applicable to the selected year.
    var isCOLASupported: Bool { year >= 2024 }

    /// Insight bullets derived from the current calculation.
    var insightBullets: [String] {
        guard let summary else { return [] }
        return SalaryInsights(
            summary: summary,
            year: year,
            simpleTaxType: simpleTaxType
        ).bullets
    }

    /// Supported calculation years (inclusive).
    static let supportedYears: [Int] = Array(2020...2026)

    // MARK: - Calculation

    private func loadConfigAndCalculate() async {
        do {
            let config = try await configLoader()
            self.taxConfig = config
            await recalculate()
        } catch {
            log.error("Failed to load tax config: \(error.localizedDescription, privacy: .public)")
            self.state = .error(
                String(localized: "salary.error.configLoad")
            )
        }
    }

    /// Retry config load after an error.
    func retry() {
        state = .loading
        Task { [weak self] in
            await self?.loadConfigAndCalculate()
        }
    }

    private func recalculate() async {
        guard let taxConfig else {
            // Config still loading — calling scheduleRecalculation() before
            // load completes is safe; we just wait for the initial load.
            return
        }

        isCalculating = true
        defer { isCalculating = false }

        // Normalise inputs so negative values never reach the motor.
        let gross = grossAnnual.nonNegative
        let nonTax = yearlyNonTaxBenefit.nonNegative
        let taxable = yearlyTaxableBenefit.nonNegative
        let effectiveCOLA = isCOLASupported && enableCOLA
        let effectiveChildCount = isChildCountApplicable ? childCount : 0

        let config = SalaryCalculatorConfig(
            year: year,
            simpleTaxType: simpleTaxType,
            childCount: effectiveChildCount,
            sscCategory: sscCategory,
            birthDate: birthDate,
            yearlyNonTaxBenefit: nonTax,
            yearlyTaxableBenefit: taxable,
            monthlyBonus: 0,
            enableCOLA: effectiveCOLA
        )

        let monthlyGross = gross / 12
        let inputs = Month.allCases.map { month in
            SalaryInput(
                month: month,
                grossWage: monthlyGross,
                bonus: 0,
                governmentBonus: 0,
                allowanceBonus: 0
            )
        }

        do {
            let calculator = SalaryCalculator(config: config, taxConfig: taxConfig)
            let outputs = try calculator.calculate(inputs: inputs)
            let summary = SalarySummary(from: outputs)
            self.state = .content(SalaryContent(monthly: outputs, summary: summary))
            self.lastHapticEvent = .calculationSuccess
            persistToStorage()
        } catch {
            log.error("Calculation failed: \(error.localizedDescription, privacy: .public)")
            self.state = .error(
                String(localized: "salary.error.calculation")
            )
        }
    }

    // MARK: - State Persistence

    /// Restores previously persisted input state from UserDefaults.
    private func restoreFromStorage() {
        let defaults = UserDefaults.standard

        if let grossStr = defaults.string(forKey: StorageKeys.grossAnnual),
           let gross = Decimal(string: grossStr), gross > 0 {
            grossAnnual = gross
        }

        let storedYear = defaults.integer(forKey: StorageKeys.year)
        if Self.supportedYears.contains(storedYear) {
            year = storedYear
        }

        if let typeStr = defaults.string(forKey: StorageKeys.taxType),
           let type = SimpleTaxType(rawValue: typeStr) {
            simpleTaxType = type
        }

        let storedChildren = defaults.integer(forKey: StorageKeys.childCount)
        if storedChildren >= 0, storedChildren <= 10 {
            childCount = storedChildren
        }

        if let sscStr = defaults.string(forKey: StorageKeys.sscCategory),
           let category = SSCCategory(rawValue: sscStr) {
            sscCategory = category
        }

        // enableCOLA defaults to true; only restore if the key was explicitly set.
        if defaults.object(forKey: StorageKeys.enableCOLA) != nil {
            enableCOLA = defaults.bool(forKey: StorageKeys.enableCOLA)
        }
    }
}

// MARK: - Supporting Types

extension SalaryViewModel {
    /// Discrete haptic events the view can observe.
    enum HapticEvent: Equatable {
        /// No event.
        case none
        /// Calculation completed successfully.
        case calculationSuccess
        /// Entry saved to history.
        case save
        /// Inputs were reset to defaults.
        case reset
        /// Share sheet was opened.
        case share
    }

    /// Keys used for UserDefaults-based state persistence.
    enum StorageKeys {
        static let grossAnnual = "salary.lastGross"
        static let year = "salary.lastYear"
        static let taxType = "salary.lastTaxType"
        static let childCount = "salary.lastChildCount"
        static let sscCategory = "salary.lastSSCCategory"
        static let enableCOLA = "salary.lastCOLA"
    }
}
