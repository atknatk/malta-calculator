# Task 12 — Settings & Localization

> **Faz**: M7 / M8
> **Ön koşul**: Persistence (Task 10) hazır
> **Çıktı**: Settings ekranı + String Catalog ile EN-only lokalizasyon iskeleti

---

## 1. Amaç

Kullanıcı tercihlerini yönetmek, uygulama bilgilerini göstermek, v1.1 için lokalizasyon iskeletini hazırlamak.

---

## 2. Settings Ekran Hiyerarşisi

```text
SettingsScreen (Form)
├── Section: Appearance
│   ├── Theme Picker (System / Light / Dark)
│   ├── Reduce Motion (Override)
│   └── Font Size (S / M / L / XL slider)
├── Section: Defaults
│   ├── Default Year Picker (2020-2026)
│   ├── Currency (EUR readonly v1)
│   └── Default Tax Type (Single / Married / Parent)
├── Section: Sync & Data
│   ├── iCloud Sync (toggle, restart required)
│   ├── Saved Calculations Count (read-only)
│   ├── Bookmarked Guides Count (read-only)
│   ├── Storage Used (read-only, formatted)
│   ├── Export All Data (button → JSON share sheet)
│   ├── Clear History (destructive button)
│   └── Clear Bookmarks (destructive button)
├── Section: Notifications (v1.1 hidden)
│   └── Tax year updates (toggle)
├── Section: Privacy
│   ├── Analytics (toggle, default off)
│   ├── Crash Reports (toggle, default off)
│   ├── Privacy Policy (link)
│   └── Terms of Service (link)
├── Section: Tax Data
│   ├── Tax Config Version (read-only)
│   ├── Last Updated (date)
│   ├── Source: Malta CFR (link)
│   ├── Source: Social Security Department (link)
│   └── Disclaimer (push to detail)
├── Section: Help & Feedback
│   ├── Frequently Asked Questions
│   ├── Contact Support (mailto)
│   ├── Suggest a Feature (mailto)
│   ├── Report a Bug (mailto)
│   └── Rate on App Store (StoreKit)
├── Section: About
│   ├── App Version + Build
│   ├── What's New (link to release notes)
│   ├── Acknowledgements
│   ├── Open Source Licenses
│   └── Made in Malta ❤️
```

---

## 3. SettingsViewModel

```swift
import Foundation
import Observation
import StoreKit
import SwiftData

@Observable
@MainActor
final class SettingsViewModel {
    let preferencesStore: UserPreferencesStore
    let calculationsStore: SavedCalculationStore
    let modelContext: ModelContext

    var showingClearHistoryAlert: Bool = false
    var showingClearBookmarksAlert: Bool = false
    var showingICloudRestartAlert: Bool = false
    var showingExportSheet: Bool = false
    var exportedData: Data?

    init(modelContext: ModelContext) {
        self.modelContext = modelContext
        self.preferencesStore = UserPreferencesStore(context: modelContext)
        self.calculationsStore = SavedCalculationStore(context: modelContext)
    }

    var savedCount: Int { calculationsStore.items.count }

    var bookmarkedCount: Int {
        let descriptor = FetchDescriptor<GuideBookmark>()
        return (try? modelContext.fetch(descriptor).count) ?? 0
    }

    var storageUsed: String {
        let bytes = (try? modelContext.container.configurations.first?.url?.fileSize()) ?? 0
        return ByteCountFormatter().string(fromByteCount: Int64(bytes))
    }

    var appVersion: String {
        let info = Bundle.main.infoDictionary ?? [:]
        let version = info["CFBundleShortVersionString"] as? String ?? "?"
        let build = info["CFBundleVersion"] as? String ?? "?"
        return "\(version) (\(build))"
    }

    var taxConfigVersion: String {
        preferencesStore.preferences.taxConfigVersion ?? "2026.1"
    }

    func clearHistory() {
        try? calculationsStore.deleteAll()
    }

    func clearBookmarks() {
        let descriptor = FetchDescriptor<GuideBookmark>()
        guard let bookmarks = try? modelContext.fetch(descriptor) else { return }
        for bookmark in bookmarks {
            modelContext.delete(bookmark)
        }
        try? modelContext.save()
    }

    func exportAllData() {
        let exporter = ExportService(context: modelContext)
        exportedData = try? exporter.exportAllCalculations()
        showingExportSheet = exportedData != nil
    }

    func requestReview() {
        if let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene {
            SKStoreReviewController.requestReview(in: scene)
        }
    }
}

extension URL {
    func fileSize() -> Int? {
        try? FileManager.default.attributesOfItem(atPath: self.path)[.size] as? Int
    }
}
```

---

## 4. Settings Screen

### 4.1 `SettingsScreen.swift`

```swift
import SwiftUI
import DesignSystem
import StoreKit
import SwiftData

struct SettingsScreen: View {
    @State private var vm: SettingsViewModel?
    @Environment(\.modelContext) private var modelContext
    @Environment(\.requestReview) private var requestReview

    var body: some View {
        Form {
            if let vm {
                appearanceSection(vm)
                defaultsSection(vm)
                syncDataSection(vm)
                privacySection(vm)
                taxDataSection(vm)
                helpSection(vm)
                aboutSection(vm)
            }
        }
        .scrollContentBackground(.hidden)
        .background { MeshBackground().ignoresSafeArea() }
        .navigationTitle("Settings")
        .onAppear {
            if vm == nil {
                vm = SettingsViewModel(modelContext: modelContext)
            }
        }
        .alert("Clear History?", isPresented: bindingAlertHistory) {
            Button("Cancel", role: .cancel) {}
            Button("Clear All", role: .destructive) { vm?.clearHistory() }
        } message: {
            Text("This will permanently remove all saved calculations from this device. This cannot be undone.")
        }
        .alert("Restart Required", isPresented: bindingAlertICloud) {
            Button("OK") {}
        } message: {
            Text("Please quit and reopen the app for iCloud sync changes to take effect.")
        }
    }

    private var bindingAlertHistory: Binding<Bool> {
        Binding(
            get: { vm?.showingClearHistoryAlert ?? false },
            set: { vm?.showingClearHistoryAlert = $0 }
        )
    }

    private var bindingAlertICloud: Binding<Bool> {
        Binding(
            get: { vm?.showingICloudRestartAlert ?? false },
            set: { vm?.showingICloudRestartAlert = $0 }
        )
    }

    @ViewBuilder
    private func appearanceSection(_ vm: SettingsViewModel) -> some View {
        Section("Appearance") {
            Picker("Theme", selection: Binding(
                get: { vm.preferencesStore.theme },
                set: { vm.preferencesStore.theme = $0 }
            )) {
                ForEach(AppTheme.allCases, id: \.self) { theme in
                    Text(theme.title).tag(theme)
                }
            }

            Toggle("Reduce Motion", isOn: .constant(false))
                .disabled(true)
                .foregroundStyle(.secondary)
        }
    }

    @ViewBuilder
    private func defaultsSection(_ vm: SettingsViewModel) -> some View {
        Section("Defaults") {
            Picker("Default Year", selection: Binding(
                get: { vm.preferencesStore.preferences.defaultYear },
                set: { vm.preferencesStore.preferences.defaultYear = $0 }
            )) {
                ForEach(2020...2026, id: \.self) { year in
                    Text(String(year)).tag(year)
                }
            }

            HStack {
                Text("Currency")
                Spacer()
                Text("EUR (€)")
                    .foregroundStyle(.secondary)
            }
        }
    }

    @ViewBuilder
    private func syncDataSection(_ vm: SettingsViewModel) -> some View {
        Section("Sync & Data") {
            Toggle("iCloud Sync", isOn: Binding(
                get: { vm.preferencesStore.preferences.iCloudSyncEnabled },
                set: {
                    vm.preferencesStore.preferences.iCloudSyncEnabled = $0
                    vm.showingICloudRestartAlert = true
                }
            ))

            HStack {
                Label("Saved Calculations", systemImage: "bookmark.fill")
                Spacer()
                Text("\(vm.savedCount)").foregroundStyle(.secondary)
            }

            HStack {
                Label("Bookmarked Guides", systemImage: "book.fill")
                Spacer()
                Text("\(vm.bookmarkedCount)").foregroundStyle(.secondary)
            }

            Button {
                vm.exportAllData()
            } label: {
                Label("Export All Data", systemImage: "square.and.arrow.up")
            }

            Button(role: .destructive) {
                vm.showingClearHistoryAlert = true
            } label: {
                Label("Clear History", systemImage: "trash")
            }
        }
    }

    @ViewBuilder
    private func privacySection(_ vm: SettingsViewModel) -> some View {
        Section("Privacy") {
            Toggle("Analytics", isOn: .constant(false)).disabled(true)
            Toggle("Crash Reports", isOn: .constant(false)).disabled(true)
            Link(destination: URL(string: "https://maltacalculator.com/privacy")!) {
                Label("Privacy Policy", systemImage: "hand.raised.fill")
            }
            Link(destination: URL(string: "https://maltacalculator.com/terms")!) {
                Label("Terms of Service", systemImage: "doc.text")
            }
        }
    }

    @ViewBuilder
    private func taxDataSection(_ vm: SettingsViewModel) -> some View {
        Section("Tax Data") {
            HStack {
                Text("Config Version")
                Spacer()
                Text(vm.taxConfigVersion).foregroundStyle(.secondary).monospacedDigit()
            }
            Link(destination: URL(string: "https://cfr.gov.mt")!) {
                Label("Malta CFR", systemImage: "link")
            }
            Link(destination: URL(string: "https://socialsecurity.gov.mt")!) {
                Label("Social Security Department", systemImage: "link")
            }
            NavigationLink {
                DisclaimerScreen()
            } label: {
                Label("Disclaimer", systemImage: "info.circle")
            }
        }
    }

    @ViewBuilder
    private func helpSection(_ vm: SettingsViewModel) -> some View {
        Section("Help & Feedback") {
            Link(destination: URL(string: "mailto:support@maltacalculator.com")!) {
                Label("Contact Support", systemImage: "envelope.fill")
            }
            Link(destination: URL(string: "mailto:feedback@maltacalculator.com?subject=Feature%20Request")!) {
                Label("Suggest a Feature", systemImage: "lightbulb.fill")
            }
            Link(destination: URL(string: "mailto:bugs@maltacalculator.com?subject=Bug%20Report")!) {
                Label("Report a Bug", systemImage: "ant.fill")
            }
            Button {
                requestReview()
            } label: {
                Label("Rate on App Store", systemImage: "star.fill")
            }
        }
    }

    @ViewBuilder
    private func aboutSection(_ vm: SettingsViewModel) -> some View {
        Section("About") {
            HStack {
                Text("Version")
                Spacer()
                Text(vm.appVersion).foregroundStyle(.secondary).monospacedDigit()
            }
            NavigationLink("What's New", destination: WhatsNewScreen())
            NavigationLink("Acknowledgements", destination: AcknowledgementsScreen())
            HStack {
                Spacer()
                Text("Made in Malta")
                Image(systemName: "heart.fill").foregroundStyle(.red)
                Spacer()
            }
            .font(.caption)
        }
    }
}

extension AppTheme {
    var title: LocalizedStringResource {
        switch self {
        case .system: return "System"
        case .light: return "Light"
        case .dark: return "Dark"
        }
    }
}
```

### 4.2 `DisclaimerScreen.swift`

```swift
struct DisclaimerScreen: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DSSpacing.lg) {
                Text("Disclaimer")
                    .font(DSFont.heading(28))

                Text("""
                Malta Calculator provides financial calculations for informational and educational purposes only. \
                The values calculated are estimates based on publicly available data from Malta CFR and the Social Security Department.

                **Not Tax Advice**
                This application does not constitute professional tax, legal, or financial advice. Individual circumstances may affect actual amounts owed or received.

                **Accuracy**
                We strive to keep the tax data current. However, regulations change frequently. Always verify with official sources before making financial decisions:
                • Malta CFR: cfr.gov.mt
                • Social Security: socialsecurity.gov.mt

                **Consult a Professional**
                For binding tax advice, payroll administration, or legal matters, please consult a licensed Maltese accountant, tax advisor, or lawyer.
                """)
                .font(DSFont.body())
                .foregroundStyle(DSColor.textPrimary)
            }
            .padding(DSSpacing.lg)
        }
        .background { MeshBackground().ignoresSafeArea() }
        .navigationTitle("Disclaimer")
        .navigationBarTitleDisplayMode(.inline)
    }
}
```

---

## 5. Localization — String Catalog

### 5.1 `Localizable.xcstrings` Yapısı

Xcode 15+ String Catalog ile tek dosyada tüm string'ler. Yapı:

```json
{
  "sourceLanguage": "en",
  "strings": {
    "calc.salary.title": {
      "comment": "Salary calculator title in catalog",
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Salary Calculator"
          }
        }
      }
    },
    "calc.salary.subtitle": {
      "extractionState": "manual",
      "localizations": {
        "en": {
          "stringUnit": {
            "state": "translated",
            "value": "Net salary with tax, SSC & COLA"
          }
        }
      }
    }
  },
  "version": "1.0"
}
```

### 5.2 Key Naming Convention

```text
calc.{id}.title
calc.{id}.subtitle
calc.{id}.description
calc.{id}.info.{key}

settings.section.{name}
settings.action.{name}
settings.message.{name}

guide.category.{name}
guide.action.{name}

common.button.{action}
common.label.{name}
common.error.{type}
common.unit.{name}

a11y.{feature}.{element}
```

### 5.3 String Sayısı Tahmini (v1)

| Bölüm                         | Adet     |
| ----------------------------- | -------- |
| Calculator titles + subtitles | 58       |
| Calculator info text          | ~120     |
| Settings labels               | ~60      |
| Common UI (buttons, labels)   | ~80      |
| Salary feature specific       | ~40      |
| Guides feature                | ~30      |
| Errors                        | ~20      |
| A11y labels                   | ~80      |
| **Toplam (v1 EN-only)**       | **~488** |

### 5.4 Pluralization

```json
{
  "guide.reading_time": {
    "localizations": {
      "en": {
        "variations": {
          "plural": {
            "one": {
              "stringUnit": {
                "state": "translated",
                "value": "%lld minute read"
              }
            },
            "other": {
              "stringUnit": {
                "state": "translated",
                "value": "%lld minutes read"
              }
            }
          }
        }
      }
    }
  }
}
```

Kullanım:

```swift
Text("guide.reading_time \(guide.readingMinutes)")
```

---

## 6. Disclaimer Metni (Tam EN)

> Malta Calculator provides financial calculations for informational and educational purposes only. The values calculated are estimates based on publicly available data from Malta CFR (Commissioner for Tax and Customs) and the Social Security Department.
>
> This application does not constitute professional tax, legal, or financial advice. Individual circumstances may affect actual amounts owed or received. We strive to keep the tax data current; however, regulations change frequently.
>
> Always verify with official sources before making financial decisions:
>
> - Malta CFR: cfr.gov.mt
> - Social Security: socialsecurity.gov.mt
>
> For binding tax advice, payroll administration, or legal matters, please consult a licensed Maltese accountant, tax advisor, or lawyer.

---

## 7. v1.1 Lokalizasyon Hedef Dilleri

| Dil     | Code | Öncelik | Notlar                                   |
| ------- | ---- | ------- | ---------------------------------------- |
| English | `en` | v1      | Default                                  |
| Maltese | `mt` | v1.1    | Yerli dil, Apple translation desteği iyi |
| Italian | `it` | v1.1    | Malta'da yaygın                          |
| Turkish | `tr` | v1.1    | Türk topluluğu                           |

Strateji: v1'de tüm string'ler `Localizable.xcstrings`'te EN olarak. v1.1'de Apple Translate veya manuel ile diğer diller eklenir.

---

## 8. Alt Adımlar

- [ ] `SettingsViewModel` yaz
- [ ] `SettingsScreen` Form ile
- [ ] `DisclaimerScreen`
- [ ] `WhatsNewScreen` (sürüm notları)
- [ ] `AcknowledgementsScreen` (üçüncü parti lisanslar)
- [ ] `Localizable.xcstrings` oluştur
- [ ] Tüm user-facing string'leri `LocalizedStringResource` ile çağır
- [ ] Theme switch tüm uygulamaya uygulanır (`@Environment(\.colorScheme)` override veya `preferredColorScheme`)
- [ ] iCloud toggle alert akışı
- [ ] Export to JSON share sheet
- [ ] StoreKit RequestReview entegrasyonu
- [ ] Snapshot test light + dark
- [ ] A11y audit

---

## 9. Theme Application

```swift
@main
struct MaltaCalculatorApp: App {
    @AppStorage("themeRaw") private var themeRaw: String = "system"

    private var theme: AppTheme {
        AppTheme(rawValue: themeRaw) ?? .system
    }

    var body: some Scene {
        WindowGroup {
            RootView()
                .preferredColorScheme(theme.colorScheme)
        }
        .modelContainer(container)
    }
}
```

Settings'ten değişim → `@AppStorage` → app-wide effect anında.

---

## 10. Kabul Kriterleri

- [ ] Settings içindeki tüm toggle/picker'lar persist ediyor
- [ ] Theme switch anlık uygulanıyor (no restart)
- [ ] iCloud toggle restart alert gösteriyor
- [ ] Export all data JSON dosya üretiyor
- [ ] Clear history confirm alert + delete çalışıyor
- [ ] StoreKit RequestReview tetikleniyor
- [ ] Localization: en-US sistemde doğru görüntü
- [ ] v1.1'de dil eklediğimizde kod değişikliği gerekmeyecek
- [ ] Tax config version, app version, build no doğru görüntüleniyor
- [ ] Storage Used değeri makul (< 5 MB başlangıçta)
- [ ] Snapshot test light + dark

---

## 11. Sıradaki

[`13-testing.md`](13-testing.md)
