//
//  DSSliderField.swift
//  DesignSystem
//

import SwiftUI

/// A labeled slider with current value display.
///
/// Used for continuous values like interest rates and loan terms.
public struct DSSliderField: View {
    @Binding var value: Decimal
    let label: LocalizedStringResource
    let range: ClosedRange<Double>
    let step: Double
    let suffix: String
    let fractionDigits: Int

    @State private var sliderValue: Double = 0

    /// Creates a slider field.
    /// - Parameters:
    ///   - label: Field label.
    ///   - value: Binding to a `Decimal` value.
    ///   - range: Slider range.
    ///   - step: Step increment.
    ///   - suffix: Unit suffix (e.g. "%", "years").
    ///   - fractionDigits: Number of decimal places to display. Defaults to `1`.
    public init(
        label: LocalizedStringResource,
        value: Binding<Decimal>,
        range: ClosedRange<Double>,
        step: Double = 1,
        suffix: String = "",
        fractionDigits: Int = 1
    ) {
        self.label = label
        self._value = value
        self.range = range
        self.step = step
        self.suffix = suffix
        self.fractionDigits = fractionDigits
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            HStack {
                Text(label)
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)
                    .textCase(.uppercase)
                    .tracking(0.5)

                Spacer()

                Text(displayText)
                    .font(DSFont.body(16, weight: .semibold))
                    .foregroundStyle(DSColor.maltaGold)
                    .monospacedDigit()
            }

            Slider(value: $sliderValue, in: range, step: step)
                .tint(DSColor.maltaGold)
                .onChange(of: sliderValue) { _, newValue in
                    value = Decimal(newValue)
                }
                .onAppear {
                    sliderValue = Double(truncating: value as NSDecimalNumber)
                }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(label)
        .accessibilityValue(displayText)
    }

    private var displayText: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = fractionDigits
        let num = formatter.string(from: value as NSDecimalNumber) ?? "\(value)"
        return suffix.isEmpty ? num : "\(num)\(suffix)"
    }
}
