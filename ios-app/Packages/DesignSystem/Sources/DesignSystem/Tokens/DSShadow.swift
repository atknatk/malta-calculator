//
//  DSShadow.swift
//  DesignSystem
//

import SwiftUI

/// A named shadow token for catalog and lookup purposes.
public struct ShadowToken: Sendable, Identifiable, Equatable, Hashable {
    /// Unique identifier (same as `name`).
    public var id: String { name }
    /// Token name (e.g. "card").
    public let name: String
    /// The shadow specification.
    public let shadow: DSShadow.Shadow

    /// Creates a named shadow token.
    public init(name: String, shadow: DSShadow.Shadow) {
        self.name = name
        self.shadow = shadow
    }
}

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

    /// No shadow (transparent, zero radius).
    public static let none = Shadow(
        color: Color.clear,
        radius: 0, x: 0, y: 0
    )

    // MARK: - Semantic Aliases

    /// Low shadow — alias for `card`.
    public static let low = card

    /// Medium shadow — alias for `elevated`.
    public static let medium = elevated

    /// High shadow — stronger elevation for prominent elements.
    public static let high = Shadow(
        color: Color.black.opacity(0.16),
        radius: 40, x: 0, y: 16
    )

    /// Glass shadow — alias for `glow`.
    public static let glass = glow

    /// All named shadow tokens (non-none).
    public static let allValues: [Shadow] = [card, elevated, glow, pressed, high]

    /// All named shadow tokens including none.
    public static let allValuesIncludingNone: [Shadow] = [card, elevated, glow, pressed, none]

    // MARK: - Token Catalog

    /// All named shadow tokens for catalog and lookup purposes.
    public static let allTokens: [ShadowToken] = [
        ShadowToken(name: "card", shadow: card),
        ShadowToken(name: "elevated", shadow: elevated),
        ShadowToken(name: "glow", shadow: glow),
        ShadowToken(name: "pressed", shadow: pressed),
        ShadowToken(name: "none", shadow: none),
    ]

    /// Looks up a shadow token by name.
    /// - Parameter name: Token name (e.g. "card").
    /// - Returns: The matching `ShadowToken`, or `nil` if not found.
    public static func token(named name: String) -> ShadowToken? {
        allTokens.first { $0.name == name }
    }

    /// A shadow specification with color, radius, and offset.
    public struct Shadow: Sendable, Equatable, Hashable {
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

        public func hash(into hasher: inout Hasher) {
            hasher.combine(radius)
            hasher.combine(x)
            hasher.combine(y)
        }
    }
}

// MARK: - Elevation

/// Semantic elevation levels that map to shadow tokens.
///
/// Use `dsElevation(_:)` view modifier for a higher-level abstraction over raw shadows.
public enum DSElevation: Int, Sendable, CaseIterable, Comparable {
    /// No elevation — flat on the surface.
    case flat = 0
    /// Slightly raised — standard cards and containers.
    case raised = 1
    /// Floating above content — sheets, popovers.
    case floating = 2
    /// Overlay level — modals, drop-downs, toasts.
    case overlay = 3

    /// The shadow token for this elevation level.
    public var shadow: DSShadow.Shadow {
        switch self {
        case .flat: return DSShadow.none
        case .raised: return DSShadow.card
        case .floating: return DSShadow.elevated
        case .overlay:
            return DSShadow.Shadow(
                color: Color.black.opacity(0.16),
                radius: 40, x: 0, y: 16
            )
        }
    }

    /// Recommended z-index for this elevation level, used for view ordering.
    public var zIndex: Double {
        Double(rawValue)
    }

    public static func < (lhs: DSElevation, rhs: DSElevation) -> Bool {
        lhs.rawValue < rhs.rawValue
    }
}

// MARK: - View Modifiers

public extension View {
    /// Applies a `DSShadow.Shadow` token to the view.
    /// - Parameter shadow: The shadow token to apply.
    /// - Returns: A view with the shadow applied.
    func dsShadow(_ shadow: DSShadow.Shadow) -> some View {
        self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
    }

    /// Applies a semantic elevation level to the view.
    /// - Parameter level: The `DSElevation` level to apply.
    /// - Returns: A view with the elevation shadow and z-index applied.
    func dsElevation(_ level: DSElevation) -> some View {
        self.modifier(DSElevationModifier(level: level))
    }
}

/// Internal modifier implementing semantic elevation with accessibility support.
struct DSElevationModifier: ViewModifier {
    let level: DSElevation

    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    func body(content: Content) -> some View {
        if reduceTransparency {
            content
                .zIndex(level.zIndex)
        } else {
            content
                .dsShadow(level.shadow)
                .zIndex(level.zIndex)
        }
    }
}
