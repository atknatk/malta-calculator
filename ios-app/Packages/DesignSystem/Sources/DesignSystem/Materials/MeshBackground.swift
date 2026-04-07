//
//  MeshBackground.swift
//  DesignSystem
//

import SwiftUI

/// Full-screen mesh gradient background matching the web app's gradient-mesh.
///
/// Uses `MeshGradient` on iOS 18+ and falls back to layered `RadialGradient`
/// on older systems. Collapses to solid `DSColor.background` when
/// Reduce Transparency is enabled.
public struct MeshBackground: View {
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @Environment(\.colorScheme) private var colorScheme

    /// Creates a mesh background view.
    public init() {}

    public var body: some View {
        if reduceTransparency {
            DSColor.background
                .ignoresSafeArea()
        } else if #available(iOS 18.0, macOS 15.0, *) {
            mesh.ignoresSafeArea()
        } else {
            fallback.ignoresSafeArea()
        }
    }

    @available(iOS 18.0, macOS 15.0, *)
    private var mesh: some View {
        MeshGradient(
            width: 3, height: 3,
            points: [
                [0, 0], [0.5, 0], [1, 0],
                [0, 0.5], [0.5, 0.5], [1, 0.5],
                [0, 1], [0.5, 1], [1, 1],
            ],
            colors: colorScheme == .dark ? darkPalette : lightPalette
        )
    }

    private var fallback: some View {
        ZStack {
            DSColor.background
            RadialGradient(
                colors: [DSColor.maltaGold.opacity(0.15), .clear],
                center: .topLeading, startRadius: 20, endRadius: 400
            )
            RadialGradient(
                colors: [DSColor.mediterraneanBlue.opacity(0.12), .clear],
                center: .topTrailing, startRadius: 20, endRadius: 400
            )
            RadialGradient(
                colors: [Color(hex: "#FFB070").opacity(0.10), .clear],
                center: .bottomTrailing, startRadius: 20, endRadius: 400
            )
            RadialGradient(
                colors: [DSColor.maltaRed.opacity(0.08), .clear],
                center: .bottomLeading, startRadius: 20, endRadius: 400
            )
        }
    }

    private var lightPalette: [Color] {
        [
            Color(hex: "#FBF9F4"), Color(hex: "#FBF9F4"), Color(hex: "#F7ECD6"),
            Color(hex: "#FBF9F4"), Color(hex: "#FFFFFF"), Color(hex: "#E8F5FA"),
            Color(hex: "#FFECD2"), Color(hex: "#FBF9F4"), Color(hex: "#E8F5FA"),
        ]
    }

    private var darkPalette: [Color] {
        [
            Color(hex: "#0F1114"), Color(hex: "#14171C"), Color(hex: "#1A1814"),
            Color(hex: "#14171C"), Color(hex: "#0F1114"), Color(hex: "#0E2630"),
            Color(hex: "#1A1814"), Color(hex: "#14171C"), Color(hex: "#0E2630"),
        ]
    }
}
