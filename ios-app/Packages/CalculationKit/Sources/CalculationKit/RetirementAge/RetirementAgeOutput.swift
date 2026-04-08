import Foundation

/// Result of the Malta retirement age calculation.
public struct RetirementAgeOutput: Sendable, Codable, Equatable {
    /// Statutory retirement age in years.
    public let retirementAge: Int
    /// Calendar year the person reaches retirement age.
    public let retirementYear: Int
    /// Whole years remaining until retirement (negative if already past).
    public let yearsUntilRetirement: Int
    /// Total months remaining until retirement (floored to zero).
    public let monthsUntilRetirement: Int
    /// Whether the person may apply for early retirement at 61 with 35 years of contributions.
    public let eligibleForEarlyRetirement: Bool
}
