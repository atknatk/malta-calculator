//
//  DSButton.swift
//  DesignSystem
//

import SwiftUI

/// Visual variant for `DSButton`.
public enum DSButtonVariant: Sendable {
    /// Malta gold filled button.
    case primary
    /// Glass background with gold text.
    case secondary
    /// Text-only ghost button.
    case ghost
    /// Primary with shimmer and glow shadow.
    case glow
    /// Red filled destructive action.
    case destructive
}

/// Size configuration for `DSButton`.
public enum DSButtonSize: Sendable {
    /// Small button (36pt height).
    case small
    /// Regular button (48pt height).
    case regular
    /// Large button (56pt height).
    case large

    /// Button height for this size.
    var height: CGFloat {
        switch self {
        case .small: return 36
        case .regular: return 48
        case .large: return 56
        }
    }

    /// Font for this button size.
    var font: Font {
        switch self {
        case .small: return DSFont.body(14, weight: .semibold)
        case .regular: return DSFont.body(16, weight: .semibold)
        case .large: return DSFont.body(17, weight: .bold)
        }
    }

    /// Horizontal padding for this button size.
    var horizontalPadding: CGFloat {
        switch self {
        case .small: return DSSpacing.md
        case .regular: return DSSpacing.lg
        case .large: return DSSpacing.xl
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

    public var body: some View {
        Button(action: action) {
            HStack(spacing: DSSpacing.xs) {
                if isLoading {
                    ProgressView().controlSize(.small)
                } else if let icon {
                    Image(systemName: icon)
                }
                Text(title)
            }
            .font(size.font)
        }
        .buttonStyle(DSButtonStyle(variant: variant, size: size))
        .disabled(isLoading)
        #if os(iOS)
        .sensoryFeedback(.selection, trigger: isLoading)
        #endif
        .accessibilityLabel(title)
    }
}

/// Custom `ButtonStyle` implementing the Malta Calculator visual treatments.
public struct DSButtonStyle: ButtonStyle {
    /// Visual variant.
    let variant: DSButtonVariant
    /// Size configuration.
    let size: DSButtonSize

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
            .frame(maxWidth: variant == .ghost ? nil : .infinity)
            .background(background)
            .overlay(border)
            .clipShape(RoundedRectangle(cornerRadius: size.height / 2))
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .dsShadow(shadowFor(isPressed: configuration.isPressed))
            .animation(DSMotion.quick, value: configuration.isPressed)
    }

    @ViewBuilder
    private var background: some View {
        switch variant {
        case .primary:
            DSGradient.primary
        case .secondary:
            Color.clear.background(.regularMaterial)
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
        default:
            EmptyView()
        }
    }

    private var foregroundColor: Color {
        switch variant {
        case .primary, .glow, .destructive: return .white
        case .secondary, .ghost: return DSColor.maltaGold
        }
    }

    private func shadowFor(isPressed: Bool) -> DSShadow.Shadow {
        switch variant {
        case .glow:
            return isPressed ? DSShadow.pressed : DSShadow.glow
        case .primary, .destructive:
            return isPressed ? DSShadow.pressed : DSShadow.card
        default:
            return .init(color: .clear, radius: 0, x: 0, y: 0)
        }
    }
}
