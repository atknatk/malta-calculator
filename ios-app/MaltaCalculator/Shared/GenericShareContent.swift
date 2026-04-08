//
//  GenericShareContent.swift
//  MaltaCalculator
//

import Foundation

/// Immutable, PII-free payload describing a calculator result for export.
///
/// Used by ``GenericShareRenderer`` and ``CalculatorShareSheet`` to render
/// the same content into PNG, PDF, and plain text. Contains only the
/// numeric breakdown the user has explicitly chosen to share — never names,
/// emails, or other personally-identifying information (failure pattern S-02).
struct GenericShareContent: Equatable, Sendable {
    /// One key/value row inside the breakdown table.
    struct Row: Equatable, Sendable {
        /// Localized label (e.g. "Loan Amount").
        let label: String
        /// Pre-formatted display value (e.g. "€240,000").
        let value: String
    }

    /// File-name-safe identifier (e.g. `"Mortgage"`). Used in cache file names.
    let id: String
    /// Localized calculator title (e.g. "Malta Mortgage").
    let title: String
    /// SF Symbol shown in the share card hero.
    let symbolName: String
    /// Localized hero label (e.g. "MONTHLY PAYMENT").
    let heroLabel: String
    /// Pre-formatted hero value (e.g. "€1,336.76").
    let heroValue: String
    /// Optional secondary hero context (e.g. "€300,000 property").
    let subtitle: String?
    /// Breakdown rows shown beneath the hero figure.
    let rows: [Row]
}
