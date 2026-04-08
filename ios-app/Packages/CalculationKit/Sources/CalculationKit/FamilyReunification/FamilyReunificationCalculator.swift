import Foundation

/// Malta Family Reunification Calculator.
///
/// Two schemes:
/// 1. Family Reunification (S.L. 217.6): Average Wage (Gross) + 20% per member
/// 2. Family Member Policy: €18,940 Net + 20% of median wage per member
public struct FamilyReunificationCalculator: Sendable {
    public init() {}

    /// Calculates minimum salary requirement for family reunification.
    public func calculate(input: FamilyReunificationInput) -> FamilyReunificationOutput {
        let percentagePerMember: Decimal = 20
        let members = Decimal(input.familyMemberCount)

        switch input.scheme {
        case .familyReunification:
            let baseWage = input.customBaseWage ?? FamilyReunificationWageData.averageWageGross
            let perMemberAddition = baseWage * (percentagePerMember / 100)
            let totalAddition = perMemberAddition * members
            let minimumRequired = baseWage + totalAddition

            return FamilyReunificationOutput(
                minimumRequired: minimumRequired.rounded(to: 2),
                incomeType: "gross",
                baseWage: baseWage,
                additionalAmount: totalAddition.rounded(to: 2),
                percentagePerMember: percentagePerMember,
                breakdownBase: baseWage,
                breakdownPerMemberAddition: perMemberAddition.rounded(to: 2),
                breakdownTotalAddition: totalAddition.rounded(to: 2),
                schemeName: "Family Reunification (S.L. 217.6)"
            )

        case .familyMemberPolicy:
            let baseWage = input.customBaseWage ?? FamilyReunificationWageData.medianWageNet
            let perMemberAddition = FamilyReunificationWageData.medianWageNet * (percentagePerMember / 100)
            let totalAddition = perMemberAddition * members
            let minimumRequired = baseWage + totalAddition

            return FamilyReunificationOutput(
                minimumRequired: minimumRequired.rounded(to: 2),
                incomeType: "net",
                baseWage: baseWage,
                additionalAmount: totalAddition.rounded(to: 2),
                percentagePerMember: percentagePerMember,
                breakdownBase: baseWage,
                breakdownPerMemberAddition: perMemberAddition.rounded(to: 2),
                breakdownTotalAddition: totalAddition.rounded(to: 2),
                schemeName: "Family Member Policy"
            )
        }
    }

    /// Compares both schemes for a given number of family members.
    public func compareSchemes(count: Int) -> (familyReunification: FamilyReunificationOutput, familyMemberPolicy: FamilyReunificationOutput) {
        let fr = calculate(input: FamilyReunificationInput(familyMemberCount: count, scheme: .familyReunification))
        let fmp = calculate(input: FamilyReunificationInput(familyMemberCount: count, scheme: .familyMemberPolicy))
        return (familyReunification: fr, familyMemberPolicy: fmp)
    }
}
