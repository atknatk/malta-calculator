import Foundation

/// Malta State Pension Calculator (2026).
///
/// Implements the Two-Thirds Pension formula from the Social Security Act
/// (Cap. 318) including child credits, MPI cap, deferral bonuses, pensioner
/// COLA, private pension tax credit, and the LN 53/2026 exemption.
public struct PensionCalculator: Sendable {

    /// Creates a new pension calculator.
    public init() {}

    /// Calculates the Malta state pension for the given input.
    ///
    /// - Parameter input: A ``PensionInput`` describing the contributor's profile.
    /// - Returns: A ``PensionOutput`` with full breakdown and any warnings.
    public func calculate(input: PensionInput) -> PensionOutput {
        var warnings: [String] = []

        let retirementAge = PensionRules.retirementAge(birthYear: input.birthYear)
        let requiredYears = PensionRules.requiredYears(birthYear: input.birthYear)
        let childCredits = PensionRules.childCredits(
            birthYear: input.birthYear,
            children: input.children
        )
        let effectiveYears = Swift.max(0, input.paidYears) + childCredits

        // --- Eligibility ---
        let isEligible = input.paidYears >= PensionConstants.minContributionYears
        if !isEligible {
            warnings.append(
                "Minimum \(PensionConstants.minContributionYears) years of contributions required. "
                + "You currently have \(input.paidYears)."
            )
        }

        // --- Pensionable Income (MPI cap) ---
        let clampedSalary = Swift.max(0, input.averageSalary)
        let isMPICapped = input.averageSalary > PensionConstants.mpi2026
        let pensionableIncome = Swift.min(clampedSalary, PensionConstants.mpi2026)
        if isMPICapped {
            warnings.append(
                "Your salary exceeds the Maximum Pensionable Income cap of \(PensionConstants.mpi2026.eur)."
            )
        }

        // --- Proportion ---
        let proportion: Decimal = {
            guard requiredYears > 0 else { return 0 }
            return Swift.min(Decimal(effectiveYears) / Decimal(requiredYears), 1)
        }()

        if effectiveYears < requiredYears, isEligible {
            let pct = (proportion * 100).rounded(to: 1)
            warnings.append(
                "You have \(effectiveYears) effective years out of \(requiredYears) required "
                + "— pension pro-rated to \(pct)%."
            )
        }

        // --- Base Annual Pension (Two-Thirds formula) ---
        let twoThirds: Decimal = Decimal(2) / Decimal(3)
        let baseAnnualPension: Money = isEligible
            ? pensionableIncome * twoThirds * proportion
            : 0

        // --- Deferral Bonus ---
        let deferralBonusRate = PensionRules.deferralBonusRate(input.deferralYears)
        let deferralBonusAmount = baseAnnualPension * deferralBonusRate
        let pensionAfterDeferral = baseAnnualPension + deferralBonusAmount

        // --- COLA ---
        let annualCola: Money = isEligible
            ? PensionConstants.weeklyColaPensioner2026 * 52
            : 0

        // --- Final pension ---
        let annualPension = pensionAfterDeferral + annualCola
        let weeklyPension: Money = annualPension / 52
        let monthlyPension: Money = annualPension / 12

        // --- Private Pension Tax Credit ---
        let clampedContribution = Swift.min(
            Swift.max(0, input.privatePensionContribution),
            PensionConstants.privatePensionMaxContribution
        )
        let privateTaxCredit = Swift.min(
            clampedContribution * PensionConstants.privatePensionTaxCreditRate,
            PensionConstants.privatePensionMaxCredit
        )

        // --- 2026 Pension Tax Exemption (LN 53/2026) ---
        let isPensionFullyExempt = annualPension <= PensionConstants.pensionExemptionLimit2026
        let taxablePensionAfterExemption = Swift.max(
            0,
            annualPension - PensionConstants.pensionExemptionLimit2026
        )

        let totalAnnualIncome = annualPension + privateTaxCredit

        return PensionOutput(
            isEligible: isEligible,
            retirementAge: retirementAge,
            requiredYears: requiredYears,
            paidYears: input.paidYears,
            childCredits: childCredits,
            effectiveYears: effectiveYears,
            proportion: proportion,
            pensionableIncome: pensionableIncome,
            isMPICapped: isMPICapped,
            mpi: PensionConstants.mpi2026,
            baseAnnualPension: baseAnnualPension,
            deferralBonusRate: deferralBonusRate,
            deferralBonusAmount: deferralBonusAmount,
            annualCola: annualCola,
            annualPension: annualPension,
            monthlyPension: monthlyPension,
            weeklyPension: weeklyPension,
            privateContribution: clampedContribution,
            privateTaxCredit: privateTaxCredit,
            isPensionFullyExempt: isPensionFullyExempt,
            pensionExemptionLimit: PensionConstants.pensionExemptionLimit2026,
            taxablePensionAfterExemption: taxablePensionAfterExemption,
            totalAnnualIncome: totalAnnualIncome,
            warnings: warnings
        )
    }
}
