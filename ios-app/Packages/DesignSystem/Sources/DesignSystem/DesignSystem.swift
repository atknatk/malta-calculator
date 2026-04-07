//
//  DesignSystem.swift
//  MaltaCalculator
//

import SwiftUI
#if canImport(UIKit)
import UIKit
#endif
#if canImport(AppKit)
import AppKit
#endif

/// Top-level namespace for the Malta Calculator design system.
///
/// Task 02 (`tasks/02-design-system.md`) fills this in with the full token
/// catalog (colors, spacing, radii, motion, typography) and the Liquid Glass
/// component library. Task 01 ships only the seed `liquidGlass()` modifier
/// because `RootView` calls it from day one.
public enum DesignSystem {
    /// Semantic version of the design system bundle, surfaced for diagnostics.
    public static let version: String = "0.1.0"
}

// MARK: - Liquid Glass Modifier

/// A `ViewModifier` that paints a Liquid Glass surface on iOS 26+ and falls
/// back to `Material.regularMaterial` on iOS 18 with an opaque collapse path
/// when the user has Reduce Transparency enabled.
///
/// The seed implementation lives here so `RootView` can use it before Task 02
/// expands the token system. See failure pattern S-03 — calling
/// `glassEffect()` directly on iOS 18 is not allowed.
public struct LiquidGlassModifier: ViewModifier {
    /// Honour Reduce Transparency by collapsing to an opaque surface (A-03).
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    /// Corner radius applied to the glass surface.
    private let cornerRadius: CGFloat

    /// Creates a Liquid Glass modifier with the given corner radius.
    /// - Parameter cornerRadius: Outer corner radius. Defaults to `24` to
    ///   match the Task 02 `DSRadius.lg` token.
    public init(cornerRadius: CGFloat = 24) {
        self.cornerRadius = cornerRadius
    }

    public func body(content: Content) -> some View {
        let shape = RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
        if reduceTransparency {
            content
                .background(shape.fill(Self.opaqueSurface))
                .overlay(shape.strokeBorder(Color.primary.opacity(0.08), lineWidth: 1))
        } else {
            content
                .background(shape.fill(.regularMaterial))
                .overlay(shape.strokeBorder(Color.primary.opacity(0.12), lineWidth: 1))
        }
    }

    /// Platform-specific opaque background used when Reduce Transparency is on.
    /// Task 02 will replace this with a `DSColor.surface` token; for the
    /// bootstrap we resolve to the system background color so the fallback
    /// renders correctly on both iOS and macOS test targets.
    private static var opaqueSurface: Color {
        #if canImport(UIKit)
        Color(UIColor.systemBackground)
        #elseif canImport(AppKit)
        Color(NSColor.windowBackgroundColor)
        #else
        Color.gray.opacity(0.1)
        #endif
    }
}

public extension View {
    /// Applies the Liquid Glass surface treatment.
    ///
    /// On iOS 26 the surface uses native Liquid Glass materials (added in
    /// Task 02). On iOS 18 it falls back to `.regularMaterial`. When the
    /// user has Reduce Transparency enabled the modifier collapses to an
    /// opaque background.
    /// - Parameter cornerRadius: Outer corner radius. Defaults to `24`.
    /// - Returns: A view with the glass surface applied.
    func liquidGlass(cornerRadius: CGFloat = 24) -> some View {
        modifier(LiquidGlassModifier(cornerRadius: cornerRadius))
    }
}
