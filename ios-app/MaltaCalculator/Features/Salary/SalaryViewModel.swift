//
//  SalaryViewModel.swift
//  MaltaCalculator
//

import Foundation
import Observation
import CalculationKit
import os

/// View model for the Salary Calculator playground.
///
/// Owns all input state, triggers debounced recalculation via `CalculationKit`,
/// and exposes monthly outputs plus an annual summary for the view layer.
/// Persists last-used inputs to `UserDefaults` so the user's previous session
/// is restored on next launch.
@Observable
@MainActor
final class SalaryViewModel {

    // MARK: - Persistence Keys

    private enum DefaultsKey {
        static let lastGross = "salary.lastGross"
        static let lastYear = "salary.lastYear"
        static let lastTaxType = "salary.lastTaxType"
    }

    // MARK: - Inputs

    /// Annual gross salary in EUR.
    var grossAnnual: Decimal = 25_000
    /// Tax year (2020–2026).
    var year: Int = 2026
    /// Simplified tax filing status.
    var simpleTaxType: SimpleTaxType = .single
    /// Number of dependent children (effective from 2026+ for non-single).
    var childCount: Int = 0
    /// Social Security Contribution category.
    var sscCategory: SSCCategory = .c
    /// Employee date of birth (pre-1962 affects SSC cap).
    var birthDate: Date = DateComponents(
        calendar: Calendar(identifier: .gregorian),
        year: 1990, month: 1, day: 1
    ).date ?? Date()
    /// Yearly non-taxable benefit (e.g. meal vouchers).
    var yearlyNonTaxBenefit: Decimal = 0
    /// Yearly taxable benefit (e.g. company car).
    var yearlyTaxableBenefit: Decimal = 0
    /// Whether to include government bonus (COLA).
    var enableCOLA: Bool = true

    // MARK: - Outputs

    /// Monthly salary breakdown for the selected year.
    private(set) var monthly: [SalaryOutput] = []
    /// Annual summary computed from monthly outputs.
    private(set) var summary: SalarySummary?
    /// Whether a recalculation is in progress.
    private(set) var isCalculating: Bool = false
    /// Error message if calculation fails.
    private(set) var error: String?

    // MARK: - UI State

    /// Set of months whose detail rows are expanded.
    var expandedMonths: Set<Month> = []
    /// Whether the benefits disclosure group is open.
    var showingBenefitsSection: Bool = false
    /// Whether the share sheet is presented.
    var showingShareSheet: Bool = false
    /// Whether the save confirmation alert is shown.
    var showingSaveConfirmation: Bool = false
    /// Whether the birth date picker is expanded.
    var showingBirthDatePicker: Bool = false

    // MARK: - Private

    private var recalcTask: Task<Void, Never>?
    private var taxConfig: MaltaTaxConfig?
    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "SalaryViewModel"
    )

    /// Whether the last calculation completed successfully (drives haptic).
    private(set) var calculationSucceeded: Bool = false

    // MARK: - Initialization

    init() {
        restoreInputs()
        Task { await loadConfigAndCalculate() }
    }

    /// Test-only initializer that skips automatic config loading.
    init(skipAutoLoad: Bool) {
        // no-op: caller will call loadConfigAndCalculate() manually
    }

    /// Test-only initializer that skips auto-load but allows restoring persisted inputs.
    init(skipAutoLoad: Bool, restoreDefaults: Bool) {
        if restoreDefaults {
            restoreInputs()
        }
    }

    // MARK: - Public API

    /// Applies deep link or initial parameters to input state.
    func applyInitialParams(_ params: [String: String]) {
        if let grossStr = params["gross"], let gross = Decimal(string: grossStr) {
            grossAnnual = gross
        }
        if let yearStr = params["year"], let yr = Int(yearStr) {
            year = yr
        }
        if let typeStr = params["type"], let tp = SimpleTaxType(rawValue: typeStr) {
            simpleTaxType = tp
        }
        if let childStr = params["children"], let ch = Int(childStr) {
            childCount = ch
        }
        scheduleRecalculation()
    }

    /// Triggers a debounced recalculation and persists the current inputs.
    func scheduleRecalculation(debounceMs: Int = 80) {
        persistInputs()
        recalcTask?.cancel()
        recalcTask = Task { [weak self] in
            try? await Task.sleep(for: .milliseconds(debounceMs))
            guard !Task.isCancelled, let self else { return }
            await self.recalculate()
        }
    }

    /// Resets all inputs to their default values.
    func reset() {
        grossAnnual = 25_000
        year = 2026
        simpleTaxType = .single
        childCount = 0
        sscCategory = .c
        birthDate = DateComponents(
            calendar: Calendar(identifier: .gregorian),
            year: 1990, month: 1, day: 1
        ).date ?? Date()
        yearlyNonTaxBenefit = 0
        yearlyTaxableBenefit = 0
        enableCOLA = true
        expandedMonths.removeAll()
        showingBenefitsSection = false
        scheduleRecalculation()
    }

    /// Toggles expanded state for a monthly detail row.
    func toggleMonthExpansion(_ month: Month) {
        if expandedMonths.contains(month) {
            expandedMonths.remove(month)
        } else {
            expandedMonths.insert(month)
        }
    }

    /// The monthly gross amount derived from the annual input.
    var monthlyGross: Decimal {
        grossAnnual / 12
    }

    /// Whether child count should be shown based on year and tax type.
    var isChildCountVisible: Bool {
        year >= 2026 && simpleTaxType != .single
    }

    /// Whether COLA toggle should be visible (COLA data exists from 2024+).
    var isCOLAVisible: Bool {
        year >= 2024
    }

    /// Whether the birth date indicates a pre-1962 birth.
    var isBornBefore1962: Bool {
        let cal = Calendar(identifier: .gregorian)
        guard let yr = cal.dateComponents([.year], from: birthDate).year else { return false }
        return yr < 1962
    }

    /// Suggested SSC category label based on input.
    var suggestedSSCCategory: SSCCategory? {
        guard grossAnnual > 0 else { return nil }
        // Simplified recommendation: full-time for most people
        if sscCategory != .c && grossAnnual > 10_000 {
            return .c
        }
        return nil
    }

    // MARK: - Calculation

    /// Loads the tax config and performs the initial calculation.
    func loadConfigAndCalculate() async {
        do {
            taxConfig = try await TaxConfigStore.shared.load()
            await recalculate()
        } catch {
            self.error = error.localizedDescription
            log.error("Failed to load tax config: \(error.localizedDescription, privacy: .public)")
        }
    }

    /// Performs salary calculation with current inputs.
    private func recalculate() async {
        guard let taxConfig else { return }

        isCalculating = true
        defer { isCalculating = false }

        let config = SalaryCalculatorConfig(
            year: year,
            simpleTaxType: simpleTaxType,
            childCount: childCount,
            sscCategory: sscCategory,
            birthDate: birthDate,
            yearlyNonTaxBenefit: yearlyNonTaxBenefit,
            yearlyTaxableBenefit: yearlyTaxableBenefit,
            enableCOLA: enableCOLA
        )

        let inputs = Month.allCases.map { month in
            SalaryInput(
                month: month,
                grossWage: grossAnnual / 12
            )
        }

        let calculator = SalaryCalculator(config: config, taxConfig: taxConfig)
        do {
            let outputs = try calculator.calculate(inputs: inputs)
            monthly = outputs
            summary = SalarySummary(from: outputs)
            error = nil
            calculationSucceeded = true
        } catch {
            self.error = error.localizedDescription
            calculationSucceeded = false
            log.error("Calculation failed: \(error.localizedDescription, privacy: .public)")
        }
    }

    // MARK: - Sharing

    /// Builds share content from the current summary.
    func buildShareContent() -> SalaryShareContent? {
        guard let summary else { return nil }
        return SalaryShareContent(
            year: year,
            annualGross: summary.annualGross,
            annualNet: summary.annualNet,
            annualSSC: summary.annualSSC,
            annualIncomeTax: summary.annualIncomeTax,
            monthlyNet: summary.averageMonthlyNet,
            effectiveTaxRate: summary.effectiveTaxRate
        )
    }

    // MARK: - State Persistence

    /// Saves the current primary inputs to UserDefaults.
    private func persistInputs() {
        let defaults = UserDefaults.standard
        defaults.set("\(grossAnnual)", forKey: DefaultsKey.lastGross)
        defaults.set(year, forKey: DefaultsKey.lastYear)
        defaults.set(simpleTaxType.rawValue, forKey: DefaultsKey.lastTaxType)
    }

    /// Restores previously saved inputs from UserDefaults.
    private func restoreInputs() {
        let defaults = UserDefaults.standard
        if let grossStr = defaults.string(forKey: DefaultsKey.lastGross),
           let gross = Decimal(string: grossStr) {
            grossAnnual = gross
        }
        let savedYear = defaults.integer(forKey: DefaultsKey.lastYear)
        if savedYear >= 2020, savedYear <= 2026 {
            year = savedYear
        }
        if let typeStr = defaults.string(forKey: DefaultsKey.lastTaxType),
           let taxType = SimpleTaxType(rawValue: typeStr) {
            simpleTaxType = taxType
        }
    }
}
