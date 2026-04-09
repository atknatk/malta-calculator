//
//  DSLineChart.swift
//  DesignSystem
//

import Charts
import SwiftUI

/// A simple data point for line charts.
public struct LineChartDataPoint: Identifiable, Sendable {
    /// Unique identifier.
    public let id = UUID()
    /// X-axis label.
    public let label: String
    /// X-axis index.
    public let x: Double
    /// Y-axis value.
    public let y: Decimal

    /// Creates a line chart data point.
    public init(label: String, x: Double, y: Decimal) {
        self.label = label
        self.x = x
        self.y = y
    }
}

/// A data series for `DSLineChart`.
public struct LineChartSeries: Identifiable, Sendable {
    /// Unique identifier.
    public let id = UUID()
    /// Series name.
    public let name: String
    /// Series color.
    public let color: Color
    /// Data points.
    public let points: [LineChartDataPoint]

    /// Creates a line chart series.
    public init(name: String, color: Color, points: [LineChartDataPoint]) {
        self.name = name
        self.color = color
        self.points = points
    }
}

/// A multi-series line chart.
public struct DSLineChart: View {
    let series: [LineChartSeries]
    let height: CGFloat

    /// Creates a line chart.
    /// - Parameters:
    ///   - series: Array of data series.
    ///   - height: Chart height. Defaults to `200`.
    public init(series: [LineChartSeries], height: CGFloat = 200) {
        self.series = series
        self.height = height
    }

    public var body: some View {
        Chart {
            ForEach(series) { s in
                ForEach(s.points) { point in
                    LineMark(
                        x: .value("X", point.x),
                        y: .value("Y", Double(truncating: point.y as NSDecimalNumber))
                    )
                    .foregroundStyle(s.color)
                    .lineStyle(StrokeStyle(lineWidth: 2))
                }
            }
        }
        .frame(height: height)
        .chartXAxis {
            AxisMarks(values: .automatic(desiredCount: 5))
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(String(localized: "chart.line"))
        .accessibilityValue(lineChartSummary)
        .accessibilityIgnoresInvertColors(true)
    }

    private var lineChartSummary: String {
        series.map { s in
            guard let first = s.points.first, let last = s.points.last else { return s.name }
            let formatter = NumberFormatter()
            formatter.numberStyle = .currency
            formatter.currencyCode = "EUR"
            formatter.maximumFractionDigits = 0
            let firstStr = formatter.string(from: first.y as NSDecimalNumber) ?? "\(first.y)"
            let lastStr = formatter.string(from: last.y as NSDecimalNumber) ?? "\(last.y)"
            return "\(s.name): \(firstStr) to \(lastStr)"
        }.joined(separator: ". ")
    }
}
