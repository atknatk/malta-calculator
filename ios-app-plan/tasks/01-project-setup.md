# Task 01 — Xcode Project & Workspace Setup

> **Faz**: M1
> **Ön koşul**: [`00-pre-study.md`](00-pre-study.md) onaylandı, açık sorular kapandı
> **Çıktı**: Derlenebilir, TestFlight'a submit edilebilir iskelet app

---

## 1. Amaç

Uzun vadeli modüler bir yapı kurmak için Xcode workspace + local SPM paketleri kurmak, kod stili araçlarını bağlamak ve temel CI hattını kurmak.

---

## 2. Alt Adımlar

### 2.1 Xcode Project Oluştur

- [ ] Xcode 26 ile **App** şablonu → `MaltaCalculator`
- [ ] Interface: **SwiftUI**, Language: **Swift**, Storage: **SwiftData** (ileride kullanmak üzere default açık)
- [ ] Bundle ID: `com.maltacalculator.app` (kullanıcı teyit ettikten sonra)
- [ ] Organization: Malta Calculator
- [ ] Minimum iOS: **18.0** (26.0 optimum)
- [ ] Device family: iPhone + iPad

### 2.2 Workspace'i Yapılandır

- [ ] `MaltaCalculator.xcworkspace` oluştur
- [ ] Project'i workspace'e ekle
- [ ] Klasör düzeni (Finder + project navigator ayni):

```
MaltaCalculator/
├── MaltaCalculator.xcworkspace
├── MaltaCalculator.xcodeproj
├── MaltaCalculator/          # app target sources
│   ├── App/
│   │   └── MaltaCalculatorApp.swift
│   ├── Features/             # (Home, Salary, Calculators, Guides, Settings)
│   ├── Resources/
│   │   ├── Assets.xcassets
│   │   ├── Localizable.xcstrings
│   │   └── Content/          # JSON + Markdown bundled
│   └── Info.plist
├── Packages/
│   ├── CalculationKit/
│   │   ├── Package.swift
│   │   ├── Sources/CalculationKit/
│   │   └── Tests/CalculationKitTests/
│   └── DesignSystem/
│       ├── Package.swift
│       ├── Sources/DesignSystem/
│       └── Tests/DesignSystemTests/
├── Tools/
│   ├── .swiftlint.yml
│   ├── .swiftformat
│   └── scripts/
├── Tests/
│   ├── MaltaCalculatorTests/
│   └── MaltaCalculatorUITests/
└── .github/workflows/ios.yml
```

### 2.3 Local SPM Paketleri

- [ ] `Packages/CalculationKit/Package.swift` oluştur (iOS 17+ platform, Swift 6)
- [ ] `Packages/DesignSystem/Package.swift` oluştur (iOS 18+ platform, Swift 6)
- [ ] Xcode'da File → Add Package Dependencies → Add Local → her ikisi de app target'a linkle
- [ ] Boş bir `public func ping() -> String` fonksiyonu ile her paketin import'u çalışıyor teyit et

### 2.4 3rd Party SPM Dependencies

Yalnızca şart olanları ekle:

- [ ] `swift-markdown-ui` (https://github.com/gonzalezreal/swift-markdown-ui) → `DesignSystem` paketine
- [ ] `swift-collections` (opsiyonel, `OrderedDictionary` için)

SwiftLint ve SwiftFormat **SPM dependency olarak değil**, build tool olarak (Mint / Homebrew) kurulur.

### 2.5 Kod Kalite Araçları

- [ ] `Tools/.swiftlint.yml` — aşağıdaki minimum kurallar:
  - `line_length: 120`
  - `force_unwrapping: error`
  - `type_body_length: 400`
  - `file_length: 500`
  - `identifier_name: min 2`
  - excluded: `Packages/*/.build`, `DerivedData`
- [ ] `Tools/.swiftformat` — Swift 6 uyumlu temel ayarlar
- [ ] `Tools/scripts/lint.sh` — local ve CI için tek giriş
- [ ] Build phase: "Run Script" olarak SwiftLint + SwiftFormat çağrısı (sadece debug)

### 2.6 Code Signing & Capabilities

- [ ] Automatic signing, development team seçilir
- [ ] Capabilities:
  - iCloud (CloudKit) — v1'de kapalı, v1.1'de açılacak
  - Background Modes — kapalı
  - App Groups — kapalı (tek target)

### 2.7 Uygulama Meta Ayarları

- [ ] `Info.plist`:
  - `CFBundleDisplayName = Malta Calculator`
  - `ITSAppUsesNonExemptEncryption = false`
  - `UISupportedInterfaceOrientations~ipad` = all 4
  - `UISupportedInterfaceOrientations~iphone` = portrait + upside down kapalı
- [ ] Launch screen: blank (SwiftUI `@main` LaunchScreen yok, system gradient kullanılacak)
- [ ] App icon placeholder (`Assets.xcassets/AppIcon.appiconset`) — Malta gold bg, beyaz calculator glyph

### 2.8 İlk `App` Girişi

- [ ] `MaltaCalculatorApp.swift`:
  ```swift
  @main
  struct MaltaCalculatorApp: App {
      var body: some Scene {
          WindowGroup {
              RootView()
          }
      }
  }
  ```
- [ ] `RootView` — placeholder `Text("Malta Calculator")` with `liquidGlass()` background

### 2.9 CI (GitHub Actions)

- [ ] `.github/workflows/ios.yml`:
  - macOS 15 runner
  - Xcode 26 selected
  - SwiftLint via `mint`
  - Build `xcodebuild -workspace MaltaCalculator.xcworkspace -scheme MaltaCalculator -destination 'platform=iOS Simulator,name=iPhone 16 Pro'`
  - Test aynı komut `test` ile
  - Artifact: derived `.ipa` (opt-in, sadece `main` push'ta)

### 2.10 Fastlane (Opsiyonel ama Önerilen)

- [ ] `fastlane init` — app store connect app id teyit
- [ ] Lane'ler:
  - `fastlane lint` — SwiftLint + format check
  - `fastlane test` — unit + UI test
  - `fastlane beta` — TestFlight'a match + pilot
- [ ] Match (cert yönetimi) — private repo ile, v1'den itibaren

---

## 3. Kabul Kriterleri

- [ ] `xcodebuild` simulator üzerinde sıfır hata ile derliyor
- [ ] SwiftLint 0 error, 0 warning
- [ ] `CalculationKit` ve `DesignSystem` paketleri app target'tan `import` ile erişilebiliyor
- [ ] GitHub Actions'ta `build` adımı yeşil
- [ ] App launch olduğunda `RootView` glass background ile "Malta Calculator" yazısını gösteriyor
- [ ] Git repo'ya `.gitignore` eklendi (`DerivedData`, `.build`, `xcuserdata`, `fastlane/report.xml`)

---

## 4. Çıktı

Branch: `feat/ios-project-bootstrap`
PR: "chore(ios): bootstrap Xcode workspace + SPM packages + CI"
Sonuç: `main` üzerinde çalışan derlenebilir iskelet.

---

## 5. Sıradaki

[`02-design-system.md`](02-design-system.md)
