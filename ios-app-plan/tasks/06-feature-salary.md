# Task 06 — Feature: Salary (Playground UX)

> **Faz**: M4
> **Ön koşul**: `CalculationKit.Salary`, `DesignSystem` controls hazır, Navigation iskeleti var
> **Çıktı**: Salary tab — 12 aylık detay, grafik, paylaşım, geçmiş kaydetme

---

## 1. Amaç

Web'in ana sayfasındaki playground-tarzı salary calculator deneyimini iOS'ta **daha iyi** bir dokunmatik/skroll deneyimine çevirmek. Web'den bire bir hesap doğruluğu + iOS native UX.

---

## 2. Özellikler

- [x] Gross yıllık/aylık maaş input
- [x] Yıl seçimi (2020-2026, default 2026)
- [x] Vergi tipi: Single / Married / Parent
- [x] Çocuk sayısı (2026+ için 0/1/2+)
- [x] SSC kategorisi (A/B/C/D manual + auto suggestion)
- [x] Doğum tarihi (1962 öncesi etki için)
- [x] Benefits (taxable + non-taxable)
- [x] COLA toggle
- [x] Aylık breakdown (12 satır, expand/collapse)
- [x] Donut chart (Gross/SSC/Tax/Net)
- [x] Line chart (cumulative net over months)
- [x] Share (PNG card + PDF payslip özeti)
- [x] Save to history
- [x] Reset to defaults
- [x] Deep link initial state

---

## 3. Ekran Yapısı

```text
SalaryScreen (ScrollView)
├── HeaderSection
│   ├── NavigationTitle "Salary Calculator"
│   ├── Year pill picker (2020 ... 2026)
│   └── FloatingNetCard (sticky, animated)
├── InputCard (liquidGlass hero)
│   ├── GrossAnnualField (DSCurrencyField, label: "Annual Gross Salary")
│   ├── GrossSplitPreview ("= €2,500/month")
│   ├── Divider
│   ├── TaxTypePicker (DSToggleGroup: Single / Married / Parent)
│   ├── ChildCountStepper (DSStepper, visible if year >= 2026 && type != single)
│   ├── SSCCategoryPicker (DSToggleGroup: A / B / C / D)
│   │   └── AutoSuggestBanner ("Recommended: C" if applicable)
│   ├── BirthDateField (DSDatePickerCard)
│   │   └── Warning banner if < 1962
│   ├── BenefitsDisclosureGroup (expand/collapse)
│   │   ├── NonTaxBenefitField
│   │   └── TaxableBenefitField
│   └── COLAToggle ("Include government bonus (COLA)")
├── SummaryCard (DSCard highlighted)
│   ├── DSBreakdownChart (donut)
│   │   ├── Center: animated annual net
│   │   └── Legend: Gross / SSC / Tax / Net
│   └── KeyFiguresGrid
│       ├── Annual Gross
│       ├── Annual SSC
│       ├── Annual Income Tax
│       └── Effective Tax Rate
├── MonthlyBreakdownSection
│   ├── Section Header "Monthly Breakdown"
│   ├── ForEach month: MonthlyRowCard (expandable)
│   │   ├── Collapsed: Month name, Gross, Net
│   │   └── Expanded: SSC base, SSC tax, income base, cumulative tax, net
│   └── CumulativeLineChart (DSLineChart)
├── InsightsSection (DSCard)
│   ├── "What this means for you"
│   ├── Monthly pay day estimate
│   ├── Average monthly net
│   └── Tax optimization hints
├── DisclaimerSection
└── FooterBar (Toolbar)
    ├── Share button
    ├── Save button
    └── Reset button
```

---

## 4. State Model

### 4.1 `SalaryViewModel.swift`

```swift
import Foundation
import Observation
import CalculationKit
import SwiftData

@Observable
@MainActor
final class SalaryViewModel {
    // Inputs
    var grossAnnual: Decimal = 25_000
    var year: Int = 2026
    var simpleTaxType: SimpleTaxType = .single
    var childCount: Int = 0
    var sscCategory: SSCCategory = .c
    var birthDate: Date = Calendar.current.date(from: DateComponents(year: 1990, month: 1, day: 1)) ?? Date()
    var yearlyNonTaxBenefit: Decimal = 0
    var yearlyTaxableBenefit: Decimal = 0
    var enableCOLA: Bool = true

    // Outputs
    private(set) var monthly: [SalaryOutput] = []
    private(set) var summary: SalarySummary?
    private(set) var isCalculating: Bool = false
    private(set) var error: String?

    // Internal
    private var recalcTask: Task<Void, Never>?
    private var taxConfig: MaltaTaxConfig?

    // UI state
    var expandedMonths: Set<Month> = []
    var showingBenefitsSection: Bool = false
    var showingShareSheet: Bool = false
    var showingSaveConfirmation: Bool = false

    init() {
        // Initial load
        Task { await loadConfigAndCalculate() }
    }

    // MARK: - Public API

    func applyInitialParams(_ params: [String: String]) {
        if let grossStr = params["gross"], let gross = Decimal(string: grossStr) {
            grossAnnual = gross
        }
        if let yearStr = params["year"], let year = Int(yearStr) {
            self.year = year
        }
        if let typeStr = params["type"], let type = SimpleTaxType(rawValue: typeStr) {
            self.simpleTaxType = type
        }
        scheduleRecalculation()
    }

    func scheduleRecalculation(debounceMs: Int = 80) {
        recalcTask?.cancel()
        recalcTask = Task { [weak self] in
            try? await Task.sleep(for: .milliseconds(debounceMs))
            guard !Task.isCancelled, let self else { return }
            await self.recalculate()
        }
    }

    func reset() {
        grossAnnual = 25_000
        year = 2026
        simpleTaxType = .single
        childCount = 0
        sscCategory = .c
        birthDate = Calendar.current.date(from: DateComponents(year: 1990, month: 1, day: 1)) ?? Date()
        yearlyNonTaxBenefit = 0
        yearlyTaxableBenefit = 0
        enableCOLA = true
        expandedMonths.removeAll()
        scheduleRecalculation()
    }

    func toggleMonthExpansion(_ month: Month) {
        if expandedMonths.contains(month) {
            expandedMonths.remove(month)
        } else {
            expandedMonths.insert(month)
        }
    }

    // MARK: - Calculation

    private func loadConfigAndCalculate() async {
        do {
            self.taxConfig = try await TaxConfigStore.shared.load()
            await recalculate()
        } catch {
            self.error = error.localizedDescription
        }
    }

    private func recalculate() async {
        guard let taxConfig else { return }

        isCalculating = true
        defer { isCalculating = false }

        let config = SalaryCalculatorConfig(
            year: year,
            simpleTaxType: simpleTaxType,
            childCount: childCount,
            sscCategory: sscCategory,
            birthDate: birthDate,
            yearlyNonTaxBenefit: yearlyNonTaxBenefit,
            yearlyTaxableBenefit: yearlyTaxableBenefit,
            enableCOLA: enableCOLA
        )

        let inputs = Month.allCases.map { month in
            SalaryInput(
                month: month,
                grossWage: grossAnnual / 12,
                bonus: 0,
                governmentBonus: 0,
                allowanceBonus: 0
            )
        }

        let calculator = SalaryCalculator(config: config, taxConfig: taxConfig)
        do {
            let outputs = try calculator.calculate(inputs: inputs)
            self.monthly = outputs
            self.summary = SalarySummary(from: outputs)
            self.error = nil
        } catch {
            self.error = error.localizedDescription
        }
    }

    // MARK: - Save & Share

    func save(using context: ModelContext) {
        guard let summary else { return }
        let payload = SalarySavedPayload(
            grossAnnual: grossAnnual,
            year: year,
            simpleTaxType: simpleTaxType,
            childCount: childCount,
            sscCategory: sscCategory,
            birthDate: birthDate,
            yearlyNonTaxBenefit: yearlyNonTaxBenefit,
            yearlyTaxableBenefit: yearlyTaxableBenefit,
            enableCOLA: enableCOLA
        )
        let inputsData = (try? JSONEncoder().encode(payload)) ?? Data()

        let saved = SavedCalculation(
            calculatorID: "salary",
            title: "Salary \(year) — \(grossAnnual.eur)",
            inputsJSON: inputsData,
            summary: "Net \(summary.averageMonthlyNet.eur)/mo"
        )
        context.insert(saved)
        try? context.save()
        showingSaveConfirmation = true
    }

    // MARK: - Sharing

    func buildShareContent() -> SalaryShareContent? {
        guard let summary else { return nil }
        return SalaryShareContent(
            year: year,
            annualGross: summary.annualGross,
            annualNet: summary.annualNet,
            annualSSC: summary.annualSSC,
            annualIncomeTax: summary.annualIncomeTax,
            monthlyNet: summary.averageMonthlyNet,
            effectiveTaxRate: summary.effectiveTaxRate
        )
    }
}

struct SalarySavedPayload: Codable {
    let grossAnnual: Decimal
    let year: Int
    let simpleTaxType: SimpleTaxType
    let childCount: Int
    let sscCategory: SSCCategory
    let birthDate: Date
    let yearlyNonTaxBenefit: Decimal
    let yearlyTaxableBenefit: Decimal
    let enableCOLA: Bool
}
```

### 4.2 Automatic Re-calculation via `onChange`

ViewModel'ı view'de `@State` veya `.environment()` ile tutarız. Input değişiminde view `.onChange` ile `vm.scheduleRecalculation()` çağırır:

```swift
.onChange(of: vm.grossAnnual) { vm.scheduleRecalculation() }
.onChange(of: vm.year) { vm.scheduleRecalculation() }
// ... vs.
```

Ya da daha elegant bir çözüm için `Observation.withObservationTracking` ile tüm değişimleri yakala.

---

## 5. View Breakdown

### 5.1 `SalaryScreen.swift`

```swift
import SwiftUI
import DesignSystem
import CalculationKit
import SwiftData

struct SalaryScreen: View {
    @State private var vm = SalaryViewModel()
    @Environment(\.modelContext) private var modelContext
    @ScaledMetric private var cardSpacing: CGFloat = DSSpacing.lg

    var body: some View {
        ScrollView {
            VStack(spacing: cardSpacing) {
                headerSection
                inputCard
                summaryCard
                monthlyBreakdownSection
                insightsSection
                disclaimerSection
            }
            .padding(.horizontal)
            .padding(.top, DSSpacing.md)
            .padding(.bottom, DSSpacing.xxl)
        }
        .scrollDismissesKeyboard(.interactively)
        .background {
            MeshBackground().ignoresSafeArea()
        }
        .navigationTitle("Salary Calculator")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar { toolbarContent }
        .sheet(isPresented: $vm.showingShareSheet) { shareSheet }
        .alert("Saved", isPresented: $vm.showingSaveConfirmation) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Your calculation has been saved to history.")
        }
        .onChange(of: vm.grossAnnual) { vm.scheduleRecalculation() }
        .onChange(of: vm.year) { vm.scheduleRecalculation() }
        .onChange(of: vm.simpleTaxType) { vm.scheduleRecalculation() }
        .onChange(of: vm.childCount) { vm.scheduleRecalculation() }
        .onChange(of: vm.sscCategory) { vm.scheduleRecalculation() }
        .onChange(of: vm.birthDate) { vm.scheduleRecalculation() }
        .onChange(of: vm.yearlyNonTaxBenefit) { vm.scheduleRecalculation() }
        .onChange(of: vm.yearlyTaxableBenefit) { vm.scheduleRecalculation() }
        .onChange(of: vm.enableCOLA) { vm.scheduleRecalculation() }
    }

    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            Menu {
                Button("Share", systemImage: "square.and.arrow.up") {
                    vm.showingShareSheet = true
                }
                Button("Save", systemImage: "bookmark") {
                    vm.save(using: modelContext)
                }
                Button("Reset", systemImage: "arrow.counterclockwise", role: .destructive) {
                    vm.reset()
                }
            } label: {
                Image(systemName: "ellipsis.circle")
            }
        }
    }

    // MARK: - Sections

    private var headerSection: some View {
        VStack(spacing: DSSpacing.md) {
            DSToggleGroup(
                options: Array(2020...2026),
                selection: $vm.year,
                label: { String($0) }
            )
            FloatingNetCard(
                annualNet: vm.summary?.annualNet ?? 0,
                monthlyNet: vm.summary?.averageMonthlyNet ?? 0,
                year: vm.year
            )
        }
    }

    private var inputCard: some View {
        DSCard(.default) {
            VStack(alignment: .leading, spacing: DSSpacing.lg) {
                Text("Your Income")
                    .font(DSFont.headingM)
                    .foregroundStyle(DSColor.textPrimary)

                DSCurrencyField(
                    label: "Annual Gross Salary",
                    value: $vm.grossAnnual,
                    maxValue: 10_000_000
                )
                Text("= \((vm.grossAnnual / 12).eur)/month")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)

                Divider()

                taxTypeSection
                if vm.year >= 2026 && vm.simpleTaxType != .single {
                    childCountSection
                }
                sscCategorySection
                birthDateSection
                benefitsSection
                colaSection
            }
        }
    }

    // ... Other sections implemented similarly
}
```

### 5.2 `FloatingNetCard.swift`

```swift
import SwiftUI
import DesignSystem

struct FloatingNetCard: View {
    let annualNet: Decimal
    let monthlyNet: Decimal
    let year: Int

    var body: some View {
        DSCard(.hero, padding: DSSpacing.xl) {
            VStack(spacing: DSSpacing.xs) {
                Text("Your Net Pay")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)
                    .textCase(.uppercase)
                    .tracking(1.5)

                DSAnimatedNumber(
                    annualNet,
                    format: .currency,
                    font: DSFont.display(44)
                )
                .foregroundStyle(DSGradient.primary)

                Text("per year")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)

                Divider().padding(.vertical, DSSpacing.xs)

                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Monthly")
                            .font(DSFont.caption)
                            .foregroundStyle(DSColor.textSecondary)
                        DSAnimatedNumber(
                            monthlyNet,
                            format: .currency,
                            font: DSFont.heading(22)
                        )
                    }
                    Spacer()
                    Text("Year \(String(year))")
                        .font(DSFont.caption)
                        .padding(.horizontal, DSSpacing.sm)
                        .padding(.vertical, 4)
                        .background(DSColor.maltaGold.opacity(0.12), in: Capsule())
                        .foregroundStyle(DSColor.maltaGold)
                }
            }
            .frame(maxWidth: .infinity)
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Net pay")
        .accessibilityValue("\(annualNet.eur) per year, \(monthlyNet.eur) per month")
    }
}
```

### 5.3 `MonthlyRowCard.swift`

```swift
import SwiftUI
import DesignSystem
import CalculationKit

struct MonthlyRowCard: View {
    let output: SalaryOutput
    let isExpanded: Bool
    let onToggle: () -> Void

    var body: some View {
        VStack(spacing: 0) {
            Button(action: onToggle) {
                HStack {
                    Text(output.month.rawValue.capitalized)
                        .font(DSFont.headingS)
                        .foregroundStyle(DSColor.textPrimary)
                    Spacer()
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(output.net.eur)
                            .font(DSFont.body(17, weight: .semibold))
                            .foregroundStyle(DSColor.maltaGold)
                        Text("Net")
                            .font(DSFont.caption)
                            .foregroundStyle(DSColor.textSecondary)
                    }
                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .font(.caption)
                        .foregroundStyle(DSColor.textTertiary)
                        .padding(.leading, DSSpacing.xs)
                }
                .padding(DSSpacing.md)
            }
            .buttonStyle(.plain)
            .sensoryFeedback(.selection, trigger: isExpanded)

            if isExpanded {
                VStack(spacing: DSSpacing.xs) {
                    Divider()
                    detailRow("Gross Wage", output.grossWage.eur)
                    detailRow("Gross Total", output.grossTotal.eur)
                    detailRow("SSC Base", output.sscBase.eur)
                    detailRow("SSC Tax", "−\(output.sscTax.eur)", isNegative: true)
                    detailRow("Income Base", output.incomeBase.eur)
                    detailRow("Income Tax", "−\(output.incomeTax.eur)", isNegative: true)
                    detailRow("Cumulative Tax", output.cumulativeTax.eur)
                    Divider()
                    detailRow("Net", output.net.eur, isHighlighted: true)
                }
                .padding(DSSpacing.md)
                .transition(.asymmetric(
                    insertion: .opacity.combined(with: .move(edge: .top)),
                    removal: .opacity
                ))
            }
        }
        .liquidGlass()
        .animation(DSMotion.standard, value: isExpanded)
    }

    private func detailRow(_ label: String, _ value: String, isNegative: Bool = false, isHighlighted: Bool = false) -> some View {
        HStack {
            Text(label)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
            Spacer()
            Text(value)
                .font(isHighlighted ? DSFont.body(15, weight: .bold) : DSFont.mono(13))
                .foregroundStyle(isNegative ? DSColor.danger : (isHighlighted ? DSColor.maltaGold : DSColor.textPrimary))
        }
    }
}
```

### 5.4 `SalaryBreakdownDonut.swift`

```swift
import SwiftUI
import DesignSystem
import CalculationKit

struct SalaryBreakdownDonut: View {
    let summary: SalarySummary

    var body: some View {
        DSBreakdownChart(
            segments: [
                .init(label: "Net", value: summary.annualNet, color: DSColor.maltaGold),
                .init(label: "Income Tax", value: summary.annualIncomeTax, color: DSColor.mediterraneanBlue),
                .init(label: "SSC", value: summary.annualSSC, color: DSColor.maltaRed),
            ],
            centerValue: summary.annualNet,
            centerLabel: "Annual Net"
        )
    }
}
```

---

## 6. Edge Case Handling

| Input                                         | Beklenen Davranış                                      |
| --------------------------------------------- | ------------------------------------------------------ |
| `grossAnnual = 0`                             | Tüm değerler €0, hata gösterme                         |
| `grossAnnual < 0`                             | VM'de `nonNegative` ile 0'a clamp                      |
| `grossAnnual > 10M`                           | DSCurrencyField max'ı limit                            |
| `year = 2023, type = married, childCount = 2` | `childCount` ignore (2025 ve öncesi)                   |
| `year = 2026, type = single, childCount = 2`  | `childCount` ignore (single, çocuk sayısı etkisiz)     |
| `birthDate < 1962`                            | SSC categoryCOld/weeklyCapOld kullanılır + info banner |
| `age < 18` (birthDate çok yakın)              | SSC kategorisi A öneril, warning banner                |
| SSC B/C sınırı geçilirse                      | Auto suggest banner ("Recommended: C")                 |
| `enableCOLA = true && year < 2024`            | COLA 0 (yok), toggle gizli                             |

---

## 7. State Persistence

- [ ] `@AppStorage("salary.lastGross") var lastGross: Decimal = 25000`
- [ ] `@AppStorage("salary.lastYear") var lastYear: Int = 2026`
- [ ] `@AppStorage("salary.lastTaxType") var lastTaxType: String = "single"`
- [ ] Screen launch olduğunda VM bu değerleri yükler
- [ ] Değişimde AppStorage güncellenir

---

## 8. Haptics

- [ ] Değer değiştiğinde `.selection` (toggle, stepper)
- [ ] Hesaplama başarılı olduğunda `.success` (debounced)
- [ ] Save tıklandığında `.success`
- [ ] Reset tıklandığında `.warning`
- [ ] Share açıldığında `.selection`

---

## 9. A11y

- [ ] Floating net card → "Net pay: 1,248 euros per month, 14,976 euros per year"
- [ ] Monthly row → "January: 1,248 euros net after 234 euros tax and 120 euros SSC"
- [ ] Donut chart: `accessibilityElement(children: .combine)` ile birleşik okuma
- [ ] Her input field için `accessibilityLabel` + `accessibilityHint`
- [ ] Dinamik font: monthly row yükseklikleri `ScaledMetric` ile otomatik
- [ ] Reduce motion: contentTransition(.numericText) kapanır
- [ ] SF Symbol renderingMode `.hierarchical`

---

## 10. Insights Metinleri

`SalaryInsights.swift`:

```swift
struct SalaryInsights {
    let summary: SalarySummary
    let year: Int
    let simpleTaxType: SimpleTaxType

    var bullets: [String] {
        var items: [String] = []

        // Effective rate
        let ratePoints = (summary.effectiveTaxRate * 100)
        items.append("Your effective tax rate is \(NumberFormatter.percent.string(from: ratePoints as NSDecimalNumber) ?? "—").")

        // Payday estimate
        items.append("Expect approximately \(summary.averageMonthlyNet.eur) to hit your account each month after deductions.")

        // 2026 child hint
        if year == 2026 && simpleTaxType != .single {
            items.append("Tip: Claiming child tax bracket in 2026 can reduce your tax by up to €3,000/year.")
        }

        // Pension hint
        items.append("Consider a private pension contribution (up to €3,000/year) to claim a 25% tax credit.")

        return items
    }
}
```

---

## 11. Alt Adımlar

- [ ] `SalaryViewModel` yaz
- [ ] `SalaryScreen` view + tüm sub-view'ler
- [ ] `FloatingNetCard`
- [ ] `MonthlyRowCard`
- [ ] `SalaryBreakdownDonut`
- [ ] `SalaryCumulativeChart`
- [ ] `SalaryInsights` helper
- [ ] `SalaryShareContent` + share card (Task 11)
- [ ] State persistence (`@AppStorage`)
- [ ] Deep link initial params
- [ ] Unit tests (VM)
- [ ] Snapshot tests

---

## 12. Unit Tests

```swift
@Suite("SalaryViewModel")
@MainActor
struct SalaryViewModelTests {

    @Test("default state calculates 2026 single 25k")
    func defaultCalculation() async throws {
        let vm = SalaryViewModel()
        await vm.scheduleRecalculation(debounceMs: 0)
        try await Task.sleep(for: .milliseconds(50))
        #expect(vm.monthly.count == 12)
        #expect(vm.summary != nil)
    }

    @Test("child count respected for 2026 married")
    func childCount2026() async throws {
        let vm = SalaryViewModel()
        vm.year = 2026
        vm.simpleTaxType = .married
        vm.childCount = 2
        await vm.scheduleRecalculation(debounceMs: 0)
        try await Task.sleep(for: .milliseconds(50))
        // married_2plus bracket → lower tax
    }

    @Test("child count ignored for 2024")
    func childCount2024() async throws {
        let vm = SalaryViewModel()
        vm.year = 2024
        vm.simpleTaxType = .married
        vm.childCount = 2
        // Should use married bracket (no _2plus variant in 2024)
    }

    @Test("deep link applies gross param")
    func deepLink() async throws {
        let vm = SalaryViewModel()
        vm.applyInitialParams(["gross": "50000", "year": "2026"])
        #expect(vm.grossAnnual == 50000)
        #expect(vm.year == 2026)
    }

    @Test("reset restores defaults")
    func reset() {
        let vm = SalaryViewModel()
        vm.grossAnnual = 75_000
        vm.year = 2024
        vm.reset()
        #expect(vm.grossAnnual == 25_000)
        #expect(vm.year == 2026)
    }
}
```

---

## 13. Kabul Kriterleri

- [ ] Input değişiminden sonucun güncellenmesi < 100 ms (debounced)
- [ ] Web'deki aynı örnek input ile sonuç ±€0.01 tolerans
- [ ] 12 ay listesi 60 fps scroll
- [ ] Paylaş butonu PNG + PDF üretiyor
- [ ] Save butonu SwiftData'ya kaydediyor
- [ ] Reset butonu default değerlere dönüyor
- [ ] Deep link `maltacalc://salary?gross=30000&year=2026` doğru açılıyor
- [ ] Snapshot test: light + dark + AX3 + RTL (hazırlık)
- [ ] Unit test VM tüm state transitions
- [ ] VoiceOver tüm kontroller okunuyor
- [ ] Reduce Motion açıkken sayı transition'ları kapanıyor

---

## 14. Sıradaki

[`07-feature-calculators-hub.md`](07-feature-calculators-hub.md)
