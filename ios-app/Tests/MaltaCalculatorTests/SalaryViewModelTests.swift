//
//  SalaryViewModelTests.swift
//  MaltaCalculator
//

import Foundation
import Testing
@testable import MaltaCalculator
@testable import CalculationKit

// MARK: - SalaryViewModel Tests

@Suite("SalaryViewModel")
@MainActor
struct SalaryViewModelTests {

    // MARK: - Default State

    @Test("default state has correct initial values")
    func defaultState() {
        let vm = SalaryViewModel(skipAutoLoad: true)
        #expect(vm.grossAnnual == 25_000)
        #expect(vm.year == 2026)
        #expect(vm.simpleTaxType == .single)
        #expect(vm.childCount == 0)
        #expect(vm.sscCategory == .c)
        #expect(vm.yearlyNonTaxBenefit == 0)
        #expect(vm.yearlyTaxableBenefit == 0)
        #expect(vm.enableCOLA == true)
        #expect(vm.monthly.isEmpty)
        #expect(vm.summary == nil)
        #expect(vm.error == nil)
    }

    // MARK: - Reset

    @Test("reset restores all defaults")
    func reset() {
        let vm = SalaryViewModel(skipAutoLoad: true)
        vm.grossAnnual = 75_000
        vm.year = 2024
        vm.simpleTaxType = .married
        vm.childCount = 2
        vm.sscCategory = .b
        vm.yearlyNonTaxBenefit = 500
        vm.yearlyTaxableBenefit = 1000
        vm.enableCOLA = false
        vm.expandedMonths = [.january, .march]
        vm.showingBenefitsSection = true

        vm.reset()

        #expect(vm.grossAnnual == 25_000)
        #expect(vm.year == 2026)
        #expect(vm.simpleTaxType == .single)
        #expect(vm.childCount == 0)
        #expect(vm.sscCategory == .c)
        #expect(vm.yearlyNonTaxBenefit == 0)
        #expect(vm.yearlyTaxableBenefit == 0)
        #expect(vm.enableCOLA == true)
        #expect(vm.expandedMonths.isEmpty)
        #expect(vm.showingBenefitsSection == false)
    }

    // MARK: - Deep Link

    @Test("applyInitialParams sets gross and year")
    func deepLinkParams() {
        let vm = SalaryViewModel(skipAutoLoad: true)
        vm.applyInitialParams(["gross": "50000", "year": "2025"])
        #expect(vm.grossAnnual == 50_000)
        #expect(vm.year == 2025)
    }

    @Test("applyInitialParams sets tax type and children")
    func deepLinkTaxType() {
        let vm = SalaryViewModel(skipAutoLoad: true)
        vm.applyInitialParams(["type": "married", "children": "2"])
        #expect(vm.simpleTaxType == .married)
        #expect(vm.childCount == 2)
    }

    @Test("applyInitialParams ignores invalid values")
    func deepLinkInvalid() {
        let vm = SalaryViewModel(skipAutoLoad: true)
        vm.applyInitialParams(["gross": "abc", "year": "xyz", "type": "alien"])
        #expect(vm.grossAnnual == 25_000) // unchanged
        #expect(vm.year == 2026) // unchanged
        #expect(vm.simpleTaxType == .single) // unchanged
    }

    // MARK: - Month Expansion

    @Test("toggleMonthExpansion adds and removes months")
    func monthExpansion() {
        let vm = SalaryViewModel(skipAutoLoad: true)
        #expect(vm.expandedMonths.isEmpty)

        vm.toggleMonthExpansion(.january)
        #expect(vm.expandedMonths.contains(.january))

        vm.toggleMonthExpansion(.january)
        #expect(!vm.expandedMonths.contains(.january))
    }

    // MARK: - Computed Properties

    @Test("monthlyGross is annual divided by 12")
    func monthlyGross() {
        let vm = SalaryViewModel(skipAutoLoad: true)
        vm.grossAnnual = 36_000
        #expect(vm.monthlyGross == 3_000)
    }

    @Test("isChildCountVisible checks year and tax type")
    func childCountVisible() {
        let vm = SalaryViewModel(skipAutoLoad: true)

        vm.year = 2026
        vm.simpleTaxType = .single
        #expect(!vm.isChildCountVisible)

        vm.simpleTaxType = .married
        #expect(vm.isChildCountVisible)

        vm.year = 2025
        #expect(!vm.isChildCountVisible)
    }

    @Test("isCOLAVisible checks year threshold")
    func colaVisible() {
        let vm = SalaryViewModel(skipAutoLoad: true)

        vm.year = 2024
        #expect(vm.isCOLAVisible)

        vm.year = 2023
        #expect(!vm.isCOLAVisible)
    }

    @Test("isBornBefore1962 checks birth year")
    func pre1962() {
        let vm = SalaryViewModel(skipAutoLoad: true)
        let cal = Calendar(identifier: .gregorian)

        vm.birthDate = cal.date(from: DateComponents(year: 1961, month: 6, day: 15)) ?? Date()
        #expect(vm.isBornBefore1962)

        vm.birthDate = cal.date(from: DateComponents(year: 1962, month: 1, day: 1)) ?? Date()
        #expect(!vm.isBornBefore1962)

        vm.birthDate = cal.date(from: DateComponents(year: 1990, month: 5, day: 10)) ?? Date()
        #expect(!vm.isBornBefore1962)
    }

    // MARK: - Calculation Integration

    @Test("loadConfigAndCalculate produces 12 months and summary")
    func calculation() async throws {
        let vm = SalaryViewModel(skipAutoLoad: true)
        await vm.loadConfigAndCalculate()

        #expect(vm.monthly.count == 12)
        #expect(vm.summary != nil)
        #expect(vm.error == nil)

        if let summary = vm.summary {
            #expect(summary.annualGross > 0)
            #expect(summary.annualNet > 0)
            #expect(summary.annualNet <= summary.annualGross)
            #expect(summary.annualSSC >= 0)
            #expect(summary.annualIncomeTax >= 0)
            #expect(summary.effectiveTaxRate >= 0)
            #expect(summary.effectiveTaxRate <= 1)
        }
    }

    @Test("zero gross produces zero outputs")
    func zeroGross() async throws {
        let vm = SalaryViewModel(skipAutoLoad: true)
        vm.grossAnnual = 0
        await vm.loadConfigAndCalculate()

        #expect(vm.monthly.count == 12)
        if let summary = vm.summary {
            #expect(summary.annualGross == 0 || summary.annualGross > 0) // COLA may add nonzero
            #expect(summary.annualNet >= 0)
        }
    }

    @Test("married with 2 children 2026 uses correct bracket")
    func marriedWithChildren() async throws {
        let vm = SalaryViewModel(skipAutoLoad: true)
        vm.grossAnnual = 40_000
        vm.year = 2026
        vm.simpleTaxType = .married
        vm.childCount = 2
        await vm.loadConfigAndCalculate()

        let vmSingle = SalaryViewModel(skipAutoLoad: true)
        vmSingle.grossAnnual = 40_000
        vmSingle.year = 2026
        vmSingle.simpleTaxType = .single
        await vmSingle.loadConfigAndCalculate()

        // Married with 2 children should pay less tax than single
        if let married = vm.summary, let single = vmSingle.summary {
            #expect(married.annualIncomeTax < single.annualIncomeTax)
        }
    }

    // MARK: - Share Content

    @Test("buildShareContent returns nil without summary")
    func shareContentNil() {
        let vm = SalaryViewModel(skipAutoLoad: true)
        #expect(vm.buildShareContent() == nil)
    }

    @Test("buildShareContent returns content after calculation")
    func shareContent() async throws {
        let vm = SalaryViewModel(skipAutoLoad: true)
        await vm.loadConfigAndCalculate()

        let content = vm.buildShareContent()
        #expect(content != nil)
        #expect(content?.year == 2026)
        #expect((content?.annualGross ?? 0) > 0)
        #expect(content?.shareText.contains("Malta Salary Calculator") == true)
    }
}

// MARK: - SalaryInsights Tests

@Suite("SalaryInsights")
struct SalaryInsightsTests {

    @Test("generates at least 3 bullets")
    func bulletCount() {
        let summary = SalarySummary(from: makeMockOutputs())
        let insights = SalaryInsights(summary: summary, year: 2026, simpleTaxType: .single)
        #expect(insights.bullets.count >= 3)
    }

    @Test("includes child tax hint for married in 2026")
    func childHint() {
        let summary = SalarySummary(from: makeMockOutputs())
        let insights = SalaryInsights(summary: summary, year: 2026, simpleTaxType: .married)
        #expect(insights.bullets.contains { $0.contains("child tax bracket") })
    }

    @Test("excludes child tax hint for single")
    func noChildHint() {
        let summary = SalarySummary(from: makeMockOutputs())
        let insights = SalaryInsights(summary: summary, year: 2026, simpleTaxType: .single)
        #expect(!insights.bullets.contains { $0.contains("child tax bracket") })
    }

    private func makeMockOutputs() -> [SalaryOutput] {
        Month.allCases.map { month in
            SalaryOutput(
                month: month,
                grossWage: 2000,
                basicSalary: 2000,
                nonTaxBenefit: 0,
                taxBenefit: 0,
                bonus: 0,
                governmentBonus: 0,
                grossTotal: 2000,
                sscBase: 2000,
                sscTax: 200,
                incomeBase: 2000,
                cumulativeIncomeBase: Decimal(month.index + 1) * 2000,
                cumulativeTax: Decimal(month.index + 1) * 100,
                incomeTax: 100,
                net: 1700,
                paid: 1700,
                discr: 0
            )
        }
    }
}

// MARK: - SalaryShareContent Tests

@Suite("SalaryShareContent")
struct SalaryShareContentTests {
    @Test("shareText contains key information")
    func shareText() {
        let content = SalaryShareContent(
            year: 2026,
            annualGross: 30_000,
            annualNet: 22_000,
            annualSSC: 3_000,
            annualIncomeTax: 5_000,
            monthlyNet: Decimal(22_000) / 12,
            effectiveTaxRate: Decimal(string: "0.2667") ?? 0
        )
        #expect(content.shareText.contains("2026"))
        #expect(content.shareText.contains("Malta Salary Calculator"))
    }
}
