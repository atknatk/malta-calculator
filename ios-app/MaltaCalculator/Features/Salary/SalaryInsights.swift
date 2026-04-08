//
//  SalaryInsights.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation

/// Generates the "What this means for you" bullet list shown under the
/// Salary screen's monthly breakdown.
///
/// Kept pure and synchronous so it can be reused in snapshot tests and
/// share-card rendering without depending on UI state.
struct SalaryInsights: Equatable, Sendable {
    /// Annual summary from ``SalaryCalculator``.
    let summary: SalarySummary
    /// Tax year the summary applies to.
    let year: Int
    /// Simplified tax type (single / married / parent).
    let simpleTaxType: SimpleTaxType

    /// Human-readable insight bullets.
    var bullets: [String] {
        var items: [String] = []

        let percent = NumberFormatter()
        percent.numberStyle = .percent
        percent.minimumFractionDigits = 0
        percent.maximumFractionDigits = 1
        let rate = percent.string(
            from: summary.effectiveTaxRate as NSDecimalNumber
        ) ?? "—"
        items.append(
            "Your effective tax rate is \(rate)."
        )

        let monthlyEur = summary.averageMonthlyNet.eur
        items.append(
            "Expect approximately \(monthlyEur) each month after deductions."
        )

        if year == 2026 && simpleTaxType != .single {
            items.append(String(
                localized: "salary.insight.childBracket",
                defaultValue: "Tip: Claiming the child tax bracket in 2026 can reduce your tax by up to €3,000/year."
            ))
        }

        items.append(String(
            localized: "salary.insight.privatePension",
            defaultValue: "Consider a private pension contribution (up to €3,000/year) to claim a 25% tax credit."
        ))

        return items
    }
}
