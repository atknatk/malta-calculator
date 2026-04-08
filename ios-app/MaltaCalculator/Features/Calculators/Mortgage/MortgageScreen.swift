//
//  MortgageScreen.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import SwiftUI

/// Mortgage calculator detail screen.
struct MortgageScreen: View {
    @State private var vm: MortgageViewModel
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    /// Creates the screen. Initial deep-link parameters are applied once at init.
    /// - Parameter initialParams: Optional deep link values (`price`, `deposit`, `rate`, `term`).
    init(initialParams: [String: String] = [:]) {
        let vm = MortgageViewModel()
        vm.applyInitialParams(initialParams)
        _vm = State(initialValue: vm)
    }

    var body: some View {
        CalculatorDetailScaffold(
            id: .mortgage,
            title: "calculator.mortgage.title",
            subtitle: "calculator.mortgage.subtitle",
            symbolName: CalculatorID.mortgage.systemImage,
            category: .banking,
            inputs: { inputsSection },
            results: { resultsSection },
            infoLines: Self.infoLines,
            onSave: nil,
            onShare: nil,
            onReset: { vm.reset() }
        )
        .onChange(of: vm.propertyPrice) { _, _ in vm.recalculate() }
        .onChange(of: vm.depositPercent) { _, _ in vm.recalculate() }
        .onChange(of: vm.interestRate) { _, _ in vm.recalculate() }
        .onChange(of: vm.loanTermYears) { _, _ in vm.recalculate() }
    }

    // MARK: - Inputs

    @ViewBuilder
    private var inputsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            DSCurrencyField(
                label: "calculator.mortgage.propertyPrice",
                value: $vm.propertyPrice,
                maxValue: 5_000_000
            )
            DSSliderField(
                label: "calculator.mortgage.deposit",
                value: $vm.depositPercent,
                range: 10...90,
                step: 1,
                suffix: "%",
                fractionDigits: 0
            )
            DSSliderField(
                label: "calculator.mortgage.rate",
                value: $vm.interestRate,
                range: 0.5...12,
                step: 0.1,
                suffix: "%",
                fractionDigits: 1
            )
            DSSliderField(
                label: "calculator.mortgage.term",
                value: Binding(
                    get: { Decimal(vm.loanTermYears) },
                    set: { vm.loanTermYears = Int(truncating: $0 as NSDecimalNumber) }
                ),
                range: 5...40,
                step: 1,
                suffix: " yrs",
                fractionDigits: 0
            )

            if vm.depositBelowMinimum {
                Label {
                    Text("calculator.mortgage.depositWarning")
                        .font(DSFont.footnote)
                        .foregroundStyle(DSColor.warning)
                } icon: {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundStyle(DSColor.warning)
                }
                .accessibilityAddTraits(.isStaticText)
            }
        }
    }

    // MARK: - Results

    @ViewBuilder
    private var resultsSection: some View {
        if let output = vm.output {
            VStack(alignment: .leading, spacing: DSSpacing.md) {
                VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                    Text("calculator.mortgage.monthlyPayment")
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
                    .accessibilityLabel(Text("calculator.mortgage.monthlyPayment"))
                    .accessibilityValue(CalculatorFormat.currency(output.monthlyPayment))
                }

                Divider()

                CalculatorResultRow(
                    label: "calculator.mortgage.loanAmount",
                    value: CalculatorFormat.currency(output.loanAmount)
                )
                CalculatorResultRow(
                    label: "calculator.mortgage.deposit",
                    value: CalculatorFormat.currency(output.depositAmount)
                )
                CalculatorResultRow(
                    label: "calculator.mortgage.totalInterest",
                    value: CalculatorFormat.currency(output.totalInterest)
                )
                CalculatorResultRow(
                    label: "calculator.mortgage.totalCost",
                    value: CalculatorFormat.currency(output.totalCost)
                )
                CalculatorResultRow(
                    label: "calculator.mortgage.ltv",
                    value: CalculatorFormat.percent(output.ltvRatio, fractionDigits: 0)
                )
            }
        } else {
            Text("—")
                .foregroundStyle(DSColor.textSecondary)
        }
    }

    // MARK: - Info

    private static let infoLines: [InfoLine] = [
        InfoLine(label: "calculator.mortgage.info.depositLabel", value: "calculator.mortgage.info.depositValue"),
        InfoLine(label: "calculator.mortgage.info.pmtLabel", value: "calculator.mortgage.info.pmtValue"),
        InfoLine(label: "calculator.mortgage.info.ltvLabel", value: "calculator.mortgage.info.ltvValue")
    ]
}
