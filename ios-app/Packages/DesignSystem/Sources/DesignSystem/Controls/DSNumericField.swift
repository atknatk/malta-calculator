//
//  DSNumericField.swift
//  DesignSystem
//

import SwiftUI

/// A numeric text field for non-currency values (e.g. years, counts).
///
/// Binds to `Decimal` for consistency with the financial calculation pipeline.
public struct DSNumericField: View {
    @Binding var value: Decimal
    let label: LocalizedStringResource
    let placeholder: String
    let suffix: String

    @State private var text: String = ""
    @FocusState private var focused: Bool
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    /// Creates a numeric field.
    /// - Parameters:
    ///   - label: Field label.
    ///   - value: Binding to a `Decimal` value.
    ///   - placeholder: Placeholder text. Defaults to `"0"`.
    ///   - suffix: Unit suffix (e.g. "years", "months"). Defaults to empty.
    public init(
        label: LocalizedStringResource,
        value: Binding<Decimal>,
        placeholder: String = "0",
        suffix: String = ""
    ) {
        self.label = label
        self._value = value
        self.placeholder = placeholder
        self.suffix = suffix
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Text(label)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
                .textCase(.uppercase)
                .tracking(0.5)

            HStack(spacing: DSSpacing.xs) {
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

                if !suffix.isEmpty {
                    Text(suffix)
                        .font(DSFont.bodyM)
                        .foregroundStyle(DSColor.textSecondary)
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
    }

    private var accessibilityValueText: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 2
        let num = formatter.string(from: value as NSDecimalNumber) ?? "\(value)"
        return suffix.isEmpty ? num : "\(num) \(suffix)"
    }

    private func commitText(_ newText: String) {
        let sanitized = newText.replacingOccurrences(of: ",", with: ".")
            .filter { $0.isNumber || $0 == "." }
        guard let parsed = Decimal(string: sanitized) else { return }
        value = parsed
    }

    private func formatForDisplay(_ val: Decimal) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 2
        return formatter.string(from: val as NSDecimalNumber) ?? ""
    }
}
