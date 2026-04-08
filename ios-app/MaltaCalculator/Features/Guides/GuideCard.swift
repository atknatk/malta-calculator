//
//  GuideCard.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// A single guide row used in lists and bookmark sections.
struct GuideCard: View {
    let guide: Guide
    let isBookmarked: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(alignment: .top, spacing: DSSpacing.md) {
                iconBadge
                VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                    Text(guide.title)
                        .font(DSFont.headingS)
                        .foregroundStyle(DSColor.textPrimary)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                    Text(guide.description)
                        .font(DSFont.bodyS)
                        .foregroundStyle(DSColor.textSecondary)
                        .lineLimit(3)
                        .multilineTextAlignment(.leading)
                    metaRow
                }
                Spacer(minLength: 0)
                if isBookmarked {
                    Image(systemName: "bookmark.fill")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(DSColor.maltaGold)
                        .padding(.top, DSSpacing.xxs)
                        .accessibilityHidden(true)
                }
            }
            .padding(DSSpacing.md)
            .frame(maxWidth: .infinity, alignment: .leading)
            .liquidGlass()
        }
        .buttonStyle(.plain)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text(guide.title))
        .accessibilityValue(
            Text(
                isBookmarked
                    ? String(localized: "guides.card.bookmarked")
                    : String(localized: "guides.card.not-bookmarked")
            )
        )
        .accessibilityHint(Text("guides.card.hint"))
    }

    private var iconBadge: some View {
        ZStack {
            RoundedRectangle(cornerRadius: DSRadius.md)
                .fill(DSGradient.primary)
                .frame(width: 52, height: 52)
            Image(systemName: guide.symbolName)
                .font(.title2.weight(.semibold))
                .foregroundStyle(.white)
        }
        .accessibilityHidden(true)
    }

    private var metaRow: some View {
        HStack(spacing: DSSpacing.xs) {
            Label {
                Text("\(guide.readingMinutes) min")
            } icon: {
                Image(systemName: "clock")
            }
            .labelStyle(.titleAndIcon)
            .font(DSFont.caption)
            .foregroundStyle(DSColor.textTertiary)

            Text(guide.category.title)
                .font(DSFont.caption)
                .padding(.horizontal, DSSpacing.xs)
                .padding(.vertical, 2)
                .background(DSColor.maltaGold.opacity(0.12), in: Capsule())
                .foregroundStyle(DSColor.maltaGold)
        }
        .padding(.top, DSSpacing.xxs)
    }
}
