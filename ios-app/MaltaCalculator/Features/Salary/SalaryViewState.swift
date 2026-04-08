//
//  SalaryViewState.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation

/// Screen-level rendering state for the Salary playground.
///
/// Mirrors the four-case convention used across feature screens
/// (`loading` / `empty` / `error` / `content`). The salary screen
/// never produces an `.empty` state because it always recalculates
/// defaults after config load — but the case is retained to match
/// the convention for shared view scaffolding.
enum SalaryViewState: Equatable, Sendable {
    /// Initial state while the bundled tax config is loading.
    case loading
    /// No inputs supplied yet (reserved for share-extension launches).
    case empty
    /// A non-recoverable error occurred while loading config or calculating.
    case error(String)
    /// Calculation succeeded — rendered payload.
    case content(SalaryContent)
}

/// Immutable payload rendered by ``SalaryScreen`` when the view model has
/// a valid calculation result.
struct SalaryContent: Equatable, Sendable {
    /// Per-month breakdown returned by ``SalaryCalculator``.
    let monthly: [SalaryOutput]
    /// Annual summary derived from ``monthly``.
    let summary: SalarySummary
}
