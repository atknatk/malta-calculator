//
//  SalaryBreakdownDonut.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import SwiftUI

/// Donut chart showing the annual Gross → Net breakdown.
///
/// Segments: Net (gold), Income Tax (blue), SSC (red).
/// Center label shows the animated annual net figure.
struct SalaryBreakdownDonut: View {
    /// Annual summary from ``SalaryCalculator``.
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
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(Text("salary.chart.donut.a11yLabel"))
        .accessibilityValue(donutAccessibilityValue)
        .accessibilityIgnoresInvertColors(true)
    }

    private var donutAccessibilityValue: Text {
        let net = summary.annualNet.eur
        let tax = summary.annualIncomeTax.eur
        let ssc = summary.annualSSC.eur
        return Text(
            "salary.chart.donut.a11yValue \(net) \(tax) \(ssc)"
        )
    }
}
