import Foundation
import Testing
import XCTest
@testable import CalculationKit

// MARK: - Calculation Performance Tests

/// Performance tests for CalculationKit motors.
///
/// These tests measure computation speed to ensure the app stays responsive.
/// Budgets:
/// - Salary 12-month calculation: < 20ms
/// - All motors combined: < 100ms
/// - TaxConfig load: < 50ms
final class CalculationPerformanceTests: XCTestCase {

    private var taxConfig: MaltaTaxConfig!

    override func setUp() async throws {
        try await super.setUp()
        taxConfig = try await TaxConfigStore.shared.load()
    }

    // MARK: - Salary Performance

    func test_salary_12month_calculation_speed() {
        let config = SalaryCalculatorConfig(year: 2026, simpleTaxType: .single)
        let calculator = SalaryCalculator(config: config, taxConfig: taxConfig)
        let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: 2500) }

        let metrics: [XCTMetric] = [XCTClockMetric()]
        let options = XCTMeasureOptions.default
        options.iterationCount = 100

        measure(metrics: metrics, options: options) {
            _ = try? calculator.calculate(inputs: inputs)
        }
    }

    func test_salary_all_tax_types_speed() {
        let types: [SimpleTaxType] = [.single, .married, .parent]
        let childCounts = [0, 1, 2]

        let metrics: [XCTMetric] = [XCTClockMetric()]
        let options = XCTMeasureOptions.default
        options.iterationCount = 50

        measure(metrics: metrics, options: options) {
            for type in types {
                for children in childCounts {
                    let config = SalaryCalculatorConfig(
                        year: 2026, simpleTaxType: type, childCount: children
                    )
                    let calc = SalaryCalculator(config: config, taxConfig: self.taxConfig)
                    let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: 3000) }
                    _ = try? calc.calculate(inputs: inputs)
                }
            }
        }
    }

    // MARK: - Mortgage Performance

    func test_mortgage_calculation_speed() {
        let calc = MortgageCalculator()
        let input = MortgageInput(
            propertyPrice: 500_000, depositPercent: 20,
            interestRate: Decimal(string: "4.5") ?? 4, loanTermYears: 30
        )

        let metrics: [XCTMetric] = [XCTClockMetric()]
        let options = XCTMeasureOptions.default
        options.iterationCount = 100

        measure(metrics: metrics, options: options) {
            _ = calc.calculate(input: input)
        }
    }

    // MARK: - All Motors Combined

    func test_all_motors_combined_speed() {
        let metrics: [XCTMetric] = [XCTClockMetric(), XCTMemoryMetric()]
        let options = XCTMeasureOptions.default
        options.iterationCount = 20

        measure(metrics: metrics, options: options) {
            // Salary
            let salaryConfig = SalaryCalculatorConfig(year: 2026, simpleTaxType: .single)
            let salary = SalaryCalculator(config: salaryConfig, taxConfig: self.taxConfig)
            let salaryInputs = Month.allCases.map { SalaryInput(month: $0, grossWage: 2500) }
            _ = try? salary.calculate(inputs: salaryInputs)

            // Mortgage
            _ = MortgageCalculator().calculate(input: MortgageInput(
                propertyPrice: 300_000, depositPercent: 20,
                interestRate: Decimal(string: "4.5") ?? 4, loanTermYears: 25
            ))

            // Personal Loan
            _ = PersonalLoanCalculator().calculate(input: LoanInput(
                loanAmount: 10_000, interestRate: Decimal(string: "7.5") ?? 7, loanTermMonths: 60
            ))

            // Stamp Duty
            _ = StampDutyCalculator().calculate(input: StampDutyInput(
                propertyPrice: 350_000, isFirstTimeBuyer: true
            ))

            // Savings
            _ = SavingsCalculator().calculate(input: SavingsInput(
                initialDeposit: 50_000, monthlyContribution: 500,
                interestRate: 3, years: 10, compoundingFrequency: .monthly
            ))

            // Pension
            _ = PensionCalculator().calculate(input: PensionInput(
                birthYear: 1970, taxStatus: .single, children: 0,
                paidYears: 40, averageSalary: 25_000,
                deferralYears: .zero, privatePensionContribution: 0
            ))

            // Overtime
            _ = OvertimeCalculator().calculate(input: OvertimeInput(
                hourlyRate: 15, overtimeHours: 8, overtimeType: .sunday
            ))

            // Vacation
            _ = VacationCalculator().calculate(input: VacationInput(
                weeklyHours: 40, year: 2026
            ))

            // Notice Period
            _ = NoticePeriodCalculator().calculate(input: NoticePeriodInput(
                monthsOfService: 60
            ))

            // Children's Allowance
            _ = ChildrensAllowanceCalculator().calculate(input: ChildrensAllowanceInput(
                grossIncome: 30_000, sscPaid: 3_000, rentIncome: 0,
                interestIncome: 0, pensionIncome: 0, maintenanceIncome: 0,
                otherIncome: 0, taxPaid: 5_000, numberOfChildren: 2
            ))

            // Family Reunification
            _ = FamilyReunificationCalculator().calculate(input: FamilyReunificationInput(
                familyMemberCount: 3, scheme: .familyReunification
            ))

            // Vehicle calculators
            _ = VehicleRegistrationTaxCalculator().calculate(input: VehicleRegistrationTaxInput(
                co2Emissions: 150, vehicleAge: 3, engineCapacity: 1600,
                fuelType: .petrol, vehicleValue: 20_000, isEU: true
            ))
            _ = RoadLicenseCalculator().calculate(input: RoadLicenseInput(
                engineCapacity: 1600, co2Emissions: 140, vehicleAge: 5,
                fuelType: .petrol, vehicleCategory: .privateCar, licensePeriod: 12
            ))
            _ = DriversLicenseCalculator().calculate(input: DriversLicenseInput(
                licenseType: .new, age: 25, category: .b,
                validityPeriod: 10, includeTheoryTest: true,
                includePracticalTest: true, isFirstLicense: true
            ))
            _ = VRTCalculator().calculate(input: VRTInput(
                vehicleType: .car, vehicleAge: 5, isRetest: false
            ))
            _ = ImportVehicleCalculator().calculate(input: ImportVehicleInput(
                purchasePrice: 20_000, currency: .eur, vehicleAge: 3,
                co2Emissions: 130, engineCapacity: 1600, fuelType: .petrol,
                isEU: true, shippingCost: 500, isNew: false
            ))
        }
    }

    // MARK: - TaxConfig Load Performance

    func test_tax_config_load_speed() async throws {
        let metrics: [XCTMetric] = [XCTClockMetric()]
        let options = XCTMeasureOptions.default
        options.iterationCount = 50

        measure(metrics: metrics, options: options) {
            let store = TaxConfigStore.shared
            let expectation = self.expectation(description: "config loaded")
            Task {
                await store.invalidateCache()
                _ = try? await store.load()
                expectation.fulfill()
            }
            self.wait(for: [expectation], timeout: 5)
        }
    }
}
