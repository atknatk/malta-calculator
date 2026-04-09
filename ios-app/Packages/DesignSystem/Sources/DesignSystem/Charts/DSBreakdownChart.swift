//
//  DSBreakdownChart.swift
//  DesignSystem
//

import Charts
import SwiftUI

/// A donut chart segment.
public struct BreakdownSegment: Identifiable, Sendable {
    /// Unique identifier.
    public let id = UUID()
    /// Segment label.
    public let label: LocalizedStringResource
    /// Segment value (Decimal, not Double — per F-01).
    public let value: Decimal
    /// Segment fill color.
    public let color: Color

    /// Creates a breakdown segment.
    public init(label: LocalizedStringResource, value: Decimal, color: Color) {
        self.label = label
        self.value = value
        self.color = color
    }
}

/// A donut breakdown chart with a center value display.
///
/// Used in salary breakdowns, tax visualizations, and loan split views.
public struct DSBreakdownChart: View {
    let segments: [BreakdownSegment]
    let centerValue: Decimal
    let centerLabel: LocalizedStringResource

    /// Creates a breakdown chart.
    /// - Parameters:
    ///   - segments: The chart segments.
    ///   - centerValue: Value displayed in the center.
    ///   - centerLabel: Label above the center value.
    public init(
        segments: [BreakdownSegment],
        centerValue: Decimal,
        centerLabel: LocalizedStringResource
    ) {
        self.segments = segments
        self.centerValue = centerValue
        self.centerLabel = centerLabel
    }

    public var body: some View {
        Chart(segments) { segment in
            SectorMark(
                angle: .value("Amount", Double(truncating: segment.value as NSDecimalNumber)),
                innerRadius: .ratio(0.65),
                angularInset: 2
            )
            .cornerRadius(DSRadius.sm)
            .foregroundStyle(segment.color)
        }
        .chartBackground { _ in
            VStack(spacing: DSSpacing.xxs) {
                Text(centerLabel)
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)
                DSAnimatedNumber(centerValue, format: .currency, font: DSFont.display(28))
                    .foregroundStyle(DSGradient.primary)
            }
        }
        .frame(height: 240)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text(centerLabel))
        .accessibilityValue(accessibilityDescription)
        .accessibilityIgnoresInvertColors(true)
    }

    private var accessibilityDescription: String {
        segments.map { segment in
            let formatter = NumberFormatter()
            formatter.numberStyle = .currency
            formatter.currencyCode = "EUR"
            let valueStr = formatter.string(from: segment.value as NSDecimalNumber) ?? "\(segment.value)"
            return "\(String(localized: segment.label)): \(valueStr)"
        }.joined(separator: ", ")
    }
}
