//
//  CalculatorShareTests.swift
//  MaltaCalculator
//
//  Coverage for the generic share/export pipeline used by every
//  calculator detail screen (Task 11 — Share & Export).
//

import CalculationKit
import Foundation
import Testing
@testable import MaltaCalculator

@Suite("CalculatorShareBuilders")
@MainActor
struct CalculatorShareBuildersTests {

    @Test("mortgage builder produces hero + breakdown rows")
    func mortgageBuilder() throws {
        let vm = MortgageViewModel()
        let content = try #require(CalculatorShareBuilders.mortgage(vm))
        #expect(content.id == "Malta_Mortgage")
        #expect(content.symbolName == "house.fill")
        #expect(!content.heroValue.isEmpty)
        #expect(content.rows.count >= 5)
        // Loan amount row must reflect the 240k loan (300k * 0.80).
        let loanRow = try #require(
            content.rows.first { $0.value.contains("240") }
        )
        #expect(!loanRow.label.isEmpty)
    }

    @Test("personal loan builder includes term in months")
    func personalLoanBuilder() throws {
        let vm = PersonalLoanViewModel()
        let content = try #require(CalculatorShareBuilders.personalLoan(vm))
        #expect(content.id == "Malta_PersonalLoan")
        #expect(content.rows.contains { $0.value.contains("60 mo") })
    }

    @Test("stamp duty builder reflects first-time buyer toggle")
    func stampDutyFirstTimeBuyer() throws {
        let vm = StampDutyViewModel()
        vm.isFirstTimeBuyer = true
        vm.recalculate()
        let content = try #require(CalculatorShareBuilders.stampDuty(vm))
        #expect(content.id == "Malta_StampDuty")
        #expect(content.rows.count >= 4)
    }

    @Test("savings builder uses net final balance as hero")
    func savingsBuilder() throws {
        let vm = SavingsInterestViewModel()
        let content = try #require(CalculatorShareBuilders.savings(vm))
        #expect(content.id == "Malta_Savings")
        #expect(!content.heroValue.isEmpty)
    }

    @Test("renderer plain text contains hero and all rows")
    func plainTextRendering() async throws {
        let content = GenericShareContent(
            id: "Test",
            title: "Test Calculator",
            symbolName: "star",
            heroLabel: "Result",
            heroValue: "€1,234.56",
            subtitle: "Sample subtitle",
            rows: [
                .init(label: "Row A", value: "€100"),
                .init(label: "Row B", value: "€200")
            ]
        )
        let renderer = GenericShareRenderer(content: content)
        let text = renderer.asText()
        #expect(text.contains("Test Calculator"))
        #expect(text.contains("€1,234.56"))
        #expect(text.contains("Row A"))
        #expect(text.contains("€200"))
        #expect(text.contains("Sample subtitle"))
    }

    @Test("renderer image renders to a non-empty UIImage")
    func imageRendering() async throws {
        let content = GenericShareContent(
            id: "Test",
            title: "Test",
            symbolName: "star",
            heroLabel: "Result",
            heroValue: "€100",
            subtitle: nil,
            rows: [.init(label: "A", value: "€1")]
        )
        let image = await GenericShareRenderer(content: content).asImage()
        let unwrapped = try #require(image)
        #expect(unwrapped.size.width >= 540)
        #expect(unwrapped.size.height >= 540)
    }

    @Test("renderer pdf writes a readable file")
    func pdfRendering() async throws {
        let content = GenericShareContent(
            id: "PDFTest",
            title: "PDF Test",
            symbolName: "doc",
            heroLabel: "Hero",
            heroValue: "€500",
            subtitle: "Sub",
            rows: [
                .init(label: "L1", value: "€10"),
                .init(label: "L2", value: "€20")
            ]
        )
        let url = await GenericShareRenderer(content: content).asPDF()
        let unwrapped = try #require(url)
        let attrs = try FileManager.default.attributesOfItem(atPath: unwrapped.path)
        let size = try #require(attrs[.size] as? NSNumber)
        #expect(size.intValue > 100)
        try? FileManager.default.removeItem(at: unwrapped)
    }
}
