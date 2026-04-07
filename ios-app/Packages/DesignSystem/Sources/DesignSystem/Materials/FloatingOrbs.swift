//
//  FloatingOrbs.swift
//  DesignSystem
//

import SwiftUI

/// Animated floating orb blurs that replicate the web's `.orb-gold / .orb-blue / .orb-coral`.
///
/// Respects Reduce Motion — orbs are static when the preference is enabled.
public struct FloatingOrbs: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    let configuration: OrbConfiguration
    @State private var phase: OrbPhase = .start

    /// Creates a floating orbs background.
    /// - Parameter configuration: Orb layout and colors. Defaults to `.default`.
    public init(_ configuration: OrbConfiguration = .default) {
        self.configuration = configuration
    }

    public var body: some View {
        ZStack {
            ForEach(configuration.orbs.indices, id: \.self) { index in
                let orb = configuration.orbs[index]
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [orb.color.opacity(0.4), .clear],
                            center: .center, startRadius: 0, endRadius: orb.radius
                        )
                    )
                    .frame(width: orb.radius * 2, height: orb.radius * 2)
                    .blur(radius: 60)
                    .offset(offsetForOrb(at: index))
                    .opacity(phase.opacity)
            }
        }
        .allowsHitTesting(false)
        .accessibilityHidden(true)
        .onAppear {
            guard !reduceMotion else { return }
            startAnimation()
        }
    }

    private func offsetForOrb(at index: Int) -> CGSize {
        guard index < configuration.orbs.count else { return .zero }
        let orb = configuration.orbs[index]
        switch phase {
        case .start: return orb.startOffset
        case .end: return orb.endOffset
        }
    }

    private func startAnimation() {
        withAnimation(.easeInOut(duration: 15).repeatForever(autoreverses: true)) {
            phase = .end
        }
    }
}

/// Configuration for the floating orbs layout.
public struct OrbConfiguration: Sendable {
    /// Individual orb definitions.
    public let orbs: [Orb]

    /// A single orb definition.
    public struct Orb: Sendable {
        /// Orb color.
        public let color: Color
        /// Orb radius (half the frame size).
        public let radius: CGFloat
        /// Starting offset position.
        public let startOffset: CGSize
        /// Ending offset position (animation target).
        public let endOffset: CGSize

        /// Creates an orb definition.
        public init(color: Color, radius: CGFloat, startOffset: CGSize, endOffset: CGSize) {
            self.color = color
            self.radius = radius
            self.startOffset = startOffset
            self.endOffset = endOffset
        }
    }

    /// Creates an orb configuration.
    public init(orbs: [Orb]) {
        self.orbs = orbs
    }

    /// Default orb layout: gold top-left, blue right, red bottom.
    public static let `default` = OrbConfiguration(orbs: [
        .init(color: DSColor.maltaGold, radius: 150,
              startOffset: .init(width: -100, height: -200),
              endOffset: .init(width: 80, height: -150)),
        .init(color: DSColor.mediterraneanBlue, radius: 130,
              startOffset: .init(width: 120, height: 0),
              endOffset: .init(width: -60, height: 120)),
        .init(color: DSColor.maltaRed, radius: 110,
              startOffset: .init(width: 0, height: 200),
              endOffset: .init(width: 100, height: -80)),
    ])
}

/// Animation phase for orb position and opacity.
enum OrbPhase {
    case start, end

    var opacity: Double {
        switch self {
        case .start: return 0.6
        case .end: return 0.8
        }
    }
}
