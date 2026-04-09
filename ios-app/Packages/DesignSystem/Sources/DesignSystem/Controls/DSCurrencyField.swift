//
//  DSCurrencyField.swift
//  DesignSystem
//

import SwiftUI

/// A currency input field with euro prefix and decimal keyboard.
///
/// Binds to `Decimal` (never `Double`) per failure pattern F-01.
public struct DSCurrencyField: View {
    @Binding var value: Decimal
    let label: LocalizedStringResource
    let placeholder: String
    let maxValue: Decimal

    @State private var text: String = ""
    @FocusState private var focused: Bool
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    /// Creates a currency input field.
    /// - Parameters:
    ///   - label: Field label displayed above the input.
    ///   - value: Binding to the `Decimal` value.
    ///   - maxValue: Maximum allowed value. Defaults to `10,000,000`.
    ///   - placeholder: Placeholder text. Defaults to `"0"`.
    public init(
        label: LocalizedStringResource,
        value: Binding<Decimal>,
        maxValue: Decimal = 10_000_000,
        placeholder: String = "0"
    ) {
        self.label = label
        self._value = value
        self.maxValue = maxValue
        self.placeholder = placeholder
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Text(label)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
                .textCase(.uppercase)
                .tracking(0.5)

            HStack(spacing: DSSpacing.xs) {
                Text("\u{20AC}")
                    .font(DSFont.body(20, weight: .medium))
                    .foregroundStyle(DSColor.textSecondary)

                TextField(placeholder, text: $text)
                    .font(DSFont.body(20, weight: .semibold))
                    #if os(iOS)
                    .keyboardType(.decimalPad)
                    #endif
                    .focused($focused)
                    .onChange(of: text) { _, newValue in
                        commitText(newValue)
                    }
                    .onAppear {
                        text = formatForDisplay(value)
                    }
            }
            .padding(.horizontal, DSSpacing.md)
            .frame(height: 56)
            .background(
                RoundedRectangle(cornerRadius: DSRadius.lg)
                    .fill(reduceTransparency ? AnyShapeStyle(DSColor.surface) : AnyShapeStyle(.regularMaterial))
                    .overlay(
                        RoundedRectangle(cornerRadius: DSRadius.lg)
                            .strokeBorder(
                                focused ? DSColor.maltaGold : DSColor.textSecondary.opacity(0.15),
                                lineWidth: focused ? 2 : 1
                            )
                    )
            )
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(label)
        .accessibilityValue(accessibilityValueText)
        .accessibilityHint(Text("currencyField.a11y.hint"))
    }

    private var accessibilityValueText: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        return formatter.string(from: value as NSDecimalNumber) ?? "\(value) euros"
    }

    private func commitText(_ newText: String) {
        let sanitized = newText.replacingOccurrences(of: ",", with: ".")
            .filter { $0.isNumber || $0 == "." }
        guard let parsed = Decimal(string: sanitized) else { return }
        value = min(parsed, maxValue)
    }

    private func formatForDisplay(_ val: Decimal) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 2
        return formatter.string(from: val as NSDecimalNumber) ?? ""
    }
}
