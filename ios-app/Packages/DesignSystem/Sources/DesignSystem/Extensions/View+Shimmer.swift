//
//  View+Shimmer.swift
//  DesignSystem
//

import SwiftUI

public extension View {
    /// Applies a loading shimmer overlay.
    /// - Parameter active: Whether the shimmer animation is active. Defaults to `true`.
    /// - Returns: A view with a shimmer overlay when active.
    func shimmer(active: Bool = true) -> some View {
        self.modifier(ShimmerModifier(active: active))
    }
}

/// Animates a diagonal light sweep across the view as a loading indicator.
struct ShimmerModifier: ViewModifier {
    let active: Bool
    @State private var phase: CGFloat = -1
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    func body(content: Content) -> some View {
        content.overlay(
            LinearGradient(
                stops: [
                    .init(color: .clear, location: 0),
                    .init(color: .white.opacity(0.3), location: 0.5),
                    .init(color: .clear, location: 1),
                ],
                startPoint: .leading, endPoint: .trailing
            )
            .rotationEffect(.degrees(30))
            .offset(x: phase * 300)
            .blendMode(.plusLighter)
            .opacity(active && !reduceMotion ? 1 : 0)
            .allowsHitTesting(false)
        )
        .clipShape(Rectangle())
        .onAppear {
            guard active, !reduceMotion else { return }
            withAnimation(.linear(duration: 2).repeatForever(autoreverses: false)) {
                phase = 1
            }
        }
    }
}
