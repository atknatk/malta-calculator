import Foundation

/// Malta Vacation Leave Calculator.
///
/// Computes annual leave entitlement based on weekly hours and adjusts
/// for public holidays that fall on weekends. Pro-rata applies when the
/// employee has not worked a full calendar year.
public struct VacationCalculator: Sendable {

    /// Standard full-time weekly hours.
    private static let standardWeeklyHours: Decimal = 40
    /// Base vacation entitlement for a full-time employee (24 days x 8 h).
    private static let baseVacationHours: Decimal = 192
    /// Working hours in one day.
    private static let hoursPerDay: Decimal = 8

    /// Number of public holidays falling on weekends, keyed by year.
    private static let publicHolidaysOnWeekends: [Int: Int] = [
        2024: 3,
        2025: 2,
        2026: 3,
        2027: 3,
        2028: 2,
        2029: 2,
        2030: 3,
    ]

    /// Creates a new vacation calculator.
    public init() {}

    /// Calculates vacation leave entitlement.
    ///
    /// - Parameter input: A ``VacationInput`` with weekly hours, year, and months worked.
    /// - Returns: A ``VacationOutput`` with the entitlement breakdown.
    public func calculate(input: VacationInput) -> VacationOutput {
        let hoursRatio = input.weeklyHours / Self.standardWeeklyHours

        // Base hours proportional to weekly hours
        let baseHours = (Self.baseVacationHours * hoursRatio).rounded(to: 0)

        // Public holiday additions for the year
        let holidaysOnWeekends = Decimal(Self.publicHolidaysOnWeekends[input.year] ?? 3)
        let publicHolidayHours = (holidaysOnWeekends * Self.hoursPerDay * hoursRatio).rounded(to: 0)

        // Total entitlement
        let totalHours = baseHours + publicHolidayHours
        let totalDays = totalHours / Self.hoursPerDay

        // Pro-rata when not working a full year
        let isProRata = input.monthsWorked < 12
        let proRataHours: Money? = isProRata
            ? (totalHours * Decimal(input.monthsWorked) / 12).rounded(to: 0)
            : nil

        return VacationOutput(
            baseHours: baseHours,
            publicHolidayHours: publicHolidayHours,
            totalHours: totalHours,
            totalDays: totalDays,
            proRataHours: proRataHours,
            isProRata: isProRata
        )
    }
}
