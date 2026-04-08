//
//  SalaryInsights.swift
//  MaltaCalculator
//

import Foundation
import CalculationKit

/// Generates human-readable insight bullets from a salary summary.
struct SalaryInsights {
    /// The annual salary summary.
    let summary: SalarySummary
    /// The selected tax year.
    let year: Int
    /// The selected tax type.
    let simpleTaxType: SimpleTaxType

    /// An array of insight strings for display.
    var bullets: [String] {
        var items: [String] = []

        // Effective rate
        let ratePercent = summary.effectiveTaxRate * 100
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 1
        formatter.minimumFractionDigits = 1
        let rateStr = formatter.string(from: ratePercent as NSDecimalNumber) ?? "—"
        items.append(String(
            localized: "salary.insights.effectiveRate \(rateStr)"
        ))

        // Payday estimate
        items.append(String(
            localized: "salary.insights.paydayEstimate \(summary.averageMonthlyNet.eur)"
        ))

        // 2026 child hint
        if year == 2026 && simpleTaxType != .single {
            items.append(String(localized: "salary.insights.childTaxHint"))
        }

        // Pension hint
        items.append(String(localized: "salary.insights.pensionHint"))

        return items
    }
}
