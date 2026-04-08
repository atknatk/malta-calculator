import Foundation

/// VRT vehicle type.
public enum VRTVehicleType: String, CaseIterable, Codable, Sendable {
    case car, motorcycle, commercialLight = "commercial_light"
    case commercialHeavy = "commercial_heavy", bus, trailer
}

/// Input for the VRT (Vehicle Roadworthiness Test) calculator.
public struct VRTInput: Sendable, Codable, Equatable {
    public var vehicleType: VRTVehicleType
    public var vehicleAge: Int
    public var isRetest: Bool

    public init(vehicleType: VRTVehicleType, vehicleAge: Int, isRetest: Bool) {
        self.vehicleType = vehicleType
        self.vehicleAge = vehicleAge
        self.isRetest = isRetest
    }
}

/// Result of the VRT calculation.
public struct VRTOutput: Sendable, Codable, Equatable {
    public let testFee: Money
    public let retestFee: Money
    public let nextTestDue: Int
    public let frequency: String
}

/// Malta VRT (Vehicle Roadworthiness Test) Calculator.
public struct VRTCalculator: Sendable {
    private static let fees: [VRTVehicleType: (standard: Money, retest: Money)] = [
        .car: (36, 18), .motorcycle: (25, 12),
        .commercialLight: (42, 21), .commercialHeavy: (58, 29),
        .bus: (65, 32), .trailer: (30, 15),
    ]

    private static let testFrequency: [VRTVehicleType: [(maxAge: Int, months: Int)]] = [
        .car: [(4, 0), (10, 24), (Int.max, 12)],
        .motorcycle: [(4, 0), (10, 24), (Int.max, 12)],
        .commercialLight: [(1, 0), (Int.max, 12)],
        .commercialHeavy: [(1, 0), (Int.max, 12)],
        .bus: [(1, 0), (Int.max, 6)],
        .trailer: [(1, 0), (Int.max, 12)],
    ]

    public init() {}

    /// Calculates VRT fees and next test timing.
    public func calculate(input: VRTInput) -> VRTOutput {
        let feeEntry = Self.fees[input.vehicleType] ?? Self.fees[.car] ?? (36, 18)
        let testFee = input.isRetest ? feeEntry.retest : feeEntry.standard
        let retestFee = feeEntry.retest

        let rules = Self.testFrequency[input.vehicleType] ?? Self.testFrequency[.car] ?? []
        var frequencyMonths = 12
        for rule in rules where input.vehicleAge <= rule.maxAge {
            frequencyMonths = rule.months; break
        }

        var nextTestDue = frequencyMonths
        if frequencyMonths == 0 {
            if input.vehicleType == .car || input.vehicleType == .motorcycle {
                nextTestDue = (4 - input.vehicleAge) * 12
            } else {
                nextTestDue = (1 - input.vehicleAge) * 12
            }
        }

        let frequency: String
        if frequencyMonths == 0 {
            if input.vehicleType == .car || input.vehicleType == .motorcycle {
                frequency = "First test required at 4 years old"
            } else {
                frequency = "First test required at 1 year old"
            }
        } else if frequencyMonths == 6 {
            frequency = "Every 6 months"
        } else if frequencyMonths == 24 {
            frequency = "Every 2 years"
        } else {
            frequency = "Annual test required"
        }

        return VRTOutput(
            testFee: testFee,
            retestFee: retestFee,
            nextTestDue: Swift.max(0, nextTestDue),
            frequency: frequency
        )
    }
}
