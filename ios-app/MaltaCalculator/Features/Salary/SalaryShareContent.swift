//
//  SalaryShareContent.swift
//  MaltaCalculator
//

import Foundation
import CalculationKit

/// Holds the data needed to generate a shareable salary summary.
struct SalaryShareContent: Sendable {
    /// Tax year.
    let year: Int
    /// Annual gross income.
    let annualGross: Decimal
    /// Annual net income.
    let annualNet: Decimal
    /// Annual SSC paid.
    let annualSSC: Decimal
    /// Annual income tax paid.
    let annualIncomeTax: Decimal
    /// Average monthly net pay.
    let monthlyNet: Decimal
    /// Effective combined tax rate.
    let effectiveTaxRate: Decimal

    /// Plain-text summary for sharing.
    var shareText: String {
        let ratePercent = (effectiveTaxRate * 100)
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 1
        let rateStr = formatter.string(from: ratePercent as NSDecimalNumber) ?? "—"

        return """
        Malta Salary Calculator \(year)

        Annual Gross: \(annualGross.eur)
        Annual Net: \(annualNet.eur)
        Income Tax: \(annualIncomeTax.eur)
        SSC: \(annualSSC.eur)
        Monthly Net: \(monthlyNet.eur)
        Effective Rate: \(rateStr)%

        Calculated with Malta Calculator
        """
    }
}
