//
//  DSCard.swift
//  DesignSystem
//

import SwiftUI

/// Visual variant for `DSCard`.
public enum DSCardVariant: Sendable, Equatable, Hashable, CaseIterable {
    /// Standard glass background card.
    case `default`
    /// Compact card with tighter padding (12pt).
    case compact
    /// Gold border + subtle glow highlight.
    case highlighted
    /// Gradient border + elevated shadow (hero sections).
    case hero
    /// Red-tinted destructive/warning card with red border.
    case destructive

    /// The corner radius used for this variant.
    public var cornerRadius: CGFloat {
        self == .compact ? DSRadius.lg : DSRadius.xl
    }

    /// The elevation level for this variant.
    public var elevation: DSElevation {
        switch self {
        case .hero: return .floating
        case .default, .highlighted, .destructive, .compact: return .raised
        }
    }

    /// The default inner padding for this variant.
    public var defaultPadding: CGFloat {
        self == .compact ? DSSpacing.sm : DSSpacing.lg
    }
}

/// A glass-backed card container following the Malta Calculator design system.
///
/// All calculator result sections, input groups, and content blocks should
/// use this instead of raw `.background(.material)`.
public struct DSCard<Content: View>: View {
    let variant: DSCardVariant
    let padding: CGFloat
    @ViewBuilder let content: Content

    /// Creates a design-system card.
    /// - Parameters:
    ///   - variant: Visual style. Defaults to `.default`.
    ///   - padding: Inner padding. Defaults to `DSSpacing.lg`. Ignored for `.compact` (uses `DSSpacing.sm`).
    ///   - content: Card content.
    public init(
        _ variant: DSCardVariant = .default,
        padding: CGFloat = DSSpacing.lg,
        @ViewBuilder content: () -> Content
    ) {
        self.variant = variant
        self.padding = variant == .compact ? DSSpacing.sm : padding
        self.content = content()
    }

    public var body: some View {
        content
            .padding(padding)
            .liquidGlass(
                shape: RoundedRectangle(cornerRadius: variant.cornerRadius),
                tint: tint
            )
            .overlay { borderOverlay }
            .dsElevation(variant.elevation)
            .accessibilityElement(children: .contain)
    }

    @ViewBuilder
    private var borderOverlay: some View {
        switch variant {
        case .hero:
            RoundedRectangle(cornerRadius: variant.cornerRadius)
                .strokeBorder(DSGradient.primary, lineWidth: 2)
        case .highlighted:
            RoundedRectangle(cornerRadius: variant.cornerRadius)
                .strokeBorder(DSColor.maltaGold.opacity(0.5), lineWidth: 1.5)
        case .destructive:
            RoundedRectangle(cornerRadius: variant.cornerRadius)
                .strokeBorder(DSColor.danger.opacity(0.4), lineWidth: 1.5)
        case .default, .compact:
            EmptyView()
        }
    }

    private var tint: Color? {
        switch variant {
        case .default, .hero, .compact: return nil
        case .highlighted: return DSColor.maltaGold.opacity(0.05)
        case .destructive: return DSColor.maltaRed.opacity(0.05)
        }
    }
}
