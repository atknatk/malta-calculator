//
//  PersonalLoanViewModel.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation
import Observation

/// Observable view model for the Personal Loan detail screen.
@Observable
@MainActor
final class PersonalLoanViewModel {

    // MARK: Inputs

    /// Loan amount in EUR (Malta typical: €1,000 – €50,000).
    var loanAmount: Decimal = 10_000
    /// Annual interest rate in percent.
    var interestRate: Decimal = 75 / Decimal(10) // 7.5
    /// Loan term in months.
    var termMonths: Int = 60

    /// Latest output, or `nil` if no calculation has been performed.
    private(set) var output: LoanOutput?

    private let calculator = PersonalLoanCalculator()

    /// Initializes the view model and performs the first calculation.
    init() { recalculate() }

    /// Recomputes the loan output from the current inputs.
    func recalculate() {
        let safeAmount = Swift.max(loanAmount, 0)
        let safeRate = Swift.max(interestRate, 0)
        let safeTerm = Swift.max(termMonths, 1)
        output = calculator.calculate(
            input: LoanInput(
                loanAmount: safeAmount,
                interestRate: safeRate,
                loanTermMonths: safeTerm
            )
        )
    }

    /// Resets inputs to defaults.
    func reset() {
        loanAmount = 10_000
        interestRate = 75 / Decimal(10)
        termMonths = 60
        recalculate()
    }

    /// Applies supported deep link keys (`amount`, `rate`, `months`).
    func applyInitialParams(_ params: [String: String]) {
        if let raw = params["amount"], let val = Decimal(string: raw) { loanAmount = val }
        if let raw = params["rate"], let val = Decimal(string: raw) { interestRate = val }
        if let raw = params["months"], let val = Int(raw) { termMonths = val }
        recalculate()
    }
}
