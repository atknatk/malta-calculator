//
//  DSMotion.swift
//  DesignSystem
//

import SwiftUI

/// Animation tokens for consistent motion throughout the app.
///
/// All animations must use these tokens.
/// See failure pattern A-03 — always check `accessibilityReduceMotion`.
public enum DSMotion {

    /// Quick interaction feedback (0.18s ease-out).
    public static let quick = Animation.easeOut(duration: 0.18)

    /// Standard transition (0.32s ease-in-out).
    public static let standard = Animation.easeInOut(duration: 0.32)

    /// Slow, deliberate transition (0.5s ease-in-out).
    public static let slow = Animation.easeInOut(duration: 0.5)

    /// Expressive spring (response 0.5, damping 0.75).
    public static let expressive = Animation.spring(response: 0.5, dampingFraction: 0.75)

    /// Bouncy spring (response 0.45, damping 0.65).
    public static let bouncy = Animation.spring(response: 0.45, dampingFraction: 0.65)

    /// Continuous floating loop (6s, autoreverses).
    public static let float = Animation.easeInOut(duration: 6).repeatForever(autoreverses: true)

    /// Continuous glow pulse loop (3s, autoreverses).
    public static let glow = Animation.easeInOut(duration: 3).repeatForever(autoreverses: true)
}
