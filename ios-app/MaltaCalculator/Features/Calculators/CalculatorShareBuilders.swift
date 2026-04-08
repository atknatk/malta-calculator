//
//  CalculatorShareBuilders.swift
//  MaltaCalculator
//

import CalculationKit
import Foundation

/// Maps each calculator's view-model state to a ``GenericShareContent``
/// payload that the reusable ``CalculatorShareSheet`` can render.
///
/// Builders are kept in a single file so the share format for every
/// calculator stays in lock-step. They never read PII — only the inputs
/// and computed outputs that are already visible in the result card.
@MainActor
enum CalculatorShareBuilders {

    // MARK: - Mortgage

    /// Builds share content from a ``MortgageViewModel``. Returns `nil` if
    /// no calculation has been performed yet.
    static func mortgage(_ vm: MortgageViewModel) -> GenericShareContent? {
        guard let output = vm.output else { return nil }
        return GenericShareContent(
            id: "Malta_Mortgage",
            title: String(localized: "calculator.mortgage.title"),
            symbolName: "house.fill",
            heroLabel: String(localized: "calculator.mortgage.monthlyPayment"),
            heroValue: output.monthlyPayment.eur,
            subtitle: String(
                localized: "calculator.mortgage.share.subtitle \(vm.propertyPrice.eur)"
            ),
            rows: [
                .init(
                    label: String(localized: "calculator.mortgage.loanAmount"),
                    value: output.loanAmount.eur
                ),
                .init(
                    label: String(localized: "calculator.mortgage.deposit"),
                    value: output.depositAmount.eur
                ),
                .init(
                    label: String(localized: "calculator.mortgage.totalInterest"),
                    value: output.totalInterest.eur
                ),
                .init(
                    label: String(localized: "calculator.mortgage.totalCost"),
                    value: output.totalCost.eur
                ),
                .init(
                    label: String(localized: "calculator.mortgage.term"),
                    value: "\(vm.loanTermYears) yrs"
                ),
                .init(
                    label: String(localized: "calculator.mortgage.rate"),
                    value: formatPercent(vm.interestRate)
                )
            ]
        )
    }

    // MARK: - Personal Loan

    /// Builds share content from a ``PersonalLoanViewModel``.
    static func personalLoan(_ vm: PersonalLoanViewModel) -> GenericShareContent? {
        guard let output = vm.output else { return nil }
        return GenericShareContent(
            id: "Malta_PersonalLoan",
            title: String(localized: "calculator.personalLoan.title"),
            symbolName: "creditcard.fill",
            heroLabel: String(localized: "calculator.personalLoan.monthlyPayment"),
            heroValue: output.monthlyPayment.eur,
            subtitle: String(
                localized: "calculator.personalLoan.share.subtitle \(vm.loanAmount.eur)"
            ),
            rows: [
                .init(
                    label: String(localized: "calculator.personalLoan.loanAmount"),
                    value: vm.loanAmount.eur
                ),
                .init(
                    label: String(localized: "calculator.personalLoan.totalRepayment"),
                    value: output.totalRepayment.eur
                ),
                .init(
                    label: String(localized: "calculator.personalLoan.totalInterest"),
                    value: output.totalInterest.eur
                ),
                .init(
                    label: String(localized: "calculator.personalLoan.term"),
                    value: "\(vm.termMonths) mo"
                ),
                .init(
                    label: String(localized: "calculator.personalLoan.rate"),
                    value: formatPercent(vm.interestRate)
                )
            ]
        )
    }

    // MARK: - Stamp Duty

    /// Builds share content from a ``StampDutyViewModel``.
    static func stampDuty(_ vm: StampDutyViewModel) -> GenericShareContent? {
        guard let output = vm.output else { return nil }
        return GenericShareContent(
            id: "Malta_StampDuty",
            title: String(localized: "calculator.stampDuty.title"),
            symbolName: "doc.text.fill",
            heroLabel: String(localized: "calculator.stampDuty.amount"),
            heroValue: output.stampDuty.eur,
            subtitle: String(
                localized: "calculator.stampDuty.share.subtitle \(vm.propertyPrice.eur)"
            ),
            rows: [
                .init(
                    label: String(localized: "calculator.stampDuty.propertyPrice"),
                    value: vm.propertyPrice.eur
                ),
                .init(
                    label: String(localized: "calculator.stampDuty.taxableAmount"),
                    value: output.taxableAmount.eur
                ),
                .init(
                    label: String(localized: "calculator.stampDuty.exempted"),
                    value: output.exemptedAmount.eur
                ),
                .init(
                    label: String(localized: "calculator.stampDuty.savings"),
                    value: output.savings.eur
                ),
                .init(
                    label: String(localized: "calculator.stampDuty.effectiveRate"),
                    value: formatPercent(output.effectiveRate)
                )
            ]
        )
    }

    // MARK: - Savings

    /// Builds share content from a ``SavingsInterestViewModel``.
    static func savings(_ vm: SavingsInterestViewModel) -> GenericShareContent? {
        guard let output = vm.output else { return nil }
        return GenericShareContent(
            id: "Malta_Savings",
            title: String(localized: "calculator.savings.title"),
            symbolName: "banknote.fill",
            heroLabel: String(localized: "calculator.savings.finalBalanceNet"),
            heroValue: output.finalBalanceNet.eur,
            subtitle: String(
                localized: "calculator.savings.share.subtitle \(vm.termYears)"
            ),
            rows: [
                .init(
                    label: String(localized: "calculator.savings.totalContributions"),
                    value: output.totalContributions.eur
                ),
                .init(
                    label: String(localized: "calculator.savings.totalInterestNet"),
                    value: output.totalInterestNet.eur
                ),
                .init(
                    label: String(localized: "calculator.savings.withholdingTax"),
                    value: output.withholdingTax.eur
                ),
                .init(
                    label: String(localized: "calculator.savings.effectiveYieldNet"),
                    value: formatPercent(output.effectiveYieldNet)
                ),
                .init(
                    label: String(localized: "calculator.savings.term"),
                    value: "\(vm.termYears) yrs"
                )
            ]
        )
    }

    // MARK: - Helpers

    private static func formatPercent(_ value: Decimal) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 2
        formatter.minimumFractionDigits = 0
        let str = formatter.string(from: value as NSDecimalNumber) ?? "\(value)"
        return "\(str)%"
    }
}
