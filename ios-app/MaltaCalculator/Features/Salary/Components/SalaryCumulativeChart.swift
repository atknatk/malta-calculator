//
//  SalaryCumulativeChart.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import SwiftUI

/// Line chart plotting cumulative net pay across the 12 months.
struct SalaryCumulativeChart: View {
    /// Monthly outputs to chart — must be ordered Jan → Dec.
    let monthly: [SalaryOutput]

    var body: some View {
        DSLineChart(
            series: [
                LineChartSeries(
                    name: String(localized: "salary.chart.cumulativeNet"),
                    color: DSColor.maltaGold,
                    points: monthly.enumerated().map { index, output in
                        LineChartDataPoint(
                            label: output.month.shortName,
                            x: Double(index),
                            y: cumulativeNet(through: index)
                        )
                    }
                )
            ],
            height: 180
        )
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text("salary.chart.cumulativeNet"))
        .accessibilityValue(Text(
            "salary.chart.cumulative.a11yValue \(totalNet.eur)"
        ))
    }

    private var totalNet: Decimal {
        monthly.map(\.net).reduce(0, +)
    }

    private func cumulativeNet(through index: Int) -> Decimal {
        monthly.prefix(index + 1).map(\.net).reduce(0, +)
    }
}
