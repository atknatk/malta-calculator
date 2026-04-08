import Foundation

/// Official Malta Social Security constants for children's allowance.
public enum ChildrensAllowanceConstants {
    /// Maximum income threshold (€30,000).
    public static let maxIncomeThreshold: Money = 30000
    /// Minimum income threshold (€8,170).
    public static let minIncomeThreshold: Money = 8170
    /// Mid-range income threshold (€23,068).
    public static let midIncomeThreshold: Money = 23068
    /// Maximum weekly rate per child (€27.29).
    public static let maxWeeklyRate: Money = Decimal(string: "27.29") ?? 27
    /// Minimum weekly rate per child (€8.66).
    public static let minWeeklyRate: Money = Decimal(string: "8.66") ?? 9
    /// Percentage applied to income difference.
    public static let percentage: Decimal = Decimal(string: "6.5") ?? 6
    /// Weeks per year.
    public static let weeksPerYear: Int = 52
    /// Payment frequency in weeks (quarterly = 13 weeks).
    public static let paymentWeeks: Int = 13
    /// Birth bonus for 1st child.
    public static let birthBonusFirstChild: Money = 1000
    /// Birth bonus for 2nd child.
    public static let birthBonusSecondChild: Money = 1500
    /// Birth bonus for 3rd+ child.
    public static let birthBonusThirdPlus: Money = 2000
}
