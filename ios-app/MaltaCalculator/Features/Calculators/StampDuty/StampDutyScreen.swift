//
//  StampDutyScreen.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import SwiftUI

/// Stamp Duty calculator detail screen.
struct StampDutyScreen: View {
    @State private var vm: StampDutyViewModel
    @State private var showingShare: Bool = false

    init(initialParams: [String: String] = [:]) {
        let vm = StampDutyViewModel()
        vm.applyInitialParams(initialParams)
        _vm = State(initialValue: vm)
    }

    var body: some View {
        CalculatorDetailScaffold(
            id: .stampDuty,
            title: "calculator.stampDuty.title",
            subtitle: "calculator.stampDuty.subtitle",
            symbolName: CalculatorID.stampDuty.systemImage,
            category: .property,
            inputs: { inputsSection },
            results: { resultsSection },
            infoLines: Self.infoLines,
            onSave: nil,
            onShare: vm.output != nil ? { showingShare = true } : nil,
            onReset: { vm.reset() }
        )
        .onChange(of: vm.propertyPrice) { _, _ in vm.recalculate() }
        .onChange(of: vm.isFirstTimeBuyer) { _, _ in vm.recalculate() }
        .sheet(isPresented: $showingShare) {
            if let content = CalculatorShareBuilders.stampDuty(vm) {
                CalculatorShareSheet(content: content, isPresented: $showingShare)
            }
        }
    }

    @ViewBuilder
    private var inputsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            DSCurrencyField(
                label: "calculator.stampDuty.propertyPrice",
                value: $vm.propertyPrice,
                maxValue: 5_000_000
            )
            Toggle(isOn: $vm.isFirstTimeBuyer) {
                Text("calculator.stampDuty.firstTimeBuyer")
                    .font(DSFont.body(15))
                    .foregroundStyle(DSColor.textPrimary)
            }
            .tint(DSColor.maltaGold)
            .accessibilityHint(Text("calculator.stampDuty.firstTimeBuyer.hint"))
        }
    }

    @ViewBuilder
    private var resultsSection: some View {
        if let output = vm.output {
            VStack(alignment: .leading, spacing: DSSpacing.md) {
                VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                    Text("calculator.stampDuty.duty")
                        .font(DSFont.caption)
                        .foregroundStyle(DSColor.textSecondary)
                        .textCase(.uppercase)
                        .tracking(0.5)
                    DSAnimatedNumber(
                        output.stampDuty,
                        format: .currency,
                        font: DSFont.displayS
                    )
                    .foregroundStyle(DSColor.maltaGold)
                    .accessibilityLabel(Text("calculator.stampDuty.duty"))
                    .accessibilityValue(CalculatorFormat.currency(output.stampDuty))
                }

                Divider()

                CalculatorResultRow(
                    label: "calculator.stampDuty.effectiveRate",
                    value: CalculatorFormat.percent(output.effectiveRate, fractionDigits: 2)
                )
                if vm.isFirstTimeBuyer {
                    CalculatorResultRow(
                        label: "calculator.stampDuty.exempted",
                        value: CalculatorFormat.currency(output.exemptedAmount)
                    )
                    CalculatorResultRow(
                        label: "calculator.stampDuty.savings",
                        value: CalculatorFormat.currency(output.savings),
                        emphasis: true
                    )
                }
                CalculatorResultRow(
                    label: "calculator.stampDuty.taxable",
                    value: CalculatorFormat.currency(output.taxableAmount)
                )
            }
        } else {
            Text("—").foregroundStyle(DSColor.textSecondary)
        }
    }

    private static let infoLines: [InfoLine] = [
        InfoLine(label: "calculator.stampDuty.info.standardLabel",
                 value: "calculator.stampDuty.info.standardValue"),
        InfoLine(label: "calculator.stampDuty.info.exemptionLabel",
                 value: "calculator.stampDuty.info.exemptionValue"),
        InfoLine(label: "calculator.stampDuty.info.maxSavingsLabel",
                 value: "calculator.stampDuty.info.maxSavingsValue")
    ]
}
