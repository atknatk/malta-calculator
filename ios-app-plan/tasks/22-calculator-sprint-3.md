# Task 22 — Calculator Detail Sprint 3 (Missing from iOS — Backend Ready)

> **Referans**: [08-feature-calculator-detail.md](08-feature-calculator-detail.md) Sprint 3. Bu task, web'de mevcut olan ama iOS app'inde **hiç olmayan** 12 calculator'ı ekler. **Önemli bilgi**: CalculationKit motorlarının **TAMAMI zaten port edildi** ([03-calculation-kit.md](03-calculation-kit.md) tarafından) — bu task sadece `CalculatorID` enum'a yeni case'ler ekler, UI/ViewModel oluşturur ve `CalculatorsHubScreen`'e kayıt eder.

---

## Hedef

Aşağıdaki 12 calculator'ı iOS app'ine ekle. Backend (CalculationKit) zaten hazır — sadece UI katmanı eksik.

| #   | Calculator               | CalculationKit Motor                             | Web Source                               | Pipeline |
| --- | ------------------------ | ------------------------------------------------ | ---------------------------------------- | -------- |
| 1   | Notice Period            | `NoticePeriod/NoticePeriodCalculator.swift`      | `notice-period-calculator.ts`            | Standard |
| 2   | Overtime                 | `Overtime/OvertimeCalculator.swift`              | `overtime-calculator.ts`                 | Standard |
| 3   | Children's Allowance     | `ChildrensAllowance/ChildrensAllowanceCalc...`   | `childrens-allowance-calculator.ts`      | Standard |
| 4   | Pension                  | `Pension/PensionCalculator.swift`                | `pension-calculator.ts`                  | Standard |
| 5   | Retirement Age           | `RetirementAge/RetirementAgeCalculator.swift`    | `retirement-age-calculator.ts`           | Standard |
| 6   | Vacation Leave           | `Vacation/VacationCalculator.swift`              | `vacation-calculator.ts`                 | Standard |
| 7   | Vehicle Registration Fee | `Vehicle/VehicleRegistrationFeeCalculator.swift` | `vehicle-registration-fee-calculator.ts` | Standard |
| 8   | Vehicle Registration Tax | `Vehicle/VehicleRegistrationTaxCalculator.swift` | `vehicle-registration-tax-calculator.ts` | Standard |
| 9   | Road License             | `Vehicle/RoadLicenseCalculator.swift`            | `road-license-calculator.ts`             | Standard |
| 10  | Driver's License         | `Vehicle/DriversLicenseCalculator.swift`         | `drivers-license-calculator.ts`          | Standard |
| 11  | Import Vehicle           | `Vehicle/ImportVehicleCalculator.swift`          | `import-vehicle-calculator.ts`           | Standard |
| 12  | Family Reunification     | `FamilyReunification/FamilyReunificationCalc...` | `family-reunification-calculator.ts`     | Standard |

---

## Ön Koşullar

✅ CalculationKit motorlar mevcut (yukarıdaki tabloda doğrulandı)
✅ `CalculatorDetailScaffold` mevcut ([Sprint 1 + Task 21](21-calculator-sprint-2.md))
✅ DSEmptyState, DSSkeletonCard, DSErrorState mevcut
✅ AppSignpost mevcut

---

## Adımlar

### 1. CalculatorID Enum Genişlet

`ios-app/MaltaCalculator/Features/Calculators/CalculatorID.swift` — yeni 12 case ekle:

```swift
enum CalculatorID: String, CaseIterable, Identifiable, Hashable {
    // ... existing cases
    case noticePeriod = "notice-period"
    case overtime = "overtime"
    case childrensAllowance = "childrens-allowance"
    case pension = "pension"
    case retirementAge = "retirement-age"
    case vacation = "vacation"
    case vehicleRegistrationFee = "vehicle-registration-fee"
    case vehicleRegistrationTax = "vehicle-registration-tax"
    case roadLicense = "road-license"
    case driversLicense = "drivers-license"
    case importVehicle = "import-vehicle"
    case familyReunification = "family-reunification"

    var id: String { rawValue }

    var displayName: String {
        switch self {
        // ... existing
        case .noticePeriod: return String(localized: "calc.noticePeriod.title")
        case .overtime: return String(localized: "calc.overtime.title")
        // ... rest
        }
    }

    var category: CalculatorCategory {
        switch self {
        // ... existing
        case .noticePeriod, .overtime, .vacation, .childrensAllowance: return .work
        case .pension, .retirementAge: return .retirement
        case .vehicleRegistrationFee, .vehicleRegistrationTax,
             .roadLicense, .driversLicense, .importVehicle: return .vehicle
        case .familyReunification: return .immigration
        }
    }

    var iconSystemName: String {
        switch self {
        case .noticePeriod: return "calendar.badge.clock"
        case .overtime: return "clock.arrow.circlepath"
        case .childrensAllowance: return "figure.2.and.child.holdinghands"
        case .pension: return "building.columns.fill"
        case .retirementAge: return "person.fill.checkmark"
        case .vacation: return "sun.max.fill"
        case .vehicleRegistrationFee: return "car.fill"
        case .vehicleRegistrationTax: return "car.circle.fill"
        case .roadLicense: return "road.lanes"
        case .driversLicense: return "person.text.rectangle"
        case .importVehicle: return "shippingbox.fill"
        case .familyReunification: return "house.fill"
        }
    }
}
```

### 2. CalculatorCategory Genişlet

`CalculatorCategory.swift` (varsa) — yeni kategoriler:

```swift
enum CalculatorCategory: String, CaseIterable {
    case salary
    case property
    case loans
    case savings
    case work          // NEW: notice period, overtime, vacation, children's allowance
    case retirement    // NEW: pension, retirement age
    case vehicle       // NEW: vehicle family
    case immigration   // NEW: family reunification, expatriate
    case taxes         // existing or NEW
    case benefits      // existing or NEW
}
```

### 3. 12 Yeni Klasör + Screen + ViewModel

Her calculator için **aynı pattern**:

```
Features/Calculators/<Name>/
├── <Name>Screen.swift
└── <Name>ViewModel.swift
```

ViewModel template (Sprint 2'deki ile aynı):

```swift
@Observable
@MainActor
final class OvertimeViewModel {
    var weeklyHours: Decimal = 40
    var hourlyRate: Decimal = 0
    var overtimeHours: Decimal = 0
    var overtimeMultiplier: Decimal = 1.5

    var state: CalculatorViewState<OvertimeOutput> = .empty

    private let motor: OvertimeCalculator
    private var debounceTask: Task<Void, Never>?

    init(motor: OvertimeCalculator = OvertimeCalculator()) {
        self.motor = motor
    }

    func recalculate() async {
        guard hourlyRate > 0, overtimeHours > 0 else {
            state = .empty
            return
        }
        state = .loading
        AppSignpost.begin(.calculation, name: "OvertimeRecalculate")
        defer { AppSignpost.end(.calculation, name: "OvertimeRecalculate") }

        do {
            let input = OvertimeInput(
                weeklyHours: weeklyHours,
                hourlyRate: hourlyRate,
                overtimeHours: overtimeHours,
                multiplier: overtimeMultiplier
            )
            let output = try motor.calculate(input: input)
            state = .content(output)
        } catch {
            state = .error(error.localizedDescription)
        }
    }
}
```

Screen template (Sprint 2'deki ile aynı):

```swift
struct OvertimeScreen: View {
    @State private var vm = OvertimeViewModel()

    var body: some View {
        CalculatorDetailScaffold(
            title: String(localized: "calc.overtime.title"),
            subtitle: String(localized: "calc.overtime.subtitle"),
            iconSystemName: "clock.arrow.circlepath"
        ) {
            VStack(spacing: DSSpacing.md) {
                inputCard
                resultsSection
            }
        }
    }

    // inputCard, resultsSection — Sprint 2 pattern'ı ile birebir
}
```

### 4. CalculatorDetailFactory'yi Genişlet

`Features/Calculators/CalculatorDetailFactory.swift`:

```swift
@ViewBuilder
static func screen(for id: CalculatorID) -> some View {
    switch id {
    // ... existing
    // SPRINT 3 — new calculators
    case .noticePeriod:
        NoticePeriodScreen()
    case .overtime:
        OvertimeScreen()
    case .childrensAllowance:
        ChildrensAllowanceScreen()
    case .pension:
        PensionScreen()
    case .retirementAge:
        RetirementAgeScreen()
    case .vacation:
        VacationScreen()
    case .vehicleRegistrationFee:
        VehicleRegistrationFeeScreen()
    case .vehicleRegistrationTax:
        VehicleRegistrationTaxScreen()
    case .roadLicense:
        RoadLicenseScreen()
    case .driversLicense:
        DriversLicenseScreen()
    case .importVehicle:
        ImportVehicleScreen()
    case .familyReunification:
        FamilyReunificationScreen()
    default:
        ComingSoonScreen(id: id)
    }
}
```

### 5. CalculatorsHubScreen Güncellemesi

`Features/Calculators/CalculatorsHubScreen.swift` — `categorisedCalculators` veya equivalent listede 12 yeni calculator otomatik görünmeli (CalculatorID.allCases ile). Eğer manuel listeleme yapıyorsa güncelle:

```swift
private var allCalculators: [CalculatorID] {
    CalculatorID.allCases  // ← otomatik tüm calculator'ları gösterir
}
```

Search ve recently-used da otomatik çalışacak.

### 6. Calculator-Specific Form Inputs

Her calculator için web `src/app/calculators/<id>/page.tsx` referans alınacak. Kritik alanlar:

#### 1. Notice Period

- yearsOfService, monthlySalary, contractType (definite/indefinite)

#### 2. Overtime

- weeklyHours, hourlyRate, overtimeHours, overtimeMultiplier (1.5x default)

#### 3. Children's Allowance

- childCount, householdIncome, householdType (single/couple)

#### 4. Pension

- birthYear, currentAge, monthlyContribution, yearsContributing, expectedRetirementAge

#### 5. Retirement Age

- birthYear, gender (M/F), employmentHistory

#### 6. Vacation Leave

- yearsOfService, weeklyHours, contractType

#### 7. Vehicle Registration Fee

- vehiclePrice, vehicleType (new/used), engineCC, co2Emissions

#### 8. Vehicle Registration Tax

- vehiclePrice, vehicleType, fuelType, age (years)

#### 9. Road License

- vehicleType, engineCC, co2Emissions, fuelType

#### 10. Driver's License

- licenseType (B/C/D), age, isFirstTime

#### 11. Import Vehicle

- vehicleValue, originCountry, year, fuelType, co2

#### 12. Family Reunification

- sponsorIncome, householdSize, applicationType

---

## Localization

`Localizable.xcstrings` 12 calculator × ~10 string = ~120 yeni string. Plural variants için:

- "1 year of service" / "%d years of service"
- "1 child" / "%d children"

---

## Testler

### ViewModel Tests

Her calculator için: `Tests/MaltaCalculatorTests/<Name>ViewModelTests.swift`:

```swift
@MainActor
final class OvertimeViewModelTests: XCTestCase {
    func test_validInputs_calculatesCorrectly() async {
        let vm = OvertimeViewModel()
        vm.hourlyRate = 10
        vm.overtimeHours = 5
        await vm.recalculate()

        guard case .content(let output) = vm.state else {
            XCTFail("Expected content state")
            return
        }
        XCTAssertEqual(output.totalOvertimePay, 75, accuracy: 0.01) // 10 × 5 × 1.5
    }

    func test_zeroInputs_returnsEmpty() async {
        let vm = OvertimeViewModel()
        await vm.recalculate()
        if case .empty = vm.state { } else { XCTFail("Expected empty") }
    }

    func test_negativeMultiplier_returnsError() async {
        // ...
    }
}
```

### Golden Parity Tests

`Packages/CalculationKit/Tests/CalculationKitTests/Golden/` — her calculator için en az 2 fixture (basic + edge case). Web `npm run export-fixtures` ile generate et. ±€0.01 tolerance.

---

## Acceptance Criteria

- [ ] `CalculatorID` enum 12 yeni case
- [ ] `CalculatorCategory` enum 4+ yeni kategori
- [ ] 12 yeni klasör (Screen + ViewModel)
- [ ] `CalculatorDetailFactory` 12 yeni case
- [ ] `CalculatorsHubScreen` otomatik tüm calculator'ları gösteriyor
- [ ] Hepsi `CalculatorDetailScaffold` kullanıyor
- [ ] ViewState pattern (DSEmptyState/DSSkeletonCard/DSErrorState)
- [ ] AppSignpost.measure(.calculation) wrap'leri
- [ ] Debounce 250ms
- [ ] Localizable.xcstrings: ~120 yeni string + plural variants
- [ ] Her calculator için ViewModel unit test (3+ senaryo)
- [ ] Her calculator için golden parity test (2+ fixture)
- [ ] Snapshot test (3 örnek calculator için, light/dark/AX5)
- [ ] Build green, lint clean, 0 warnings, 0 force-unwraps

## Risk

- **Düşük**: CalculationKit zaten port edildi (Pension, Vehicle ailesi, Overtime, vb.)
- **Orta**: 12 calculator çok ama hepsi pattern-based
- **Düşük**: Form inputları web'de net tanımlı

## Tahmini Süre

- Per calculator: ~12 dk (Screen + ViewModel + tests)
- 12 calculator × 12 dk = ~150 dk
- Enum + factory + hub updates: ~20 dk
- Localization: ~30 dk
- **Toplam: ~3-3.5 saat**
