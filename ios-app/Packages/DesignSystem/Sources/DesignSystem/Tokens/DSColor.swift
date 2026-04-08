//
//  DSColor.swift
//  DesignSystem
//

import SwiftUI

// MARK: - Color Token

/// A named color token for catalog and lookup purposes.
public struct ColorToken: Sendable, Identifiable, Equatable, Hashable {
    /// Unique identifier (same as `name`).
    public var id: String { name }
    /// Token name (e.g. "maltaGold").
    public let name: String
    /// The resolved color value.
    public let color: Color
    /// Semantic group this token belongs to.
    public let group: ColorGroup
    /// Human-readable description of this token's purpose.
    public let description: String

    /// Creates a named color token.
    public init(name: String, color: Color, group: ColorGroup, description: String = "") {
        self.name = name
        self.color = color
        self.group = group
        self.description = description
    }

    public static func == (lhs: ColorToken, rhs: ColorToken) -> Bool {
        lhs.name == rhs.name && lhs.group == rhs.group
    }

    public func hash(into hasher: inout Hasher) {
        hasher.combine(name)
        hasher.combine(group)
    }
}

/// Semantic grouping for color tokens.
public enum ColorGroup: String, Sendable, CaseIterable {
    case brand
    case surface
    case text
    case semantic
    case glass
    case category
}

// MARK: - DSColor

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

    // MARK: - Namespaced Groups

    /// Brand color namespace.
    public enum Brand {
        public static var gold: Color { maltaGold }
        public static var goldMuted: Color { maltaGoldMuted }
        public static var blue: Color { mediterraneanBlue }
        public static var blueMuted: Color { mediterraneanBlueMuted }
        public static var red: Color { maltaRed }
        public static var sand: Color { warmSand }

        /// All brand colors.
        public static var allColors: [Color] {
            [gold, goldMuted, blue, blueMuted, red, sand]
        }
    }

    /// Surface color namespace.
    public enum Surface {
        public static var primary: Color { background }
        public static var card: Color { DSColor.surface }
        public static var muted: Color { surfaceMuted }
        public static var elevated: Color { surfaceElevated }

        /// All surface colors.
        public static var allColors: [Color] {
            [primary, card, muted, elevated]
        }
    }

    /// Text color namespace.
    public enum Text {
        public static var primary: Color { textPrimary }
        public static var secondary: Color { textSecondary }
        public static var tertiary: Color { textTertiary }
        public static var inverse: Color { textInverse }

        /// All text colors.
        public static var allColors: [Color] {
            [primary, secondary, tertiary, inverse]
        }
    }

    /// Semantic color namespace.
    public enum Semantic {
        public static var success: Color { DSColor.success }
        public static var warning: Color { DSColor.warning }
        public static var danger: Color { DSColor.danger }
        public static var info: Color { DSColor.info }

        /// All semantic colors.
        public static var allColors: [Color] {
            [success, warning, danger, info]
        }
    }

    /// Glass color namespace.
    public enum Glass {
        public static var tint: Color { glassTint }
        public static var stroke: Color { glassStroke }

        /// All glass colors.
        public static var allColors: [Color] {
            [tint, stroke]
        }
    }

    // MARK: - Category Namespace

    /// Category color namespace for calculator category gradients.
    public enum Category {
        /// Employment & Salary gradient pair.
        public static var employment: [Color] { categoryEmployment }
        /// Family & Children gradient pair.
        public static var family: [Color] { categoryFamily }
        /// Property & Housing gradient pair.
        public static var property: [Color] { categoryProperty }
        /// Banking & Loans gradient pair.
        public static var banking: [Color] { categoryBanking }
        /// Retirement & Savings gradient pair.
        public static var retirement: [Color] { categoryRetirement }
        /// Self-Employment gradient pair.
        public static var selfEmployment: [Color] { categorySelfEmp }
        /// Leave & Time Off gradient pair.
        public static var leave: [Color] { categoryLeave }
        /// Transport & Vehicles gradient pair.
        public static var transport: [Color] { categoryTransport }
        /// Immigration & Visa gradient pair.
        public static var immigration: [Color] { categoryImmigration }

        /// All category gradient pairs.
        public static var allPairs: [[Color]] {
            [employment, family, property, banking, retirement,
             selfEmployment, leave, transport, immigration]
        }
    }

    // MARK: - Asset Catalog

    /// All brand color tokens.
    public static let allBrand: [ColorToken] = [
        ColorToken(name: "maltaGold", color: maltaGold, group: .brand),
        ColorToken(name: "maltaGoldMuted", color: maltaGoldMuted, group: .brand),
        ColorToken(name: "mediterraneanBlue", color: mediterraneanBlue, group: .brand),
        ColorToken(name: "mediterraneanBlueMuted", color: mediterraneanBlueMuted, group: .brand),
        ColorToken(name: "maltaRed", color: maltaRed, group: .brand),
        ColorToken(name: "warmSand", color: warmSand, group: .brand),
    ]

    /// All surface color tokens.
    public static let allSurface: [ColorToken] = [
        ColorToken(name: "background", color: background, group: .surface),
        ColorToken(name: "surface", color: surface, group: .surface),
        ColorToken(name: "surfaceMuted", color: surfaceMuted, group: .surface),
        ColorToken(name: "surfaceElevated", color: surfaceElevated, group: .surface),
    ]

    /// All text color tokens.
    public static let allText: [ColorToken] = [
        ColorToken(name: "textPrimary", color: textPrimary, group: .text),
        ColorToken(name: "textSecondary", color: textSecondary, group: .text),
        ColorToken(name: "textTertiary", color: textTertiary, group: .text),
        ColorToken(name: "textInverse", color: textInverse, group: .text),
    ]

    /// All semantic color tokens.
    public static let allSemantic: [ColorToken] = [
        ColorToken(name: "success", color: success, group: .semantic),
        ColorToken(name: "warning", color: warning, group: .semantic),
        ColorToken(name: "danger", color: danger, group: .semantic),
        ColorToken(name: "info", color: info, group: .semantic),
    ]

    /// All glass color tokens.
    public static let allGlass: [ColorToken] = [
        ColorToken(name: "glassTint", color: glassTint, group: .glass),
        ColorToken(name: "glassStroke", color: glassStroke, group: .glass),
    ]

    /// All category color tokens (start + end colors for each category).
    public static let allCategory: [ColorToken] = [
        ColorToken(name: "categoryEmployment.start", color: categoryEmployment[0], group: .category),
        ColorToken(name: "categoryEmployment.end", color: categoryEmployment[1], group: .category),
        ColorToken(name: "categoryFamily.start", color: categoryFamily[0], group: .category),
        ColorToken(name: "categoryFamily.end", color: categoryFamily[1], group: .category),
        ColorToken(name: "categoryProperty.start", color: categoryProperty[0], group: .category),
        ColorToken(name: "categoryProperty.end", color: categoryProperty[1], group: .category),
        ColorToken(name: "categoryBanking.start", color: categoryBanking[0], group: .category),
        ColorToken(name: "categoryBanking.end", color: categoryBanking[1], group: .category),
        ColorToken(name: "categoryRetirement.start", color: categoryRetirement[0], group: .category),
        ColorToken(name: "categoryRetirement.end", color: categoryRetirement[1], group: .category),
        ColorToken(name: "categorySelfEmp.start", color: categorySelfEmp[0], group: .category),
        ColorToken(name: "categorySelfEmp.end", color: categorySelfEmp[1], group: .category),
        ColorToken(name: "categoryLeave.start", color: categoryLeave[0], group: .category),
        ColorToken(name: "categoryLeave.end", color: categoryLeave[1], group: .category),
        ColorToken(name: "categoryTransport.start", color: categoryTransport[0], group: .category),
        ColorToken(name: "categoryTransport.end", color: categoryTransport[1], group: .category),
        ColorToken(name: "categoryImmigration.start", color: categoryImmigration[0], group: .category),
        ColorToken(name: "categoryImmigration.end", color: categoryImmigration[1], group: .category),
    ]

    /// Complete catalog of all color tokens (including category tokens).
    public static var allTokens: [ColorToken] {
        allBrand + allSurface + allText + allSemantic + allGlass + allCategory
    }

    /// Looks up a color token by name.
    /// - Parameter name: Token name (e.g. "maltaGold").
    /// - Returns: The matching `ColorToken`, or `nil` if not found.
    public static func token(named name: String) -> ColorToken? {
        allTokens.first { $0.name == name }
    }

    /// Returns `true` if a color token with the given name exists in the catalog.
    /// - Parameter name: Token name to check.
    /// - Returns: Whether the token exists.
    public static func contains(name: String) -> Bool {
        allTokens.contains { $0.name == name }
    }

    /// Returns all color tokens belonging to a specific group.
    /// - Parameter group: The `ColorGroup` to filter by.
    /// - Returns: Array of `ColorToken` values in that group.
    public static func tokens(in group: ColorGroup) -> [ColorToken] {
        allTokens.filter { $0.group == group }
    }

    /// All color tokens grouped by their `ColorGroup`.
    public static var tokensByGroup: [ColorGroup: [ColorToken]] {
        Dictionary(grouping: allTokens, by: \.group)
    }
}
