//
//  DSSectionHeader.swift
//  DesignSystem
//

import SwiftUI

/// A section header with an icon box, title, and optional subtitle.
///
/// Used as a category heading in calculator grids and form sections.
public struct DSSectionHeader: View {
    let title: LocalizedStringResource
    let subtitle: LocalizedStringResource?
    let icon: String
    let gradientColors: [Color]

    /// Creates a section header.
    /// - Parameters:
    ///   - title: Section title.
    ///   - subtitle: Optional subtitle.
    ///   - icon: SF Symbol name.
    ///   - gradientColors: Icon box gradient colors. Defaults to Malta gold tones.
    public init(
        title: LocalizedStringResource,
        subtitle: LocalizedStringResource? = nil,
        icon: String,
        gradientColors: [Color] = DSColor.categoryEmployment
    ) {
        self.title = title
        self.subtitle = subtitle
        self.icon = icon
        self.gradientColors = gradientColors
    }

    public var body: some View {
        HStack(spacing: DSSpacing.sm) {
            Image(systemName: icon)
                .font(.system(size: 16, weight: .semibold))
                .foregroundStyle(.white)
                .frame(width: 36, height: 36)
                .background(DSGradient.category(gradientColors), in: RoundedRectangle(cornerRadius: DSRadius.sm))

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(DSFont.headingS)
                    .foregroundStyle(DSColor.textPrimary)

                if let subtitle {
                    Text(subtitle)
                        .font(DSFont.bodyS)
                        .foregroundStyle(DSColor.textSecondary)
                }
            }
        }
        .accessibilityElement(children: .combine)
    }
}
