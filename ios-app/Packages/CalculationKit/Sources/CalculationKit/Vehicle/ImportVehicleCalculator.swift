import Foundation

/// Currency for import vehicle price.
public enum ImportCurrency: String, CaseIterable, Codable, Sendable {
    case eur = "EUR", gbp = "GBP", usd = "USD", jpy = "JPY"
}

/// Input for the import vehicle calculator.
public struct ImportVehicleInput: Sendable, Codable, Equatable {
    public var purchasePrice: Money
    public var currency: ImportCurrency
    public var vehicleAge: Int
    public var co2Emissions: Int
    public var engineCapacity: Int
    public var fuelType: RegTaxFuelType
    public var isEU: Bool
    public var shippingCost: Money
    public var isNew: Bool

    public init(purchasePrice: Money, currency: ImportCurrency, vehicleAge: Int,
                co2Emissions: Int, engineCapacity: Int, fuelType: RegTaxFuelType,
                isEU: Bool, shippingCost: Money, isNew: Bool) {
        self.purchasePrice = purchasePrice; self.currency = currency
        self.vehicleAge = vehicleAge; self.co2Emissions = co2Emissions
        self.engineCapacity = engineCapacity; self.fuelType = fuelType
        self.isEU = isEU; self.shippingCost = shippingCost; self.isNew = isNew
    }
}

/// Result of the import vehicle calculation.
public struct ImportVehicleOutput: Sendable, Codable, Equatable {
    public let vehicleValueEUR: Money
    public let registrationTax: Money
    public let importDuty: Money
    public let vat: Money
    public let shippingCostEUR: Money
    public let vrtFee: Money
    public let numberPlatesFee: Money
    public let totalCost: Money
    public let totalTaxesFees: Money
}

/// Malta Import Vehicle Calculator.
///
/// Combines VRT + registration tax + registration fee + shipping + customs.
public struct ImportVehicleCalculator: Sendable {
    private static let exchangeRates: [ImportCurrency: Decimal] = [
        .eur: 1,
        .gbp: Decimal(string: "1.17") ?? 1,
        .usd: Decimal(string: "0.92") ?? 1,
        .jpy: Decimal(string: "0.0062") ?? 1,
    ]
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
    private static let fuelDiscounts: [RegTaxFuelType: Decimal] = [
        .electric: 1, .pluginHybrid: Decimal(string: "0.75") ?? 0,
        .hybrid: Decimal(string: "0.25") ?? 0, .petrol: 0, .diesel: 0,
    ]
    private static let vatRate: Decimal = Decimal(string: "0.18") ?? 0
    private static let importDutyRate: Decimal = Decimal(string: "0.1") ?? 0
    private static let vrtFee: Money = 36
    private static let numberPlatesFee: Money = 35
    private static let registrationFee: Money = 50

    public init() {}

    /// Calculates all costs for importing a vehicle to Malta.
    public func calculate(input: ImportVehicleInput) -> ImportVehicleOutput {
        let exchangeRate = Self.exchangeRates[input.currency] ?? 1
        let vehicleValueEUR = (input.purchasePrice * exchangeRate).rounded(to: 0)
        let shippingCostEUR = (input.shippingCost * exchangeRate).rounded(to: 0)
        let customsValue = vehicleValueEUR + shippingCostEUR

        let importDuty: Money = input.isEU ? 0 : (customsValue * Self.importDutyRate).rounded(to: 0)
        let vatBase = customsValue + importDuty
        let vat: Money = (input.isNew || !input.isEU) ? (vatBase * Self.vatRate).rounded(to: 0) : 0

        // CO2-based registration tax
        var co2Tax: Money = 0
        for band in Self.co2TaxBands where input.co2Emissions <= band.maxCO2 {
            co2Tax = Decimal(input.co2Emissions) * band.rate; break
        }
        let fuelDiscount = Self.fuelDiscounts[input.fuelType] ?? 0
        co2Tax *= (1 - fuelDiscount)
        let ageKey = Swift.min(input.vehicleAge, 10)
        let ageRate = Self.ageDepreciation[ageKey] ?? Self.ageDepreciation[10] ?? 0
        let registrationTax = (co2Tax * (1 - ageRate)).rounded(to: 0)

        let totalTaxesFees = importDuty + vat + registrationTax
            + Self.vrtFee + Self.numberPlatesFee + Self.registrationFee
        let totalCost = vehicleValueEUR + shippingCostEUR + totalTaxesFees

        return ImportVehicleOutput(
            vehicleValueEUR: vehicleValueEUR,
            registrationTax: registrationTax,
            importDuty: importDuty,
            vat: vat,
            shippingCostEUR: shippingCostEUR,
            vrtFee: Self.vrtFee,
            numberPlatesFee: Self.numberPlatesFee,
            totalCost: totalCost,
            totalTaxesFees: totalTaxesFees
        )
    }
}
