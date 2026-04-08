import Foundation
import Testing
@testable import CalculationKit

// MARK: - Money Tolerance Comparison

/// Approximate equality operator for money values in tests.
/// Uses ±€0.01 tolerance by default (Malta tax compliance threshold).
public func assertMoneyEqual(
    _ actual: Money,
    _ expected: Money,
    tolerance: Money = Decimal(string: "0.01") ?? 0,
    label: String = "",
    sourceLocation: SourceLocation = #_sourceLocation
) {
    let diff = abs(actual - expected)
    #expect(
        diff <= tolerance,
        "\(label.isEmpty ? "" : "\(label): ")actual=\(actual) expected=\(expected) diff=\(diff)",
        sourceLocation: sourceLocation
    )
}

/// Approximate equality operator for percentage values in tests.
/// Uses ±0.0001 tolerance by default.
public func assertPercentEqual(
    _ actual: Decimal,
    _ expected: Decimal,
    tolerance: Decimal = Decimal(string: "0.0001") ?? 0,
    label: String = "",
    sourceLocation: SourceLocation = #_sourceLocation
) {
    let diff = abs(actual - expected)
    #expect(
        diff <= tolerance,
        "\(label.isEmpty ? "" : "\(label): ")actual=\(actual) expected=\(expected) diff=\(diff)",
        sourceLocation: sourceLocation
    )
}

// MARK: - Decimal Approximate Equality Infix

infix operator ≈: ComparisonPrecedence

public extension Decimal {
    /// Returns true if the two values are within ±€0.01.
    static func ≈(lhs: Decimal, rhs: Decimal) -> Bool {
        abs(lhs - rhs) <= Decimal(string: "0.01")!
    }
}

// MARK: - Money Formatting for Test Output

extension Decimal {
    /// Human-readable money string for test assertions.
    var testDescription: String {
        "€\(self)"
    }
}
