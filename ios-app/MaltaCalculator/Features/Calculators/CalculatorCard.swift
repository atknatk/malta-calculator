//
//  CalculatorCard.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// A single calculator tile rendered inside the Hub grid.
struct CalculatorCard: View {
    let item: CalculatorCatalogItem
    let action: () -> Void

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                iconBadge
                Text(item.title)
                    .font(DSFont.body(15, weight: .semibold))
                    .foregroundStyle(item.available ? DSColor.textPrimary : DSColor.textTertiary)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                Text(item.subtitle)
                    .font(DSFont.body(12))
                    .foregroundStyle(DSColor.textSecondary)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                Spacer(minLength: 0)
                footer
            }
            .padding(DSSpacing.md)
            .frame(maxWidth: .infinity, minHeight: 160, alignment: .topLeading)
            .liquidGlass(shape: RoundedRectangle(cornerRadius: DSRadius.md))
            .opacity(item.available ? 1 : 0.7)
        }
        .buttonStyle(.plain)
        .sensoryFeedback(item.available ? .selection : .warning, trigger: tapCount)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text(item.title))
        .accessibilityValue(Text(item.subtitle))
        .accessibilityHint(
            Text(
                item.available
                    ? String(localized: "calculators.card.hint.open")
                    : String(localized: "calculators.card.hint.comingSoon")
            )
        )
        .accessibilityAddTraits(item.available ? .isButton : [])
    }

    @State private var tapCount: Int = 0

    private var iconBadge: some View {
        ZStack {
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .fill(DSGradient.category(item.category.gradientColors))
                .frame(width: 36, height: 36)
            Image(systemName: item.symbolName)
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(.white)
        }
    }

    @ViewBuilder
    private var footer: some View {
        HStack {
            Spacer()
            if item.available {
                Image(systemName: "arrow.right.circle.fill")
                    .foregroundStyle(DSColor.maltaGold)
                    .accessibilityHidden(true)
            } else {
                Text("calculators.badge.soon", bundle: .main)
                    .font(DSFont.caption)
                    .padding(.horizontal, DSSpacing.sm)
                    .padding(.vertical, DSSpacing.xxs)
                    .background(DSColor.warning.opacity(0.15), in: Capsule())
                    .foregroundStyle(DSColor.warning)
            }
        }
    }
}
