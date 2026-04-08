//
//  DSEmptyState.swift
//  DesignSystem
//

import SwiftUI

/// An empty state placeholder view.
///
/// Wraps `ContentUnavailableView` with design system styling.
public struct DSEmptyState: View {
    let title: LocalizedStringResource
    let description: LocalizedStringResource
    let icon: String

    /// Creates an empty state view.
    /// - Parameters:
    ///   - title: Empty state title.
    ///   - description: Explanatory text.
    ///   - icon: SF Symbol name.
    public init(
        title: LocalizedStringResource,
        description: LocalizedStringResource,
        icon: String
    ) {
        self.title = title
        self.description = description
        self.icon = icon
    }

    public var body: some View {
        ContentUnavailableView {
            Label(title, systemImage: icon)
                .foregroundStyle(DSColor.textSecondary)
        } description: {
            Text(description)
                .font(DSFont.bodyM)
                .foregroundStyle(DSColor.textTertiary)
        }
    }
}
