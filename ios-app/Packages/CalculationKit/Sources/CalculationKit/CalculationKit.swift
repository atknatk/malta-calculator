// Public API umbrella — a single `import CalculationKit` exposes every motor.

@_exported import Foundation

// ─── CalculationKit ─────────────────────────────────────────────────────────
//
// Malta financial calculation motors package.
//
// ## Motors
//
// - ``SalaryCalculator`` — cumulative income tax, SSC, COLA
// - ``MortgageCalculator`` — standard amortisation formula
// - ``PersonalLoanCalculator`` — personal loan amortisation
// - ``StampDutyCalculator`` — property transfer stamp duty
// - ``SavingsCalculator`` — compound interest with 15% withholding tax
// - ``PensionCalculator`` — two-thirds state pension
// - ``RetirementAgeCalculator`` — statutory retirement age
// - ``OvertimeCalculator`` — overtime pay (1.5×, 2×)
// - ``VacationCalculator`` — vacation leave entitlement
// - ``NoticePeriodCalculator`` — notice period by service length
// - ``ChildrensAllowanceCalculator`` — children's allowance by income
// - ``FamilyReunificationCalculator`` — family reunification salary
// - ``VehicleRegistrationFeeCalculator`` — vehicle reg fees
// - ``VehicleRegistrationTaxCalculator`` — CO2-based reg tax
// - ``RoadLicenseCalculator`` — annual circulation tax
// - ``DriversLicenseCalculator`` — driver's license fees
// - ``VRTCalculator`` — vehicle roadworthiness test
// - ``ImportVehicleCalculator`` — full import cost breakdown
//
// ─────────────────────────────────────────────────────────────────────────────

/// Top-level namespace and version marker for the `CalculationKit` package.
public enum CalculationKit {
    /// Semantic version of the package.
    public static let version = "1.0.0"
}
