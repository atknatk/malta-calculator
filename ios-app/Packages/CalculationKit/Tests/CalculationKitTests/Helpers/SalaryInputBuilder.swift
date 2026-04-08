import Foundation
@testable import CalculationKit

/// Fluent builder for salary test inputs.
///
/// Usage:
/// ```swift
/// let (inputs, config) = SalaryInputBuilder()
///     .with(\.grossAnnual, 50_000)
///     .with(\.simpleTaxType, .married)
///     .with(\.childCount, 2)
///     .build()
/// ```
struct SalaryInputBuilder {
    var grossAnnual: Decimal = 25_000
    var year: Int = 2026
    var simpleTaxType: SimpleTaxType = .single
    var childCount: Int = 0
    var sscCategory: SSCCategory = .c
    var birthDate: Date = DateComponents(
        calendar: Calendar(identifier: .gregorian),
        year: 1990, month: 1, day: 1
    ).date ?? Date()
    var yearlyNonTaxBenefit: Decimal = 0
    var yearlyTaxableBenefit: Decimal = 0
    var monthlyBonus: Decimal = 0
    var enableCOLA: Bool = true

    /// Fluent setter for any property.
    func with<V>(_ keyPath: WritableKeyPath<SalaryInputBuilder, V>, _ value: V) -> SalaryInputBuilder {
        var copy = self
        copy[keyPath: keyPath] = value
        return copy
    }

    /// Builds monthly inputs (12 months, equal gross) and a config.
    func build() -> ([SalaryInput], SalaryCalculatorConfig) {
        let monthlyGross = grossAnnual / 12
        let inputs = Month.allCases.map { month in
            SalaryInput(
                month: month,
                grossWage: monthlyGross,
                bonus: 0,
                governmentBonus: 0,
                allowanceBonus: 0
            )
        }
        let config = SalaryCalculatorConfig(
            year: year,
            simpleTaxType: simpleTaxType,
            childCount: childCount,
            sscCategory: sscCategory,
            birthDate: birthDate,
            yearlyNonTaxBenefit: yearlyNonTaxBenefit,
            yearlyTaxableBenefit: yearlyTaxableBenefit,
            monthlyBonus: monthlyBonus,
            enableCOLA: enableCOLA
        )
        return (inputs, config)
    }

    /// Builds with a pre-1962 birth date (for SSC old-rate testing).
    func withPre1962BirthDate() -> SalaryInputBuilder {
        with(\.birthDate, DateComponents(
            calendar: Calendar(identifier: .gregorian),
            year: 1960, month: 6, day: 15
        ).date ?? Date())
    }

    /// Builds with SSC category B (part-time).
    func asPartTimeB() -> SalaryInputBuilder {
        with(\.sscCategory, .b)
    }

    /// Builds with SSC category A (pensioner).
    func asPensioner() -> SalaryInputBuilder {
        with(\.sscCategory, .a).withPre1962BirthDate()
    }
}
