//
//  DSAmortizationChart.swift
//  DesignSystem
//

import Charts
import SwiftUI

/// A data point for amortization schedule charts.
public struct AmortizationDataPoint: Identifiable, Sendable {
    /// Unique identifier.
    public let id = UUID()
    /// Period label (e.g. "Year 1").
    public let label: String
    /// Period index.
    public let period: Int
    /// Principal portion.
    public let principal: Decimal
    /// Interest portion.
    public let interest: Decimal
    /// Remaining balance.
    public let balance: Decimal

    /// Creates an amortization data point.
    public init(label: String, period: Int, principal: Decimal, interest: Decimal, balance: Decimal) {
        self.label = label
        self.period = period
        self.principal = principal
        self.interest = interest
        self.balance = balance
    }
}

/// A line/area chart showing principal vs interest over time.
///
/// Supports drag gesture for a cursor that reveals details at each period.
public struct DSAmortizationChart: View {
    let data: [AmortizationDataPoint]
    @State private var selectedIndex: Int?

    /// Creates an amortization chart.
    /// - Parameter data: Array of period data points.
    public init(data: [AmortizationDataPoint]) {
        self.data = data
    }

    public var body: some View {
        Chart(data) { point in
            AreaMark(
                x: .value("Period", point.period),
                y: .value("Principal", Double(truncating: point.principal as NSDecimalNumber))
            )
            .foregroundStyle(DSColor.maltaGold.opacity(0.3))

            LineMark(
                x: .value("Period", point.period),
                y: .value("Principal", Double(truncating: point.principal as NSDecimalNumber))
            )
            .foregroundStyle(DSColor.maltaGold)
            .lineStyle(StrokeStyle(lineWidth: 2))

            AreaMark(
                x: .value("Period", point.period),
                y: .value("Interest", Double(truncating: point.interest as NSDecimalNumber))
            )
            .foregroundStyle(DSColor.mediterraneanBlue.opacity(0.3))

            LineMark(
                x: .value("Period", point.period),
                y: .value("Interest", Double(truncating: point.interest as NSDecimalNumber))
            )
            .foregroundStyle(DSColor.mediterraneanBlue)
            .lineStyle(StrokeStyle(lineWidth: 2))
        }
        .frame(height: 200)
        .chartXAxis {
            AxisMarks(values: .automatic(desiredCount: 5))
        }
        .chartYAxis {
            AxisMarks(format: .currency(code: "EUR"))
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(String(localized: "chart.amortization"))
        .accessibilityValue(amortizationSummary)
        .accessibilityIgnoresInvertColors(true)
    }

    private var amortizationSummary: String {
        guard let first = data.first, let last = data.last else { return "" }
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        formatter.maximumFractionDigits = 0
        let startBalance = formatter.string(from: first.balance as NSDecimalNumber) ?? "\(first.balance)"
        let endBalance = formatter.string(from: last.balance as NSDecimalNumber) ?? "\(last.balance)"
        return String(
            localized: "chart.amortization.summary \(data.count) \(startBalance) \(endBalance)"
        )
    }
}
