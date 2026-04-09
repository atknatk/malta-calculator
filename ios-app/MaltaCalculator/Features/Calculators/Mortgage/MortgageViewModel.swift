//
//  MortgageViewModel.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation
import Observation

/// Observable view model for the Mortgage detail screen.
///
/// Owns all user input for the Malta mortgage motor and caches the latest
/// ``MortgageOutput`` so the view can render results without blocking.
@Observable
@MainActor
final class MortgageViewModel {

    // MARK: Inputs

    /// Property purchase price in EUR.
    var propertyPrice: Decimal = 300_000
    /// Deposit as percentage of property price (minimum 10%).
    var depositPercent: Decimal = 20
    /// Annual interest rate as a percentage.
    var interestRate: Decimal = 4.5
    /// Loan term in whole years.
    var loanTermYears: Int = 25

    // MARK: Output

    /// Latest calculation output, `nil` until the first recalculation.
    private(set) var output: MortgageOutput?

    private let calculator = MortgageCalculator()

    /// Defaults used by ``reset()``.
    private let defaults = (
        propertyPrice: Decimal(300_000),
        depositPercent: Decimal(20),
        interestRate: Decimal(45) / 10,
        loanTermYears: 25
    )

    /// Creates a view model and performs an initial calculation.
    init() {
        recalculate()
    }

    /// Recomputes the mortgage output from the current inputs.
    func recalculate() {
        let safePrice = Swift.max(propertyPrice, 0)
        let safeRate = Swift.max(interestRate, 0)
        let safeTerm = Swift.max(loanTermYears, 1)
        output = AppSignpost.measure(.calculation, name: "MortgageRecalculate") {
            calculator.calculate(
                input: MortgageInput(
                    propertyPrice: safePrice,
                    depositPercent: depositPercent,
                    interestRate: safeRate,
                    loanTermYears: safeTerm
                )
            )
        }
    }

    /// Resets all inputs to defaults and recomputes.
    func reset() {
        propertyPrice = defaults.propertyPrice
        depositPercent = defaults.depositPercent
        interestRate = defaults.interestRate
        loanTermYears = defaults.loanTermYears
        recalculate()
    }

    /// Applies deep-link query parameters to the inputs where provided.
    /// Supported keys: `price`, `deposit`, `rate`, `term`.
    func applyInitialParams(_ params: [String: String]) {
        if let raw = params["price"], let value = Decimal(string: raw) {
            propertyPrice = value
        }
        if let raw = params["deposit"], let value = Decimal(string: raw) {
            depositPercent = value
        }
        if let raw = params["rate"], let value = Decimal(string: raw) {
            interestRate = value
        }
        if let raw = params["term"], let value = Int(raw) {
            loanTermYears = value
        }
        recalculate()
    }

    /// Whether the user-provided deposit is below Malta's 10% minimum.
    var depositBelowMinimum: Bool {
        depositPercent < 10
    }
}
