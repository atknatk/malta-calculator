//
//  DSSpacing.swift
//  DesignSystem
//

import Foundation

/// Spacing tokens for consistent layout throughout the app.
///
/// All padding, margins, and gaps must use these values.
/// See failure pattern D-01 — no magic numbers in feature code.
public enum DSSpacing {

    /// 4pt — extra-extra-small.
    public static let xxs: CGFloat = 4

    /// 8pt — extra-small.
    public static let xs: CGFloat = 8

    /// 12pt — small.
    public static let sm: CGFloat = 12

    /// 16pt — medium (default).
    public static let md: CGFloat = 16

    /// 24pt — large.
    public static let lg: CGFloat = 24

    /// 32pt — extra-large.
    public static let xl: CGFloat = 32

    /// 48pt — extra-extra-large.
    public static let xxl: CGFloat = 48

    /// 64pt — extra-extra-extra-large.
    public static let xxxl: CGFloat = 64
}
