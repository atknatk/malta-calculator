import Foundation

/// License application type.
public enum LicenseType: String, CaseIterable, Codable, Sendable {
    case new, renewal, international, replacement, categoryUpgrade = "category_upgrade"
}

/// Driver's license category.
public enum LicenseCategory: String, CaseIterable, Codable, Sendable {
    case am = "AM", a1 = "A1", a2 = "A2", a = "A", b = "B", be = "BE"
    case c = "C", c1 = "C1", ce = "CE", d = "D", d1 = "D1", de = "DE"
}

/// Input for the driver's license calculator.
public struct DriversLicenseInput: Sendable, Codable, Equatable {
    public var licenseType: LicenseType
    public var age: Int
    public var category: LicenseCategory
    public var validityPeriod: Int
    public var includeTheoryTest: Bool
    public var includePracticalTest: Bool
    public var isFirstLicense: Bool

    public init(licenseType: LicenseType, age: Int, category: LicenseCategory,
                validityPeriod: Int, includeTheoryTest: Bool,
                includePracticalTest: Bool, isFirstLicense: Bool) {
        self.licenseType = licenseType; self.age = age; self.category = category
        self.validityPeriod = validityPeriod; self.includeTheoryTest = includeTheoryTest
        self.includePracticalTest = includePracticalTest; self.isFirstLicense = isFirstLicense
    }
}

/// Result of the driver's license fee calculation.
public struct DriversLicenseOutput: Sendable, Codable, Equatable {
    public let totalCost: Money
    public let licenseFee: Money
    public let theoryTestFee: Money
    public let practicalTestFee: Money
    public let medicalFee: Money
    public let photoFee: Money
    public let validity: String
}

/// Malta Driver's License Fees Calculator.
public struct DriversLicenseCalculator: Sendable {
    private static let licenseFees: [String: [String: Money]] = [
        "new": ["1": 15, "5": 30, "10": 45],
        "renewal": ["1": 15, "5": 30, "10": 45],
    ]
    private static let internationalFee: Money = 23
    private static let replacementFee: Money = 25
    private static let categoryUpgradeFee: Money = 35
    private static let theoryTestFee: Money = 30
    private static let practicalTestFees: [LicenseCategory: Money] = [
        .am: 45, .a1: 55, .a2: 55, .a: 55, .b: 60, .be: 70,
        .c1: 80, .c: 90, .ce: 100, .d1: 90, .d: 100, .de: 110,
    ]
    private static let medicalFee: Money = 40
    private static let photoFee: Money = 8

    public init() {}

    private static func getMaxValidity(age: Int) -> Int {
        if age >= 70 { return 1 }
        if age >= 65 { return 5 }
        return 10
    }

    /// Calculates driver's license fees.
    public func calculate(input: DriversLicenseInput) -> DriversLicenseOutput {
        let maxValidity = Self.getMaxValidity(age: input.age)
        let effectiveValidity = Swift.min(input.validityPeriod, maxValidity)

        let licenseFee: Money
        switch input.licenseType {
        case .international: licenseFee = Self.internationalFee
        case .replacement: licenseFee = Self.replacementFee
        case .categoryUpgrade: licenseFee = Self.categoryUpgradeFee
        case .new, .renewal:
            licenseFee = Self.licenseFees[input.licenseType.rawValue]?["\(effectiveValidity)"] ?? 30
        }

        let theoryTestFee: Money
        if input.includeTheoryTest && (input.isFirstLicense || input.licenseType == .categoryUpgrade) {
            theoryTestFee = Self.theoryTestFee
        } else {
            theoryTestFee = 0
        }

        let practicalTestFee: Money
        if input.includePracticalTest && (input.isFirstLicense || input.licenseType == .categoryUpgrade) {
            practicalTestFee = Self.practicalTestFees[input.category] ?? Self.practicalTestFees[.b] ?? 60
        } else {
            practicalTestFee = 0
        }

        let commercialCategories: Set<LicenseCategory> = [.c, .c1, .ce, .d, .d1, .de]
        let medicalFee: Money
        if input.isFirstLicense || (input.licenseType == .renewal && input.age >= 65)
            || commercialCategories.contains(input.category) {
            medicalFee = Self.medicalFee
        } else {
            medicalFee = 0
        }

        let photoFee: Money
        if input.isFirstLicense || input.licenseType == .renewal {
            photoFee = Self.photoFee
        } else {
            photoFee = 0
        }

        let totalCost = licenseFee + theoryTestFee + practicalTestFee + medicalFee + photoFee
        let validityStr = "\(effectiveValidity) year\(effectiveValidity > 1 ? "s" : "")"

        return DriversLicenseOutput(
            totalCost: totalCost.rounded(to: 0),
            licenseFee: licenseFee,
            theoryTestFee: theoryTestFee,
            practicalTestFee: practicalTestFee,
            medicalFee: medicalFee,
            photoFee: photoFee,
            validity: validityStr
        )
    }
}
