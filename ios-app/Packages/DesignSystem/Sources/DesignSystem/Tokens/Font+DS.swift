//
//  Font+DS.swift
//  DesignSystem
//

import SwiftUI

/// Extension on `Font` providing design system text style tokens.
///
/// Maps to iOS system text styles for full Dynamic Type support.
/// These are the preferred way to use fonts in feature code.
public extension Font {
    /// Design system font namespace.
    enum DS {
        /// Large title (system text style).
        public static var largeTitle: Font { .largeTitle }
        /// Title 1 (system text style).
        public static var title1: Font { .title }
        /// Title 2 (system text style).
        public static var title2: Font { .title2 }
        /// Title 3 (system text style).
        public static var title3: Font { .title3 }
        /// Headline (system text style).
        public static var headline: Font { .headline }
        /// Subheadline (system text style).
        public static var subheadline: Font { .subheadline }
        /// Body (system text style).
        public static var body: Font { .body }
        /// Callout (system text style).
        public static var callout: Font { .callout }
        /// Footnote (system text style).
        public static var footnote: Font { .footnote }
        /// Caption 1 (system text style).
        public static var caption1: Font { .caption }
        /// Caption 2 (system text style).
        public static var caption2: Font { .caption2 }
    }
}
