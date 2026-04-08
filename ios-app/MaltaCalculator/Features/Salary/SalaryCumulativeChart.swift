//
//  SalaryCumulativeChart.swift
//  MaltaCalculator
//

import SwiftUI
import DesignSystem
import CalculationKit

/// Line chart showing cumulative net pay over 12 months.
struct SalaryCumulativeChart: View {
    /// Monthly salary outputs to plot.
    let monthly: [SalaryOutput]

    var body: some View {
        DSLineChart(
            series: [
                LineChartSeries(
                    name: String(localized: "salary.chart.cumulativeNet"),
                    color: DSColor.maltaGold,
                    points: monthly.map { output in
                        LineChartDataPoint(
                            label: output.month.shortName,
                            x: Double(output.month.index),
                            y: cumulativeNet(through: output.month)
                        )
                    }
                )
            ],
            height: 200
        )
    }

    /// Computes the cumulative net pay through the given month.
    private func cumulativeNet(through month: Month) -> Decimal {
        monthly
            .filter { $0.month.index <= month.index }
            .map(\.net)
            .reduce(0, +)
    }
}
