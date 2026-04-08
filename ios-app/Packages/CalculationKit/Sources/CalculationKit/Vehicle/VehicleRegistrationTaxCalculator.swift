import Foundation

/// Fuel type for registration tax (without LPG).
public enum RegTaxFuelType: String, CaseIterable, Codable, Sendable {
    case petrol, diesel, hybrid, pluginHybrid = "plugin_hybrid", electric
}

/// Input for the vehicle registration tax calculator.
public struct VehicleRegistrationTaxInput: Sendable, Codable, Equatable {
    public var co2Emissions: Int
    public var vehicleAge: Int
    public var engineCapacity: Int
    public var fuelType: RegTaxFuelType
    public var vehicleValue: Money
    public var isEU: Bool

    public init(co2Emissions: Int, vehicleAge: Int, engineCapacity: Int,
                fuelType: RegTaxFuelType, vehicleValue: Money, isEU: Bool) {
        self.co2Emissions = co2Emissions; self.vehicleAge = vehicleAge
        self.engineCapacity = engineCapacity; self.fuelType = fuelType
        self.vehicleValue = vehicleValue; self.isEU = isEU
    }
}

/// Result of the vehicle registration tax calculation.
public struct VehicleRegistrationTaxOutput: Sendable, Codable, Equatable {
    public let totalTax: Money
    public let co2Tax: Money
    public let ageDiscount: Money
    public let ecoDiscount: Money
    public let importDuty: Money
    public let vat: Money
}

/// Malta Vehicle Registration Tax Calculator (CO2-based).
public struct VehicleRegistrationTaxCalculator: Sendable {
    private static let co2TaxBands: [(maxCO2: Int, rate: Money)] = [
        (0, 0), (50, 0), (100, 8), (130, 15), (150, 25),
        (170, 40), (200, 60), (250, 100), (Int.max, 150),
    ]
    private static let ageDepreciation: [Int: Decimal] = [
        0: 0, 1: Decimal(string: "0.1") ?? 0, 2: Decimal(string: "0.18") ?? 0,
        3: Decimal(string: "0.25") ?? 0, 4: Decimal(string: "0.31") ?? 0,
        5: Decimal(string: "0.36") ?? 0, 6: Decimal(string: "0.4") ?? 0,
        7: Decimal(string: "0.44") ?? 0, 8: Decimal(string: "0.47") ?? 0,
        9: Decimal(string: "0.5") ?? 0, 10: Decimal(string: "0.52") ?? 0,
    ]
    private static let fuelTypeDiscounts: [RegTaxFuelType: Decimal] = [
        .electric: 1, .pluginHybrid: Decimal(string: "0.75") ?? 0,
        .hybrid: Decimal(string: "0.25") ?? 0, .petrol: 0, .diesel: 0,
    ]
    private static let vatRate: Decimal = Decimal(string: "0.18") ?? 0
    private static let nonEUImportDutyRate: Decimal = Decimal(string: "0.1") ?? 0

    public init() {}

    /// Calculates vehicle registration tax.
    public func calculate(input: VehicleRegistrationTaxInput) -> VehicleRegistrationTaxOutput {
        var co2Tax: Money = 0
        let emissions = input.co2Emissions
        for band in Self.co2TaxBands where emissions <= band.maxCO2 {
            co2Tax = Decimal(emissions) * band.rate; break
        }

        let ecoDiscountRate = Self.fuelTypeDiscounts[input.fuelType] ?? 0
        let ecoDiscount = co2Tax * ecoDiscountRate
        co2Tax -= ecoDiscount

        let ageKey = Swift.min(input.vehicleAge, 10)
        let ageRate = Self.ageDepreciation[ageKey] ?? Self.ageDepreciation[10] ?? 0
        let ageDiscount = co2Tax * ageRate
        let taxAfterAge = co2Tax - ageDiscount

        let importDuty: Money = input.isEU ? 0 : input.vehicleValue * Self.nonEUImportDutyRate

        let vat: Money
        if input.vehicleAge == 0 || !input.isEU {
            vat = input.vehicleValue * Self.vatRate
        } else {
            vat = 0
        }

        let totalTax = taxAfterAge + importDuty + vat

        return VehicleRegistrationTaxOutput(
            totalTax: totalTax.rounded(to: 0),
            co2Tax: taxAfterAge.rounded(to: 0),
            ageDiscount: ageDiscount.rounded(to: 0),
            ecoDiscount: ecoDiscount.rounded(to: 0),
            importDuty: importDuty.rounded(to: 0),
            vat: vat.rounded(to: 0)
        )
    }
}
