//
//  CalculatorCatalogItem.swift
//  MaltaCalculator
//

import Foundation

/// Catalog entry describing a single calculator rendered on the Hub.
///
/// The catalog is derived from ``CalculatorID`` so the enum remains the
/// single source of truth; the struct adds display metadata (title, subtitle,
/// category, availability) in a form that is convenient for filtering and
/// snapshot testing.
struct CalculatorCatalogItem: Identifiable, Hashable, Sendable {
    let id: CalculatorID
    let title: String
    let subtitle: String
    let category: CalculatorCategory
    let symbolName: String
    let available: Bool

    init(id: CalculatorID) {
        self.id = id
        self.title = id.displayName
        self.subtitle = id.subtitle
        self.category = id.category
        self.symbolName = id.systemImage
        self.available = id.isAvailable
    }
}

extension CalculatorCatalogItem {
    /// Full catalog built from every ``CalculatorID`` case in declaration order.
    static let all: [CalculatorCatalogItem] = CalculatorID.allCases.map(CalculatorCatalogItem.init(id:))
}
