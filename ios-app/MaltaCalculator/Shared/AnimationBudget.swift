//
//  AnimationBudget.swift
//  MaltaCalculator
//
//  Centralized animation budget constants and reduce-motion helpers.
//  All feature code should use these instead of inline Animation values.
//

import SwiftUI

/// Animation budget constants enforcing the per-screen limits from Task 15.
///
/// Limits:
/// - Spring/keyframe: ≤ 5 per screen
/// - Phase animator: ≤ 2 per screen
/// - Repeating animation: ≤ 3 per screen
/// - Glass effects: ≤ 8 per screen
enum AnimationBudget {

    /// Maximum simultaneous spring/keyframe animations per screen.
    static let maxSpringAnimations = 5
    /// Maximum simultaneous phase animators per screen.
    static let maxPhaseAnimators = 2
    /// Maximum simultaneous repeating animations per screen.
    static let maxRepeatingAnimations = 3
    /// Maximum glass effects rendered in a single screen.
    static let maxGlassEffects = 8
}

// MARK: - Reduce Motion View Modifier

/// View modifier that conditionally disables animation when Reduce Motion is on.
///
/// Usage:
/// ```swift
/// myView.motionAware(.spring(response: 0.3)) { value in
///     $0.offset(y: value ? 0 : 20)
/// }
/// ```
struct MotionAwareModifier: ViewModifier {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    let animation: Animation

    func body(content: Content) -> some View {
        content.animation(reduceMotion ? nil : animation, value: reduceMotion)
    }
}

extension View {
    /// Applies the given animation only when Reduce Motion is off.
    ///
    /// - Parameter animation: The animation to apply conditionally.
    /// - Returns: A view with motion-aware animation.
    func motionAware(_ animation: Animation) -> some View {
        modifier(MotionAwareModifier(animation: animation))
    }
}
