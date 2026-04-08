import Foundation

/// Result of the Malta vacation leave calculation.
public struct VacationOutput: Sendable, Codable, Equatable {
    /// Base vacation entitlement in hours (192 h scaled by weekly-hours ratio).
    public let baseHours: Money
    /// Extra hours from public holidays falling on weekends.
    public let publicHolidayHours: Money
    /// Total entitlement in hours (base + public holiday).
    public let totalHours: Money
    /// Total entitlement expressed in 8-hour days.
    public let totalDays: Decimal
    /// Pro-rata adjusted hours, or `nil` when a full year was worked.
    public let proRataHours: Money?
    /// Whether the entitlement is pro-rated (months worked < 12).
    public let isProRata: Bool
}
