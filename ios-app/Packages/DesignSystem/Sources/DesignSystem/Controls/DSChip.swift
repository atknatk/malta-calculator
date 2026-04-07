//
//  DSChip.swift
//  DesignSystem
//

import SwiftUI

/// A selectable chip for categories and filters.
public struct DSChip: View {
    let title: LocalizedStringResource
    let icon: String?
    let isSelected: Bool
    let action: () -> Void

    /// Creates a filter chip.
    /// - Parameters:
    ///   - title: Chip label.
    ///   - icon: Optional SF Symbol name.
    ///   - isSelected: Whether the chip is in selected state.
    ///   - action: Action on tap.
    public init(
        _ title: LocalizedStringResource,
        icon: String? = nil,
        isSelected: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.icon = icon
        self.isSelected = isSelected
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: DSSpacing.xxs) {
                if let icon {
                    Image(systemName: icon)
                        .font(.system(size: 12))
                }
                Text(title)
                    .font(DSFont.bodyS)
            }
            .padding(.horizontal, DSSpacing.sm)
            .padding(.vertical, DSSpacing.xs)
            .foregroundStyle(isSelected ? .white : DSColor.textPrimary)
            .background(
                isSelected
                    ? AnyShapeStyle(DSGradient.primary)
                    : AnyShapeStyle(DSColor.surfaceMuted),
                in: Capsule()
            )
            .overlay(
                Capsule().strokeBorder(
                    isSelected ? Color.clear : DSColor.textSecondary.opacity(0.15),
                    lineWidth: 1
                )
            )
        }
        .buttonStyle(.plain)
        .accessibilityLabel(title)
        .accessibilityAddTraits(isSelected ? .isSelected : [])
    }
}
