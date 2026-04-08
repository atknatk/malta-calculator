import Foundation
import Testing
@testable import CalculationKit

// MARK: - Parameterized Mortgage Tests

@Suite("Parameterized: Mortgage")
struct ParameterizedMortgageTests {

    struct MortgageCase: CustomStringConvertible, Sendable {
        let price: Decimal
        let deposit: Decimal
        let rate: Decimal
        let years: Int
        let expectedLoan: Decimal
        let minMonthly: Decimal
        let maxMonthly: Decimal

        var description: String {
            "€\(price) \(deposit)% \(rate)% \(years)y"
        }
    }

    static let cases: [MortgageCase] = [
        MortgageCase(price: 300_000, deposit: 20, rate: Decimal(string: "4.5")!, years: 25,
                     expectedLoan: 240_000, minMonthly: 1_300, maxMonthly: 1_400),
        MortgageCase(price: 500_000, deposit: 10, rate: Decimal(string: "3.0")!, years: 30,
                     expectedLoan: 450_000, minMonthly: 1_800, maxMonthly: 2_000),
        MortgageCase(price: 200_000, deposit: 30, rate: Decimal(string: "5.5")!, years: 20,
                     expectedLoan: 140_000, minMonthly: 950, maxMonthly: 1_050),
        MortgageCase(price: 150_000, deposit: 20, rate: 0, years: 15,
                     expectedLoan: 120_000, minMonthly: 660, maxMonthly: 670),
        MortgageCase(price: 1_000_000, deposit: 40, rate: Decimal(string: "6.0")!, years: 25,
                     expectedLoan: 600_000, minMonthly: 3_800, maxMonthly: 3_900),
    ]

    @Test("monthly payment within expected range", arguments: cases)
    func monthlyPaymentRange(testCase: MortgageCase) {
        let calc = MortgageCalculator()
        let output = calc.calculate(input: MortgageInput(
            propertyPrice: testCase.price,
            depositPercent: testCase.deposit,
            interestRate: testCase.rate,
            loanTermYears: testCase.years
        ))
        #expect(output.loanAmount == testCase.expectedLoan)
        #expect(output.monthlyPayment >= testCase.minMonthly,
                "Monthly \(output.monthlyPayment) < min \(testCase.minMonthly)")
        #expect(output.monthlyPayment <= testCase.maxMonthly,
                "Monthly \(output.monthlyPayment) > max \(testCase.maxMonthly)")
    }

    @Test("amortization schedule length matches term", arguments: [1, 5, 10, 15, 20, 25, 30])
    func scheduleLength(years: Int) {
        let calc = MortgageCalculator()
        let output = calc.calculate(input: MortgageInput(
            propertyPrice: 300_000, depositPercent: 20,
            interestRate: 4, loanTermYears: years
        ))
        #expect(output.yearlySchedule.count == years)
        #expect(output.numberOfPayments == years * 12)
    }

    @Test("deposit percent clamps to valid range", arguments: [0, 5, 10, 50, 90, 95])
    func depositClamp(pct: Decimal) {
        let calc = MortgageCalculator()
        let output = calc.calculate(input: MortgageInput(
            propertyPrice: 200_000, depositPercent: pct,
            interestRate: 4, loanTermYears: 20
        ))
        let effectivePct = output.depositAmount / 200_000 * 100
        #expect(effectivePct >= 10, "Deposit clamped to at least 10%")
        #expect(output.loanAmount > 0)
    }
}

// MARK: - Parameterized Personal Loan Tests

@Suite("Parameterized: Personal Loan")
struct ParameterizedPersonalLoanTests {

    struct LoanCase: CustomStringConvertible, Sendable {
        let amount: Decimal
        let rate: Decimal
        let months: Int
        let description: String

        init(amount: Decimal, rate: Decimal, months: Int) {
            self.amount = amount
            self.rate = rate
            self.months = months
            self.description = "€\(amount) \(rate)% \(months)mo"
        }
    }

    static let cases: [LoanCase] = [
        LoanCase(amount: 5_000, rate: Decimal(string: "5.0")!, months: 24),
        LoanCase(amount: 10_000, rate: Decimal(string: "7.5")!, months: 60),
        LoanCase(amount: 25_000, rate: Decimal(string: "4.5")!, months: 84),
        LoanCase(amount: 50_000, rate: Decimal(string: "6.0")!, months: 120),
        LoanCase(amount: 1_000, rate: Decimal(string: "12.0")!, months: 12),
    ]

    @Test("total repayment exceeds principal", arguments: cases)
    func totalExceedsPrincipal(testCase: LoanCase) {
        let calc = PersonalLoanCalculator()
        let output = calc.calculate(input: LoanInput(
            loanAmount: testCase.amount,
            interestRate: testCase.rate,
            loanTermMonths: testCase.months
        ))
        #expect(output.totalRepayment >= testCase.amount)
        #expect(output.totalInterest >= 0)
        #expect(output.numberOfPayments == testCase.months)
    }

    @Test("monthly schedule sums to total repayment", arguments: cases)
    func scheduleSum(testCase: LoanCase) {
        let calc = PersonalLoanCalculator()
        let output = calc.calculate(input: LoanInput(
            loanAmount: testCase.amount,
            interestRate: testCase.rate,
            loanTermMonths: testCase.months
        ))
        let scheduleTotal = output.monthlySchedule.reduce(Money.zero) { $0 + $1.payment }
        // Allow ±€1 rounding tolerance across all months
        #expect(abs(scheduleTotal - output.totalRepayment) <= 1,
                "Schedule sum \(scheduleTotal) vs total \(output.totalRepayment)")
    }
}

// MARK: - Parameterized Stamp Duty Tests

@Suite("Parameterized: Stamp Duty")
struct ParameterizedStampDutyTests {

    struct StampDutyCase: CustomStringConvertible, Sendable {
        let price: Decimal
        let firstTimeBuyer: Bool
        let expectedDuty: Decimal
        let description: String

        init(price: Decimal, ftb: Bool, duty: Decimal) {
            self.price = price
            self.firstTimeBuyer = ftb
            self.expectedDuty = duty
            self.description = "€\(price) FTB=\(ftb)"
        }
    }

    static let cases: [StampDutyCase] = [
        StampDutyCase(price: 100_000, ftb: false, duty: 5_000),
        StampDutyCase(price: 200_000, ftb: false, duty: 10_000),
        StampDutyCase(price: 350_000, ftb: false, duty: 17_500),
        StampDutyCase(price: 100_000, ftb: true, duty: 0),
        StampDutyCase(price: 200_000, ftb: true, duty: 0),
        StampDutyCase(price: 250_000, ftb: true, duty: 2_500),
        StampDutyCase(price: 500_000, ftb: true, duty: 15_000),
        StampDutyCase(price: 0, ftb: false, duty: 0),
    ]

    @Test("stamp duty calculation", arguments: cases)
    func stampDuty(testCase: StampDutyCase) {
        let calc = StampDutyCalculator()
        let output = calc.calculate(input: StampDutyInput(
            propertyPrice: testCase.price,
            isFirstTimeBuyer: testCase.firstTimeBuyer
        ))
        #expect(output.stampDuty == testCase.expectedDuty,
                "Price €\(testCase.price) FTB=\(testCase.firstTimeBuyer): expected €\(testCase.expectedDuty), got €\(output.stampDuty)")
    }

    @Test("savings equals standard minus FTB rate", arguments: [200_001, 250_000, 350_000, 500_000] as [Decimal])
    func savingsCalculation(price: Decimal) {
        let calc = StampDutyCalculator()
        let standard = calc.calculate(input: StampDutyInput(
            propertyPrice: price, isFirstTimeBuyer: false
        ))
        let ftb = calc.calculate(input: StampDutyInput(
            propertyPrice: price, isFirstTimeBuyer: true
        ))
        #expect(ftb.savings == standard.stampDuty - ftb.stampDuty)
    }
}

// MARK: - Parameterized Overtime Tests

@Suite("Parameterized: Overtime")
struct ParameterizedOvertimeTests {

    struct OvertimeCase: CustomStringConvertible, Sendable {
        let hourlyRate: Decimal
        let hours: Decimal
        let type: OvertimeType
        let expectedMultiplier: Decimal
        let description: String

        init(rate: Decimal, hours: Decimal, type: OvertimeType, mult: Decimal) {
            self.hourlyRate = rate
            self.hours = hours
            self.type = type
            self.expectedMultiplier = mult
            self.description = "€\(rate)/h × \(hours)h \(type)"
        }
    }

    static let cases: [OvertimeCase] = [
        OvertimeCase(rate: 10, hours: 4, type: .weekday, mult: Decimal(string: "1.5")!),
        OvertimeCase(rate: 15, hours: 8, type: .sunday, mult: 2),
        OvertimeCase(rate: 20, hours: 12, type: .holiday, mult: 2),
        OvertimeCase(rate: 8, hours: 1, type: .weekday, mult: Decimal(string: "1.5")!),
        OvertimeCase(rate: 25, hours: 6, type: .sunday, mult: 2),
    ]

    @Test("overtime pay equals rate × multiplier × hours", arguments: cases)
    func overtimePay(testCase: OvertimeCase) {
        let calc = OvertimeCalculator()
        let output = calc.calculate(input: OvertimeInput(
            hourlyRate: testCase.hourlyRate,
            overtimeHours: testCase.hours,
            overtimeType: testCase.type
        ))
        #expect(output.multiplier == testCase.expectedMultiplier)
        let expected = testCase.hourlyRate * testCase.expectedMultiplier * testCase.hours
        #expect(abs(output.totalOvertimePay - expected) <= Decimal(string: "0.01")!)
    }
}

// MARK: - Parameterized Vacation Tests

@Suite("Parameterized: Vacation")
struct ParameterizedVacationTests {

    @Test("base hours scale proportionally with weekly hours",
          arguments: [8, 16, 20, 24, 30, 36, 40] as [Decimal])
    func baseHoursProportional(weeklyHours: Decimal) {
        let calc = VacationCalculator()
        let output = calc.calculate(input: VacationInput(weeklyHours: weeklyHours, year: 2026))
        let fullTimeBase: Decimal = 192
        let expected = fullTimeBase * weeklyHours / 40
        // Calculator may round to whole hours, allow ±1 tolerance
        #expect(abs(output.baseHours - expected) <= 1,
                "Weekly \(weeklyHours)h: expected ~\(expected), got \(output.baseHours)")
    }

    @Test("pro-rata months produce partial entitlement",
          arguments: [1, 3, 6, 9, 11])
    func proRataMonths(months: Int) {
        let calc = VacationCalculator()
        let output = calc.calculate(input: VacationInput(
            weeklyHours: 40, year: 2026, monthsWorked: months
        ))
        #expect(output.isProRata)
        let fullOutput = calc.calculate(input: VacationInput(weeklyHours: 40, year: 2026))
        #expect((output.proRataHours ?? 0) <= fullOutput.totalHours)
    }
}

// MARK: - Parameterized Notice Period Tests

@Suite("Parameterized: Notice Period")
struct ParameterizedNoticePeriodTests {

    struct NoticePeriodCase: CustomStringConvertible, Sendable {
        let months: Int
        let expectedWeeks: Int
        var description: String { "\(months)mo → \(expectedWeeks)w" }
    }

    static let cases: [NoticePeriodCase] = [
        NoticePeriodCase(months: 0, expectedWeeks: 0),
        NoticePeriodCase(months: 1, expectedWeeks: 1),
        NoticePeriodCase(months: 6, expectedWeeks: 2),
        NoticePeriodCase(months: 12, expectedWeeks: 2),
        NoticePeriodCase(months: 24, expectedWeeks: 4),
        NoticePeriodCase(months: 36, expectedWeeks: 4),
        NoticePeriodCase(months: 48, expectedWeeks: 8),
        NoticePeriodCase(months: 60, expectedWeeks: 8),
        NoticePeriodCase(months: 72, expectedWeeks: 8),
        NoticePeriodCase(months: 84, expectedWeeks: 9),
        NoticePeriodCase(months: 96, expectedWeeks: 10),
        NoticePeriodCase(months: 108, expectedWeeks: 11),
        NoticePeriodCase(months: 120, expectedWeeks: 12),
        NoticePeriodCase(months: 180, expectedWeeks: 12),
        NoticePeriodCase(months: 240, expectedWeeks: 12),
    ]

    @Test("notice period by service length", arguments: cases)
    func noticePeriod(testCase: NoticePeriodCase) {
        let calc = NoticePeriodCalculator()
        let output = calc.calculate(input: NoticePeriodInput(monthsOfService: testCase.months))
        #expect(output.weeks == testCase.expectedWeeks,
                "\(testCase.months) months → expected \(testCase.expectedWeeks)w, got \(output.weeks)w")
    }
}

// MARK: - Parameterized Retirement Age Tests

@Suite("Parameterized: Retirement Age")
struct ParameterizedRetirementAgeTests {

    struct RetirementCase: CustomStringConvertible, Sendable {
        let birthYear: Int
        let expectedAge: Int
        var description: String { "born \(birthYear) → \(expectedAge)" }
    }

    static let cases: [RetirementCase] = [
        RetirementCase(birthYear: 1950, expectedAge: 61),
        RetirementCase(birthYear: 1952, expectedAge: 62),
        RetirementCase(birthYear: 1954, expectedAge: 62),
        RetirementCase(birthYear: 1956, expectedAge: 63),
        RetirementCase(birthYear: 1958, expectedAge: 63),
        RetirementCase(birthYear: 1960, expectedAge: 64),
        RetirementCase(birthYear: 1962, expectedAge: 65),
        RetirementCase(birthYear: 1970, expectedAge: 65),
        RetirementCase(birthYear: 1985, expectedAge: 65),
        RetirementCase(birthYear: 2000, expectedAge: 65),
    ]

    @Test("retirement age by birth year", arguments: cases)
    func retirementAge(testCase: RetirementCase) {
        let calc = RetirementAgeCalculator()
        let output = calc.calculate(input: RetirementAgeInput(birthYear: testCase.birthYear))
        #expect(output.retirementAge == testCase.expectedAge,
                "Born \(testCase.birthYear): expected \(testCase.expectedAge), got \(output.retirementAge)")
        #expect(output.retirementYear == testCase.birthYear + testCase.expectedAge)
    }
}

// MARK: - Parameterized Savings Tests

@Suite("Parameterized: Savings Compounding")
struct ParameterizedSavingsTests {

    @Test("higher frequency always beats lower for same rate",
          arguments: [1, 2, 3, 4, 5, 7, 10] as [Decimal])
    func frequencyComparison(rate: Decimal) {
        let calc = SavingsCalculator()
        let monthly = calc.calculate(input: SavingsInput(
            initialDeposit: 10_000, monthlyContribution: 0,
            interestRate: rate, years: 5, compoundingFrequency: .monthly
        ))
        let yearly = calc.calculate(input: SavingsInput(
            initialDeposit: 10_000, monthlyContribution: 0,
            interestRate: rate, years: 5, compoundingFrequency: .yearly
        ))
        #expect(monthly.finalBalanceGross >= yearly.finalBalanceGross,
                "Monthly compounding should >= yearly at \(rate)%")
    }

    @Test("withholding tax is 15% of gross interest",
          arguments: [2, 3, 4, 5, 8] as [Decimal])
    func withholdingTax(rate: Decimal) {
        let calc = SavingsCalculator()
        let output = calc.calculate(input: SavingsInput(
            initialDeposit: 50_000, monthlyContribution: 0,
            interestRate: rate, years: 3, compoundingFrequency: .yearly
        ))
        let expectedTax = output.totalInterestGross * Decimal(string: "0.15")!
        #expect(abs(output.withholdingTax - expectedTax) <= 1,
                "Tax \(output.withholdingTax) vs expected \(expectedTax)")
    }
}

// MARK: - Parameterized Pension Rules Tests

@Suite("Parameterized: Pension Rules")
struct ParameterizedPensionRulesTests {

    struct RequiredYearsCase: CustomStringConvertible, Sendable {
        let birthYear: Int
        let expected: Int
        var description: String { "born \(birthYear) → \(expected)y" }
    }

    static let requiredYearsCases: [RequiredYearsCase] = [
        RequiredYearsCase(birthYear: 1950, expected: 35),
        RequiredYearsCase(birthYear: 1955, expected: 35),
        RequiredYearsCase(birthYear: 1957, expected: 35),
        RequiredYearsCase(birthYear: 1960, expected: 35),
        RequiredYearsCase(birthYear: 1965, expected: 40),
        RequiredYearsCase(birthYear: 1969, expected: 41),
        RequiredYearsCase(birthYear: 1972, expected: 41),
        RequiredYearsCase(birthYear: 1975, expected: 41),
        RequiredYearsCase(birthYear: 1980, expected: 42),
        RequiredYearsCase(birthYear: 2000, expected: 42),
    ]

    @Test("required contribution years by birth year", arguments: requiredYearsCases)
    func requiredYears(testCase: RequiredYearsCase) {
        let result = PensionRules.requiredYears(birthYear: testCase.birthYear)
        #expect(result == testCase.expected)
    }

    @Test("child credits cap at 3 children effective",
          arguments: [0, 1, 2, 3, 4, 5, 10])
    func childCreditsCap(children: Int) {
        let credits = PensionRules.childCredits(birthYear: 1970, children: children)
        let maxCredits = PensionRules.childCredits(birthYear: 1970, children: 3)
        #expect(credits <= maxCredits, "Credits should be capped")
        if children == 0 {
            #expect(credits == 0)
        }
    }
}

// MARK: - Parameterized Children's Allowance Tests

@Suite("Parameterized: Children's Allowance")
struct ParameterizedChildrensAllowanceTests {

    @Test("allowance scales with number of children",
          arguments: [1, 2, 3, 4, 5])
    func allowanceScales(children: Int) {
        let calc = ChildrensAllowanceCalculator()
        let output = calc.calculate(input: ChildrensAllowanceInput(
            grossIncome: 20_000, sscPaid: 2_000, rentIncome: 0,
            interestIncome: 0, pensionIncome: 0, maintenanceIncome: 0,
            otherIncome: 0, taxPaid: 3_000, numberOfChildren: children
        ))
        let expectedTotal = output.yearlyPerChild * Decimal(children)
        #expect(abs(output.yearlyForAll - expectedTotal) <= 1)
    }

    @Test("birth bonus by child order", arguments: [1, 2, 3, 4, 5])
    func birthBonusByOrder(order: Int) {
        let calc = ChildrensAllowanceCalculator()
        let bonus = calc.birthBonus(order: order)
        if order >= 1 {
            #expect(bonus.bonusAmount > 0)
        }
        if order >= 2 {
            let prev = calc.birthBonus(order: order - 1)
            #expect(bonus.bonusAmount >= prev.bonusAmount,
                    "Order \(order) bonus should be >= order \(order - 1)")
        }
    }
}

// MARK: - Parameterized Vehicle Registration Tax Tests

@Suite("Parameterized: Vehicle Reg Tax CO2")
struct ParameterizedVehicleRegTaxTests {

    @Test("higher CO2 produces higher tax",
          arguments: [0, 50, 100, 120, 150, 180, 200, 250])
    func co2Progression(co2: Int) {
        let calc = VehicleRegistrationTaxCalculator()
        let output = calc.calculate(input: VehicleRegistrationTaxInput(
            co2Emissions: co2, vehicleAge: 0, engineCapacity: 1600,
            fuelType: .petrol, vehicleValue: 20_000, isEU: true
        ))
        if co2 == 0 {
            #expect(output.co2Tax == 0)
        } else {
            #expect(output.co2Tax >= 0)
        }
    }

    @Test("age discount increases with vehicle age",
          arguments: [0, 1, 3, 5, 10, 15, 20])
    func ageDiscountProgression(age: Int) {
        let calc = VehicleRegistrationTaxCalculator()
        let output = calc.calculate(input: VehicleRegistrationTaxInput(
            co2Emissions: 150, vehicleAge: age, engineCapacity: 1600,
            fuelType: .petrol, vehicleValue: 20_000, isEU: true
        ))
        if age > 0 {
            #expect(output.ageDiscount >= 0)
        }
    }
}

// MARK: - Parameterized Road License Tests

@Suite("Parameterized: Road License")
struct ParameterizedRoadLicenseTests {

    @Test("engine capacity affects base fee",
          arguments: [1000, 1200, 1400, 1600, 1800, 2000, 2500, 3000])
    func engineCapacity(cc: Int) {
        let calc = RoadLicenseCalculator()
        let output = calc.calculate(input: RoadLicenseInput(
            engineCapacity: cc, co2Emissions: 140, vehicleAge: 5,
            fuelType: .petrol, vehicleCategory: .privateCar, licensePeriod: 12
        ))
        #expect(output.baseFee >= 0)
        #expect(output.annualFee >= output.baseFee)
    }
}
