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

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        monthsOfService = try container.decode(Int.self, forKey: .monthsOfService)
        isInProbation = try container.decodeIfPresent(Bool.self, forKey: .isInProbation) ?? false
    }
}
