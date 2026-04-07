//
//  DSShadow.swift
//  DesignSystem
//

import SwiftUI

/// Shadow tokens for elevation and depth effects.
public enum DSShadow {

    /// Standard card shadow.
    public static let card = Shadow(
        color: Color.black.opacity(0.08),
        radius: 20, x: 0, y: 8
    )

    /// Elevated surface shadow (sheets, popovers).
    public static let elevated = Shadow(
        color: Color.black.opacity(0.12),
        radius: 32, x: 0, y: 12
    )

    /// Gold glow shadow for highlighted elements.
    public static let glow = Shadow(
        color: Color(hex: "#C97D0A").opacity(0.35),
        radius: 30, x: 0, y: 0
    )

    /// Pressed state shadow (smaller, subtle).
    public static let pressed = Shadow(
        color: Color.black.opacity(0.06),
        radius: 8, x: 0, y: 2
    )

    /// A shadow specification with color, radius, and offset.
    public struct Shadow: Sendable {
        /// Shadow color.
        public let color: Color
        /// Blur radius.
        public let radius: CGFloat
        /// Horizontal offset.
        public let x: CGFloat
        /// Vertical offset.
        public let y: CGFloat

        /// Creates a shadow specification.
        public init(color: Color, radius: CGFloat, x: CGFloat, y: CGFloat) {
            self.color = color
            self.radius = radius
            self.x = x
            self.y = y
        }
    }
}

public extension View {
    /// Applies a `DSShadow.Shadow` token to the view.
    /// - Parameter shadow: The shadow token to apply.
    /// - Returns: A view with the shadow applied.
    func dsShadow(_ shadow: DSShadow.Shadow) -> some View {
        self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
    }
}
