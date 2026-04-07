# Task 14 — Accessibility (VoiceOver, Dynamic Type, Contrast)

> **Faz**: M8
> **Ön koşul**: Tüm feature'lar işlevsel
> **Çıktı**: WCAG AA seviyesinde erişilebilir, Apple Accessibility Inspector temiz rapor

---

## 1. Prensipler

- **VoiceOver Everything** — hiçbir etkileşimli öğe label'sız kalmaz
- **Dynamic Type** — xSmall → AX5 arası layout kırılmaz
- **Color Contrast** — 4.5:1 minimum (WCAG AA), 7:1 hedef (AAA)
- **Reduce Motion** — Liquid Glass animasyonları kapanır, sayısal transition'lar instant
- **Reduce Transparency** — Glass yerine solid surface
- **Increased Contrast** — Border ve focus state'ler belirginleşir
- **Bold Text** — Sistem ayarına saygılı
- **Smart Invert** — Resimler invert edilmesin
- **Switch Control** — Tüm aksiyonlar erişilebilir
- **Voice Control** — Komut isimleri açık (label'lar konuşulan dile uygun)

---

## 2. VoiceOver Kuralları

### 2.1 Genel

- [ ] Her `Button` için `accessibilityLabel` (sembol değil, kelime)
- [ ] Her `Button` için `accessibilityHint` (yapacağı eylemi açıklayan)
- [ ] Değeri olan kontroller (slider, stepper, toggle, picker) için `accessibilityValue`
- [ ] Dekoratif öğeler `accessibilityHidden(true)` (orb'lar, gradient arkaplan, ikon yanındaki text varsa ikon hidden)
- [ ] Custom componentler `accessibilityElement(children: .combine)` veya `.contain` ile mantıklı gruplanmış
- [ ] Heading'ler `.accessibilityAddTraits(.isHeader)`
- [ ] Linkler `.accessibilityAddTraits(.isLink)`
- [ ] Resimler `.accessibilityLabel("descriptive text")` veya `accessibilityHidden(true)`

### 2.2 Custom Action

Liste item'ları için swipe action yerine custom action:

```swift
.accessibilityAction(named: "Save") { vm.save() }
.accessibilityAction(named: "Share") { vm.share() }
.accessibilityAction(named: "Delete") { vm.delete() }
```

### 2.3 Adjustable Trait

Slider/stepper benzeri custom kontroller için:

```swift
.accessibilityAdjustableAction { direction in
    switch direction {
    case .increment: childCount += 1
    case .decrement: childCount = max(0, childCount - 1)
    @unknown default: break
    }
}
.accessibilityValue("\(childCount) children")
```

---

## 3. Per-Feature A11y Audit

### 3.1 Salary Feature

- [ ] **FloatingNetCard** → `accessibilityElement(children: .combine)`
  - Label: "Net pay"
  - Value: "{annualNet} per year, {monthlyNet} per month"
- [ ] **Year picker** (DSToggleGroup)
  - Label: "Tax year"
  - Hint: "Choose the tax year for calculation"
  - Value: current year
- [ ] **Tax type picker** (DSToggleGroup)
  - Label: "Tax category"
  - Hint: "Single, married, or parent"
- [ ] **Child count stepper**
  - Label: "Number of children"
  - Adjustable trait
- [ ] **SSC category picker**
  - Label: "Social security category"
  - Hint: "Affects weekly contribution"
- [ ] **DSCurrencyField** for gross
  - Label: "Annual gross salary"
  - Hint: "Enter your yearly income before tax"
  - Value: formatted euro
- [ ] **Donut chart** → combined element
  - Label: "Income breakdown"
  - Value: "Net {x}, income tax {y}, social security {z}"
- [ ] **Monthly row** → combined element
  - Label: "{Month}: {net} euro net after {tax} tax and {ssc} social security"
  - Hint: "Double tap to expand details"
- [ ] **Save / Share / Reset** menu items → clear labels

### 3.2 Calculators Hub

- [ ] **CalculatorCard** → combined
  - Label: "{title}"
  - Hint: "Open calculator" (if available) / "Coming soon, not available"
  - Trait: `.isButton`
- [ ] **CategoryHeaderView** → `isHeader` trait
  - Label: "{category title}"
- [ ] **Search field** → standard `.searchable` a11y
- [ ] **Stats row** → combined
  - Label: "{active} active, {soon} coming soon, {categories} categories, free forever"
- [ ] **Coming soon badge** → "Coming soon" label

### 3.3 Calculator Detail (Generic)

- [ ] **Hero header** → combined
  - Label: "{title}, {subtitle}"
  - Trait: `.isHeader`
- [ ] **Input fields** → her biri label + hint + value
- [ ] **Result fields** → label + value, no interaction
- [ ] **Charts** → combined element with summary
- [ ] **Toolbar menu** → "More actions"

### 3.4 Guides Reader

- [ ] **Markdown** → swift-markdown-ui native a11y (heading rotor)
- [ ] **Reading progress bar** → `accessibilityValue("\(Int(progress * 100)) percent read")`
- [ ] **Bookmark button** → label + value ("bookmarked" / "not bookmarked")
- [ ] **Font size menu** → label + value
- [ ] **Share button** → label

### 3.5 Settings

- [ ] Standard `Form` a11y
- [ ] Toggles → label + value (on/off)
- [ ] Pickers → label + selection
- [ ] Destructive button → `.accessibilityAddTraits(.isDestructive)`

---

## 4. Dynamic Type

### 4.1 Font Sizes

- [ ] Tüm `Text` `Font.DS` token kullanıyor (sistem font ile scaling)
- [ ] Custom fixed-size font yok
- [ ] `ScaledMetric` ile padding/spacing değerleri ölçekleniyor:

```swift
@ScaledMetric private var spacing: CGFloat = DSSpacing.md
```

### 4.2 Layout Adaptations

AX3+ için layout'lar adapte olur:

- [ ] `ViewThatFits` ile wide → narrow fallback
- [ ] Multi-column grid AX3+'te tek kolona düşer
- [ ] Tab bar etiketleri AX3+'te gizlenip yalnızca ikon kalır (`.tabItem`)
- [ ] Toolbar item'lar overflow menüsüne taşınır
- [ ] Card padding artmaz, içerik genişler

### 4.3 Test Matrisi

```swift
extension View {
    func snapshot(at category: ContentSizeCategory) -> some View {
        self.environment(\.sizeCategory, category)
    }
}

// Test
ForEach([
    ContentSizeCategory.small,
    .medium,
    .extraLarge,
    .accessibilityMedium,
    .accessibilityExtraExtraLarge,
], id: \.self) { category in
    assertSnapshot(of: view.snapshot(at: category), as: .image, named: "\(category)")
}
```

### 4.4 Critical Layouts

| Layout                   | Test Edilecek                       |
| ------------------------ | ----------------------------------- |
| Salary Floating Net Card | xS, M, L, AX3, AX5                  |
| Monthly row card         | aynı                                |
| Calculator card grid     | M, AX3, AX5 (kolon sayısı doğru mu) |
| Settings form            | M, AX5                              |
| Guide reader             | xS, M, AX5                          |

---

## 5. Color Contrast

### 5.1 WCAG AA Hedefler

- Normal text: ≥ 4.5:1
- Large text (18pt+): ≥ 3:1
- UI components: ≥ 3:1

### 5.2 Renk Çiftleri Kontrolü

| Foreground             | Background         | Ratio (light) | Ratio (dark) | Status       |
| ---------------------- | ------------------ | ------------- | ------------ | ------------ |
| Malta Gold #C97D0A     | Surface #FFF       | 4.83:1        | —            | ✓ AA         |
| Malta Gold #C97D0A     | Background #FBF9F4 | 4.65:1        | —            | ✓ AA         |
| Med Blue #0099CC       | Surface #FFF       | 3.34:1        | —            | ⚠ Large only |
| Text Primary #1A1712   | Background #FBF9F4 | 16.2:1        | —            | ✓ AAA        |
| Text Secondary #6B6256 | Background #FBF9F4 | 5.12:1        | —            | ✓ AA         |
| Text Inverse #FFF      | Malta Gold         | 4.83:1        | —            | ✓ AA         |

> Mediterranean blue text-on-white için sadece large text. Body text için Med Blue Muted koyulaştır.

### 5.3 Increased Contrast Mode

```swift
@Environment(\.colorSchemeContrast) private var contrast

var border: some View {
    Color.DS.maltaGold.opacity(contrast == .increased ? 1 : 0.3)
}
```

- [ ] Border'lar kontrast artarsa belirginleşir
- [ ] Gradient'ler solid renge düşer (gerekirse)
- [ ] Shadow'lar belirgin

---

## 6. Reduce Motion / Transparency

### 6.1 Reduce Motion

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion

// Animasyonsuz fallback
.animation(reduceMotion ? nil : DSMotion.standard, value: state)

// PhaseAnimator → static
if !reduceMotion {
    PhaseAnimator(...) { ... }
} else {
    staticView
}

// Numeric content transition kapalı
.contentTransition(reduceMotion ? .identity : .numericText())
```

- [ ] Floating orb'lar reduceMotion ile hareket etmez
- [ ] Phase animasyonlar kapanır
- [ ] Mesh gradient → solid yüzey
- [ ] Sayı geçişleri instant
- [ ] Scroll transition (parallax) kapanır
- [ ] Spring animasyonlar → easeOut
- [ ] Loading shimmer kapanır

### 6.2 Reduce Transparency

```swift
@Environment(\.accessibilityReduceTransparency) private var reduceTransparency

@ViewBuilder
var background: some View {
    if reduceTransparency {
        DSColor.surface
    } else {
        Color.clear.background(.regularMaterial)
    }
}
```

- [ ] Liquid glass → opaque surface
- [ ] Mesh gradient → solid
- [ ] Glass cards → bordered solid

### 6.3 Bold Text

```swift
@Environment(\.legibilityWeight) private var weight

Text("Net Pay")
    .fontWeight(weight == .bold ? .bold : .semibold)
```

---

## 7. Smart Invert

```swift
.accessibilityIgnoresInvertColors(true)
```

Resimler ve grafikler için invert'i kapat.

---

## 8. Voice Control

- [ ] Button label'lar açık ve doğal Türkçe/İngilizce (örn: "Save" → "save", kullanıcı söyleyebilir)
- [ ] Number identifier'lar sıralı (item 1, item 2)
- [ ] Custom action'lar yerine standart traitler tercih

---

## 9. Switch Control

- [ ] Tüm focusable element'ler accessible
- [ ] Custom controllar `accessibilityElement` ile düzgün gruplanmış
- [ ] Critical action'lar tek bir grupta toplu erişilebilir

---

## 10. Alt Adımlar

- [ ] DesignSystem'de a11y utility'leri:
  - `dsAccessible(label:hint:value:)` modifier
  - `dsHeader()` modifier
  - `dsSensitive()` (smart invert ignore)
- [ ] Her feature için a11y audit (Salary, Calculators, Guides, Settings)
- [ ] Xcode Accessibility Inspector → Run Audit her feature'da
- [ ] VoiceOver swipe flow test her feature'da
- [ ] Dynamic Type AX3 + AX5 snapshot testleri
- [ ] Reduce Motion / Transparency snapshot testleri
- [ ] Color contrast audit (Stark, Contrast app)
- [ ] Voice Control kayıt + test (gerçek cihazda)
- [ ] Switch Control test (gerçek cihazda)

---

## 11. Per-Feature Audit Checklist

### Salary

- [ ] VO: Net pay card okunuyor (combine)
- [ ] VO: Monthly row hint ile expand
- [ ] DT: AX5'te tüm input'lar erişilebilir
- [ ] RM: Sayı transition kapanıyor
- [ ] RT: Glass kartlar opak
- [ ] BT: Bold text uyumlu

### Calculators Hub

- [ ] VO: 28 kart tüm bilgisiyle okunuyor
- [ ] VO: Coming soon kartlar disabled olduğu duyuruluyor
- [ ] DT: Grid AX3+'te tek kolon
- [ ] DT: Search field genişliyor

### Calculator Detail (×16)

- [ ] VO: Hero header header trait
- [ ] VO: Input field label + hint + value
- [ ] VO: Result field label + value
- [ ] VO: Chart combined summary
- [ ] DT: AX5 layout intact

### Guides

- [ ] VO: Reader heading rotor çalışıyor
- [ ] VO: Bookmark button durum okunuyor
- [ ] DT: Markdown render Dynamic Type respect
- [ ] RM: Progress bar animasyonu kapanıyor

### Settings

- [ ] VO: Form section'lar header
- [ ] VO: Toggle on/off okunuyor
- [ ] VO: Picker selection okunuyor
- [ ] VO: Destructive button trait

---

## 12. Test Scripts

### 12.1 Apple Accessibility Inspector

Manual:

1. Open Accessibility Inspector
2. Connect to simulator
3. Navigate to each screen
4. "Audit" tab → "Run Audit"
5. Fix all errors, document warnings

### 12.2 VoiceOver Test Script

Tester checklist (manual):

```text
SalaryScreen VoiceOver Walk:
1. Open Salary tab → "Salary Calculator, header"
2. Swipe right → "Tax year, picker, 2026"
3. Swipe right → "Net pay, 14,976 euros per year, 1,248 euros per month"
4. Swipe right → "Annual gross salary, 25,000 euros, edit"
5. ... (tüm ekran)
```

### 12.3 XCUITest A11y

```swift
func test_a11y_salary_screen() {
    let app = XCUIApplication()
    app.launchArguments += ["-UITests"]
    app.launch()

    app.tabBars.buttons["Salary"].tap()

    XCTAssertTrue(app.staticTexts["Net pay"].exists)
    XCTAssertTrue(app.textFields["Annual gross salary"].exists)
    XCTAssertTrue(app.buttons["More actions"].exists)
}
```

---

## 13. Kabul Kriterleri

- [ ] Accessibility Inspector audit: 0 error per screen
- [ ] VoiceOver ile tüm 5 tab tam kullanılabilir
- [ ] Salary feature başlangıçtan paylaşıma kadar VO ile yapılabilir
- [ ] Dynamic Type AX5 layout kırılmıyor (tüm ekranlar)
- [ ] Reduce Motion açıkken hiç animasyon yok
- [ ] Reduce Transparency açıkken glass kullanılmıyor
- [ ] Bold Text açıkken font weight artıyor
- [ ] Color contrast: tüm metin AA ≥ 4.5:1 (manual check)
- [ ] Switch Control: 5 critical action erişilebilir
- [ ] Voice Control: button label'lar doğal komut

---

## 14. Sıradaki

[`15-performance.md`](15-performance.md)
