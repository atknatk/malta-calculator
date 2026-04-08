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

// MARK: - Extended Golden Fixture Decodable Types

private struct RetirementAgeExpected: Decodable {
    let retirementAge: Int
    let retirementYear: Int
    let eligibleForEarlyRetirement: Bool?
    let yearsUntilRetirement: Int?
}

private struct OvertimeExpected: Decodable {
    let multiplier: Decimal
    let overtimeRate: Decimal
    let totalOvertimePay: Decimal
}

private struct RoadLicenseExpected: Decodable {
    let annualFee: Decimal
    let baseFee: Decimal
    let co2Surcharge: Decimal
    let ecoDiscount: Decimal?
}

private struct DriversLicenseExpected: Decodable {
    let totalCost: Decimal
    let licenseFee: Decimal
    let theoryTestFee: Decimal
    let practicalTestFee: Decimal
    let medicalFee: Decimal
    let photoFee: Decimal
}

private struct VRTExpected: Decodable {
    let testFee: Decimal
    let retestFee: Decimal
    let nextTestDue: Int?
    let frequency: String?
}

private struct VehicleRegFeeExpected: Decodable {
    let administrationFee: Decimal
    let platesFee: Decimal
    let vrtInspectionFee: Decimal
    let totalFee: Decimal
}

private struct FamilyReunificationExpected: Decodable {
    let minimumRequired: Decimal
    let incomeType: String
    let baseWage: Decimal
    let additionalAmount: Decimal
    let percentagePerMember: Decimal
}

private struct ChildrenAllowanceLowIncomeExpected: Decodable {
    let totalIncome: Decimal
    let netIncome: Decimal
    let weeklyPerChild: Decimal
    let yearlyPerChild: Decimal
    let yearlyForAll: Decimal
    let quarterlyPayment: Decimal
    let rateType: AllowanceRateType
}

// MARK: - Mortgage Extended Golden Tests

@Suite("Golden: Mortgage Extended")
struct MortgageExtendedGoldenTests {
    private struct MortgageFullExpected: Decodable {
        let loanAmount: Decimal
        let depositAmount: Decimal
        let monthlyPayment: Decimal
        let totalInterest: Decimal
        let totalCost: Decimal
        let ltvRatio: Decimal
        let numberOfPayments: Int
    }

    @Test("Zero interest rate matches golden")
    func mortgageZeroInterest() throws {
        let fixture: GoldenFixture<MortgageInput, MortgageFullExpected> =
            try GoldenLoader.load("mortgage_zero_interest")

        let calc = MortgageCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.loanAmount == fixture.expected.loanAmount)
        #expect(output.depositAmount == fixture.expected.depositAmount)
        #expect(output.numberOfPayments == fixture.expected.numberOfPayments)
        assertMoney(output.monthlyPayment, fixture.expected.monthlyPayment, label: "monthlyPayment")
        assertMoney(output.totalInterest, fixture.expected.totalInterest, label: "totalInterest")
        assertMoney(output.totalCost, fixture.expected.totalCost, label: "totalCost")
        #expect(output.ltvRatio == fixture.expected.ltvRatio)
    }
}

// MARK: - Personal Loan Extended Golden Tests

@Suite("Golden: Personal Loan Extended")
struct PersonalLoanExtendedGoldenTests {
    private struct LoanExpected: Decodable {
        let monthlyPayment: Decimal
        let totalRepayment: Decimal
        let totalInterest: Decimal
        let numberOfPayments: Int
    }

    @Test("50k 7y matches golden")
    func loan50k7y() throws {
        let fixture: GoldenFixture<LoanInput, LoanExpected> =
            try GoldenLoader.load("personal_loan_50k_7y")

        let calc = PersonalLoanCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.numberOfPayments == fixture.expected.numberOfPayments)
        assertMoney(output.monthlyPayment, fixture.expected.monthlyPayment, tolerance: 1, label: "monthlyPayment")
        assertMoney(output.totalInterest, fixture.expected.totalInterest, tolerance: 1, label: "totalInterest")
        assertMoney(output.totalRepayment, fixture.expected.totalRepayment, tolerance: 1, label: "totalRepayment")
    }
}

// MARK: - Stamp Duty Extended Golden Tests

@Suite("Golden: Stamp Duty Extended")
struct StampDutyExtendedGoldenTests {
    private struct StampDutyExpected: Decodable {
        let stampDuty: Decimal
        let exemptedAmount: Decimal
        let taxableAmount: Decimal
        let savings: Decimal?
    }

    @Test("Below exemption first-time buyer matches golden")
    func belowExemption() throws {
        let fixture: GoldenFixture<StampDutyInput, StampDutyExpected> =
            try GoldenLoader.load("stamp_duty_below_exemption")

        let calc = StampDutyCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.stampDuty, fixture.expected.stampDuty, label: "stampDuty")
        assertMoney(output.exemptedAmount, fixture.expected.exemptedAmount, label: "exemptedAmount")
        assertMoney(output.taxableAmount, fixture.expected.taxableAmount, label: "taxableAmount")
        if let expectedSavings = fixture.expected.savings {
            assertMoney(output.savings, expectedSavings, label: "savings")
        }
    }
}

// MARK: - Savings Extended Golden Tests

@Suite("Golden: Savings Extended")
struct SavingsExtendedGoldenTests {
    private struct SavingsExpected: Decodable {
        let finalBalanceGross: Decimal
        let totalContributions: Decimal
        let totalInterestGross: Decimal
        let withholdingTax: Decimal
        let totalInterestNet: Decimal
        let finalBalanceNet: Decimal
    }

    @Test("15% withholding tax on yearly compound matches golden")
    func savingsWithTax() throws {
        let fixture: GoldenFixture<SavingsInput, SavingsExpected> =
            try GoldenLoader.load("savings_with_15_tax")

        let calc = SavingsCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.finalBalanceGross, fixture.expected.finalBalanceGross, tolerance: 1, label: "finalBalanceGross")
        assertMoney(output.totalInterestGross, fixture.expected.totalInterestGross, tolerance: 1, label: "totalInterestGross")
        assertMoney(output.withholdingTax, fixture.expected.withholdingTax, tolerance: 1, label: "withholdingTax")
        assertMoney(output.totalInterestNet, fixture.expected.totalInterestNet, tolerance: 1, label: "totalInterestNet")
        assertMoney(output.finalBalanceNet, fixture.expected.finalBalanceNet, tolerance: 1, label: "finalBalanceNet")
    }
}

// MARK: - Overtime Extended Golden Tests

@Suite("Golden: Overtime Extended")
struct OvertimeExtendedGoldenTests {
    @Test("Weekday overtime matches golden")
    func overtimeWeekday() throws {
        let fixture: GoldenFixture<OvertimeInput, OvertimeExpected> =
            try GoldenLoader.load("overtime_weekday")

        let calc = OvertimeCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.totalOvertimePay, fixture.expected.totalOvertimePay, label: "totalOvertimePay")
        #expect(output.multiplier == fixture.expected.multiplier)
        assertMoney(output.overtimeRate, fixture.expected.overtimeRate, label: "overtimeRate")
    }
}

// MARK: - Retirement Age Golden Tests

@Suite("Golden: Retirement Age")
struct RetirementAgeGoldenTests {
    @Test("Born 1985 matches golden")
    func born1985() throws {
        let fixture: GoldenFixture<RetirementAgeInput, RetirementAgeExpected> =
            try GoldenLoader.load("retirement_age_1985")

        let calc = RetirementAgeCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.retirementAge == fixture.expected.retirementAge)
        #expect(output.retirementYear == fixture.expected.retirementYear)
    }

    @Test("Born 1955 matches golden")
    func born1955() throws {
        let fixture: GoldenFixture<RetirementAgeInput, RetirementAgeExpected> =
            try GoldenLoader.load("retirement_age_1955")

        let calc = RetirementAgeCalculator()
        let output = calc.calculate(input: fixture.input)

        #expect(output.retirementAge == fixture.expected.retirementAge)
        #expect(output.retirementYear == fixture.expected.retirementYear)
    }
}

// MARK: - Road License Golden Tests

@Suite("Golden: Road License")
struct RoadLicenseGoldenTests {
    @Test("1.6L petrol matches golden")
    func petrol1600() throws {
        let fixture: GoldenFixture<RoadLicenseInput, RoadLicenseExpected> =
            try GoldenLoader.load("road_license_petrol")

        let calc = RoadLicenseCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.annualFee, fixture.expected.annualFee, label: "annualFee")
        assertMoney(output.baseFee, fixture.expected.baseFee, label: "baseFee")
        assertMoney(output.co2Surcharge, fixture.expected.co2Surcharge, label: "co2Surcharge")
    }
}

// MARK: - Driver's License Golden Tests

@Suite("Golden: Driver's License")
struct DriversLicenseGoldenTests {
    @Test("New category B with all tests matches golden")
    func newBLicense() throws {
        let fixture: GoldenFixture<DriversLicenseInput, DriversLicenseExpected> =
            try GoldenLoader.load("drivers_license_b_new")

        let calc = DriversLicenseCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.totalCost, fixture.expected.totalCost, label: "totalCost")
        assertMoney(output.licenseFee, fixture.expected.licenseFee, label: "licenseFee")
        assertMoney(output.theoryTestFee, fixture.expected.theoryTestFee, label: "theoryTestFee")
        assertMoney(output.practicalTestFee, fixture.expected.practicalTestFee, label: "practicalTestFee")
        assertMoney(output.medicalFee, fixture.expected.medicalFee, label: "medicalFee")
        assertMoney(output.photoFee, fixture.expected.photoFee, label: "photoFee")
    }
}

// MARK: - VRT Golden Tests

@Suite("Golden: VRT")
struct VRTGoldenTests {
    @Test("5 year petrol car matches golden")
    func vrtPetrol5y() throws {
        let fixture: GoldenFixture<VRTInput, VRTExpected> =
            try GoldenLoader.load("vrt_petrol_5y")

        let calc = VRTCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.testFee, fixture.expected.testFee, label: "testFee")
        assertMoney(output.retestFee, fixture.expected.retestFee, label: "retestFee")
    }
}

// MARK: - Vehicle Registration Fee Golden Tests

@Suite("Golden: Vehicle Registration Fee")
struct VehicleRegFeeGoldenTests {
    @Test("New car random plates matches golden")
    func newCarRandomPlates() throws {
        let fixture: GoldenFixture<VehicleRegistrationFeeInput, VehicleRegFeeExpected> =
            try GoldenLoader.load("vehicle_reg_fee_new")

        let calc = VehicleRegistrationFeeCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.administrationFee, fixture.expected.administrationFee, label: "administrationFee")
        assertMoney(output.platesFee, fixture.expected.platesFee, label: "platesFee")
        assertMoney(output.vrtInspectionFee, fixture.expected.vrtInspectionFee, label: "vrtInspectionFee")
        assertMoney(output.totalFee, fixture.expected.totalFee, label: "totalFee")
    }
}

// MARK: - Family Reunification Golden Tests

@Suite("Golden: Family Reunification")
struct FamilyReunificationGoldenTests {
    @Test("3 family members matches golden")
    func familyReunification3() throws {
        let fixture: GoldenFixture<FamilyReunificationInput, FamilyReunificationExpected> =
            try GoldenLoader.load("family_reunification_3")

        let calc = FamilyReunificationCalculator()
        let output = calc.calculate(input: fixture.input)

        assertMoney(output.minimumRequired, fixture.expected.minimumRequired, label: "minimumRequired")
        #expect(output.incomeType == fixture.expected.incomeType)
        assertMoney(output.baseWage, fixture.expected.baseWage, label: "baseWage")
        assertMoney(output.additionalAmount, fixture.expected.additionalAmount, label: "additionalAmount")
    }
}

// MARK: - Children's Allowance Extended Golden Tests

@Suite("Golden: Children's Allowance Extended")
struct ChildrenAllowanceExtendedGoldenTests {
    @Test("Low income matches golden")
    func lowIncome() throws {
        let fixture: GoldenFixture<ChildrensAllowanceInput, ChildrenAllowanceLowIncomeExpected> =
            try GoldenLoader.load("children_allowance_low_income")

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
