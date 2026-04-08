//
//  DSRadius.swift
//  DesignSystem
//

import SwiftUI

/// A named radius token for catalog and lookup purposes.
public struct RadiusToken: Sendable, Identifiable, Equatable, Hashable {
    /// Unique identifier (same as `name`).
    public var id: String { name }
    /// Token name (e.g. "lg").
    public let name: String
    /// The radius value in points.
    public let value: CGFloat

    /// Creates a named radius token.
    public init(name: String, value: CGFloat) {
        self.name = name
        self.value = value
    }
}

/// Corner radius tokens for consistent shape rounding.
///
/// All corner radii must use these values.
/// See failure pattern D-01 — no magic numbers in feature code.
public enum DSRadius {

    /// 0pt — no rounding (sharp corners).
    public static let none: CGFloat = 0

    /// 4pt — extra-small.
    public static let xs: CGFloat = 4

    /// 8pt — small.
    public static let sm: CGFloat = 8

    /// 12pt — medium.
    public static let md: CGFloat = 12

    /// 16pt — large.
    public static let lg: CGFloat = 16

    /// 20pt — extra-large.
    public static let xl: CGFloat = 20

    /// 28pt — extra-extra-large.
    public static let xxl: CGFloat = 28

    /// 9999pt — pill shape.
    public static let pill: CGFloat = 9999

    /// Alias for `pill` — fully circular ends.
    public static let circle: CGFloat = pill

    /// All standard radius values ordered from smallest to largest (excludes `pill`/`circle`).
    public static let allValues: [CGFloat] = [none, xs, sm, md, lg, xl, xxl]

    /// All radius values including `pill`.
    public static let allValuesIncludingPill: [CGFloat] = [none, xs, sm, md, lg, xl, xxl, pill]

    /// Creates a `RoundedRectangle` from a radius token.
    /// - Parameters:
    ///   - radius: A `DSRadius` token value.
    ///   - style: Corner style. Defaults to `.continuous` for iOS-native smooth corners.
    /// - Returns: A shaped `RoundedRectangle`.
    public static func shape(_ radius: CGFloat, style: RoundedCornerStyle = .continuous) -> RoundedRectangle {
        RoundedRectangle(cornerRadius: radius, style: style)
    }

    /// Creates a `Capsule` shape (equivalent to `pill` radius).
    /// - Parameter style: Corner style. Defaults to `.continuous`.
    /// - Returns: A `Capsule` shape.
    public static func capsule(style: RoundedCornerStyle = .continuous) -> Capsule {
        Capsule(style: style)
    }

    // MARK: - Token Catalog

    /// All named radius tokens.
    public static let allTokens: [RadiusToken] = [
        RadiusToken(name: "none", value: none),
        RadiusToken(name: "xs", value: xs),
        RadiusToken(name: "sm", value: sm),
        RadiusToken(name: "md", value: md),
        RadiusToken(name: "lg", value: lg),
        RadiusToken(name: "xl", value: xl),
        RadiusToken(name: "xxl", value: xxl),
        RadiusToken(name: "pill", value: pill),
    ]

    /// Looks up a radius token by name.
    /// - Parameter name: Token name (e.g. "lg").
    /// - Returns: The matching `RadiusToken`, or `nil` if not found.
    public static func token(named name: String) -> RadiusToken? {
        allTokens.first { $0.name == name }
    }
}
