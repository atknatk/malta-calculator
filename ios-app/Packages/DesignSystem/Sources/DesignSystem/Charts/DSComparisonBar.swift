//
//  DSComparisonBar.swift
//  DesignSystem
//

import SwiftUI

/// A horizontal comparison bar showing two values side by side.
///
/// Used for scenarios like "with discount" vs "without discount".
public struct DSComparisonBar: View {
    let label1: LocalizedStringResource
    let value1: Decimal
    let label2: LocalizedStringResource
    let value2: Decimal
    let color1: Color
    let color2: Color

    /// Creates a comparison bar.
    /// - Parameters:
    ///   - label1: First bar label.
    ///   - value1: First bar value.
    ///   - label2: Second bar label.
    ///   - value2: Second bar value.
    ///   - color1: First bar color. Defaults to Malta gold.
    ///   - color2: Second bar color. Defaults to Mediterranean blue.
    public init(
        label1: LocalizedStringResource, value1: Decimal,
        label2: LocalizedStringResource, value2: Decimal,
        color1: Color = DSColor.maltaGold,
        color2: Color = DSColor.mediterraneanBlue
    ) {
        self.label1 = label1
        self.value1 = value1
        self.label2 = label2
        self.value2 = value2
        self.color1 = color1
        self.color2 = color2
    }

    public var body: some View {
        let maxVal = max(
            Double(truncating: value1 as NSDecimalNumber),
            Double(truncating: value2 as NSDecimalNumber)
        )

        VStack(spacing: DSSpacing.sm) {
            barRow(label: label1, value: value1, color: color1, maxValue: maxVal)
            barRow(label: label2, value: value2, color: color2, maxValue: maxVal)
        }
        .accessibilityElement(children: .combine)
    }

    private func barRow(
        label: LocalizedStringResource,
        value: Decimal,
        color: Color,
        maxValue: Double
    ) -> some View {
        let fraction = maxValue > 0
            ? Double(truncating: value as NSDecimalNumber) / maxValue
            : 0

        return VStack(alignment: .leading, spacing: DSSpacing.xxs) {
            HStack {
                Text(label)
                    .font(DSFont.bodyS)
                    .foregroundStyle(DSColor.textSecondary)
                Spacer()
                DSAnimatedNumber(value, format: .currency, font: DSFont.body(14, weight: .bold))
                    .foregroundStyle(DSColor.textPrimary)
            }
            GeometryReader { geo in
                RoundedRectangle(cornerRadius: DSRadius.xs)
                    .fill(color)
                    .frame(width: geo.size.width * fraction)
            }
            .frame(height: 8)
            .background(DSColor.surfaceMuted, in: RoundedRectangle(cornerRadius: DSRadius.xs))
        }
        .accessibilityLabel(label)
        .accessibilityValue(formattedValue(value))
    }

    private func formattedValue(_ val: Decimal) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        return formatter.string(from: val as NSDecimalNumber) ?? "\(val)"
    }
}
