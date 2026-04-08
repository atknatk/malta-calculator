//
//  CalculatorID.swift
//  MaltaCalculator
//

import Foundation

/// Identifies each calculator motor available in the app.
///
/// Raw values match the URL path segment used in deep links
/// (e.g. `maltacalc://calculators/mortgage`).
enum CalculatorID: String, Hashable, CaseIterable, Identifiable, Sendable {
    // Employment & Salary
    case salary
    case noticePeriod = "notice-period"
    case overtime

    // Family & Children
    case childrensAllowance = "childrens-allowance"

    // Property & Housing
    case stampDuty = "stamp-duty"

    // Banking & Loans
    case mortgage
    case savingsInterest = "savings-interest"
    case personalLoan = "personal-loan"

    // Retirement & Savings
    case pension
    case retirementAge = "retirement-age"

    // Leave & Time Off
    case vacation

    // Transport & Vehicles
    case vehicleRegistrationFee = "vehicle-registration-fee"
    case vehicleRegistrationTax = "vehicle-registration-tax"
    case roadLicense = "road-license"
    case driversLicense = "drivers-license"
    case vrt
    case importVehicle = "import-vehicle"

    // Immigration & Visa
    case familyReunification = "family-reunification"

    var id: String { rawValue }

    /// Human-readable display name for the calculator.
    var displayName: String {
        switch self {
        case .salary: String(localized: "calculator.salary.title")
        case .noticePeriod: String(localized: "calculator.noticePeriod.title")
        case .overtime: String(localized: "calculator.overtime.title")
        case .childrensAllowance: String(localized: "calculator.childrensAllowance.title")
        case .stampDuty: String(localized: "calculator.stampDuty.title")
        case .mortgage: String(localized: "calculator.mortgage.title")
        case .savingsInterest: String(localized: "calculator.savingsInterest.title")
        case .personalLoan: String(localized: "calculator.personalLoan.title")
        case .pension: String(localized: "calculator.pension.title")
        case .retirementAge: String(localized: "calculator.retirementAge.title")
        case .vacation: String(localized: "calculator.vacation.title")
        case .vehicleRegistrationFee: String(localized: "calculator.vehicleRegistrationFee.title")
        case .vehicleRegistrationTax: String(localized: "calculator.vehicleRegistrationTax.title")
        case .roadLicense: String(localized: "calculator.roadLicense.title")
        case .driversLicense: String(localized: "calculator.driversLicense.title")
        case .vrt: String(localized: "calculator.vrt.title")
        case .importVehicle: String(localized: "calculator.importVehicle.title")
        case .familyReunification: String(localized: "calculator.familyReunification.title")
        }
    }

    /// SF Symbol name for the calculator icon.
    var systemImage: String {
        switch self {
        case .salary: "eurosign.circle.fill"
        case .noticePeriod: "calendar.badge.clock"
        case .overtime: "clock.badge.fill"
        case .childrensAllowance: "figure.2.and.child.holdinghands"
        case .stampDuty: "doc.badge.ellipsis"
        case .mortgage: "house.fill"
        case .savingsInterest: "banknote.fill"
        case .personalLoan: "creditcard.fill"
        case .pension: "figure.walk"
        case .retirementAge: "hourglass"
        case .vacation: "beach.umbrella.fill"
        case .vehicleRegistrationFee: "car.fill"
        case .vehicleRegistrationTax: "car.badge.gearshape.fill"
        case .roadLicense: "road.lanes"
        case .driversLicense: "person.text.rectangle.fill"
        case .vrt: "gauge.with.dots.needle.33percent"
        case .importVehicle: "shippingbox.fill"
        case .familyReunification: "person.3.fill"
        }
    }
}
