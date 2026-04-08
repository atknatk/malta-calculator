import Foundation

/// Input for the Malta vacation leave calculator.
public struct VacationInput: Sendable, Equatable {
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

extension VacationInput: Codable {
    private enum CodingKeys: String, CodingKey {
        case weeklyHours, year, monthsWorked
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        weeklyHours = try container.decode(Decimal.self, forKey: .weeklyHours)
        year = try container.decode(Int.self, forKey: .year)
        monthsWorked = try container.decodeIfPresent(Int.self, forKey: .monthsWorked) ?? 12
    }
}
