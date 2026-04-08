//
//  SalaryKeyFigures.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import Foundation
import SwiftUI

/// 2×2 grid showing key annual figures under the donut chart.
struct SalaryKeyFigures: View {
    /// Annual summary from ``SalaryCalculator``.
    let summary: SalarySummary

    var body: some View {
        Grid(alignment: .leading, horizontalSpacing: DSSpacing.md, verticalSpacing: DSSpacing.md) {
            GridRow {
                figure(
                    label: "salary.keyFigure.annualGross",
                    value: summary.annualGross.eur,
                    color: DSColor.textPrimary
                )
                figure(
                    label: "salary.keyFigure.annualSSC",
                    value: summary.annualSSC.eur,
                    color: DSColor.maltaRed
                )
            }
            GridRow {
                figure(
                    label: "salary.keyFigure.annualTax",
                    value: summary.annualIncomeTax.eur,
                    color: DSColor.mediterraneanBlue
                )
                figure(
                    label: "salary.keyFigure.effectiveRate",
                    value: effectiveRateText,
                    color: DSColor.textPrimary
                )
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(Text("salary.keyFigure.a11yLabel"))
    }

    private func figure(label: LocalizedStringResource, value: String, color: Color) -> some View {
        VStack(alignment: .leading, spacing: DSSpacing.xxs) {
            Text(label)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
            Text(value)
                .font(DSFont.heading(16))
                .foregroundStyle(color)
                .monospacedDigit()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .accessibilityElement(children: .combine)
    }

    private var effectiveRateText: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .percent
        formatter.minimumFractionDigits = 0
        formatter.maximumFractionDigits = 1
        return formatter.string(from: summary.effectiveTaxRate as NSDecimalNumber) ?? "—"
    }
}
