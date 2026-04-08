//
//  DSButton.swift
//  DesignSystem
//

import SwiftUI

/// Visual variant for `DSButton`.
public enum DSButtonVariant: Sendable, Equatable, Hashable, CaseIterable {
    /// Malta gold filled button.
    case primary
    /// Glass background with gold text.
    case secondary
    /// Outlined button with gold border and transparent background.
    case outline
    /// Text-only ghost button.
    case ghost
    /// Primary with shimmer and glow shadow.
    case glow
    /// Red filled destructive action.
    case destructive

    /// The foreground color for this variant.
    public var foregroundColor: Color {
        DSButtonStyle.foregroundColor(for: self)
    }

    /// Whether this variant uses a filled (opaque/gradient) background.
    public var isFilledBackground: Bool {
        switch self {
        case .primary, .glow, .destructive: return true
        case .secondary, .outline, .ghost: return false
        }
    }

    /// Whether this variant has a visible border.
    public var hasBorder: Bool {
        switch self {
        case .secondary, .outline: return true
        case .primary, .ghost, .glow, .destructive: return false
        }
    }

    /// Whether this variant expands to full width by default.
    public var isFullWidth: Bool {
        switch self {
        case .ghost, .outline: return false
        case .primary, .secondary, .glow, .destructive: return true
        }
    }

    /// Human-readable display name for this variant.
    public var displayName: String {
        switch self {
        case .primary: return "Primary"
        case .secondary: return "Secondary"
        case .outline: return "Outline"
        case .ghost: return "Ghost"
        case .glow: return "Glow"
        case .destructive: return "Destructive"
        }
    }
}

/// Size configuration for `DSButton`.
public enum DSButtonSize: Sendable, Equatable, Hashable, CaseIterable {
    /// Small button (36pt height).
    case small
    /// Regular button (48pt height).
    case regular
    /// Large button (56pt height).
    case large

    /// Button height for this size.
    public var height: CGFloat {
        switch self {
        case .small: return 36
        case .regular: return 48
        case .large: return 56
        }
    }

    /// Font for this button size.
    public var font: Font {
        switch self {
        case .small: return DSFont.body(14, weight: .semibold)
        case .regular: return DSFont.body(16, weight: .semibold)
        case .large: return DSFont.body(17, weight: .bold)
        }
    }

    /// Horizontal padding for this button size.
    public var horizontalPadding: CGFloat {
        switch self {
        case .small: return DSSpacing.md
        case .regular: return DSSpacing.lg
        case .large: return DSSpacing.xl
        }
    }

    /// The ProgressView control size for this button size.
    public var progressViewControlSize: ControlSize {
        switch self {
        case .small: return .mini
        case .regular: return .small
        case .large: return .regular
        }
    }
}

/// A styled button that follows the Malta Calculator design system.
///
/// Use this instead of raw `Button` for all interactive actions in feature code.
public struct DSButton: View {
    let title: LocalizedStringResource
    let icon: String?
    let variant: DSButtonVariant
    let size: DSButtonSize
    let isLoading: Bool
    let action: () -> Void

    /// Creates a design-system button.
    /// - Parameters:
    ///   - title: Localized button label.
    ///   - icon: Optional SF Symbol name.
    ///   - variant: Visual style. Defaults to `.primary`.
    ///   - size: Size configuration. Defaults to `.regular`.
    ///   - isLoading: Shows a spinner and disables interaction when `true`.
    ///   - action: The action to perform on tap.
    public init(
        _ title: LocalizedStringResource,
        icon: String? = nil,
        variant: DSButtonVariant = .primary,
        size: DSButtonSize = .regular,
        isLoading: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.icon = icon
        self.variant = variant
        self.size = size
        self.isLoading = isLoading
        self.action = action
    }

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    public var body: some View {
        Button(action: action) {
            HStack(spacing: DSSpacing.xs) {
                if isLoading {
                    ProgressView()
                        .controlSize(size.progressViewControlSize)
                        .tint(variant.foregroundColor)
                        .transition(.opacity)
                } else if let icon {
                    Image(systemName: icon)
                        .transition(.opacity)
                }
                Text(title)
                    .opacity(isLoading ? 0.6 : 1)
            }
            .font(size.font)
            .animation(reduceMotion ? DSMotion.instant : DSMotion.quick, value: isLoading)
        }
        .buttonStyle(DSButtonStyle(variant: variant, size: size))
        .disabled(isLoading)
        .allowsHitTesting(!isLoading)
        .accessibilityLabel(title)
        .accessibilityValue(isLoading ? "Loading" : "")
        .accessibilityHint(isLoading ? "Please wait" : "")
        .accessibilityAddTraits(isLoading ? .updatesFrequently : [])
        #if os(iOS)
        .sensoryFeedback(.selection, trigger: isLoading)
        #endif
    }
}

/// Custom `ButtonStyle` implementing the Malta Calculator visual treatments.
public struct DSButtonStyle: ButtonStyle {
    /// Visual variant.
    let variant: DSButtonVariant
    /// Size configuration.
    let size: DSButtonSize

    @Environment(\.isEnabled) private var isEnabled
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    /// Creates a DS button style.
    public init(variant: DSButtonVariant = .primary, size: DSButtonSize = .regular) {
        self.variant = variant
        self.size = size
    }

    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(foregroundColor)
            .padding(.horizontal, size.horizontalPadding)
            .frame(height: size.height)
            .frame(maxWidth: (variant == .ghost || variant == .outline) ? nil : .infinity)
            .background(background)
            .overlay(border)
            .clipShape(RoundedRectangle(cornerRadius: size.height / 2))
            .scaleEffect(reduceMotion ? 1 : (configuration.isPressed ? 0.97 : 1))
            .dsShadow(shadowFor(isPressed: configuration.isPressed))
            .opacity(isEnabled ? 1 : 0.6)
            .animation(reduceMotion ? DSMotion.instant : DSMotion.quick, value: configuration.isPressed)
    }

    @ViewBuilder
    private var background: some View {
        switch variant {
        case .primary:
            DSGradient.primary
        case .secondary:
            if reduceTransparency {
                DSColor.surface
            } else {
                Color.clear.background(.regularMaterial)
            }
        case .outline:
            Color.clear
        case .ghost:
            Color.clear
        case .glow:
            DSGradient.primary
        case .destructive:
            DSGradient.danger
        }
    }

    @ViewBuilder
    private var border: some View {
        switch variant {
        case .secondary:
            RoundedRectangle(cornerRadius: size.height / 2)
                .strokeBorder(DSColor.maltaGold.opacity(0.3), lineWidth: 1)
        case .outline:
            RoundedRectangle(cornerRadius: size.height / 2)
                .strokeBorder(DSColor.maltaGold, lineWidth: 1.5)
        default:
            EmptyView()
        }
    }

    private var foregroundColor: Color {
        Self.foregroundColor(for: variant)
    }

    /// Resolves the foreground color for a given variant. Exposed for ProgressView tinting.
    nonisolated static func foregroundColor(for variant: DSButtonVariant) -> Color {
        switch variant {
        case .primary, .glow, .destructive: return .white
        case .secondary, .outline, .ghost: return DSColor.maltaGold
        }
    }

    private func shadowFor(isPressed: Bool) -> DSShadow.Shadow {
        guard isEnabled else { return DSShadow.none }
        switch variant {
        case .glow:
            return isPressed ? DSShadow.pressed : DSShadow.glow
        case .primary, .destructive:
            return isPressed ? DSShadow.pressed : DSShadow.card
        case .secondary, .outline, .ghost:
            return DSShadow.none
        }
    }
}
