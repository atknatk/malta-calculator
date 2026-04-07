//
//  DSAnimatedNumber.swift
//  DesignSystem
//

import SwiftUI

/// Displays a `Decimal` value with smooth numeric content transitions.
///
/// Uses `contentTransition(.numericText())` for animated digit changes.
/// Supports currency, percent, and decimal formats.
public struct DSAnimatedNumber: View {
    let value: Decimal
    let format: NumberFormat
    let font: Font

    /// Number formatting options.
    public enum NumberFormat: Sendable {
        /// Euro currency with zero decimal places.
        case currency
        /// Percentage with up to 2 decimal places.
        case percent
        /// Plain decimal with configurable fraction digits.
        case decimal(fractionDigits: Int)
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
            .contentTransition(.numericText(value: Double(truncating: value as NSDecimalNumber)))
            .monospacedDigit()
            .accessibilityValue(accessibilityText)
    }

    /// The formatted display string.
    var formatted: String {
        let formatter = NumberFormatter()
        switch format {
        case .currency:
            formatter.numberStyle = .currency
            formatter.currencyCode = "EUR"
            formatter.maximumFractionDigits = 0
        case .percent:
            formatter.numberStyle = .percent
            formatter.maximumFractionDigits = 2
        case .decimal(let digits):
            formatter.numberStyle = .decimal
            formatter.maximumFractionDigits = digits
        }
        return formatter.string(from: value as NSDecimalNumber) ?? "\u{2014}"
    }

    private var accessibilityText: String {
        let formatter = NumberFormatter()
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
