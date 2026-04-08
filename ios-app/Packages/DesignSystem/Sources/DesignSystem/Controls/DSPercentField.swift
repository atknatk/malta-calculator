//
//  DSPercentField.swift
//  DesignSystem
//

import SwiftUI

/// A percentage input field combining a slider with a text field.
///
/// Value range is 0-100, displayed with a `%` suffix.
public struct DSPercentField: View {
    @Binding var value: Decimal
    let label: LocalizedStringResource
    let range: ClosedRange<Double>

    @State private var sliderValue: Double = 0
    @FocusState private var focused: Bool
    @State private var text: String = ""
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    /// Creates a percent field.
    /// - Parameters:
    ///   - label: Field label.
    ///   - value: Binding to a `Decimal` percentage value (0-100).
    ///   - range: Allowed range. Defaults to `0...100`.
    public init(
        label: LocalizedStringResource,
        value: Binding<Decimal>,
        range: ClosedRange<Double> = 0...100
    ) {
        self.label = label
        self._value = value
        self.range = range
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Text(label)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
                .textCase(.uppercase)
                .tracking(0.5)

            HStack(spacing: DSSpacing.md) {
                Slider(value: $sliderValue, in: range, step: 0.1)
                    .tint(DSColor.maltaGold)
                    .frame(maxWidth: .infinity)
                    .onChange(of: sliderValue) { _, newValue in
                        let rounded = (newValue * 10).rounded() / 10
                        value = Decimal(rounded)
                        text = formatPercent(value)
                    }

                HStack(spacing: 2) {
                    TextField("0", text: $text)
                        .font(DSFont.body(16, weight: .semibold))
                        #if os(iOS)
                        .keyboardType(.decimalPad)
                        #endif
                        .focused($focused)
                        .frame(width: 48)
                        .multilineTextAlignment(.trailing)
                        .onChange(of: text) { _, newText in
                            commitText(newText)
                        }

                    Text("%")
                        .font(DSFont.body(16, weight: .medium))
                        .foregroundStyle(DSColor.textSecondary)
                }
                .padding(.horizontal, DSSpacing.xs)
                .padding(.vertical, DSSpacing.xxs)
                .background(
                    RoundedRectangle(cornerRadius: DSRadius.sm)
                        .fill(reduceTransparency ? AnyShapeStyle(DSColor.surface) : AnyShapeStyle(.regularMaterial))
                )
            }
        }
        .onAppear {
            sliderValue = Double(truncating: value as NSDecimalNumber)
            text = formatPercent(value)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(label)
        .accessibilityValue("\(text) percent")
    }

    private func commitText(_ newText: String) {
        let sanitized = newText.filter { $0.isNumber || $0 == "." }
        guard let parsed = Double(sanitized) else { return }
        let clamped = min(max(parsed, range.lowerBound), range.upperBound)
        value = Decimal(clamped)
        sliderValue = clamped
    }

    private func formatPercent(_ val: Decimal) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 1
        return formatter.string(from: val as NSDecimalNumber) ?? "0"
    }
}
