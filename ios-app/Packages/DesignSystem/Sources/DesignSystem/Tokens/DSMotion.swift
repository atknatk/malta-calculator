//
//  DSMotion.swift
//  DesignSystem
//

import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

/// Animation tokens for consistent motion throughout the app.
///
/// All animations must use these tokens.
/// See failure pattern A-03 — always check `accessibilityReduceMotion`.
public enum DSMotion {

    // MARK: - Durations

    /// Raw duration values (seconds) for use outside of `Animation` contexts.
    public enum Duration {
        /// Instant (zero-duration): 0s.
        public static let instant: TimeInterval = 0
        /// Quick interaction feedback: 0.18s.
        public static let quick: TimeInterval = 0.18
        /// Standard transition: 0.32s.
        public static let standard: TimeInterval = 0.32
        /// Slow deliberate transition: 0.5s.
        public static let slow: TimeInterval = 0.5
        /// Floating loop cycle: 6s.
        public static let float: TimeInterval = 6
        /// Glow pulse cycle: 3s.
        public static let glow: TimeInterval = 3

        /// All duration values from fastest to slowest.
        public static let allValues: [TimeInterval] = [instant, quick, standard, slow, glow, float]
    }

    // MARK: - Animations

    /// Quick interaction feedback (0.18s ease-out).
    public static let quick = Animation.easeOut(duration: Duration.quick)

    /// Standard transition (0.32s ease-in-out).
    public static let standard = Animation.easeInOut(duration: Duration.standard)

    /// Slow, deliberate transition (0.5s ease-in-out).
    public static let slow = Animation.easeInOut(duration: Duration.slow)

    /// Instant (zero-duration) animation for immediate state changes or reduce-motion fallback.
    public static let instant = Animation.linear(duration: 0)

    /// Expressive spring (response 0.5, damping 0.75).
    public static let expressive = Animation.spring(response: 0.5, dampingFraction: 0.75)

    /// Bouncy spring (response 0.45, damping 0.65).
    public static let bouncy = Animation.spring(response: 0.45, dampingFraction: 0.65)

    /// Continuous floating loop (6s, autoreverses).
    public static let float = Animation.easeInOut(duration: Duration.float).repeatForever(autoreverses: true)

    /// Continuous glow pulse loop (3s, autoreverses).
    public static let glow = Animation.easeInOut(duration: Duration.glow).repeatForever(autoreverses: true)

    // MARK: - Easing Curves

    /// Named easing curve tokens for consistent motion character.
    public enum Curve {
        /// Quick feedback: ease-out.
        public static let quickOut: Animation = .easeOut(duration: Duration.quick)
        /// Standard transition: ease-in-out.
        public static let standard: Animation = .easeInOut(duration: Duration.standard)
        /// Slow deliberate: ease-in-out.
        public static let slow: Animation = .easeInOut(duration: Duration.slow)
        /// Linear (no easing).
        public static let linear: Animation = .linear(duration: Duration.standard)
    }

    // MARK: - Animation Catalog

    /// All named animation tokens (non-looping).
    public static let allAnimations: [String: Animation] = [
        "quick": quick,
        "standard": standard,
        "slow": slow,
        "instant": instant,
        "expressive": expressive,
        "bouncy": bouncy,
    ]

    /// All named looping animation tokens.
    public static let allLoopingAnimations: [String: Animation] = [
        "float": float,
        "glow": glow,
    ]

    // MARK: - Transitions

    /// Named transition presets for consistent enter/exit effects.
    public enum Transition {
        /// Fade transition using standard timing.
        nonisolated(unsafe) public static let fade = AnyTransition.opacity.animation(standard)
        /// Slide from bottom with fade.
        nonisolated(unsafe) public static let slideUp = AnyTransition.move(edge: .bottom).combined(with: .opacity).animation(standard)
        /// Slide from top with fade.
        nonisolated(unsafe) public static let slideDown = AnyTransition.move(edge: .top).combined(with: .opacity).animation(standard)
        /// Scale from center with fade.
        nonisolated(unsafe) public static let scaleUp = AnyTransition.scale.combined(with: .opacity).animation(standard)

        /// All named transitions.
        nonisolated(unsafe) public static let allTransitions: [String: AnyTransition] = [
            "fade": fade,
            "slideUp": slideUp,
            "slideDown": slideDown,
            "scaleUp": scaleUp,
        ]
    }

    // MARK: - Reduce Motion Helpers

    /// Returns the given animation when Reduce Motion is off, or `.instant` when on.
    @MainActor
    public static func preferReducedMotion(_ animation: Animation) -> Animation {
        #if canImport(UIKit)
        if UIAccessibility.isReduceMotionEnabled {
            return instant
        }
        #endif
        return animation
    }
}
