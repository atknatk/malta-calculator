//
//  DSBadge.swift
//  DesignSystem
//

import SwiftUI

/// Badge variant for status indicators.
public enum DSBadgeVariant: Sendable {
    /// "Soon" — upcoming feature.
    case soon
    /// "New" — recently added.
    case new
    /// "Beta" — beta feature.
    case beta
    /// Custom text with a given color.
    case custom(Color)
}

/// A small status badge (e.g., "Soon", "New", "Beta").
public struct DSBadge: View {
    let text: LocalizedStringResource
    let variant: DSBadgeVariant

    /// Creates a badge.
    /// - Parameters:
    ///   - text: Badge text.
    ///   - variant: Visual style.
    public init(_ text: LocalizedStringResource, variant: DSBadgeVariant) {
        self.text = text
        self.variant = variant
    }

    public var body: some View {
        Text(text)
            .font(DSFont.body(10, weight: .bold))
            .textCase(.uppercase)
            .tracking(0.5)
            .foregroundStyle(.white)
            .padding(.horizontal, DSSpacing.xs)
            .padding(.vertical, DSSpacing.xxs)
            .background(badgeColor, in: Capsule())
    }

    private var badgeColor: Color {
        switch variant {
        case .soon: return DSColor.textTertiary
        case .new: return DSColor.maltaGold
        case .beta: return DSColor.mediterraneanBlue
        case .custom(let color): return color
        }
    }
}
