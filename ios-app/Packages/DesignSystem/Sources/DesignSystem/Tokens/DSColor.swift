//
//  DSColor.swift
//  DesignSystem
//

import SwiftUI

/// Central color token catalog for Malta Calculator.
///
/// All feature code must reference these tokens — never use raw
/// `Color(hex:)` or `Color(red:green:blue:)` outside of this file.
/// See failure pattern D-02.
public enum DSColor {

    // MARK: - Brand

    /// Malta Gold — primary brand color.
    public static let maltaGold = Color(light: "#C97D0A", dark: "#E89A20")

    /// Malta Gold muted variant for secondary surfaces.
    public static let maltaGoldMuted = Color(light: "#B86F08", dark: "#D4891C")

    /// Mediterranean Blue — secondary brand color.
    public static let mediterraneanBlue = Color(light: "#0099CC", dark: "#2CB5E0")

    /// Mediterranean Blue muted variant.
    public static let mediterraneanBlueMuted = Color(light: "#0077B6", dark: "#1A9FCC")

    /// Malta Red — destructive / alert color.
    public static let maltaRed = Color(light: "#E2352A", dark: "#F04A3E")

    /// Warm Sand — subtle warm accent.
    public static let warmSand = Color(light: "#F7ECD6", dark: "#2A241A")

    // MARK: - Surfaces

    /// Primary background color.
    public static let background = Color(light: "#FBF9F4", dark: "#0F1114")

    /// Card / elevated surface color.
    public static let surface = Color(light: "#FFFFFF", dark: "#1A1D22")

    /// Muted surface for secondary areas.
    public static let surfaceMuted = Color(light: "#F3EFE7", dark: "#22262D")

    /// Elevated surface (sheets, popovers).
    public static let surfaceElevated = Color(light: "#FFFFFF", dark: "#242831")

    // MARK: - Text

    /// Primary text color.
    public static let textPrimary = Color(light: "#1A1712", dark: "#F4F1E8")

    /// Secondary text color.
    public static let textSecondary = Color(light: "#6B6256", dark: "#A39B8E")

    /// Tertiary text color.
    public static let textTertiary = Color(light: "#9B9285", dark: "#766F65")

    /// Inverse text (on dark/light backgrounds).
    public static let textInverse = Color(light: "#FFFFFF", dark: "#0F1114")

    // MARK: - Semantic

    /// Success / positive state color.
    public static let success = Color(light: "#11998E", dark: "#1CB49E")

    /// Warning state color.
    public static let warning = Color(light: "#F59E0B", dark: "#FBBF24")

    /// Danger / error state color.
    public static let danger = Color(light: "#E2352A", dark: "#F04A3E")

    /// Informational state color.
    public static let info = Color(light: "#0099CC", dark: "#2CB5E0")

    // MARK: - Glass

    /// Glass tint color (white in light, black in dark).
    public static let glassTint = Color(light: "#FFFFFF", dark: "#000000")

    /// Glass stroke border color.
    public static let glassStroke = Color(light: "#FFFFFF", dark: "#FFFFFF")

    // MARK: - Category Gradients

    /// Employment & Salary category gradient colors.
    public static let categoryEmployment = [Color(hex: "#F59E0B"), Color(hex: "#EA580C")]

    /// Family & Children category gradient colors.
    public static let categoryFamily = [Color(hex: "#EC4899"), Color(hex: "#E11D48")]

    /// Property & Housing category gradient colors.
    public static let categoryProperty = [Color(hex: "#10B981"), Color(hex: "#059669")]

    /// Banking & Loans category gradient colors.
    public static let categoryBanking = [Color(hex: "#0EA5E9"), Color(hex: "#2563EB")]

    /// Retirement & Savings category gradient colors.
    public static let categoryRetirement = [Color(hex: "#3B82F6"), Color(hex: "#06B6D4")]

    /// Self-Employment category gradient colors.
    public static let categorySelfEmp = [Color(hex: "#8B5CF6"), Color(hex: "#9333EA")]

    /// Leave & Time Off category gradient colors.
    public static let categoryLeave = [Color(hex: "#14B8A6"), Color(hex: "#10B981")]

    /// Transport & Vehicles category gradient colors.
    public static let categoryTransport = [Color(hex: "#64748B"), Color(hex: "#475569")]

    /// Immigration & Visa category gradient colors.
    public static let categoryImmigration = [Color(hex: "#6366F1"), Color(hex: "#7C3AED")]
}
