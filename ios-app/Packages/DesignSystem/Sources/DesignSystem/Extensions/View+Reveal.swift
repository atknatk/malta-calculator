//
//  View+Reveal.swift
//  DesignSystem
//

import SwiftUI

public extension View {
    /// Applies a scroll-reveal animation (fade-in from below).
    ///
    /// Collapses to instant appearance when Reduce Motion is enabled.
    /// - Parameter delay: Animation delay in seconds. Defaults to `0`.
    /// - Returns: A view that reveals itself when it appears.
    func reveal(delay: Double = 0) -> some View {
        self.modifier(RevealModifier(delay: delay))
    }
}

/// Animates a fade-in + slide-up effect on appear.
struct RevealModifier: ViewModifier {
    let delay: Double
    @State private var isVisible = false
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func body(content: Content) -> some View {
        content
            .opacity(isVisible ? 1 : 0)
            .offset(y: isVisible ? 0 : 16)
            .onAppear {
                if reduceMotion {
                    isVisible = true
                } else {
                    withAnimation(DSMotion.standard.delay(delay)) {
                        isVisible = true
                    }
                }
            }
    }
}
