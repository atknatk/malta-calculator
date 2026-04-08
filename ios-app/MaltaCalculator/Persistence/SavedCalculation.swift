//
//  SavedCalculation.swift
//  MaltaCalculator
//

import Foundation
import SwiftData

/// Persisted snapshot of a user's calculation, regardless of calculator type.
///
/// The raw inputs are serialised as JSON in ``inputsJSON`` so each
/// calculator can round-trip its own typed payload without the shared
/// persistence schema needing to know the field set.
@Model
final class SavedCalculation {
    /// Stable identifier.
    var id: UUID
    /// The ``CalculatorID`` rawValue this entry belongs to.
    var calculatorID: String
    /// User-facing title, e.g. "Salary 2026 — €30,000".
    var title: String
    /// Creation timestamp.
    var createdAt: Date
    /// Last modification timestamp (updated on pin, notes edit, etc).
    var updatedAt: Date
    /// JSON-encoded inputs — typed per calculator, decoded on demand.
    var inputsJSON: Data
    /// Short summary line shown in history lists.
    var summary: String
    /// Whether the entry is pinned to the top of the history list.
    var pinned: Bool
    /// Comma-separated user-supplied tags. A CSV string is used instead
    /// of `[String]` to sidestep SwiftData's transformable requirement
    /// on array attributes while keeping the public API typed via
    /// ``tags``.
    var tagsCSV: String
    /// Optional user-supplied notes.
    var notes: String?

    init(
        id: UUID = UUID(),
        calculatorID: String,
        title: String,
        inputsJSON: Data,
        summary: String,
        pinned: Bool = false,
        tags: [String] = [],
        notes: String? = nil
    ) {
        self.id = id
        self.calculatorID = calculatorID
        self.title = title
        self.createdAt = .now
        self.updatedAt = .now
        self.inputsJSON = inputsJSON
        self.summary = summary
        self.pinned = pinned
        self.tagsCSV = tags.joined(separator: ",")
        self.notes = notes
    }

    /// Typed view over ``tagsCSV`` — reads split on comma, writes join.
    @Transient var tags: [String] {
        get {
            guard !tagsCSV.isEmpty else { return [] }
            return tagsCSV.split(separator: ",").map(String.init)
        }
        set { tagsCSV = newValue.joined(separator: ",") }
    }
}
