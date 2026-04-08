//
//  FloatingNetCard.swift
//  MaltaCalculator
//

import DesignSystem
import Foundation
import SwiftUI

/// Hero card shown at the top of the Salary screen — displays the
/// animated annual net pay + the monthly equivalent and selected year.
///
/// VoiceOver reads the card as a single combined element so it speaks
/// "Net pay: fourteen thousand nine hundred seventy-six euros per year,
/// one thousand two hundred forty-eight euros per month."
struct FloatingNetCard: View {
    /// Annual net pay.
    let annualNet: Decimal
    /// Average monthly net pay.
    let monthlyNet: Decimal
    /// Calculation year badge label.
    let year: Int

    var body: some View {
        DSCard(.hero) {
            VStack(spacing: DSSpacing.xs) {
                Text("salary.net.title")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)
                    .textCase(.uppercase)
                    .tracking(1.5)

                DSAnimatedNumber(
                    annualNet,
                    format: .currency,
                    font: DSFont.display(44)
                )
                .foregroundStyle(DSGradient.primary)

                Text("salary.net.perYear")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)

                Divider().padding(.vertical, DSSpacing.xs)

                HStack(alignment: .firstTextBaseline) {
                    VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                        Text("salary.net.monthly")
                            .font(DSFont.caption)
                            .foregroundStyle(DSColor.textSecondary)
                        DSAnimatedNumber(
                            monthlyNet,
                            format: .currency,
                            font: DSFont.heading(22)
                        )
                    }
                    Spacer(minLength: DSSpacing.md)
                    yearBadge
                }
            }
            .frame(maxWidth: .infinity)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text("salary.net.title"))
        .accessibilityValue(Text("salary.net.a11yValue \(annualNet.eur) \(monthlyNet.eur)"))
    }

    private var yearBadge: some View {
        Text(verbatim: String(year))
            .font(DSFont.body(12, weight: .semibold))
            .padding(.horizontal, DSSpacing.sm)
            .padding(.vertical, DSSpacing.xxs)
            .background(DSColor.maltaGold.opacity(0.12), in: Capsule())
            .foregroundStyle(DSColor.maltaGold)
            .accessibilityLabel(Text("salary.net.yearBadge \(String(year))"))
    }

}

#Preview {
    FloatingNetCard(annualNet: 14_976, monthlyNet: 1_248, year: 2026)
        .padding()
        .background(DSColor.background)
}
