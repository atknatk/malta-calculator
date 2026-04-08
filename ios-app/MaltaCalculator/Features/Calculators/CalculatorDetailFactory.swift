//
//  CalculatorDetailFactory.swift
//  MaltaCalculator
//

import SwiftUI

/// Factory that resolves a ``CalculatorID`` to its corresponding detail view.
///
/// As feature screens are implemented in later tasks, cases are added here.
/// Until then, all calculators route to ``ComingSoonScreen``.
enum CalculatorDetailFactory {
    /// Build the appropriate detail view for the given calculator.
    ///
    /// - Parameters:
    ///   - id: The calculator to display.
    ///   - initialParams: Optional deep link parameters to pre-fill inputs.
    /// - Returns: The calculator detail view.
    @MainActor
    @ViewBuilder
    static func view(
        for id: CalculatorID,
        initialParams: [String: String] = [:]
    ) -> some View {
        switch id {
        case .salary:
            // Salary is handled by its own dedicated tab.
            EmptyView()
        case .mortgage:
            MortgageScreen(initialParams: initialParams)
        case .personalLoan:
            PersonalLoanScreen(initialParams: initialParams)
        case .stampDuty:
            StampDutyScreen(initialParams: initialParams)
        case .savingsInterest:
            SavingsInterestScreen(initialParams: initialParams)
        default:
            ComingSoonScreen(id: id)
                .navigationTitle(id.displayName)
        }
    }
}
