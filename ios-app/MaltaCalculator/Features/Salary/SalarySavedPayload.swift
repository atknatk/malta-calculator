//
//  SalarySavedPayload.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation

/// Serialisable snapshot of all salary inputs, used for ``SalaryHistoryStore``
/// entries, share content, and `@AppStorage` state restoration.
struct SalarySavedPayload: Codable, Equatable, Sendable {
    /// Annual gross wage in euros.
    let grossAnnual: Decimal
    /// Tax year (2020 … 2026).
    let year: Int
    /// Simplified tax type (single, married, parent).
    let simpleTaxType: SimpleTaxType
    /// Number of dependent children (2026+).
    let childCount: Int
    /// SSC category (A/B/C/D).
    let sscCategory: SSCCategory
    /// Employee date of birth (used for SSC pre-1962 branch).
    let birthDate: Date
    /// Yearly non-taxable benefits.
    let yearlyNonTaxBenefit: Decimal
    /// Yearly taxable benefits.
    let yearlyTaxableBenefit: Decimal
    /// Whether COLA is automatically applied.
    let enableCOLA: Bool
}
