//
//  CalculationKit.swift
//  MaltaCalculator
//

import Foundation

/// Decimal-only money type used across every Malta Calculator motor.
///
/// `Float` and `Double` are intentionally banned for monetary values because
/// floating-point cannot represent decimal cents exactly. Any rounding error
/// snowballs across cumulative monthly tax calculations and ships wrong
/// numbers to users (see failure pattern F-01).
public typealias Money = Decimal

/// Top-level namespace and version marker for the `CalculationKit` package.
///
/// The package itself contains pure, side-effect free calculation motors
/// (salary, mortgage, stamp duty, …) that mirror the TypeScript utilities
/// under `src/utils/` of the web app. Tasks 03 and beyond fill in the
/// individual motors. Task 01 only sets up the package skeleton so the
/// app target can `import CalculationKit` and link successfully.
public enum CalculationKit {
    /// Semantic version of the package, mirrored in the iOS app's bundle
    /// version metadata for diagnostics.
    public static let version: String = "0.1.0"
}
