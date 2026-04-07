//
//  DSRadius.swift
//  DesignSystem
//

import Foundation

/// Corner radius tokens for consistent shape rounding.
///
/// All corner radii must use these values.
/// See failure pattern D-01 — no magic numbers in feature code.
public enum DSRadius {

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
}
