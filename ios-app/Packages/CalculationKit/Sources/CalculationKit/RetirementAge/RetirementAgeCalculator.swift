import Foundation

/// Malta Retirement Age Calculator.
///
/// Determines the statutory retirement age based on birth year and, for
/// those born 1951 or earlier, gender. Source: Malta Social Security Act.
public struct RetirementAgeCalculator: Sendable {

    /// Creates a new retirement age calculator.
    public init() {}

    /// Calculates the retirement age and time remaining.
    ///
    /// - Parameter input: A ``RetirementAgeInput`` with birth year and optional gender.
    /// - Returns: A ``RetirementAgeOutput`` with age, year, and countdown.
    public func calculate(input: RetirementAgeInput) -> RetirementAgeOutput {
        let gender = input.gender ?? .male

        let retirementAge: Int = {
            if input.birthYear <= 1951 {
                return gender == .male ? 61 : 60
            }
            if input.birthYear <= 1955 { return 62 }
            if input.birthYear <= 1958 { return 63 }
            if input.birthYear <= 1961 { return 64 }
            return 65
        }()

        let retirementYear = input.birthYear + retirementAge

        let now = Date()
        let calendar = Calendar.current
        let currentYear = calendar.component(.year, from: now)
        let currentMonth = calendar.component(.month, from: now)

        let yearsUntilRetirement = retirementYear - currentYear
        let monthsUntilRetirement = Swift.max(0, yearsUntilRetirement * 12 - currentMonth)

        let eligibleForEarlyRetirement = retirementAge > 61

        return RetirementAgeOutput(
            retirementAge: retirementAge,
            retirementYear: retirementYear,
            yearsUntilRetirement: yearsUntilRetirement,
            monthsUntilRetirement: monthsUntilRetirement,
            eligibleForEarlyRetirement: eligibleForEarlyRetirement
        )
    }
}
