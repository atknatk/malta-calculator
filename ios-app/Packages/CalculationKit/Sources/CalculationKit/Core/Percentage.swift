import Foundation

/// Percentage type: a Decimal value between 0 and 1 (e.g. 0.25 = 25%).
public typealias Percentage = Decimal

public extension Percentage {
    /// Converts a 0–100 point value to a 0–1 fraction.
    static func fromPoints(_ points: Decimal) -> Percentage {
        points / 100
    }

    /// Converts a 0–1 fraction to 0–100 points.
    var points: Decimal {
        self * 100
    }
}
