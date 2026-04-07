# Malta Calculator — iOS App Master Plan

> Native iOS app — SwiftUI + iOS 26 Liquid Glass — that mirrors the Malta Calculator web experience (28+ finansal hesaplayıcı, Malta vergi/SSC/COLA kuralları, blog rehberleri) with a premium, offline-first, App Store quality product.

---

## 1. Vision

Web tarafında halihazırda var olan **Malta Calculator** platformunun iOS karşılığını, web ile birebir tutarlı hesaplama motoru ve Apple platformuna özgü bir deneyim ile üretmek.

- **Amaç**: Malta'da yaşayan/çalışan kullanıcılar için ilk akla gelen finansal araç uygulaması olmak.
- **Stil**: iOS 26 "Liquid Glass" dil sistemi (glass materials, dynamic tint, floating layers, refractive edges, haptic feedback).
- **Kod kalitesi**: Tek sorumluluk, MVVM + Feature modül yapısı, SwiftPM, %80+ birim test kapsaması (hesap motoru için %100), SwiftLint + SwiftFormat.
- **Veri doğruluğu**: Web ile aynı hesaplama sonuçları (Payroll Working.xlsx referansı). JSON-based versiyonlu tax config.
- **Offline-first**: Tüm hesaplayıcılar ve rehberler offline çalışır. Blog içerikleri opsiyonel online senkronizasyonla güncellenir.

---

## 2. Kapsam Özeti (Web -> iOS Haritası)

### 2.1 Web'de Mevcut Olan ve iOS'a Taşıyacaklarımız

| Alan                 | Web                              | iOS Karşılığı                          |
| -------------------- | -------------------------------- | -------------------------------------- |
| Ana maaş hesaplayıcı | `/salary`                        | **Salary tab** (primary feature)       |
| 28+ hesaplayıcı      | `/calculators/*`                 | **Calculators tab** (grid + detail)    |
| Blog/rehberler       | `/blog/*`                        | **Guides tab** (markdown render)       |
| Tax config           | `src/config/malta-tax-config.ts` | `MaltaTaxConfig.swift` (JSON kaynaklı) |
| Hesap motorları      | `src/utils/*-calculator.ts`      | `CalculationKit` SPM modülü            |
| Glassmorphism UI     | `globals.css`                    | Native `glassEffect()` + `Material`    |

### 2.2 iOS'a TaşıMAYACAKLARIMIZ (v1)

- B2B bordro SaaS (Stripe abonelik) — ayrı iOS modülü olarak v2'ye bırakıldı
- Şirket paneli (Clerk auth, employee management)
- PDF payslip imza akışı
- Supabase backend entegrasyonu (v1 için sadece read-only content sync)

---

## 3. Uygulama Yapısı (High Level)

```
MaltaCalculator.xcworkspace
├── App/                    # UI entry, AppDelegate, SceneDelegate
│   └── MaltaCalculatorApp.swift
├── Features/               # Ekran bazlı modüller
│   ├── Home/
│   ├── Salary/
│   ├── Calculators/        # 28+ hesaplayıcı (her biri ayrı feature folder)
│   ├── Guides/             # Blog / rehber ekranları
│   └── Settings/
├── CalculationKit/         # Platform-agnostic hesap motoru (SPM paketi)
│   ├── Sources/
│   │   ├── MaltaTaxConfig/ # Vergi dilimleri, SSC, COLA
│   │   ├── Salary/
│   │   ├── Mortgage/
│   │   ├── StampDuty/
│   │   └── ...
│   └── Tests/
├── DesignSystem/           # SPM paketi — Liquid Glass component library
│   ├── Sources/
│   │   ├── Tokens/         # Colors, Typography, Spacing, Radii
│   │   ├── Materials/      # Glass backgrounds, orbs, mesh gradient
│   │   ├── Controls/       # Buttons, inputs, pickers, toggles
│   │   └── Charts/         # Lightweight Swift Charts wrappers
├── Content/                # JSON + Markdown bundled resources
│   ├── tax-config-2020-2026.json
│   ├── calculators-catalog.json
│   └── guides/*.md
└── Tests/
    ├── UnitTests/
    ├── SnapshotTests/      # DesignSystem + feature snapshot test
    └── UITests/
```

---

## 4. Tech Stack Kararları

| Katman          | Tercih                                                          | Gerekçe                                             |
| --------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| UI              | **SwiftUI** (iOS 26 minimum, iOS 18 fallback)                   | Liquid Glass API'leri native, yüksek iterasyon hızı |
| State           | `@Observable` macro + `Observation` framework                   | iOS 17+ native, Combine'a gerek yok                 |
| Mimari          | **MVVM** + feature-scoped coordinators                          | Test edilebilir, modüler                            |
| Modularity      | **Swift Package Manager** (local packages)                      | Xcode native, hızlı build, CI friendly              |
| Hesap motoru    | Pure Swift, UI bağımsız `CalculationKit`                        | Mac/iPad/iPhone/watchOS paylaşımı                   |
| Persistence     | `SwiftData` (iOS 17+)                                           | Geçmiş hesaplamalar, kullanıcı tercihleri           |
| Content         | Bundled JSON + Markdown, `AsyncHTTPClient` ile opsiyonel update | Offline-first                                       |
| Markdown render | `swift-markdown-ui` (MIT)                                       | Blog içerikleri                                     |
| Charts          | **Swift Charts** (native)                                       | Amortization schedule, salary breakdown             |
| Animation       | SwiftUI native + `PhaseAnimator` (iOS 17+)                      | Liquid Glass'a uygun akıcı animasyonlar             |
| Analytics       | TelemetryDeck veya Apple `MetricKit`                            | Gizlilik öncelikli, ATT gerekmez                    |
| Crash           | Apple MetricKit + `os_log`                                      | Third-party SDK yok                                 |
| Lint            | `SwiftLint` + `SwiftFormat` (pre-commit hook)                   | Kod stili tutarlılığı                               |
| CI              | **Xcode Cloud** veya GitHub Actions + Fastlane                  | Beta + TestFlight otomasyonu                        |

### Deployment Target

- **Minimum**: iOS 18.0 (Liquid Glass fallback: Material + blur)
- **Optimum**: iOS 26.0 (tam Liquid Glass deneyimi)
- **Cihazlar**: iPhone, iPad (universal), Mac Catalyst ileriki aşamada

---

## 5. Liquid Glass Tasarım Prensipleri

iOS 26 Liquid Glass dilini taklit etmek yerine "native" kullanacağız:

1. **Layered materials** — `.glassEffect()` (iOS 26) ve `Material.regular/.thin/.ultraThin` (fallback).
2. **Refractive edges** — `.glassBackgroundEffect(in: .rect(cornerRadius:))` ve `MeshGradient` (iOS 18+) ile arka plan.
3. **Dynamic tint** — App icon ve bar'ların Malta altın rengi ile `accentColor` üzerinden tint.
4. **Floating controls** — Bottom bar pill şekilli, glass ile ayrışık; web'deki `glass border border-primary/20` ile görsel devamlılık.
5. **Depth via motion** — `hoverEffect(.lift)` (iPad), `sensoryFeedback(.impact)` (iPhone), `scrollTransition` parallax.
6. **Orbs** — Web'deki `.orb-gold / orb-blue / orb-coral` radial blur'ları Swift'te `RadialGradient` + `.blur()` ile yeniden üretilecek (reusable `FloatingOrbsBackground` view).
7. **Color palette** (web'den birebir):
   - Primary (Malta gold): `#C97D0A`
   - Secondary (Mediterranean blue): `#0099CC`
   - Background: warm off-white `#FBF9F4` (dark `#121417`)
   - Destructive: Malta red `#E2352A`

Detay için [`tasks/02-design-system.md`](tasks/02-design-system.md).

---

## 6. Navigation Yapısı

**TabView** (iOS 26'da `.tabViewStyle(.sidebarAdaptable)`):

1. **Home** — Öne çıkan hesaplayıcılar, son kullanılanlar, Malta'nın cari minimum ücret/vergi dilimi özetleri
2. **Salary** — Ana maaş hesaplayıcı (playground deneyimi)
3. **Calculators** — Grid + kategori + search; detay sayfası tam ekran sheet
4. **Guides** — Blog rehberleri; markdown render + bookmark
5. **Settings** — Para birimi, dil (EN default, MT/TR planlı), tema, yıl override, hesaplamalar dışa aktarma

Detay için [`tasks/05-navigation.md`](tasks/05-navigation.md).

---

## 7. Hesap Motoru (CalculationKit) — Port Stratejisi

Web tarafındaki TypeScript utilities'i **Swift** karşılıklarına bire bir port edeceğiz. Sorumluluklar:

- Saf fonksiyonlar, yan etki yok
- Decimal hassasiyeti için `Foundation.Decimal` (Double yerine)
- Tüm public API'ler `public` + `Sendable`
- Yıl bazlı config **JSON** olarak taşınır (ileride web ile tek kaynak olabilir)
- Her motor için "golden test" — web'in aynı input'la ürettiği output'u JSON olarak alır, aynı değerleri üretir.

Port listesi [`tasks/17-calculator-mapping.md`](tasks/17-calculator-mapping.md).

---

## 8. Geliştirme Fazları (Milestones)

| Faz                                | Odak                                                      | Çıktı                                               |
| ---------------------------------- | --------------------------------------------------------- | --------------------------------------------------- |
| **M0 — Ön Çalışma**                | Analiz, plan, task MD'leri                                | Bu doküman ve tasks/ klasörü                        |
| **M1 — Kurulum**                   | Xcode projesi, SPM paketleri, CI, SwiftLint, ikon, splash | Boş ama çalışan uygulama (TestFlight-ready iskelet) |
| **M2 — Design System**             | Tokens, materials, base kontroller, snapshot testleri     | `DesignSystem` SPM paketi                           |
| **M3 — CalculationKit**            | Tüm 28+ motor portu + testler                             | `CalculationKit` SPM paketi, %100 coverage          |
| **M4 — Salary Feature**            | Ana maaş hesaplayıcı (playground UX)                      | Çalışan Salary tab                                  |
| **M5 — Calculators Grid + Detail** | Liste, kategori, detay ekranları                          | 6 kategori, 16 aktif hesaplayıcı                    |
| **M6 — Guides**                    | Bundle'lanmış blog markdown + okuma deneyimi              | Guides tab                                          |
| **M7 — Persistence & Share**       | SwiftData geçmiş, paylaşım, iCloud sync                   | Geçmiş hesaplamalar, ShareLink                      |
| **M8 — Polish & A11y**             | VoiceOver, Dynamic Type, localization, haptics            | App Store submission ready                          |
| **M9 — Release**                   | TestFlight beta, store listing, review, launch            | v1.0.0 App Store'da                                 |

---

## 9. Başarı Metrikleri

- Hesaplama doğruluğu: web ile **%100** uyumlu (golden test ile kanıt)
- Cold launch: **< 400ms** (iPhone 15)
- Binary size: **< 25 MB** (image ve content dahil)
- Crash-free users: **> 99.8%**
- VoiceOver: tüm etkileşimli öğeler erişilebilir
- Dynamic Type: xSmall - AX5 arası test edildi

---

## 10. Risk ve Not Düşülmesi Gerekenler

| Risk                                   | Etki            | Azaltma                                                                           |
| -------------------------------------- | --------------- | --------------------------------------------------------------------------------- |
| iOS 26 Liquid Glass API dalgalanabilir | UI bozulması    | iOS 18 fallback katmanı + `#available` kontrolleri                                |
| Vergi kuralları yıllık değişir         | Yanlış hesap    | Content JSON'u versiyonlu, App Store update bağımsız update için bundled + remote |
| Decimal hataları                       | Finansal hata   | `Decimal` kullan, Double'dan kaçın                                                |
| SEO yok (uygulama için)                | Discoverability | ASO (App Store Optimization) — ayrı task                                          |
| Web/App içerik senkronizasyonu         | Veri çakışması  | Tek kaynak = GitHub-hosted JSON, hem web hem iOS pull eder (v2)                   |

---

## 11. Task Index

> Her task ayrı bir MD dosyasıdır. Geliştirme sırasında tek tek yürütülecek.

### Faz M0 — Ön Çalışma

- [00 — Ön Çalışma / Discovery](tasks/00-pre-study.md) ← **şu an buradayız**

### Faz M1 — Kurulum

- [01 — Xcode Project & Workspace Setup](tasks/01-project-setup.md)
- [02 — Design System Foundation](tasks/02-design-system.md)

### Faz M2 — Altyapı

- [03 — CalculationKit SPM Package](tasks/03-calculation-kit.md)
- [04 — Tax Config JSON & Loader](tasks/04-tax-config.md)
- [05 — Navigation & App Skeleton](tasks/05-navigation.md)

### Faz M4 — Feature: Salary

- [06 — Salary Feature (Playground UX)](tasks/06-feature-salary.md)

### Faz M5 — Feature: Calculators

- [07 — Calculators Hub (Grid, Search, Categories)](tasks/07-feature-calculators-hub.md)
- [08 — Calculator Detail Screens (Tüm 28+ hesaplayıcı)](tasks/08-feature-calculator-detail.md)

### Faz M6 — Feature: Guides

- [09 — Guides Feature (Markdown Render, Bookmark)](tasks/09-feature-guides.md)

### Faz M7 — Persistence & Share

- [10 — Persistence (SwiftData, iCloud sync)](tasks/10-persistence.md)
- [11 — Share & Export (ShareLink, PDF)](tasks/11-share-export.md)

### Faz M3/M8 — Kalite

- [12 — Settings & Localization](tasks/12-settings-localization.md)
- [13 — Testing Strategy (Unit, Snapshot, UI, Golden)](tasks/13-testing.md)
- [14 — Accessibility (VoiceOver, Dynamic Type, Contrast)](tasks/14-accessibility.md)
- [15 — Performance & Animation Budgeting](tasks/15-performance.md)

### Faz M9 — Yayın

- [16 — App Store Release & ASO](tasks/16-release.md)

### Referans

- [17 — Calculator Mapping (Web TS → Swift)](tasks/17-calculator-mapping.md)

---

## 12. Nasıl Başlıyoruz

1. Bu dokümanı ve `tasks/00-pre-study.md` dosyasını birlikte gözden geçir.
2. `tasks/01-project-setup.md` ile Xcode projesini ve SPM paketlerini oluştur.
3. `tasks/02-design-system.md` ile Liquid Glass token ve bileşenlerini kur.
4. `tasks/03-calculation-kit.md` ile ilk hesap motorunu (Salary) porta başla — testleri ile birlikte.

Her task dosyası şu şablonu izler:

- **Amaç** — ne başarıyoruz
- **Ön koşul** — hangi task'ler bitmiş olmalı
- **Alt adımlar** — kontrollü checklist
- **Kabul kriterleri** — biter demeden önce neyin doğru olduğunu kanıtlamamız gerekiyor
- **Çıktı** — kod, dosya, klasör
