# Task 13 — Testing Strategy

> **Faz**: M3'ten itibaren sürekli, M8'de kapanış
> **Ön koşul**: CalculationKit, DesignSystem, en az bir feature hazır
> **Çıktı**: Unit + Snapshot + UI + Golden test paketleri, CI entegre

---

## 1. Test Piramidi

```text
              UI Tests (5%)
            ─────────────────
          Snapshot Tests (20%)
        ─────────────────────────
      Unit + Golden Tests (75%)
    ─────────────────────────────────
```

| Tip         | Sayı                               | Süre    | Frekans |
| ----------- | ---------------------------------- | ------- | ------- |
| Unit        | ~400                               | < 60s   | Her PR  |
| Golden      | ~37 fixture × ortalama 5 assertion | < 10s   | Her PR  |
| Snapshot    | ~150+                              | < 90s   | Her PR  |
| UI          | ~10 critical flow                  | 3-5 dak | Nightly |
| Performance | ~5 metric                          | 1-2 dak | Nightly |

---

## 2. Test Framework Seçimi

### Swift Testing (yeni, Swift 6)

`import Testing` — modern, expressive, parameterized.

```swift
import Testing

@Suite("Mortgage Calculator")
struct MortgageTests {
    @Test("monthly payment formula")
    func monthlyPayment() throws {
        let result = try MortgageCalculator().calculate(...)
        #expect(result.monthlyPayment > 0)
    }

    @Test("various inputs", arguments: [
        (300_000, 25, 4.5, 1336.76),
        (500_000, 30, 5.0, 2684.11),
        (200_000, 20, 3.5, 1159.92),
    ])
    func parameterized(price: Int, years: Int, rate: Double, expected: Double) throws {
        let result = try MortgageCalculator().calculate(...)
        #expect(abs(result.monthlyPayment - Decimal(expected)) <= 0.01)
    }
}
```

### XCTest (legacy, sadece UI tests için)

```swift
import XCTest

final class SalaryUITests: XCTestCase {
    func testSalaryHappyPath() throws {
        let app = XCUIApplication()
        app.launch()
        // ...
    }
}
```

---

## 3. Unit Tests

### 3.1 CalculationKit (%100 coverage hedefi)

Her motor için minimum test seti:

| Test Tipi             | Ne Test Edilir          | Örnek                       |
| --------------------- | ----------------------- | --------------------------- |
| **Default case**      | Beklenen tipik input    | 25k single 2026             |
| **Boundary**          | Sınır değerler          | 0, max, vergi dilimi geçişi |
| **Edge**              | Negatif, NaN, çok büyük | -100, 1B, 0.000001          |
| **Year fallback**     | 2024 married_1child     | married'e fallback          |
| **SSC switch**        | A → B → C kategori      | 17 yaş, min ücret           |
| **1962 flag**         | Doğum tarihi etkisi     | 1960, 1965                  |
| **COLA toggle**       | enableCOLA on/off       | March, June                 |
| **Decimal precision** | Yuvarlama davranışı     | 0.005 → 0.01                |
| **Invalid input**     | Hata fırlatma           | year=1900 → throw           |
| **Golden**            | Web ile ±€0.01          | 4 fixture                   |

**Toplam ~400 unit test** (18 motor × ortalama 22 test).

### 3.2 ViewModels

- [ ] State değişimi observed değerleri günceler
- [ ] Computed value'lar doğru
- [ ] Persistence mock'u ile CRUD
- [ ] Deep link initial params apply
- [ ] Reset davranışı
- [ ] Recalculate debounce

### 3.3 Helpers / Utilities

- [ ] `Money.eur` formatter (TR/EN locale)
- [ ] `Money.rounded(to:)` bankers
- [ ] `DateHelpers.mondaysInMonth` (her yıl her ay)
- [ ] `resolveTaxRateType` her kombinasyon
- [ ] `Color(hex:)` parse (3, 6, 8 char)

---

## 4. Golden Tests

### 4.1 Pipeline

1. Web tarafında `npm run golden:generate` script çalışır
2. Her motor için 1-4 fixture JSON üretilir → `Packages/CalculationKit/Tests/CalculationKitTests/Golden/`
3. CI öncesi `scripts/golden-drift-check.sh` ile sync mü kontrol edilir
4. Test sırasında Swift fixture'ı yükler, kendi çıktısıyla karşılaştırır

### 4.2 Fixture Listesi (Detaylı)

| Fixture                       | Motor                  | Senaryo              | Assertions          |
| ----------------------------- | ---------------------- | -------------------- | ------------------- |
| salary_2026_single_25k        | Salary                 | Bekar 2026           | 12 ay × 5 alan = 60 |
| salary_2026_married_2child    | Salary                 | 2 çocuklu evli       | 12 × 5 = 60         |
| salary_2025_parent            | Salary                 | Tek ebeveyn 2025     | 12 × 5 = 60         |
| salary_2026_high_earner_75k   | Salary                 | Üst dilim            | 12 × 5 = 60         |
| salary_1962_pensioner         | Salary                 | 1960 doğumlu         | 12 × 5 = 60         |
| salary_with_cola              | Salary                 | COLA on              | 12 × 5 = 60         |
| salary_part_time_b            | Salary                 | Cat B 20h            | 12 × 5 = 60         |
| mortgage_300k_25y_4.5         | Mortgage               | Standard             | 8 alan              |
| mortgage_500k_30y_min_deposit | Mortgage               | Min deposit          | 8                   |
| mortgage_zero_interest        | Mortgage               | Edge                 | 8                   |
| personal_loan_10k_5y          | Loan                   | Standard             | 7                   |
| personal_loan_50k_7y          | Loan                   | Büyük                | 7                   |
| stamp_duty_first_time         | StampDuty              | Muafiyetli           | 6                   |
| stamp_duty_standard           | StampDuty              | Standart             | 6                   |
| stamp_duty_below_exemption    | StampDuty              | < 200k FTB           | 6                   |
| savings_100k_5y_compound      | Savings                | Compound             | 6                   |
| savings_with_15_tax           | Savings                | Tax on               | 6                   |
| pension_two_thirds            | Pension                | Tipik                | 12                  |
| pension_capped_mpi            | Pension                | MPI cap              | 12                  |
| pension_with_private          | Pension                | Private contribution | 12                  |
| retirement_age_1985           | RetirementAge          | Born 1985            | 5                   |
| retirement_age_1955           | RetirementAge          | Bracket              | 5                   |
| overtime_weekday              | Overtime               | 1.5x                 | 5                   |
| overtime_weekend              | Overtime               | 2x                   | 5                   |
| vacation_full_time            | Vacation               | 40h/week             | 6                   |
| vacation_part_time_20h        | Vacation               | 20h/week             | 6                   |
| notice_period_5_years         | NoticePeriod           | 60 ay                | 4                   |
| children_allowance_3kids      | ChildrensAllowance     | 3 çocuk              | 6                   |
| children_allowance_low_income | ChildrensAllowance     | Low income           | 6                   |
| family_reunification_3        | FamilyReunification    | 3 üye                | 5                   |
| vehicle_reg_tax_co2_low       | VehicleRegistrationTax | 90 g/km              | 6                   |
| vehicle_reg_tax_co2_high      | VehicleRegistrationTax | 200 g/km             | 6                   |
| road_license_petrol           | RoadLicense            | 1.6 petrol           | 4                   |
| drivers_license_b_new         | DriversLicense         | New B                | 4                   |
| vrt_petrol_5y                 | VRT                    | 5y petrol            | 4                   |
| vehicle_reg_fee_new           | VRF                    | New car              | 5                   |
| import_vehicle_total          | ImportVehicle          | Compound             | 8                   |

**Toplam: 37 fixture, ~400+ alan assertion.**

### 4.3 Tolerance

- Para alanları: ±€0.01
- Yüzde alanları: ±0.0001
- Tam sayı alanları: tam eşleşme

### 4.4 Drift Check

```bash
#!/usr/bin/env bash
# scripts/golden-drift-check.sh
set -euo pipefail

cd "$(dirname "$0")/.."

# Save current fixtures hash
BEFORE_HASH=$(find ios-app/Packages/CalculationKit/Tests/CalculationKitTests/Golden -name "*.json" -exec sha256sum {} \; | sort | sha256sum)

# Regenerate
npm run golden:generate >/dev/null 2>&1

AFTER_HASH=$(find ios-app/Packages/CalculationKit/Tests/CalculationKitTests/Golden -name "*.json" -exec sha256sum {} \; | sort | sha256sum)

if [ "$BEFORE_HASH" != "$AFTER_HASH" ]; then
  echo "❌ Golden fixtures drift detected!"
  echo "Run 'npm run golden:generate' and commit the result."
  exit 1
fi

echo "✓ Golden fixtures in sync"
```

---

## 5. Snapshot Tests

### 5.1 Library

`pointfreeco/swift-snapshot-testing` v1.17+.

### 5.2 Snapshot Matrix

| Component              | Variants       | States | Themes | DT  | Total    |
| ---------------------- | -------------- | ------ | ------ | --- | -------- |
| DSButton               | 5              | 3      | 2      | 2   | 60       |
| DSCard                 | 4              | 1      | 2      | 2   | 16       |
| DSCurrencyField        | 1              | 4      | 2      | 2   | 16       |
| DSToggleGroup          | 1              | 2      | 2      | 2   | 8        |
| DSBreakdownChart       | 1              | 1      | 2      | 2   | 4        |
| DSAnimatedNumber       | 3              | 1      | 2      | 2   | 12       |
| DSStepper              | 1              | 2      | 2      | 2   | 8        |
| DSSliderField          | 1              | 2      | 2      | 2   | 8        |
| DSSearchField          | 1              | 3      | 2      | 2   | 12       |
| DSSectionHeader        | 9 cat          | 1      | 2      | 1   | 18       |
| DSChip                 | 1              | 2      | 2      | 1   | 4        |
| DSEmptyState           | 1              | 1      | 2      | 1   | 2        |
| FloatingNetCard        | 1              | 1      | 2      | 2   | 4        |
| MonthlyRowCard         | 1              | 2      | 2      | 2   | 8        |
| CalculatorCard         | 2 (avail/soon) | 1      | 2      | 2   | 8        |
| GuideCard              | 1              | 2      | 2      | 1   | 4        |
| **DesignSystem total** |                |        |        |     | **~192** |

| Feature Screen         | Variants                  | Themes | DT  | Total   |
| ---------------------- | ------------------------- | ------ | --- | ------- |
| SalaryScreen           | 3 (default, full, empty)  | 2      | 2   | 12      |
| MortgageScreen         | 2                         | 2      | 1   | 4       |
| PersonalLoanScreen     | 2                         | 2      | 1   | 4       |
| StampDutyScreen        | 3 (FTB on/off, low)       | 2      | 1   | 6       |
| ... 13 daha calculator | 2 each                    | 2      | 1   | 52      |
| CalculatorsHubScreen   | 3 (default, search, soon) | 2      | 1   | 6       |
| GuidesListScreen       | 2                         | 2      | 1   | 4       |
| GuideReaderScreen      | 2 (start, mid)            | 2      | 2   | 8       |
| SettingsScreen         | 1                         | 2      | 1   | 2       |
| **Feature total**      |                           |        |     | **~98** |

**Genel toplam: ~290 snapshot.**

### 5.3 Örnek Snapshot Test

```swift
import SnapshotTesting
import SwiftUI
import XCTest
@testable import DesignSystem

final class DSButtonSnapshotTests: XCTestCase {

    override func setUp() {
        super.setUp()
        // isRecording = true  // sadece fixture yenilemek için
    }

    func test_primary_light() {
        let view = DSButton("Calculate", variant: .primary, action: {})
            .frame(width: 300, height: 60)
            .padding()
            .background(DSColor.background)
        assertSnapshot(of: view, as: .image(layout: .fixed(width: 320, height: 80)))
    }

    func test_primary_dark() {
        let view = DSButton("Calculate", variant: .primary, action: {})
            .preferredColorScheme(.dark)
            .frame(width: 300, height: 60)
            .padding()
            .background(DSColor.background)
        assertSnapshot(of: view, as: .image(layout: .fixed(width: 320, height: 80)))
    }

    func test_all_variants_grid() {
        let variants: [DSButtonVariant] = [.primary, .secondary, .ghost, .glow, .destructive]
        let stack = VStack(spacing: 16) {
            ForEach(variants, id: \.self) { variant in
                DSButton("Action", variant: variant, action: {})
            }
        }
        .padding()
        .frame(width: 320)
        assertSnapshot(of: stack, as: .image)
    }

    func test_dynamic_type_AX3() {
        let view = DSButton("Calculate Now", variant: .primary, action: {})
            .environment(\.sizeCategory, .accessibilityLarge)
            .frame(width: 300)
            .padding()
        assertSnapshot(of: view, as: .image)
    }
}
```

### 5.4 Snapshot Diff Workflow

CI fail olursa artifact olarak `__Snapshots__/` klasörü PR'a yüklenir. Reviewer image diff'i kontrol eder.

---

## 6. UI Tests (XCUITest)

### 6.1 Critical Flows

| #   | Flow                       | Adımlar                                           |
| --- | -------------------------- | ------------------------------------------------- |
| 1   | Salary happy path          | Launch → Salary tab → enter 30k → see net → share |
| 2   | Mortgage detail            | Hub → Mortgage card → enter price → see schedule  |
| 3   | Save & history             | Calculate → Save → History → see entry            |
| 4   | Deep link → calculator     | Open URL → app routes correctly                   |
| 5   | Settings → clear history   | Settings → Clear → confirm → empty                |
| 6   | Guide reader               | Guides tab → guide → font size up → bookmark      |
| 7   | Coming soon hapticfeedback | Hub → soon item → no nav → haptic                 |
| 8   | Search calculators         | Search "mortgage" → only mortgage shown           |
| 9   | Theme switch               | Settings → Dark → app re-renders                  |
| 10  | Onboarding (if any)        | First launch → walkthrough → done                 |

### 6.2 Örnek

```swift
import XCTest

final class SalaryUITests: XCTestCase {
    func test_salary_happy_path() throws {
        let app = XCUIApplication()
        app.launchArguments += ["-UITests"]
        app.launch()

        // Tap Salary tab
        app.tabBars.buttons["Salary"].tap()

        // Enter gross
        let grossField = app.textFields["Annual Gross Salary"]
        XCTAssertTrue(grossField.waitForExistence(timeout: 2))
        grossField.tap()
        grossField.typeText("30000")

        // Wait for result
        let netLabel = app.staticTexts.matching(identifier: "annual-net").firstMatch
        XCTAssertTrue(netLabel.waitForExistence(timeout: 1))
        XCTAssertTrue(netLabel.label.contains("€"))

        // Share button
        app.buttons["More"].tap()
        app.buttons["Share"].tap()
        XCTAssertTrue(app.activitySheets.firstMatch.waitForExistence(timeout: 2))
    }
}
```

UI testler **nightly** çalışır, PR'da değil (süre uzun, flaky risk).

---

## 7. Performance Tests

```swift
import XCTest

final class CalculationPerformanceTests: XCTestCase {
    func test_salary_calculation_speed() {
        let metrics: [XCTMetric] = [
            XCTClockMetric(),
            XCTCPUMetric(),
            XCTMemoryMetric(),
        ]
        let measureOptions = XCTMeasureOptions.default
        measureOptions.iterationCount = 100

        measure(metrics: metrics, options: measureOptions) {
            let calc = SalaryCalculator(config: .default, taxConfig: .preview)
            let inputs = (0..<12).map { _ in SalaryInput(month: .january, grossWage: 2500) }
            _ = try? calc.calculate(inputs: inputs)
        }
    }

    func test_app_launch() {
        let measureOptions = XCTMeasureOptions.default
        measureOptions.iterationCount = 10

        measure(metrics: [XCTApplicationLaunchMetric()], options: measureOptions) {
            let app = XCUIApplication()
            app.launch()
            app.terminate()
        }
    }
}
```

Hedefler:

- Salary 12 ay hesaplama: < 20 ms
- App launch (cold): < 400 ms
- Memory at idle: < 80 MB

---

## 8. Test Targets in Package.swift

### 8.1 CalculationKit

```swift
.testTarget(
    name: "CalculationKitTests",
    dependencies: ["CalculationKit"],
    resources: [.process("Golden")]
),
```

### 8.2 DesignSystem

```swift
.testTarget(
    name: "DesignSystemTests",
    dependencies: [
        "DesignSystem",
        .product(name: "SnapshotTesting", package: "swift-snapshot-testing"),
    ]
),
```

### 8.3 App Tests Target

`MaltaCalculatorTests` — VM'ler, navigation, persistence için.
`MaltaCalculatorUITests` — XCUITest için.

---

## 9. CI Entegrasyonu

### 9.1 GitHub Actions Job

```yaml
test-unit:
  runs-on: macos-15
  steps:
    - uses: actions/checkout@v4
    - run: sudo xcode-select -switch /Applications/Xcode_26.app/Contents/Developer
    - name: Resolve packages
      run: |
        cd ios-app
        xcodebuild -resolvePackageDependencies \
          -workspace MaltaCalculator.xcworkspace \
          -scheme MaltaCalculator
    - name: Run unit tests
      run: |
        cd ios-app
        xcodebuild test \
          -workspace MaltaCalculator.xcworkspace \
          -scheme MaltaCalculator \
          -destination "platform=iOS Simulator,name=iPhone 16 Pro,OS=latest" \
          -only-testing:CalculationKitTests \
          -only-testing:DesignSystemTests \
          -only-testing:MaltaCalculatorTests \
          -resultBundlePath TestResults.xcresult \
          -enableCodeCoverage YES \
          CODE_SIGNING_ALLOWED=NO \
          | xcbeautify

    - name: Coverage report
      if: success()
      run: |
        xcrun xccov view --report --json ios-app/TestResults.xcresult > coverage.json
        # Parse and assert coverage thresholds

    - name: Upload artifacts
      if: failure()
      uses: actions/upload-artifact@v4
      with:
        name: snapshot-failures
        path: ios-app/Packages/DesignSystem/Tests/DesignSystemTests/__Snapshots__

test-ui:
  runs-on: macos-15
  if: github.event_name == 'schedule' || github.event_name == 'workflow_dispatch'
  steps:
    - uses: actions/checkout@v4
    - run: sudo xcode-select -switch /Applications/Xcode_26.app/Contents/Developer
    - name: Run UI tests
      run: |
        cd ios-app
        xcodebuild test \
          -workspace MaltaCalculator.xcworkspace \
          -scheme MaltaCalculator \
          -destination "platform=iOS Simulator,name=iPhone 16 Pro,OS=latest" \
          -only-testing:MaltaCalculatorUITests \
          | xcbeautify
```

Nightly schedule:

```yaml
on:
  schedule:
    - cron: "0 3 * * *" # 3 AM UTC
```

### 9.2 Coverage Thresholds

- CalculationKit: **%100** (motor fonksiyonları için zorunlu)
- DesignSystem: **%85+**
- Features (VM): **%80+**
- Overall: **%80+**

### 9.3 Coverage Enforcement Script

```bash
#!/usr/bin/env bash
# scripts/check-coverage.sh
set -euo pipefail

THRESHOLD_OVERALL=80
THRESHOLD_KIT=100

OVERALL=$(xcrun xccov view --report ios-app/TestResults.xcresult | grep "TOTAL" | awk '{print $4}' | tr -d '%')
KIT=$(xcrun xccov view --report ios-app/TestResults.xcresult | grep "CalculationKit" | awk '{print $4}' | tr -d '%')

if [ "$OVERALL" -lt "$THRESHOLD_OVERALL" ]; then
  echo "❌ Overall coverage $OVERALL% < $THRESHOLD_OVERALL%"
  exit 1
fi

if [ "$KIT" -lt "$THRESHOLD_KIT" ]; then
  echo "❌ CalculationKit coverage $KIT% < $THRESHOLD_KIT%"
  exit 1
fi

echo "✓ Coverage OK (Overall: $OVERALL%, Kit: $KIT%)"
```

---

## 10. Test Helpers

### 10.1 `Money+Test.swift`

```swift
import Foundation
@testable import CalculationKit

extension Decimal {
    static func ≈(lhs: Decimal, rhs: Decimal) -> Bool {
        abs(lhs - rhs) <= 0.01
    }
}
```

### 10.2 `MaltaTaxConfig+Preview.swift`

```swift
extension MaltaTaxConfig {
    static let preview: MaltaTaxConfig = {
        // Static instance for tests
        let dto = ... // build minimal DTO
        return try! MaltaTaxConfig(from: dto)
    }()
}
```

---

## 11. Test Data Builder

```swift
struct SalaryInputBuilder {
    var grossAnnual: Decimal = 25_000
    var year: Int = 2026
    var simpleTaxType: SimpleTaxType = .single
    var childCount: Int = 0
    var sscCategory: SSCCategory = .c
    var birthDate: Date = Date(timeIntervalSince1970: 631_152_000)  // 1990
    var enableCOLA: Bool = true

    func build() -> ([SalaryInput], SalaryCalculatorConfig) {
        let inputs = Month.allCases.map {
            SalaryInput(month: $0, grossWage: grossAnnual / 12)
        }
        let config = SalaryCalculatorConfig(
            year: year,
            simpleTaxType: simpleTaxType,
            childCount: childCount,
            sscCategory: sscCategory,
            birthDate: birthDate,
            enableCOLA: enableCOLA
        )
        return (inputs, config)
    }
}

// Usage in test
let (inputs, config) = SalaryInputBuilder()
    .with(\.grossAnnual, 50_000)
    .with(\.simpleTaxType, .married)
    .with(\.childCount, 2)
    .build()
```

---

## 12. Kabul Kriterleri

- [ ] CalculationKit %100 line coverage
- [ ] Overall %80+ coverage
- [ ] Tüm 37 golden fixture geçiyor
- [ ] Snapshot test suite < 90 saniye
- [ ] Unit test suite < 60 saniye
- [ ] CI'da PR'larda unit + golden + snapshot zorunlu
- [ ] UI test nightly yeşil
- [ ] Performance test cold launch < 400 ms
- [ ] Coverage threshold script enforce ediyor
- [ ] Drift check (golden + tax config) PR'da çalışıyor

---

## 13. Sıradaki

[`14-accessibility.md`](14-accessibility.md)
