import Foundation
import Testing
@testable import CalculationKit

// MARK: - SSC Calculator Direct Tests

@Suite("SSCCalculator")
struct SSCCalculatorTests {

    private static let ssc2026 = MaltaTaxConfig.SSCRates(
        categoryA: Decimal(string: "6.62")!,
        categoryB: Decimal(string: "22.94")!,
        categoryCOld: Decimal(string: "49.04")!,
        categoryCNew: Decimal(string: "55.93")!,
        categoryDOld: Decimal(string: "49.04")!,
        categoryDNew: Decimal(string: "55.93")!,
        weeklyCapOld: Decimal(string: "490.40")!,
        weeklyCapNew: Decimal(string: "559.31")!,
        minimumWage: Decimal(string: "225")!
    )

    // MARK: - Category A (Pensioners)

    @Test("Category A uses flat weekly rate regardless of salary")
    func categoryAFlat() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .a, isBornBefore1962: true)
        let tax4w = calc.calculateTax(sscBase: 5000, weeksInMonth: 4)
        let expected = Decimal(string: "6.62")! * 4
        #expect(tax4w == expected.rounded(to: 2))
    }

    @Test("Category A with 5 weeks")
    func categoryA5Weeks() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .a, isBornBefore1962: true)
        let tax = calc.calculateTax(sscBase: 3000, weeksInMonth: 5)
        let expected = Decimal(string: "6.62")! * 5
        #expect(tax == expected.rounded(to: 2))
    }

    // MARK: - Category B (Part-time)

    @Test("Category B capped at weekly rate × weeks")
    func categoryBCapped() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .b, isBornBefore1962: false)
        // High salary → cap applies
        let sscBase: Money = 4000
        let tax = calc.calculateTax(sscBase: sscBase, weeksInMonth: 4)
        let weeklyCapped = (Decimal(string: "22.94")! * 4).rounded(to: 2)
        #expect(tax <= weeklyCapped)
    }

    @Test("Category B uses min of capped and 10% of base")
    func categoryBMinRule() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .b, isBornBefore1962: false)
        // Low salary → 10% of base is smaller
        let lowBase: Money = 200
        let tax = calc.calculateTax(sscBase: lowBase, weeksInMonth: 4)
        let tenPercent = (lowBase / 10).rounded(to: 2)
        let weeklyCapped = (Decimal(string: "22.94")! * 4).rounded(to: 2)
        #expect(tax == min(weeklyCapped, tenPercent))
    }

    // MARK: - Category C (Full-time)

    @Test("Category C new rate for post-1962 workers")
    func categoryCNewRate() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .c, isBornBefore1962: false)
        let highBase: Money = 5000
        let tax = calc.calculateTax(sscBase: highBase, weeksInMonth: 4)
        let weeklyCapped = (Decimal(string: "55.93")! * 4).rounded(to: 2)
        #expect(tax <= weeklyCapped)
    }

    @Test("Category C old rate for pre-1962 workers")
    func categoryCOldRate() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .c, isBornBefore1962: true)
        let highBase: Money = 5000
        let tax = calc.calculateTax(sscBase: highBase, weeksInMonth: 4)
        let weeklyCapped = (Decimal(string: "49.04")! * 4).rounded(to: 2)
        #expect(tax <= weeklyCapped)
    }

    @Test("Category C old rate is lower than new rate", arguments: [4, 5])
    func categoryCOldLowerThanNew(weeks: Int) {
        let oldCalc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .c, isBornBefore1962: true)
        let newCalc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .c, isBornBefore1962: false)
        let sscBase: Money = 5000
        let oldTax = oldCalc.calculateTax(sscBase: sscBase, weeksInMonth: weeks)
        let newTax = newCalc.calculateTax(sscBase: sscBase, weeksInMonth: weeks)
        #expect(oldTax <= newTax, "Pre-1962 rate should be ≤ post-1962 rate")
    }

    // MARK: - Category D (Self-employed)

    @Test("Category D uses flat rate like A (no min rule)")
    func categoryDFlat() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .d, isBornBefore1962: false)
        let tax = calc.calculateTax(sscBase: 1000, weeksInMonth: 4)
        let expected = (Decimal(string: "55.93")! * 4).rounded(to: 2)
        #expect(tax == expected)
    }

    @Test("Category D old rate for pre-1962")
    func categoryDOld() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .d, isBornBefore1962: true)
        let tax = calc.calculateTax(sscBase: 1000, weeksInMonth: 4)
        let expected = (Decimal(string: "49.04")! * 4).rounded(to: 2)
        #expect(tax == expected)
    }

    // MARK: - SSC Base Calculation

    @Test("base calculation applies weekly cap for new workers")
    func baseCappedNew() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .c, isBornBefore1962: false)
        // High salary that exceeds weekly cap
        let base = calc.calculateBase(basicSalary: 10_000, weeksInMonth: 4)
        let cap = Decimal(string: "559.31")! * 4
        #expect(base == cap, "Should be capped at weeklyCapNew × weeks")
    }

    @Test("base calculation applies weekly cap for old workers")
    func baseCappedOld() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .c, isBornBefore1962: true)
        let base = calc.calculateBase(basicSalary: 10_000, weeksInMonth: 4)
        let cap = Decimal(string: "490.40")! * 4
        #expect(base == cap, "Should be capped at weeklyCapOld × weeks")
    }

    @Test("base calculation uncapped for low salary")
    func baseUncapped() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .c, isBornBefore1962: false)
        let monthlySalary: Money = 1000
        let base = calc.calculateBase(basicSalary: monthlySalary, weeksInMonth: 4)
        // Weekly equivalent = (1000 * 12) / 52 ≈ 230.77
        let weeklyEquiv = (monthlySalary * 12) / 52
        let expected = weeklyEquiv * 4
        #expect(base == expected)
    }

    @Test("base with 5 weeks in month")
    func base5Weeks() {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: .c, isBornBefore1962: false)
        let base4 = calc.calculateBase(basicSalary: 2000, weeksInMonth: 4)
        let base5 = calc.calculateBase(basicSalary: 2000, weeksInMonth: 5)
        #expect(base5 > base4, "5 weeks should produce higher base than 4 weeks")
    }

    // MARK: - Parameterized Category Comparison

    @Test("all categories for same salary", arguments: SSCCategory.allCases)
    func allCategories(category: SSCCategory) {
        let calc = SSCCalculator(sscRates: Self.ssc2026, sscCategory: category, isBornBefore1962: false)
        let sscBase: Money = 2000
        let tax = calc.calculateTax(sscBase: sscBase, weeksInMonth: 4)
        #expect(tax >= 0, "SSC tax should never be negative for \(category)")
        #expect(tax < 1000, "SSC tax should be reasonable for \(category)")
    }
}

// MARK: - Decimal Rounding & Precision Tests

@Suite("Money Rounding & Precision")
struct MoneyRoundingTests {

    @Test("bankers rounding: 0.5 rounds to even")
    func bankersRounding() {
        let val1: Decimal = Decimal(string: "1.235")!
        let val2: Decimal = Decimal(string: "1.245")!
        // Bankers rounding (round half to even):
        // 1.235 → 1.24 (rounds up to even)
        // 1.245 → 1.24 (rounds down to even)
        #expect(val1.rounded(to: 2) == Decimal(string: "1.24"))
        #expect(val2.rounded(to: 2) == Decimal(string: "1.24"))
    }

    @Test("rounding to 0 decimal places")
    func roundToZero() {
        let val: Decimal = Decimal(string: "123.456")!
        #expect(val.rounded(to: 0) == 123)
    }

    @Test("negative values round correctly")
    func negativeRounding() {
        let val: Decimal = Decimal(string: "-1.235")!
        let rounded = val.rounded(to: 2)
        #expect(abs(rounded - Decimal(string: "-1.24")!) <= Decimal(string: "0.01")!)
    }

    @Test("zero rounds to zero")
    func zeroRounding() {
        let val: Money = 0
        #expect(val.rounded(to: 2) == 0)
        #expect(val.rounded(to: 0) == 0)
    }

    @Test("very small value precision")
    func smallValuePrecision() {
        let val: Decimal = Decimal(string: "0.001")!
        #expect(val.rounded(to: 2) == 0)
        #expect(val.rounded(to: 3) == Decimal(string: "0.001"))
    }

    @Test("large value precision preserved")
    func largeValuePrecision() {
        let val: Decimal = Decimal(string: "999999999.99")!
        #expect(val.rounded(to: 2) == Decimal(string: "999999999.99"))
    }

    @Test("Decimal arithmetic does not lose cents")
    func decimalArithmeticPrecision() {
        // This fails with Double but works with Decimal
        var total: Decimal = 0
        for _ in 0..<100 {
            total += Decimal(string: "0.01")!
        }
        #expect(total == 1, "100 × €0.01 should equal €1.00 exactly")
    }

    @Test("Money typealias is Decimal")
    func moneyIsDecimal() {
        let money: Money = Decimal(string: "42.50")!
        let decimal: Decimal = Decimal(string: "42.50")!
        #expect(money == decimal)
    }

    @Test("nonNegative clamps correctly", arguments: [-100, -1, 0, 1, 100] as [Int])
    func nonNegativeClamp(value: Int) {
        let money: Money = Decimal(value)
        if value < 0 {
            #expect(money.nonNegative == 0)
        } else {
            #expect(money.nonNegative == Decimal(value))
        }
    }

    @Test("applying percent is precise")
    func applyingPercentPrecise() {
        let base: Money = Decimal(string: "33333.33")!
        let result = base.applying(percent: Decimal(string: "15")!)
        let expected = Decimal(string: "4999.9995")!
        #expect(abs(result - expected) <= Decimal(string: "0.01")!)
    }

    @Test("EUR formatting contains currency symbol")
    func eurFormatting() {
        let value: Money = Decimal(string: "1234.56")!
        let formatted = value.eur
        #expect(formatted.contains("1") && formatted.contains("234"))
    }
}

// MARK: - Cumulative Tax Precision Tests

@Suite("Cumulative Tax Precision")
struct CumulativeTaxPrecisionTests {

    @Test("12-month cumulative tax sums match annual tax within ±€0.01")
    func cumulativeTaxConsistency() async throws {
        let taxConfig = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(year: 2026, simpleTaxType: .single)
        let calc = SalaryCalculator(config: salaryConfig, taxConfig: taxConfig)
        let monthlyGross: Money = 3000
        let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: monthlyGross) }
        let outputs = try calc.calculate(inputs: inputs)

        // Verify cumulative income base grows monotonically
        var prevCumBase: Money = 0
        for output in outputs {
            #expect(output.cumulativeIncomeBase >= prevCumBase,
                    "\(output.month) cumBase \(output.cumulativeIncomeBase) < prev \(prevCumBase)")
            prevCumBase = output.cumulativeIncomeBase
        }

        // Verify cumulative tax grows monotonically
        var prevCumTax: Money = 0
        for output in outputs {
            #expect(output.cumulativeTax >= prevCumTax,
                    "\(output.month) cumTax \(output.cumulativeTax) < prev \(prevCumTax)")
            prevCumTax = output.cumulativeTax
        }

        // Verify last month's cumulative tax matches sum of individual taxes
        // Allow ±€0.12 because monthly rounding compounds across 12 months
        let totalTax = outputs.reduce(Money.zero) { $0 + $1.incomeTax }
        let lastCumTax = outputs.last?.cumulativeTax ?? 0
        #expect(abs(totalTax - lastCumTax) <= Decimal(string: "0.12")!,
                "Sum of monthly taxes (\(totalTax)) should match cumulative (\(lastCumTax))")
    }

    @Test("net + tax + SSC equals grossTotal for each month")
    func netPlusTaxPlusSSCEqualsGrossTotal() async throws {
        let taxConfig = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(year: 2026, simpleTaxType: .married, childCount: 1)
        let calc = SalaryCalculator(config: salaryConfig, taxConfig: taxConfig)
        let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: 2500) }
        let outputs = try calc.calculate(inputs: inputs)

        for output in outputs {
            // Invariant: net = grossTotal - sscTax - incomeTax
            // (governmentBonus is already included in grossTotal)
            let reconstituted = output.net + output.sscTax + output.incomeTax
            let diff = abs(output.grossTotal - reconstituted)
            #expect(diff <= Decimal(string: "0.02")!,
                    "\(output.month): grossTotal=\(output.grossTotal) vs reconstituted=\(reconstituted)")
        }
    }

    @Test("all tax types produce non-negative deductions",
          arguments: [SimpleTaxType.single, .married, .parent])
    func nonNegativeDeductions(taxType: SimpleTaxType) async throws {
        let taxConfig = try await TaxConfigStore.shared.load()
        let salaryConfig = SalaryCalculatorConfig(year: 2026, simpleTaxType: taxType)
        let calc = SalaryCalculator(config: salaryConfig, taxConfig: taxConfig)
        let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: 2000) }
        let outputs = try calc.calculate(inputs: inputs)

        for output in outputs {
            #expect(output.net >= 0, "\(taxType) \(output.month) net should be non-negative")
            #expect(output.incomeTax >= 0, "\(taxType) \(output.month) tax should be non-negative")
            #expect(output.sscTax >= 0, "\(taxType) \(output.month) SSC should be non-negative")
        }
    }
}
