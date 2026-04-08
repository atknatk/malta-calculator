//
//  MonthlyRowCard.swift
//  MaltaCalculator
//

import SwiftUI
import DesignSystem
import CalculationKit

/// An expandable row showing a single month's salary breakdown.
///
/// Collapsed state shows month name and net. Expanded state adds
/// detailed SSC, tax, and cumulative fields.
struct MonthlyRowCard: View {
    /// The salary output for this month.
    let output: SalaryOutput
    /// Whether this row is currently expanded.
    let isExpanded: Bool
    /// Callback when the row is tapped to toggle expansion.
    let onToggle: () -> Void

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        VStack(spacing: 0) {
            Button(action: onToggle) {
                HStack {
                    Text(output.month.rawValue.capitalized)
                        .font(DSFont.headingS)
                        .foregroundStyle(DSColor.textPrimary)
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(output.net.eur)
                            .font(DSFont.body(17, weight: .semibold))
                            .foregroundStyle(DSColor.maltaGold)
                        Text("salary.monthly.net")
                            .font(DSFont.caption)
                            .foregroundStyle(DSColor.textSecondary)
                    }
                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .font(.caption)
                        .foregroundStyle(DSColor.textTertiary)
                        .padding(.leading, DSSpacing.xs)
                }
                .padding(DSSpacing.md)
            }
            .buttonStyle(.plain)
            #if os(iOS)
            .sensoryFeedback(.selection, trigger: isExpanded)
            #endif
            .accessibilityLabel(String(
                localized: "salary.monthly.row.accessibilityLabel \(output.month.rawValue.capitalized)"
            ))
            .accessibilityValue(String(localized: "salary.monthly.row.accessibilityValue \(output.net.eur)"))
            .accessibilityHint(String(localized: isExpanded
                ? "salary.monthly.row.collapseHint"
                : "salary.monthly.row.expandHint"))

            if isExpanded {
                VStack(spacing: DSSpacing.xs) {
                    Divider()
                    detailRow("salary.monthly.grossWage", output.grossWage.eur)
                    detailRow("salary.monthly.grossTotal", output.grossTotal.eur)
                    detailRow("salary.monthly.sscBase", output.sscBase.eur)
                    detailRow("salary.monthly.sscTax", "−\(output.sscTax.eur)", isNegative: true)
                    detailRow("salary.monthly.incomeBase", output.incomeBase.eur)
                    detailRow("salary.monthly.incomeTax", "−\(output.incomeTax.eur)", isNegative: true)
                    detailRow("salary.monthly.cumulativeTax", output.cumulativeTax.eur)
                    Divider()
                    detailRow("salary.monthly.netResult", output.net.eur, isHighlighted: true)
                }
                .padding(DSSpacing.md)
                .transition(.asymmetric(
                    insertion: .opacity.combined(with: .move(edge: .top)),
                    removal: .opacity
                ))
            }
        }
        .liquidGlass()
        .animation(reduceMotion ? DSMotion.instant : DSMotion.standard, value: isExpanded)
    }

    private func detailRow(
        _ labelKey: LocalizedStringKey,
        _ value: String,
        isNegative: Bool = false,
        isHighlighted: Bool = false
    ) -> some View {
        HStack {
            Text(labelKey)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
            Spacer()
            Text(value)
                .font(isHighlighted ? DSFont.body(15, weight: .bold) : DSFont.mono(13))
                .foregroundStyle(
                    isNegative ? DSColor.danger
                    : isHighlighted ? DSColor.maltaGold
                    : DSColor.textPrimary
                )
        }
    }
}
