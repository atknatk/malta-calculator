import Foundation

/// Malta Notice Period Calculator.
///
/// Determines the minimum notice period for indefinite contracts based on
/// continuous service, per the Employment and Industrial Relations Act
/// Article 36(5). Special rules apply during probation.
public struct NoticePeriodCalculator: Sendable {

    /// Creates a new notice period calculator.
    public init() {}

    /// Calculates the required notice period.
    ///
    /// - Parameter input: A ``NoticePeriodInput`` with months of service and probation flag.
    /// - Returns: A ``NoticePeriodOutput`` with weeks, days, and bracket description.
    public func calculate(input: NoticePeriodInput) -> NoticePeriodOutput {
        // Probation: less than 1 month — no notice required
        if input.isInProbation, input.monthsOfService < 1 {
            return NoticePeriodOutput(
                weeks: 0,
                days: 0,
                serviceBracket: "Less than 1 month (Probation)",
                isInProbation: true
            )
        }

        // Probation: 1 month or more — 1 week notice
        if input.isInProbation, input.monthsOfService >= 1 {
            return NoticePeriodOutput(
                weeks: 1,
                days: 7,
                serviceBracket: "Probation period (more than 1 month)",
                isInProbation: true
            )
        }

        // Standard brackets (Article 36(5))
        let bracket = Self.findBracket(months: input.monthsOfService)
        return NoticePeriodOutput(
            weeks: bracket.weeks,
            days: bracket.weeks * 7,
            serviceBracket: bracket.description,
            isInProbation: false
        )
    }

    // MARK: - Private Helpers

    /// A notice-period bracket defined by a service-month range.
    private struct Bracket {
        /// Inclusive lower bound in months.
        let minMonths: Int
        /// Exclusive upper bound in months (use `Int.max` for open-ended).
        let maxMonths: Int
        /// Required notice in weeks.
        let weeks: Int
        /// Human-readable bracket label.
        let description: String
    }

    /// Ordered list of notice-period brackets per Malta law.
    private static let brackets: [Bracket] = [
        Bracket(minMonths: 0,   maxMonths: 1,       weeks: 0,  description: "Less than 1 month"),
        Bracket(minMonths: 1,   maxMonths: 6,       weeks: 1,  description: "1 to 6 months"),
        Bracket(minMonths: 6,   maxMonths: 24,      weeks: 2,  description: "6 months to 2 years"),
        Bracket(minMonths: 24,  maxMonths: 48,      weeks: 4,  description: "2 to 4 years"),
        Bracket(minMonths: 48,  maxMonths: 84,      weeks: 8,  description: "4 to 7 years"),
        Bracket(minMonths: 84,  maxMonths: 96,      weeks: 9,  description: "7 to 8 years"),
        Bracket(minMonths: 96,  maxMonths: 108,     weeks: 10, description: "8 to 9 years"),
        Bracket(minMonths: 108, maxMonths: 120,     weeks: 11, description: "9 to 10 years"),
        Bracket(minMonths: 120, maxMonths: Int.max,  weeks: 12, description: "More than 10 years"),
    ]

    /// Finds the matching bracket for a given number of service months.
    private static func findBracket(months: Int) -> Bracket {
        for bracket in brackets where months >= bracket.minMonths && months < bracket.maxMonths {
            return bracket
        }
        // Fallback to the maximum bracket
        return brackets[brackets.count - 1]
    }
}
