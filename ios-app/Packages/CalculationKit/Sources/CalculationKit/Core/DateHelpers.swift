import Foundation

/// Date utility functions for payroll calculations.
public enum DateHelpers: Sendable {
    /// Returns the number of Mondays in the given month (used for weekly SSC calculation).
    public static func mondaysInMonth(year: Int, monthIndex: Int) -> Int {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: "Europe/Malta") ?? .current
        guard let date = calendar.date(from: DateComponents(year: year, month: monthIndex + 1, day: 1)),
              let range = calendar.range(of: .day, in: .month, for: date)
        else { return 4 }

        var count = 0
        for day in range {
            let components = DateComponents(year: year, month: monthIndex + 1, day: day)
            if let d = calendar.date(from: components), calendar.component(.weekday, from: d) == 2 {
                count += 1
            }
        }
        return count
    }

    /// Returns the number of weeks (Mondays) for the given month.
    public static func weeksForMonth(year: Int, month: Month) -> Int {
        mondaysInMonth(year: year, monthIndex: month.index)
    }

    /// Returns a dictionary mapping each month to its Monday count for the year.
    public static func weeksPerMonthForYear(_ year: Int) -> [Month: Int] {
        var result: [Month: Int] = [:]
        for month in Month.allCases {
            result[month] = weeksForMonth(year: year, month: month)
        }
        return result
    }

    /// Whether a birth date falls before 1 January 1962.
    public static func isBornBefore1962(_ date: Date) -> Bool {
        let calendar = Calendar(identifier: .gregorian)
        let year = calendar.component(.year, from: date)
        return year < 1962
    }
}
