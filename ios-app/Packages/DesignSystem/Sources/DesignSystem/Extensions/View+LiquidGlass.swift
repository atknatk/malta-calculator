//
//  View+LiquidGlass.swift
//  DesignSystem
//

import SwiftUI

/// Strength levels for the Liquid Glass effect.
///
/// Maps to native `GlassEffect` on iOS 26 and `Material` on iOS 18.
public enum LiquidGlassStrength: Sendable, Equatable, Hashable, CaseIterable {
    /// Thin/subtle glass effect.
    case thin
    /// Standard glass effect.
    case regular
    /// Thick/prominent glass effect.
    case thick

    #if os(iOS)
    /// The native `Glass` effect for iOS 26+.
    @available(iOS 26.0, *)
    var glass: Glass {
        switch self {
        case .thin: return .regular.interactive()
        case .regular: return .regular
        case .thick: return .regular
        }
    }
    #endif

    /// The `Material` equivalent for the iOS 18 fallback path.
    var material: Material {
        switch self {
        case .thin: return .thinMaterial
        case .regular: return .regularMaterial
        case .thick: return .thickMaterial
        }
    }
}

public extension View {
    /// Applies a Liquid Glass surface on iOS 26+ with a Material fallback on iOS 18.
    ///
    /// This is the **only** allowed path for glass effects in the app.
    /// Direct calls to `.glassEffect()` are forbidden — see failure pattern S-03.
    ///
    /// When `accessibilityReduceTransparency` is enabled, collapses to an
    /// opaque `DSColor.surface` background.
    ///
    /// - Parameters:
    ///   - shape: The clipping shape. Defaults to a rounded rectangle with `DSRadius.xl`.
    ///   - tint: Optional tint color applied to the glass.
    ///   - strength: Glass thickness level. Defaults to `.regular`.
    /// - Returns: A view with the glass surface applied.
    @ViewBuilder
    func liquidGlass(
        shape: some InsettableShape = RoundedRectangle(cornerRadius: DSRadius.xl),
        tint: Color? = nil,
        strength: LiquidGlassStrength = .regular
    ) -> some View {
        self.modifier(
            LiquidGlassViewModifier(shape: shape, tint: tint, strength: strength)
        )
    }
}

/// Internal modifier that implements the Liquid Glass surface treatment.
struct LiquidGlassViewModifier<S: InsettableShape>: ViewModifier {
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    let shape: S
    let tint: Color?
    let strength: LiquidGlassStrength

    func body(content: Content) -> some View {
        if reduceTransparency {
            content
                .background(shape.fill(DSColor.surface))
                .overlay(shape.strokeBorder(DSColor.textSecondary.opacity(0.15), lineWidth: 1))
        } else {
            glassContent(content)
        }
    }

    @ViewBuilder
    private func glassContent(_ content: Content) -> some View {
        #if os(iOS)
        if #available(iOS 26.0, *) {
            content.glassEffect(strength.glass.tint(tint ?? .clear), in: shape)
        } else {
            materialFallback(content)
        }
        #else
        materialFallback(content)
        #endif
    }

    @ViewBuilder
    private func materialFallback(_ content: Content) -> some View {
        content
            .background(strength.material, in: shape)
            .overlay(
                shape.strokeBorder(
                    LinearGradient(
                        colors: [
                            .white.opacity(0.35),
                            .white.opacity(0.08),
                        ],
                        startPoint: .top, endPoint: .bottom
                    ),
                    lineWidth: 1
                )
            )
            .dsShadow(DSShadow.card)
    }
}
