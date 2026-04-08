import Foundation

/// Result of the Malta notice period calculation.
public struct NoticePeriodOutput: Sendable, Codable, Equatable {
    /// Required notice period in weeks.
    public let weeks: Int
    /// Required notice period in calendar days (weeks x 7).
    public let days: Int
    /// Human-readable description of the service bracket.
    public let serviceBracket: String
    /// Whether the result applies to a probation scenario.
    public let isInProbation: Bool
}
