//
//  CalculatorUsage.swift
//  MaltaCalculator
//

import Foundation
import SwiftData

/// Tracks how often and when each calculator has been opened.
///
/// Used to drive the "Recently used" strip on the Calculators Hub once
/// Task 07's lightweight UserDefaults store is migrated to SwiftData.
@Model
final class CalculatorUsage {
    /// ``CalculatorID`` raw value — acts as the primary key.
    @Attribute(.unique) var id: String
    /// Wall-clock time the calculator was last opened.
    var lastUsedAt: Date
    /// Total number of times the user has opened this calculator.
    var count: Int

    init(id: String, lastUsedAt: Date = .now, count: Int = 0) {
        self.id = id
        self.lastUsedAt = lastUsedAt
        self.count = count
    }
}
