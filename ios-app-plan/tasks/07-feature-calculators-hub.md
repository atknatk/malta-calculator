# Task 07 — Feature: Calculators Hub (Grid, Search, Categories)

> **Faz**: M5
> **Ön koşul**: `CalculationKit` en az 6 motor port edildi, Navigation + Design System hazır
> **Çıktı**: Tüm hesaplayıcıların kategorili grid listesi + arama + detay navigation

---

## 1. Amaç

Web'deki `/calculators` sayfasının iOS karşılığı. Kategoriler, grid layout, arama, "coming soon" etiketi, kullanıcının son kullandığı hesaplayıcılar.

---

## 2. Katalog Modeli

```swift
public struct CalculatorCatalogItem: Identifiable, Hashable, Sendable {
    public let id: CalculatorID
    public let title: LocalizedStringResource
    public let subtitle: LocalizedStringResource
    public let category: CalculatorCategory
    public let symbolName: String    // SF Symbol
    public let available: Bool
    public let isPremium: Bool        // v2 için
}

public enum CalculatorCategory: String, CaseIterable, Sendable {
    case employment, family, property, banking, retirement, selfEmployment
    case leave, transport, immigration
}

public enum CalculatorID: String, CaseIterable, Hashable, Sendable {
    case salary, mortgage, stampDuty, personalLoan, savingsInterest, pension
    case retirementAge, overtime, vacation, noticePeriod, childrensAllowance
    case familyReunification, vehicleRegistrationFee, vehicleRegistrationTax
    case roadLicense, driversLicense, vrt, importVehicle
    // Coming soon:
    case bonusTax, partTime, expatriateTax, childcareSubsidy
    case maternity, inWorkBenefit, rentalTax, firstTimeBuyer
    case selfEmployedTax, selfEmployedSSC, sickLeave
}
```

Katalog tek bir JSON'dan yüklenir: `Content/calculators-catalog.json`.

---

## 3. Ekran Yapısı

```
CalculatorsScreen
├── SearchBar (DSCard, .searchable)
├── RecentlyUsedSection (LazyHStack horizontal)
├── ForEach categories
│   ├── DSSectionHeader (icon + title)
│   └── LazyVGrid (2 columns iPhone, 3 columns iPad)
│       └── CalculatorCard * items
└── Stats footer (count: active / soon / categories / free)
```

### 3.1 `CalculatorCard`

- Glass background
- Sol üst: gradient icon box (kategoriye özel)
- Başlık + alt açıklama
- Sağ alt: available ise ChevronRight, değilse "Soon" pill
- Tap → `CalculatorsRouter.path.append(.detail(id))`
- `hoverEffect(.lift)` (iPad)
- `sensoryFeedback(.selection, trigger: tapped)`

### 3.2 Arama

- `.searchable` + filter'a göre tüm kategori listesi içinde filtrele
- Maç varsa ilk X item'ı öne çıkar
- Empty state: `ContentUnavailableView.search`

### 3.3 Recently Used

- SwiftData: `@Model CalculatorUsage { id, lastUsedAt, count }`
- Son 5 tanesi horizontal scroll ile listelenir
- Hub açılışında max 5 item, LRU

---

## 4. Alt Adımlar

- [ ] `calculators-catalog.json` yaz (kategorili, localized key'lerle)
- [ ] `CalculatorsViewModel` — katalog + search + recently used
- [ ] `CalculatorsScreen` view
- [ ] `CalculatorCard` view
- [ ] `CategoryHeaderView`
- [ ] Navigation destination wiring → `CalculatorDetailFactory.view(for: id)`
- [ ] Recently-used persistence (SwiftData)
- [ ] Stats footer bileşeni

---

## 5. Kabul Kriterleri

- [ ] 28+ item problem yaşamadan grid'de listeleniyor
- [ ] Search 150ms debounce ile akıcı
- [ ] Coming soon item'lar tap olmuyor (haptic: negative)
- [ ] iPad'de 3 kolon, iPhone'da 2 kolon
- [ ] Recently used 5 ile sınırlı, temizlenebilir
- [ ] Snapshot test light + dark

---

## 6. Sıradaki

[`08-feature-calculator-detail.md`](08-feature-calculator-detail.md)
