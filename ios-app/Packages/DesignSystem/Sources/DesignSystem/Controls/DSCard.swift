//
//  DSCard.swift
//  DesignSystem
//

import SwiftUI

/// Visual variant for `DSCard`.
public enum DSCardVariant: Sendable {
    /// Standard glass background card.
    case `default`
    /// Gold border + subtle glow highlight.
    case highlighted
    /// Gradient border + elevated shadow (hero sections).
    case hero
    /// Red-tinted destructive/warning card.
    case destructive
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
    ///   - padding: Inner padding. Defaults to `DSSpacing.lg`.
    ///   - content: Card content.
    public init(
        _ variant: DSCardVariant = .default,
        padding: CGFloat = DSSpacing.lg,
        @ViewBuilder content: () -> Content
    ) {
        self.variant = variant
        self.padding = padding
        self.content = content()
    }

    public var body: some View {
        content
            .padding(padding)
            .liquidGlass(
                shape: RoundedRectangle(cornerRadius: DSRadius.xl),
                tint: tint
            )
            .overlay {
                if variant == .hero {
                    RoundedRectangle(cornerRadius: DSRadius.xl)
                        .strokeBorder(DSGradient.primary, lineWidth: 2)
                } else if variant == .highlighted {
                    RoundedRectangle(cornerRadius: DSRadius.xl)
                        .strokeBorder(DSColor.maltaGold.opacity(0.5), lineWidth: 1.5)
                }
            }
            .dsShadow(variant == .hero ? DSShadow.elevated : DSShadow.card)
    }

    private var tint: Color? {
        switch variant {
        case .default, .hero: return nil
        case .highlighted: return DSColor.maltaGold.opacity(0.05)
        case .destructive: return DSColor.maltaRed.opacity(0.05)
        }
    }
}
