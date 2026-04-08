import Foundation

/// Aggregated tax configuration for a single year, used by all calculator motors.
public struct MaltaTaxConfig: Sendable {
    /// Per-year configuration data.
    public struct YearConfig: Sendable {
        public let year: Int
        public let brackets: [TaxRateType: [TaxBracket]]
        public let ssc: SSCRates
        public let cola: COLAConfig
    }

    /// A single tax bracket.
    public struct TaxBracket: Sendable, Codable, Equatable {
        public let min: Money
        public let max: Money
        public let rate: Decimal
        public let deduction: Money

        public init(min: Money, max: Money, rate: Decimal, deduction: Money) {
            self.min = min
            self.max = max
            self.rate = rate
            self.deduction = deduction
        }
    }

    /// SSC rates for a given year.
    public struct SSCRates: Sendable, Codable {
        public let categoryA: Money
        public let categoryB: Money
        public let categoryCOld: Money
        public let categoryCNew: Money
        public let categoryDOld: Money
        public let categoryDNew: Money
        public let weeklyCapOld: Money
        public let weeklyCapNew: Money
        public let minimumWage: Money
    }

    /// COLA (Cost of Living Adjustment) quarterly payments.
    public struct COLAConfig: Sendable {
        public let march: Money
        public let june: Money
        public let september: Money
        public let december: Money

        /// Returns the COLA amount for a given month, or zero if not a COLA month.
        public func amount(for month: Month) -> Money {
            switch month {
            case .march: march
            case .june: june
            case .september: september
            case .december: december
            default: 0
            }
        }
    }

    /// All year configurations keyed by year.
    public let years: [Int: YearConfig]

    /// Available years sorted ascending.
    public var availableYears: [Int] {
        years.keys.sorted()
    }
}
