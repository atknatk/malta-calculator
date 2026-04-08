//
//  SavingsInterestViewModel.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation
import Observation

/// Observable view model for the Savings Interest detail screen.
@Observable
@MainActor
final class SavingsInterestViewModel {

    // MARK: Inputs

    /// Initial deposit in EUR.
    var initialDeposit: Decimal = 10_000
    /// Recurring monthly contribution in EUR.
    var monthlyContribution: Decimal = 200
    /// Annual interest rate as percentage (e.g. 3.5 for 3.5%).
    var annualRate: Decimal = 35 / Decimal(10)
    /// Term in years.
    var termYears: Int = 5
    /// Compounding frequency (monthly or yearly).
    var compoundingFrequency: CompoundingFrequency = .monthly

    /// Latest output.
    private(set) var output: SavingsOutput?

    private let calculator = SavingsCalculator()

    init() { recalculate() }

    /// Recomputes savings output from the current inputs.
    func recalculate() {
        let safeDeposit = Swift.max(initialDeposit, 0)
        let safeContribution = Swift.max(monthlyContribution, 0)
        let safeRate = Swift.max(annualRate, 0)
        let safeYears = Swift.max(termYears, SavingsCalculator.minYears)
        output = calculator.calculate(
            input: SavingsInput(
                initialDeposit: safeDeposit,
                monthlyContribution: safeContribution,
                interestRate: safeRate,
                years: safeYears,
                compoundingFrequency: compoundingFrequency
            )
        )
    }

    func reset() {
        initialDeposit = 10_000
        monthlyContribution = 200
        annualRate = 35 / Decimal(10)
        termYears = 5
        compoundingFrequency = .monthly
        recalculate()
    }

    /// Deep link keys: `deposit`, `monthly`, `rate`, `years`, `frequency` (monthly|yearly).
    func applyInitialParams(_ params: [String: String]) {
        if let raw = params["deposit"], let val = Decimal(string: raw) { initialDeposit = val }
        if let raw = params["monthly"], let val = Decimal(string: raw) { monthlyContribution = val }
        if let raw = params["rate"], let val = Decimal(string: raw) { annualRate = val }
        if let raw = params["years"], let val = Int(raw) { termYears = val }
        if let raw = params["frequency"], let freq = CompoundingFrequency(rawValue: raw) {
            compoundingFrequency = freq
        }
        recalculate()
    }
}
