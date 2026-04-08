//
//  DSAnimatedNumber.swift
//  DesignSystem
//

import SwiftUI

/// Displays a `Decimal` value with smooth numeric content transitions.
///
/// Uses `contentTransition(.numericText())` for animated digit changes.
/// Supports currency, percent, and decimal formats.
/// Respects `accessibilityReduceMotion`.
public struct DSAnimatedNumber: View {
    /// The decimal value being displayed.
    public let value: Decimal
    /// The number formatting style.
    public let format: NumberFormat
    /// The display font.
    public let font: Font

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    /// Number formatting options.
    public enum NumberFormat: Sendable, Equatable, Hashable, CaseIterable {
        /// Euro currency with zero decimal places.
        case currency
        /// Percentage with up to 2 decimal places.
        case percent
        /// Plain decimal with 2 fraction digits.
        case decimal(fractionDigits: Int = 2)

        /// All standard format cases (decimal uses default 2 fraction digits).
        public static var allCases: [NumberFormat] {
            [.currency, .percent, .decimal(fractionDigits: 2)]
        }
    }

    /// Creates an animated number display.
    /// - Parameters:
    ///   - value: The `Decimal` value to display.
    ///   - format: Formatting style. Defaults to `.currency`.
    ///   - font: Display font. Defaults to `DSFont.display(40)`.
    public init(
        _ value: Decimal,
        format: NumberFormat = .currency,
        font: Font = DSFont.display(40)
    ) {
        self.value = value
        self.format = format
        self.font = font
    }

    public var body: some View {
        Text(formatted)
            .font(font)
            .contentTransition(reduceMotion ? .identity : .numericText(value: doubleValue))
            .monospacedDigit()
            .animation(reduceMotion ? DSMotion.instant : DSMotion.standard, value: value)
            .accessibilityValue(accessibilityText)
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(accessibilityText)
    }

    /// Double representation for animation interpolation.
    var doubleValue: Double {
        Double(truncating: value as NSDecimalNumber)
    }

    /// The formatted display string.
    public var formatted: String {
        let formatter = NumberFormatter()
        formatter.locale = .current
        switch format {
        case .currency:
            formatter.numberStyle = .currency
            formatter.currencyCode = "EUR"
            formatter.maximumFractionDigits = 0
        case .percent:
            formatter.numberStyle = .percent
            formatter.minimumFractionDigits = 0
            formatter.maximumFractionDigits = 2
        case .decimal(let digits):
            formatter.numberStyle = .decimal
            formatter.minimumFractionDigits = 0
            formatter.maximumFractionDigits = digits
        }
        return formatter.string(from: value as NSDecimalNumber) ?? "\u{2014}"
    }

    /// Accessibility-friendly description of the value.
    public var accessibilityText: String {
        let formatter = NumberFormatter()
        formatter.locale = .current
        switch format {
        case .currency:
            formatter.numberStyle = .currency
            formatter.currencyCode = "EUR"
            formatter.maximumFractionDigits = 2
        case .percent:
            formatter.numberStyle = .percent
            formatter.maximumFractionDigits = 2
        case .decimal(let digits):
            formatter.numberStyle = .decimal
            formatter.maximumFractionDigits = digits
        }
        return formatter.string(from: value as NSDecimalNumber) ?? "\(value)"
    }
}
