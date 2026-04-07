# Task 06 — Feature: Salary (Playground UX)

> **Faz**: M4
> **Ön koşul**: `CalculationKit.Salary`, `DesignSystem` controls hazır, Navigation iskeleti var
> **Çıktı**: Salary tab'ında çalışan, 12 aylık detay veren maaş hesaplayıcı

---

## 1. Amaç

Web'in ana sayfasındaki playground-tarzı salary calculator deneyimini iOS'ta **daha iyi** bir dokunmatik/skroll deneyimine çevirmek. Çekirdek özellikler:

- Gross yıllık/aylık maaş input
- Yıl seçimi (2020-2026)
- Vergi tipi: Single / Married / Parent
- Çocuk sayısı (2026+ için)
- SSC kategorisi (auto / manual)
- Doğum tarihi (1962 öncesi etki için)
- Benefits (taxable + non-taxable)
- COLA toggle
- Aylık breakdown (12 satır)
- Donut chart (Gross/SSC/Tax/Net)
- Share / Export

---

## 2. Ekran Yapısı

```
SalaryScreen
├── Header: Title + animated Net card (floating)
├── InputCard (liquidGlass)
│   ├── GrossAnnualField (DSNumericField)
│   ├── YearPicker (DSToggleGroup)
│   ├── TaxTypePicker
│   ├── ChildCountStepper (if year >= 2026)
│   ├── SSCCategoryPicker
│   ├── BirthDatePicker (DatePicker .compact)
│   ├── BenefitsSection (collapsible)
│   └── COLAToggle
├── BreakdownCard (DSBreakdownChart donut)
├── MonthlyBreakdownList (12 cards, swipe to expand)
└── FooterBar (Share, Save, Reset)
```

### 2.1 Floating Net Card

Web'deki `floating-net-card.tsx` karşılığı — ekran kaydırılırken üstte sabit kalan gold glass card, güncel yıllık ve aylık net maaşı anime ederek gösterir. `PhaseAnimator` + `contentTransition(.numericText())` kullanılır.

### 2.2 Monthly Breakdown List

Her ay için `DSCard` — expand edildiğinde SSC base, SSC tax, income tax, cumulative tax, net detayı. `LazyVStack` içinde, `scrollTransition` ile yaklaştıkça ölçeklenir.

---

## 3. State Modeli

```swift
@Observable
final class SalaryViewModel {
    var grossAnnual: Money = 25_000
    var year: Int = 2026
    var simpleTaxType: SimpleTaxType = .single
    var childCount: Int = 0
    var sscCategory: SSCCategory = .c
    var birthDate: Date = DateComponents(calendar: .current, year: 1990, month: 1, day: 1).date!
    var yearlyNonTaxBenefit: Money = 0
    var yearlyTaxableBenefit: Money = 0
    var enableCOLA: Bool = true

    private(set) var monthly: [SalaryOutput] = []
    private(set) var summary: SalarySummary?

    func recalculate() async {
        let config = SalaryCalculatorConfig(/* ... */)
        let taxConfig = try await TaxConfigStore.shared.load()
        let calculator = SalaryCalculator(config: config, taxConfig: taxConfig)
        let inputs = Month.allCases.map {
            SalaryInput(month: $0, grossWage: grossAnnual / 12, /* ... */)
        }
        self.monthly = calculator.calculate(inputs: inputs)
        self.summary = SalarySummary(from: monthly)
    }
}
```

Change detection: `withObservationTracking` ile alanlar değişince `Task { await recalculate() }`.

---

## 4. Alt Adımlar

- [ ] `SalaryViewModel` yaz
- [ ] `SalaryScreen` view'i tasarla
- [ ] `FloatingNetCard` bileşeni
- [ ] `MonthlyRow` expand/collapse
- [ ] `SalaryBreakdownDonut` (DSBreakdownChart kullanır)
- [ ] `SalaryShareService` — PNG summary card üreticisi
- [ ] Haptics: değer değiştiğinde `.selection`, sonuç yenilendiğinde `.success`
- [ ] State persistence: son kullanılan değerler SwiftData'da
- [ ] URL state (nuqs karşılığı): UserDefaults yeterli v1'de

---

## 5. Edge Case'ler

- [ ] 2025 ve öncesinde `childCount` gizli
- [ ] SSC B/C sınır geçişinde kategori otomatik öneri
- [ ] 18 yaş altı → SSC A, uyarı mesajı
- [ ] Negatif/0 input → 0 Euro göster, hata yerine
- [ ] Çok büyük değerler → DSNumericField max 10M

---

## 6. A11y

- [ ] Her input field için `accessibilityLabel`
- [ ] Donut chart: `accessibilityElement(children: .combine)` ile birleşik okuma
- [ ] "Net pay X euros per month" şeklinde özet label
- [ ] Dinamik font: monthly row yükseklikleri otomatik

---

## 7. Kabul Kriterleri

- [ ] Input değişiminden sonucun güncellenmesi < 100ms
- [ ] Web'deki aynı örnek input ile sonuç ±€0.01 tolerans
- [ ] 12 ay listesi 60 fps scroll
- [ ] Paylaş butonu PNG üretiyor
- [ ] Reset butonu default değerlere dönüyor
- [ ] Snapshot test: light + dark + AX3

---

## 8. Sıradaki

[`07-feature-calculators-hub.md`](07-feature-calculators-hub.md)
