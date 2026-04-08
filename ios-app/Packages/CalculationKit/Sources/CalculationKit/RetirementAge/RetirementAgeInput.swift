import Foundation

/// Gender used only for the pre-1952 retirement age bracket.
public enum Gender: String, CaseIterable, Codable, Sendable {
    /// Male.
    case male
    /// Female.
    case female
}

/// Input for the Malta retirement age calculator.
public struct RetirementAgeInput: Sendable, Codable, Equatable {
    /// Year the person was born.
    public var birthYear: Int
    /// Gender (only affects retirement age for those born 1951 or earlier).
    public var gender: Gender?

    /// Creates a new retirement age input.
    public init(birthYear: Int, gender: Gender? = nil) {
        self.birthYear = birthYear
        self.gender = gender
    }
}
