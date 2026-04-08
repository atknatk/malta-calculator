//
//  DSRadius.swift
//  DesignSystem
//

import SwiftUI

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
}
