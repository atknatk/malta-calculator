# Task 21 — Calculator Detail Sprint 2 (Placeholder → Real Implementation)

> **Referans**: [08-feature-calculator-detail.md](08-feature-calculator-detail.md) Sprint 2. Bu task, mevcut iOS app'inde "Coming Soon" placeholder gösteren 11 calculator'ı gerçek implementasyona çevirir. Web kaynak: `src/app/calculators/<id>/` + `src/utils/<id>-calculator.ts`. Backend motorlar **CalculationKit'te zaten mevcut** ([03-calculation-kit.md](03-calculation-kit.md) ile port edildi) — bu task sadece UI + ViewModel + tests yapar.

---

## Hedef

Aşağıdaki 11 calculator için `ComingSoonScreen` placeholder'ını gerçek `<Calculator>Screen` + `<Calculator>ViewModel` ile değiştir:

| #   | Calculator        | Web Source                               | CalculationKit Motor    | Pipeline |
| --- | ----------------- | ---------------------------------------- | ----------------------- | -------- |
| 1   | Bonus Tax         | `src/app/calculators/bonus-tax/`         | `BonusTaxMotor`         | Standard |
| 2   | Part-Time Tax     | `src/app/calculators/part-time-tax/`     | `PartTimeTaxMotor`      | Standard |
| 3   | Expatriate Tax    | `src/app/calculators/expatriate-tax/`    | `ExpatriateTaxMotor`    | Standard |
| 4   | Childcare Subsidy | `src/app/calculators/childcare-subsidy/` | `ChildcareSubsidyMotor` | Standard |
| 5   | Maternity Benefit | `src/app/calculators/maternity-benefit/` | `MaternityBenefitMotor` | Standard |
| 6   | In-Work Benefit   | `src/app/calculators/in-work-benefit/`   | `InWorkBenefitMotor`    | Standard |
| 7   | Rental Income Tax | `src/app/calculators/rental-income-tax/` | `RentalIncomeTaxMotor`  | Standard |
| 8   | First-Time Buyer  | `src/app/calculators/first-time-buyer/`  | `FirstTimeBuyerMotor`   | Standard |
| 9   | Self-Employed Tax | `src/app/calculators/self-employed-tax/` | `SelfEmployedTaxMotor`  | Standard |
| 10  | Self-Employed SSC | `src/app/calculators/self-employed-ssc/` | `SelfEmployedSSCMotor`  | Standard |
| 11  | Sick Leave        | `src/app/calculators/sick-leave/`        | `SickLeaveMotor`        | Standard |

---

## Mevcut Pattern (Sprint 1'den)

Sprint 1'de oluşturulan ve referans alınması gereken pattern:

- **Scaffold**: `ios-app/MaltaCalculator/Features/Calculators/CalculatorDetailScaffold.swift`
- **Factory**: `ios-app/MaltaCalculator/Features/Calculators/CalculatorDetailFactory.swift`
- **Sprint 1 örnekleri**:
  - `Features/Calculators/Mortgage/MortgageScreen.swift` + `MortgageViewModel.swift`
  - `Features/Calculators/PersonalLoan/`
  - `Features/Calculators/StampDuty/`
  - `Features/Calculators/SavingsInterest/`

Her sprint 2 calculator için **AYNI** dosya yapısı:

```
Features/Calculators/<Name>/
├── <Name>Screen.swift       # SwiftUI view, CalculatorDetailScaffold kullanır
└── <Name>ViewModel.swift    # @Observable @MainActor, motor wrapper
```

---

## Her Calculator için Standart Yapı

### A) ViewModel Template

```swift
import Foundation
import CalculationKit
import Observation

@Observable
@MainActor
final class BonusTaxViewModel {
    // Form state
    var bonusAmount: Decimal = 0
    var monthlyGross: Decimal = 0
    var taxYear: Int = 2026
    var taxRate: TaxRateCategory = .single

    // Output state
    var state: CalculatorViewState<BonusTaxOutput> = .empty

    private let motor: BonusTaxMotor
    private var debounceTask: Task<Void, Never>?

    init(motor: BonusTaxMotor = BonusTaxMotor()) {
        self.motor = motor
    }

    func updateBonus(_ value: Decimal) {
        bonusAmount = value
        scheduleRecalculate()
    }

    func updateMonthlyGross(_ value: Decimal) {
        monthlyGross = value
        scheduleRecalculate()
    }

    private func scheduleRecalculate() {
        debounceTask?.cancel()
        debounceTask = Task { [weak self] in
            try? await Task.sleep(nanoseconds: 250_000_000)
            guard !Task.isCancelled, let self else { return }
            await self.recalculate()
        }
    }

    func recalculate() async {
        guard bonusAmount > 0, monthlyGross > 0 else {
            state = .empty
            return
        }
        state = .loading
        AppSignpost.begin(.calculation, name: "BonusTaxRecalculate")
        defer { AppSignpost.end(.calculation, name: "BonusTaxRecalculate") }

        do {
            let input = BonusTaxInput(
                bonusAmount: bonusAmount,
                monthlyGross: monthlyGross,
                year: taxYear,
                taxRate: taxRate
            )
            let output = try motor.calculate(input: input)
            state = .content(output)
        } catch {
            state = .error(error.localizedDescription)
        }
    }
}
```

### B) Screen Template

```swift
import SwiftUI
import DesignSystem
import CalculationKit

struct BonusTaxScreen: View {
    @State private var vm = BonusTaxViewModel()

    var body: some View {
        CalculatorDetailScaffold(
            title: String(localized: "calc.bonusTax.title"),
            subtitle: String(localized: "calc.bonusTax.subtitle"),
            iconSystemName: "gift.fill"
        ) {
            VStack(spacing: DSSpacing.md) {
                inputCard
                resultsSection
            }
        }
    }

    private var inputCard: some View {
        DSCard(variant: .elevated) {
            VStack(alignment: .leading, spacing: DSSpacing.md) {
                DSCurrencyField(
                    label: String(localized: "calc.bonusTax.bonusAmount"),
                    value: Binding(get: { vm.bonusAmount }, set: vm.updateBonus)
                )
                DSCurrencyField(
                    label: String(localized: "calc.bonusTax.monthlyGross"),
                    value: Binding(get: { vm.monthlyGross }, set: vm.updateMonthlyGross)
                )
                taxRatePicker
                taxYearPicker
            }
            .padding(DSSpacing.md)
        }
    }

    @ViewBuilder
    private var resultsSection: some View {
        switch vm.state {
        case .empty:
            DSEmptyState(
                title: String(localized: "calc.empty.title"),
                description: String(localized: "calc.empty.description"),
                icon: "arrow.up.doc"
            )
        case .loading:
            DSSkeletonCard()
        case .error(let message):
            DSErrorState(
                title: String(localized: "calc.error.title"),
                description: LocalizedStringResource(stringLiteral: message),
                retryAction: { Task { await vm.recalculate() } }
            )
        case .content(let output):
            BonusTaxResultsCard(output: output)
        }
    }
}
```

### C) Factory Update

`ios-app/MaltaCalculator/Features/Calculators/CalculatorDetailFactory.swift`:

```swift
@MainActor
enum CalculatorDetailFactory {
    @ViewBuilder
    static func screen(for id: CalculatorID) -> some View {
        switch id {
        case .salary:
            SalaryScreen()
        case .mortgage:
            MortgageScreen()
        case .personalLoan:
            PersonalLoanScreen()
        case .savingsInterest:
            SavingsInterestScreen()
        case .stampDuty:
            StampDutyScreen()
        // SPRINT 2 — replace placeholders
        case .bonusTax:
            BonusTaxScreen()
        case .partTimeTax:
            PartTimeTaxScreen()
        case .expatriateTax:
            ExpatriateTaxScreen()
        case .childcareSubsidy:
            ChildcareSubsidyScreen()
        case .maternityBenefit:
            MaternityBenefitScreen()
        case .inWorkBenefit:
            InWorkBenefitScreen()
        case .rentalIncomeTax:
            RentalIncomeTaxScreen()
        case .firstTimeBuyer:
            FirstTimeBuyerScreen()
        case .selfEmployedTax:
            SelfEmployedTaxScreen()
        case .selfEmployedSSC:
            SelfEmployedSSCScreen()
        case .sickLeave:
            SickLeaveScreen()
        // ... rest still ComingSoonScreen
        default:
            ComingSoonScreen(id: id)
        }
    }
}
```

---

## Calculator-Specific Inputs

Her calculator'ın spec'i için web `src/app/calculators/<id>/page.tsx` dosyalarını oku ve form alanlarını birebir kopyala. Aşağıda kritik alanlar:

### 1. Bonus Tax

- bonusAmount, monthlyGross, taxYear, taxRate, yearToDateBonus

### 2. Part-Time Tax

- annualPartTimeIncome, hasFullTimeJob, taxYear

### 3. Expatriate Tax

- annualIncome, expatType (highly-qualified / professional), residencyStatus

### 4. Childcare Subsidy

- monthlyIncome (parent 1), monthlyIncome (parent 2), childAge, hoursPerWeek

### 5. Maternity Benefit

- weeklyEarnings, employmentType (employed / self-employed), startDate

### 6. In-Work Benefit

- annualHouseholdIncome, childCount, householdType (single / couple)

### 7. Rental Income Tax

- annualRentalIncome, regime ("15% flat" / "progressive"), allowableExpenses

### 8. First-Time Buyer

- propertyValue, isFirstHome, isUnder40

### 9. Self-Employed Tax

- annualNetIncome, deductibleExpenses, taxYear

### 10. Self-Employed SSC

- annualNetEarnings, age, sscClass (1 / 2)

### 11. Sick Leave

- weeklyWage, sickDaysUsedThisYear, employmentDuration

---

## Acceptance Criteria

- [ ] 11 yeni klasör oluşturuldu (her biri Screen + ViewModel + ResultsCard)
- [ ] `CalculatorDetailFactory.screen(for:)` 11 case daha içeriyor
- [ ] Hepsi `CalculatorDetailScaffold` kullanıyor (ortak header, share, save)
- [ ] ViewState pattern: empty/loading/error/content
- [ ] DSEmptyState, DSSkeletonCard, DSErrorState kullanılıyor
- [ ] AppSignpost.measure(.calculation) wrap'leri var
- [ ] Debounce 250ms
- [ ] Her calculator için: golden parity test (web ile ±€0.01)
- [ ] Her calculator için: ViewModel unit test (en az 3 senaryo)
- [ ] Localizable.xcstrings: yeni 11×8 = ~88 string + plural variants
- [ ] Snapshot test (1 örnek calculator için, light/dark/AX5)
- [ ] CalculatorsHubScreen 11 calculator için "Coming Soon" badge'ini kaldırıyor
- [ ] Build green, lint clean, 0 warnings, 0 force-unwraps

## Risk

- **Orta**: 11 calculator çok ama hepsi aynı pattern'i takip ediyor (Sprint 1 örnek var)
- **Düşük**: CalculationKit motorlar zaten test edilmiş (golden fixtures mevcut)
- **Orta**: Localizable.xcstrings büyük diff oluşturacak

## Tahmini Süre

- Per calculator: ~15 dk (Screen + ViewModel + tests)
- 11 calculator × 15 dk = ~165 dk
- Localization + factory updates: ~30 dk
- **Toplam: ~3-4 saat**
