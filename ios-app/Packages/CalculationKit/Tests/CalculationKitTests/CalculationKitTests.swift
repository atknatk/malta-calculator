import Foundation
import Testing
@testable import CalculationKit

// MARK: - Bootstrap

@Suite("CalculationKit Bootstrap")
struct CalculationKitBootstrapTests {
    @Test("Package exposes a semantic version string")
    func versionIsSemver() {
        let version = CalculationKit.version
        let parts = version.split(separator: ".")
        #expect(parts.count == 3)
        for part in parts {
            #expect(UInt(part) != nil)
        }
    }

    @Test("Money typealias is Foundation.Decimal")
    func moneyIsDecimal() {
        let value: Money = Decimal(string: "1234.56") ?? .zero
        #expect(value == Decimal(string: "1234.56"))
    }
}

// MARK: - Core Types

@Suite("Core Types")
struct CoreTypeTests {
    @Test("Month enum has 12 cases")
    func monthCount() {
        #expect(Month.allCases.count == 12)
    }

    @Test("Month index is zero-based")
    func monthIndex() {
        #expect(Month.january.index == 0)
        #expect(Month.december.index == 11)
    }

    @Test("COLA months are Mar/Jun/Sep/Dec")
    func colaMonths() {
        let colaMonths = Month.allCases.filter(\.isCOLAMonth)
        #expect(colaMonths.count == 4)
        #expect(colaMonths.contains(.march))
        #expect(colaMonths.contains(.december))
    }

    @Test("Decimal rounding uses bankers rounding")
    func decimalRounding() {
        let value: Decimal = Decimal(string: "1.235") ?? 0
        #expect(value.rounded(to: 2) == Decimal(string: "1.24"))
    }

    @Test("Percentage conversion")
    func percentageConversion() {
        let p = Percentage.fromPoints(25)
        #expect(p == Decimal(string: "0.25"))
        #expect(p.points == 25)
    }

    @Test("resolveTaxRateType for 2025 ignores children")
    func taxRateType2025() {
        let result = resolveTaxRateType(year: 2025, simpleType: .married, childCount: 2)
        #expect(result == .married)
    }

    @Test("resolveTaxRateType for 2026 with children")
    func taxRateType2026() {
        #expect(resolveTaxRateType(year: 2026, simpleType: .married, childCount: 0) == .married)
        #expect(resolveTaxRateType(year: 2026, simpleType: .married, childCount: 1) == .marriedOneChild)
        #expect(resolveTaxRateType(year: 2026, simpleType: .married, childCount: 3) == .marriedTwoPlus)
        #expect(resolveTaxRateType(year: 2026, simpleType: .parent, childCount: 1) == .parentOneChild)
    }

    @Test("DateHelpers.mondaysInMonth returns valid count")
    func mondaysInMonth() {
        let count = DateHelpers.mondaysInMonth(year: 2026, monthIndex: 0) // January 2026
        #expect(count >= 4 && count <= 5)
    }
}

// MARK: - Tax Config

@Suite("Tax Config")
struct TaxConfigTests {
    @Test("TaxConfigStore loads successfully")
    func loadConfig() async throws {
        let config = try await TaxConfigStore.shared.load()
        #expect(config.availableYears.contains(2026))
        #expect(config.availableYears.count >= 7)
    }

    @Test("2026 config has 7 bracket types")
    func bracketsFor2026() async throws {
        let config = try await TaxConfigStore.shared.load()
        let yearConfig = config.years[2026]
        #expect(yearConfig != nil)
        #expect(yearConfig?.brackets.count == 7)
    }

    @Test("SSC rates for 2026 are correct")
    func sscRates2026() async throws {
        let config = try await TaxConfigStore.shared.load()
        let ssc = config.years[2026]?.ssc
        #expect(ssc != nil)
        #expect(ssc?.categoryCNew == Decimal(string: "55.93"))
        #expect(ssc?.weeklyCapNew == Decimal(string: "559.31"))
    }

    @Test("COLA for 2026 March is 121.16")
    func cola2026() async throws {
        let config = try await TaxConfigStore.shared.load()
        let cola = config.years[2026]?.cola
        #expect(cola?.amount(for: .march) == Decimal(string: "121.16"))
        #expect(cola?.amount(for: .january) == 0)
    }
}

// MARK: - Salary Calculator

@Suite("Salary Calculator")
struct SalaryCalculatorTests {
    @Test("Single 25k annual produces 12 month outputs")
    func salary12Months() async throws {
        let config = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(year: 2026, simpleTaxType: .single)
        let calculator = SalaryCalculator(config: salaryConfig, taxConfig: config)
        let monthlyGross = Decimal(25000) / 12
        let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: monthlyGross) }
        let outputs = try calculator.calculate(inputs: inputs)
        #expect(outputs.count == 12)
        for output in outputs {
            #expect(output.net > 0)
            #expect(output.sscTax >= 0)
            #expect(output.incomeTax >= 0)
        }
    }

    @Test("Salary summary computes correct totals")
    func salarySummary() async throws {
        let config = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(year: 2026, simpleTaxType: .single)
        let calculator = SalaryCalculator(config: salaryConfig, taxConfig: config)
        let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: Decimal(2500)) }
        let outputs = try calculator.calculate(inputs: inputs)
        let summary = SalarySummary(from: outputs)
        #expect(summary.annualGross > 0)
        #expect(summary.annualNet > 0)
        #expect(summary.annualNet < summary.annualGross)
        #expect(summary.effectiveTaxRate > 0 && summary.effectiveTaxRate < 1)
    }

    @Test("SSC for category A uses flat rate")
    func sscCategoryA() async throws {
        let config = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(year: 2026, simpleTaxType: .single, sscCategory: .a)
        let calculator = SalaryCalculator(config: salaryConfig, taxConfig: config)
        let inputs = [SalaryInput(month: .january, grossWage: 2000)]
        let outputs = try calculator.calculate(inputs: inputs)
        #expect(outputs.first?.sscTax ?? 0 > 0)
    }

    @Test("COLA is added in March, June, September, December")
    func colaMonths() async throws {
        let config = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(year: 2026, simpleTaxType: .single, enableCOLA: true)
        let calculator = SalaryCalculator(config: salaryConfig, taxConfig: config)
        let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: 2000) }
        let outputs = try calculator.calculate(inputs: inputs)
        // March should have government bonus > 0
        let marchOutput = outputs.first(where: { $0.month == .march })
        #expect(marchOutput?.governmentBonus ?? 0 > 0)
        // January should have 0
        let janOutput = outputs.first(where: { $0.month == .january })
        #expect(janOutput?.governmentBonus == 0)
    }

    @Test("Zero wage produces zero output")
    func zeroWage() async throws {
        let config = try await TaxConfigStore.shared.load()
        let calculator = SalaryCalculator(config: .default, taxConfig: config)
        let inputs = [SalaryInput(month: .january, grossWage: 0)]
        let outputs = try calculator.calculate(inputs: inputs)
        #expect(outputs.first?.net == 0)
    }
}

// MARK: - Mortgage Calculator

@Suite("Mortgage Calculator")
struct MortgageCalculatorTests {
    @Test("300k property with 20% deposit, 4.5%, 25 years")
    func mortgage300k() {
        let calc = MortgageCalculator()
        let output = calc.calculate(input: MortgageInput(
            propertyPrice: 300000, depositPercent: 20,
            interestRate: Decimal(string: "4.5") ?? 4, loanTermYears: 25
        ))
        #expect(output.loanAmount == 240000)
        #expect(output.depositAmount == 60000)
        #expect(output.numberOfPayments == 300)
        #expect(output.ltvRatio == 80)
        #expect(output.monthlyPayment > 1000)
        #expect(output.totalInterest > 0)
        #expect(output.yearlySchedule.count == 25)
    }

    @Test("Minimum deposit enforced at 10%")
    func minimumDeposit() {
        let calc = MortgageCalculator()
        let output = calc.calculate(input: MortgageInput(
            propertyPrice: 200000, depositPercent: 5,
            interestRate: 4, loanTermYears: 20
        ))
        #expect(output.depositAmount == 20000)
        #expect(output.ltvRatio == 90)
    }

    @Test("Zero interest rate produces no interest")
    func zeroInterest() {
        let calc = MortgageCalculator()
        let output = calc.calculate(input: MortgageInput(
            propertyPrice: 120000, depositPercent: 20,
            interestRate: 0, loanTermYears: 10
        ))
        #expect(output.totalInterest == 0)
        #expect(output.monthlyPayment == 800)
    }
}

// MARK: - Personal Loan Calculator

@Suite("Personal Loan Calculator")
struct PersonalLoanCalculatorTests {
    @Test("10k loan at 7.5% for 60 months")
    func loan10k() {
        let calc = PersonalLoanCalculator()
        let output = calc.calculate(input: LoanInput(
            loanAmount: 10000, interestRate: Decimal(string: "7.5") ?? 7, loanTermMonths: 60
        ))
        #expect(output.numberOfPayments == 60)
        #expect(output.monthlyPayment > 100)
        #expect(output.totalInterest > 0)
        #expect(output.monthlySchedule.count == 60)
    }
}

// MARK: - Stamp Duty Calculator

@Suite("Stamp Duty Calculator")
struct StampDutyCalculatorTests {
    @Test("Standard 5% on 350k property")
    func standardRate() {
        let calc = StampDutyCalculator()
        let output = calc.calculate(input: StampDutyInput(propertyPrice: 350000, isFirstTimeBuyer: false))
        #expect(output.stampDuty == 17500)
        #expect(output.exemptedAmount == 0)
        #expect(output.taxableAmount == 350000)
    }

    @Test("First-time buyer gets 200k exemption")
    func firstTimeBuyer() {
        let calc = StampDutyCalculator()
        let output = calc.calculate(input: StampDutyInput(propertyPrice: 350000, isFirstTimeBuyer: true))
        #expect(output.stampDuty == 7500)
        #expect(output.exemptedAmount == 200000)
        #expect(output.taxableAmount == 150000)
        #expect(output.savings == 10000)
    }

    @Test("First-time buyer below 200k pays nothing")
    func firstTimeBuyerBelow200k() {
        let calc = StampDutyCalculator()
        let output = calc.calculate(input: StampDutyInput(propertyPrice: 180000, isFirstTimeBuyer: true))
        #expect(output.stampDuty == 0)
        #expect(output.exemptedAmount == 180000)
    }
}

// MARK: - Savings Calculator

@Suite("Savings Calculator")
struct SavingsCalculatorTests {
    @Test("100k deposit, 3%, 5 years, monthly compounding")
    func savings100k() {
        let calc = SavingsCalculator()
        let output = calc.calculate(input: SavingsInput(
            initialDeposit: 100000, monthlyContribution: 0,
            interestRate: 3, years: 5, compoundingFrequency: .monthly
        ))
        #expect(output.finalBalanceGross > 100000)
        #expect(output.totalInterestGross > 0)
        #expect(output.withholdingTax > 0)
        #expect(output.totalInterestNet < output.totalInterestGross)
        #expect(output.yearlyBreakdown.count == 5)
    }

    @Test("Withholding tax is 15% of gross interest")
    func withholdingTax() {
        let calc = SavingsCalculator()
        let output = calc.calculate(input: SavingsInput(
            initialDeposit: 10000, monthlyContribution: 0,
            interestRate: 5, years: 1, compoundingFrequency: .yearly
        ))
        let expectedTax = output.totalInterestGross * Decimal(string: "0.15")!
        #expect(abs(output.withholdingTax - expectedTax) <= 1)
    }
}

// MARK: - Pension Calculator

@Suite("Pension Calculator")
struct PensionCalculatorTests {
    @Test("Eligible person gets pension")
    func eligiblePension() {
        let calc = PensionCalculator()
        let output = calc.calculate(input: PensionInput(
            birthYear: 1970, taxStatus: .single, children: 0,
            paidYears: 41, averageSalary: 25000,
            deferralYears: .zero, privatePensionContribution: 0
        ))
        #expect(output.isEligible)
        #expect(output.annualPension > 0)
        #expect(output.monthlyPension > 0)
        #expect(output.retirementAge == 65)
    }

    @Test("Insufficient years makes ineligible")
    func ineligible() {
        let calc = PensionCalculator()
        let output = calc.calculate(input: PensionInput(
            birthYear: 1980, taxStatus: .single, children: 0,
            paidYears: 5, averageSalary: 20000,
            deferralYears: .zero, privatePensionContribution: 0
        ))
        #expect(!output.isEligible)
        #expect(output.baseAnnualPension == 0)
    }

    @Test("Private pension tax credit capped at 750")
    func privatePensionCredit() {
        let calc = PensionCalculator()
        let output = calc.calculate(input: PensionInput(
            birthYear: 1970, taxStatus: .single, children: 0,
            paidYears: 41, averageSalary: 25000,
            deferralYears: .zero, privatePensionContribution: 5000
        ))
        #expect(output.privateTaxCredit == 750)
        #expect(output.privateContribution == 3000)
    }

    @Test("Deferral bonus increases pension")
    func deferralBonus() {
        let calc = PensionCalculator()
        let base = calc.calculate(input: PensionInput(
            birthYear: 1960, taxStatus: .single, children: 0,
            paidYears: 40, averageSalary: 25000,
            deferralYears: .zero, privatePensionContribution: 0
        ))
        let deferred = calc.calculate(input: PensionInput(
            birthYear: 1960, taxStatus: .single, children: 0,
            paidYears: 40, averageSalary: 25000,
            deferralYears: .four, privatePensionContribution: 0
        ))
        #expect(deferred.annualPension > base.annualPension)
    }
}

// MARK: - Pension Rules

@Suite("Pension Rules")
struct PensionRulesTests {
    @Test("Required years by birth year")
    func requiredYears() {
        #expect(PensionRules.requiredYears(birthYear: 1955) == 35)
        #expect(PensionRules.requiredYears(birthYear: 1965) == 40)
        #expect(PensionRules.requiredYears(birthYear: 1972) == 41)
        #expect(PensionRules.requiredYears(birthYear: 1980) == 42)
    }

    @Test("Retirement age by birth year")
    func retirementAge() {
        #expect(PensionRules.retirementAge(birthYear: 1950) == 61)
        #expect(PensionRules.retirementAge(birthYear: 1954) == 62)
        #expect(PensionRules.retirementAge(birthYear: 1957) == 63)
        #expect(PensionRules.retirementAge(birthYear: 1960) == 64)
        #expect(PensionRules.retirementAge(birthYear: 1970) == 65)
    }

    @Test("Child credits")
    func childCredits() {
        #expect(PensionRules.childCredits(birthYear: 1970, children: 2) == 8)
        #expect(PensionRules.childCredits(birthYear: 1955, children: 2) == 4)
        #expect(PensionRules.childCredits(birthYear: 1970, children: 5) == 12) // capped at 3
    }

    @Test("Deferral bonus rate")
    func deferralRate() {
        #expect(PensionRules.deferralBonusRate(.zero) == 0)
        #expect(PensionRules.deferralBonusRate(.one) == Decimal(string: "0.05"))
        #expect(PensionRules.deferralBonusRate(.four) == Decimal(string: "0.29"))
    }
}

// MARK: - Retirement Age Calculator

@Suite("Retirement Age Calculator")
struct RetirementAgeCalculatorTests {
    @Test("Born 1970 retires at 65")
    func retireAt65() {
        let calc = RetirementAgeCalculator()
        let output = calc.calculate(input: RetirementAgeInput(birthYear: 1970))
        #expect(output.retirementAge == 65)
        #expect(output.retirementYear == 2035)
    }

    @Test("Born 1950 male retires at 61")
    func retireAt61() {
        let calc = RetirementAgeCalculator()
        let output = calc.calculate(input: RetirementAgeInput(birthYear: 1950, gender: .male))
        #expect(output.retirementAge == 61)
    }
}

// MARK: - Overtime Calculator

@Suite("Overtime Calculator")
struct OvertimeCalculatorTests {
    @Test("Weekday overtime is 1.5x")
    func weekdayOvertime() {
        let calc = OvertimeCalculator()
        let output = calc.calculate(input: OvertimeInput(
            hourlyRate: 10, overtimeHours: 4, overtimeType: .weekday
        ))
        #expect(output.multiplier == Decimal(string: "1.5"))
        #expect(output.overtimeRate == 15)
        #expect(output.totalOvertimePay == 60)
    }

    @Test("Sunday overtime is 2x")
    func sundayOvertime() {
        let calc = OvertimeCalculator()
        let output = calc.calculate(input: OvertimeInput(
            hourlyRate: 15, overtimeHours: 8, overtimeType: .sunday
        ))
        #expect(output.multiplier == 2)
        #expect(output.totalOvertimePay == 240)
    }

    @Test("Calculate hourly from annual salary")
    func hourlyFromAnnual() {
        let calc = OvertimeCalculator()
        let output = calc.calculate(input: OvertimeInput(
            hourlyRate: 0, overtimeHours: 1, overtimeType: .weekday,
            annualSalary: 31200
        ))
        #expect(output.baseHourlyRate == 15)
    }
}

// MARK: - Vacation Calculator

@Suite("Vacation Calculator")
struct VacationCalculatorTests {
    @Test("Full-time 40h/week gets 192 base hours")
    func fullTime() {
        let calc = VacationCalculator()
        let output = calc.calculate(input: VacationInput(weeklyHours: 40, year: 2026))
        #expect(output.baseHours == 192)
        #expect(output.totalHours > 192)
        #expect(!output.isProRata)
    }

    @Test("Part-time 20h/week gets proportional hours")
    func partTime() {
        let calc = VacationCalculator()
        let output = calc.calculate(input: VacationInput(weeklyHours: 20, year: 2026))
        #expect(output.baseHours == 96) // 192 * 20/40
    }

    @Test("Pro-rata for 6 months worked")
    func proRata() {
        let calc = VacationCalculator()
        let output = calc.calculate(input: VacationInput(weeklyHours: 40, year: 2026, monthsWorked: 6))
        #expect(output.isProRata)
        #expect(output.proRataHours != nil)
        #expect(output.proRataHours ?? 0 < output.totalHours)
    }
}

// MARK: - Notice Period Calculator

@Suite("Notice Period Calculator")
struct NoticePeriodCalculatorTests {
    @Test("5 years (60 months) = 8 weeks")
    func fiveYears() {
        let calc = NoticePeriodCalculator()
        let output = calc.calculate(input: NoticePeriodInput(monthsOfService: 60))
        #expect(output.weeks == 8)
        #expect(output.days == 56)
        #expect(!output.isInProbation)
    }

    @Test("Less than 1 month probation = 0 weeks")
    func probationShort() {
        let calc = NoticePeriodCalculator()
        let output = calc.calculate(input: NoticePeriodInput(monthsOfService: 0, isInProbation: true))
        #expect(output.weeks == 0)
        #expect(output.isInProbation)
    }

    @Test("10+ years = 12 weeks")
    func tenPlusYears() {
        let calc = NoticePeriodCalculator()
        let output = calc.calculate(input: NoticePeriodInput(monthsOfService: 150))
        #expect(output.weeks == 12)
    }

    @Test("All brackets produce correct weeks")
    func allBrackets() {
        let calc = NoticePeriodCalculator()
        #expect(calc.calculate(input: NoticePeriodInput(monthsOfService: 3)).weeks == 1)
        #expect(calc.calculate(input: NoticePeriodInput(monthsOfService: 12)).weeks == 2)
        #expect(calc.calculate(input: NoticePeriodInput(monthsOfService: 36)).weeks == 4)
        #expect(calc.calculate(input: NoticePeriodInput(monthsOfService: 60)).weeks == 8)
        #expect(calc.calculate(input: NoticePeriodInput(monthsOfService: 90)).weeks == 9)
        #expect(calc.calculate(input: NoticePeriodInput(monthsOfService: 100)).weeks == 10)
        #expect(calc.calculate(input: NoticePeriodInput(monthsOfService: 115)).weeks == 11)
    }
}

// MARK: - Children's Allowance Calculator

@Suite("Children's Allowance Calculator")
struct ChildrensAllowanceCalculatorTests {
    @Test("Low income gets maximum rate")
    func lowIncome() {
        let calc = ChildrensAllowanceCalculator()
        let output = calc.calculate(input: ChildrensAllowanceInput(
            grossIncome: 5000, sscPaid: 0, rentIncome: 0,
            interestIncome: 0, pensionIncome: 0, maintenanceIncome: 0,
            otherIncome: 0, taxPaid: 0, numberOfChildren: 2
        ))
        #expect(output.rateType == .maximum)
        #expect(output.weeklyPerChild == Decimal(string: "27.29"))
    }

    @Test("High income gets fixed rate")
    func highIncome() {
        let calc = ChildrensAllowanceCalculator()
        let output = calc.calculate(input: ChildrensAllowanceInput(
            grossIncome: 50000, sscPaid: 0, rentIncome: 0,
            interestIncome: 0, pensionIncome: 0, maintenanceIncome: 0,
            otherIncome: 0, taxPaid: 0, numberOfChildren: 1
        ))
        #expect(output.rateType == .fixed)
        #expect(output.weeklyPerChild == Decimal(string: "8.66"))
    }

    @Test("Birth bonus amounts")
    func birthBonus() {
        let calc = ChildrensAllowanceCalculator()
        #expect(calc.birthBonus(order: 1).bonusAmount == 1000)
        #expect(calc.birthBonus(order: 2).bonusAmount == 1500)
        #expect(calc.birthBonus(order: 3).bonusAmount == 2000)
        #expect(calc.birthBonus(order: 0).bonusAmount == 0)
    }
}

// MARK: - Family Reunification Calculator

@Suite("Family Reunification Calculator")
struct FamilyReunificationCalculatorTests {
    @Test("Family reunification scheme for 2 members")
    func familyReunification() {
        let calc = FamilyReunificationCalculator()
        let output = calc.calculate(input: FamilyReunificationInput(
            familyMemberCount: 2, scheme: .familyReunification
        ))
        let base = FamilyReunificationWageData.averageWageGross
        let expected = base + base * Decimal(string: "0.2")! * 2
        #expect(abs(output.minimumRequired - expected) <= 1)
        #expect(output.incomeType == "gross")
    }

    @Test("Family member policy for 1 member")
    func familyMemberPolicy() {
        let calc = FamilyReunificationCalculator()
        let output = calc.calculate(input: FamilyReunificationInput(
            familyMemberCount: 1, scheme: .familyMemberPolicy
        ))
        #expect(output.incomeType == "net")
        #expect(output.minimumRequired > FamilyReunificationWageData.medianWageNet)
    }
}

// MARK: - Vehicle Calculators

@Suite("Road License Calculator")
struct RoadLicenseCalculatorTests {
    @Test("1600cc petrol car")
    func car1600cc() {
        let calc = RoadLicenseCalculator()
        let output = calc.calculate(input: RoadLicenseInput(
            engineCapacity: 1600, co2Emissions: 140, vehicleAge: 5,
            fuelType: .petrol, vehicleCategory: .privateCar, licensePeriod: 12
        ))
        #expect(output.baseFee == 130)
        #expect(output.co2Surcharge == 40)
        #expect(output.annualFee == 170)
    }

    @Test("Electric car is free")
    func electricFree() {
        let calc = RoadLicenseCalculator()
        let output = calc.calculate(input: RoadLicenseInput(
            engineCapacity: 0, co2Emissions: 0, vehicleAge: 1,
            fuelType: .electric, vehicleCategory: .privateCar, licensePeriod: 12
        ))
        #expect(output.annualFee == 0)
    }

    @Test("Vintage vehicle flat fee")
    func vintage() {
        let calc = RoadLicenseCalculator()
        let output = calc.calculate(input: RoadLicenseInput(
            engineCapacity: 3000, co2Emissions: 300, vehicleAge: 30,
            fuelType: .petrol, vehicleCategory: .privateCar, licensePeriod: 12
        ))
        #expect(output.annualFee == 30)
    }
}

@Suite("Vehicle Registration Fee Calculator")
struct VehicleRegistrationFeeCalculatorTests {
    @Test("Basic car registration with random plates")
    func basicCar() {
        let calc = VehicleRegistrationFeeCalculator()
        let output = calc.calculate(input: VehicleRegistrationFeeInput(
            vehicleType: .car, plateType: .random, isImported: false
        ))
        #expect(output.administrationFee == 15)
        #expect(output.platesFee == 70)
        #expect(output.vrtInspectionFee == 0)
    }

    @Test("Imported vehicle has VRT fee")
    func importedVehicle() {
        let calc = VehicleRegistrationFeeCalculator()
        let output = calc.calculate(input: VehicleRegistrationFeeInput(
            vehicleType: .car, plateType: .random, isImported: true
        ))
        #expect(output.vrtInspectionFee == 55)
    }
}

@Suite("Vehicle Registration Tax Calculator")
struct VehicleRegistrationTaxCalculatorTests {
    @Test("Electric vehicle has zero CO2 tax")
    func electricZeroTax() {
        let calc = VehicleRegistrationTaxCalculator()
        let output = calc.calculate(input: VehicleRegistrationTaxInput(
            co2Emissions: 0, vehicleAge: 0, engineCapacity: 0,
            fuelType: .electric, vehicleValue: 40000, isEU: true
        ))
        #expect(output.co2Tax == 0)
        #expect(output.ecoDiscount == 0)
    }

    @Test("High CO2 produces significant tax")
    func highCO2() {
        let calc = VehicleRegistrationTaxCalculator()
        let output = calc.calculate(input: VehicleRegistrationTaxInput(
            co2Emissions: 200, vehicleAge: 0, engineCapacity: 2000,
            fuelType: .diesel, vehicleValue: 30000, isEU: true
        ))
        #expect(output.co2Tax > 0)
    }
}

@Suite("Driver's License Calculator")
struct DriversLicenseCalculatorTests {
    @Test("New first license category B with tests")
    func newFirstLicenseB() {
        let calc = DriversLicenseCalculator()
        let output = calc.calculate(input: DriversLicenseInput(
            licenseType: .new, age: 25, category: .b,
            validityPeriod: 10, includeTheoryTest: true,
            includePracticalTest: true, isFirstLicense: true
        ))
        #expect(output.licenseFee == 45) // 10 years
        #expect(output.theoryTestFee == 30)
        #expect(output.practicalTestFee == 60)
        #expect(output.medicalFee == 40)
        #expect(output.photoFee == 8)
        #expect(output.totalCost == 183)
    }

    @Test("Over 70 limited to 1 year validity")
    func over70() {
        let calc = DriversLicenseCalculator()
        let output = calc.calculate(input: DriversLicenseInput(
            licenseType: .renewal, age: 75, category: .b,
            validityPeriod: 10, includeTheoryTest: false,
            includePracticalTest: false, isFirstLicense: false
        ))
        #expect(output.validity == "1 year")
    }
}

@Suite("VRT Calculator")
struct VRTCalculatorTests {
    @Test("Car standard test fee")
    func carStandard() {
        let calc = VRTCalculator()
        let output = calc.calculate(input: VRTInput(vehicleType: .car, vehicleAge: 5, isRetest: false))
        #expect(output.testFee == 36)
        #expect(output.retestFee == 18)
    }

    @Test("Retest is half price")
    func retest() {
        let calc = VRTCalculator()
        let output = calc.calculate(input: VRTInput(vehicleType: .car, vehicleAge: 5, isRetest: true))
        #expect(output.testFee == 18)
    }

    @Test("New car doesn't need test yet")
    func newCarNoTest() {
        let calc = VRTCalculator()
        let output = calc.calculate(input: VRTInput(vehicleType: .car, vehicleAge: 1, isRetest: false))
        #expect(output.nextTestDue > 0) // 3 years × 12 months
        #expect(output.frequency == "First test required at 4 years old")
    }
}

@Suite("Import Vehicle Calculator")
struct ImportVehicleCalculatorTests {
    @Test("EU import used vehicle no VAT")
    func euUsedNoVAT() {
        let calc = ImportVehicleCalculator()
        let output = calc.calculate(input: ImportVehicleInput(
            purchasePrice: 20000, currency: .eur, vehicleAge: 3,
            co2Emissions: 130, engineCapacity: 1600, fuelType: .petrol,
            isEU: true, shippingCost: 500, isNew: false
        ))
        #expect(output.vat == 0)
        #expect(output.importDuty == 0)
        #expect(output.totalCost > output.vehicleValueEUR)
    }

    @Test("Non-EU import has duty and VAT")
    func nonEUImport() {
        let calc = ImportVehicleCalculator()
        let output = calc.calculate(input: ImportVehicleInput(
            purchasePrice: 15000, currency: .gbp, vehicleAge: 2,
            co2Emissions: 150, engineCapacity: 1800, fuelType: .diesel,
            isEU: false, shippingCost: 1000, isNew: false
        ))
        #expect(output.importDuty > 0)
        #expect(output.vat > 0)
        #expect(output.vrtFee == 36)
        #expect(output.numberPlatesFee == 35)
    }

    @Test("Electric import has zero registration tax")
    func electricImport() {
        let calc = ImportVehicleCalculator()
        let output = calc.calculate(input: ImportVehicleInput(
            purchasePrice: 45000, currency: .eur, vehicleAge: 0,
            co2Emissions: 0, engineCapacity: 0, fuelType: .electric,
            isEU: true, shippingCost: 0, isNew: true
        ))
        #expect(output.registrationTax == 0)
    }
}

// MARK: - Money & DateHelpers

@Suite("Money Helpers")
struct MoneyTests {
    @Test("EUR formatting")
    func eurFormat() {
        let value: Money = Decimal(string: "1234.56") ?? 0
        let formatted = value.eur
        #expect(formatted.contains("1") && formatted.contains("234"))
    }

    @Test("nonNegative clamps to zero")
    func nonNegative() {
        let negative: Money = -100
        #expect(negative.nonNegative == 0)
        let positive: Money = 50
        #expect(positive.nonNegative == 50)
    }

    @Test("applying percent")
    func applyingPercent() {
        let base: Money = 1000
        #expect(base.applying(percent: 10) == 100)
    }
}

// DateHelpers tests moved to TaxConfigStoreTests.swift
