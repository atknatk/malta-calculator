import Foundation
import Testing
@testable import CalculationKit

// MARK: - Shared Tolerance Helper

private func assertMoney(
    _ actual: Money, _ expected: Money,
    tolerance: Money = Decimal(string: "0.01") ?? 0,
    label: String,
    sourceLocation: SourceLocation = #_sourceLocation
) {
    #expect(
        abs(actual - expected) <= tolerance,
        "\(label): actual=\(actual) expected=\(expected) diff=\(actual - expected)",
        sourceLocation: sourceLocation
    )
}

// MARK: - Web JSON Decodable Types (handle web format differences)

/// Month as capitalized string from web JSON
private enum WebMonth: String, Decodable {
    case January, February, March, April, May, June
    case July, August, September, October, November, December

    var toMonth: Month {
        switch self {
        case .January: .january
        case .February: .february
        case .March: .march
        case .April: .april
        case .May: .may
        case .June: .june
        case .July: .july
        case .August: .august
        case .September: .september
        case .October: .october
        case .November: .november
        case .December: .december
        }
    }
}

private struct WebSalaryInput: Decodable {
    let month: WebMonth
    let grossWage: Decimal
    let bonus: Decimal
    let governmentBonus: Decimal
    let allowanceBonus: Decimal

    func toSalaryInput() -> SalaryInput {
        SalaryInput(
            month: month.toMonth,
            grossWage: grossWage,
            bonus: bonus,
            governmentBonus: governmentBonus,
            allowanceBonus: allowanceBonus
        )
    }
}

private struct WebSalaryConfig: Decodable {
    let year: Int
    let simpleTaxType: SimpleTaxType
    let childCount: Int?
    let sscCategory: SSCCategory
    let birthDate: String
    let yearlyNonTaxBenefit: Decimal
    let yearlyTaxableBenefit: Decimal
    let enableCOLA: Bool?

    func toConfig() -> SalaryCalculatorConfig {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd"
        dateFormatter.calendar = Calendar(identifier: .gregorian)
        let date = dateFormatter.date(from: birthDate)
            ?? DateComponents(calendar: .init(identifier: .gregorian), year: 1990, month: 1, day: 1).date
            ?? Date()

        return SalaryCalculatorConfig(
            year: year,
            simpleTaxType: simpleTaxType,
            childCount: childCount ?? 0,
            sscCategory: sscCategory,
            birthDate: date,
            yearlyNonTaxBenefit: yearlyNonTaxBenefit,
            yearlyTaxableBenefit: yearlyTaxableBenefit,
            enableCOLA: enableCOLA ?? true
        )
    }
}

private struct WebSalaryFixtureInput: Decodable {
    let inputs: [WebSalaryInput]
    let config: WebSalaryConfig
}

private struct WebSalaryExpected: Decodable {
    let month: WebMonth
    let grossTotal: Decimal
    let sscBase: Decimal
    let sscTax: Decimal
    let incomeBase: Decimal
    let cumulativeIncomeBase: Decimal
    let cumulativeTax: Decimal
    let incomeTax: Decimal
    let net: Decimal
    let paid: Decimal
    let governmentBonus: Decimal
}

// MARK: - Simple Fixture Decodable Types

private struct MortgageExpected: Decodable {
    let loanAmount: Decimal
    let depositAmount: Decimal
    let monthlyPayment: Decimal
    let totalInterest: Decimal
    let totalCost: Decimal
    let ltvRatio: Decimal
    let numberOfPayments: Int
}

private struct LoanExpected: Decodable {
    let monthlyPayment: Decimal
    let totalRepayment: Decimal
    let totalInterest: Decimal
    let numberOfPayments: Int
}

private struct SavingsExpected: Decodable {
    let finalBalanceGross: Decimal
    let totalContributions: Decimal
    let totalInterestGross: Decimal
    let withholdingTax: Decimal
    let totalInterestNet: Decimal
    let finalBalanceNet: Decimal
}

private struct PensionTwoThirdsExpected: Decodable {
    let isEligible: Bool
    let retirementAge: Int
    let requiredYears: Int
    let effectiveYears: Int
    let proportion: Decimal
    let pensionableIncome: Decimal
    let isMPICapped: Bool
    let baseAnnualPension: Decimal
    let annualPension: Decimal
    let monthlyPension: Decimal
    let annualCola: Decimal
}

private struct PensionCappedExpected: Decodable {
    let isEligible: Bool
    let retirementAge: Int
    let pensionableIncome: Decimal
    let isMPICapped: Bool
    let mpi: Decimal
    let baseAnnualPension: Decimal
    let annualPension: Decimal
    let monthlyPension: Decimal
    let privateTaxCredit: Decimal
    let privateContribution: Decimal
}

private struct VacationExpected: Decodable {
    let baseHours: Decimal
    let publicHolidayHours: Decimal
    let totalHours: Decimal
    let totalDays: Decimal
    let isProRata: Bool
}

private struct VehicleRegTaxExpected: Decodable {
    let totalTax: Decimal
    let co2Tax: Decimal
    let ageDiscount: Decimal
    let ecoDiscount: Decimal
    let importDuty: Decimal
    let vat: Decimal
}

private struct ChildrenAllowanceExpected: Decodable {
    let totalIncome: Decimal
    let netIncome: Decimal
    let weeklyPerChild: Decimal
    let yearlyPerChild: Decimal
    let yearlyForAll: Decimal
    let quarterlyPayment: Decimal
    let rateType: AllowanceRateType
}

private struct ImportVehicleExpected: Decodable {
    let vehicleValueEUR: Decimal
    let registrationTax: Decimal
    let importDuty: Decimal
    let vat: Decimal
    let shippingCostEUR: Decimal
    let vrtFee: Decimal
    let numberPlatesFee: Decimal
    let totalCost: Decimal
    let totalTaxesFees: Decimal
}

// MARK: - Golden Fixture Tests

@Suite("Golden: Salary Calculator")
struct SalaryGoldenTests {
    @Test("2026 single 25k matches web golden")
    func salary2026Single25k() async throws {
        let fixture: GoldenFixture<WebSalaryFixtureInput, [WebSalaryExpected]> =
            try GoldenLoader.load("salary_2026_single_25k")

        let config = fixture.input.config.toConfig()
        let inputs = fixture.input.inputs.map { $0.toSalaryInput() }

        let taxConfig = try await TaxConfigStore.shared.load()
        let calculator = SalaryCalculator(config: config, taxConfig: taxConfig)
        let output = try calculator.calculate(inputs: inputs)

        try #require(output.count == fixture.expected.count)
        for (actual, expected) in zip(output, fixture.expected) {
            assertMoney(actual.net, expected.net, label: "\(actual.month) net")
            assertMoney(actual.sscTax, expected.sscTax, label: "\(actual.month) sscTax")
            assertMoney(actual.incomeTax, expected.incomeTax, label: "\(actual.month) incomeTax")
            assertMoney(actual.grossTotal, expected.grossTotal, label: "\(actual.month) grossTotal")
            assertMoney(actual.governmentBonus, expected.governmentBonus, label: "\(actual.month) govBonus")
        }
    }

    @Test("2026 married 2 children 35k matches web golden")
    func salary2026Married2child35k() async throws {
        let fixture: GoldenFixture<WebSalaryFixtureInput, [WebSalaryExpected]> =
            try GoldenLoader.load("salary_2026_married_2child_35k")

        let config = fixture.input.config.toConfig()
        let inputs = fixture.input.inputs.map { $0.toSalaryInput() }

        let taxConfig = try await TaxConfigStore.shared.load()
        let calculator = SalaryCalculator(config: config, taxConfig: taxConfig)
        let output = try calculator.calculate(inputs: inputs)

        try #require(output.count == fixture.expected.count)
        for (actual, expected) in zip(output, fixture.expected) {
            assertMoney(actual.net, expected.net, label: "\(actual.month) net")
            assertMoney(actual.sscTax, expected.sscTax, label: "\(actual.month) sscTax")
            assertMoney(actual.incomeTax, expected.incomeTax, label: "\(actual.month) incomeTax")
        }
    }

    @Test("2025 parent 28k matches web golden")
    func salary2025Parent28k() async throws {
        let fixture: GoldenFixture<WebSalaryFixtureInput, [WebSalaryExpected]> =
            try GoldenLoader.load("salary_2025_parent_28k")

        let config = fixture.input.config.toConfig()
        let inputs = fixture.input.inputs.map { $0.toSalaryInput() }

        let taxConfig = try await TaxConfigStore.shared.load()
        let calculator = SalaryCalculator(config: config, taxConfig: taxConfig)
        let output = try calculator.calculate(inputs: inputs)

        try #require(output.count == fixture.expected.count)
        for (actual, expected) in zip(output, fixture.expected) {
            assertMoney(actual.net, expected.net, label: "\(actual.month) net")
            assertMoney(actual.sscTax, expected.sscTax, label: "\(actual.month) sscTax")
            assertMoney(actual.incomeTax, expected.incomeTax, label: "\(actual.month) incomeTax")
        }
    }

    @Test("1962 pensioner (born 1960) SSC category A 20k matches web golden")
    func salary1962Pensioner20k() async throws {
        let fixture: GoldenFixture<WebSalaryFixtureInput, [WebSalaryExpected]> =
            try GoldenLoader.load("salary_1962_pensioner_20k")

        let config = fixture.input.config.toConfig()
        let inputs = fixture.input.inputs.map { $0.toSalaryInput() }

        let taxConfig = try await TaxConfigStore.shared.load()
        let calculator = SalaryCalculator(config: config, taxConfig: taxConfig)
        let output = try calculator.calculate(inputs: inputs)

        try #require(output.count == fixture.expected.count)
        for (actual, expected) in zip(output, fixture.expected) {
            assertMoney(actual.net, expected.net, label: "\(actual.month) net")
            assertMoney(actual.sscTax, expected.sscTax, label: "\(actual.month) sscTax")
            assertMoney(actual.incomeTax, expected.incomeTax, label: "\(actual.month) incomeTax")
        }
    }
}

@Suite("Golden: Mortgage Calculator")
struct MortgageGoldenTests {
    /// Minimal expected type for the old 300k fixture (no monthlyPayment field).
    private struct MortgageBasicExpected: Decodable {
        let loanAmount: Decimal
        let depositAmount: Decimal
        let numberOfPayments: Int
        let ltvRatio: Decimal
    }

    @Test("300k 25y 4.5% matches web golden")
    func mortgage300k() throws {
        let fixture: GoldenFixture<MortgageInput, MortgageBasicExpected> =
            try GoldenLoader.load("mortgage_300k_25y_4.5")

        let calc = MortgageCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.loanAmount == fixture.expected.loanAmount)
        #expect(output.depositAmount == fixture.expected.depositAmount)
        #expect(output.numberOfPayments == fixture.expected.numberOfPayments)
        #expect(output.ltvRatio == fixture.expected.ltvRatio)
    }

    @Test("500k 30y min deposit matches web golden")
    func mortgage500k() throws {
        let fixture: GoldenFixture<MortgageInput, MortgageExpected> =
            try GoldenLoader.load("mortgage_500k_30y_min_deposit")

        let calc = MortgageCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.loanAmount == fixture.expected.loanAmount)
        #expect(output.depositAmount == fixture.expected.depositAmount)
        #expect(output.numberOfPayments == fixture.expected.numberOfPayments)
        assertMoney(output.monthlyPayment, fixture.expected.monthlyPayment, label: "monthlyPayment")
        assertMoney(output.totalInterest, fixture.expected.totalInterest, label: "totalInterest")
    }
}

@Suite("Golden: Personal Loan Calculator")
struct PersonalLoanGoldenTests {
    @Test("10k 5y matches web golden")
    func loan10k5y() throws {
        let fixture: GoldenFixture<LoanInput, LoanExpected> =
            try GoldenLoader.load("personal_loan_10k_5y")

        let calc = PersonalLoanCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.numberOfPayments == fixture.expected.numberOfPayments)
        assertMoney(output.monthlyPayment, fixture.expected.monthlyPayment, label: "monthlyPayment")
        assertMoney(output.totalInterest, fixture.expected.totalInterest, label: "totalInterest")
        assertMoney(output.totalRepayment, fixture.expected.totalRepayment, label: "totalRepayment")
    }
}

@Suite("Golden: Stamp Duty Calculator")
struct StampDutyGoldenTests {
    private struct StampDutyExpected: Decodable {
        let stampDuty: Decimal
        let exemptedAmount: Decimal
        let taxableAmount: Decimal
        let savings: Decimal?
    }

    @Test("Standard rate matches web golden")
    func standardRate() throws {
        let fixture: GoldenFixture<StampDutyInput, StampDutyExpected> =
            try GoldenLoader.load("stamp_duty_standard")

        let calc = StampDutyCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.stampDuty, fixture.expected.stampDuty, label: "stampDuty")
        assertMoney(output.exemptedAmount, fixture.expected.exemptedAmount, label: "exemptedAmount")
        assertMoney(output.taxableAmount, fixture.expected.taxableAmount, label: "taxableAmount")
    }

    @Test("First-time buyer matches web golden")
    func firstTimeBuyer() throws {
        let fixture: GoldenFixture<StampDutyInput, StampDutyExpected> =
            try GoldenLoader.load("stamp_duty_first_time")

        let calc = StampDutyCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.stampDuty, fixture.expected.stampDuty, label: "stampDuty")
        assertMoney(output.exemptedAmount, fixture.expected.exemptedAmount, label: "exemptedAmount")
        if let expectedSavings = fixture.expected.savings {
            assertMoney(output.savings, expectedSavings, label: "savings")
        }
    }
}

@Suite("Golden: Savings Calculator")
struct SavingsGoldenTests {
    @Test("100k 5y monthly compound matches web golden")
    func savings100k5y() throws {
        let fixture: GoldenFixture<SavingsInput, SavingsExpected> =
            try GoldenLoader.load("savings_100k_5y_compound")

        let calc = SavingsCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.finalBalanceGross, fixture.expected.finalBalanceGross, tolerance: 1, label: "finalBalanceGross")
        assertMoney(output.totalInterestGross, fixture.expected.totalInterestGross, tolerance: 1, label: "totalInterestGross")
        assertMoney(output.withholdingTax, fixture.expected.withholdingTax, tolerance: 1, label: "withholdingTax")
        assertMoney(output.totalInterestNet, fixture.expected.totalInterestNet, tolerance: 1, label: "totalInterestNet")
        assertMoney(output.finalBalanceNet, fixture.expected.finalBalanceNet, tolerance: 1, label: "finalBalanceNet")
    }
}

@Suite("Golden: Pension Calculator")
struct PensionGoldenTests {
    @Test("Two-thirds pension matches web golden")
    func pensionTwoThirds() throws {
        let fixture: GoldenFixture<PensionInput, PensionTwoThirdsExpected> =
            try GoldenLoader.load("pension_two_thirds")

        let calc = PensionCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.isEligible == fixture.expected.isEligible)
        #expect(output.retirementAge == fixture.expected.retirementAge)
        #expect(output.requiredYears == fixture.expected.requiredYears)
        #expect(output.effectiveYears == fixture.expected.effectiveYears)
        #expect(output.isMPICapped == fixture.expected.isMPICapped)
        assertMoney(output.pensionableIncome, fixture.expected.pensionableIncome, label: "pensionableIncome")
        assertMoney(output.baseAnnualPension, fixture.expected.baseAnnualPension, label: "baseAnnualPension")
        assertMoney(output.annualPension, fixture.expected.annualPension, label: "annualPension")
        assertMoney(output.monthlyPension, fixture.expected.monthlyPension, label: "monthlyPension")
        assertMoney(output.annualCola, fixture.expected.annualCola, label: "annualCola")
    }

    @Test("Capped at MPI matches web golden")
    func pensionCappedMPI() throws {
        let fixture: GoldenFixture<PensionInput, PensionCappedExpected> =
            try GoldenLoader.load("pension_capped_mpi")

        let calc = PensionCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.isEligible == fixture.expected.isEligible)
        #expect(output.retirementAge == fixture.expected.retirementAge)
        #expect(output.isMPICapped == fixture.expected.isMPICapped)
        assertMoney(output.pensionableIncome, fixture.expected.pensionableIncome, label: "pensionableIncome")
        assertMoney(output.baseAnnualPension, fixture.expected.baseAnnualPension, label: "baseAnnualPension")
        assertMoney(output.annualPension, fixture.expected.annualPension, label: "annualPension")
        assertMoney(output.monthlyPension, fixture.expected.monthlyPension, label: "monthlyPension")
        assertMoney(output.privateTaxCredit, fixture.expected.privateTaxCredit, label: "privateTaxCredit")
        assertMoney(output.privateContribution, fixture.expected.privateContribution, label: "privateContribution")
    }
}

@Suite("Golden: Overtime Calculator")
struct OvertimeGoldenTests {
    private struct OvertimeExpected: Decodable {
        let multiplier: Decimal
        let overtimeRate: Decimal
        let totalOvertimePay: Decimal
    }

    @Test("Weekend overtime matches web golden")
    func overtimeWeekend() throws {
        let fixture: GoldenFixture<OvertimeInput, OvertimeExpected> =
            try GoldenLoader.load("overtime_weekend")

        let calc = OvertimeCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.totalOvertimePay, fixture.expected.totalOvertimePay, label: "totalOvertimePay")
        #expect(output.multiplier == fixture.expected.multiplier)
    }
}

@Suite("Golden: Vacation Calculator")
struct VacationGoldenTests {
    @Test("Full-time matches web golden")
    func vacationFullTime() throws {
        let fixture: GoldenFixture<VacationInput, VacationExpected> =
            try GoldenLoader.load("vacation_full_time")

        let calc = VacationCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.baseHours, fixture.expected.baseHours, label: "baseHours")
        assertMoney(output.totalHours, fixture.expected.totalHours, label: "totalHours")
        #expect(output.isProRata == fixture.expected.isProRata)
    }

    @Test("Part-time 20h matches web golden")
    func vacationPartTime20h() throws {
        let fixture: GoldenFixture<VacationInput, VacationExpected> =
            try GoldenLoader.load("vacation_part_time_20h")

        let calc = VacationCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.baseHours, fixture.expected.baseHours, label: "baseHours")
        assertMoney(output.totalHours, fixture.expected.totalHours, label: "totalHours")
        #expect(output.isProRata == fixture.expected.isProRata)
    }
}

@Suite("Golden: Notice Period Calculator")
struct NoticePeriodGoldenTests {
    private struct NoticePeriodExpected: Decodable {
        let weeks: Int
        let days: Int
    }

    @Test("5 years matches web golden")
    func noticePeriod5Years() throws {
        let fixture: GoldenFixture<NoticePeriodInput, NoticePeriodExpected> =
            try GoldenLoader.load("notice_period_5_years")

        let calc = NoticePeriodCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.weeks == fixture.expected.weeks)
        #expect(output.days == fixture.expected.days)
    }
}

@Suite("Golden: Vehicle Registration Tax")
struct VehicleRegTaxGoldenTests {
    @Test("Low CO2 (electric) matches web golden")
    func co2Low() throws {
        let fixture: GoldenFixture<VehicleRegistrationTaxInput, VehicleRegTaxExpected> =
            try GoldenLoader.load("vehicle_reg_tax_co2_low")

        let calc = VehicleRegistrationTaxCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.totalTax, fixture.expected.totalTax, label: "totalTax")
        assertMoney(output.co2Tax, fixture.expected.co2Tax, label: "co2Tax")
        assertMoney(output.ecoDiscount, fixture.expected.ecoDiscount, label: "ecoDiscount")
    }

    @Test("High CO2 (diesel) matches web golden")
    func co2High() throws {
        let fixture: GoldenFixture<VehicleRegistrationTaxInput, VehicleRegTaxExpected> =
            try GoldenLoader.load("vehicle_reg_tax_co2_high")

        let calc = VehicleRegistrationTaxCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.totalTax, fixture.expected.totalTax, label: "totalTax")
        assertMoney(output.co2Tax, fixture.expected.co2Tax, label: "co2Tax")
        assertMoney(output.ageDiscount, fixture.expected.ageDiscount, label: "ageDiscount")
    }
}

@Suite("Golden: Children's Allowance")
struct ChildrenAllowanceGoldenTests {
    @Test("3 kids low income matches web golden")
    func children3kids() throws {
        let fixture: GoldenFixture<ChildrensAllowanceInput, ChildrenAllowanceExpected> =
            try GoldenLoader.load("children_allowance_3kids")

        let calc = ChildrensAllowanceCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.rateType == fixture.expected.rateType)
        assertMoney(output.totalIncome, fixture.expected.totalIncome, label: "totalIncome")
        assertMoney(output.netIncome, fixture.expected.netIncome, label: "netIncome")
        assertMoney(output.weeklyPerChild, fixture.expected.weeklyPerChild, label: "weeklyPerChild")
        assertMoney(output.yearlyForAll, fixture.expected.yearlyForAll, label: "yearlyForAll")
        assertMoney(output.quarterlyPayment, fixture.expected.quarterlyPayment, label: "quarterlyPayment")
    }
}

@Suite("Golden: Import Vehicle")
struct ImportVehicleGoldenTests {
    @Test("Non-EU GBP import matches web golden")
    func importVehicleTotal() throws {
        let fixture: GoldenFixture<ImportVehicleInput, ImportVehicleExpected> =
            try GoldenLoader.load("import_vehicle_total")

        let calc = ImportVehicleCalculator()
        let output = calc.calculate(input: fixture.input)

        // Vehicle import uses rounded-to-0 amounts, so tolerance is 1 EUR
        let tol: Money = 1
        assertMoney(output.vehicleValueEUR, fixture.expected.vehicleValueEUR, tolerance: tol, label: "vehicleValueEUR")
        assertMoney(output.registrationTax, fixture.expected.registrationTax, tolerance: tol, label: "registrationTax")
        assertMoney(output.importDuty, fixture.expected.importDuty, tolerance: tol, label: "importDuty")
        assertMoney(output.vat, fixture.expected.vat, tolerance: tol, label: "vat")
        assertMoney(output.shippingCostEUR, fixture.expected.shippingCostEUR, tolerance: tol, label: "shippingCostEUR")
        assertMoney(output.totalCost, fixture.expected.totalCost, tolerance: tol, label: "totalCost")
        assertMoney(output.totalTaxesFees, fixture.expected.totalTaxesFees, tolerance: tol, label: "totalTaxesFees")
    }
}

// TaxConfigStore concurrency tests moved to TaxConfigStoreTests.swift
