//
//  DSFont.swift
//  DesignSystem
//

import SwiftUI

/// Typography tokens that scale with Dynamic Type.
///
/// All text in the app must use these tokens — no fixed-size custom fonts.
/// Tokens use system font designs (serif, rounded, default, monospaced)
/// that automatically support Dynamic Type scaling.
public enum DSFont {

    // MARK: - Display (Serif)

    /// Creates a display-level serif font.
    /// - Parameters:
    ///   - size: Base point size.
    ///   - weight: Font weight. Defaults to `.bold`.
    /// - Returns: A scalable system serif font.
    public static func display(_ size: CGFloat, weight: Font.Weight = .bold) -> Font {
        .system(size: size, weight: weight, design: .serif)
    }

    /// Extra-large display (48pt serif bold).
    public static var displayXL: Font { display(48) }

    /// Large display (40pt serif bold).
    public static var displayL: Font { display(40) }

    /// Medium display (32pt serif bold).
    public static var displayM: Font { display(32) }

    /// Small display (24pt serif bold).
    public static var displayS: Font { display(24) }

    // MARK: - Heading (Rounded)

    /// Creates a heading-level rounded font.
    /// - Parameters:
    ///   - size: Base point size.
    ///   - weight: Font weight. Defaults to `.semibold`.
    /// - Returns: A scalable system rounded font.
    public static func heading(_ size: CGFloat, weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .rounded)
    }

    /// Large heading (22pt rounded semibold).
    public static var headingL: Font { heading(22) }

    /// Medium heading (18pt rounded semibold).
    public static var headingM: Font { heading(18) }

    /// Small heading (16pt rounded semibold).
    public static var headingS: Font { heading(16) }

    // MARK: - Body (Default)

    /// Creates a body-level system font.
    /// - Parameters:
    ///   - size: Base point size. Defaults to `16`.
    ///   - weight: Font weight. Defaults to `.regular`.
    /// - Returns: A scalable system default font.
    public static func body(_ size: CGFloat = 16, weight: Font.Weight = .regular) -> Font {
        .system(size: size, weight: weight, design: .default)
    }

    /// Large body (17pt regular).
    public static var bodyL: Font { body(17) }

    /// Medium body (15pt regular).
    public static var bodyM: Font { body(15) }

    /// Small body (13pt regular).
    public static var bodyS: Font { body(13) }

    /// Caption text (11pt medium).
    public static var caption: Font { body(11, weight: .medium) }

    // MARK: - Monospaced

    /// Creates a monospaced font for numeric/currency display.
    /// - Parameters:
    ///   - size: Base point size. Defaults to `14`.
    ///   - weight: Font weight. Defaults to `.medium`.
    /// - Returns: A scalable system monospaced font.
    public static func mono(_ size: CGFloat = 14, weight: Font.Weight = .medium) -> Font {
        .system(size: size, weight: weight, design: .monospaced)
    }
}
