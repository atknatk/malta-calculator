//
//  DSGradient.swift
//  DesignSystem
//

import SwiftUI

/// Gradient tokens matching the web app's CSS gradient variables.
public enum DSGradient {

    /// Primary brand gradient (Malta Gold).
    public static let primary = LinearGradient(
        colors: [Color(hex: "#C97D0A"), Color(hex: "#B86F08"), Color(hex: "#A56006")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    /// Secondary brand gradient (Mediterranean Blue).
    public static let secondary = LinearGradient(
        colors: [Color(hex: "#0099CC"), Color(hex: "#0077B6"), Color(hex: "#005F8A")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    /// Warm accent gradient.
    public static let accent = LinearGradient(
        colors: [Color(hex: "#FFECD2"), Color(hex: "#FCB69F")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    /// Success state gradient.
    public static let success = LinearGradient(
        colors: [Color(hex: "#11998E"), Color(hex: "#38EF7D")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    /// Danger state gradient.
    public static let danger = LinearGradient(
        colors: [Color(hex: "#EB3349"), Color(hex: "#F45C43")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    /// Builds a linear gradient from a category color pair.
    /// - Parameter colors: Two-element array of category colors.
    /// - Returns: A `LinearGradient` from top-leading to bottom-trailing.
    public static func category(_ colors: [Color]) -> LinearGradient {
        LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing)
    }
}
