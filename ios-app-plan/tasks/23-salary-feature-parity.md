# Task 23 — Salary Calculator Feature Parity with Web

> **Referans**: Bu task, mevcut iOS Salary feature'ını ([06-feature-salary.md](06-feature-salary.md) tarafından oluşturulan) web salary calculator ile **1:1 feature parity**'ye getirir. Web kaynağı: `src/app/salary/_components/salary-input-form.tsx` + `src/utils/salary-calculator.ts`.

---

## Problem

Mevcut iOS Salary calculator basit bir "yıllık brüt → net" hesabı yapıyor. Web versiyonu çok daha esnek ve kullanıcılar şu özellikleri bekliyor:

| Özellik                     | Web | iOS Mevcut | Hedef    |
| --------------------------- | --- | ---------- | -------- |
| Gross salary                | ✅  | ✅         | ✅       |
| Tax year (2020-2026)        | ✅  | ✅         | ✅       |
| Tax rate type (S/M/P)       | ✅  | ✅         | ✅       |
| Child count                 | ✅  | ✅         | ✅       |
| SSC category (A/B/C)        | ✅  | ✅         | ✅       |
| Birth year (1962 rule)      | ✅  | ✅         | ✅       |
| COLA toggle                 | ✅  | ✅         | ✅       |
| Non-tax / taxable benefits  | ✅  | ✅         | ✅       |
| **Start month**             | ✅  | ❌         | **EKLE** |
| **End month**               | ✅  | ❌         | **EKLE** |
| **Per-month bonus map**     | ✅  | ❌         | **EKLE** |
| **Monthly fixed allowance** | ✅  | ❌         | **EKLE** |
| **One-off bonus**           | ✅  | ❌         | **EKLE** |
| **One-off allowance**       | ✅  | ❌         | **EKLE** |

---

## Web Reference

**Form schema**: `src/app/salary/_components/salary-input-form.tsx` (lines 30-47)

```typescript
export type SalaryFormValues = {
  grossSalary: string;
  taxYear: number;
  taxRate: TaxRateCategory;
  childCount: number;
  sscCategory: SSCCategory;
  birthYear: number;
  cola: boolean;
  startMonth: number; // 1-12
  endMonth: number; // 1-12
  monthlyBonuses: Record<number, string>; // { 12: "1500", 3: "500" }
  monthlyAllowance: string; // fixed monthly amount
  bonusBonus: string; // one-off bonus
  allowanceBonus: string; // one-off allowance
  nonTaxBenefits: string;
  taxableBenefits: string;
};
```

**Calculation engine**: `src/utils/salary-calculator.ts` — already ported as `SalaryMotor` in CalculationKit. The motor handles partial-year calculations + per-month bonuses natively. **No CalculationKit changes needed** — only iOS UI/ViewModel updates.

---

## Implementation Plan

### 1. Domain Model — `SalaryInput`

`ios-app/MaltaCalculator/Features/Salary/SalaryInput.swift` (yeni dosya veya mevcut'u genişlet):

```swift
import Foundation
import CalculationKit

struct SalaryFormState: Equatable {
    var grossSalary: Decimal = 0
    var taxYear: Int = 2026
    var taxRate: TaxRateCategory = .single
    var childCount: Int = 0
    var sscCategory: SSCCategory = .C
    var birthYear: Int = 1990

    // COLA + benefits
    var includeCola: Bool = true
    var nonTaxBenefits: Decimal = 0
    var taxableBenefits: Decimal = 0

    // Period (NEW)
    var startMonth: Int = 1   // 1 = January
    var endMonth: Int = 12    // 12 = December

    // Bonuses (NEW)
    var monthlyBonuses: [Int: Decimal] = [:]  // [month: amount]
    var monthlyAllowance: Decimal = 0          // fixed every month
    var bonusBonus: Decimal = 0                // one-off
    var allowanceBonus: Decimal = 0            // one-off

    // Validation
    var isValid: Bool {
        grossSalary > 0 &&
        startMonth >= 1 && startMonth <= 12 &&
        endMonth >= startMonth && endMonth <= 12
    }
}
```

### 2. ViewModel Update — `SalaryViewModel`

`ios-app/MaltaCalculator/Features/Salary/SalaryViewModel.swift`:

```swift
@Observable
@MainActor
final class SalaryViewModel {
    var form: SalaryFormState = .init()
    var state: SalaryViewState = .empty

    private let motor: SalaryMotor
    private var debounceTask: Task<Void, Never>?

    init(motor: SalaryMotor = SalaryMotor()) {
        self.motor = motor
    }

    func updateGross(_ value: Decimal) {
        form.grossSalary = value
        scheduleRecalculate()
    }

    func updateStartMonth(_ month: Int) {
        form.startMonth = month
        if form.endMonth < month { form.endMonth = month }
        scheduleRecalculate()
    }

    func updateEndMonth(_ month: Int) {
        form.endMonth = month
        if form.startMonth > month { form.startMonth = month }
        scheduleRecalculate()
    }

    func setMonthlyBonus(month: Int, amount: Decimal) {
        if amount == 0 {
            form.monthlyBonuses.removeValue(forKey: month)
        } else {
            form.monthlyBonuses[month] = amount
        }
        scheduleRecalculate()
    }

    func updateMonthlyAllowance(_ value: Decimal) {
        form.monthlyAllowance = value
        scheduleRecalculate()
    }

    func updateOneOffBonus(_ value: Decimal) {
        form.bonusBonus = value
        scheduleRecalculate()
    }

    func updateOneOffAllowance(_ value: Decimal) {
        form.allowanceBonus = value
        scheduleRecalculate()
    }

    private func scheduleRecalculate() {
        debounceTask?.cancel()
        debounceTask = Task { [weak self] in
            try? await Task.sleep(nanoseconds: 250_000_000) // 250ms debounce
            guard !Task.isCancelled, let self else { return }
            await self.recalculate()
        }
    }

    func recalculate() async {
        guard form.isValid else {
            state = .empty
            return
        }
        state = .loading
        AppSignpost.begin(.calculation, name: "SalaryRecalculate")
        defer { AppSignpost.end(.calculation, name: "SalaryRecalculate") }

        do {
            let input = mapFormToMotorInput()
            let output = try motor.calculate(input: input)
            state = .content(output)
        } catch {
            state = .error(error.localizedDescription)
        }
    }

    private func mapFormToMotorInput() -> SalaryMotorInput {
        SalaryMotorInput(
            grossSalary: form.grossSalary,
            year: form.taxYear,
            taxRate: form.taxRate,
            children: form.childCount,
            ssc: form.sscCategory,
            birthYear: form.birthYear,
            cola: form.includeCola,
            startMonth: form.startMonth,
            endMonth: form.endMonth,
            monthlyBonuses: form.monthlyBonuses,
            monthlyAllowance: form.monthlyAllowance,
            oneOffBonus: form.bonusBonus,
            oneOffAllowance: form.allowanceBonus,
            nonTaxBenefits: form.nonTaxBenefits,
            taxableBenefits: form.taxableBenefits
        )
    }
}
```

### 3. UI — Yeni Cards

#### a) `PeriodSelectorCard.swift` (yeni)

`ios-app/MaltaCalculator/Features/Salary/Components/PeriodSelectorCard.swift`:

```swift
import SwiftUI
import DesignSystem

struct PeriodSelectorCard: View {
    @Binding var startMonth: Int
    @Binding var endMonth: Int

    private let months = Calendar.current.shortMonthSymbols  // [Jan, Feb, ...]

    var body: some View {
        DSCard(variant: .elevated) {
            VStack(alignment: .leading, spacing: DSSpacing.md) {
                DSSectionHeader(
                    title: String(localized: "salary.period.title"),
                    subtitle: String(localized: "salary.period.subtitle")
                )

                HStack(spacing: DSSpacing.md) {
                    VStack(alignment: .leading, spacing: DSSpacing.xs) {
                        Text(String(localized: "salary.period.start"))
                            .font(DSFont.label)
                            .foregroundStyle(DSColor.textSecondary)
                        Picker("", selection: $startMonth) {
                            ForEach(1...12, id: \.self) { m in
                                Text(months[m - 1]).tag(m)
                            }
                        }
                        .pickerStyle(.menu)
                        .accessibilityLabel(String(localized: "salary.period.start.accessibility"))
                    }

                    VStack(alignment: .leading, spacing: DSSpacing.xs) {
                        Text(String(localized: "salary.period.end"))
                            .font(DSFont.label)
                            .foregroundStyle(DSColor.textSecondary)
                        Picker("", selection: $endMonth) {
                            ForEach(1...12, id: \.self) { m in
                                Text(months[m - 1]).tag(m)
                            }
                        }
                        .pickerStyle(.menu)
                        .accessibilityLabel(String(localized: "salary.period.end.accessibility"))
                    }
                }
            }
            .padding(DSSpacing.md)
        }
    }
}
```

#### b) `BonusMatrixCard.swift` (yeni — en kompleks)

`ios-app/MaltaCalculator/Features/Salary/Components/BonusMatrixCard.swift`:

```swift
import SwiftUI
import DesignSystem

struct BonusMatrixCard: View {
    @Binding var monthlyBonuses: [Int: Decimal]
    let startMonth: Int
    let endMonth: Int

    @State private var expandedMonth: Int?
    private let months = Calendar.current.shortMonthSymbols

    var body: some View {
        DSCard(variant: .elevated) {
            VStack(alignment: .leading, spacing: DSSpacing.md) {
                DSSectionHeader(
                    title: String(localized: "salary.bonuses.title"),
                    subtitle: String(localized: "salary.bonuses.subtitle")
                )

                // Quick presets
                HStack(spacing: DSSpacing.sm) {
                    Button(String(localized: "salary.bonuses.preset.13th")) {
                        monthlyBonuses[12] = (monthlyBonuses[12] ?? 0)  // pre-fill December
                    }
                    .buttonStyle(.bordered)
                    Button(String(localized: "salary.bonuses.preset.clear")) {
                        monthlyBonuses.removeAll()
                    }
                    .buttonStyle(.bordered)
                }
                .font(DSFont.caption)

                // Active bonuses list
                if monthlyBonuses.isEmpty {
                    Text(String(localized: "salary.bonuses.empty"))
                        .font(DSFont.bodyS)
                        .foregroundStyle(DSColor.textTertiary)
                        .padding(.vertical, DSSpacing.sm)
                } else {
                    VStack(spacing: DSSpacing.xs) {
                        ForEach(monthlyBonuses.keys.sorted(), id: \.self) { month in
                            BonusRow(
                                month: month,
                                amount: Binding(
                                    get: { monthlyBonuses[month] ?? 0 },
                                    set: { newValue in
                                        if newValue == 0 {
                                            monthlyBonuses.removeValue(forKey: month)
                                        } else {
                                            monthlyBonuses[month] = newValue
                                        }
                                    }
                                ),
                                onRemove: { monthlyBonuses.removeValue(forKey: month) }
                            )
                        }
                    }
                }

                // Add bonus button
                Menu {
                    ForEach(startMonth...endMonth, id: \.self) { month in
                        if monthlyBonuses[month] == nil {
                            Button(months[month - 1]) {
                                monthlyBonuses[month] = 0
                            }
                        }
                    }
                } label: {
                    Label(String(localized: "salary.bonuses.add"), systemImage: "plus.circle.fill")
                        .font(DSFont.label)
                        .foregroundStyle(DSColor.maltaGold)
                }
                .accessibilityLabel(String(localized: "salary.bonuses.add.accessibility"))
            }
            .padding(DSSpacing.md)
        }
    }
}

private struct BonusRow: View {
    let month: Int
    @Binding var amount: Decimal
    let onRemove: () -> Void

    private let months = Calendar.current.monthSymbols

    var body: some View {
        HStack(spacing: DSSpacing.sm) {
            Text(months[month - 1])
                .font(DSFont.label)
                .frame(width: 80, alignment: .leading)

            DSCurrencyField(
                label: String(localized: "salary.bonuses.amount"),
                value: $amount
            )

            Button(action: onRemove) {
                Image(systemName: "minus.circle.fill")
                    .foregroundStyle(DSColor.textTertiary)
                    .frame(width: 44, height: 44)
            }
            .accessibilityLabel(String(localized: "salary.bonuses.remove"))
        }
    }
}
```

#### c) `OneOffPaymentsCard.swift` (yeni)

```swift
import SwiftUI
import DesignSystem

struct OneOffPaymentsCard: View {
    @Binding var monthlyAllowance: Decimal
    @Binding var oneOffBonus: Decimal
    @Binding var oneOffAllowance: Decimal

    var body: some View {
        DSCard(variant: .elevated) {
            VStack(alignment: .leading, spacing: DSSpacing.md) {
                DSSectionHeader(
                    title: String(localized: "salary.extras.title"),
                    subtitle: String(localized: "salary.extras.subtitle")
                )

                DSCurrencyField(
                    label: String(localized: "salary.extras.monthlyAllowance"),
                    value: $monthlyAllowance
                )
                Text(String(localized: "salary.extras.monthlyAllowance.hint"))
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textTertiary)

                DSCurrencyField(
                    label: String(localized: "salary.extras.oneOffBonus"),
                    value: $oneOffBonus
                )

                DSCurrencyField(
                    label: String(localized: "salary.extras.oneOffAllowance"),
                    value: $oneOffAllowance
                )
            }
            .padding(DSSpacing.md)
        }
    }
}
```

### 4. SalaryScreen Layout Update

`ios-app/MaltaCalculator/Features/Salary/SalaryScreen.swift`:

```swift
struct SalaryScreen: View {
    @State private var vm = SalaryViewModel()

    var body: some View {
        ScrollView {
            VStack(spacing: DSSpacing.md) {
                // Existing
                SalaryInputCard(form: $vm.form)

                // NEW
                PeriodSelectorCard(
                    startMonth: $vm.form.startMonth,
                    endMonth: $vm.form.endMonth
                )

                // NEW
                BonusMatrixCard(
                    monthlyBonuses: $vm.form.monthlyBonuses,
                    startMonth: vm.form.startMonth,
                    endMonth: vm.form.endMonth
                )

                // NEW
                OneOffPaymentsCard(
                    monthlyAllowance: $vm.form.monthlyAllowance,
                    oneOffBonus: $vm.form.bonusBonus,
                    oneOffAllowance: $vm.form.allowanceBonus
                )

                // Existing
                BenefitsCard(form: $vm.form)
                CalculationOptionsCard(form: $vm.form)

                // Results
                resultsSection
            }
            .padding(DSSpacing.md)
        }
    }
}
```

### 5. Localization

`ios-app/MaltaCalculator/Resources/Localizable.xcstrings`'e ekle:

```
salary.period.title = "Calculation Period"
salary.period.subtitle = "Select the months to calculate"
salary.period.start = "Start Month"
salary.period.end = "End Month"
salary.bonuses.title = "Monthly Bonuses"
salary.bonuses.subtitle = "Add bonuses for specific months (e.g. 13th month)"
salary.bonuses.preset.13th = "13th Month (Dec)"
salary.bonuses.preset.clear = "Clear All"
salary.bonuses.add = "Add Bonus Month"
salary.bonuses.empty = "No bonus months added yet"
salary.bonuses.amount = "Amount"
salary.bonuses.remove = "Remove bonus"
salary.extras.title = "Extra Payments"
salary.extras.subtitle = "Optional allowances and one-time amounts"
salary.extras.monthlyAllowance = "Monthly Allowance"
salary.extras.monthlyAllowance.hint = "Fixed amount paid every month"
salary.extras.oneOffBonus = "One-off Bonus"
salary.extras.oneOffAllowance = "One-off Allowance"
```

Tüm string'ler için **plural variants** ekle (örn: "1 child" / "%d children").

### 6. Testler

`ios-app/Tests/MaltaCalculatorTests/SalaryViewModelParityTests.swift`:

```swift
import XCTest
@testable import MaltaCalculator
@testable import CalculationKit

@MainActor
final class SalaryViewModelParityTests: XCTestCase {
    func test_partialYear_calculatesOnlyForRange() async {
        let vm = SalaryViewModel()
        vm.form.grossSalary = 24_000
        vm.form.startMonth = 1
        vm.form.endMonth = 6  // first half only

        await vm.recalculate()

        guard case .content(let output) = vm.state else {
            XCTFail("Expected content state")
            return
        }
        // Half year should be ~6 months gross
        XCTAssertEqual(output.totalGross, 12_000, accuracy: 0.01)
    }

    func test_thirteenthMonth_addedToDecember() async {
        let vm = SalaryViewModel()
        vm.form.grossSalary = 24_000
        vm.form.monthlyBonuses[12] = 2_000  // 13th month bonus

        await vm.recalculate()

        guard case .content(let output) = vm.state else {
            XCTFail("Expected content state")
            return
        }
        XCTAssertEqual(output.totalGross, 26_000, accuracy: 0.01)
    }

    func test_monthlyAllowance_addedToEveryMonth() async {
        let vm = SalaryViewModel()
        vm.form.grossSalary = 24_000
        vm.form.monthlyAllowance = 100

        await vm.recalculate()

        guard case .content(let output) = vm.state else {
            XCTFail("Expected content state")
            return
        }
        // 100 × 12 = 1200 extra
        XCTAssertEqual(output.totalGross, 25_200, accuracy: 0.01)
    }

    func test_oneOffBonus_addedOnce() async {
        let vm = SalaryViewModel()
        vm.form.grossSalary = 24_000
        vm.form.bonusBonus = 1_500

        await vm.recalculate()

        guard case .content(let output) = vm.state else {
            XCTFail("Expected content state")
            return
        }
        XCTAssertEqual(output.totalGross, 25_500, accuracy: 0.01)
    }

    func test_endMonth_lessThan_startMonth_isInvalid() async {
        let vm = SalaryViewModel()
        vm.form.grossSalary = 24_000
        vm.form.startMonth = 6
        vm.form.endMonth = 3  // invalid

        // ViewModel should auto-correct
        vm.updateEndMonth(3)
        XCTAssertEqual(vm.form.startMonth, 3)
    }
}
```

### 7. Golden Parity Test

`ios-app/Packages/CalculationKit/Tests/CalculationKitTests/SalaryGoldenParityTests.swift` zaten var. Yeni test fixture'ı ekle:

`ios-app/Packages/CalculationKit/Tests/CalculationKitTests/Golden/salary-with-bonuses.json`:

```json
{
  "input": {
    "grossSalary": 30000,
    "year": 2026,
    "taxRate": "single",
    "children": 0,
    "ssc": "C",
    "birthYear": 1990,
    "startMonth": 1,
    "endMonth": 12,
    "monthlyBonuses": { "12": 2500 },
    "monthlyAllowance": 150,
    "oneOffBonus": 1000,
    "oneOffAllowance": 0,
    "cola": true,
    "nonTaxBenefits": 0,
    "taxableBenefits": 0
  },
  "expected": {
    "totalGross": 35300,
    "totalNet": "...",
    "totalTax": "...",
    "totalSSC": "..."
  }
}
```

Bu fixture'ı web'den `npm run export-fixtures` ile generate et. ±€0.01 tolerance.

### 8. Acceptance Criteria

- [ ] `SalaryFormState` 6 yeni alan içeriyor (startMonth, endMonth, monthlyBonuses, monthlyAllowance, oneOffBonus, oneOffAllowance)
- [ ] `PeriodSelectorCard`, `BonusMatrixCard`, `OneOffPaymentsCard` oluşturuldu
- [ ] `SalaryScreen` yeni cards'ı içeriyor
- [ ] `SalaryViewModel` yeni alanlar için update fonksiyonları + auto-correct logic
- [ ] Debounce 250ms (her keystroke recalculate yapma)
- [ ] Yeni testler: partial year, 13th month, monthly allowance, one-off bonus
- [ ] Golden parity fixture: `salary-with-bonuses.json` ±€0.01 web parity
- [ ] Localizable.xcstrings: 18+ yeni string + plural variants
- [ ] VoiceOver: tüm yeni control'ler accessibilityLabel + Hint
- [ ] Touch targets ≥ 44pt
- [ ] Snapshot test: SalaryScreen full layout (light + dark + AX5)
- [ ] AppSignpost.measure(.calculation) recalculate'ı sarıyor
- [ ] Build green, lint clean

### 9. Risk

- **Düşük**: CalculationKit motor zaten partial year + bonus desteği var (porting tamamlandı)
- **Orta**: BonusMatrixCard UI complex — VoiceOver gezintisi dikkatli yazılmalı
- **Düşük**: Existing snapshot baselines güncellenmeli (yeni cards eklendi)

### 10. Tahmini Süre

- Domain + ViewModel: ~25 dk
- 3 yeni Card: ~40 dk
- SalaryScreen integration: ~10 dk
- Localization: ~10 dk
- Tests + snapshot baselines: ~25 dk
- **Toplam: ~110 dk**
