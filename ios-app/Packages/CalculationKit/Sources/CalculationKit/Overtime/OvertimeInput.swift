import Foundation

/// Type of overtime worked, determining the pay multiplier.
public enum OvertimeType: String, CaseIterable, Codable, Sendable {
    /// Normal weekday overtime (1.5x).
    case weekday
    /// Sunday or rest-day overtime (2.0x).
    case sunday
    /// Public holiday overtime (2.0x).
    case holiday
}

/// Input for the Malta overtime calculator.
public struct OvertimeInput: Sendable, Codable, Equatable {
    /// Base hourly rate in EUR. If zero and ``annualSalary`` is provided, it will be derived.
    public var hourlyRate: Money
    /// Number of overtime hours worked.
    public var overtimeHours: Decimal
    /// Category of overtime determining the multiplier.
    public var overtimeType: OvertimeType
    /// Optional annual gross salary used to derive hourly rate when ``hourlyRate`` is zero.
    public var annualSalary: Money?

    /// Creates a new overtime input.
    public init(
        hourlyRate: Money,
        overtimeHours: Decimal,
        overtimeType: OvertimeType,
        annualSalary: Money? = nil
    ) {
        self.hourlyRate = hourlyRate
        self.overtimeHours = overtimeHours
        self.overtimeType = overtimeType
        self.annualSalary = annualSalary
    }
}
