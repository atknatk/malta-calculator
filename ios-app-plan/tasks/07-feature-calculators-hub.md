# Task 07 — Feature: Calculators Hub (Grid, Search, Categories)

> **Faz**: M5
> **Ön koşul**: `CalculationKit` ≥ 6 motor port edilmiş, `DesignSystem` hazır
> **Çıktı**: Tüm hesaplayıcıların kategorili grid listesi + arama + recently used + detay routing

---

## 1. Amaç

Web'deki `/calculators` sayfasının iOS karşılığı. Kategoriler, grid layout, arama, "coming soon" etiketi, kullanıcının son kullandığı hesaplayıcılar.

---

## 2. Katalog Modeli

### 2.1 `CalculatorID.swift`

```swift
public enum CalculatorID: String, CaseIterable, Hashable, Sendable, Codable {
    // Active (16)
    case salary
    case noticePeriod = "notice-period"
    case overtime
    case childrensAllowance = "childrens-allowance"
    case stampDuty = "stamp-duty"
    case mortgage
    case savingsInterest = "savings-interest"
    case personalLoan = "personal-loan"
    case pension
    case retirementAge = "retirement-age"
    case vacation
    case familyReunification = "family-reunification"
    case vehicleRegistrationFee = "vehicle-registration-fee"
    case vehicleRegistrationTax = "vehicle-registration-tax"
    case roadLicense = "road-license"
    case driversLicense = "drivers-license"
    case vrt
    case importVehicle = "import-vehicle"

    // Coming Soon (12)
    case bonusTax = "bonus-tax"
    case partTime = "part-time"
    case expatriateTax = "expatriate-tax"
    case childcareSubsidy = "childcare"
    case maternity
    case inWorkBenefit = "in-work-benefit"
    case rentalTax = "rental-tax"
    case firstTimeBuyer = "first-time-buyer"
    case selfEmployedTax = "self-employed-tax"
    case selfEmployedSSC = "self-employed-ssc"
    case sickLeave = "sick-leave"
}
```

### 2.2 `CalculatorCategory.swift`

```swift
public enum CalculatorCategory: String, CaseIterable, Hashable, Sendable {
    case employment, family, property, banking, retirement
    case selfEmployment = "self_employment"
    case leave, transport, immigration

    public var title: LocalizedStringResource {
        switch self {
        case .employment: return "Employment & Salary"
        case .family: return "Family & Children"
        case .property: return "Property & Housing"
        case .banking: return "Banking & Loans"
        case .retirement: return "Retirement & Savings"
        case .selfEmployment: return "Self-Employment"
        case .leave: return "Leave & Time Off"
        case .transport: return "Transport & Vehicles"
        case .immigration: return "Immigration & Visa"
        }
    }

    public var symbolName: String {
        switch self {
        case .employment: return "briefcase.fill"
        case .family: return "figure.2.and.child.holdinghands"
        case .property: return "house.fill"
        case .banking: return "building.columns.fill"
        case .retirement: return "leaf.fill"
        case .selfEmployment: return "person.crop.circle.badge.checkmark"
        case .leave: return "calendar"
        case .transport: return "car.fill"
        case .immigration: return "airplane"
        }
    }

    public var gradientColors: [Color] {
        switch self {
        case .employment: return DSColor.categoryEmployment
        case .family: return DSColor.categoryFamily
        case .property: return DSColor.categoryProperty
        case .banking: return DSColor.categoryBanking
        case .retirement: return DSColor.categoryRetirement
        case .selfEmployment: return DSColor.categorySelfEmp
        case .leave: return DSColor.categoryLeave
        case .transport: return DSColor.categoryTransport
        case .immigration: return DSColor.categoryImmigration
        }
    }
}
```

### 2.3 `CalculatorCatalogItem.swift`

```swift
public struct CalculatorCatalogItem: Identifiable, Hashable, Sendable, Codable {
    public let id: CalculatorID
    public let titleKey: String
    public let subtitleKey: String
    public let category: CalculatorCategory
    public let symbolName: String
    public let available: Bool
    public let isPremium: Bool

    public var title: LocalizedStringResource {
        LocalizedStringResource(stringLiteral: titleKey)
    }

    public var subtitle: LocalizedStringResource {
        LocalizedStringResource(stringLiteral: subtitleKey)
    }
}
```

---

## 3. Katalog JSON

### 3.1 `Resources/Content/calculators-catalog.json`

```json
{
  "version": "1.0.0",
  "items": [
    {
      "id": "salary",
      "titleKey": "calc.salary.title",
      "subtitleKey": "calc.salary.subtitle",
      "category": "employment",
      "symbolName": "eurosign.circle.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "notice-period",
      "titleKey": "calc.notice_period.title",
      "subtitleKey": "calc.notice_period.subtitle",
      "category": "employment",
      "symbolName": "clock.badge",
      "available": true,
      "isPremium": false
    },
    {
      "id": "overtime",
      "titleKey": "calc.overtime.title",
      "subtitleKey": "calc.overtime.subtitle",
      "category": "employment",
      "symbolName": "clock.arrow.2.circlepath",
      "available": true,
      "isPremium": false
    },
    {
      "id": "bonus-tax",
      "titleKey": "calc.bonus_tax.title",
      "subtitleKey": "calc.bonus_tax.subtitle",
      "category": "employment",
      "symbolName": "gift.fill",
      "available": false,
      "isPremium": false
    },
    {
      "id": "part-time",
      "titleKey": "calc.part_time.title",
      "subtitleKey": "calc.part_time.subtitle",
      "category": "employment",
      "symbolName": "person.crop.rectangle",
      "available": false,
      "isPremium": false
    },
    {
      "id": "expatriate-tax",
      "titleKey": "calc.expatriate_tax.title",
      "subtitleKey": "calc.expatriate_tax.subtitle",
      "category": "employment",
      "symbolName": "airplane.circle",
      "available": false,
      "isPremium": false
    },
    {
      "id": "childcare",
      "titleKey": "calc.childcare.title",
      "subtitleKey": "calc.childcare.subtitle",
      "category": "family",
      "symbolName": "figure.and.child.holdinghands",
      "available": false,
      "isPremium": false
    },
    {
      "id": "maternity",
      "titleKey": "calc.maternity.title",
      "subtitleKey": "calc.maternity.subtitle",
      "category": "family",
      "symbolName": "figure.dress.line.vertical.figure",
      "available": false,
      "isPremium": false
    },
    {
      "id": "childrens-allowance",
      "titleKey": "calc.childrens_allowance.title",
      "subtitleKey": "calc.childrens_allowance.subtitle",
      "category": "family",
      "symbolName": "figure.child.circle",
      "available": true,
      "isPremium": false
    },
    {
      "id": "in-work-benefit",
      "titleKey": "calc.in_work_benefit.title",
      "subtitleKey": "calc.in_work_benefit.subtitle",
      "category": "family",
      "symbolName": "hand.raised.fill",
      "available": false,
      "isPremium": false
    },
    {
      "id": "stamp-duty",
      "titleKey": "calc.stamp_duty.title",
      "subtitleKey": "calc.stamp_duty.subtitle",
      "category": "property",
      "symbolName": "doc.text.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "rental-tax",
      "titleKey": "calc.rental_tax.title",
      "subtitleKey": "calc.rental_tax.subtitle",
      "category": "property",
      "symbolName": "key.fill",
      "available": false,
      "isPremium": false
    },
    {
      "id": "first-time-buyer",
      "titleKey": "calc.first_time_buyer.title",
      "subtitleKey": "calc.first_time_buyer.subtitle",
      "category": "property",
      "symbolName": "house.and.flag.fill",
      "available": false,
      "isPremium": false
    },
    {
      "id": "mortgage",
      "titleKey": "calc.mortgage.title",
      "subtitleKey": "calc.mortgage.subtitle",
      "category": "banking",
      "symbolName": "house.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "savings-interest",
      "titleKey": "calc.savings.title",
      "subtitleKey": "calc.savings.subtitle",
      "category": "banking",
      "symbolName": "banknote.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "personal-loan",
      "titleKey": "calc.personal_loan.title",
      "subtitleKey": "calc.personal_loan.subtitle",
      "category": "banking",
      "symbolName": "creditcard.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "pension",
      "titleKey": "calc.pension.title",
      "subtitleKey": "calc.pension.subtitle",
      "category": "retirement",
      "symbolName": "leaf.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "retirement-age",
      "titleKey": "calc.retirement_age.title",
      "subtitleKey": "calc.retirement_age.subtitle",
      "category": "retirement",
      "symbolName": "calendar.badge.clock",
      "available": true,
      "isPremium": false
    },
    {
      "id": "self-employed-tax",
      "titleKey": "calc.se_tax.title",
      "subtitleKey": "calc.se_tax.subtitle",
      "category": "self_employment",
      "symbolName": "person.text.rectangle",
      "available": false,
      "isPremium": false
    },
    {
      "id": "self-employed-ssc",
      "titleKey": "calc.se_ssc.title",
      "subtitleKey": "calc.se_ssc.subtitle",
      "category": "self_employment",
      "symbolName": "shield.lefthalf.filled",
      "available": false,
      "isPremium": false
    },
    {
      "id": "vacation",
      "titleKey": "calc.vacation.title",
      "subtitleKey": "calc.vacation.subtitle",
      "category": "leave",
      "symbolName": "beach.umbrella.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "sick-leave",
      "titleKey": "calc.sick_leave.title",
      "subtitleKey": "calc.sick_leave.subtitle",
      "category": "leave",
      "symbolName": "cross.case.fill",
      "available": false,
      "isPremium": false
    },
    {
      "id": "vehicle-registration-fee",
      "titleKey": "calc.vrf.title",
      "subtitleKey": "calc.vrf.subtitle",
      "category": "transport",
      "symbolName": "car.front.waves.up",
      "available": true,
      "isPremium": false
    },
    {
      "id": "vehicle-registration-tax",
      "titleKey": "calc.vrt_tax.title",
      "subtitleKey": "calc.vrt_tax.subtitle",
      "category": "transport",
      "symbolName": "car.circle.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "road-license",
      "titleKey": "calc.road_license.title",
      "subtitleKey": "calc.road_license.subtitle",
      "category": "transport",
      "symbolName": "road.lanes",
      "available": true,
      "isPremium": false
    },
    {
      "id": "drivers-license",
      "titleKey": "calc.drivers_license.title",
      "subtitleKey": "calc.drivers_license.subtitle",
      "category": "transport",
      "symbolName": "person.badge.shield.checkmark.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "vrt",
      "titleKey": "calc.vrt.title",
      "subtitleKey": "calc.vrt.subtitle",
      "category": "transport",
      "symbolName": "wrench.and.screwdriver.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "import-vehicle",
      "titleKey": "calc.import_vehicle.title",
      "subtitleKey": "calc.import_vehicle.subtitle",
      "category": "transport",
      "symbolName": "shippingbox.fill",
      "available": true,
      "isPremium": false
    },
    {
      "id": "family-reunification",
      "titleKey": "calc.family_reunification.title",
      "subtitleKey": "calc.family_reunification.subtitle",
      "category": "immigration",
      "symbolName": "person.3.fill",
      "available": true,
      "isPremium": false
    }
  ]
}
```

> Toplam 29 item: 17 active (Salary dahil) + 12 coming soon. Salary tab'ında, ama hub'da da gösterilir.

---

## 4. View Model

### 4.1 `CalculatorsViewModel.swift`

```swift
import Foundation
import Observation
import SwiftData

@Observable
@MainActor
final class CalculatorsViewModel {
    private(set) var allItems: [CalculatorCatalogItem] = []
    private(set) var groupedItems: [CalculatorCategory: [CalculatorCatalogItem]] = [:]
    private(set) var recentlyUsed: [CalculatorCatalogItem] = []

    var searchText: String = "" {
        didSet { applyFilter() }
    }

    var selectedCategory: CalculatorCategory? = nil

    private(set) var filteredItems: [CalculatorCatalogItem] = []

    init() {
        loadCatalog()
    }

    // MARK: - Loading

    private func loadCatalog() {
        guard let url = Bundle.main.url(
            forResource: "calculators-catalog",
            withExtension: "json",
            subdirectory: "Content"
        ) else {
            assertionFailure("calculators-catalog.json missing")
            return
        }
        do {
            let data = try Data(contentsOf: url)
            struct Wrapper: Decodable {
                let items: [CalculatorCatalogItem]
            }
            let wrapper = try JSONDecoder().decode(Wrapper.self, from: data)
            self.allItems = wrapper.items
            self.groupedItems = Dictionary(grouping: wrapper.items, by: \.category)
            self.filteredItems = wrapper.items
        } catch {
            print("Catalog load error: \(error)")
        }
    }

    func loadRecentlyUsed(from context: ModelContext) {
        let descriptor = FetchDescriptor<CalculatorUsage>(
            sortBy: [SortDescriptor(\.lastUsedAt, order: .reverse)]
        )
        guard let usages = try? context.fetch(descriptor) else { return }
        let topIDs = usages.prefix(5).map(\.id)
        self.recentlyUsed = topIDs.compactMap { idString in
            allItems.first { $0.id.rawValue == idString }
        }
    }

    func recordUsage(of id: CalculatorID, in context: ModelContext) {
        let key = id.rawValue
        let descriptor = FetchDescriptor<CalculatorUsage>(
            predicate: #Predicate { $0.id == key }
        )
        if let existing = try? context.fetch(descriptor).first {
            existing.lastUsedAt = .now
            existing.count += 1
        } else {
            context.insert(CalculatorUsage(id: key, lastUsedAt: .now, count: 1))
        }
        try? context.save()
        loadRecentlyUsed(from: context)
    }

    // MARK: - Filtering

    private func applyFilter() {
        let trimmed = searchText.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        if trimmed.isEmpty {
            if let category = selectedCategory {
                filteredItems = allItems.filter { $0.category == category }
            } else {
                filteredItems = allItems
            }
            return
        }
        filteredItems = allItems.filter { item in
            let title = String(localized: item.title).lowercased()
            let subtitle = String(localized: item.subtitle).lowercased()
            return title.contains(trimmed) || subtitle.contains(trimmed)
        }
    }

    func selectCategory(_ category: CalculatorCategory?) {
        self.selectedCategory = category
        applyFilter()
    }

    // MARK: - Stats

    var statistics: CatalogStatistics {
        let active = allItems.filter(\.available).count
        let soon = allItems.count - active
        let categories = Set(allItems.map(\.category)).count
        return CatalogStatistics(active: active, soon: soon, categories: categories)
    }
}

struct CatalogStatistics {
    let active: Int
    let soon: Int
    let categories: Int
}
```

---

## 5. Ekran Yapısı

### 5.1 `CalculatorsHubScreen.swift`

```swift
import SwiftUI
import DesignSystem
import SwiftData

struct CalculatorsHubScreen: View {
    @State private var vm = CalculatorsViewModel()
    @Environment(\.modelContext) private var modelContext
    @Environment(AppState.self) private var appState

    private let columns = [
        GridItem(.adaptive(minimum: 160, maximum: 200), spacing: DSSpacing.md)
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DSSpacing.xl) {
                statsBar
                if !vm.recentlyUsed.isEmpty {
                    recentlyUsedSection
                }
                if !vm.searchText.isEmpty {
                    searchResultsSection
                } else {
                    categoriesSection
                }
            }
            .padding(.horizontal)
            .padding(.bottom, DSSpacing.xxl)
        }
        .scrollDismissesKeyboard(.interactively)
        .searchable(text: $vm.searchText, prompt: "Search calculators")
        .background { MeshBackground().ignoresSafeArea() }
        .navigationTitle("Calculators")
        .onAppear { vm.loadRecentlyUsed(from: modelContext) }
    }

    private var statsBar: some View {
        DSCard {
            HStack {
                statItem(value: "\(vm.statistics.active)", label: "Active")
                Divider().frame(height: 32)
                statItem(value: "\(vm.statistics.soon)", label: "Soon")
                Divider().frame(height: 32)
                statItem(value: "\(vm.statistics.categories)", label: "Categories")
                Divider().frame(height: 32)
                statItem(value: "Free", label: "Forever")
            }
        }
    }

    private func statItem(value: String, label: String) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(DSFont.heading(20))
                .foregroundStyle(DSGradient.primary)
            Text(label)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }

    private var recentlyUsedSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            Text("Recently Used")
                .font(DSFont.headingS)
                .padding(.horizontal, DSSpacing.xs)
            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack(spacing: DSSpacing.sm) {
                    ForEach(vm.recentlyUsed) { item in
                        compactCalculatorCard(item)
                            .frame(width: 180)
                    }
                }
                .padding(.horizontal, DSSpacing.xs)
            }
        }
    }

    private var searchResultsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("\(vm.filteredItems.count) results")
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
            if vm.filteredItems.isEmpty {
                ContentUnavailableView.search(text: vm.searchText)
            } else {
                LazyVGrid(columns: columns, spacing: DSSpacing.md) {
                    ForEach(vm.filteredItems) { item in
                        CalculatorCard(item: item) {
                            handleTap(item)
                        }
                    }
                }
            }
        }
    }

    private var categoriesSection: some View {
        VStack(spacing: DSSpacing.xxl) {
            ForEach(CalculatorCategory.allCases, id: \.self) { category in
                if let items = vm.groupedItems[category], !items.isEmpty {
                    categoryView(category: category, items: items)
                }
            }
        }
    }

    private func categoryView(category: CalculatorCategory, items: [CalculatorCatalogItem]) -> some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            CategoryHeaderView(category: category)
            LazyVGrid(columns: columns, spacing: DSSpacing.md) {
                ForEach(items) { item in
                    CalculatorCard(item: item) {
                        handleTap(item)
                    }
                }
            }
        }
    }

    private func compactCalculatorCard(_ item: CalculatorCatalogItem) -> some View {
        Button { handleTap(item) } label: {
            HStack(spacing: DSSpacing.xs) {
                Image(systemName: item.symbolName)
                    .foregroundStyle(DSGradient.category(item.category.gradientColors))
                VStack(alignment: .leading) {
                    Text(item.title)
                        .font(DSFont.body(13, weight: .semibold))
                        .lineLimit(1)
                }
                Spacer()
                Image(systemName: "arrow.right")
                    .foregroundStyle(DSColor.textTertiary)
            }
            .padding(DSSpacing.sm)
            .frame(maxWidth: .infinity, alignment: .leading)
            .liquidGlass()
        }
        .buttonStyle(.plain)
    }

    private func handleTap(_ item: CalculatorCatalogItem) {
        guard item.available else {
            // negative haptic
            return
        }
        vm.recordUsage(of: item.id, in: modelContext)
        if item.id == .salary {
            appState.selectedTab = .salary
        } else {
            appState.calculatorsRouter.push(.detail(item.id, params: [:]))
        }
    }
}
```

### 5.2 `CalculatorCard.swift`

```swift
import SwiftUI
import DesignSystem

struct CalculatorCard: View {
    let item: CalculatorCatalogItem
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                ZStack {
                    RoundedRectangle(cornerRadius: DSRadius.sm)
                        .fill(DSGradient.category(item.category.gradientColors))
                        .frame(width: 36, height: 36)
                    Image(systemName: item.symbolName)
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundStyle(.white)
                }
                Text(item.title)
                    .font(DSFont.body(15, weight: .semibold))
                    .foregroundStyle(item.available ? DSColor.textPrimary : DSColor.textTertiary)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                Text(item.subtitle)
                    .font(DSFont.body(12))
                    .foregroundStyle(DSColor.textSecondary)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                Spacer(minLength: 0)
                HStack {
                    Spacer()
                    if item.available {
                        Image(systemName: "arrow.right.circle.fill")
                            .foregroundStyle(DSColor.maltaGold)
                    } else {
                        Text("Soon")
                            .font(DSFont.caption)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(DSColor.warning.opacity(0.15), in: Capsule())
                            .foregroundStyle(DSColor.warning)
                    }
                }
            }
            .padding(DSSpacing.md)
            .frame(maxWidth: .infinity, minHeight: 160, alignment: .topLeading)
            .liquidGlass()
            .opacity(item.available ? 1 : 0.7)
        }
        .buttonStyle(.plain)
        .sensoryFeedback(.selection, trigger: item.id)
        .accessibilityLabel(Text(item.title))
        .accessibilityHint(Text(item.available ? "Open calculator" : "Coming soon"))
    }
}
```

### 5.3 `CategoryHeaderView.swift`

```swift
import SwiftUI
import DesignSystem

struct CategoryHeaderView: View {
    let category: CalculatorCategory

    var body: some View {
        HStack(spacing: DSSpacing.sm) {
            ZStack {
                RoundedRectangle(cornerRadius: DSRadius.md)
                    .fill(DSGradient.category(category.gradientColors))
                    .frame(width: 44, height: 44)
                Image(systemName: category.symbolName)
                    .font(.title3.weight(.semibold))
                    .foregroundStyle(.white)
            }
            Text(category.title)
                .font(DSFont.heading(20))
                .foregroundStyle(DSColor.textPrimary)
            Spacer()
        }
    }
}
```

---

## 6. Search Performance

- [ ] `searchText` debounce 150 ms (`task(id:)` modifier ile)
- [ ] String contains case-insensitive
- [ ] 28 item için linear scan yeterli, indeks gerek yok

---

## 7. Alt Adımlar

- [ ] `CalculatorID` enum + tüm raw value'lar
- [ ] `CalculatorCategory` enum + visual props
- [ ] `CalculatorCatalogItem` model + JSON
- [ ] `Resources/Content/calculators-catalog.json` yaz
- [ ] `Localizable.xcstrings` içine 29 × 2 = 58 key ekle
- [ ] `CalculatorsViewModel` (load, filter, recent, stats)
- [ ] `CalculatorsHubScreen`, `CalculatorCard`, `CategoryHeaderView`
- [ ] Recently used SwiftData binding
- [ ] Coming soon haptic + alert
- [ ] Snapshot tests

---

## 8. Localization Keys (kısaltılmış örnek)

```text
calc.salary.title = "Salary Calculator";
calc.salary.subtitle = "Net salary with tax, SSC & COLA";
calc.notice_period.title = "Notice Period";
calc.notice_period.subtitle = "Required notice based on service years";
calc.overtime.title = "Overtime Calculator";
calc.overtime.subtitle = "Overtime pay at 1.5x and 2x rates";
calc.mortgage.title = "Mortgage Calculator";
calc.mortgage.subtitle = "Home loan with 10% min deposit";
calc.stamp_duty.title = "Stamp Duty";
calc.stamp_duty.subtitle = "Property purchase stamp duty (5% / 3.5%)";
... (29 calculator × title + subtitle)
```

---

## 9. Kabul Kriterleri

- [ ] 29 item problem yaşamadan grid'de listeleniyor
- [ ] Search 150 ms debounce ile akıcı
- [ ] Coming soon item'lar tap olmuyor (negative haptic + alert)
- [ ] iPhone'da 2 kolon, iPad'de 3-4 kolon (adaptive)
- [ ] Recently used 5 ile sınırlı, LRU davranışı
- [ ] Stats footer doğru sayıları gösteriyor
- [ ] Snapshot test light + dark
- [ ] VoiceOver tüm card'lar okunabilir
- [ ] Reduce Motion açıkken hover effect kapanır

---

## 10. Sıradaki

[`08-feature-calculator-detail.md`](08-feature-calculator-detail.md)
