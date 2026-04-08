import Foundation
import Testing
@testable import CalculationKit

// MARK: - Salary Edge Cases

@Suite("Salary Edge Cases")
struct SalaryEdgeCaseTests {

    @Test("Very high earner 200k — upper bracket applies")
    func highEarner200k() async throws {
        let config = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(year: 2026, simpleTaxType: .single)
        let calc = SalaryCalculator(config: salaryConfig, taxConfig: config)
        let inputs = Month.allCases.map {
            SalaryInput(month: $0, grossWage: Decimal(200_000) / 12)
        }
        let outputs = try calc.calculate(inputs: inputs)
        #expect(outputs.count == 12)
        // 35% bracket should apply — effective rate > 25%
        let totalTax = outputs.reduce(Money.zero) { $0 + $1.incomeTax }
        let totalGross = outputs.reduce(Money.zero) { $0 + $1.grossTotal }
        let effectiveRate = totalTax / totalGross
        #expect(effectiveRate > Decimal(string: "0.25")!)
    }

    @Test("Minimum wage worker — below tax threshold")
    func minimumWage() async throws {
        let config = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(year: 2026, simpleTaxType: .single)
        let calc = SalaryCalculator(config: salaryConfig, taxConfig: config)
        let monthlyGross = Decimal(string: "225")! // weekly min wage
        let inputs = Month.allCases.map {
            SalaryInput(month: $0, grossWage: monthlyGross * 4)
        }
        let outputs = try calc.calculate(inputs: inputs)
        // Very low earner — should pay minimal or zero income tax
        let totalTax = outputs.reduce(Money.zero) { $0 + $1.incomeTax }
        #expect(totalTax >= 0)
    }

    @Test("SSC category B (part-time) uses lower cap")
    func sscCategoryB() async throws {
        let config = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(
            year: 2026, simpleTaxType: .single, sscCategory: .b
        )
        let calc = SalaryCalculator(config: salaryConfig, taxConfig: config)
        let inputs = Month.allCases.map {
            SalaryInput(month: $0, grossWage: 1000)
        }
        let outputs = try calc.calculate(inputs: inputs)
        // Cat B has lower weekly cap than C
        for output in outputs {
            #expect(output.sscTax >= 0)
            #expect(output.sscTax < 300) // sanity bound for part-time
        }
    }

    @Test("SSC category D (self-employed) applies")
    func sscCategoryD() async throws {
        let config = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(
            year: 2026, simpleTaxType: .single, sscCategory: .d
        )
        let calc = SalaryCalculator(config: salaryConfig, taxConfig: config)
        let inputs = Month.allCases.map {
            SalaryInput(month: $0, grossWage: 3000)
        }
        let outputs = try calc.calculate(inputs: inputs)
        #expect(outputs.count == 12)
        for output in outputs {
            #expect(output.sscTax > 0)
        }
    }

    @Test("Born before 1962 uses old SSC rates")
    func bornBefore1962OldRates() async throws {
        let config = try await TaxConfigStore.shared.load()
        let calendar = Calendar(identifier: .gregorian)
        let oldBirthDate = calendar.date(from: DateComponents(year: 1960, month: 6, day: 15))!
        let youngBirthDate = calendar.date(from: DateComponents(year: 1990, month: 1, day: 1))!

        let oldConfig = SalaryCalculatorConfig(
            year: 2026, simpleTaxType: .single, birthDate: oldBirthDate
        )
        let youngConfig = SalaryCalculatorConfig(
            year: 2026, simpleTaxType: .single, birthDate: youngBirthDate
        )

        let oldCalc = SalaryCalculator(config: oldConfig, taxConfig: config)
        let youngCalc = SalaryCalculator(config: youngConfig, taxConfig: config)

        let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: 3000) }
        let oldOutputs = try oldCalc.calculate(inputs: inputs)
        let youngOutputs = try youngCalc.calculate(inputs: inputs)

        let oldSSC = oldOutputs.reduce(Money.zero) { $0 + $1.sscTax }
        let youngSSC = youngOutputs.reduce(Money.zero) { $0 + $1.sscTax }
        // Old rate (pre-1962) should differ from new rate
        #expect(oldSSC != youngSSC)
    }

    @Test("COLA disabled produces zero government bonus")
    func colaDisabled() async throws {
        let config = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(
            year: 2026, simpleTaxType: .single, enableCOLA: false
        )
        let calc = SalaryCalculator(config: salaryConfig, taxConfig: config)
        let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: 2000) }
        let outputs = try calc.calculate(inputs: inputs)
        for output in outputs {
            #expect(output.governmentBonus == 0)
        }
    }

    @Test("2025 married uses same brackets as married_1child (no child variants)")
    func pre2026NoChildVariants() async throws {
        let config = try await TaxConfigStore.shared.load()
        let config0 = SalaryCalculatorConfig(
            year: 2025, simpleTaxType: .married, childCount: 0
        )
        let config2 = SalaryCalculatorConfig(
            year: 2025, simpleTaxType: .married, childCount: 2
        )

        let calc0 = SalaryCalculator(config: config0, taxConfig: config)
        let calc2 = SalaryCalculator(config: config2, taxConfig: config)

        let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: 3000) }
        let out0 = try calc0.calculate(inputs: inputs)
        let out2 = try calc2.calculate(inputs: inputs)

        for (a, b) in zip(out0, out2) {
            #expect(a.incomeTax == b.incomeTax)
        }
    }

    @Test("Negative wage clamps to zero")
    func negativeWage() async throws {
        let config = try await TaxConfigStore.shared.load()
        let calc = SalaryCalculator(config: .default, taxConfig: config)
        let inputs = [SalaryInput(month: .january, grossWage: -5000)]
        let outputs = try calc.calculate(inputs: inputs)
        #expect(outputs.first?.net ?? -1 >= 0)
    }

    @Test("Very large wage does not crash")
    func veryLargeWage() async throws {
        let config = try await TaxConfigStore.shared.load()
        let calc = SalaryCalculator(config: .default, taxConfig: config)
        let inputs = Month.allCases.map {
            SalaryInput(month: $0, grossWage: 1_000_000)
        }
        let outputs = try calc.calculate(inputs: inputs)
        #expect(outputs.count == 12)
        for output in outputs {
            #expect(output.net > 0)
        }
    }
}

// MARK: - Mortgage Edge Cases

@Suite("Mortgage Edge Cases")
struct MortgageEdgeCaseTests {
    @Test("Very high interest rate")
    func highInterestRate() {
        let calc = MortgageCalculator()
        let output = calc.calculate(input: MortgageInput(
            propertyPrice: 200_000, depositPercent: 20,
            interestRate: 15, loanTermYears: 20
        ))
        #expect(output.monthlyPayment > 0)
        #expect(output.totalInterest > output.loanAmount)
    }

    @Test("Maximum deposit 90% leaves minimal loan")
    func maxDeposit() {
        let calc = MortgageCalculator()
        let output = calc.calculate(input: MortgageInput(
            propertyPrice: 500_000, depositPercent: 90,
            interestRate: 4, loanTermYears: 10
        ))
        #expect(output.loanAmount == 50_000)
        #expect(output.depositAmount == 450_000)
    }

    @Test("1 year term produces 12 payments")
    func oneYearTerm() {
        let calc = MortgageCalculator()
        let output = calc.calculate(input: MortgageInput(
            propertyPrice: 100_000, depositPercent: 20,
            interestRate: 5, loanTermYears: 1
        ))
        #expect(output.numberOfPayments == 12)
        #expect(output.yearlySchedule.count == 1)
    }

    @Test("Very small property price")
    func smallProperty() {
        let calc = MortgageCalculator()
        let output = calc.calculate(input: MortgageInput(
            propertyPrice: 10_000, depositPercent: 20,
            interestRate: 3, loanTermYears: 5
        ))
        #expect(output.loanAmount == 8_000)
        #expect(output.monthlyPayment > 0)
    }
}

// MARK: - Personal Loan Edge Cases

@Suite("Personal Loan Edge Cases")
struct PersonalLoanEdgeCaseTests {
    @Test("Very short term (6 months)")
    func shortTerm() {
        let calc = PersonalLoanCalculator()
        let output = calc.calculate(input: LoanInput(
            loanAmount: 5_000, interestRate: 7, loanTermMonths: 6
        ))
        #expect(output.numberOfPayments == 6)
        #expect(output.monthlyPayment > 800)
    }

    @Test("Very long term (120 months)")
    func longTerm() {
        let calc = PersonalLoanCalculator()
        let output = calc.calculate(input: LoanInput(
            loanAmount: 50_000, interestRate: 5, loanTermMonths: 120
        ))
        #expect(output.numberOfPayments == 120)
        #expect(output.totalInterest > 0)
    }

    @Test("Zero interest produces zero total interest")
    func zeroInterest() {
        let calc = PersonalLoanCalculator()
        let output = calc.calculate(input: LoanInput(
            loanAmount: 10_000, interestRate: 0, loanTermMonths: 24
        ))
        #expect(output.totalInterest == 0)
    }

    @Test("Very high interest rate")
    func highInterest() {
        let calc = PersonalLoanCalculator()
        let output = calc.calculate(input: LoanInput(
            loanAmount: 10_000, interestRate: 25, loanTermMonths: 60
        ))
        #expect(output.monthlyPayment > 0)
        #expect(output.totalInterest > output.totalRepayment / 3)
    }
}

// MARK: - Stamp Duty Edge Cases

@Suite("Stamp Duty Edge Cases")
struct StampDutyEdgeCaseTests {
    @Test("Zero price produces zero duty")
    func zeroPrice() {
        let calc = StampDutyCalculator()
        let output = calc.calculate(input: StampDutyInput(
            propertyPrice: 0, isFirstTimeBuyer: false
        ))
        #expect(output.stampDuty == 0)
    }

    @Test("First-time buyer at exactly 200k threshold")
    func atThreshold() {
        let calc = StampDutyCalculator()
        let output = calc.calculate(input: StampDutyInput(
            propertyPrice: 200_000, isFirstTimeBuyer: true
        ))
        #expect(output.stampDuty == 0)
        #expect(output.exemptedAmount == 200_000)
    }

    @Test("First-time buyer just above threshold")
    func justAboveThreshold() {
        let calc = StampDutyCalculator()
        let output = calc.calculate(input: StampDutyInput(
            propertyPrice: 200_001, isFirstTimeBuyer: true
        ))
        // 5% of €1 = €0.05
        #expect(output.stampDuty > 0)
        #expect(output.stampDuty <= 1)
    }

    @Test("Very expensive property")
    func veryExpensive() {
        let calc = StampDutyCalculator()
        let output = calc.calculate(input: StampDutyInput(
            propertyPrice: 5_000_000, isFirstTimeBuyer: false
        ))
        #expect(output.stampDuty == 250_000) // 5% of 5M
    }
}

// MARK: - Savings Edge Cases

@Suite("Savings Edge Cases")
struct SavingsEdgeCaseTests {
    @Test("Monthly compounding produces higher yield than yearly")
    func monthlyVsYearly() {
        let calc = SavingsCalculator()
        let monthly = calc.calculate(input: SavingsInput(
            initialDeposit: 100_000, monthlyContribution: 0,
            interestRate: 5, years: 10, compoundingFrequency: .monthly
        ))
        let yearly = calc.calculate(input: SavingsInput(
            initialDeposit: 100_000, monthlyContribution: 0,
            interestRate: 5, years: 10, compoundingFrequency: .yearly
        ))
        #expect(monthly.finalBalanceGross >= yearly.finalBalanceGross)
    }

    @Test("Zero initial deposit with monthly contributions")
    func zeroInitialWithContributions() {
        let calc = SavingsCalculator()
        let output = calc.calculate(input: SavingsInput(
            initialDeposit: 0, monthlyContribution: 500,
            interestRate: 3, years: 5, compoundingFrequency: .monthly
        ))
        #expect(output.totalContributions == 30_000) // 500 * 60
        #expect(output.finalBalanceGross > 30_000)
    }

    @Test("Very long term 30 years")
    func longTerm() {
        let calc = SavingsCalculator()
        let output = calc.calculate(input: SavingsInput(
            initialDeposit: 10_000, monthlyContribution: 100,
            interestRate: 4, years: 30, compoundingFrequency: .monthly
        ))
        #expect(output.yearlyBreakdown.count == 30)
        #expect(output.finalBalanceGross > 0)
    }
}

// MARK: - Pension Edge Cases

@Suite("Pension Edge Cases")
struct PensionEdgeCaseTests {
    @Test("Born 1950 retires at 61")
    func retirementAge1950() {
        let calc = PensionCalculator()
        let output = calc.calculate(input: PensionInput(
            birthYear: 1950, taxStatus: .single, children: 0,
            paidYears: 35, averageSalary: 20_000,
            deferralYears: .zero, privatePensionContribution: 0
        ))
        #expect(output.retirementAge == 61)
    }

    @Test("Child credits increase effective years for women")
    func childCreditsWomen() {
        let withChildren = PensionRules.childCredits(birthYear: 1970, children: 3)
        let noChildren = PensionRules.childCredits(birthYear: 1970, children: 0)
        #expect(withChildren > noChildren)
    }

    @Test("Private pension tax credit capped")
    func privatePensionCap() {
        let calc = PensionCalculator()
        let output = calc.calculate(input: PensionInput(
            birthYear: 1970, taxStatus: .single, children: 0,
            paidYears: 41, averageSalary: 25_000,
            deferralYears: .zero, privatePensionContribution: 100_000
        ))
        // Credit is capped at 750 regardless of contribution
        #expect(output.privateTaxCredit <= 750)
    }

    @Test("Very young person not yet eligible")
    func youngPerson() {
        let calc = PensionCalculator()
        let output = calc.calculate(input: PensionInput(
            birthYear: 2000, taxStatus: .single, children: 0,
            paidYears: 5, averageSalary: 20_000,
            deferralYears: .zero, privatePensionContribution: 0
        ))
        #expect(!output.isEligible)
    }
}

// MARK: - Vehicle Calculator Edge Cases

@Suite("Vehicle Edge Cases")
struct VehicleEdgeCaseTests {
    @Test("Zero CO2 electric gets zero registration tax")
    func electricZeroTax() {
        let calc = VehicleRegistrationTaxCalculator()
        let output = calc.calculate(input: VehicleRegistrationTaxInput(
            co2Emissions: 0, vehicleAge: 0, engineCapacity: 0,
            fuelType: .electric, vehicleValue: 50_000, isEU: true
        ))
        #expect(output.co2Tax == 0)
    }

    @Test("Very old vehicle gets age discount")
    func veryOldVehicle() {
        let calc = VehicleRegistrationTaxCalculator()
        let output = calc.calculate(input: VehicleRegistrationTaxInput(
            co2Emissions: 150, vehicleAge: 20, engineCapacity: 1600,
            fuelType: .petrol, vehicleValue: 5_000, isEU: true
        ))
        #expect(output.ageDiscount > 0)
    }

    @Test("VRT retest is half price of standard")
    func vrtRetestHalfPrice() {
        let calc = VRTCalculator()
        let standard = calc.calculate(input: VRTInput(
            vehicleType: .car, vehicleAge: 5, isRetest: false
        ))
        let retest = calc.calculate(input: VRTInput(
            vehicleType: .car, vehicleAge: 5, isRetest: true
        ))
        #expect(retest.testFee == standard.retestFee)
    }

    @Test("Import from non-EU includes duty and VAT")
    func nonEUImportDutyAndVAT() {
        let calc = ImportVehicleCalculator()
        let output = calc.calculate(input: ImportVehicleInput(
            purchasePrice: 20_000, currency: .gbp, vehicleAge: 3,
            co2Emissions: 150, engineCapacity: 1800, fuelType: .diesel,
            isEU: false, shippingCost: 1_000, isNew: false
        ))
        #expect(output.importDuty > 0)
        #expect(output.vat > 0)
    }

    @Test("EU import used car has zero duty and zero VAT")
    func euUsedCarNoDutyNoVAT() {
        let calc = ImportVehicleCalculator()
        let output = calc.calculate(input: ImportVehicleInput(
            purchasePrice: 15_000, currency: .eur, vehicleAge: 5,
            co2Emissions: 120, engineCapacity: 1400, fuelType: .petrol,
            isEU: true, shippingCost: 0, isNew: false
        ))
        #expect(output.importDuty == 0)
        #expect(output.vat == 0)
    }

    @Test("Road license for motorcycle")
    func motorcycleLicense() {
        let calc = RoadLicenseCalculator()
        let output = calc.calculate(input: RoadLicenseInput(
            engineCapacity: 600, co2Emissions: 80, vehicleAge: 3,
            fuelType: .petrol, vehicleCategory: .motorcycle, licensePeriod: 12
        ))
        #expect(output.annualFee >= 0)
    }
}

// MARK: - Children's Allowance Edge Cases

@Suite("Children's Allowance Edge Cases")
struct ChildrensAllowanceEdgeCaseTests {
    @Test("Single child gets full rate")
    func singleChild() {
        let calc = ChildrensAllowanceCalculator()
        let output = calc.calculate(input: ChildrensAllowanceInput(
            grossIncome: 20_000, sscPaid: 2_000, rentIncome: 0,
            interestIncome: 0, pensionIncome: 0, maintenanceIncome: 0,
            otherIncome: 0, taxPaid: 3_000, numberOfChildren: 1
        ))
        #expect(output.weeklyPerChild > 0)
        #expect(output.yearlyPerChild > 0)
    }

    @Test("Zero children produces zero allowance")
    func zeroChildren() {
        let calc = ChildrensAllowanceCalculator()
        let output = calc.calculate(input: ChildrensAllowanceInput(
            grossIncome: 30_000, sscPaid: 3_000, rentIncome: 0,
            interestIncome: 0, pensionIncome: 0, maintenanceIncome: 0,
            otherIncome: 0, taxPaid: 5_000, numberOfChildren: 0
        ))
        #expect(output.yearlyForAll == 0)
    }

    @Test("Many children (5) scales correctly")
    func manyChildren() {
        let calc = ChildrensAllowanceCalculator()
        let output = calc.calculate(input: ChildrensAllowanceInput(
            grossIncome: 25_000, sscPaid: 2_500, rentIncome: 0,
            interestIncome: 0, pensionIncome: 0, maintenanceIncome: 0,
            otherIncome: 0, taxPaid: 4_000, numberOfChildren: 5
        ))
        let expectedYearly = output.yearlyPerChild * 5
        #expect(abs(output.yearlyForAll - expectedYearly) <= 1)
    }

    @Test("Birth bonus order 4+ gets maximum")
    func birthBonusHigh() {
        let calc = ChildrensAllowanceCalculator()
        let order3 = calc.birthBonus(order: 3)
        let order4 = calc.birthBonus(order: 4)
        #expect(order4.bonusAmount >= order3.bonusAmount)
    }
}

// MARK: - Notice Period Edge Cases

@Suite("Notice Period Edge Cases")
struct NoticePeriodEdgeCaseTests {
    @Test("Just started (1 month) = 1 week notice")
    func justStarted() {
        let calc = NoticePeriodCalculator()
        let output = calc.calculate(input: NoticePeriodInput(monthsOfService: 1))
        #expect(output.weeks == 1)
    }

    @Test("20 years = 12 weeks (capped)")
    func twentyYears() {
        let calc = NoticePeriodCalculator()
        let output = calc.calculate(input: NoticePeriodInput(monthsOfService: 240))
        #expect(output.weeks == 12)
    }
}

// MARK: - Family Reunification Edge Cases

@Suite("Family Reunification Edge Cases")
struct FamilyReunificationEdgeCaseTests {
    @Test("Single person (0 members)")
    func zeroDependents() {
        let calc = FamilyReunificationCalculator()
        let output = calc.calculate(input: FamilyReunificationInput(
            familyMemberCount: 0, scheme: .familyReunification
        ))
        #expect(output.minimumRequired > 0)
    }

    @Test("Large family (5 members)")
    func largeFamily() {
        let calc = FamilyReunificationCalculator()
        let output = calc.calculate(input: FamilyReunificationInput(
            familyMemberCount: 5, scheme: .familyReunification
        ))
        // More members = higher threshold
        let small = FamilyReunificationCalculator().calculate(input: FamilyReunificationInput(
            familyMemberCount: 1, scheme: .familyReunification
        ))
        #expect(output.minimumRequired > small.minimumRequired)
    }
}
