import Foundation

/// Input for the Malta vacation leave calculator.
public struct VacationInput: Sendable, Codable, Equatable {
    /// Weekly working hours (e.g. 40 for full-time, 20 for part-time).
    public var weeklyHours: Decimal
    /// Calendar year to calculate for.
    public var year: Int
    /// Months worked in the year (1--12). Values below 12 trigger pro-rata.
    public var monthsWorked: Int

    /// Creates a new vacation input.
    public init(
        weeklyHours: Decimal,
        year: Int,
        monthsWorked: Int = 12
    ) {
        self.weeklyHours = weeklyHours
        self.year = year
        self.monthsWorked = monthsWorked
    }
}
