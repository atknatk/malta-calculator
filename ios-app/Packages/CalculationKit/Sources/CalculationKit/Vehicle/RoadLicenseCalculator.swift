import Foundation

/// Fuel type for vehicle calculations.
public enum FuelType: String, CaseIterable, Codable, Sendable {
    case petrol, diesel, hybrid, pluginHybrid = "plugin_hybrid", electric, lpg
}

/// Vehicle category for road license.
public enum VehicleCategory: String, CaseIterable, Codable, Sendable {
    case privateCar = "private_car"
    case motorcycle
    case commercial
    case vintage
}

/// Input for the road license calculator.
public struct RoadLicenseInput: Sendable, Codable, Equatable {
    /// Engine capacity in cc.
    public var engineCapacity: Int
    /// CO2 emissions in g/km.
    public var co2Emissions: Int
    /// Vehicle age in years.
    public var vehicleAge: Int
    /// Fuel type.
    public var fuelType: FuelType
    /// Vehicle category.
    public var vehicleCategory: VehicleCategory
    /// License period in months (3, 6, or 12).
    public var licensePeriod: Int

    public init(engineCapacity: Int, co2Emissions: Int, vehicleAge: Int, fuelType: FuelType, vehicleCategory: VehicleCategory, licensePeriod: Int) {
        self.engineCapacity = engineCapacity; self.co2Emissions = co2Emissions
        self.vehicleAge = vehicleAge; self.fuelType = fuelType
        self.vehicleCategory = vehicleCategory; self.licensePeriod = licensePeriod
    }
}

/// Result of the road license calculation.
public struct RoadLicenseOutput: Sendable, Codable, Equatable {
    public let annualFee: Money
    public let periodFee: Money
    public let monthlyEquivalent: Money
    public let baseFee: Money
    public let co2Surcharge: Money
    public let ecoDiscount: Money
}

/// Malta Road License (Annual Circulation Tax) Calculator.
public struct RoadLicenseCalculator: Sendable {
    private static let engineCapacityFees: [(maxCC: Int, fee: Money)] = [
        (1000, 60), (1200, 80), (1400, 100), (1600, 130), (1800, 160),
        (2000, 200), (2500, 280), (3000, 380), (Int.max, 500),
    ]
    private static let co2SurchargeBands: [(maxCO2: Int, surcharge: Money)] = [
        (100, 0), (130, 20), (150, 40), (170, 70), (200, 120), (250, 200), (Int.max, 350),
    ]
    private static let motorcycleFees: [(maxCC: Int, fee: Money)] = [
        (125, 25), (250, 35), (500, 50), (750, 70), (Int.max, 100),
    ]
    private static let fuelEcoDiscounts: [FuelType: Decimal] = [
        .electric: 1, .pluginHybrid: Decimal(string: "0.5") ?? 0,
        .hybrid: Decimal(string: "0.25") ?? 0, .lpg: Decimal(string: "0.15") ?? 0,
        .petrol: 0, .diesel: 0,
    ]
    private static let vintageFee: Money = 30

    public init() {}

    /// Calculates the road license fee.
    public func calculate(input: RoadLicenseInput) -> RoadLicenseOutput {
        var baseFee: Money = 0
        var co2Surcharge: Money = 0

        if input.vehicleCategory == .vintage || input.vehicleAge >= 25 {
            baseFee = Self.vintageFee
        } else if input.vehicleCategory == .motorcycle {
            for band in Self.motorcycleFees where input.engineCapacity <= band.maxCC {
                baseFee = band.fee; break
            }
        } else {
            for band in Self.engineCapacityFees where input.engineCapacity <= band.maxCC {
                baseFee = band.fee; break
            }
            if input.co2Emissions > 0 {
                for band in Self.co2SurchargeBands where input.co2Emissions <= band.maxCO2 {
                    co2Surcharge = band.surcharge; break
                }
            }
        }

        let discountRate = Self.fuelEcoDiscounts[input.fuelType] ?? 0
        let ecoDiscount = (baseFee + co2Surcharge) * discountRate
        let annualFee = Swift.max(0, baseFee + co2Surcharge - ecoDiscount)

        let periodMultiplier: Decimal
        switch input.licensePeriod {
        case 12: periodMultiplier = 1
        case 6: periodMultiplier = Decimal(string: "0.55") ?? 1
        case 3: periodMultiplier = Decimal(string: "0.28") ?? 1
        default: periodMultiplier = Decimal(input.licensePeriod) / 12
        }

        let periodFee = (annualFee * periodMultiplier).rounded(to: 0)
        let monthlyEquivalent = (annualFee / 12).rounded(to: 2)

        return RoadLicenseOutput(
            annualFee: annualFee.rounded(to: 0),
            periodFee: periodFee,
            monthlyEquivalent: monthlyEquivalent,
            baseFee: baseFee.rounded(to: 0),
            co2Surcharge: co2Surcharge.rounded(to: 0),
            ecoDiscount: ecoDiscount.rounded(to: 0)
        )
    }
}
