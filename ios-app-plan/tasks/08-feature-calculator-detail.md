# Task 08 — Feature: Calculator Detail Screens

> **Faz**: M5
> **Ön koşul**: `CalculationKit` motorları port edilmiş, `DesignSystem` controls hazır
> **Çıktı**: 17 aktif hesaplayıcı için detay ekranları (her biri test edilmiş)

---

## 1. Amaç

Her hesaplayıcı detay ekranı aynı **scaffold**'a oturur: input bloğu + sonuç bloğu + (opsiyonel) grafik + bilgi notu + paylaş + save. Her biri için ayrı `ViewModel` + `Screen` + `ShareCard` çifti üretilir.

---

## 2. Ortak Scaffold

### 2.1 `CalculatorDetailScaffold.swift`

```swift
import SwiftUI
import DesignSystem
import SwiftData

struct CalculatorDetailScaffold<Inputs: View, Results: View>: View {
    let id: CalculatorID
    let title: LocalizedStringResource
    let subtitle: LocalizedStringResource
    let symbolName: String
    let category: CalculatorCategory
    @ViewBuilder var inputs: () -> Inputs
    @ViewBuilder var results: () -> Results
    let infoLines: [InfoLine]
    let onSave: (() -> Void)?
    let onShare: (() -> Void)?
    let onReset: (() -> Void)?

    @State private var showingInfo: Bool = false

    var body: some View {
        ScrollView {
            VStack(spacing: DSSpacing.lg) {
                heroHeader
                DSCard { inputs() }
                DSCard(.highlighted) { results() }
                if !infoLines.isEmpty {
                    infoButton
                }
            }
            .padding(.horizontal)
            .padding(.bottom, DSSpacing.xxl)
        }
        .scrollDismissesKeyboard(.interactively)
        .background { MeshBackground().ignoresSafeArea() }
        .navigationTitle(Text(title))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar { toolbarContent }
        .sheet(isPresented: $showingInfo) {
            CalculatorInfoSheet(title: title, lines: infoLines)
        }
    }

    private var heroHeader: some View {
        HStack(spacing: DSSpacing.md) {
            ZStack {
                RoundedRectangle(cornerRadius: DSRadius.md)
                    .fill(DSGradient.category(category.gradientColors))
                    .frame(width: 56, height: 56)
                Image(systemName: symbolName)
                    .font(.title2.weight(.bold))
                    .foregroundStyle(.white)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(DSFont.heading(20))
                Text(subtitle).font(DSFont.caption).foregroundStyle(DSColor.textSecondary)
            }
            Spacer()
        }
    }

    private var infoButton: some View {
        Button {
            showingInfo = true
        } label: {
            HStack {
                Image(systemName: "info.circle")
                Text("How this is calculated")
                Spacer()
                Image(systemName: "chevron.right")
            }
            .padding(DSSpacing.md)
            .liquidGlass()
        }
        .buttonStyle(.plain)
    }

    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            Menu {
                if let onShare {
                    Button("Share", systemImage: "square.and.arrow.up", action: onShare)
                }
                if let onSave {
                    Button("Save", systemImage: "bookmark", action: onSave)
                }
                if let onReset {
                    Button("Reset", systemImage: "arrow.counterclockwise", role: .destructive, action: onReset)
                }
            } label: {
                Image(systemName: "ellipsis.circle")
            }
        }
    }
}

struct InfoLine: Identifiable, Hashable {
    let id = UUID()
    let label: LocalizedStringResource
    let value: LocalizedStringResource
}
```

### 2.2 `CalculatorInfoSheet.swift`

Sheet — bilgi metinleri (web'deki `getXInfo()` karşılığı). Markdown render desteği.

---

## 3. Per-Calculator Detayları

> Aşağıdaki her hesaplayıcı için: state schema, input alanları, output alanları, edge case'ler, info content özet.

### 3.1 Mortgage

**State**:

```swift
@Observable @MainActor
final class MortgageViewModel {
    var propertyPrice: Decimal = 300_000
    var depositPercent: Decimal = 20
    var interestRate: Decimal = 4.5
    var loanTermYears: Int = 25
    var showSchedule: Bool = false

    private(set) var output: MortgageOutput?

    func recalculate() {
        let calc = MortgageCalculator()
        do {
            output = try calc.calculate(input: .init(
                propertyPrice: propertyPrice,
                depositPercent: max(depositPercent, 10),
                interestRate: interestRate,
                loanTermYears: loanTermYears
            ))
        } catch { /* */ }
    }
}
```

**Inputs**:

- DSCurrencyField: Property Price (10k - 5M)
- DSSliderField: Deposit % (10 - 90)
- DSSliderField: Interest Rate (0.5 - 12)
- DSSliderField: Term Years (5 - 40)

**Outputs**:

- Hero: Monthly Payment (DSAnimatedNumber)
- Cards: Loan Amount, Total Interest, Total Cost, LTV, Effective Annual Rate
- DSAmortizationChart (line, principal vs interest)
- Expandable: Yearly schedule (LazyVStack)

**Edge cases**:

- Deposit < 10% → auto clamp to 10%, banner: "Minimum 10% deposit required in Malta"
- Property price < 10k → 0 result, "Enter a valid amount"
- Interest rate 0 → division by zero handling (show simple PMT)

**Info**: 10% min deposit, LTV calculation, PMT formula explanation.

---

### 3.2 Personal Loan

**State**:

```swift
var loanAmount: Decimal = 10_000
var interestRate: Decimal = 7.5
var termMonths: Int = 60
```

**Inputs**: Amount, Rate, Term (months)
**Outputs**: Monthly payment, Total interest, Total cost, schedule
**Chart**: Amortization line chart
**Edge**: 1k min, 50k max (Malta typical)

---

### 3.3 Stamp Duty

**State**:

```swift
var propertyPrice: Decimal = 250_000
var isFirstTimeBuyer: Bool = false
```

**Inputs**:

- DSCurrencyField: Property Price
- DSToggle: First-Time Buyer

**Outputs**:

- Stamp Duty (€)
- Effective Rate (%)
- Exempted Amount (if first-time)
- Savings (€)
- Comparison bar chart (with vs without exemption)

**Edge**: Standard 5%, first-time buyer first 200k exempt.

**Info**: 5% standart oran, first-time buyer 200k muafiyet, max 10k tasarruf.

---

### 3.4 Savings Interest

**State**:

```swift
var initialDeposit: Decimal = 10_000
var monthlyContribution: Decimal = 200
var annualRate: Decimal = 3.5
var termYears: Int = 5
var compoundFrequency: CompoundFrequency = .monthly
var applyTax: Bool = true   // 15% withholding
```

**Outputs**: Final balance, total interest, total contributions, tax paid, line chart over years.

**Edge**: 15% withholding tax for residents (toggle).

---

### 3.5 Pension

**State**:

```swift
var birthYear: Int = 1980
var taxStatus: SimpleTaxType = .single
var children: Int = 0
var paidYears: Int = 30
var averageSalary: Decimal = 25_000
var deferralYears: PensionDeferralYears = .none
var privatePensionContribution: Decimal = 0
```

**Outputs**:

- Hero: Annual Pension (€)
- Monthly Pension, Weekly Pension
- Eligibility status
- MPI cap warning (if exceeded)
- Effective years (with child credits)
- Proportion (%)
- Deferral bonus
- Private pension tax credit
- Tax exemption status

**Charts**:

- Bar chart: Components (base + COLA + deferral)
- Comparison: With vs without private pension contribution

**Warnings**:

- Min 10 years contribution
- MPI cap (€29,083 in 2026)
- Insufficient years pro-rated

---

### 3.6 Retirement Age

**State**:

```swift
var birthYear: Int = 1985
var gender: Gender = .male
```

**Outputs**:

- Retirement age
- Retirement year
- Years/months remaining
- Rule description (e.g., "Born 1962 or later → age 65")
- Reference table (all brackets)

---

### 3.7 Overtime

**State**:

```swift
var hourlyRate: Decimal = 12
var overtimeHours: Decimal = 8
var overtimeType: OvertimeType = .weekday
var annualSalary: Decimal = 0   // alternative to hourlyRate
```

**Outputs**:

- Base hourly rate
- Multiplier (1.5x / 2.0x)
- Overtime hourly rate
- Total overtime pay
- Comparison: weekday vs sunday vs holiday (chart)

**Helper**: `calculateHourlyRate(annual)` for users entering annual salary instead.

---

### 3.8 Vacation

**State**:

```swift
var weeklyHours: Int = 40
var year: Int = 2026
var monthsWorked: Int = 12
```

**Outputs**:

- Base hours, public holiday hours, total hours, total days
- Pro-rata if monthsWorked < 12
- Public holidays on weekends info (year-specific)

**Edge**: Pro-rata calculation for partial year.

---

### 3.9 Notice Period

**State**:

```swift
var years: Int = 0
var months: Int = 0
var isInProbation: Bool = false
```

**Outputs**:

- Notice in weeks
- Notice in days
- Service bracket description
- Visualization: bracket position on a timeline

---

### 3.10 Children's Allowance

**State**:

```swift
var familyIncome: Decimal = 25_000
var numberOfChildren: Int = 2
var hasOneChildBonus: Bool = false  // first child birth bonus
```

**Outputs**:

- Annual allowance
- Monthly allowance
- Per-child breakdown
- Birth bonus (if applicable)
- Rate type (income-based)

---

### 3.11 Family Reunification

**State**:

```swift
var familyMemberCount: Int = 2
var scheme: SchemeType = .singlePermit
```

**Outputs**:

- Required annual salary
- Required monthly salary
- Comparison: Single Permit vs Ordinary Permit
- Eligibility check banner

---

### 3.12 Vehicle Registration Fee

**State**:

```swift
var vehicleType: VehicleType = .car
var ageInYears: Int = 0
var isElectric: Bool = false
```

**Outputs**: Fee breakdown, total.

---

### 3.13 Vehicle Registration Tax

**State**:

```swift
var co2Emissions: Int = 120  // g/km
var vehicleValue: Decimal = 20_000
var fuelType: FuelType = .petrol
var isUsed: Bool = false
```

**Outputs**: VRT amount, CO2 bracket, comparison chart by emission.

---

### 3.14 Road License

**State**:

```swift
var engineCC: Int = 1600
var fuelType: FuelType = .petrol
var co2Emissions: Int = 130
```

**Outputs**: Annual fee, breakdown by component.

---

### 3.15 Driver's License

**State**:

```swift
var licenseCategory: LicenseCategory = .b
var isRenewal: Bool = false
var includeTheory: Bool = true
var includePractical: Bool = true
```

**Outputs**: Total cost breakdown.

---

### 3.16 VRT (MOT)

**State**:

```swift
var vehicleType: VehicleType = .car
var fuelType: FuelType = .petrol
var ageInYears: Int = 5
```

**Outputs**: Test fee, additional fees if applicable.

---

### 3.17 Import Vehicle

**State**:

```swift
var purchasePrice: Decimal = 15_000
var co2Emissions: Int = 130
var ageInMonths: Int = 36
var fuelType: FuelType = .petrol
var shippingCost: Decimal = 1500
var customsValue: Decimal = 0  // auto-computed if 0
```

**Outputs**:

- VRT
- Registration tax
- Registration fee
- Customs duty
- VAT (18%)
- Shipping
- **Total import cost**
- Pie chart of components

**Karmaşıklık**: En yüksek — 5 komponentin toplamı.

---

## 4. Per-Calculator Klasör Şablonu

Her hesaplayıcı için aynı dosya yapısı:

```text
Features/Calculators/Mortgage/
├── MortgageScreen.swift          # SwiftUI view
├── MortgageViewModel.swift       # @Observable VM
├── MortgageInputsView.swift      # Input section
├── MortgageResultsView.swift     # Output section
├── MortgageScheduleView.swift    # Optional table/chart
├── MortgageInfoContent.swift     # Static info text
└── MortgageShareCard.swift       # Share/PDF view
```

---

## 5. Teslim Sıralaması (Sprint Bazlı)

### Sprint 1 (M5.1 — 1 hafta)

1. Mortgage
2. Personal Loan
3. Stamp Duty
4. Savings Interest

### Sprint 2 (M5.2 — 1 hafta)

5. Pension
6. Retirement Age
7. Overtime
8. Vacation

### Sprint 3 (M5.3 — 1 hafta)

9. Notice Period
10. Children's Allowance
11. Family Reunification

### Sprint 4 (M5.4 — 1 hafta)

12. Vehicle Reg Fee
13. Vehicle Reg Tax
14. Road License
15. Driver's License
16. VRT
17. Import Vehicle

Her sprint sonu PR + snapshot + golden test geçişli.

---

## 6. Per-Calculator Kabul Kriterleri (Şablon)

- [ ] Sonuç web'deki aynı input ile ±€0.01 (golden fixture varsa)
- [ ] Input focus keyboard davranışı düzgün, "Done" butonu var
- [ ] DSCurrencyField, DSSliderField, DSToggleGroup tutarlı
- [ ] Share butonu PNG + (varsa) PDF üretiyor
- [ ] Save butonu SwiftData'ya ekliyor
- [ ] Reset butonu default değerlere dönüyor
- [ ] Snapshot test light + dark
- [ ] VoiceOver sonuç değerini tek özet halinde okuyor
- [ ] Empty/edge case: 0 veya negatif → hatasız "—"
- [ ] Deep link initial params destekliyor

---

## 7. Ortak Helpers

### 7.1 `CalculatorBaseViewModel.swift` (Protocol + extension)

```swift
@MainActor
protocol CalculatorViewModelProtocol: AnyObject, Observable {
    associatedtype Output

    var output: Output? { get }
    func recalculate()
    func reset()
    func applyInitialParams(_ params: [String: String])
    func saveSnapshot(in context: ModelContext)
    func buildShareContent() -> Any?
}
```

### 7.2 Auto-recalculate Helper

```swift
extension View {
    func autoRecalculate<T: Equatable>(_ values: T..., perform: @escaping () -> Void) -> some View {
        self.onChange(of: values) { _, _ in perform() }
    }
}
```

---

## 8. Per-Calculator Test Şablonu

```swift
@Suite("MortgageViewModel")
@MainActor
struct MortgageViewModelTests {
    @Test("default 300k 25y 4.5%")
    func defaultCase() async throws {
        let vm = MortgageViewModel()
        vm.recalculate()
        try #require(vm.output != nil)
        let output = vm.output!
        // ±€0.01 against golden fixture
        let goldenMonthly: Decimal = 1336.76
        #expect(abs(output.monthlyPayment - goldenMonthly) <= 0.01)
    }

    @Test("deposit < 10% clamps to 10%")
    func minDeposit() {
        let vm = MortgageViewModel()
        vm.depositPercent = 5
        vm.recalculate()
        // Output should reflect 10% deposit
    }

    @Test("zero interest rate handled")
    func zeroRate() {
        let vm = MortgageViewModel()
        vm.interestRate = 0
        vm.recalculate()
        // Should not crash, should compute simple division
    }
}
```

Her hesaplayıcı için en az **3 test** (default, edge, golden).

---

## 9. Kabul Kriterleri (Tüm Detay Ekranları)

- [ ] 17 ekran tamamlandı (1 Salary tab, 16 detay)
- [ ] Her biri scaffold pattern'ini kullanıyor
- [ ] Her biri için unit + snapshot test geçiyor
- [ ] Golden fixture olan motorlarda ±€0.01 tolerans tutturuldu
- [ ] Recently used SwiftData entegrasyonu çalışıyor
- [ ] Share / Save / Reset her ekranda var
- [ ] VoiceOver tüm sonuçlar okunuyor
- [ ] Snapshot test set tam (17 × light + dark = 34 minimum)

---

## 10. Sıradaki

[`09-feature-guides.md`](09-feature-guides.md)
