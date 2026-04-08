import Foundation

/// Vehicle type for registration.
public enum VehicleType: String, CaseIterable, Codable, Sendable {
    case car, motorcycle, van, commercial
}

/// Number plate type.
public enum PlateType: String, CaseIterable, Codable, Sendable {
    case random, personalised, customised
}

/// Input for the vehicle registration fee calculator.
public struct VehicleRegistrationFeeInput: Sendable, Codable, Equatable {
    public var vehicleType: VehicleType
    public var plateType: PlateType
    public var isImported: Bool
    public var engineCapacity: Int
    public var co2Emissions: Int
    public var vehicleAge: Int
    public var fuelType: FuelType

    public init(vehicleType: VehicleType, plateType: PlateType, isImported: Bool,
                engineCapacity: Int = 1600, co2Emissions: Int = 0,
                vehicleAge: Int = 0, fuelType: FuelType = .petrol) {
        self.vehicleType = vehicleType; self.plateType = plateType
        self.isImported = isImported; self.engineCapacity = engineCapacity
        self.co2Emissions = co2Emissions; self.vehicleAge = vehicleAge
        self.fuelType = fuelType
    }
}

/// Result of the vehicle registration fee calculation.
public struct VehicleRegistrationFeeOutput: Sendable, Codable, Equatable {
    public let totalFee: Money
    public let administrationFee: Money
    public let platesFee: Money
    public let vrtInspectionFee: Money
    public let firstYearCirculationFee: Money
}

/// Malta Vehicle Registration Fee Calculator.
public struct VehicleRegistrationFeeCalculator: Sendable {
    private static let administrationFee: Money = 15
    private static let vrtInspectionFee: Money = 55

    private static let plateFees: [VehicleType: [PlateType: Money]] = [
        .car: [.random: 70, .personalised: 200, .customised: 1500],
        .van: [.random: 70, .personalised: 200, .customised: 1500],
        .motorcycle: [.random: 35, .personalised: 200, .customised: 1500],
        .commercial: [.random: 70, .personalised: 200, .customised: 1500],
    ]

    public init() {}

    /// Calculates vehicle registration fees.
    public func calculate(input: VehicleRegistrationFeeInput) -> VehicleRegistrationFeeOutput {
        let platesFee = Self.plateFees[input.vehicleType]?[input.plateType] ?? 70
        let vrtFee: Money = input.isImported ? Self.vrtInspectionFee : 0

        let vehicleCategory: VehicleCategory
        switch input.vehicleType {
        case .motorcycle: vehicleCategory = .motorcycle
        case .commercial: vehicleCategory = .commercial
        default: vehicleCategory = .privateCar
        }

        var firstYearCirculationFee: Money = 0
        if input.engineCapacity > 0 {
            let roadLicenseInput = RoadLicenseInput(
                engineCapacity: input.engineCapacity, co2Emissions: input.co2Emissions,
                vehicleAge: input.vehicleAge, fuelType: input.fuelType,
                vehicleCategory: vehicleCategory, licensePeriod: 12
            )
            let result = RoadLicenseCalculator().calculate(input: roadLicenseInput)
            firstYearCirculationFee = result.annualFee
        }

        let totalFee = Self.administrationFee + platesFee + vrtFee + firstYearCirculationFee

        return VehicleRegistrationFeeOutput(
            totalFee: totalFee.rounded(to: 0),
            administrationFee: Self.administrationFee,
            platesFee: platesFee,
            vrtInspectionFee: vrtFee,
            firstYearCirculationFee: firstYearCirculationFee
        )
    }
}
