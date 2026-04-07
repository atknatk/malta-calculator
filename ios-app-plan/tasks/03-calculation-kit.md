# Task 03 — CalculationKit SPM Package

> **Faz**: M3
> **Ön koşul**: [`01-project-setup.md`](01-project-setup.md), [`04-tax-config.md`](04-tax-config.md) (paralel ilerleyebilir)
> **Çıktı**: `CalculationKit` paketi — tüm hesap motorları + %100 test kapsaması

---

## 1. Amaç

Web tarafındaki TS hesap motorlarını saf Swift'e port etmek. Paket:

- UI-bağımsız
- `Foundation` dışında sıfır dependency
- Thread-safe, `Sendable`
- `Decimal` tabanlı (Double yasak)
- Golden test ile web çıktısıyla karşılaştırılmış

---

## 2. Paket Yapısı

```
Packages/CalculationKit/
├── Package.swift
├── Sources/CalculationKit/
│   ├── Core/
│   │   ├── Money.swift               # typealias Decimal + format helpers
│   │   ├── TaxConfigLoader.swift     # JSON loader
│   │   └── Errors.swift
│   ├── Salary/
│   │   ├── SalaryCalculator.swift
│   │   ├── SalaryInput.swift
│   │   ├── SalaryOutput.swift
│   │   └── SSCCalculator.swift
│   ├── Mortgage/
│   │   ├── MortgageCalculator.swift
│   │   └── MortgageSchedule.swift
│   ├── StampDuty/
│   ├── PersonalLoan/
│   ├── Savings/
│   ├── Pension/
│   ├── RetirementAge/
│   ├── Overtime/
│   ├── NoticePeriod/
│   ├── Vacation/
│   ├── ChildrensAllowance/
│   ├── FamilyReunification/
│   ├── Vehicle/
│   │   ├── VehicleRegistrationFeeCalculator.swift
│   │   ├── VehicleRegistrationTaxCalculator.swift
│   │   ├── RoadLicenseCalculator.swift
│   │   ├── DriversLicenseCalculator.swift
│   │   ├── VRTCalculator.swift
│   │   └── ImportVehicleCalculator.swift
│   └── CalculationKit.swift           # umbrella public re-exports
├── Resources/
│   └── tax-config-2020-2026.json      # Package.swift ile process resource
└── Tests/CalculationKitTests/
    ├── Golden/                         # web'den alınan fixture JSON'lar
    │   ├── salary_2026_single.json
    │   ├── mortgage_300k_25yr.json
    │   └── ...
    ├── SalaryCalculatorTests.swift
    ├── MortgageCalculatorTests.swift
    └── ...
```

---

## 3. Core

### 3.1 `Money.swift`

```swift
public typealias Money = Decimal

public extension Money {
    func rounded(to places: Int = 2) -> Money {
        var source = self
        var result = Money.zero
        NSDecimalRound(&result, &source, places, .bankers)
        return result
    }

    var eur: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        formatter.maximumFractionDigits = 2
        return formatter.string(from: self as NSDecimalNumber) ?? "—"
    }
}
```

### 3.2 `TaxConfigLoader.swift`

- Bundle.module'dan JSON oku
- `Decodable` struct'lara parse et: `TaxBrackets`, `SSCRates`, `COLA`
- Cache (singleton veya actor)

Detay için [`04-tax-config.md`](04-tax-config.md).

---

## 4. Port Stratejisi (Örnek: Salary)

### 4.1 Web Kod (TS — referans)

`src/utils/salary-calculator.ts` — kümülatif vergi sistemi:

- İlk ay: `(((incomeBase * 12) * rate) - deduction) / 12`
- Sonraki ay: `(((cumIncomeBase / month * 12) * rate) - deduction) / 12 * month - previousCumTax`
- SSC: kategori A/B/C/D, `isBornBefore1962` flag

### 4.2 Swift Port (Hedef)

```swift
public struct SalaryInput: Sendable {
    public var month: Month
    public var grossWage: Money
    public var bonus: Money
    public var governmentBonus: Money
    public var allowanceBonus: Money
    public var weeksInMonth: Int?
}

public struct SalaryOutput: Sendable, Equatable {
    public let month: Month
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

public struct SalaryCalculatorConfig: Sendable {
    public var year: Int
    public var simpleTaxType: SimpleTaxType
    public var childCount: Int
    public var sscCategory: SSCCategory
    public var birthDate: Date
    public var yearlyNonTaxBenefit: Money
    public var yearlyTaxableBenefit: Money
    public var enableCOLA: Bool
    public var weeksPerMonthOverride: Int?
}

public struct SalaryCalculator {
    let config: SalaryCalculatorConfig
    let taxConfig: MaltaTaxConfig  // loader'dan gelir

    public init(config: SalaryCalculatorConfig, taxConfig: MaltaTaxConfig) {
        self.config = config
        self.taxConfig = taxConfig
    }

    public func calculate(inputs: [SalaryInput]) -> [SalaryOutput] {
        // TS kodunun birebir portu
    }
}
```

### 4.3 Tolerance

Golden test kapsamında web çıktısı ile Swift çıktısı karşılaştırılırken **±€0.01** tolerans kabul edilir. Daha fazla fark = bug.

---

## 5. Port Sırası

| Öncelik | Motor                | Kompleksite                       | Web dosyası                              |
| ------- | -------------------- | --------------------------------- | ---------------------------------------- |
| 1       | Salary               | **Yüksek** (kümülatif, SSC, COLA) | `salary-calculator.ts`                   |
| 2       | Mortgage             | Orta (amortization)               | `mortgage-calculator.ts`                 |
| 3       | Personal Loan        | Orta (loan-calculator)            | `loan-calculator.ts`                     |
| 4       | Stamp Duty           | Düşük                             | `stamp-duty-calculator.ts`               |
| 5       | Savings Interest     | Orta (compound)                   | `savings-calculator.ts`                  |
| 6       | Pension              | Yüksek (two-thirds rule)          | `pension-calculator.ts`                  |
| 7       | Overtime             | Düşük                             | `overtime-calculator.ts`                 |
| 8       | Vacation             | Düşük                             | `vacation-calculator.ts`                 |
| 9       | Notice Period        | Düşük                             | `notice-period-calculator.ts`            |
| 10      | Children's Allowance | Düşük                             | `childrens-allowance-calculator.ts`      |
| 11      | Retirement Age       | Düşük                             | `retirement-age-calculator.ts`           |
| 12      | Family Reunification | Düşük                             | `family-reunification-calculator.ts`     |
| 13      | Vehicle Reg Fee      | Düşük                             | `vehicle-registration-fee-calculator.ts` |
| 14      | Vehicle Reg Tax      | Orta (CO2)                        | `vehicle-registration-tax-calculator.ts` |
| 15      | Road License         | Düşük                             | `road-license-calculator.ts`             |
| 16      | Driver's License     | Düşük                             | `drivers-license-calculator.ts`          |
| 17      | VRT                  | Düşük                             | `vrt-calculator.ts`                      |
| 18      | Import Vehicle       | Yüksek (bileşik)                  | `import-vehicle-calculator.ts`           |

Detay tablo: [`17-calculator-mapping.md`](17-calculator-mapping.md)

---

## 6. Golden Test Pipeline

### 6.1 Fixture Üretimi (Web tarafında, bir defa)

Node.js script: `scripts/generate-golden-fixtures.ts` — her motor için örnek input'lar ile çıktıları JSON'a yazar:

```json
{
  "input": { ... },
  "config": { ... },
  "expected": [ ... ]
}
```

Çıktılar `Packages/CalculationKit/Tests/CalculationKitTests/Golden/*.json`.

### 6.2 Swift Test

```swift
import Testing
@testable import CalculationKit

@Test("Salary 2026 single matches web golden")
func salarySingle2026() throws {
    let fixture = try GoldenLoader.load("salary_2026_single.json")
    let calculator = SalaryCalculator(config: fixture.config, taxConfig: .v2026)
    let output = calculator.calculate(inputs: fixture.inputs)
    for (index, expected) in fixture.expected.enumerated() {
        #expect(abs(output[index].net - expected.net) <= 0.01)
    }
}
```

---

## 7. Kabul Kriterleri

- [ ] Tüm 18 motor port edildi
- [ ] Her motor için en az 2 golden fixture (sınırlı + geniş input)
- [ ] `swift test` %100 yeşil
- [ ] `Decimal` dışı `Double` kullanımı yok (`grep` ile doğrula)
- [ ] Public API DocC comment'li
- [ ] Paket iOS, iPadOS, macOS simulator'larda derleniyor
- [ ] Package size (resources dahil) < 500 KB

---

## 8. Sıradaki

[`04-tax-config.md`](04-tax-config.md) → [`05-navigation.md`](05-navigation.md)
