//
//  View+Accessibility.swift
//  DesignSystem
//
//  Convenience accessibility modifiers that standardise VoiceOver,
//  Dynamic Type, and assistive-technology support across the app.
//

import SwiftUI

// MARK: - Compound Accessibility Modifier

public extension View {
    /// Applies accessibility label, hint, and value in a single call.
    ///
    /// Use this when a view needs all three annotations at once —
    /// it keeps call sites compact and consistent.
    ///
    /// - Parameters:
    ///   - label: Concise description of the element for VoiceOver.
    ///   - hint: Describes the result of interacting with the element.
    ///   - value: Current value of the element (e.g. selected option, amount).
    /// - Returns: The modified view with accessibility annotations applied.
    func dsAccessible(
        label: LocalizedStringResource,
        hint: LocalizedStringResource? = nil,
        value: String? = nil
    ) -> some View {
        self
            .accessibilityLabel(Text(label))
            .ifLet(hint) { view, hint in
                view.accessibilityHint(Text(hint))
            }
            .ifLet(value) { view, value in
                view.accessibilityValue(Text(value))
            }
    }

    /// Marks this view as a section header for VoiceOver rotor navigation.
    ///
    /// Apply to all `Text` views that act as section headings so VoiceOver
    /// users can jump between sections using the Headings rotor.
    func dsHeader() -> some View {
        self.accessibilityAddTraits(.isHeader)
    }

    /// Marks this view as content that should not be inverted when
    /// Smart Invert Colors is enabled.
    ///
    /// Apply to images, charts, donut visualisations, and any view whose
    /// colors carry semantic meaning that would be lost if inverted.
    func dsSensitive() -> some View {
        self.accessibilityIgnoresInvertColors(true)
    }
}

// MARK: - Optional View Modifier Helper

public extension View {
    /// Applies a transform only when the optional value is non-nil.
    @ViewBuilder
    func ifLet<T, V: View>(_ value: T?, transform: (Self, T) -> V) -> some View {
        if let value {
            transform(self, value)
        } else {
            self
        }
    }
}

// MARK: - Increased Contrast Support

public extension View {
    /// Adjusts border opacity for Increased Contrast mode.
    ///
    /// Returns full opacity when the system contrast setting is `.increased`,
    /// otherwise returns the provided default.
    ///
    /// - Parameter defaultOpacity: Opacity used when contrast is standard.
    /// - Returns: The appropriate opacity for the current contrast setting.
    func dsContrastBorderOpacity(default defaultOpacity: Double = 0.3) -> some View {
        self.modifier(ContrastBorderModifier(defaultOpacity: defaultOpacity))
    }
}

/// Modifier that reads `colorSchemeContrast` and adjusts opacity.
private struct ContrastBorderModifier: ViewModifier {
    let defaultOpacity: Double
    @Environment(\.colorSchemeContrast) private var contrast

    func body(content: Content) -> some View {
        content.opacity(contrast == .increased ? 1 : defaultOpacity)
    }
}
