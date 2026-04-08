//
//  StampDutyViewModel.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation
import Observation

/// Observable view model for the Stamp Duty detail screen.
@Observable
@MainActor
final class StampDutyViewModel {

    // MARK: Inputs

    /// Property purchase price in EUR.
    var propertyPrice: Decimal = 250_000
    /// Whether the buyer qualifies for the first-time-buyer exemption.
    var isFirstTimeBuyer: Bool = false

    /// Latest output, or `nil` until the first calculation runs.
    private(set) var output: StampDutyOutput?

    private let calculator = StampDutyCalculator()

    /// Creates a new view model and performs the first calculation.
    init() { recalculate() }

    /// Recomputes the stamp duty output from the current inputs.
    func recalculate() {
        let safePrice = Swift.max(propertyPrice, 0)
        output = calculator.calculate(
            input: StampDutyInput(
                propertyPrice: safePrice,
                isFirstTimeBuyer: isFirstTimeBuyer
            )
        )
    }

    /// Resets inputs to defaults.
    func reset() {
        propertyPrice = 250_000
        isFirstTimeBuyer = false
        recalculate()
    }

    /// Applies supported deep-link keys (`price`, `firstTime`).
    func applyInitialParams(_ params: [String: String]) {
        if let raw = params["price"], let value = Decimal(string: raw) {
            propertyPrice = value
        }
        if let raw = params["firstTime"] {
            isFirstTimeBuyer = (raw as NSString).boolValue
        }
        recalculate()
    }
}
