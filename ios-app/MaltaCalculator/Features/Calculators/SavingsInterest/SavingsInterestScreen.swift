//
//  SavingsInterestScreen.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import SwiftUI

/// Savings Interest calculator detail screen.
struct SavingsInterestScreen: View {
    @State private var vm: SavingsInterestViewModel

    init(initialParams: [String: String] = [:]) {
        let vm = SavingsInterestViewModel()
        vm.applyInitialParams(initialParams)
        _vm = State(initialValue: vm)
    }

    var body: some View {
        CalculatorDetailScaffold(
            id: .savingsInterest,
            title: "calculator.savingsInterest.title",
            subtitle: "calculator.savingsInterest.subtitle",
            symbolName: CalculatorID.savingsInterest.systemImage,
            category: .banking,
            inputs: { inputsSection },
            results: { resultsSection },
            infoLines: Self.infoLines,
            onSave: nil,
            onShare: nil,
            onReset: { vm.reset() }
        )
        .onChange(of: vm.initialDeposit) { _, _ in vm.recalculate() }
        .onChange(of: vm.monthlyContribution) { _, _ in vm.recalculate() }
        .onChange(of: vm.annualRate) { _, _ in vm.recalculate() }
        .onChange(of: vm.termYears) { _, _ in vm.recalculate() }
        .onChange(of: vm.compoundingFrequency) { _, _ in vm.recalculate() }
    }

    @ViewBuilder
    private var inputsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            DSCurrencyField(
                label: "calculator.savingsInterest.initialDeposit",
                value: $vm.initialDeposit,
                maxValue: 1_000_000
            )
            DSCurrencyField(
                label: "calculator.savingsInterest.monthlyContribution",
                value: $vm.monthlyContribution,
                maxValue: 50_000
            )
            DSSliderField(
                label: "calculator.savingsInterest.rate",
                value: $vm.annualRate,
                range: 0...10,
                step: 0.1,
                suffix: "%",
                fractionDigits: 1
            )
            DSSliderField(
                label: "calculator.savingsInterest.term",
                value: Binding(
                    get: { Decimal(vm.termYears) },
                    set: { vm.termYears = Int(truncating: $0 as NSDecimalNumber) }
                ),
                range: Double(SavingsCalculator.minYears)...Double(SavingsCalculator.maxYears),
                step: 1,
                suffix: " yrs",
                fractionDigits: 0
            )
            DSSegmentedPicker(
                label: "calculator.savingsInterest.frequency",
                selection: $vm.compoundingFrequency,
                options: [
                    (value: .monthly, label: "calculator.savingsInterest.frequency.monthly"),
                    (value: .yearly, label: "calculator.savingsInterest.frequency.yearly")
                ]
            )
        }
    }

    @ViewBuilder
    private var resultsSection: some View {
        if let output = vm.output {
            VStack(alignment: .leading, spacing: DSSpacing.md) {
                VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                    Text("calculator.savingsInterest.finalBalance")
                        .font(DSFont.caption)
                        .foregroundStyle(DSColor.textSecondary)
                        .textCase(.uppercase)
                        .tracking(0.5)
                    DSAnimatedNumber(
                        output.finalBalanceNet,
                        format: .currency,
                        font: DSFont.displayS
                    )
                    .foregroundStyle(DSColor.maltaGold)
                    .accessibilityLabel(Text("calculator.savingsInterest.finalBalance"))
                    .accessibilityValue(CalculatorFormat.currency(output.finalBalanceNet))
                }

                Divider()

                CalculatorResultRow(
                    label: "calculator.savingsInterest.contributions",
                    value: CalculatorFormat.currency(output.totalContributions)
                )
                CalculatorResultRow(
                    label: "calculator.savingsInterest.interestNet",
                    value: CalculatorFormat.currency(output.totalInterestNet)
                )
                CalculatorResultRow(
                    label: "calculator.savingsInterest.tax",
                    value: CalculatorFormat.currency(output.withholdingTax)
                )
                CalculatorResultRow(
                    label: "calculator.savingsInterest.yield",
                    value: CalculatorFormat.percent(output.effectiveYieldNet, fractionDigits: 2)
                )
            }
        } else {
            Text("—").foregroundStyle(DSColor.textSecondary)
        }
    }

    private static let infoLines: [InfoLine] = [
        InfoLine(label: "calculator.savingsInterest.info.formulaLabel",
                 value: "calculator.savingsInterest.info.formulaValue"),
        InfoLine(label: "calculator.savingsInterest.info.taxLabel",
                 value: "calculator.savingsInterest.info.taxValue")
    ]
}
