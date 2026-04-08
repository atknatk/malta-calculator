//
//  AnimatedMesh.swift
//  DesignSystem
//

import SwiftUI

/// An animated mesh gradient that subtly shifts colors over time.
///
/// Uses `TimelineView` to drive phase shifts. Falls back to a static
/// `MeshGradient` when Reduce Motion is enabled.
@available(iOS 18.0, macOS 15.0, *)
public struct AnimatedMesh: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var phase: CGFloat = 0

    /// Creates an animated mesh gradient.
    public init() {}

    public var body: some View {
        if reduceMotion {
            staticMesh
        } else {
            TimelineView(.animation) { context in
                let elapsed = context.date.timeIntervalSinceReferenceDate
                let slowPhase = CGFloat(elapsed.truncatingRemainder(dividingBy: 20)) / 20
                meshForPhase(slowPhase)
            }
        }
    }

    private var staticMesh: some View {
        meshForPhase(0)
    }

    private func meshForPhase(_ phase: CGFloat) -> some View {
        let offset = sin(phase * .pi * 2) * 0.05
        return MeshGradient(
            width: 3, height: 3,
            points: [
                [0, 0], [Float(0.5 + offset), 0], [1, 0],
                [0, 0.5], [Float(0.5 - offset), Float(0.5 + offset)], [1, 0.5],
                [0, 1], [Float(0.5 + offset), 1], [1, 1],
            ],
            colors: [
                DSColor.maltaGold.opacity(0.15),
                DSColor.background,
                DSColor.mediterraneanBlue.opacity(0.12),
                DSColor.background,
                DSColor.warmSand.opacity(0.1),
                DSColor.background,
                DSColor.maltaRed.opacity(0.08),
                DSColor.background,
                DSColor.mediterraneanBlue.opacity(0.08),
            ]
        )
    }
}
