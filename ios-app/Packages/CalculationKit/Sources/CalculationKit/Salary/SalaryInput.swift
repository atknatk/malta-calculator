import Foundation

/// Monthly salary input for a single pay period.
public struct SalaryInput: Sendable, Codable, Equatable {
    /// The calendar month this input represents.
    public var month: Month
    /// Gross wage for this month.
    public var grossWage: Money
    /// Additional bonus amount (overrides config's monthlyBonus when > 0).
    public var bonus: Money
    /// Government bonus / COLA amount (overrides auto-COLA when > 0).
    public var governmentBonus: Money
    /// Allowance bonus — half is added to gross, half to net.
    public var allowanceBonus: Money
    /// Optional override for the number of contribution weeks in this month.
    public var weeksInMonth: Int?

    /// Creates a new monthly salary input.
    public init(
        month: Month,
        grossWage: Money,
        bonus: Money = 0,
        governmentBonus: Money = 0,
        allowanceBonus: Money = 0,
        weeksInMonth: Int? = nil
    ) {
        self.month = month
        self.grossWage = grossWage
        self.bonus = bonus
        self.governmentBonus = governmentBonus
        self.allowanceBonus = allowanceBonus
        self.weeksInMonth = weeksInMonth
    }
}
