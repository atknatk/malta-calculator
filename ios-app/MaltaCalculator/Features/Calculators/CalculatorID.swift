//
//  CalculatorID.swift
//  MaltaCalculator
//

import Foundation

/// Identifies each calculator motor available in the app.
///
/// Raw values match the URL path segment used in deep links
/// (e.g. `maltacalc://calculators/mortgage`) and are the stable keys used to
/// persist recently-used history.
enum CalculatorID: String, Hashable, CaseIterable, Identifiable, Sendable, Codable {
    // MARK: Employment & Salary

    case salary
    case noticePeriod = "notice-period"
    case overtime
    case bonusTax = "bonus-tax"
    case partTime = "part-time"
    case expatriateTax = "expatriate-tax"

    // MARK: Family & Children

    case childrensAllowance = "childrens-allowance"
    case childcare
    case maternity
    case inWorkBenefit = "in-work-benefit"

    // MARK: Property & Housing

    case stampDuty = "stamp-duty"
    case rentalTax = "rental-tax"
    case firstTimeBuyer = "first-time-buyer"

    // MARK: Banking & Loans

    case mortgage
    case savingsInterest = "savings-interest"
    case personalLoan = "personal-loan"

    // MARK: Retirement & Savings

    case pension
    case retirementAge = "retirement-age"

    // MARK: Self-Employment

    case selfEmployedTax = "self-employed-tax"
    case selfEmployedSSC = "self-employed-ssc"

    // MARK: Leave & Time Off

    case vacation
    case sickLeave = "sick-leave"

    // MARK: Transport & Vehicles

    case vehicleRegistrationFee = "vehicle-registration-fee"
    case vehicleRegistrationTax = "vehicle-registration-tax"
    case roadLicense = "road-license"
    case driversLicense = "drivers-license"
    case vrt
    case importVehicle = "import-vehicle"

    // MARK: Immigration & Visa

    case familyReunification = "family-reunification"

    var id: String { rawValue }

    /// Human-readable display name for the calculator.
    ///
    /// Coming-soon calculators use plain English until localization keys ship
    /// alongside their motors.
    var displayName: String {
        switch self {
        case .salary: String(localized: "calculator.salary.title")
        case .noticePeriod: String(localized: "calculator.noticePeriod.title")
        case .overtime: String(localized: "calculator.overtime.title")
        case .bonusTax: "Bonus Tax"
        case .partTime: "Part-Time Tax"
        case .expatriateTax: "Expatriate Tax"
        case .childrensAllowance: String(localized: "calculator.childrensAllowance.title")
        case .childcare: "Childcare Subsidy"
        case .maternity: "Maternity Benefit"
        case .inWorkBenefit: "In-Work Benefit"
        case .stampDuty: String(localized: "calculator.stampDuty.title")
        case .rentalTax: "Rental Income Tax"
        case .firstTimeBuyer: "First-Time Buyer"
        case .mortgage: String(localized: "calculator.mortgage.title")
        case .savingsInterest: String(localized: "calculator.savingsInterest.title")
        case .personalLoan: String(localized: "calculator.personalLoan.title")
        case .pension: String(localized: "calculator.pension.title")
        case .retirementAge: String(localized: "calculator.retirementAge.title")
        case .selfEmployedTax: "Self-Employed Tax"
        case .selfEmployedSSC: "Self-Employed SSC"
        case .vacation: String(localized: "calculator.vacation.title")
        case .sickLeave: "Sick Leave"
        case .vehicleRegistrationFee: String(localized: "calculator.vehicleRegistrationFee.title")
        case .vehicleRegistrationTax: String(localized: "calculator.vehicleRegistrationTax.title")
        case .roadLicense: String(localized: "calculator.roadLicense.title")
        case .driversLicense: String(localized: "calculator.driversLicense.title")
        case .vrt: String(localized: "calculator.vrt.title")
        case .importVehicle: String(localized: "calculator.importVehicle.title")
        case .familyReunification: String(localized: "calculator.familyReunification.title")
        }
    }

    /// Short subtitle describing the calculator purpose.
    var subtitle: String {
        switch self {
        case .salary: "Net salary with tax, SSC & COLA"
        case .noticePeriod: "Required notice based on service years"
        case .overtime: "Overtime pay at 1.5x and 2x rates"
        case .bonusTax: "Tax on statutory and discretionary bonuses"
        case .partTime: "15% flat tax on part-time income"
        case .expatriateTax: "Reduced tax for qualifying expatriates"
        case .childrensAllowance: "Monthly allowance per child"
        case .childcare: "Free childcare eligibility & hours"
        case .maternity: "Maternity leave pay & benefit"
        case .inWorkBenefit: "Low-income supplement"
        case .stampDuty: "Property purchase stamp duty (5% / 3.5%)"
        case .rentalTax: "15% flat tax on rental income"
        case .firstTimeBuyer: "First-time buyer exemption"
        case .mortgage: "Home loan with 10% min deposit"
        case .savingsInterest: "Compound interest & final balance"
        case .personalLoan: "Monthly payments & total interest"
        case .pension: "Pension contribution growth"
        case .retirementAge: "Retirement age by birth year"
        case .selfEmployedTax: "Annual tax for self-employed"
        case .selfEmployedSSC: "Class 2 social security"
        case .vacation: "Vacation days entitlement"
        case .sickLeave: "Sick leave entitlement"
        case .vehicleRegistrationFee: "Malta vehicle registration fee"
        case .vehicleRegistrationTax: "Registration tax on new vehicles"
        case .roadLicense: "Annual road license fee"
        case .driversLicense: "Driving license fees"
        case .vrt: "Vehicle roadworthiness test cost"
        case .importVehicle: "Import duty & registration"
        case .familyReunification: "Family reunification income requirement"
        }
    }

    /// SF Symbol name for the calculator icon.
    var systemImage: String {
        switch self {
        case .salary: "eurosign.circle.fill"
        case .noticePeriod: "clock.badge"
        case .overtime: "clock.arrow.2.circlepath"
        case .bonusTax: "gift.fill"
        case .partTime: "person.crop.rectangle"
        case .expatriateTax: "airplane.circle"
        case .childrensAllowance: "figure.2.and.child.holdinghands"
        case .childcare: "figure.and.child.holdinghands"
        case .maternity: "figure.dress.line.vertical.figure"
        case .inWorkBenefit: "hand.raised.fill"
        case .stampDuty: "doc.text.fill"
        case .rentalTax: "key.fill"
        case .firstTimeBuyer: "house.and.flag.fill"
        case .mortgage: "house.fill"
        case .savingsInterest: "banknote.fill"
        case .personalLoan: "creditcard.fill"
        case .pension: "leaf.fill"
        case .retirementAge: "calendar.badge.clock"
        case .selfEmployedTax: "person.text.rectangle"
        case .selfEmployedSSC: "shield.lefthalf.filled"
        case .vacation: "beach.umbrella.fill"
        case .sickLeave: "cross.case.fill"
        case .vehicleRegistrationFee: "car.front.waves.up"
        case .vehicleRegistrationTax: "car.circle.fill"
        case .roadLicense: "road.lanes"
        case .driversLicense: "person.badge.shield.checkmark.fill"
        case .vrt: "wrench.and.screwdriver.fill"
        case .importVehicle: "shippingbox.fill"
        case .familyReunification: "person.3.fill"
        }
    }

    /// Category bucket for grouping on the Calculators Hub.
    var category: CalculatorCategory {
        switch self {
        case .salary, .noticePeriod, .overtime, .bonusTax, .partTime, .expatriateTax:
            return .employment
        case .childrensAllowance, .childcare, .maternity, .inWorkBenefit:
            return .family
        case .stampDuty, .rentalTax, .firstTimeBuyer:
            return .property
        case .mortgage, .savingsInterest, .personalLoan:
            return .banking
        case .pension, .retirementAge:
            return .retirement
        case .selfEmployedTax, .selfEmployedSSC:
            return .selfEmployment
        case .vacation, .sickLeave:
            return .leave
        case .vehicleRegistrationFee, .vehicleRegistrationTax, .roadLicense,
             .driversLicense, .vrt, .importVehicle:
            return .transport
        case .familyReunification:
            return .immigration
        }
    }

    /// Whether the calculator is shipped and interactive.
    ///
    /// `false` means the card is rendered as "Coming Soon" and taps are
    /// blocked with a negative haptic.
    var isAvailable: Bool {
        switch self {
        case .bonusTax, .partTime, .expatriateTax, .childcare, .maternity,
             .inWorkBenefit, .rentalTax, .firstTimeBuyer, .selfEmployedTax,
             .selfEmployedSSC, .sickLeave:
            return false
        default:
            return true
        }
    }
}
