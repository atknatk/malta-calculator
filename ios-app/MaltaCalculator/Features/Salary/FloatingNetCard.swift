//
//  FloatingNetCard.swift
//  MaltaCalculator
//

import SwiftUI
import DesignSystem
import CalculationKit

/// Hero card displaying the calculated annual and monthly net pay.
///
/// Uses `DSAnimatedNumber` for smooth digit transitions and
/// `DSCard(.hero)` for the elevated glass treatment.
struct FloatingNetCard: View {
    /// Annual net pay amount.
    let annualNet: Decimal
    /// Average monthly net pay amount.
    let monthlyNet: Decimal
    /// Selected tax year.
    let year: Int

    var body: some View {
        DSCard(.hero, padding: DSSpacing.xl) {
            VStack(spacing: DSSpacing.xs) {
                Text("salary.netPay.label")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)
                    .textCase(.uppercase)
                    .tracking(DSFont.LetterSpacing.extraWide)

                DSAnimatedNumber(
                    annualNet,
                    format: .currency,
                    font: DSFont.display(44)
                )
                .foregroundStyle(DSGradient.primary)

                Text("salary.netPay.perYear")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)

                Divider()
                    .padding(.vertical, DSSpacing.xs)

                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("salary.netPay.monthly")
                            .font(DSFont.caption)
                            .foregroundStyle(DSColor.textSecondary)
                        DSAnimatedNumber(
                            monthlyNet,
                            format: .currency,
                            font: DSFont.heading(22)
                        )
                    }
                    Spacer()
                    Text("salary.netPay.yearBadge \(String(year))")
                        .font(DSFont.caption)
                        .padding(.horizontal, DSSpacing.sm)
                        .padding(.vertical, DSSpacing.xxs)
                        .background(DSColor.maltaGold.opacity(0.12), in: Capsule())
                        .foregroundStyle(DSColor.maltaGold)
                }
            }
            .frame(maxWidth: .infinity)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(String(localized: "salary.netPay.accessibilityLabel"))
        .accessibilityValue(String(localized: "salary.netPay.accessibilityValue \(annualNet.eur) \(monthlyNet.eur)"))
    }
}
