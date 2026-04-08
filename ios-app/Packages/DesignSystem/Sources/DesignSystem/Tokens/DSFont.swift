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

    /// Label text (14pt medium) — form labels, field labels.
    public static var label: Font { body(14, weight: .medium) }

    /// Footnote text (12pt regular) — disclaimers, fine print.
    public static var footnote: Font { body(12) }

    // MARK: - Monospaced

    /// Creates a monospaced font for numeric/currency display.
    /// - Parameters:
    ///   - size: Base point size. Defaults to `14`.
    ///   - weight: Font weight. Defaults to `.medium`.
    /// - Returns: A scalable system monospaced font.
    public static func mono(_ size: CGFloat = 14, weight: Font.Weight = .medium) -> Font {
        .system(size: size, weight: weight, design: .monospaced)
    }

    // MARK: - Size Constants

    /// Raw point-size constants for all semantic font tokens.
    /// Use these when you need the numeric size value outside of a `Font` context
    /// (e.g., for layout calculations or snapshot assertions).
    public enum Size {
        /// Display extra-large: 48pt.
        public static let displayXL: CGFloat = 48
        /// Display large: 40pt.
        public static let displayL: CGFloat = 40
        /// Display medium: 32pt.
        public static let displayM: CGFloat = 32
        /// Display small: 24pt.
        public static let displayS: CGFloat = 24
        /// Heading large: 22pt.
        public static let headingL: CGFloat = 22
        /// Heading medium: 18pt.
        public static let headingM: CGFloat = 18
        /// Heading small: 16pt.
        public static let headingS: CGFloat = 16
        /// Body large: 17pt.
        public static let bodyL: CGFloat = 17
        /// Body medium: 15pt.
        public static let bodyM: CGFloat = 15
        /// Body small: 13pt.
        public static let bodyS: CGFloat = 13
        /// Caption: 11pt.
        public static let caption: CGFloat = 11
        /// Label: 14pt.
        public static let label: CGFloat = 14
        /// Footnote: 12pt.
        public static let footnote: CGFloat = 12

        /// All size values ordered from largest to smallest.
        public static let allValues: [CGFloat] = [
            displayXL, displayL, displayM, displayS,
            headingL, headingM, headingS,
            bodyL, bodyM, bodyS,
            label, footnote, caption,
        ]
    }

    // MARK: - Letter Spacing

    /// Letter spacing (tracking) tokens for typography refinement.
    public enum LetterSpacing {
        /// Tight tracking (-0.5pt) — display headlines.
        public static let tight: CGFloat = -0.5
        /// Standard tracking (0pt) — body text.
        public static let standard: CGFloat = 0
        /// Wide tracking (0.5pt) — captions, labels.
        public static let wide: CGFloat = 0.5
        /// Extra-wide tracking (1.0pt) — all-caps text.
        public static let extraWide: CGFloat = 1.0

        /// All letter spacing values from tightest to widest.
        public static let allValues: [CGFloat] = [tight, standard, wide, extraWide]
    }

    // MARK: - Line Height

    /// Line-height multipliers for vertical rhythm.
    public enum LineHeight {
        /// Tight (1.2×) — display, heading text.
        public static let tight: CGFloat = 1.2
        /// Standard (1.5×) — body text.
        public static let standard: CGFloat = 1.5
        /// Relaxed (1.75×) — long-form reading.
        public static let relaxed: CGFloat = 1.75

        /// All line-height multiplier values ordered from tightest to most relaxed.
        public static let allValues: [CGFloat] = [tight, standard, relaxed]
    }

    // MARK: - Text Style Mapping

    /// Maps semantic text roles to `Font.TextStyle` for Dynamic Type support.
    public enum TextStyleMapping: Sendable, CaseIterable {
        case displayXL, displayL, displayM, displayS
        case headingL, headingM, headingS
        case bodyL, bodyM, bodyS
        case caption, label, footnote

        /// The `Font.TextStyle` used for Dynamic Type relative sizing.
        public var textStyle: Font.TextStyle {
            switch self {
            case .displayXL: return .largeTitle
            case .displayL: return .largeTitle
            case .displayM: return .title
            case .displayS: return .title2
            case .headingL: return .title3
            case .headingM: return .headline
            case .headingS: return .subheadline
            case .bodyL: return .body
            case .bodyM: return .callout
            case .bodyS: return .footnote
            case .caption: return .caption
            case .label: return .callout
            case .footnote: return .caption2
            }
        }

        /// The resolved `Font` for this text style mapping.
        public var font: Font {
            switch self {
            case .displayXL: return DSFont.displayXL
            case .displayL: return DSFont.displayL
            case .displayM: return DSFont.displayM
            case .displayS: return DSFont.displayS
            case .headingL: return DSFont.headingL
            case .headingM: return DSFont.headingM
            case .headingS: return DSFont.headingS
            case .bodyL: return DSFont.bodyL
            case .bodyM: return DSFont.bodyM
            case .bodyS: return DSFont.bodyS
            case .caption: return DSFont.caption
            case .label: return DSFont.label
            case .footnote: return DSFont.footnote
            }
        }

        /// The raw point size for this text style.
        public var size: CGFloat {
            switch self {
            case .displayXL: return Size.displayXL
            case .displayL: return Size.displayL
            case .displayM: return Size.displayM
            case .displayS: return Size.displayS
            case .headingL: return Size.headingL
            case .headingM: return Size.headingM
            case .headingS: return Size.headingS
            case .bodyL: return Size.bodyL
            case .bodyM: return Size.bodyM
            case .bodyS: return Size.bodyS
            case .caption: return Size.caption
            case .label: return Size.label
            case .footnote: return Size.footnote
            }
        }
    }

    /// All semantic text style mappings.
    public static let allStyles: [TextStyleMapping] = TextStyleMapping.allCases
}
