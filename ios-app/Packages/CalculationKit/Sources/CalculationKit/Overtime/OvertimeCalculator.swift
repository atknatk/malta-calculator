import Foundation

/// Malta Overtime Calculator.
///
/// Computes overtime pay based on the Employment and Industrial Relations Act.
/// Multipliers: weekday 1.5x, Sunday/rest day 2.0x, public holiday 2.0x.
public struct OvertimeCalculator: Sendable {

    /// Standard weekly hours used to derive hourly rate from annual salary.
    private static let standardWeeklyHours: Decimal = 40
    /// Weeks per year.
    private static let weeksPerYear: Decimal = 52

    /// Creates a new overtime calculator.
    public init() {}

    /// Calculates overtime pay for the given input.
    ///
    /// When ``OvertimeInput/hourlyRate`` is zero and ``OvertimeInput/annualSalary``
    /// is provided, the hourly rate is derived as `annualSalary / (40 x 52)`.
    ///
    /// - Parameter input: An ``OvertimeInput`` describing the overtime session.
    /// - Returns: An ``OvertimeOutput`` with the pay breakdown.
    public func calculate(input: OvertimeInput) -> OvertimeOutput {
        var baseHourlyRate = input.hourlyRate

        // Derive hourly rate from annual salary when needed
        if let annualSalary = input.annualSalary,
           annualSalary > 0,
           baseHourlyRate <= 0 {
            baseHourlyRate = annualSalary / (Self.standardWeeklyHours * Self.weeksPerYear)
        }

        let multiplier = Self.multiplier(for: input.overtimeType)
        let overtimeRate = baseHourlyRate * multiplier
        let totalOvertimePay = overtimeRate * input.overtimeHours

        return OvertimeOutput(
            baseHourlyRate: baseHourlyRate,
            multiplier: multiplier,
            overtimeRate: overtimeRate,
            totalOvertimePay: totalOvertimePay,
            hours: input.overtimeHours
        )
    }

    // MARK: - Private Helpers

    /// Returns the statutory multiplier for a given overtime type.
    private static func multiplier(for type: OvertimeType) -> Decimal {
        switch type {
        case .weekday: return Decimal(string: "1.5") ?? 1
        case .sunday:  return Decimal(string: "2.0") ?? 2
        case .holiday: return Decimal(string: "2.0") ?? 2
        }
    }
}
