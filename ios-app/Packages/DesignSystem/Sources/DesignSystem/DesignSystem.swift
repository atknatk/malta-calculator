//
//  DesignSystem.swift
//  MaltaCalculator
//

import SwiftUI
#if canImport(UIKit)
import UIKit
#endif
#if canImport(AppKit)
import AppKit
#endif

/// Top-level namespace for the Malta Calculator design system.
///
/// The DesignSystem package provides:
/// - **Tokens**: Colors (`DSColor`), gradients (`DSGradient`), typography (`DSFont`),
///   spacing (`DSSpacing`), radii (`DSRadius`), shadows (`DSShadow`), motion (`DSMotion`).
/// - **Extensions**: `liquidGlass()`, `shimmer()`, `reveal()`, `dsHaptic()`.
/// - **Materials**: `MeshBackground`, `FloatingOrbs`, `GradientText`, `AnimatedMesh`.
/// - **Controls**: `DSButton`, `DSCard`, `DSCurrencyField`, `DSNumericField`,
///   `DSPercentField`, `DSSliderField`, `DSToggleGroup`, `DSStepper`,
///   `DSAnimatedNumber`, `DSChip`, `DSBadge`, `DSSearchField`, `DSSectionHeader`,
///   `DSSegmentedPicker`, `DSDatePickerCard`, `DSEmptyState`, `DSSection`.
/// - **Charts**: `DSBreakdownChart`, `DSAmortizationChart`, `DSComparisonBar`, `DSLineChart`.
/// - **Previews**: `ComponentGallery`, `TokensGallery`.
public enum DesignSystem {
    /// Semantic version of the design system bundle, surfaced for diagnostics.
    public static let version: String = "0.2.0"
}
