import Foundation

/// Input for the Malta stamp duty calculator.
public struct StampDutyInput: Sendable, Codable, Equatable {
    /// Property purchase price in EUR.
    public var propertyPrice: Money
    /// Whether the buyer is a first-time property buyer.
    public var isFirstTimeBuyer: Bool

    /// Creates a new stamp duty input.
    public init(propertyPrice: Money, isFirstTimeBuyer: Bool) {
        self.propertyPrice = propertyPrice
        self.isFirstTimeBuyer = isFirstTimeBuyer
    }
}
