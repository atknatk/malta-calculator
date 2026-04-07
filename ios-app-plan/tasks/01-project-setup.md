# Task 01 — Xcode Project & Workspace Setup

> **Faz**: M1
> **Ön koşul**: [`00-pre-study.md`](00-pre-study.md) onaylandı, açık sorular kapandı
> **Çıktı**: Derlenebilir, TestFlight'a submit edilebilir iskelet app

---

## 1. Amaç

Uzun vadeli modüler bir yapı kurmak için:

- Xcode workspace + local SPM paketleri oluştur
- Kod stili ve formatlama araçlarını bağla
- CI hattını (GitHub Actions) kur
- Signing, bundle ID, capabilities yapılandır
- İlk "hello world" ekranını çalıştır

---

## 2. Ön Gereksinimler

- [ ] **Xcode 26** (App Store'dan veya developer.apple.com'dan)
- [ ] **macOS Sonoma 15+** (Xcode 26 için)
- [ ] **Apple Developer Account** (individual/organization) — TestFlight için zorunlu
- [ ] **Homebrew** kurulu (SwiftLint/SwiftFormat için)
- [ ] **mint** CLI (opsiyonel ama önerilen) — swift tool version yönetimi

```bash
brew install swiftlint swiftformat mint xcbeautify
```

---

## 3. Alt Adımlar

### 3.1 Xcode Project Oluştur

Xcode → File → New → Project → iOS → App:

- **Product Name**: `MaltaCalculator`
- **Team**: (developer team seçilecek)
- **Organization Identifier**: `com.maltacalculator`
- **Bundle Identifier**: `com.maltacalculator.app`
- **Interface**: **SwiftUI**
- **Language**: **Swift**
- **Storage**: **SwiftData** (ileride kullanılacak)
- **Include Tests**: ✅
- **Minimum Deployments**: iOS 18.0
- **Location**: repo root (`malta-calculator/ios/`)

### 3.2 Workspace Oluştur

```bash
# repo root'tan
mkdir -p ios
cd ios
# Xcode ile MaltaCalculator.xcodeproj oluştur
# Ardından:
# File > New > Workspace > Save as: MaltaCalculator.xcworkspace
# Workspace'e MaltaCalculator.xcodeproj ekle
```

### 3.3 Tam Dosya Yapısı

```
malta-calculator/ios/
├── MaltaCalculator.xcworkspace
├── MaltaCalculator.xcodeproj
├── MaltaCalculator/
│   ├── App/
│   │   ├── MaltaCalculatorApp.swift
│   │   └── RootView.swift
│   ├── Features/
│   │   ├── Home/
│   │   ├── Salary/
│   │   ├── Calculators/
│   │   ├── Guides/
│   │   └── Settings/
│   ├── Resources/
│   │   ├── Assets.xcassets/
│   │   │   ├── AppIcon.appiconset
│   │   │   ├── AccentColor.colorset
│   │   │   └── (ileride eklenecek)
│   │   ├── Localizable.xcstrings
│   │   └── Content/
│   │       ├── calculators-catalog.json (Task 07)
│   │       ├── guides-manifest.json (Task 09)
│   │       └── guides/ (Task 09)
│   ├── Info.plist
│   └── MaltaCalculator.entitlements
├── Packages/
│   ├── CalculationKit/
│   │   ├── Package.swift
│   │   ├── Sources/CalculationKit/
│   │   │   └── CalculationKit.swift
│   │   ├── Resources/
│   │   │   └── tax-config-2020-2026.json (Task 04)
│   │   └── Tests/CalculationKitTests/
│   └── DesignSystem/
│       ├── Package.swift
│       ├── Sources/DesignSystem/
│       │   └── DesignSystem.swift
│       └── Tests/DesignSystemTests/
├── Tools/
│   ├── .swiftlint.yml
│   ├── .swiftformat
│   ├── Mintfile
│   └── scripts/
│       ├── lint.sh
│       ├── format.sh
│       └── bootstrap.sh
├── Tests/
│   ├── MaltaCalculatorTests/
│   └── MaltaCalculatorUITests/
├── fastlane/
│   ├── Appfile
│   ├── Fastfile
│   └── Matchfile
├── .github/
│   └── workflows/
│       └── ios.yml
└── .gitignore
```

### 3.4 `CalculationKit` Package.swift

```swift
// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "CalculationKit",
    defaultLocalization: "en",
    platforms: [.iOS(.v17), .macOS(.v14)],
    products: [
        .library(name: "CalculationKit", targets: ["CalculationKit"]),
    ],
    targets: [
        .target(
            name: "CalculationKit",
            resources: [.process("Resources")],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("AccessLevelOnImport"),
            ]
        ),
        .testTarget(
            name: "CalculationKitTests",
            dependencies: ["CalculationKit"],
            resources: [.process("Golden")]
        ),
    ]
)
```

### 3.5 `DesignSystem` Package.swift

```swift
// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "DesignSystem",
    defaultLocalization: "en",
    platforms: [.iOS(.v18), .macOS(.v15)],
    products: [
        .library(name: "DesignSystem", targets: ["DesignSystem"]),
    ],
    dependencies: [
        .package(url: "https://github.com/gonzalezreal/swift-markdown-ui",
                 from: "2.4.0"),
        .package(url: "https://github.com/pointfreeco/swift-snapshot-testing",
                 from: "1.17.0"),
    ],
    targets: [
        .target(
            name: "DesignSystem",
            dependencies: [
                .product(name: "MarkdownUI", package: "swift-markdown-ui"),
            ],
            resources: [.process("Resources")]
        ),
        .testTarget(
            name: "DesignSystemTests",
            dependencies: [
                "DesignSystem",
                .product(name: "SnapshotTesting", package: "swift-snapshot-testing"),
            ]
        ),
    ]
)
```

### 3.6 Xcode'da Local Package Link

- Project navigator → MaltaCalculator project → "Frameworks, Libraries, and Embedded Content"
- "+" → "Add Package Dependency" → "Add Local"
- `Packages/CalculationKit` ekle
- `Packages/DesignSystem` ekle
- Her ikisini app target'a bağla

### 3.7 `Tools/.swiftlint.yml`

```yaml
disabled_rules:
  - todo
  - trailing_whitespace
  - opening_brace

opt_in_rules:
  - force_unwrapping
  - empty_count
  - closure_spacing
  - contains_over_first_not_nil
  - convenience_type
  - discouraged_optional_boolean
  - empty_string
  - explicit_init
  - fatal_error_message
  - first_where
  - implicit_return
  - literal_expression_end_indentation
  - multiline_parameters
  - operator_usage_whitespace
  - overridden_super_call
  - prefer_self_type_over_type_of_self
  - redundant_nil_coalescing
  - single_test_class
  - sorted_first_last
  - toggle_bool
  - unneeded_parentheses_in_closure_argument
  - unused_import
  - vertical_parameter_alignment_on_call
  - yoda_condition

line_length:
  warning: 120
  error: 150
  ignores_urls: true
  ignores_comments: true

type_body_length:
  warning: 300
  error: 400

file_length:
  warning: 500
  error: 700
  ignore_comment_only_lines: true

function_body_length:
  warning: 50
  error: 80

cyclomatic_complexity:
  warning: 10
  error: 15

identifier_name:
  min_length: 2
  max_length: 50
  excluded:
    - id
    - vm
    - to

force_unwrapping:
  severity: error

excluded:
  - Packages/*/.build
  - DerivedData
  - fastlane
  - Pods
  - .build

reporter: "xcode"
```

### 3.8 `Tools/.swiftformat`

```
--swiftversion 6.0
--indent 4
--wraparguments before-first
--wrapcollections before-first
--wrapparameters before-first
--maxwidth 120
--self remove
--stripunusedargs closure-only
--header "//\n//  {file}\n//  MaltaCalculator\n//\n"
--allman false
--commas inline
--elseposition same-line
--empty void
--exponentcase lowercase
--hexliteralcase uppercase
--importgrouping testable-bottom
--octalgrouping 4,8
--patternlet hoist
--ranges spaced
--semicolons never
--trimwhitespace always
--ifdef no-indent
--closingparen balanced
--lineaftermarks true
--linebreaks lf
--nospaceoperators ..<,...
--tabwidth 4
--xcodeindentation enabled
```

### 3.9 `Tools/Mintfile`

```
realm/SwiftLint@0.56.2
nicklockwood/SwiftFormat@0.54.5
yonaskolb/xcodegen@2.41.0
fastlane/fastlane@2.224.0
```

### 3.10 `Tools/scripts/lint.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

echo "→ SwiftLint..."
mint run swiftlint lint --config Tools/.swiftlint.yml --strict

echo "→ SwiftFormat (dry run)..."
mint run swiftformat --lint --config Tools/.swiftformat .

echo "✔ Lint passed"
```

### 3.11 `Tools/scripts/format.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

mint run swiftformat --config Tools/.swiftformat .
echo "✔ Formatted"
```

### 3.12 `Tools/scripts/bootstrap.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "→ Checking Homebrew..."
command -v brew >/dev/null 2>&1 || {
  echo "Install Homebrew first: https://brew.sh"; exit 1;
}

echo "→ Installing mint..."
brew list mint >/dev/null 2>&1 || brew install mint

echo "→ Bootstrapping Swift tools..."
mint bootstrap --mintfile Tools/Mintfile

echo "→ Resolving Swift packages..."
xcodebuild -resolvePackageDependencies \
  -workspace MaltaCalculator.xcworkspace \
  -scheme MaltaCalculator

echo "✔ Bootstrap complete. Open MaltaCalculator.xcworkspace"
```

### 3.13 Build Phase: Run Script

Xcode → MaltaCalculator target → Build Phases → New Run Script Phase:

```bash
if [[ "$CONFIGURATION" == "Debug" ]]; then
  if which swiftlint >/dev/null; then
    swiftlint --config "${SRCROOT}/Tools/.swiftlint.yml"
  else
    echo "warning: SwiftLint not installed"
  fi
fi
```

### 3.14 `Info.plist` Ayarları

Key ekle/değiştir:

- `CFBundleDisplayName` = `Malta Calculator`
- `CFBundleShortVersionString` = `1.0.0`
- `CFBundleVersion` = `1`
- `ITSAppUsesNonExemptEncryption` = `false` (Boolean)
- `UIApplicationSupportsIndirectInputEvents` = `true`
- `UILaunchScreen` dictionary ile blank launch screen
- `UIStatusBarStyle` = `UIStatusBarStyleDefault`
- `UIRequiresFullScreen` = `false` (iPad multitasking için)
- `UISupportedInterfaceOrientations~ipad`:
  - `UIInterfaceOrientationPortrait`
  - `UIInterfaceOrientationPortraitUpsideDown`
  - `UIInterfaceOrientationLandscapeLeft`
  - `UIInterfaceOrientationLandscapeRight`
- `UISupportedInterfaceOrientations~iphone`:
  - `UIInterfaceOrientationPortrait`

### 3.15 Entitlements

`MaltaCalculator.entitlements`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <!-- iCloud (v1.1'de aktif edilecek) -->
  <key>com.apple.developer.icloud-services</key>
  <array>
    <string>CloudKit</string>
  </array>
  <key>com.apple.developer.icloud-container-identifiers</key>
  <array>
    <string>iCloud.com.maltacalculator.app</string>
  </array>
</dict>
</plist>
```

v1 için iCloud capability Xcode'da kapalı, v1.1'de açılır.

### 3.16 App Icon Placeholder

- Assets.xcassets → AppIcon
- 1024×1024 base: Malta gold (#C97D0A) arka plan, beyaz SF Symbol "function" glyph
- Geçici olarak SF Symbol ile üretilmiş PNG (tasarımcı ile v1'de final versiyonu)

### 3.17 `MaltaCalculatorApp.swift`

```swift
import SwiftUI
import SwiftData

@main
struct MaltaCalculatorApp: App {
    var body: some Scene {
        WindowGroup {
            RootView()
                .tint(.accentColor)
        }
    }
}
```

### 3.18 `RootView.swift` (placeholder)

```swift
import SwiftUI
import DesignSystem

struct RootView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "sparkles")
                .font(.system(size: 60))
                .foregroundStyle(.tint)
            Text("Malta Calculator")
                .font(.system(.largeTitle, design: .serif, weight: .bold))
            Text("Coming soon")
                .foregroundStyle(.secondary)
        }
        .padding(40)
        .liquidGlass()
        .padding()
    }
}

#Preview { RootView() }
```

### 3.19 `.gitignore`

```gitignore
# macOS
.DS_Store

# Xcode
build/
DerivedData/
*.xcuserstate
*.xcuserdatad/
xcuserdata/
!default.xcworkspace

# SwiftPM
.build/
Packages/*/.build/
Package.resolved

# Fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots/
fastlane/test_output/
fastlane/README.md

# CocoaPods (yoksa da güvenlik)
Pods/

# Bundler
.bundle/

# Mint
.mint/

# Environment
.env
.env.local

# Archives & IPA
*.xcarchive
*.ipa
*.dSYM.zip
*.dSYM

# Sensitive
*.p8
*.p12
*.mobileprovision
*.certSigningRequest
```

### 3.20 GitHub Actions — `.github/workflows/ios.yml`

```yaml
name: iOS CI

on:
  push:
    branches: [main]
    paths:
      - "ios/**"
      - ".github/workflows/ios.yml"
  pull_request:
    paths:
      - "ios/**"
      - ".github/workflows/ios.yml"

concurrency:
  group: ios-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build-test:
    name: Build & Test
    runs-on: macos-15
    defaults:
      run:
        working-directory: ios
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Select Xcode 26
        run: sudo xcode-select -switch /Applications/Xcode_26.app/Contents/Developer

      - name: Xcode version
        run: xcodebuild -version

      - name: Cache SPM
        uses: actions/cache@v4
        with:
          path: |
            ~/Library/Developer/Xcode/DerivedData/**/SourcePackages
            .build
          key: ${{ runner.os }}-spm-${{ hashFiles('**/Package.resolved') }}
          restore-keys: |
            ${{ runner.os }}-spm-

      - name: Install mint
        run: brew install mint xcbeautify

      - name: Bootstrap tools
        run: mint bootstrap --mintfile Tools/Mintfile

      - name: Lint
        run: bash Tools/scripts/lint.sh

      - name: Resolve packages
        run: |
          xcodebuild -resolvePackageDependencies \
            -workspace MaltaCalculator.xcworkspace \
            -scheme MaltaCalculator

      - name: Build
        run: |
          set -o pipefail
          xcodebuild build \
            -workspace MaltaCalculator.xcworkspace \
            -scheme MaltaCalculator \
            -destination "platform=iOS Simulator,name=iPhone 16 Pro,OS=latest" \
            -configuration Debug \
            CODE_SIGNING_ALLOWED=NO \
            | xcbeautify

      - name: Test (Unit)
        run: |
          set -o pipefail
          xcodebuild test \
            -workspace MaltaCalculator.xcworkspace \
            -scheme MaltaCalculator \
            -destination "platform=iOS Simulator,name=iPhone 16 Pro,OS=latest" \
            -only-testing:CalculationKitTests \
            -only-testing:MaltaCalculatorTests \
            -resultBundlePath TestResults.xcresult \
            CODE_SIGNING_ALLOWED=NO \
            | xcbeautify

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: ios/TestResults.xcresult
```

### 3.21 Fastlane `Appfile`

```ruby
app_identifier("com.maltacalculator.app")
apple_id(ENV["FASTLANE_APPLE_ID"])
itc_team_id(ENV["FASTLANE_ITC_TEAM_ID"])
team_id(ENV["FASTLANE_TEAM_ID"])
```

### 3.22 Fastlane `Fastfile`

```ruby
default_platform(:ios)

platform :ios do
  desc "Lint Swift code"
  lane :lint do
    sh("bash ../Tools/scripts/lint.sh")
  end

  desc "Run tests"
  lane :test do
    run_tests(
      workspace: "MaltaCalculator.xcworkspace",
      scheme: "MaltaCalculator",
      devices: ["iPhone 16 Pro"]
    )
  end

  desc "Build and upload to TestFlight"
  lane :beta do
    match(type: "appstore", readonly: true)
    increment_build_number(xcodeproj: "MaltaCalculator.xcodeproj")
    build_app(
      workspace: "MaltaCalculator.xcworkspace",
      scheme: "MaltaCalculator",
      export_method: "app-store"
    )
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end

  desc "Release to App Store"
  lane :release do
    match(type: "appstore", readonly: true)
    capture_screenshots if ENV["CAPTURE_SCREENSHOTS"]
    build_app(
      workspace: "MaltaCalculator.xcworkspace",
      scheme: "MaltaCalculator"
    )
    upload_to_app_store(
      submit_for_review: true,
      automatic_release: false,
      skip_screenshots: true,
      skip_metadata: false
    )
  end
end
```

---

## 4. Code Signing & Capabilities

- [ ] Automatic signing, development team seçilir
- [ ] Provisioning profile xcode managed
- [ ] Development + Distribution cert'ları Match ile yönetilir
- [ ] **Capabilities** (Xcode → Signing & Capabilities):
  - iCloud → **kapalı v1** (v1.1'de açılacak)
  - Background Modes → kapalı
  - App Groups → kapalı
  - Associated Domains → v1.1 (universal links için)
  - Push Notifications → kapalı

---

## 5. Kabul Kriterleri

- [ ] `bash Tools/scripts/bootstrap.sh` sıfır hata ile bitiyor
- [ ] `xcodebuild` simulator üzerinde sıfır hata ile derliyor
- [ ] SwiftLint 0 error, 0 warning
- [ ] SwiftFormat dry-run değişiklik yapmıyor
- [ ] `CalculationKit` ve `DesignSystem` paketleri app target'tan `import` ile erişilebiliyor
- [ ] GitHub Actions'ta build adımı yeşil (en az 1 başarılı run)
- [ ] App launch olduğunda `RootView` glass background ile "Malta Calculator" yazısını gösteriyor
- [ ] `.gitignore` eklendi, derived data commit'lenmiyor
- [ ] `Info.plist` değerleri doğru
- [ ] Fastlane `lane :lint` ve `lane :test` local'de çalışıyor

---

## 6. Çıktı

- Branch: `feat/ios-bootstrap`
- PR: "chore(ios): bootstrap Xcode workspace + SPM packages + CI"
- Sonuç: `main` üzerinde çalışan derlenebilir iskelet

---

## 7. Sıradaki

[`02-design-system.md`](02-design-system.md)
