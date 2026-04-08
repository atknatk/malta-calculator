import Foundation

/// Result of the Malta overtime calculation.
public struct OvertimeOutput: Sendable, Codable, Equatable {
    /// Base hourly rate used in the calculation.
    public let baseHourlyRate: Money
    /// Overtime multiplier applied (e.g. 1.5 or 2.0).
    public let multiplier: Decimal
    /// Effective hourly rate during overtime (base x multiplier).
    public let overtimeRate: Money
    /// Total overtime pay (overtime rate x hours).
    public let totalOvertimePay: Money
    /// Number of overtime hours.
    public let hours: Decimal
}
