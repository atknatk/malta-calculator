//
//  PersonalLoanScreen.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import SwiftUI

/// Personal Loan calculator detail screen.
struct PersonalLoanScreen: View {
    @State private var vm: PersonalLoanViewModel

    /// Creates the screen, applying optional deep-link parameters
    /// (`amount`, `rate`, `months`).
    init(initialParams: [String: String] = [:]) {
        let vm = PersonalLoanViewModel()
        vm.applyInitialParams(initialParams)
        _vm = State(initialValue: vm)
    }

    var body: some View {
        CalculatorDetailScaffold(
            id: .personalLoan,
            title: "calculator.personalLoan.title",
            subtitle: "calculator.personalLoan.subtitle",
            symbolName: CalculatorID.personalLoan.systemImage,
            category: .banking,
            inputs: { inputsSection },
            results: { resultsSection },
            infoLines: Self.infoLines,
            onSave: nil,
            onShare: nil,
            onReset: { vm.reset() }
        )
        .onChange(of: vm.loanAmount) { _, _ in vm.recalculate() }
        .onChange(of: vm.interestRate) { _, _ in vm.recalculate() }
        .onChange(of: vm.termMonths) { _, _ in vm.recalculate() }
    }

    // MARK: - Inputs

    @ViewBuilder
    private var inputsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            DSCurrencyField(
                label: "calculator.personalLoan.amount",
                value: $vm.loanAmount,
                maxValue: 50_000
            )
            DSSliderField(
                label: "calculator.personalLoan.rate",
                value: $vm.interestRate,
                range: 0.5...20,
                step: 0.1,
                suffix: "%",
                fractionDigits: 1
            )
            DSSliderField(
                label: "calculator.personalLoan.term",
                value: Binding(
                    get: { Decimal(vm.termMonths) },
                    set: { vm.termMonths = Int(truncating: $0 as NSDecimalNumber) }
                ),
                range: 6...120,
                step: 1,
                suffix: " mo",
                fractionDigits: 0
            )
        }
    }

    // MARK: - Results

    @ViewBuilder
    private var resultsSection: some View {
        if let output = vm.output {
            VStack(alignment: .leading, spacing: DSSpacing.md) {
                VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                    Text("calculator.personalLoan.monthlyPayment")
                        .font(DSFont.caption)
                        .foregroundStyle(DSColor.textSecondary)
                        .textCase(.uppercase)
                        .tracking(0.5)
                    DSAnimatedNumber(
                        output.monthlyPayment,
                        format: .currency,
                        font: DSFont.displayS
                    )
                    .foregroundStyle(DSColor.maltaGold)
                    .accessibilityLabel(Text("calculator.personalLoan.monthlyPayment"))
                    .accessibilityValue(CalculatorFormat.currency(output.monthlyPayment))
                }

                Divider()

                CalculatorResultRow(
                    label: "calculator.personalLoan.totalInterest",
                    value: CalculatorFormat.currency(output.totalInterest)
                )
                CalculatorResultRow(
                    label: "calculator.personalLoan.totalCost",
                    value: CalculatorFormat.currency(output.totalRepayment)
                )
                CalculatorResultRow(
                    label: "calculator.personalLoan.payments",
                    value: "\(output.numberOfPayments)"
                )
            }
        } else {
            Text("—").foregroundStyle(DSColor.textSecondary)
        }
    }

    private static let infoLines: [InfoLine] = [
        InfoLine(label: "calculator.personalLoan.info.formulaLabel",
                 value: "calculator.personalLoan.info.formulaValue"),
        InfoLine(label: "calculator.personalLoan.info.rangeLabel",
                 value: "calculator.personalLoan.info.rangeValue")
    ]
}
