import Foundation

/// Input for the Malta notice period calculator.
public struct NoticePeriodInput: Sendable, Codable, Equatable {
    /// Total months of continuous service with the employer.
    public var monthsOfService: Int
    /// Whether the employee is currently in probation.
    public var isInProbation: Bool

    /// Creates a new notice period input.
    public init(monthsOfService: Int, isInProbation: Bool = false) {
        self.monthsOfService = monthsOfService
        self.isInProbation = isInProbation
    }
}
