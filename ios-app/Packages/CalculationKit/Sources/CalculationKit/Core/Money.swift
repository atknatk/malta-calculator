import Foundation

/// Decimal-only money type used across every Malta Calculator motor.
///
/// `Float` and `Double` are intentionally banned for monetary values because
/// floating-point cannot represent decimal cents exactly. Any rounding error
/// snowballs across cumulative monthly tax calculations and ships wrong
/// numbers to users (see failure pattern F-01).
public typealias Money = Decimal

public extension Decimal {
    /// Bankers' rounding (round half to even) to the specified number of decimal places.
    func rounded(to places: Int = 2) -> Decimal {
        var source = self
        var result = Decimal.zero
        NSDecimalRound(&result, &source, places, .bankers)
        return result
    }

    /// Clamps negative values to zero.
    var nonNegative: Decimal {
        Swift.max(0, self)
    }

    /// EUR currency format (thousands separator, 2 decimal places).
    var eur: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        formatter.maximumFractionDigits = 2
        formatter.minimumFractionDigits = 0
        return formatter.string(from: self as NSDecimalNumber) ?? "—"
    }

    /// Converts Decimal to Double — **only for UI/chart rendering, never for calculation**.
    var doubleValue: Double {
        (self as NSDecimalNumber).doubleValue
    }

    /// Percentage application: `self * (percent / 100)`.
    func applying(percent: Decimal) -> Decimal {
        self * percent / 100
    }

    /// Returns self if positive, otherwise the fallback value.
    func orElse(_ fallback: Decimal) -> Decimal {
        self > 0 ? self : fallback
    }
}

public extension Int {
    /// Converts an integer to `Money` (Decimal).
    var money: Money { Decimal(self) }
}

public extension Double {
    /// Converts a Double literal to `Money` — **only use in test fixtures and config loaders**.
    var money: Money { Decimal(self) }
}
