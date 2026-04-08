//
//  GradientText.swift
//  DesignSystem
//

import SwiftUI

/// Renders text with a gradient foreground, matching the web's `.text-gradient`.
public struct GradientText: View {
    let text: LocalizedStringResource
    let gradient: LinearGradient
    let font: Font

    /// Creates gradient-filled text.
    /// - Parameters:
    ///   - text: The localized string to display.
    ///   - gradient: The gradient fill. Defaults to `DSGradient.primary`.
    ///   - font: The font to use. Defaults to `DSFont.displayL`.
    public init(
        _ text: LocalizedStringResource,
        gradient: LinearGradient = DSGradient.primary,
        font: Font = DSFont.displayL
    ) {
        self.text = text
        self.gradient = gradient
        self.font = font
    }

    public var body: some View {
        Text(text)
            .font(font)
            .foregroundStyle(gradient)
    }
}
