import Foundation

/// Pure-function rule look-ups for the Malta state pension.
public enum PensionRules {

    /// Returns the number of SSC contribution years required for a full pension.
    ///
    /// - Parameter birthYear: Year of birth.
    /// - Returns: Required contribution years (35, 40, 41, or 42).
    public static func requiredYears(birthYear: Int) -> Int {
        if birthYear < 1962 { return 35 }
        if birthYear <= 1968 { return 40 }
        if birthYear <= 1975 { return 41 }
        return 42
    }

    /// Returns the statutory retirement age for a given birth year.
    ///
    /// Gender-based differences (pre-1952) are collapsed to 61 here;
    /// see ``RetirementAgeCalculator`` for the gender-aware variant.
    ///
    /// - Parameter birthYear: Year of birth.
    /// - Returns: Retirement age in years.
    public static func retirementAge(birthYear: Int) -> Int {
        if birthYear <= 1951 { return 61 }
        if birthYear <= 1955 { return 62 }
        if birthYear <= 1958 { return 63 }
        if birthYear <= 1961 { return 64 }
        return 65
    }

    /// Returns the child-credit years awarded for pension purposes.
    ///
    /// A maximum of 3 children are counted. The credit per child depends
    /// on whether the contributor was born before or after 1962.
    ///
    /// - Parameters:
    ///   - birthYear: Year of birth.
    ///   - children: Number of children.
    /// - Returns: Total credited years from child-rearing.
    public static func childCredits(birthYear: Int, children: Int) -> Int {
        let capped = Swift.min(Swift.max(0, children), 3)
        let creditPerChild = birthYear >= 1962 ? 4 : 2
        return capped * creditPerChild
    }

    /// Returns the deferral bonus rate for the given number of deferred years.
    ///
    /// - Parameter years: ``DeferralYears`` enum value (0--4).
    /// - Returns: Bonus rate as a `Decimal` (e.g. 0.05 for 5 %).
    public static func deferralBonusRate(_ years: DeferralYears) -> Decimal {
        switch years {
        case .zero:  return 0
        case .one:   return Decimal(string: "0.05") ?? 0
        case .two:   return Decimal(string: "0.10") ?? 0
        case .three: return Decimal(string: "0.18") ?? 0
        case .four:  return Decimal(string: "0.29") ?? 0
        }
    }
}
