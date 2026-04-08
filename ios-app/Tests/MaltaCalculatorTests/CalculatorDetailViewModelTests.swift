//
//  CalculatorDetailViewModelTests.swift
//  MaltaCalculator
//
//  Sprint 1 (M5.1) calculator detail view model tests:
//  Mortgage, Personal Loan, Stamp Duty, Savings Interest.
//

import CalculationKit
import Foundation
import Testing
@testable import MaltaCalculator

// MARK: - Mortgage

@Suite("MortgageViewModel")
@MainActor
struct MortgageViewModelTests {

    @Test("default 300k @ 4.5% 25y produces parity output")
    func defaultCase() throws {
        let vm = MortgageViewModel()
        vm.recalculate()
        let output = try #require(vm.output)
        // Sanity bounds — exact parity is enforced in CalculationKit golden tests.
        #expect(output.monthlyPayment > 1_000)
        #expect(output.monthlyPayment < 2_000)
        #expect(output.loanAmount == 240_000) // 300k * (1 - 0.20)
    }

    @Test("deposit below 10% surfaces a warning")
    func depositWarning() {
        let vm = MortgageViewModel()
        vm.depositPercent = 5
        vm.recalculate()
        #expect(vm.depositBelowMinimum == true)
    }

    @Test("zero interest rate does not crash")
    func zeroRate() throws {
        let vm = MortgageViewModel()
        vm.interestRate = 0
        vm.recalculate()
        let output = try #require(vm.output)
        #expect(output.monthlyPayment > 0)
    }

    @Test("reset restores defaults")
    func resetDefaults() {
        let vm = MortgageViewModel()
        vm.propertyPrice = 1_000_000
        vm.depositPercent = 50
        vm.reset()
        #expect(vm.propertyPrice == 300_000)
        #expect(vm.depositPercent == 20)
    }

    @Test("deep link parameters apply")
    func deepLink() {
        let vm = MortgageViewModel()
        vm.applyInitialParams(["price": "400000", "deposit": "25", "rate": "3.5", "term": "30"])
        #expect(vm.propertyPrice == 400_000)
        #expect(vm.depositPercent == 25)
        #expect(vm.loanTermYears == 30)
    }

}

// MARK: - Personal Loan

@Suite("PersonalLoanViewModel")
@MainActor
struct PersonalLoanViewModelTests {

    @Test("default loan produces positive monthly payment")
    func defaultCase() throws {
        let vm = PersonalLoanViewModel()
        let output = try #require(vm.output)
        #expect(output.monthlyPayment > 0)
        #expect(output.totalRepayment >= output.monthlyPayment * Decimal(output.numberOfPayments) - 1)
        #expect(output.numberOfPayments == 60)
    }

    @Test("zero interest rate produces simple division")
    func zeroRate() throws {
        let vm = PersonalLoanViewModel()
        vm.interestRate = 0
        vm.recalculate()
        let output = try #require(vm.output)
        #expect(output.totalInterest == 0)
    }

    @Test("reset restores defaults")
    func resetDefaults() {
        let vm = PersonalLoanViewModel()
        vm.loanAmount = 1
        vm.termMonths = 6
        vm.reset()
        #expect(vm.loanAmount == 10_000)
        #expect(vm.termMonths == 60)
    }

    @Test("deep link parameters apply")
    func deepLink() {
        let vm = PersonalLoanViewModel()
        vm.applyInitialParams(["amount": "5000", "rate": "6", "months": "36"])
        #expect(vm.loanAmount == 5_000)
        #expect(vm.termMonths == 36)
    }
}

// MARK: - Stamp Duty

@Suite("StampDutyViewModel")
@MainActor
struct StampDutyViewModelTests {

    @Test("standard rate is 5% of property price")
    func standardRate() throws {
        let vm = StampDutyViewModel()
        vm.propertyPrice = 250_000
        vm.isFirstTimeBuyer = false
        vm.recalculate()
        let output = try #require(vm.output)
        #expect(output.stampDuty == 12_500)
        #expect(output.exemptedAmount == 0)
        #expect(output.savings == 0)
    }

    @Test("first-time buyer exempts first 200k")
    func firstTimeBuyer() throws {
        let vm = StampDutyViewModel()
        vm.propertyPrice = 250_000
        vm.isFirstTimeBuyer = true
        vm.recalculate()
        let output = try #require(vm.output)
        // 5% of (250k - 200k) = 2_500
        #expect(output.stampDuty == 2_500)
        #expect(output.exemptedAmount == 200_000)
        #expect(output.savings == 10_000)
    }

    @Test("price below exemption threshold yields zero duty for first-time")
    func belowThreshold() throws {
        let vm = StampDutyViewModel()
        vm.propertyPrice = 150_000
        vm.isFirstTimeBuyer = true
        vm.recalculate()
        let output = try #require(vm.output)
        #expect(output.stampDuty == 0)
    }

    @Test("reset restores defaults")
    func resetDefaults() {
        let vm = StampDutyViewModel()
        vm.propertyPrice = 999
        vm.isFirstTimeBuyer = true
        vm.reset()
        #expect(vm.propertyPrice == 250_000)
        #expect(vm.isFirstTimeBuyer == false)
    }
}

// MARK: - Savings Interest

@Suite("SavingsInterestViewModel")
@MainActor
struct SavingsInterestViewModelTests {

    @Test("default produces positive growth")
    func defaultCase() throws {
        let vm = SavingsInterestViewModel()
        let output = try #require(vm.output)
        #expect(output.finalBalanceNet > output.totalContributions)
        #expect(output.withholdingTax > 0)
        #expect(output.yearlyBreakdown.count == 5)
    }

    @Test("zero rate yields zero interest")
    func zeroRate() throws {
        let vm = SavingsInterestViewModel()
        vm.annualRate = 0
        vm.recalculate()
        let output = try #require(vm.output)
        #expect(output.totalInterestGross == 0)
        #expect(output.withholdingTax == 0)
    }

    @Test("yearly compounding still produces growth")
    func yearlyCompounding() throws {
        let vm = SavingsInterestViewModel()
        vm.compoundingFrequency = .yearly
        vm.recalculate()
        let output = try #require(vm.output)
        #expect(output.finalBalanceNet > 0)
    }

    @Test("term clamps to minimum")
    func termClamp() throws {
        let vm = SavingsInterestViewModel()
        vm.termYears = -3
        vm.recalculate()
        let output = try #require(vm.output)
        #expect(output.yearlyBreakdown.count >= SavingsCalculator.minYears)
    }

    @Test("deep link parameters apply")
    func deepLink() {
        let vm = SavingsInterestViewModel()
        vm.applyInitialParams([
            "deposit": "5000",
            "monthly": "100",
            "rate": "2.5",
            "years": "10",
            "frequency": "yearly"
        ])
        #expect(vm.initialDeposit == 5_000)
        #expect(vm.monthlyContribution == 100)
        #expect(vm.termYears == 10)
        #expect(vm.compoundingFrequency == .yearly)
    }
}
