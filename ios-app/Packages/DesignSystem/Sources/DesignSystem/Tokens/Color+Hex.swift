//
//  Color+Hex.swift
//  DesignSystem
//

import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

extension Color {
    /// Parses HEX color strings: #RRGGBB, #RRGGBBAA, 6/8 character support.
    /// - Parameters:
    ///   - hex: A hex color string (with or without `#` prefix).
    ///   - alpha: Override alpha value. Defaults to `1.0`.
    init(hex: String, alpha: Double = 1.0) {
        let cleaned = hex.trimmingCharacters(in: .whitespacesAndNewlines)
            .replacingOccurrences(of: "#", with: "")
        var rgb: UInt64 = 0
        Scanner(string: cleaned).scanHexInt64(&rgb)
        let r, g, b, a: Double
        switch cleaned.count {
        case 6:
            r = Double((rgb & 0xFF0000) >> 16) / 255
            g = Double((rgb & 0x00FF00) >> 8) / 255
            b = Double(rgb & 0x0000FF) / 255
            a = alpha
        case 8:
            r = Double((rgb & 0xFF00_0000) >> 24) / 255
            g = Double((rgb & 0x00FF_0000) >> 16) / 255
            b = Double((rgb & 0x0000_FF00) >> 8) / 255
            a = Double(rgb & 0x0000_00FF) / 255
        default:
            r = 0; g = 0; b = 0; a = 1
        }
        self.init(red: r, green: g, blue: b, opacity: a)
    }

    #if canImport(UIKit)
    /// Creates a dynamic light/dark mode color from hex strings.
    /// - Parameters:
    ///   - light: Hex color for light mode.
    ///   - dark: Hex color for dark mode.
    init(light: String, dark: String) {
        self.init(uiColor: UIColor { trait in
            UIColor(Color(hex: trait.userInterfaceStyle == .dark ? dark : light))
        })
    }
    #else
    /// Creates a dynamic light/dark mode color from hex strings (macOS fallback).
    init(light: String, dark: String) {
        // macOS test target fallback — use light variant
        self.init(hex: light)
    }
    #endif
}
