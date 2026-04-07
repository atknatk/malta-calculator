# Task 03 — CalculationKit SPM Package

> **Faz**: M3
> **Ön koşul**: [`01-project-setup.md`](01-project-setup.md) tamamlandı; [`04-tax-config.md`](04-tax-config.md) paralel
> **Çıktı**: `CalculationKit` paketi — tüm hesap motorları + %100 test kapsaması

---

## 1. Amaç

Web tarafındaki TypeScript hesap motorlarını pure Swift'e port etmek. Paket:

- UI-bağımsız
- `Foundation` dışında sıfır dependency
- Thread-safe, `Sendable`
- `Decimal` tabanlı (Double yasak)
- Golden test ile web çıktısıyla karşılaştırılmış (tolerans ±€0.01)
- Public API DocC comment'li
- iOS + iPadOS + macOS + watchOS uyumlu

---

## 2. Paket Yapısı (Tam)

```text
Packages/CalculationKit/
├── Package.swift
├── Sources/CalculationKit/
│   ├── CalculationKit.swift               # umbrella public re-exports
│   ├── Core/
│   │   ├── Money.swift                    # typealias Decimal + helpers
│   │   ├── Percentage.swift               # 0-1 decimal
│   │   ├── Month.swift                    # January...December enum
│   │   ├── SimpleTaxType.swift
│   │   ├── TaxRateType.swift
│   │   ├── SSCCategory.swift
│   │   ├── MaltaTaxConfig.swift           # tax config model
│   │   ├── MaltaTaxConfigDTO.swift        # Codable DTO
│   │   ├── TaxConfigStore.swift           # actor, JSON loader
│   │   ├── CalculationError.swift
│   │   ├── DateHelpers.swift              # Monday counts, weeks per month
│   │   └── DecimalFormatters.swift
│   ├── Salary/
│   │   ├── SalaryInput.swift
│   │   ├── SalaryOutput.swift
│   │   ├── SalaryCalculatorConfig.swift
│   │   ├── SalaryCalculator.swift
│   │   └── SSCCalculator.swift
│   ├── Mortgage/
│   │   ├── MortgageInput.swift
│   │   ├── MortgageOutput.swift
│   │   ├── MortgageConstraints.swift
│   │   ├── MortgageCalculator.swift
│   │   └── MortgageSchedule.swift
│   ├── PersonalLoan/
│   │   ├── LoanInput.swift
│   │   ├── LoanOutput.swift
│   │   ├── LoanConstraints.swift
│   │   └── PersonalLoanCalculator.swift
│   ├── StampDuty/
│   │   ├── StampDutyInput.swift
│   │   ├── StampDutyOutput.swift
│   │   └── StampDutyCalculator.swift
│   ├── Savings/
│   │   ├── SavingsInput.swift
│   │   ├── SavingsOutput.swift
│   │   └── SavingsCalculator.swift
│   ├── Pension/
│   │   ├── PensionInput.swift
│   │   ├── PensionOutput.swift
│   │   ├── PensionConstants.swift
│   │   ├── PensionRules.swift
│   │   └── PensionCalculator.swift
│   ├── RetirementAge/
│   │   ├── RetirementAgeInput.swift
│   │   ├── RetirementAgeOutput.swift
│   │   └── RetirementAgeCalculator.swift
│   ├── Overtime/
│   │   ├── OvertimeInput.swift
│   │   ├── OvertimeOutput.swift
│   │   └── OvertimeCalculator.swift
│   ├── Vacation/
│   │   ├── VacationInput.swift
│   │   ├── VacationOutput.swift
│   │   └── VacationCalculator.swift
│   ├── NoticePeriod/
│   │   ├── NoticePeriodInput.swift
│   │   ├── NoticePeriodOutput.swift
│   │   └── NoticePeriodCalculator.swift
│   ├── ChildrensAllowance/
│   │   ├── ChildrensAllowanceInput.swift
│   │   ├── ChildrensAllowanceOutput.swift
│   │   ├── ChildrensAllowanceConstants.swift
│   │   └── ChildrensAllowanceCalculator.swift
│   ├── FamilyReunification/
│   │   ├── FamilyReunificationInput.swift
│   │   ├── FamilyReunificationOutput.swift
│   │   ├── FamilyReunificationWageData.swift
│   │   └── FamilyReunificationCalculator.swift
│   └── Vehicle/
│       ├── VehicleRegistrationFeeCalculator.swift
│       ├── VehicleRegistrationTaxCalculator.swift
│       ├── RoadLicenseCalculator.swift
│       ├── DriversLicenseCalculator.swift
│       ├── VRTCalculator.swift
│       └── ImportVehicleCalculator.swift
├── Resources/
│   └── tax-config-2020-2026.json
└── Tests/CalculationKitTests/
    ├── Golden/
    │   ├── salary_2026_single_25k.json
    │   ├── salary_2026_married_2child_35k.json
    │   ├── salary_2025_parent_28k.json
    │   ├── salary_1962_pensioner_20k.json
    │   ├── mortgage_300k_25y_4.5.json
    │   ├── mortgage_500k_30y_min_deposit.json
    │   ├── personal_loan_10k_5y.json
    │   ├── stamp_duty_first_time.json
    │   ├── stamp_duty_standard.json
    │   ├── savings_100k_5y_compound.json
    │   ├── pension_two_thirds.json
    │   ├── pension_capped_mpi.json
    │   ├── overtime_weekend.json
    │   ├── vacation_full_time.json
    │   ├── vacation_part_time_20h.json
    │   ├── notice_period_5_years.json
    │   ├── vehicle_reg_tax_co2_low.json
    │   ├── vehicle_reg_tax_co2_high.json
    │   ├── children_allowance_3kids.json
    │   └── import_vehicle_total.json
    ├── GoldenLoader.swift
    ├── SalaryCalculatorTests.swift
    ├── MortgageCalculatorTests.swift
    ├── PersonalLoanCalculatorTests.swift
    ├── StampDutyCalculatorTests.swift
    ├── SavingsCalculatorTests.swift
    ├── PensionCalculatorTests.swift
    ├── RetirementAgeCalculatorTests.swift
    ├── OvertimeCalculatorTests.swift
    ├── VacationCalculatorTests.swift
    ├── NoticePeriodCalculatorTests.swift
    ├── ChildrensAllowanceCalculatorTests.swift
    ├── FamilyReunificationCalculatorTests.swift
    ├── VehicleCalculatorsTests.swift
    ├── DateHelpersTests.swift
    └── MoneyTests.swift
```

---

## 3. Core Types

### 3.1 `Money.swift`

```swift
import Foundation

/// Para birimi için tip alias. Tüm finansal hesaplamalarda kullanılır.
public typealias Money = Decimal

public extension Decimal {
    /// Bankers' rounding (yarı çift) ile belirtilen hassasiyete yuvarlar
    func rounded(to places: Int = 2) -> Decimal {
        var source = self
        var result = Decimal.zero
        NSDecimalRound(&result, &source, places, .bankers)
        return result
    }

    /// Negatif değerleri sıfıra clamp eder
    var nonNegative: Decimal {
        Swift.max(0, self)
    }

    /// EUR currency formatı (binlik ayraç, 2 ondalık)
    var eur: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        formatter.maximumFractionDigits = 2
        formatter.minimumFractionDigits = 0
        return formatter.string(from: self as NSDecimalNumber) ?? "—"
    }

    /// Decimal'ı Double'a çevirir (sadece UI/chart için, hesaplamalarda asla)
    var doubleValue: Double {
        (self as NSDecimalNumber).doubleValue
    }

    /// Yüzde hesabı: self * (percent / 100)
    func applying(percent: Decimal) -> Decimal {
        self * percent / 100
    }

    /// 0'dan büyük ise self, değilse fallback
    func orElse(_ fallback: Decimal) -> Decimal {
        self > 0 ? self : fallback
    }
}

public extension Int {
    var money: Money { Decimal(self) }
}

public extension Double {
    /// Literal tanımlamalar için kısa yol — yalnızca test/config'te kullanılmalı
    var money: Money { Decimal(self) }
}
```

### 3.2 `Percentage.swift`

```swift
import Foundation

/// Yüzde için tip alias: 0 ile 1 arası Decimal (0.25 = %25)
public typealias Percentage = Decimal

public extension Percentage {
    /// 0-100 arası değeri 0-1 arasına çevirir
    static func fromPoints(_ points: Decimal) -> Percentage {
        points / 100
    }

    /// 0-1 arası değeri 0-100 arasına çevirir
    var points: Decimal {
        self * 100
    }
}
```

### 3.3 `Month.swift`

```swift
import Foundation

public enum Month: String, CaseIterable, Codable, Sendable, Hashable {
    case january, february, march, april, may, june
    case july, august, september, october, november, december

    public var index: Int {
        Month.allCases.firstIndex(of: self) ?? 0
    }

    public var shortName: String {
        switch self {
        case .january: return "Jan"
        case .february: return "Feb"
        case .march: return "Mar"
        case .april: return "Apr"
        case .may: return "May"
        case .june: return "Jun"
        case .july: return "Jul"
        case .august: return "Aug"
        case .september: return "Sep"
        case .october: return "Oct"
        case .november: return "Nov"
        case .december: return "Dec"
        }
    }

    /// COLA payment aylarını döndürür (Mar/Jun/Sep/Dec)
    public var isCOLAMonth: Bool {
        switch self {
        case .march, .june, .september, .december: return true
        default: return false
        }
    }
}
```

### 3.4 `SimpleTaxType.swift`, `TaxRateType.swift`, `SSCCategory.swift`

```swift
/// UI tarafından kullanılan basit vergi tipi
public enum SimpleTaxType: String, CaseIterable, Codable, Sendable {
    case single
    case married
    case parent
}

/// Config'teki tam vergi kategorileri (2026+ için çocuk sayısı etkili)
public enum TaxRateType: String, CaseIterable, Codable, Sendable {
    case single
    case married
    case marriedOneChild = "married_1child"
    case marriedTwoPlus = "married_2plus"
    case parent
    case parentOneChild = "parent_1child"
    case parentTwoPlus = "parent_2plus"
}

public enum SSCCategory: String, CaseIterable, Codable, Sendable {
    case a = "A"   // 18 yaş altı
    case b = "B"   // Part-time veya min ücret altı
    case c = "C"   // Tam zamanlı
    case d = "D"   // Self-employed
}

/// Basit tipi config'teki tam tipe çözer
public func resolveTaxRateType(
    year: Int,
    simpleType: SimpleTaxType,
    childCount: Int = 0
) -> TaxRateType {
    // 2025 ve öncesi: çocuk sayısı etkisiz
    guard year >= 2026 else {
        switch simpleType {
        case .single: return .single
        case .married: return .married
        case .parent: return .parent
        }
    }

    // 2026+
    switch simpleType {
    case .single:
        return .single
    case .married:
        switch childCount {
        case 0: return .married
        case 1: return .marriedOneChild
        default: return .marriedTwoPlus
        }
    case .parent:
        switch childCount {
        case 0: return .parent
        case 1: return .parentOneChild
        default: return .parentTwoPlus
        }
    }
}
```

### 3.5 `CalculationError.swift`

```swift
public enum CalculationError: Error, LocalizedError, Sendable {
    case configNotFound
    case corruptedConfig(reason: String)
    case invalidYear(Int)
    case invalidInput(field: String, reason: String)
    case calculationFailed(reason: String)

    public var errorDescription: String? {
        switch self {
        case .configNotFound:
            return "Tax configuration file not found in bundle."
        case .corruptedConfig(let reason):
            return "Tax configuration is corrupted: \(reason)"
        case .invalidYear(let year):
            return "Year \(year) is not supported."
        case .invalidInput(let field, let reason):
            return "Invalid input for \(field): \(reason)"
        case .calculationFailed(let reason):
            return "Calculation failed: \(reason)"
        }
    }
}
```

### 3.6 `DateHelpers.swift`

```swift
import Foundation

public enum DateHelpers {
    /// Belirtilen ay için Pazartesi sayısını hesaplar (SSC hafta bazlı hesaplama için)
    public static func mondaysInMonth(year: Int, monthIndex: Int) -> Int {
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone(identifier: "Europe/Malta") ?? .current
        guard let date = calendar.date(from: DateComponents(year: year, month: monthIndex + 1, day: 1)),
              let range = calendar.range(of: .day, in: .month, for: date)
        else { return 4 }

        var count = 0
        for day in range {
            let components = DateComponents(year: year, month: monthIndex + 1, day: day)
            if let d = calendar.date(from: components), calendar.component(.weekday, from: d) == 2 {
                count += 1
            }
        }
        return count
    }

    public static func weeksForMonth(year: Int, month: Month) -> Int {
        mondaysInMonth(year: year, monthIndex: month.index)
    }

    public static func weeksPerMonthForYear(_ year: Int) -> [Month: Int] {
        var result: [Month: Int] = [:]
        for month in Month.allCases {
            result[month] = weeksForMonth(year: year, month: month)
        }
        return result
    }

    public static func isBornBefore1962(_ date: Date) -> Bool {
        let calendar = Calendar(identifier: .gregorian)
        let year = calendar.component(.year, from: date)
        return year < 1962
    }
}
```

---

## 4. Port Örneği — Salary (Full)

### 4.1 `SalaryInput.swift`

```swift
import Foundation

public struct SalaryInput: Sendable, Codable, Equatable {
    public var month: Month
    public var grossWage: Money
    public var bonus: Money
    public var governmentBonus: Money
    public var allowanceBonus: Money
    public var weeksInMonth: Int?

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
```

### 4.2 `SalaryOutput.swift`

```swift
import Foundation

public struct SalaryOutput: Sendable, Codable, Equatable {
    public let month: Month
    public let grossWage: Money
    public let basicSalary: Money
    public let nonTaxBenefit: Money
    public let taxBenefit: Money
    public let bonus: Money
    public let governmentBonus: Money
    public let grossTotal: Money
    public let sscBase: Money
    public let sscTax: Money
    public let incomeBase: Money
    public let cumulativeIncomeBase: Money
    public let cumulativeTax: Money
    public let incomeTax: Money
    public let net: Money
    public let paid: Money
    public let discr: Money
}

public struct SalarySummary: Sendable, Codable, Equatable {
    public let annualGross: Money
    public let annualSSC: Money
    public let annualIncomeTax: Money
    public let annualNet: Money
    public let averageMonthlyNet: Money
    public let effectiveTaxRate: Decimal   // 0-1

    public init(from months: [SalaryOutput]) {
        self.annualGross = months.map(\.grossTotal).reduce(0, +)
        self.annualSSC = months.map(\.sscTax).reduce(0, +)
        self.annualIncomeTax = months.map(\.incomeTax).reduce(0, +)
        self.annualNet = months.map(\.net).reduce(0, +)
        self.averageMonthlyNet = months.isEmpty ? 0 : (annualNet / Decimal(months.count))
        self.effectiveTaxRate = annualGross > 0
            ? (annualSSC + annualIncomeTax) / annualGross
            : 0
    }
}
```

### 4.3 `SalaryCalculatorConfig.swift`

```swift
import Foundation

public struct SalaryCalculatorConfig: Sendable, Codable, Equatable {
    public var year: Int
    public var simpleTaxType: SimpleTaxType
    public var childCount: Int
    public var sscCategory: SSCCategory
    public var birthDate: Date
    public var yearlyNonTaxBenefit: Money
    public var yearlyTaxableBenefit: Money
    public var monthlyBonus: Money
    public var enableCOLA: Bool
    public var weeksPerMonthOverride: Int?

    public init(
        year: Int = 2026,
        simpleTaxType: SimpleTaxType = .single,
        childCount: Int = 0,
        sscCategory: SSCCategory = .c,
        birthDate: Date = DateComponents(calendar: .init(identifier: .gregorian),
                                         year: 1990, month: 1, day: 1).date ?? Date(),
        yearlyNonTaxBenefit: Money = 0,
        yearlyTaxableBenefit: Money = 0,
        monthlyBonus: Money = 0,
        enableCOLA: Bool = true,
        weeksPerMonthOverride: Int? = nil
    ) {
        self.year = year
        self.simpleTaxType = simpleTaxType
        self.childCount = childCount
        self.sscCategory = sscCategory
        self.birthDate = birthDate
        self.yearlyNonTaxBenefit = yearlyNonTaxBenefit
        self.yearlyTaxableBenefit = yearlyTaxableBenefit
        self.monthlyBonus = monthlyBonus
        self.enableCOLA = enableCOLA
        self.weeksPerMonthOverride = weeksPerMonthOverride
    }

    public static let `default` = SalaryCalculatorConfig()
}
```

### 4.4 `SSCCalculator.swift`

```swift
import Foundation

struct SSCCalculator {
    let sscRates: MaltaTaxConfig.SSCRates
    let sscCategory: SSCCategory
    let isBornBefore1962: Bool

    /// Haftalık SSC base hesaplar (cap uygulanır)
    /// Excel formülü: IF((B*12)/52 < CAP, (B*12)/52 * weeks, CAP * weeks)
    func calculateBase(basicSalary: Money, weeksInMonth: Int) -> Money {
        let weeklyEquivalent = (basicSalary * 12) / 52
        let weeklyCap = isBornBefore1962 ? sscRates.weeklyCapOld : sscRates.weeklyCapNew
        let weeks = Decimal(weeksInMonth)

        if weeklyEquivalent < weeklyCap {
            return weeklyEquivalent * weeks
        }
        return weeklyCap * weeks
    }

    /// SSC tax hesaplar (kategori bazlı)
    func calculateTax(sscBase: Money, weeksInMonth: Int) -> Money {
        let weeks = Decimal(weeksInMonth)

        switch sscCategory {
        case .a:
            return (sscRates.categoryA * weeks).rounded(to: 2)
        case .b:
            let weeklyCapped = (sscRates.categoryB * weeks).rounded(to: 2)
            let tenPercent = (sscBase * Decimal(0.1)).rounded(to: 2)
            return Swift.min(weeklyCapped, tenPercent)
        case .c:
            let categoryRate = isBornBefore1962 ? sscRates.categoryCOld : sscRates.categoryCNew
            let weeklyCapped = (categoryRate * weeks).rounded(to: 2)
            let tenPercent = (sscBase * Decimal(0.1)).rounded(to: 2)
            return Swift.min(weeklyCapped, tenPercent)
        case .d:
            let categoryRate = isBornBefore1962 ? sscRates.categoryDOld : sscRates.categoryDNew
            return (categoryRate * weeks).rounded(to: 2)
        }
    }
}
```

### 4.5 `SalaryCalculator.swift`

```swift
import Foundation

/// Malta Salary Calculator
/// - Kümülatif gelir vergisi sistemi (ilk ay + sonraki aylar)
/// - SSC hesabı (kategori bazlı)
/// - COLA (Cost of Living Adjustment) opsiyonel
///
/// Referans: `src/utils/salary-calculator.ts`
public struct SalaryCalculator: Sendable {
    public let config: SalaryCalculatorConfig
    public let taxConfig: MaltaTaxConfig

    public init(config: SalaryCalculatorConfig, taxConfig: MaltaTaxConfig) {
        self.config = config
        self.taxConfig = taxConfig
    }

    /// 12 aylık maaş hesaplamasını üretir
    public func calculate(inputs: [SalaryInput]) throws -> [SalaryOutput] {
        guard let yearConfig = taxConfig.years[config.year] else {
            throw CalculationError.invalidYear(config.year)
        }

        let effectiveTaxType = resolveTaxRateType(
            year: config.year,
            simpleType: config.simpleTaxType,
            childCount: config.childCount
        )

        guard let taxBrackets = yearConfig.brackets[effectiveTaxType]
            ?? yearConfig.brackets[.single]
        else {
            throw CalculationError.corruptedConfig(
                reason: "No brackets for \(effectiveTaxType) in \(config.year)"
            )
        }

        let sscCalculator = SSCCalculator(
            sscRates: yearConfig.ssc,
            sscCategory: config.sscCategory,
            isBornBefore1962: DateHelpers.isBornBefore1962(config.birthDate)
        )

        // Monthly base benefits
        let monthlyNonTaxBenefit = config.yearlyNonTaxBenefit / 12
        let monthlyTaxBenefit = config.yearlyTaxableBenefit / 12

        // Annual gross preview (for bracket lookup)
        let totalAnnualGross = inputs.map(\.grossWage).reduce(0, +)

        // Cumulative values
        var cumulativeIncomeBase: Money = 0
        var cumulativeTax: Money = 0

        var outputs: [SalaryOutput] = []
        outputs.reserveCapacity(inputs.count)

        for (index, input) in inputs.enumerated() {
            let grossWage = input.grossWage.nonNegative
            let inputBonus = input.bonus.nonNegative
            let inputGovBonus = input.governmentBonus.nonNegative
            let safeAllowanceBonus = input.allowanceBonus.nonNegative

            let weeksInMonth = config.weeksPerMonthOverride
                ?? input.weeksInMonth
                ?? DateHelpers.weeksForMonth(year: config.year, month: input.month)

            let basicSalary = grossWage
            let nonTaxBenefit = monthlyNonTaxBenefit
            let taxBenefit = monthlyTaxBenefit

            // Bonus + Government bonus (COLA)
            let monthlyBonusFallback = config.monthlyBonus
            let bonus = inputBonus > 0 ? inputBonus : monthlyBonusFallback
            let autoCOLA: Money = config.enableCOLA
                ? yearConfig.cola.amount(for: input.month)
                : 0
            let governmentBonus = inputGovBonus > 0 ? inputGovBonus : autoCOLA
            let halfAdditional = safeAllowanceBonus / 2

            // Gross total
            let grossTotal = basicSalary
                + nonTaxBenefit
                + taxBenefit
                + bonus
                + governmentBonus
                + halfAdditional

            // SSC
            let sscBase = sscCalculator.calculateBase(
                basicSalary: basicSalary,
                weeksInMonth: weeksInMonth
            )
            let sscTax = sscCalculator.calculateTax(
                sscBase: sscBase,
                weeksInMonth: weeksInMonth
            )

            // Income base (taxable)
            let incomeBase = grossTotal - nonTaxBenefit
            cumulativeIncomeBase += incomeBase

            // Income tax (cumulative system)
            let incomeTax = calculateMonthlyIncomeTax(
                incomeBase: incomeBase,
                cumulativeIncomeBase: cumulativeIncomeBase,
                previousCumulativeTax: cumulativeTax,
                monthIndex: index,
                annualGross: totalAnnualGross,
                taxBrackets: taxBrackets
            )
            cumulativeTax += incomeTax

            // Net
            let net = grossTotal - sscTax - incomeTax
            let paid = net + halfAdditional
            let discr = grossTotal - paid

            outputs.append(SalaryOutput(
                month: input.month,
                grossWage: grossWage,
                basicSalary: basicSalary,
                nonTaxBenefit: nonTaxBenefit.rounded(),
                taxBenefit: taxBenefit.rounded(),
                bonus: bonus,
                governmentBonus: governmentBonus,
                grossTotal: grossTotal.rounded(),
                sscBase: sscBase.rounded(),
                sscTax: sscTax.rounded(),
                incomeBase: incomeBase.rounded(),
                cumulativeIncomeBase: cumulativeIncomeBase.rounded(),
                cumulativeTax: cumulativeTax.rounded(),
                incomeTax: incomeTax.rounded(),
                net: net.rounded(),
                paid: paid.rounded(),
                discr: discr.rounded()
            ))
        }

        return outputs
    }

    /// Aylık gelir vergisi hesaplar (kümülatif sistem)
    private func calculateMonthlyIncomeTax(
        incomeBase: Money,
        cumulativeIncomeBase: Money,
        previousCumulativeTax: Money,
        monthIndex: Int,
        annualGross: Money,
        taxBrackets: [MaltaTaxConfig.TaxBracket]
    ) -> Money {
        guard let bracket = findTaxBracket(for: annualGross, in: taxBrackets),
              bracket.rate > 0
        else { return 0 }

        if monthIndex == 0 {
            let yearlyProjectedTax = incomeBase * 12 * bracket.rate - bracket.deduction
            return Swift.max(0, yearlyProjectedTax / 12)
        } else {
            let monthNumber = Decimal(monthIndex + 1)
            let projectedAnnualIncome = (cumulativeIncomeBase / monthNumber) * 12
            let yearlyProjectedTax = projectedAnnualIncome * bracket.rate - bracket.deduction
            let monthlyTax = (yearlyProjectedTax / 12) * monthNumber - previousCumulativeTax
            return Swift.max(0, monthlyTax)
        }
    }

    private func findTaxBracket(
        for annualIncome: Money,
        in brackets: [MaltaTaxConfig.TaxBracket]
    ) -> MaltaTaxConfig.TaxBracket? {
        for bracket in brackets where annualIncome >= bracket.min && annualIncome <= bracket.max {
            return bracket
        }
        return brackets.last
    }
}
```

---

## 5. Port Sırası & Karmaşıklık

| Sıra       | Motor                | Kompleksite | Web LOC   | Tahmini Swift LOC | Golden Fixture |
| ---------- | -------------------- | ----------- | --------- | ----------------- | -------------- |
| 1          | Salary               | Yüksek      | 308       | ~450              | 4              |
| 2          | Mortgage             | Orta        | 202       | ~280              | 2              |
| 3          | Personal Loan        | Orta        | 173       | ~240              | 2              |
| 4          | Stamp Duty           | Düşük       | 93        | ~130              | 3              |
| 5          | Savings              | Orta        | 189       | ~260              | 2              |
| 6          | Pension              | Yüksek      | 306       | ~420              | 3              |
| 7          | Retirement Age       | Düşük       | 105       | ~140              | 2              |
| 8          | Overtime             | Düşük       | 130       | ~160              | 2              |
| 9          | Vacation             | Düşük       | 124       | ~150              | 2              |
| 10         | Notice Period        | Düşük       | 115       | ~140              | 1              |
| 11         | Children's Allowance | Orta        | 247       | ~320              | 2              |
| 12         | Family Reunification | Orta        | 201       | ~270              | 2              |
| 13         | Vehicle Reg Fee      | Orta        | 271       | ~340              | 2              |
| 14         | Vehicle Reg Tax      | Orta        | 204       | ~260              | 2              |
| 15         | Road License         | Orta        | 215       | ~280              | 2              |
| 16         | Driver's License     | Orta        | 278       | ~340              | 2              |
| 17         | VRT (MOT)            | Orta        | 222       | ~280              | 2              |
| 18         | Import Vehicle       | Yüksek      | 286       | ~360              | 2              |
| **Toplam** |                      |             | **3,669** | **~4,820**        | **37**         |

---

## 6. Golden Test Pipeline

### 6.1 Fixture Üretimi (Web tarafında)

`scripts/generate-golden-fixtures.ts`:

```typescript
import fs from "fs";
import path from "path";
import {
  calculateMonthlyDeductions,
  defaultConfig,
} from "../src/utils/salary-calculator";
import { calculateMortgage } from "../src/utils/mortgage-calculator";
// ... diğer import'lar

const outputDir = path.join(
  __dirname,
  "../ios/Packages/CalculationKit/Tests/CalculationKitTests/Golden",
);
fs.mkdirSync(outputDir, { recursive: true });

function write<I, O>(name: string, input: I, expected: O) {
  const payload = { input, expected, generatedAt: new Date().toISOString() };
  fs.writeFileSync(
    path.join(outputDir, `${name}.json`),
    JSON.stringify(payload, null, 2),
  );
  console.log(`✓ ${name}.json`);
}

// Salary fixtures
{
  const config = { ...defaultConfig, year: 2026, simpleTaxType: "single" };
  const inputs = Array.from({ length: 12 }, (_, i) => ({
    month: MONTHS[i],
    grossWage: 25000 / 12,
    bonus: 0,
    governmentBonus: 0,
    allowanceBonus: 0,
  }));
  const expected = calculateMonthlyDeductions(inputs, config);
  write("salary_2026_single_25k", { inputs, config }, expected);
}

// ... diğer 36 fixture

console.log("Done. 37 fixtures generated.");
```

`package.json`'a ekle:

```json
{
  "scripts": {
    "golden:generate": "tsx scripts/generate-golden-fixtures.ts"
  }
}
```

### 6.2 `GoldenLoader.swift` (Test target)

```swift
import Foundation
@testable import CalculationKit

struct GoldenFixture<Input: Decodable, Expected: Decodable>: Decodable {
    let input: Input
    let expected: Expected
    let generatedAt: String
}

enum GoldenLoader {
    static func load<Input: Decodable, Expected: Decodable>(
        _ name: String,
        input: Input.Type = Input.self,
        expected: Expected.Type = Expected.self
    ) throws -> GoldenFixture<Input, Expected> {
        guard let url = Bundle.module.url(forResource: name, withExtension: "json")
        else {
            throw CalculationError.configNotFound
        }
        let data = try Data(contentsOf: url)
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return try decoder.decode(GoldenFixture<Input, Expected>.self, from: data)
    }
}
```

### 6.3 Örnek Test

```swift
import Testing
import Foundation
@testable import CalculationKit

@Suite("Salary Calculator")
struct SalaryCalculatorTests {

    @Test("2026 single 25k matches web golden")
    func salary2026Single25k() async throws {
        let fixture = try GoldenLoader.load(
            "salary_2026_single_25k",
            input: SalaryFixtureInput.self,
            expected: [SalaryOutput].self
        )
        let taxConfig = try await TaxConfigStore.shared.load()
        let calculator = SalaryCalculator(
            config: fixture.input.config,
            taxConfig: taxConfig
        )
        let output = try calculator.calculate(inputs: fixture.input.inputs)
        try #require(output.count == fixture.expected.count)

        for (actual, expected) in zip(output, fixture.expected) {
            #expect(abs(actual.net - expected.net) <= 0.01,
                    "Net diff > 0.01 for month \(actual.month)")
            #expect(abs(actual.sscTax - expected.sscTax) <= 0.01,
                    "SSC diff > 0.01 for month \(actual.month)")
            #expect(abs(actual.incomeTax - expected.incomeTax) <= 0.01,
                    "Tax diff > 0.01 for month \(actual.month)")
        }
    }

    struct SalaryFixtureInput: Decodable {
        let inputs: [SalaryInput]
        let config: SalaryCalculatorConfig
    }
}
```

---

## 7. Umbrella Re-exports

`CalculationKit.swift`:

````swift
// Public API umbrella — tek bir import ile tüm modüle erişim

@_exported import Foundation

// Core types otomatik görünür (public)
// Bu dosya yalnızca modül dokümantasyonu için:

/// # CalculationKit
///
/// Malta finansal hesap motorları paketi.
///
/// ## Kullanım
///
/// ```swift
/// import CalculationKit
///
/// let taxConfig = try await TaxConfigStore.shared.load()
/// let calculator = SalaryCalculator(
///     config: .default,
///     taxConfig: taxConfig
/// )
/// let outputs = try calculator.calculate(inputs: inputs)
/// ```
public enum CalculationKit {
    public static let version = "1.0.0"
}
````

---

## 8. Ortak Port Kuralları

### 8.1 Sayısal Tip Dönüşümü

| TS Tip                          | Swift Tip                         |
| ------------------------------- | --------------------------------- |
| `number` (para)                 | `Money` = `Decimal`               |
| `number` (oran 0-1)             | `Decimal`                         |
| `number` (yaş, saat, hafta)     | `Int`                             |
| `number` (boyutsuz yüzde 0-100) | `Decimal`                         |
| `Infinity`                      | `Decimal.greatestFiniteMagnitude` |

### 8.2 Optional'lar

TS `field?: number` → Swift `var field: Int?` (optional).
TS `field = defaultValue` → Swift init parametresinde default.

### 8.3 Enum Dönüşümü

TS string literal union → Swift `enum X: String, CaseIterable, Sendable, Codable`.

### 8.4 Async / Sync

Tüm hesaplamalar **sync** — I/O yok. `TaxConfigStore.load()` async (bir kez disk oku).

### 8.5 Formatter'lar

Web'deki `formatCurrency` vs → Port edilmez. UI tarafı `DSColor.Money.eur` kullanır.

### 8.6 `getXInfo()` Helper'ları

Metinler Swift kodunda değil, feature tarafında `LocalizedStringResource` olarak.
Sayısal sabitler motor içinde `XConstants` enum'unda.

---

## 9. Kabul Kriterleri

- [ ] 18 motor port edildi, swift test yeşil
- [ ] Tüm golden fixture'lar ±€0.01 tolerans içinde
- [ ] `grep -r "Double" Sources/CalculationKit/` → 0 satır (sadece `doubleValue` helper hariç)
- [ ] Public API DocC comment'li (`swift package plugin docc` warning'siz)
- [ ] Test coverage %100 (motor fonksiyonları için)
- [ ] `swift test --parallel` geçiyor
- [ ] Paket iOS, iPadOS, macOS simulator'larda derleniyor
- [ ] Package binary size (resources dahil) < 500 KB
- [ ] `TaxConfigStore` actor thread-safe (concurrency test)

---

## 10. Sıradaki

[`04-tax-config.md`](04-tax-config.md) → [`05-navigation.md`](05-navigation.md)
