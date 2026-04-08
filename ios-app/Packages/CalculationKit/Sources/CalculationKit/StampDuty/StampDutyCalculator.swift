import Foundation

/// Malta Stamp Duty Calculator.
///
/// Based on Malta Property Transfer Regulations:
/// - Standard rate: 5% on full property value
/// - First-time buyer exemption: first EUR 200,000 exempt
public struct StampDutyCalculator: Sendable {

    /// Standard stamp duty rate (5%).
    private static let standardRate: Decimal = Decimal(string: "0.05") ?? 0

    /// First-time buyer exemption threshold (EUR 200,000).
    private static let firstTimeBuyerExemption: Money = 200_000

    /// Creates a new stamp duty calculator.
    public init() {}

    /// Calculates stamp duty on a property purchase.
    /// - Parameter input: The stamp duty parameters.
    /// - Returns: A ``StampDutyOutput`` containing the duty, effective rate, and savings.
    public func calculate(input: StampDutyInput) -> StampDutyOutput {
        let exemptedAmount: Money
        let taxableAmount: Money

        if input.isFirstTimeBuyer {
            // First-time buyers: exempt on first EUR 200,000
            exemptedAmount = Swift.min(input.propertyPrice, Self.firstTimeBuyerExemption)
            taxableAmount = Swift.max(0, input.propertyPrice - Self.firstTimeBuyerExemption)
        } else {
            // Standard buyers: 5% on full amount
            exemptedAmount = 0
            taxableAmount = input.propertyPrice
        }

        let stampDuty = taxableAmount * Self.standardRate

        let effectiveRate: Decimal = input.propertyPrice > 0
            ? (stampDuty / input.propertyPrice) * 100
            : 0

        let standardDuty = input.propertyPrice * Self.standardRate
        let savings = standardDuty - stampDuty

        return StampDutyOutput(
            stampDuty: stampDuty.rounded(),
            effectiveRate: effectiveRate.rounded(),
            exemptedAmount: exemptedAmount.rounded(),
            taxableAmount: taxableAmount.rounded(),
            savings: savings.rounded()
        )
    }
}
