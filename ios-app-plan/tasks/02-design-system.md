# Task 02 — Design System Foundation (Liquid Glass)

> **Faz**: M2
> **Ön koşul**: [`01-project-setup.md`](01-project-setup.md) tamamlandı
> **Çıktı**: `DesignSystem` SPM paketi — tokens, materials, base controls, snapshot testleri

---

## 1. Amaç

Web tarafındaki glassmorphism + gradient tasarımını **iOS 26 Liquid Glass** ile yeniden üretmek. Tüm feature'lar `DesignSystem`'i tüketir; raw color veya raw material kullanmaz.

---

## 2. Paket Yapısı

```
Packages/DesignSystem/
├── Package.swift
├── Sources/DesignSystem/
│   ├── Tokens/
│   │   ├── Colors+DS.swift
│   │   ├── Typography+DS.swift
│   │   ├── Spacing+DS.swift
│   │   ├── Radius+DS.swift
│   │   └── Motion+DS.swift
│   ├── Materials/
│   │   ├── LiquidGlass.swift          # .liquidGlass() view modifier
│   │   ├── MeshBackground.swift       # fullscreen mesh gradient
│   │   ├── FloatingOrbs.swift         # orb-gold, orb-blue, orb-coral
│   │   └── GradientText.swift         # text-gradient primary/secondary
│   ├── Controls/
│   │   ├── DSButton.swift             # primary, secondary, glow variants
│   │   ├── DSNumericField.swift       # Euro input, thousand separator
│   │   ├── DSToggleGroup.swift        # segmented benzeri
│   │   ├── DSCard.swift               # premium-card karşılığı
│   │   ├── DSChip.swift               # kategori / tag
│   │   ├── DSSectionHeader.swift
│   │   └── DSEmptyState.swift
│   ├── Charts/
│   │   ├── DSBreakdownChart.swift     # donut/bar, salary breakdown
│   │   └── DSAmortizationChart.swift  # line chart, mortgage
│   └── Previews/
│       └── ComponentGallery.swift     # #Preview tüm componentleri listeler
└── Tests/DesignSystemTests/
    └── DesignSystemSnapshotTests.swift
```

---

## 3. Tokens

### 3.1 Colors (`Colors+DS.swift`)

```swift
public extension Color {
    enum DS {
        // Brand
        public static let maltaGold = Color(light: "#C97D0A", dark: "#E89A20")
        public static let mediterraneanBlue = Color(light: "#0099CC", dark: "#2CB5E0")
        public static let maltaRed = Color(light: "#E2352A", dark: "#F04A3E")

        // Surfaces
        public static let background = Color(light: "#FBF9F4", dark: "#121417")
        public static let surface = Color(light: "#FFFFFF", dark: "#1A1D22")
        public static let surfaceMuted = Color(light: "#F3EFE7", dark: "#22262D")

        // Text
        public static let textPrimary = Color(light: "#1A1712", dark: "#F4F1E8")
        public static let textSecondary = Color(light: "#6B6256", dark: "#A39B8E")
    }
}
```

Web'deki HSL değerleri bire bir aktarıldı.

### 3.2 Typography

Malta Gold brand için **New York** (serif) başlıklar ve **SF Pro Rounded** gövde için değerlendir. Web'de `font-cal` kullanılıyor, iOS'ta serif karşılığı.

```swift
public extension Font {
    enum DS {
        static func display(_ size: CGFloat) -> Font {
            .system(size: size, weight: .bold, design: .serif)
        }
        static func heading(_ size: CGFloat) -> Font {
            .system(size: size, weight: .semibold, design: .rounded)
        }
        static func body(_ size: CGFloat = 16) -> Font {
            .system(size: size, weight: .regular, design: .default)
        }
        static func mono(_ size: CGFloat = 14) -> Font {
            .system(size: size, weight: .medium, design: .monospaced)
        }
    }
}
```

### 3.3 Spacing, Radius, Motion

```swift
public enum DSSpacing {
    public static let xxs: CGFloat = 4
    public static let xs: CGFloat = 8
    public static let sm: CGFloat = 12
    public static let md: CGFloat = 16
    public static let lg: CGFloat = 24
    public static let xl: CGFloat = 32
    public static let xxl: CGFloat = 48
}

public enum DSRadius {
    public static let sm: CGFloat = 8
    public static let md: CGFloat = 12
    public static let lg: CGFloat = 16
    public static let xl: CGFloat = 20
    public static let pill: CGFloat = 999
}

public enum DSMotion {
    public static let quick = Animation.easeOut(duration: 0.2)
    public static let standard = Animation.easeInOut(duration: 0.35)
    public static let expressive = Animation.spring(response: 0.5, dampingFraction: 0.75)
}
```

---

## 4. Materials

### 4.1 `.liquidGlass()` Modifier

```swift
public extension View {
    @ViewBuilder
    func liquidGlass(
        shape: some Shape = RoundedRectangle(cornerRadius: DSRadius.lg),
        tint: Color? = nil
    ) -> some View {
        if #available(iOS 26.0, *) {
            self.glassEffect(.regular.tint(tint ?? .clear), in: shape)
        } else {
            self
                .background(.regularMaterial, in: shape)
                .overlay(shape.strokeBorder(.white.opacity(0.18)))
                .shadow(color: .black.opacity(0.08), radius: 20, y: 8)
        }
    }
}
```

### 4.2 `MeshBackground`

iOS 18+ `MeshGradient` — 4 nokta Malta gold + blue + coral blend. Fallback iOS 17 için 4 x `RadialGradient` ZStack.

### 4.3 `FloatingOrbs`

Reusable view — 3 adet blur edilmiş radial gradient daire, `PhaseAnimator` ile yavaşça döner/ölçeklenir. Parametreler: count, colors, intensity, speed.

### 4.4 `GradientText`

```swift
public struct GradientText: View {
    let text: String
    let gradient: LinearGradient
    public var body: some View {
        Text(text).foregroundStyle(gradient)
    }
}
```

Preset'ler: `.primaryMalta`, `.secondaryMed`.

---

## 5. Controls

### 5.1 `DSButton`

Variant'lar: `.primary`, `.secondary`, `.ghost`, `.glow`, `.destructive`.
`.glow` variant'ı web'deki `btn-glow` animasyonu — shimmer overlay ve pulse shadow.

### 5.2 `DSNumericField`

- `value: Binding<Decimal>`
- Euro prefix, binlik ayraç
- iPad keyboard: decimalPad, iPhone: numberPad
- `.onSubmit` ile model güncelleme
- A11y: VoiceOver label ve hint

### 5.3 `DSToggleGroup`

Web'de `ToggleGroup<T extends string>` — iOS karşılığı generic:

```swift
public struct DSToggleGroup<Value: Hashable>: View {
    let options: [Value]
    @Binding var selection: Value
    let label: (Value) -> String
    // ...
}
```

### 5.4 `DSCard`

- Default: `.liquidGlass()` backdrop, `.padding(DSSpacing.lg)`
- Variants: `.default`, `.highlighted` (gold border), `.hero` (gradient border)
- Hover/press efektleri (sensoryFeedback + scaleEffect)

### 5.5 `DSSectionHeader`

Web'deki kategori başlığı — gradient icon kutusu + başlık + subtitle.

---

## 6. Charts

### 6.1 `DSBreakdownChart`

Donut chart — `Gross`, `SSC`, `Income Tax`, `Net` segmentleri, Swift Charts `SectorMark`. Orta boşlukta toplam net maaş.

### 6.2 `DSAmortizationChart`

Line chart — principal vs interest. Tooltip, drag-to-inspect.

---

## 7. Component Gallery

`ComponentGallery.swift` — `#Preview` ile tüm bileşenleri tek bir SwiftUI sahnesinde listeler. Snapshot test buradan alınır.

---

## 8. Testing

### 8.1 Snapshot Tests

- [ ] `pointfreeco/swift-snapshot-testing` paketi eklenir
- [ ] `DSButton` her variant ve state (normal, pressed, disabled) için snapshot
- [ ] `DSCard`, `DSNumericField`, `DSToggleGroup`, `DSBreakdownChart` aynı şekilde
- [ ] Light/Dark mode iki snapshot set
- [ ] Dynamic Type: xSmall, L, AX3 snapshot'ları

### 8.2 Unit Tests

- [ ] Token değerlerinin beklenen HEX'lere çözüldüğü
- [ ] `liquidGlass()` modifier'ının iOS 26 branch'ine girdiği
- [ ] `DSNumericField` binding'inin decimal parse doğruluğu

---

## 9. Kabul Kriterleri

- [ ] `DesignSystem` paketi 0 hata/warning ile derleniyor
- [ ] `ComponentGallery` preview'ı 60 fps akıcı
- [ ] Tüm public API'ler `public` ve DocC comment'li
- [ ] Light & Dark tema snapshot testleri geçiyor
- [ ] Dynamic Type AX3 seviyesinde layout kırılmıyor
- [ ] SwiftLint 0 violation

---

## 10. Sıradaki

[`03-calculation-kit.md`](03-calculation-kit.md)
