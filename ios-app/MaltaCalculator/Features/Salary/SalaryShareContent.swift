//
//  SalaryShareContent.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation

/// Immutable payload used by the Salary share sheet and PDF/PNG exports.
///
/// The struct never carries personally identifying information (see
/// failure pattern S-02) — only the numeric breakdown that the user has
/// explicitly asked to share.
struct SalaryShareContent: Equatable, Sendable {
    /// The calculation year.
    let year: Int
    /// Annual gross income.
    let annualGross: Decimal
    /// Annual net income.
    let annualNet: Decimal
    /// Annual Social Security Contribution.
    let annualSSC: Decimal
    /// Annual income tax.
    let annualIncomeTax: Decimal
    /// Average monthly net income.
    let monthlyNet: Decimal
    /// Effective combined tax rate (SSC + income tax as a fraction of gross).
    let effectiveTaxRate: Decimal
}
