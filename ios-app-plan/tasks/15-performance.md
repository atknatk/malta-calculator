# Task 15 — Performance & Animation Budgeting

> **Faz**: M8
> **Ön koşul**: Tüm feature'lar işlevsel
> **Çıktı**: 60 fps akıcı, cold launch < 400 ms, binary < 25 MB, memory disciplined

---

## 1. Performance Hedefleri

| Metrik                       | Hedef                        | Cihaz         | Nasıl ölçülür               |
| ---------------------------- | ---------------------------- | ------------- | --------------------------- |
| Cold launch                  | < 400 ms                     | iPhone 15     | Instruments > App Launch    |
| Cold launch                  | < 600 ms                     | iPhone SE 3   | Instruments > App Launch    |
| Warm launch                  | < 150 ms                     | iPhone 15     | aynı                        |
| Frame rate                   | 60 fps (120 hz cihazlar 120) | iPhone 15 Pro | Instruments > Time Profiler |
| Hitch count (60s usage)      | ≤ 1                          | iPhone 15     | Instruments > Hitches       |
| Memory idle                  | < 80 MB                      | iPhone 15     | Instruments > Allocations   |
| Memory peak                  | < 150 MB                     | iPhone 15     | aynı                        |
| Memory growth (10 min usage) | < 10 MB                      | iPhone 15     | aynı                        |
| Binary size                  | < 25 MB                      | universal IPA | App Thinning Size Report    |
| Salary 12-month calc         | < 20 ms                      | iPhone 15     | XCTest measure              |
| Mortgage amortization        | < 30 ms                      | iPhone 15     | aynı                        |
| App size on device           | < 60 MB                      | installed     | Settings > Storage          |
| Energy impact                | Low                          | iPhone 15     | Instruments > Energy Log    |
| Network usage                | 0 (offline)                  | —             | Charles Proxy               |

---

## 2. Optimization Checklist

### 2.1 Launch Optimization

- [ ] `@main` minimal — sadece `WindowGroup` + `RootView`
- [ ] `RootView` sadece `TabView` oluşturuyor; her feature lazy yüklenir
- [ ] `NavigationStack` lazy initialization
- [ ] `AsyncImage` / ağ çağrısı launch sırasında yok
- [ ] `TaxConfigStore` lazy load (ilk hesaplamada)
- [ ] `FloatingOrbs` animasyonları ilk frame'den sonra başlar (`onAppear`)
- [ ] Heavy view'lar `Defer` ile sonradan yüklenir
- [ ] `Bundle.main.url(forResource:)` gereksiz tekrarlar engellendi
- [ ] `JSONDecoder()` tek instance, reuse
- [ ] Background queue'ya iş gönderirken `.userInitiated` veya `.background` doğru seçildi
- [ ] `@StateObject` / `@State` initialization ucuz

### 2.2 Rendering Optimization

- [ ] `LazyVStack` / `LazyVGrid` her uzun liste için
- [ ] `id` key'leri stabil (`UUID` her render'da yeniden oluşturulmuyor)
- [ ] `EquatableView` / `ViewBuilder` kullanılarak gereksiz re-render önlendi
- [ ] Heavy view'ler `drawingGroup()` ile flatten (kasıtlı yerlerde, profiling sonrası)
- [ ] `scrollTransition` sadece görünür item'larda
- [ ] Glass effect sayısı bir ekranda ≤ 8
- [ ] `GlassEffectContainer` ile birden fazla cam tek render pass'te
- [ ] `Image` resize edilmemiş orijinal kullanımı yok
- [ ] Asset catalog ile sembol resim'ler vector
- [ ] `clipShape` sadece gerektiğinde

### 2.3 Calculation Optimization

- [ ] `Decimal` operasyonları gereksiz yerde `Double`'a çevrilmiyor
- [ ] 12 aylık salary hesaplaması tek geçişte
- [ ] Cumulative değerler reduce yerine inline tekrarlanıyor (cache friendly)
- [ ] `ViewModel.recalculate()` debounce 50-80 ms (hızlı typing için)
- [ ] Heavy hesaplamalar `Task.detached(priority: .userInitiated)` ile main thread'i tıkamıyor
- [ ] Cached results kullanılıyor (input değişmediyse re-compute yok)
- [ ] `withObservationTracking` ile fine-grained reactive

### 2.4 Memory Optimization

- [ ] `@MainActor` gereksiz yerde kullanılmıyor
- [ ] Image cache sınırlı (`URLCache` 20 MB)
- [ ] Bundled guide markdown'ları lazy read (sadece reader açıldığında)
- [ ] SwiftData fetch limit'li (history listesi 100 item)
- [ ] Strong reference cycles yok (`weak self` closures'ta)
- [ ] `@State` mümkün olduğunca primitive types
- [ ] Allocations Instrument'tan leak audit
- [ ] Auto-release pool görselleştirme

### 2.5 Binary Size Optimization

- [ ] App Thinning enabled
- [ ] Vector assets (SF Symbol + SVG) tercih edildi, PNG yerine
- [ ] Unused SPM dependency yok
- [ ] Asset catalog `On-Demand Resources` v1.1'de düşünülecek
- [ ] Framework yerine static linking (`linkerSettings`)
- [ ] Symbols stripped in Release config
- [ ] Bitcode disabled (Apple deprecated)
- [ ] Localization bundle sadece needed languages

---

## 3. Animation Budget

### 3.1 Aynı Anda Çalışan Animasyon Sayısı

| Aynı ekranda               | Limit             |
| -------------------------- | ----------------- |
| Spring/keyframe animasyon  | ≤ 5               |
| Phase animator             | ≤ 2               |
| Repeating animation        | ≤ 3               |
| Numeric content transition | unlimited (cheap) |
| Parallax scroll            | ≤ 2               |
| Glass effect               | ≤ 8               |

### 3.2 Animation Disable Conditions

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion

let animation: Animation? = reduceMotion ? nil : DSMotion.standard
withAnimation(animation) { ... }
```

ProMotion (120 Hz) için interpolating spring tercih:

```swift
.animation(.interpolatingSpring(stiffness: 200, damping: 20), value: state)
```

---

## 4. Profiling Adımları

### 4.1 Time Profiler

Hedef: Salary input → result path < 50 ms

```text
1. Run app on device (iPhone 15 Pro)
2. Product → Profile → Time Profiler
3. Start recording
4. Salary tab → enter 30000 in gross field
5. Stop recording after 5 seconds
6. Inspect call tree:
   - Find heaviest leaves
   - Look for unexpected main thread blocking
7. Optimize and re-run
```

Öne çıkan suspect'ler:

- `JSONDecoder.decode` → reuse instance
- `Decimal` math → batch operations
- View body re-evaluation → equatable conformance

### 4.2 Allocations & Leaks

```text
1. Product → Profile → Allocations
2. Use app for 10 minutes:
   - Salary calculate × 20
   - Open 5 calculator details
   - Read 3 guides
   - Save 10 items
3. Check:
   - Total allocations growth
   - Persistent allocations (potential leaks)
   - Heaviest types
```

Hedef: 10 dakika sonra growth < 10 MB.

### 4.3 Hitches & Frame Drops

```text
1. Product → Profile → Hitches
2. Scroll all main lists:
   - Calculators grid
   - Monthly salary breakdown
   - Guides list
   - Saved calculations history
3. Check:
   - Hitch count
   - Hitch duration (target: 0 hitches > 100ms)
```

### 4.4 App Launch

```text
1. Product → Profile → App Launch
2. Run cold launch
3. Inspect time spent in:
   - Pre-main
   - Main thread initialization
   - Initial frame render
4. Target: < 400 ms total
```

### 4.5 Energy Log

```text
1. Product → Profile → Energy Log
2. Use app for 5 minutes
3. Check:
   - CPU usage (low)
   - GPU usage (low for static screens)
   - Network (zero)
   - Display (low)
```

---

## 5. `os_signpost` Instrumentation

Critical path'ler için signpost'lar:

```swift
import os.signpost

extension OSLog {
    static let calculation = OSLog(
        subsystem: "com.maltacalculator.app",
        category: "Calculation"
    )
    static let rendering = OSLog(
        subsystem: "com.maltacalculator.app",
        category: "Rendering"
    )
}

// Salary calc
let signpostID = OSSignpostID(log: .calculation)
os_signpost(.begin, log: .calculation, name: "Salary Recalculate", signpostID: signpostID)
defer { os_signpost(.end, log: .calculation, name: "Salary Recalculate", signpostID: signpostID) }

let result = try calculator.calculate(inputs: inputs)
```

Instruments → Points of Interest panel'inde görünür.

---

## 6. Performance Tests (Otomatik)

### 6.1 `XCTMetric`

```swift
import XCTest

final class CalculationPerformanceTests: XCTestCase {

    func test_salary_calculation_speed() {
        let measureOptions = XCTMeasureOptions.default
        measureOptions.iterationCount = 100

        measure(
            metrics: [XCTClockMetric(), XCTCPUMetric()],
            options: measureOptions
        ) {
            let calculator = SalaryCalculator(config: .default, taxConfig: .preview)
            let inputs = Month.allCases.map { SalaryInput(month: $0, grossWage: 2500) }
            _ = try? calculator.calculate(inputs: inputs)
        }
    }

    func test_mortgage_amortization_30y() {
        measure(metrics: [XCTClockMetric()]) {
            let calc = MortgageCalculator()
            _ = try? calc.calculate(input: .init(
                propertyPrice: 500_000,
                depositPercent: 10,
                interestRate: 4.5,
                loanTermYears: 30
            ))
        }
    }

    func test_pension_calculation() {
        measure(metrics: [XCTClockMetric()]) {
            let calc = PensionCalculator()
            _ = try? calc.calculate(input: .init(
                birthYear: 1980,
                taxStatus: .single,
                children: 2,
                paidYears: 30,
                averageSalary: 25_000,
                deferralYears: .none,
                privatePensionContribution: 1500
            ))
        }
    }

    func test_app_launch() {
        let options = XCTMeasureOptions.default
        options.iterationCount = 5
        measure(metrics: [XCTApplicationLaunchMetric()], options: options) {
            let app = XCUIApplication()
            app.launch()
            app.terminate()
        }
    }

    func test_memory_after_navigation() {
        let app = XCUIApplication()
        let options = XCTMeasureOptions.default
        options.iterationCount = 5
        measure(metrics: [XCTMemoryMetric(application: app)], options: options) {
            app.launch()
            app.tabBars.buttons["Calculators"].tap()
            app.collectionViews.cells.firstMatch.tap()
            app.navigationBars.buttons.firstMatch.tap()
            app.terminate()
        }
    }
}
```

### 6.2 Baseline Tracking

Her PR'da `XCTMetric` baseline değişimi kontrol edilir:

- ≤ 10% regression: warning
- > 10% regression: PR fail

---

## 7. Heavy Operations Recipe

### 7.1 Lazy Loading Pattern

```swift
struct HeavyChartView: View {
    @State private var isReady = false

    var body: some View {
        Group {
            if isReady {
                ExpensiveChart()
            } else {
                ProgressView()
            }
        }
        .task {
            try? await Task.sleep(for: .milliseconds(300))
            isReady = true
        }
    }
}
```

### 7.2 Background Calculation

```swift
func recalculate() async {
    let result = await Task.detached(priority: .userInitiated) {
        try? calculator.calculate(inputs: inputs)
    }.value

    await MainActor.run {
        self.output = result
    }
}
```

### 7.3 Image Rendering Cache

Share card render edildiğinde aynı state için cache:

```swift
private var cachedImage: (state: SalaryState, data: Data)?

func renderShareImage(state: SalaryState) -> Data? {
    if let cached = cachedImage, cached.state == state {
        return cached.data
    }
    let renderer = ImageRenderer(content: SalaryShareCard(state: state))
    let data = renderer.uiImage?.pngData()
    if let data {
        cachedImage = (state, data)
    }
    return data
}
```

---

## 8. App Thinning & Build Settings

### 8.1 Build Settings (Release)

- `SWIFT_OPTIMIZATION_LEVEL` = `-O` (Optimize for Speed)
- `GCC_OPTIMIZATION_LEVEL` = `s` (Optimize for Size)
- `DEAD_CODE_STRIPPING` = `YES`
- `STRIP_INSTALLED_PRODUCT` = `YES`
- `STRIP_STYLE` = `non-global`
- `LLVM_LTO` = `YES_THIN` (Link-time optimization)
- `ENABLE_BITCODE` = `NO`
- `SWIFT_COMPILATION_MODE` = `wholemodule`
- `ASSETCATALOG_COMPILER_OPTIMIZATION` = `space`

### 8.2 App Store Submission

Xcode Organizer → Distribute App → App Store Connect → check:

- App Thinning report (per device, per locale)
- Total compressed size

---

## 9. Profiling Reports & Tracking

### 9.1 PR Performance Report

CI'da her PR'da:

```bash
xcodebuild test \
  -only-testing:CalculationKitPerformanceTests \
  -resultBundlePath PerfResults.xcresult

# Extract metrics
xcrun xcresulttool get --path PerfResults.xcresult --format json > perf.json
python scripts/parse-perf.py perf.json
```

Sonuç PR comment'i olarak yapıştırılır:

```text
Performance Report:
- Salary calc: 12.4 ms (baseline 13.1, -5.3%) ✓
- Mortgage amort: 22.8 ms (baseline 22.1, +3.2%) ⚠
- Cold launch: 387 ms (baseline 392, -1.3%) ✓
```

### 9.2 Production MetricKit

Apple `MetricKit` payload'u opt-in olarak topla:

```swift
import MetricKit

class MetricsObserver: NSObject, MXMetricManagerSubscriber {
    func didReceive(_ payloads: [MXMetricPayload]) {
        for payload in payloads {
            if let launchMetrics = payload.applicationLaunchMetrics {
                let avgLaunch = launchMetrics.histogrammedTimeToFirstDraw.totalBucketCount
                // Log to analytics if user opted in
            }
        }
    }
}
```

v1'de capture, opt-in geldiğinde transmit (v1.1).

---

## 10. Optimizasyon Backlog (Sürekli)

| Optimization                 | Etki              | Effort | Öncelik |
| ---------------------------- | ----------------- | ------ | ------- |
| `EquatableView` for cards    | 10-15% scroll     | Düşük  | Orta    |
| Salary calculation cache     | 30% perceived     | Orta   | Yüksek  |
| `drawingGroup` for chart     | 20% chart fps     | Düşük  | Orta    |
| Markdown lazy paragraph load | 50% reader open   | Yüksek | Düşük   |
| JSON parse via swift-json    | 5% launch         | Düşük  | Düşük   |
| Custom `View.id` stability   | 5-10% list scroll | Orta   | Orta    |

---

## 11. Alt Adımlar

- [ ] Performance test target oluştur
- [ ] `os_signpost` 5 critical path için ekle
- [ ] CI pipeline'a performance job ekle
- [ ] Baseline metric'leri kaydet (`xcresult` artifact)
- [ ] Time Profiler audit (her feature için 1 sefer)
- [ ] Allocations leak audit
- [ ] Hitches scroll audit (4 ana liste için)
- [ ] App Launch audit
- [ ] Energy Log audit
- [ ] Build settings optimizasyonu
- [ ] App Thinning report generation
- [ ] MetricKit observer (passive collection)

---

## 12. Kabul Kriterleri

- [ ] Instruments hitch count 60s kullanımda ≤ 1
- [ ] Cold launch < 400 ms (iPhone 15)
- [ ] Salary recalculate < 50 ms
- [ ] Binary size < 25 MB
- [ ] App size on device < 60 MB
- [ ] 10 dakika kullanım sonrası memory growth < 10 MB
- [ ] CI performance baseline yeşil
- [ ] Energy impact "Low"
- [ ] Network usage 0 byte (offline mode test)
- [ ] 60 fps her ana ekranda (120 fps ProMotion'da)

---

## 13. Sıradaki

[`16-release.md`](16-release.md)
