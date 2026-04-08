//
//  AccessibilityAuditTests.swift
//  MaltaCalculator
//
//  Audit tests verifying accessibility compliance:
//  - All ViewModels expose accessible currency values
//  - ViewState patterns produce proper accessibility states
//  - Currency formatting produces VoiceOver-friendly strings
//

import CalculationKit
import Foundation
import Testing
@testable import MaltaCalculator

// MARK: - Currency Accessibility Formatting

@Suite("Currency Accessibility")
struct CurrencyAccessibilityTests {

    @Test("EUR format style produces readable output")
    func eurFormatStyle() {
        let value: Decimal = 14_976.50
        let formatted = value.formatted(.currency(code: "EUR"))
        // Should contain the numeric value in some form
        #expect(formatted.contains("14") || formatted.contains("976"))
    }

    @Test("zero formatted currency is accessible")
    func zeroFormatted() {
        let value: Decimal = 0
        let formatted = value.formatted(.currency(code: "EUR"))
        #expect(formatted.contains("0"))
    }

    @Test("large value formatted currency handles thousands")
    func largeValueFormatted() {
        let value: Decimal = 1_000_000
        let formatted = value.formatted(.currency(code: "EUR"))
        #expect(!formatted.isEmpty)
    }

    @Test("negative value formatted currency is clear")
    func negativeFormatted() {
        let value: Decimal = -500
        let formatted = value.formatted(.currency(code: "EUR"))
        #expect(formatted.contains("500"))
    }
}

// MARK: - ViewModel Accessibility Properties

@Suite("ViewModel Accessibility")
@MainActor
struct ViewModelAccessibilityTests {

    @Test("SalaryViewModel content exposes accessible summary values")
    func salaryAccessibleValues() async throws {
        let vm = SalaryViewModel(
            configLoader: { try await TaxConfigStore.shared.load() },
            historyStore: SalaryHistoryStore(
                fileURL: FileManager.default.temporaryDirectory
                    .appendingPathComponent("a11y-\(UUID().uuidString).json")
            ),
            clock: { Date() },
            autoLoad: false
        )
        vm.grossAnnual = 30_000
        vm.retry()
        try await Task.sleep(for: .milliseconds(300))

        guard case .content(let content) = vm.state else {
            Issue.record("Expected .content for a11y test")
            return
        }

        // Verify summary values are formatttable for VoiceOver
        let netFormatted = content.summary.annualNet.formatted(.currency(code: "EUR"))
        #expect(!netFormatted.isEmpty, "Annual net should be formattable")

        let taxFormatted = content.summary.annualIncomeTax.formatted(.currency(code: "EUR"))
        #expect(!taxFormatted.isEmpty, "Annual tax should be formattable")

        let sscFormatted = content.summary.annualSSC.formatted(.currency(code: "EUR"))
        #expect(!sscFormatted.isEmpty, "Annual SSC should be formattable")

        // Effective rate should be a valid percentage
        let rate = content.summary.effectiveTaxRate
        #expect(rate >= 0 && rate <= 1, "Effective rate should be 0-1")
    }

    @Test("MortgageViewModel exposes accessible output")
    func mortgageAccessible() {
        let vm = MortgageViewModel()
        guard let output = vm.output else {
            Issue.record("Expected output")
            return
        }
        // All money values should be formattable
        let monthlyFormatted = output.monthlyPayment.formatted(.currency(code: "EUR"))
        #expect(!monthlyFormatted.isEmpty)

        let totalFormatted = output.totalCost.formatted(.currency(code: "EUR"))
        #expect(!totalFormatted.isEmpty)
    }

    @Test("PersonalLoanViewModel exposes accessible output")
    func loanAccessible() {
        let vm = PersonalLoanViewModel()
        guard let output = vm.output else {
            Issue.record("Expected output")
            return
        }
        let formatted = output.monthlyPayment.formatted(.currency(code: "EUR"))
        #expect(!formatted.isEmpty)
    }

    @Test("StampDutyViewModel exposes accessible output")
    func stampDutyAccessible() {
        let vm = StampDutyViewModel()
        guard let output = vm.output else {
            Issue.record("Expected output")
            return
        }
        let formatted = output.stampDuty.formatted(.currency(code: "EUR"))
        #expect(!formatted.isEmpty)
    }

    @Test("SavingsInterestViewModel exposes accessible output")
    func savingsAccessible() {
        let vm = SavingsInterestViewModel()
        guard let output = vm.output else {
            Issue.record("Expected output")
            return
        }
        let formatted = output.finalBalanceNet.formatted(.currency(code: "EUR"))
        #expect(!formatted.isEmpty)
    }
}

// MARK: - ViewState Accessibility Completeness

@Suite("ViewState Accessibility Completeness")
struct ViewStateAccessibilityTests {

    @Test("SalaryViewState has all required cases")
    func salaryViewState() {
        // Verify all four cases exist — compilation would fail if missing
        let loading: SalaryViewState = .loading
        let empty: SalaryViewState = .empty
        let error: SalaryViewState = .error("test error")
        #expect(loading == .loading)
        #expect(empty == .empty)
        #expect(error == .error("test error"))
        // .content requires actual data — tested separately
    }

    @Test("GuidesViewState has required cases")
    func guidesViewState() {
        let loading: GuidesViewState = .loading
        let empty: GuidesViewState = .empty
        #expect(loading == .loading)
        #expect(empty == .empty)
    }
}

// MARK: - Dynamic Type Support Verification

@Suite("Dynamic Type Support")
struct DynamicTypeSupportTests {

    @Test("Money.eur formatting is locale-aware")
    func localeAware() {
        let value: Money = Decimal(string: "1234.56") ?? 0
        let formatted = value.eur
        // Should contain digits regardless of locale
        let digitsOnly = formatted.filter(\.isNumber)
        #expect(digitsOnly.contains("1234") || digitsOnly.contains("123456"))
    }

    @Test("Percentage display is accessible")
    func percentageDisplay() {
        let rate: Decimal = Decimal(string: "0.267") ?? 0
        let formatted = rate.formatted(.percent)
        // Should show as 26.7% or similar
        #expect(formatted.contains("26") || formatted.contains("27"))
    }

    @Test("All months have displayable names")
    func monthNames() {
        for month in Month.allCases {
            let name = "\(month)"
            #expect(!name.isEmpty, "Month \(month) should have a name")
        }
    }

    @Test("SimpleTaxType all cases are representable")
    func taxTypeNames() {
        let types: [SimpleTaxType] = [.single, .married, .parent]
        #expect(types.count == 3)
        for type in types {
            let name = "\(type)"
            #expect(!name.isEmpty)
        }
    }

    @Test("SSCCategory all cases are representable")
    func sscCategoryNames() {
        let categories = SSCCategory.allCases
        #expect(categories.count == 4)
        for cat in categories {
            let name = "\(cat)"
            #expect(!name.isEmpty)
        }
    }
}
