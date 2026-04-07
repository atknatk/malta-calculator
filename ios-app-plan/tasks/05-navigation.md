# Task 05 — Navigation & App Skeleton

> **Faz**: M3 sonu / M4 başı
> **Ön koşul**: [`02-design-system.md`](02-design-system.md) en azından tokens seviyesinde hazır
> **Çıktı**: `TabView` tabanlı navigation iskeleti; tüm feature entry point'leri placeholder ile

---

## 1. Amaç

Uygulamanın kökünde stabil, iOS 26 Liquid Glass ile uyumlu, a11y-dostu bir navigation yapısı kurmak. Feature'lar bu iskelete plug-in olur.

---

## 2. Yapı

### 2.1 RootView

```swift
struct RootView: View {
    @State private var selectedTab: RootTab = .home

    var body: some View {
        TabView(selection: $selectedTab) {
            Tab("Home", systemImage: "sparkles", value: RootTab.home) {
                HomeNavigationStack()
            }
            Tab("Salary", systemImage: "eurosign.circle", value: RootTab.salary) {
                SalaryNavigationStack()
            }
            Tab("Calculators", systemImage: "function", value: RootTab.calculators) {
                CalculatorsNavigationStack()
            }
            Tab("Guides", systemImage: "book", value: RootTab.guides) {
                GuidesNavigationStack()
            }
            Tab("Settings", systemImage: "gearshape", value: RootTab.settings) {
                SettingsNavigationStack()
            }
        }
        .tabViewStyle(.sidebarAdaptable)   // iPad + iOS 26 sidebar
        .tint(.DS.maltaGold)
        .background {
            MeshBackground().ignoresSafeArea()
        }
    }
}

enum RootTab: Hashable {
    case home, salary, calculators, guides, settings
}
```

### 2.2 Per-Feature NavigationStack

Her feature kendi `NavigationStack` + `Router` (basit `Observable`) sahibi:

```swift
@Observable
final class CalculatorsRouter {
    var path: [CalculatorsDestination] = []
}

enum CalculatorsDestination: Hashable {
    case detail(CalculatorID)
    case history
}
```

Feature kök view'i path'e göre `.navigationDestination(for:)` handler'ı ile ekranları çözer.

### 2.3 Deep Link (v1.1 hazırlığı)

- URL scheme: `maltacalc://`
- Örnek: `maltacalc://calculators/mortgage?price=300000&rate=4.5`
- v1'de parser hazır, UI'ye bağlı değil.

---

## 3. Alt Adımlar

- [ ] `App/RootView.swift` yaz
- [ ] `RootTab` enum + `AppState` (seçili tab + router'lar sahipliği)
- [ ] Her feature için boş `NavigationStack` + `ContentUnavailableView` ile placeholder
- [ ] `MeshBackground`'u `DesignSystem`'den kullan
- [ ] Launch → `.home` seçili geliyor
- [ ] iPad'de sidebar, iPhone'da tab bar doğru render
- [ ] `.tint` Malta gold uygulanmış

---

## 4. A11y

- [ ] Her tab `.accessibilityLabel`
- [ ] `.accessibilityHint` ile kısa açıklama
- [ ] Dinamik font ile tab bar etiketleri kırılmıyor

---

## 5. Kabul Kriterleri

- [ ] Uygulama 5 tab ile açılıyor
- [ ] iPad'de sidebar-adaptable davranışı doğru
- [ ] Tab değiştirmede animasyon akıcı
- [ ] VoiceOver tab adlarını doğru okuyor
- [ ] iOS 18 fallback: TabView tint'i ve glass bar doğru

---

## 6. Sıradaki

[`06-feature-salary.md`](06-feature-salary.md)
