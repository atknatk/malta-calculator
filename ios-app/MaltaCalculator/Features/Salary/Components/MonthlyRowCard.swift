//
//  MonthlyRowCard.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import Foundation
import SwiftUI

/// Single month row in the Salary monthly breakdown list.
///
/// Tapping the row expands/collapses the detailed breakdown with a
/// reduced-motion-aware animation.
struct MonthlyRowCard: View {
    /// Monthly calculation output.
    let output: SalaryOutput
    /// Whether the row is currently expanded.
    let isExpanded: Bool
    /// Closure invoked when the header is tapped.
    let onToggle: () -> Void

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        VStack(spacing: 0) {
            Button(action: onToggle, label: headerLabel)
                .buttonStyle(.plain)
                .frame(minHeight: 44)
                #if os(iOS)
                .sensoryFeedback(.selection, trigger: isExpanded)
                #endif
                .accessibilityLabel(headerAccessibilityLabel)
                .accessibilityValue(headerAccessibilityValue)
                .accessibilityHint(Text("salary.monthly.hint"))
                .accessibilityAddTraits(.isButton)

            if isExpanded {
                detailGrid
                    .transition(.opacity.combined(with: .move(edge: .top)))
            }
        }
        .liquidGlass(
            shape: RoundedRectangle(cornerRadius: DSRadius.lg),
            tint: nil
        )
        .animation(
            reduceMotion ? DSMotion.instant : DSMotion.standard,
            value: isExpanded
        )
    }

    // MARK: - Header

    private func headerLabel() -> some View {
        HStack(alignment: .firstTextBaseline) {
            Text(monthName)
                .font(DSFont.headingS)
                .foregroundStyle(DSColor.textPrimary)
            Spacer()
            VStack(alignment: .trailing, spacing: DSSpacing.xxs) {
                Text(output.net.eur)
                    .font(DSFont.body(17, weight: .semibold))
                    .foregroundStyle(DSColor.maltaGold)
                    .monospacedDigit()
                Text("salary.monthly.net")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)
            }
            Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textTertiary)
                .padding(.leading, DSSpacing.xs)
                .accessibilityHidden(true)
        }
        .padding(DSSpacing.md)
        .contentShape(Rectangle())
    }

    // MARK: - Detail

    private var detailGrid: some View {
        VStack(spacing: DSSpacing.xs) {
            Divider()
            detailRow("salary.monthly.grossWage", output.grossWage.eur)
            detailRow("salary.monthly.grossTotal", output.grossTotal.eur)
            detailRow("salary.monthly.sscBase", output.sscBase.eur)
            detailRow(
                "salary.monthly.sscTax",
                "\u{2212}" + output.sscTax.eur,
                role: .negative
            )
            detailRow("salary.monthly.incomeBase", output.incomeBase.eur)
            detailRow(
                "salary.monthly.incomeTax",
                "\u{2212}" + output.incomeTax.eur,
                role: .negative
            )
            detailRow("salary.monthly.cumulativeTax", output.cumulativeTax.eur)
            Divider()
            detailRow(
                "salary.monthly.netHighlight",
                output.net.eur,
                role: .highlighted
            )
        }
        .padding(DSSpacing.md)
    }

    private enum DetailRole {
        case normal, negative, highlighted
    }

    @ViewBuilder
    private func detailRow(
        _ labelKey: LocalizedStringResource,
        _ value: String,
        role: DetailRole = .normal
    ) -> some View {
        HStack {
            Text(labelKey)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
            Spacer()
            Text(value)
                .font(role == .highlighted ? DSFont.body(15, weight: .bold) : DSFont.mono(13))
                .foregroundStyle(valueColor(for: role))
                .monospacedDigit()
        }
    }

    private func valueColor(for role: DetailRole) -> Color {
        switch role {
        case .normal: DSColor.textPrimary
        case .negative: DSColor.danger
        case .highlighted: DSColor.maltaGold
        }
    }

    // MARK: - Strings

    private var monthName: String {
        let formatter = DateFormatter()
        formatter.locale = .current
        formatter.setLocalizedDateFormatFromTemplate("MMMM")
        let comps = DateComponents(
            calendar: Calendar(identifier: .gregorian),
            month: output.month.index + 1,
            day: 1
        )
        guard let date = comps.date else { return output.month.shortName }
        return formatter.string(from: date)
    }

    private var headerAccessibilityLabel: Text {
        Text("salary.monthly.a11yLabel \(monthName)")
    }

    private var headerAccessibilityValue: Text {
        Text(
            "salary.monthly.a11yValue \(output.net.eur) \(output.incomeTax.eur) \(output.sscTax.eur)"
        )
    }
}

// Preview omitted — SalaryOutput init is internal to CalculationKit.
