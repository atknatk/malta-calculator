# Task 05 — Navigation & App Skeleton

> **Faz**: M3 sonu / M4 başı
> **Ön koşul**: [`02-design-system.md`](02-design-system.md) tokens + materials hazır
> **Çıktı**: TabView iskelet, per-tab NavigationStack, router pattern, deep link parser

---

## 1. Amaç

Uygulamanın kökünde stabil, iOS 26 Liquid Glass ile uyumlu, a11y-dostu bir navigation yapısı kurmak. Feature'lar bu iskelete plug-in olur.

---

## 2. Üst Seviye Mimari

```text
RootView (TabView)
├── HomeNavigationStack
│   └── HomeScreen
├── SalaryNavigationStack
│   ├── SalaryScreen
│   └── SalaryHistoryScreen
├── CalculatorsNavigationStack
│   ├── CalculatorsHubScreen
│   ├── CalculatorDetailScreen(id)
│   └── CalculatorHistoryScreen
├── GuidesNavigationStack
│   ├── GuidesListScreen
│   ├── GuideReaderScreen(slug)
│   └── GuideBookmarksScreen
└── SettingsNavigationStack
    ├── SettingsScreen
    ├── AboutScreen
    ├── DisclaimerScreen
    └── AcknowledgementsScreen
```

---

## 3. Root State (`AppState.swift`)

```swift
import SwiftUI
import Observation

@Observable
final class AppState {
    var selectedTab: RootTab = .home

    // Per-tab routers
    let homeRouter = HomeRouter()
    let salaryRouter = SalaryRouter()
    let calculatorsRouter = CalculatorsRouter()
    let guidesRouter = GuidesRouter()
    let settingsRouter = SettingsRouter()

    // Deep link parser
    let deepLinkParser = DeepLinkParser()

    func handle(url: URL) {
        guard let destination = deepLinkParser.parse(url) else { return }
        route(to: destination)
    }

    private func route(to destination: DeepLinkDestination) {
        switch destination {
        case .calculator(let id, let params):
            selectedTab = .calculators
            calculatorsRouter.push(.detail(id, params: params))
        case .salary(let params):
            selectedTab = .salary
            salaryRouter.reset(with: params)
        case .guide(let slug):
            selectedTab = .guides
            guidesRouter.push(.reader(slug))
        case .settings:
            selectedTab = .settings
        }
    }
}

enum RootTab: Hashable, CaseIterable, Identifiable {
    case home, salary, calculators, guides, settings

    var id: Self { self }

    var title: LocalizedStringResource {
        switch self {
        case .home: return "Home"
        case .salary: return "Salary"
        case .calculators: return "Calculators"
        case .guides: return "Guides"
        case .settings: return "Settings"
        }
    }

    var systemImage: String {
        switch self {
        case .home: return "sparkles"
        case .salary: return "eurosign.circle.fill"
        case .calculators: return "function"
        case .guides: return "book.fill"
        case .settings: return "gearshape.fill"
        }
    }
}
```

---

## 4. `RootView`

```swift
import SwiftUI
import DesignSystem

struct RootView: View {
    @State private var appState = AppState()

    var body: some View {
        TabView(selection: $appState.selectedTab) {
            ForEach(RootTab.allCases) { tab in
                tabContent(for: tab)
                    .tabItem {
                        Label(tab.title, systemImage: tab.systemImage)
                    }
                    .tag(tab)
            }
        }
        .tabViewStyle(.sidebarAdaptable)
        .tint(.accentColor)
        .environment(appState)
        .background {
            MeshBackground().ignoresSafeArea()
        }
        .onOpenURL { url in
            appState.handle(url: url)
        }
    }

    @ViewBuilder
    private func tabContent(for tab: RootTab) -> some View {
        switch tab {
        case .home:
            HomeNavigationStack()
        case .salary:
            SalaryNavigationStack()
        case .calculators:
            CalculatorsNavigationStack()
        case .guides:
            GuidesNavigationStack()
        case .settings:
            SettingsNavigationStack()
        }
    }
}

#Preview { RootView() }
```

---

## 5. Per-Feature Router Pattern

Her feature kendi router'ını tutar. Router = `@Observable` class + `NavigationPath`.

### 5.1 Örnek — `CalculatorsRouter.swift`

```swift
import SwiftUI
import Observation

@Observable
final class CalculatorsRouter {
    var path = NavigationPath()

    func push(_ destination: CalculatorsDestination) {
        path.append(destination)
    }

    func pop() {
        guard !path.isEmpty else { return }
        path.removeLast()
    }

    func popToRoot() {
        path.removeLast(path.count)
    }

    func reset() {
        path = NavigationPath()
    }
}

enum CalculatorsDestination: Hashable {
    case detail(CalculatorID, params: [String: String] = [:])
    case history
    case savedDetail(UUID)
}
```

### 5.2 `CalculatorsNavigationStack.swift`

```swift
import SwiftUI

struct CalculatorsNavigationStack: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        @Bindable var router = appState.calculatorsRouter

        NavigationStack(path: $router.path) {
            CalculatorsHubScreen()
                .navigationDestination(for: CalculatorsDestination.self) { destination in
                    destinationView(for: destination)
                }
        }
    }

    @ViewBuilder
    private func destinationView(for destination: CalculatorsDestination) -> some View {
        switch destination {
        case .detail(let id, let params):
            CalculatorDetailFactory.view(for: id, initialParams: params)
        case .history:
            CalculatorHistoryScreen()
        case .savedDetail(let uuid):
            SavedCalculationDetailScreen(id: uuid)
        }
    }
}
```

### 5.3 `CalculatorDetailFactory.swift`

```swift
import SwiftUI

enum CalculatorDetailFactory {
    @ViewBuilder
    static func view(for id: CalculatorID, initialParams: [String: String] = [:]) -> some View {
        switch id {
        case .mortgage: MortgageScreen(initialParams: initialParams)
        case .personalLoan: PersonalLoanScreen(initialParams: initialParams)
        case .stampDuty: StampDutyScreen(initialParams: initialParams)
        case .savingsInterest: SavingsScreen(initialParams: initialParams)
        case .pension: PensionScreen(initialParams: initialParams)
        case .retirementAge: RetirementAgeScreen(initialParams: initialParams)
        case .overtime: OvertimeScreen(initialParams: initialParams)
        case .vacation: VacationScreen(initialParams: initialParams)
        case .noticePeriod: NoticePeriodScreen(initialParams: initialParams)
        case .childrensAllowance: ChildrensAllowanceScreen(initialParams: initialParams)
        case .familyReunification: FamilyReunificationScreen(initialParams: initialParams)
        case .vehicleRegistrationFee: VehicleRegistrationFeeScreen(initialParams: initialParams)
        case .vehicleRegistrationTax: VehicleRegistrationTaxScreen(initialParams: initialParams)
        case .roadLicense: RoadLicenseScreen(initialParams: initialParams)
        case .driversLicense: DriversLicenseScreen(initialParams: initialParams)
        case .vrt: VRTScreen(initialParams: initialParams)
        case .importVehicle: ImportVehicleScreen(initialParams: initialParams)
        case .salary: EmptyView()  // handled by Salary tab
        default: ComingSoonScreen(id: id)
        }
    }
}
```

Diğer router'lar aynı pattern'i izler: `HomeRouter`, `SalaryRouter`, `GuidesRouter`, `SettingsRouter`.

---

## 6. Deep Link Parser

### 6.1 URL Şeması

- `maltacalc://calculators/{id}?{params}` — örn: `maltacalc://calculators/mortgage?price=300000&rate=4.5&term=25`
- `maltacalc://salary?gross=30000&year=2026&type=single`
- `maltacalc://guides/{slug}` — örn: `maltacalc://guides/malta-mortgage-guide-2026`
- `maltacalc://settings`

Universal Links (v1.1): `https://maltacalculator.com/app/...`

### 6.2 `DeepLinkDestination.swift`

```swift
enum DeepLinkDestination: Hashable {
    case calculator(CalculatorID, params: [String: String])
    case salary(params: [String: String])
    case guide(slug: String)
    case settings
}
```

### 6.3 `DeepLinkParser.swift`

```swift
import Foundation

struct DeepLinkParser {
    func parse(_ url: URL) -> DeepLinkDestination? {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return nil
        }

        let scheme = components.scheme?.lowercased()
        guard scheme == "maltacalc" || scheme == "https" else { return nil }

        // For universal links, strip /app prefix
        var pathComponents = components.path.split(separator: "/").map(String.init)
        if scheme == "https", pathComponents.first == "app" {
            pathComponents.removeFirst()
        }

        // host-based routing for custom scheme
        let host = components.host ?? pathComponents.first ?? ""
        let segments = scheme == "maltacalc"
            ? pathComponents
            : Array(pathComponents.dropFirst())

        let params = Dictionary(
            uniqueKeysWithValues: (components.queryItems ?? [])
                .compactMap { item -> (String, String)? in
                    guard let value = item.value else { return nil }
                    return (item.name, value)
                }
        )

        switch host {
        case "calculators":
            guard let idRaw = segments.first,
                  let id = CalculatorID(rawValue: idRaw)
            else { return nil }
            return .calculator(id, params: params)

        case "salary":
            return .salary(params: params)

        case "guides":
            guard let slug = segments.first else { return nil }
            return .guide(slug: slug)

        case "settings":
            return .settings

        default:
            return nil
        }
    }
}
```

### 6.4 Unit Tests

```swift
import Testing
@testable import MaltaCalculator

@Suite("DeepLinkParser")
struct DeepLinkParserTests {
    let parser = DeepLinkParser()

    @Test("parses calculator mortgage link")
    func calculatorMortgage() throws {
        let url = URL(string: "maltacalc://calculators/mortgage?price=300000&rate=4.5")!
        let destination = try #require(parser.parse(url))
        #expect(destination == .calculator(.mortgage, params: ["price": "300000", "rate": "4.5"]))
    }

    @Test("parses salary link")
    func salary() throws {
        let url = URL(string: "maltacalc://salary?gross=30000&year=2026")!
        let destination = try #require(parser.parse(url))
        if case .salary(let params) = destination {
            #expect(params["gross"] == "30000")
            #expect(params["year"] == "2026")
        } else {
            Issue.record("Expected .salary destination")
        }
    }

    @Test("parses guide link")
    func guide() throws {
        let url = URL(string: "maltacalc://guides/malta-mortgage-guide-2026")!
        let destination = try #require(parser.parse(url))
        #expect(destination == .guide(slug: "malta-mortgage-guide-2026"))
    }

    @Test("ignores unknown scheme")
    func unknownScheme() {
        let url = URL(string: "ftp://maltacalc/salary")!
        #expect(parser.parse(url) == nil)
    }
}
```

---

## 7. Tab Bar Liquid Glass (iOS 26)

iOS 26'da `TabView` otomatik olarak floating glass bar kullanır. Ekstra bir şey yapmaya gerek yok. Ancak:

- [ ] `.tint(.accentColor)` ile Malta gold'a ayarla
- [ ] `.toolbarBackground(.automatic, for: .tabBar)` fallback için
- [ ] iPad'de `.sidebarAdaptable` sidebar-tabbar geçişi

Fallback (iOS 18) için ek görsel iyileştirme gerekirse `UITabBarAppearance` UIKit tarafından kurulur (AppDelegate benzeri yer). Bu minimum olsun.

---

## 8. Placeholder Ekranlar

Feature'lar yazılmadan önce her tab için `ContentUnavailableView` placeholder:

```swift
struct ComingSoonScreen: View {
    let id: CalculatorID?

    init(id: CalculatorID? = nil) { self.id = id }

    var body: some View {
        ContentUnavailableView(
            "Coming Soon",
            systemImage: "hourglass.circle.fill",
            description: Text("This feature is under development.")
        )
        .foregroundStyle(.tint)
    }
}
```

---

## 9. Alt Adımlar

- [ ] `AppState` ve `RootTab` enum
- [ ] `RootView` TabView
- [ ] 5 adet `XxxRouter` (`@Observable`)
- [ ] 5 adet `XxxNavigationStack` view
- [ ] 5 adet placeholder `XxxHubScreen` / `XxxScreen`
- [ ] `DeepLinkDestination` enum
- [ ] `DeepLinkParser` + testleri
- [ ] `CalculatorDetailFactory` (feature'lar geldikçe doldurulur)
- [ ] `onOpenURL` handler
- [ ] `Info.plist` → `CFBundleURLTypes` ekle:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>com.maltacalculator.app</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>maltacalc</string>
    </array>
  </dict>
</array>
```

---

## 10. A11y

- [ ] Her tab için `accessibilityLabel` — `tab.title` otomatik, ama manuel de verilebilir
- [ ] `accessibilityHint`: "Opens salary calculator" vb.
- [ ] Dinamik font ile tab bar etiketleri kırılmıyor (iOS 26 otomatik)
- [ ] VoiceOver "double tap to activate" cue doğru

---

## 11. Kabul Kriterleri

- [ ] 5 tab açılıyor, tab değiştirmede animasyon akıcı
- [ ] iPad'de sidebar-adaptable davranışı doğru
- [ ] iPhone'da alt tab bar Liquid Glass floating görünümde
- [ ] Per-tab router state korunuyor (tab değiştirip dönmede stack aynı)
- [ ] Deep link `maltacalc://salary?gross=30000` çalışıyor
- [ ] Deep link `maltacalc://calculators/mortgage?price=300000` çalışıyor
- [ ] VoiceOver tab adlarını doğru okuyor
- [ ] iOS 18 fallback: TabView tint'i ve glass bar doğru
- [ ] Unit test coverage (parser) %100

---

## 12. Sıradaki

[`06-feature-salary.md`](06-feature-salary.md)
