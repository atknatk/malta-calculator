//
//  DSSkeleton.swift
//  DesignSystem
//

import SwiftUI

/// A shimmer-animated skeleton loading placeholder.
///
/// Renders a rounded rectangle with a shimmer animation to indicate
/// content is loading. Respects `accessibilityReduceMotion`.
public struct DSSkeleton: View {
    let width: CGFloat?
    let height: CGFloat

    @State private var shimmerOffset: CGFloat = -1
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    /// Creates a skeleton placeholder.
    /// - Parameters:
    ///   - width: Width of the placeholder. Nil for full width.
    ///   - height: Height of the placeholder.
    public init(width: CGFloat? = nil, height: CGFloat = 20) {
        self.width = width
        self.height = height
    }

    public var body: some View {
        RoundedRectangle(cornerRadius: DSRadius.sm)
            .fill(DSColor.surface)
            .frame(width: width, height: height)
            .overlay(
                Group {
                    if !reduceMotion {
                        LinearGradient(
                            colors: [.clear, DSColor.textTertiary.opacity(0.15), .clear],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                        .offset(x: shimmerOffset * 200)
                        .onAppear {
                            withAnimation(
                                .linear(duration: 1.5)
                                .repeatForever(autoreverses: false)
                            ) {
                                shimmerOffset = 1
                            }
                        }
                    }
                }
            )
            .clipShape(RoundedRectangle(cornerRadius: DSRadius.sm))
            .accessibilityLabel(String(localized: "loading", bundle: .module))
    }
}

/// A skeleton card mimicking a content card during loading.
///
/// Shows multiple skeleton lines in a card layout for feature screens.
public struct DSSkeletonCard: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    public init() {}

    public var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            DSSkeleton(width: 120, height: 14)
            DSSkeleton(height: 32)
            HStack(spacing: DSSpacing.sm) {
                DSSkeleton(height: 16)
                DSSkeleton(height: 16)
            }
            DSSkeleton(width: 180, height: 14)
        }
        .padding(DSSpacing.lg)
        .background(DSColor.surface.opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: DSRadius.lg))
    }
}

/// A skeleton loading view with multiple cards for feature screens.
public struct DSSkeletonList: View {
    let cardCount: Int

    /// Creates a skeleton list.
    /// - Parameter cardCount: Number of skeleton cards to show. Defaults to 3.
    public init(cardCount: Int = 3) {
        self.cardCount = cardCount
    }

    public var body: some View {
        VStack(spacing: DSSpacing.md) {
            ForEach(0..<cardCount, id: \.self) { _ in
                DSSkeletonCard()
            }
        }
        .padding(.horizontal, DSSpacing.md)
    }
}
