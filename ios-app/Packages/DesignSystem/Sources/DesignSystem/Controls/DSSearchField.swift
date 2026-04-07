//
//  DSSearchField.swift
//  DesignSystem
//

import SwiftUI

/// A custom search field with design-system styling.
///
/// Use this when `.searchable()` cannot be used due to layout constraints.
public struct DSSearchField: View {
    @Binding var text: String
    let placeholder: LocalizedStringResource
    @FocusState private var focused: Bool

    /// Creates a search field.
    /// - Parameters:
    ///   - text: Binding to the search text.
    ///   - placeholder: Placeholder text.
    public init(
        text: Binding<String>,
        placeholder: LocalizedStringResource = "search.placeholder"
    ) {
        self._text = text
        self.placeholder = placeholder
    }

    public var body: some View {
        HStack(spacing: DSSpacing.xs) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(DSColor.textTertiary)

            TextField(String(localized: placeholder), text: $text)
                .font(DSFont.bodyM)
                .focused($focused)
                #if os(iOS)
                .textInputAutocapitalization(.never)
                #endif
                .autocorrectionDisabled()

            if !text.isEmpty {
                Button {
                    text = ""
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(DSColor.textTertiary)
                }
                .accessibilityLabel(String(localized: "search.clear"))
            }
        }
        .padding(.horizontal, DSSpacing.md)
        .frame(height: 44)
        .background(.regularMaterial, in: Capsule())
        .overlay(
            Capsule().strokeBorder(
                focused ? DSColor.maltaGold.opacity(0.5) : DSColor.textSecondary.opacity(0.15),
                lineWidth: 1
            )
        )
        .accessibilityElement(children: .combine)
        .accessibilityLabel(placeholder)
    }
}
