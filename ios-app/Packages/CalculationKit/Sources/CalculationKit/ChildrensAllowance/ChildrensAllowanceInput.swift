import Foundation

/// Input for the Malta children's allowance calculator.
public struct ChildrensAllowanceInput: Sendable, Codable, Equatable {
    /// Annual gross income from employment / social security benefits.
    public var grossIncome: Money
    /// Amount of Social Security Contributions paid.
    public var sscPaid: Money
    /// Property rental income.
    public var rentIncome: Money
    /// Interest earned from bank deposits.
    public var interestIncome: Money
    /// Income from pensions.
    public var pensionIncome: Money
    /// Spouse or partner's maintenance.
    public var maintenanceIncome: Money
    /// Any other income.
    public var otherIncome: Money
    /// Tax paid (deducted from 2025 onwards).
    public var taxPaid: Money
    /// Number of children under 16.
    public var numberOfChildren: Int

    public init(
        grossIncome: Money, sscPaid: Money, rentIncome: Money,
        interestIncome: Money, pensionIncome: Money, maintenanceIncome: Money,
        otherIncome: Money, taxPaid: Money, numberOfChildren: Int
    ) {
        self.grossIncome = grossIncome
        self.sscPaid = sscPaid
        self.rentIncome = rentIncome
        self.interestIncome = interestIncome
        self.pensionIncome = pensionIncome
        self.maintenanceIncome = maintenanceIncome
        self.otherIncome = otherIncome
        self.taxPaid = taxPaid
        self.numberOfChildren = numberOfChildren
    }
}
