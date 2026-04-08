//
//  SalaryBreakdownDonut.swift
//  MaltaCalculator
//

import SwiftUI
import DesignSystem
import CalculationKit

/// Donut chart showing the annual salary breakdown: Net, Income Tax, SSC.
struct SalaryBreakdownDonut: View {
    /// The annual salary summary to visualize.
    let summary: SalarySummary

    var body: some View {
        DSBreakdownChart(
            segments: [
                BreakdownSegment(
                    label: "salary.chart.net",
                    value: summary.annualNet,
                    color: DSColor.maltaGold
                ),
                BreakdownSegment(
                    label: "salary.chart.incomeTax",
                    value: summary.annualIncomeTax,
                    color: DSColor.mediterraneanBlue
                ),
                BreakdownSegment(
                    label: "salary.chart.ssc",
                    value: summary.annualSSC,
                    color: DSColor.maltaRed
                )
            ],
            centerValue: summary.annualNet,
            centerLabel: "salary.chart.annualNet"
        )
    }
}
