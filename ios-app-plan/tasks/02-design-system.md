# Task 02 — Design System Foundation (Liquid Glass)

> **Faz**: M2
> **Ön koşul**: [`01-project-setup.md`](01-project-setup.md) tamamlandı
> **Çıktı**: `DesignSystem` SPM paketi — tokens, materials, base controls, snapshot testleri

---

## 1. Amaç

Web tarafındaki glassmorphism + gradient tasarımını iOS 26 Liquid Glass ile yeniden üretmek. Tüm feature'lar `DesignSystem`'i tüketir; raw color veya raw material kullanmaz.

---

## 2. Paket Yapısı

```text
Packages/DesignSystem/
├── Package.swift
├── Sources/DesignSystem/
│   ├── DesignSystem.swift                  # public umbrella re-exports
│   ├── Tokens/
│   │   ├── DSColor.swift
│   │   ├── DSGradient.swift
│   │   ├── DSFont.swift
│   │   ├── DSSpacing.swift
│   │   ├── DSRadius.swift
│   │   ├── DSShadow.swift
│   │   └── DSMotion.swift
│   ├── Extensions/
│   │   ├── Color+Hex.swift
│   │   ├── View+LiquidGlass.swift
│   │   ├── View+Shimmer.swift
│   │   ├── View+Reveal.swift
│   │   └── View+Haptic.swift
│   ├── Materials/
│   │   ├── MeshBackground.swift
│   │   ├── FloatingOrbs.swift
│   │   ├── GradientText.swift
│   │   └── AnimatedMesh.swift
│   ├── Controls/
│   │   ├── DSButton.swift
│   │   ├── DSButtonStyle.swift
│   │   ├── DSNumericField.swift
│   │   ├── DSCurrencyField.swift
│   │   ├── DSPercentField.swift
│   │   ├── DSToggleGroup.swift
│   │   ├── DSSegmentedPicker.swift
│   │   ├── DSChip.swift
│   │   ├── DSCard.swift
│   │   ├── DSSection.swift
│   │   ├── DSSectionHeader.swift
│   │   ├── DSEmptyState.swift
│   │   ├── DSAnimatedNumber.swift
│   │   ├── DSStepper.swift
│   │   ├── DSSliderField.swift
│   │   ├── DSDatePickerCard.swift
│   │   ├── DSBadge.swift
│   │   └── DSSearchField.swift
│   ├── Charts/
│   │   ├── DSBreakdownChart.swift
│   │   ├── DSAmortizationChart.swift
│   │   ├── DSLineChart.swift
│   │   └── DSComparisonBar.swift
│   └── Previews/
│       ├── ComponentGallery.swift
│       └── TokensGallery.swift
├── Resources/
│   └── Colors.xcassets
└── Tests/DesignSystemTests/
    ├── __Snapshots__/
    ├── DSButtonSnapshotTests.swift
    ├── DSCardSnapshotTests.swift
    ├── DSBreakdownChartSnapshotTests.swift
    └── TokenTests.swift
```

---

## 3. Tokens

### 3.1 `Color+Hex.swift`

```swift
import SwiftUI

extension Color {
    /// HEX renkleri parse eder: #RRGGBB, #RRGGBBAA, 3/4/6/8 karakter desteği
    init(hex: String, alpha: Double = 1.0) {
        let cleaned = hex.trimmingCharacters(in: .whitespacesAndNewlines)
            .replacingOccurrences(of: "#", with: "")
        var rgb: UInt64 = 0
        Scanner(string: cleaned).scanHexInt64(&rgb)
        let r, g, b, a: Double
        switch cleaned.count {
        case 6:
            r = Double((rgb & 0xFF0000) >> 16) / 255
            g = Double((rgb & 0x00FF00) >> 8) / 255
            b = Double(rgb & 0x0000FF) / 255
            a = alpha
        case 8:
            r = Double((rgb & 0xFF000000) >> 24) / 255
            g = Double((rgb & 0x00FF0000) >> 16) / 255
            b = Double((rgb & 0x0000FF00) >> 8) / 255
            a = Double(rgb & 0x000000FF) / 255
        default:
            r = 0; g = 0; b = 0; a = 1
        }
        self.init(red: r, green: g, blue: b, opacity: a)
    }

    /// Light/dark mode dynamic color
    init(light: String, dark: String) {
        self.init(uiColor: UIColor { trait in
            UIColor(Color(hex: trait.userInterfaceStyle == .dark ? dark : light))
        })
    }
}
```

### 3.2 `DSColor.swift`

```swift
import SwiftUI

public enum DSColor {
    // Brand
    public static let maltaGold = Color(light: "#C97D0A", dark: "#E89A20")
    public static let maltaGoldMuted = Color(light: "#B86F08", dark: "#D4891C")
    public static let mediterraneanBlue = Color(light: "#0099CC", dark: "#2CB5E0")
    public static let mediterraneanBlueMuted = Color(light: "#0077B6", dark: "#1A9FCC")
    public static let maltaRed = Color(light: "#E2352A", dark: "#F04A3E")
    public static let warmSand = Color(light: "#F7ECD6", dark: "#2A241A")

    // Surfaces
    public static let background = Color(light: "#FBF9F4", dark: "#0F1114")
    public static let surface = Color(light: "#FFFFFF", dark: "#1A1D22")
    public static let surfaceMuted = Color(light: "#F3EFE7", dark: "#22262D")
    public static let surfaceElevated = Color(light: "#FFFFFF", dark: "#242831")

    // Text
    public static let textPrimary = Color(light: "#1A1712", dark: "#F4F1E8")
    public static let textSecondary = Color(light: "#6B6256", dark: "#A39B8E")
    public static let textTertiary = Color(light: "#9B9285", dark: "#766F65")
    public static let textInverse = Color(light: "#FFFFFF", dark: "#0F1114")

    // Semantic
    public static let success = Color(light: "#11998E", dark: "#1CB49E")
    public static let warning = Color(light: "#F59E0B", dark: "#FBBF24")
    public static let danger = Color(light: "#E2352A", dark: "#F04A3E")
    public static let info = Color(light: "#0099CC", dark: "#2CB5E0")

    // Glass (overlay)
    public static let glassTint = Color(light: "#FFFFFF", dark: "#000000")
    public static let glassStroke = Color(light: "#FFFFFF", dark: "#FFFFFF")

    // Category gradients (calculator grid icon boxes)
    public static let categoryEmployment = [Color(hex: "#F59E0B"), Color(hex: "#EA580C")]
    public static let categoryFamily = [Color(hex: "#EC4899"), Color(hex: "#E11D48")]
    public static let categoryProperty = [Color(hex: "#10B981"), Color(hex: "#059669")]
    public static let categoryBanking = [Color(hex: "#0EA5E9"), Color(hex: "#2563EB")]
    public static let categoryRetirement = [Color(hex: "#3B82F6"), Color(hex: "#06B6D4")]
    public static let categorySelfEmp = [Color(hex: "#8B5CF6"), Color(hex: "#9333EA")]
    public static let categoryLeave = [Color(hex: "#14B8A6"), Color(hex: "#10B981")]
    public static let categoryTransport = [Color(hex: "#64748B"), Color(hex: "#475569")]
    public static let categoryImmigration = [Color(hex: "#6366F1"), Color(hex: "#7C3AED")]
}
```

### 3.3 `DSGradient.swift`

```swift
import SwiftUI

public enum DSGradient {
    public static let primary = LinearGradient(
        colors: [Color(hex: "#C97D0A"), Color(hex: "#B86F08"), Color(hex: "#A56006")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    public static let secondary = LinearGradient(
        colors: [Color(hex: "#0099CC"), Color(hex: "#0077B6"), Color(hex: "#005F8A")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    public static let accent = LinearGradient(
        colors: [Color(hex: "#FFECD2"), Color(hex: "#FCB69F")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    public static let success = LinearGradient(
        colors: [Color(hex: "#11998E"), Color(hex: "#38EF7D")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    public static let danger = LinearGradient(
        colors: [Color(hex: "#EB3349"), Color(hex: "#F45C43")],
        startPoint: .topLeading, endPoint: .bottomTrailing
    )

    /// Category gradient helper
    public static func category(_ colors: [Color]) -> LinearGradient {
        LinearGradient(colors: colors, startPoint: .topLeading, endPoint: .bottomTrailing)
    }
}
```

### 3.4 `DSFont.swift`

```swift
import SwiftUI

public enum DSFont {
    /// Display — serif "Cal Sans" benzeri, web'deki font-cal
    public static func display(_ size: CGFloat, weight: Font.Weight = .bold) -> Font {
        .system(size: size, weight: weight, design: .serif)
    }

    public static var displayXL: Font { display(48) }
    public static var displayL: Font { display(40) }
    public static var displayM: Font { display(32) }
    public static var displayS: Font { display(24) }

    /// Heading — rounded, ikincil başlıklar
    public static func heading(_ size: CGFloat, weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .rounded)
    }

    public static var headingL: Font { heading(22) }
    public static var headingM: Font { heading(18) }
    public static var headingS: Font { heading(16) }

    /// Body — default sistem fontu
    public static func body(_ size: CGFloat = 16, weight: Font.Weight = .regular) -> Font {
        .system(size: size, weight: weight, design: .default)
    }

    public static var bodyL: Font { body(17) }
    public static var bodyM: Font { body(15) }
    public static var bodyS: Font { body(13) }
    public static var caption: Font { body(11, weight: .medium) }

    /// Monospaced — sayısal değerler için
    public static func mono(_ size: CGFloat = 14, weight: Font.Weight = .medium) -> Font {
        .system(size: size, weight: weight, design: .monospaced)
    }
}
```

### 3.5 Spacing, Radius, Shadow, Motion

```swift
public enum DSSpacing {
    public static let xxs: CGFloat = 4
    public static let xs: CGFloat = 8
    public static let sm: CGFloat = 12
    public static let md: CGFloat = 16
    public static let lg: CGFloat = 24
    public static let xl: CGFloat = 32
    public static let xxl: CGFloat = 48
    public static let xxxl: CGFloat = 64
}

public enum DSRadius {
    public static let xs: CGFloat = 4
    public static let sm: CGFloat = 8
    public static let md: CGFloat = 12
    public static let lg: CGFloat = 16
    public static let xl: CGFloat = 20
    public static let xxl: CGFloat = 28
    public static let pill: CGFloat = 9999
}

public enum DSShadow {
    public static let card = Shadow(
        color: Color.black.opacity(0.08),
        radius: 20, x: 0, y: 8
    )
    public static let elevated = Shadow(
        color: Color.black.opacity(0.12),
        radius: 32, x: 0, y: 12
    )
    public static let glow = Shadow(
        color: Color(hex: "#C97D0A").opacity(0.35),
        radius: 30, x: 0, y: 0
    )
    public static let pressed = Shadow(
        color: Color.black.opacity(0.06),
        radius: 8, x: 0, y: 2
    )

    public struct Shadow: Sendable {
        public let color: Color
        public let radius: CGFloat
        public let x: CGFloat
        public let y: CGFloat
    }
}

public extension View {
    func dsShadow(_ shadow: DSShadow.Shadow) -> some View {
        self.shadow(color: shadow.color, radius: shadow.radius, x: shadow.x, y: shadow.y)
    }
}

public enum DSMotion {
    public static let quick = Animation.easeOut(duration: 0.18)
    public static let standard = Animation.easeInOut(duration: 0.32)
    public static let slow = Animation.easeInOut(duration: 0.5)
    public static let expressive = Animation.spring(response: 0.5, dampingFraction: 0.75)
    public static let bouncy = Animation.spring(response: 0.45, dampingFraction: 0.65)
    public static let float = Animation.easeInOut(duration: 6).repeatForever(autoreverses: true)
    public static let glow = Animation.easeInOut(duration: 3).repeatForever(autoreverses: true)
}
```

---

## 4. Materials & Effects

### 4.1 `View+LiquidGlass.swift`

```swift
import SwiftUI

public extension View {
    /// Reusable Liquid Glass modifier, iOS 26 native + iOS 18 fallback.
    @ViewBuilder
    func liquidGlass(
        shape: some Shape = RoundedRectangle(cornerRadius: DSRadius.xl),
        tint: Color? = nil,
        strength: LiquidGlassStrength = .regular
    ) -> some View {
        if #available(iOS 26.0, *) {
            self.glassEffect(strength.glassEffect.tint(tint ?? .clear), in: shape)
        } else {
            self
                .background(strength.material, in: shape)
                .overlay(
                    shape.strokeBorder(
                        LinearGradient(
                            colors: [
                                .white.opacity(0.35),
                                .white.opacity(0.08),
                            ],
                            startPoint: .top, endPoint: .bottom
                        ),
                        lineWidth: 1
                    )
                )
                .dsShadow(DSShadow.card)
        }
    }
}

public enum LiquidGlassStrength: Sendable {
    case thin, regular, thick

    @available(iOS 26.0, *)
    var glassEffect: GlassEffect {
        switch self {
        case .thin: return .thin
        case .regular: return .regular
        case .thick: return .thick
        }
    }

    var material: Material {
        switch self {
        case .thin: return .thinMaterial
        case .regular: return .regularMaterial
        case .thick: return .thickMaterial
        }
    }
}
```

### 4.2 `MeshBackground.swift`

```swift
import SwiftUI

public struct MeshBackground: View {
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @Environment(\.colorScheme) private var colorScheme

    public init() {}

    public var body: some View {
        if reduceTransparency {
            DSColor.background
        } else if #available(iOS 18.0, *) {
            mesh.ignoresSafeArea()
        } else {
            fallback.ignoresSafeArea()
        }
    }

    @available(iOS 18.0, *)
    private var mesh: some View {
        MeshGradient(
            width: 3, height: 3,
            points: [
                [0, 0], [0.5, 0], [1, 0],
                [0, 0.5], [0.5, 0.5], [1, 0.5],
                [0, 1], [0.5, 1], [1, 1],
            ],
            colors: colorScheme == .dark ? darkPalette : lightPalette
        )
    }

    private var fallback: some View {
        ZStack {
            DSColor.background
            RadialGradient(
                colors: [DSColor.maltaGold.opacity(0.15), .clear],
                center: .topLeading, startRadius: 20, endRadius: 400
            )
            RadialGradient(
                colors: [DSColor.mediterraneanBlue.opacity(0.12), .clear],
                center: .topTrailing, startRadius: 20, endRadius: 400
            )
            RadialGradient(
                colors: [Color(hex: "#FFB070").opacity(0.10), .clear],
                center: .bottomTrailing, startRadius: 20, endRadius: 400
            )
            RadialGradient(
                colors: [DSColor.maltaRed.opacity(0.08), .clear],
                center: .bottomLeading, startRadius: 20, endRadius: 400
            )
        }
    }

    private var lightPalette: [Color] {
        [
            Color(hex: "#FBF9F4"), Color(hex: "#FBF9F4"), Color(hex: "#F7ECD6"),
            Color(hex: "#FBF9F4"), Color(hex: "#FFFFFF"), Color(hex: "#E8F5FA"),
            Color(hex: "#FFECD2"), Color(hex: "#FBF9F4"), Color(hex: "#E8F5FA"),
        ]
    }

    private var darkPalette: [Color] {
        [
            Color(hex: "#0F1114"), Color(hex: "#14171C"), Color(hex: "#1A1814"),
            Color(hex: "#14171C"), Color(hex: "#0F1114"), Color(hex: "#0E2630"),
            Color(hex: "#1A1814"), Color(hex: "#14171C"), Color(hex: "#0E2630"),
        ]
    }
}
```

### 4.3 `FloatingOrbs.swift`

```swift
import SwiftUI

public struct FloatingOrbs: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    let configuration: OrbConfiguration
    @State private var phase: OrbPhase = .start

    public init(_ configuration: OrbConfiguration = .default) {
        self.configuration = configuration
    }

    public var body: some View {
        ZStack {
            ForEach(configuration.orbs.indices, id: \.self) { index in
                let orb = configuration.orbs[index]
                Circle()
                    .fill(
                        RadialGradient(
                            colors: [orb.color.opacity(0.4), .clear],
                            center: .center, startRadius: 0, endRadius: orb.radius
                        )
                    )
                    .frame(width: orb.radius * 2, height: orb.radius * 2)
                    .blur(radius: 60)
                    .offset(phase.offset(for: index))
                    .opacity(phase.opacity)
            }
        }
        .allowsHitTesting(false)
        .onAppear { if !reduceMotion { startAnimation() } }
    }

    private func startAnimation() {
        withAnimation(.easeInOut(duration: 15).repeatForever(autoreverses: true)) {
            phase = .end
        }
    }
}

public struct OrbConfiguration: Sendable {
    public let orbs: [Orb]

    public struct Orb: Sendable {
        public let color: Color
        public let radius: CGFloat
        public let startOffset: CGSize
        public let endOffset: CGSize
    }

    public static let `default` = OrbConfiguration(orbs: [
        .init(color: DSColor.maltaGold, radius: 150,
              startOffset: .init(width: -100, height: -200),
              endOffset: .init(width: 80, height: -150)),
        .init(color: DSColor.mediterraneanBlue, radius: 130,
              startOffset: .init(width: 120, height: 0),
              endOffset: .init(width: -60, height: 120)),
        .init(color: DSColor.maltaRed, radius: 110,
              startOffset: .init(width: 0, height: 200),
              endOffset: .init(width: 100, height: -80)),
    ])
}

enum OrbPhase {
    case start, end

    func offset(for index: Int) -> CGSize {
        switch self {
        case .start: return OrbConfiguration.default.orbs[index].startOffset
        case .end: return OrbConfiguration.default.orbs[index].endOffset
        }
    }

    var opacity: Double {
        switch self {
        case .start: return 0.6
        case .end: return 0.8
        }
    }
}
```

### 4.4 `GradientText.swift`

```swift
import SwiftUI

public struct GradientText: View {
    let text: String
    let gradient: LinearGradient
    let font: Font

    public init(
        _ text: String,
        gradient: LinearGradient = DSGradient.primary,
        font: Font = DSFont.displayL
    ) {
        self.text = text
        self.gradient = gradient
        self.font = font
    }

    public var body: some View {
        Text(text)
            .font(font)
            .foregroundStyle(gradient)
    }
}
```

### 4.5 `View+Shimmer.swift`

```swift
import SwiftUI

public extension View {
    /// Loading shimmer overlay
    func shimmer(active: Bool = true) -> some View {
        self.modifier(ShimmerModifier(active: active))
    }
}

struct ShimmerModifier: ViewModifier {
    let active: Bool
    @State private var phase: CGFloat = -1

    func body(content: Content) -> some View {
        content.overlay(
            LinearGradient(
                stops: [
                    .init(color: .clear, location: 0),
                    .init(color: .white.opacity(0.3), location: 0.5),
                    .init(color: .clear, location: 1),
                ],
                startPoint: .leading, endPoint: .trailing
            )
            .rotationEffect(.degrees(30))
            .offset(x: phase * 300)
            .blendMode(.plusLighter)
            .opacity(active ? 1 : 0)
            .allowsHitTesting(false)
        )
        .onAppear {
            guard active else { return }
            withAnimation(.linear(duration: 2).repeatForever(autoreverses: false)) {
                phase = 1
            }
        }
    }
}
```

---

## 5. Controls

### 5.1 `DSButton.swift` + `DSButtonStyle.swift`

```swift
import SwiftUI

public enum DSButtonVariant: Sendable {
    case primary        // Malta gold filled
    case secondary      // Glass background
    case ghost          // Text only
    case glow           // Primary + shimmer + glow shadow
    case destructive    // Red filled
}

public enum DSButtonSize: Sendable {
    case small, regular, large

    var height: CGFloat {
        switch self {
        case .small: return 36
        case .regular: return 48
        case .large: return 56
        }
    }

    var font: Font {
        switch self {
        case .small: return DSFont.body(14, weight: .semibold)
        case .regular: return DSFont.body(16, weight: .semibold)
        case .large: return DSFont.body(17, weight: .bold)
        }
    }

    var horizontalPadding: CGFloat {
        switch self {
        case .small: return DSSpacing.md
        case .regular: return DSSpacing.lg
        case .large: return DSSpacing.xl
        }
    }
}

public struct DSButton: View {
    let title: LocalizedStringResource
    let icon: String?
    let variant: DSButtonVariant
    let size: DSButtonSize
    let isLoading: Bool
    let action: () -> Void

    public init(
        _ title: LocalizedStringResource,
        icon: String? = nil,
        variant: DSButtonVariant = .primary,
        size: DSButtonSize = .regular,
        isLoading: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.icon = icon
        self.variant = variant
        self.size = size
        self.isLoading = isLoading
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            HStack(spacing: DSSpacing.xs) {
                if isLoading {
                    ProgressView().controlSize(.small)
                } else if let icon {
                    Image(systemName: icon)
                }
                Text(title)
            }
            .font(size.font)
        }
        .buttonStyle(DSButtonStyle(variant: variant, size: size))
        .disabled(isLoading)
        .sensoryFeedback(.selection, trigger: isLoading)
    }
}

public struct DSButtonStyle: ButtonStyle {
    let variant: DSButtonVariant
    let size: DSButtonSize

    public func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .foregroundStyle(foregroundColor)
            .padding(.horizontal, size.horizontalPadding)
            .frame(height: size.height)
            .frame(maxWidth: variant == .ghost ? nil : .infinity)
            .background(background)
            .overlay(border)
            .clipShape(RoundedRectangle(cornerRadius: size.height / 2))
            .scaleEffect(configuration.isPressed ? 0.97 : 1)
            .dsShadow(shadow(isPressed: configuration.isPressed))
            .animation(DSMotion.quick, value: configuration.isPressed)
    }

    @ViewBuilder
    private var background: some View {
        switch variant {
        case .primary:
            DSGradient.primary
        case .secondary:
            Color.clear.background(.regularMaterial)
        case .ghost:
            Color.clear
        case .glow:
            DSGradient.primary.overlay(shimmer)
        case .destructive:
            DSGradient.danger
        }
    }

    @ViewBuilder
    private var border: some View {
        switch variant {
        case .secondary:
            RoundedRectangle(cornerRadius: size.height / 2)
                .strokeBorder(DSColor.maltaGold.opacity(0.3), lineWidth: 1)
        default: EmptyView()
        }
    }

    private var foregroundColor: Color {
        switch variant {
        case .primary, .glow, .destructive: return .white
        case .secondary: return DSColor.maltaGold
        case .ghost: return DSColor.maltaGold
        }
    }

    private func shadow(isPressed: Bool) -> DSShadow.Shadow {
        switch variant {
        case .glow: return isPressed ? DSShadow.pressed : DSShadow.glow
        case .primary, .destructive: return isPressed ? DSShadow.pressed : DSShadow.card
        default:
            return .init(color: .clear, radius: 0, x: 0, y: 0)
        }
    }

    private var shimmer: some View {
        Rectangle()
            .fill(
                LinearGradient(
                    colors: [.clear, .white.opacity(0.3), .clear],
                    startPoint: .leading, endPoint: .trailing
                )
            )
            .blendMode(.plusLighter)
    }
}
```

### 5.2 `DSCurrencyField.swift`

```swift
import SwiftUI

public struct DSCurrencyField: View {
    @Binding var value: Decimal
    let label: LocalizedStringResource
    let placeholder: String
    let maxValue: Decimal

    @State private var text: String = ""
    @FocusState private var focused: Bool

    public init(
        label: LocalizedStringResource,
        value: Binding<Decimal>,
        maxValue: Decimal = 10_000_000,
        placeholder: String = "0"
    ) {
        self.label = label
        self._value = value
        self.maxValue = maxValue
        self.placeholder = placeholder
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Text(label)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
                .textCase(.uppercase)
                .tracking(0.5)

            HStack(spacing: DSSpacing.xs) {
                Text("€")
                    .font(DSFont.body(20, weight: .medium))
                    .foregroundStyle(DSColor.textSecondary)

                TextField(placeholder, text: $text)
                    .font(DSFont.body(20, weight: .semibold))
                    .keyboardType(.decimalPad)
                    .focused($focused)
                    .onChange(of: text) { _, newValue in
                        commitText(newValue)
                    }
                    .onAppear {
                        text = formatForDisplay(value)
                    }
            }
            .padding(.horizontal, DSSpacing.md)
            .frame(height: 56)
            .background(
                RoundedRectangle(cornerRadius: DSRadius.lg)
                    .fill(.regularMaterial)
                    .overlay(
                        RoundedRectangle(cornerRadius: DSRadius.lg)
                            .strokeBorder(
                                focused ? DSColor.maltaGold : DSColor.textSecondary.opacity(0.15),
                                lineWidth: focused ? 2 : 1
                            )
                    )
            )
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(label)
        .accessibilityValue("\(value) euros")
    }

    private func commitText(_ newText: String) {
        let sanitized = newText.replacingOccurrences(of: ",", with: ".")
            .filter { $0.isNumber || $0 == "." }
        guard let parsed = Decimal(string: sanitized) else { return }
        value = min(parsed, maxValue)
    }

    private func formatForDisplay(_ val: Decimal) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = 2
        return formatter.string(from: val as NSDecimalNumber) ?? ""
    }
}
```

### 5.3 `DSToggleGroup.swift`

```swift
import SwiftUI

public struct DSToggleGroup<Value: Hashable & Sendable>: View {
    let options: [Value]
    @Binding var selection: Value
    let label: (Value) -> String

    public init(options: [Value], selection: Binding<Value>, label: @escaping (Value) -> String) {
        self.options = options
        self._selection = selection
        self.label = label
    }

    public var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(options.enumerated()), id: \.offset) { index, option in
                Button {
                    withAnimation(DSMotion.quick) { selection = option }
                } label: {
                    Text(label(option))
                        .font(DSFont.body(14, weight: .medium))
                        .foregroundStyle(selection == option ? .white : DSColor.textPrimary)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background {
                            if selection == option {
                                RoundedRectangle(cornerRadius: DSRadius.sm)
                                    .fill(DSGradient.primary)
                                    .matchedGeometryEffect(id: "toggle", in: namespace)
                            }
                        }
                }
                .buttonStyle(.plain)
                .sensoryFeedback(.selection, trigger: selection)
            }
        }
        .padding(4)
        .background(.regularMaterial, in: RoundedRectangle(cornerRadius: DSRadius.md))
        .overlay(
            RoundedRectangle(cornerRadius: DSRadius.md)
                .strokeBorder(DSColor.textSecondary.opacity(0.15), lineWidth: 1)
        )
    }

    @Namespace private var namespace
}
```

### 5.4 `DSCard.swift`

```swift
import SwiftUI

public enum DSCardVariant: Sendable {
    case `default`      // glass background
    case highlighted    // gold border + subtle glow
    case hero           // gradient border + elevated shadow
    case destructive    // red tint
}

public struct DSCard<Content: View>: View {
    let variant: DSCardVariant
    let padding: CGFloat
    @ViewBuilder let content: Content

    public init(
        _ variant: DSCardVariant = .default,
        padding: CGFloat = DSSpacing.lg,
        @ViewBuilder content: () -> Content
    ) {
        self.variant = variant
        self.padding = padding
        self.content = content()
    }

    public var body: some View {
        content
            .padding(padding)
            .liquidGlass(
                shape: RoundedRectangle(cornerRadius: DSRadius.xl),
                tint: tint
            )
            .overlay {
                if variant == .hero {
                    RoundedRectangle(cornerRadius: DSRadius.xl)
                        .strokeBorder(DSGradient.primary, lineWidth: 2)
                } else if variant == .highlighted {
                    RoundedRectangle(cornerRadius: DSRadius.xl)
                        .strokeBorder(DSColor.maltaGold.opacity(0.5), lineWidth: 1.5)
                }
            }
            .dsShadow(variant == .hero ? DSShadow.elevated : DSShadow.card)
    }

    private var tint: Color? {
        switch variant {
        case .default, .hero: return nil
        case .highlighted: return DSColor.maltaGold.opacity(0.05)
        case .destructive: return DSColor.maltaRed.opacity(0.05)
        }
    }
}
```

### 5.5 `DSAnimatedNumber.swift`

Sayı değişikliklerini smooth animate eden view.

```swift
import SwiftUI

public struct DSAnimatedNumber: View {
    let value: Decimal
    let format: NumberFormat
    let font: Font

    public enum NumberFormat: Sendable {
        case currency
        case percent
        case decimal(fractionDigits: Int)
    }

    public init(
        _ value: Decimal,
        format: NumberFormat = .currency,
        font: Font = DSFont.display(40)
    ) {
        self.value = value
        self.format = format
        self.font = font
    }

    public var body: some View {
        Text(formatted)
            .font(font)
            .contentTransition(.numericText(value: Double(truncating: value as NSDecimalNumber)))
            .monospacedDigit()
    }

    private var formatted: String {
        let formatter = NumberFormatter()
        switch format {
        case .currency:
            formatter.numberStyle = .currency
            formatter.currencyCode = "EUR"
            formatter.maximumFractionDigits = 0
        case .percent:
            formatter.numberStyle = .percent
            formatter.maximumFractionDigits = 2
        case .decimal(let digits):
            formatter.numberStyle = .decimal
            formatter.maximumFractionDigits = digits
        }
        return formatter.string(from: value as NSDecimalNumber) ?? "—"
    }
}
```

### 5.6 Diğer Kontroller (Özet)

- **`DSStepper`** — Çocuk sayısı gibi integer stepper, +/− butonlu, pill shape
- **`DSSliderField`** — Label + slider + current value (faiz oranı, vade için)
- **`DSDatePickerCard`** — DatePicker'ı DSCard içinde label ile saran wrapper
- **`DSChip`** — Kategori/filter chip, selectable state
- **`DSBadge`** — "Soon", "New", "Beta" küçük etiket
- **`DSEmptyState`** — ContentUnavailableView wrapper
- **`DSSearchField`** — `.searchable` benzeri custom search field
- **`DSSectionHeader`** — Icon box + title + subtitle, kategori başlığı
- **`DSSegmentedPicker`** — Picker wrapper
- **`DSPercentField`** — Yüzde input (0-100, slider + field)

---

## 6. Charts

### 6.1 `DSBreakdownChart.swift`

```swift
import SwiftUI
import Charts

public struct BreakdownSegment: Identifiable, Sendable {
    public let id = UUID()
    public let label: LocalizedStringResource
    public let value: Decimal
    public let color: Color

    public init(label: LocalizedStringResource, value: Decimal, color: Color) {
        self.label = label
        self.value = value
        self.color = color
    }
}

public struct DSBreakdownChart: View {
    let segments: [BreakdownSegment]
    let centerValue: Decimal
    let centerLabel: LocalizedStringResource

    public init(
        segments: [BreakdownSegment],
        centerValue: Decimal,
        centerLabel: LocalizedStringResource
    ) {
        self.segments = segments
        self.centerValue = centerValue
        self.centerLabel = centerLabel
    }

    public var body: some View {
        Chart(segments) { segment in
            SectorMark(
                angle: .value("Amount", Double(truncating: segment.value as NSDecimalNumber)),
                innerRadius: .ratio(0.65),
                angularInset: 2
            )
            .cornerRadius(6)
            .foregroundStyle(segment.color)
        }
        .chartBackground { _ in
            VStack(spacing: 4) {
                Text(centerLabel)
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)
                DSAnimatedNumber(centerValue, format: .currency, font: DSFont.display(28))
                    .foregroundStyle(DSGradient.primary)
            }
        }
        .frame(height: 240)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text(centerLabel))
        .accessibilityValue(accessibilityDescription)
    }

    private var accessibilityDescription: String {
        segments.map { "\($0.label): \($0.value)" }.joined(separator: ", ")
    }
}
```

### 6.2 `DSAmortizationChart.swift`

Line chart — principal vs interest over time. Swift Charts `LineMark` + `AreaMark`. Drag gesture ile "cursor" ile detayları göster.

### 6.3 `DSComparisonBar.swift`

İki değer karşılaştırması (örn: with/without first-time buyer discount).

---

## 7. Component Gallery

`ComponentGallery.swift` — tüm bileşenleri tek SwiftUI sahnesinde listeler, `#Preview` ile hem light/dark hem de Dynamic Type boyutlarında görünür.

```swift
import SwiftUI

public struct ComponentGallery: View {
    public init() {}

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: DSSpacing.xl) {
                    buttonsSection
                    cardsSection
                    fieldsSection
                    togglesSection
                    chartsSection
                }
                .padding()
            }
            .background(MeshBackground())
            .navigationTitle("DS Gallery")
        }
    }

    private var buttonsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("Buttons").font(DSFont.headingM)
            DSButton("Primary", action: {})
            DSButton("Secondary", variant: .secondary, action: {})
            DSButton("Ghost", variant: .ghost, action: {})
            DSButton("Glow", icon: "sparkles", variant: .glow, action: {})
            DSButton("Destructive", variant: .destructive, action: {})
        }
    }

    // ... similar for other sections
}

#Preview("Light") { ComponentGallery() }
#Preview("Dark") { ComponentGallery().preferredColorScheme(.dark) }
#Preview("AX3") { ComponentGallery().environment(\.sizeCategory, .accessibilityLarge) }
```

---

## 8. Testing

### 8.1 Snapshot Testleri

`swift-snapshot-testing` kullanılır.

```swift
import SnapshotTesting
import SwiftUI
import XCTest
@testable import DesignSystem

final class DSButtonSnapshotTests: XCTestCase {
    override func setUp() async throws {
        // isRecording = true  // fixture yenilemek için
    }

    func test_primary_light() {
        let view = DSButton("Calculate", variant: .primary, action: {})
            .frame(width: 300, height: 60)
            .padding()
            .background(DSColor.background)
        assertSnapshot(of: view, as: .image(traits: .lightMode))
    }

    func test_primary_dark() {
        let view = DSButton("Calculate", variant: .primary, action: {})
            .frame(width: 300, height: 60)
            .padding()
            .background(DSColor.background)
        assertSnapshot(of: view, as: .image(traits: .darkMode))
    }

    func test_all_variants() {
        let variants: [DSButtonVariant] = [.primary, .secondary, .ghost, .glow, .destructive]
        for variant in variants {
            let view = DSButton("Action", variant: variant, action: {})
                .frame(width: 300, height: 60)
                .padding()
            assertSnapshot(of: view, as: .image, named: "\(variant)")
        }
    }

    func test_dynamic_type_ax3() {
        let view = DSButton("Calculate Now", variant: .primary, action: {})
            .frame(width: 300)
            .environment(\.sizeCategory, .accessibilityLarge)
            .padding()
        assertSnapshot(of: view, as: .image)
    }
}
```

### 8.2 Snapshot Matrix

| Component        | Variants  | States                     | Themes | Dynamic Type | Total   |
| ---------------- | --------- | -------------------------- | ------ | ------------ | ------- |
| DSButton         | 5         | 3 (normal/pressed/loading) | 2      | 2 (M, AX3)   | 60      |
| DSCard           | 4         | 1                          | 2      | 2            | 16      |
| DSCurrencyField  | 1         | 3 (empty/filled/focused)   | 2      | 2            | 12      |
| DSToggleGroup    | 1         | 2                          | 2      | 2            | 8       |
| DSBreakdownChart | 1         | 1                          | 2      | 2            | 4       |
| DSAnimatedNumber | 3 formats | 1                          | 2      | 2            | 12      |
| **Toplam**       |           |                            |        |              | **112** |

### 8.3 Unit Tests

- [ ] Token değerlerinin doğru HEX'lere çözüldüğü (`TokenTests.swift`)
- [ ] `Color(hex:)` parse doğruluğu (3, 6, 8 karakter)
- [ ] `liquidGlass` modifier'ının iOS 26 branch'ine girdiği (`#available` test)
- [ ] `DSCurrencyField` binding'inin decimal parse doğruluğu (negatif, boş, noktalı, binlik)
- [ ] `DSAnimatedNumber` formatter çıktısı

---

## 9. Kabul Kriterleri

- [ ] `DesignSystem` paketi 0 hata/warning ile derleniyor
- [ ] `ComponentGallery` preview'ı 60 fps akıcı
- [ ] Tüm public API'ler `public` ve DocC comment'li
- [ ] Light & Dark tema snapshot testleri geçiyor
- [ ] Dynamic Type AX5 seviyesinde layout kırılmıyor
- [ ] Reduce Motion açıkken orb'lar hareket etmiyor
- [ ] Reduce Transparency açıkken mesh yerine solid gösteriliyor
- [ ] SwiftLint 0 violation
- [ ] Unit test coverage > %85
- [ ] Snapshot test 112+ snapshot, tümü yeşil

---

## 10. Sıradaki

[`03-calculation-kit.md`](03-calculation-kit.md)
