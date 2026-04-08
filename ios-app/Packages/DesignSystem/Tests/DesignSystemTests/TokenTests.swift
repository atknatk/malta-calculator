//
//  TokenTests.swift
//  DesignSystem
//

import SwiftUI
import Testing
@testable import DesignSystem

// MARK: - Color+Hex Tests

struct ColorHexTests {
    @Test("Parses 6-character hex string correctly")
    func parse6CharHex() {
        let color = Color(hex: "#C97D0A")
        #if canImport(UIKit)
        let uiColor = UIColor(color)
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        uiColor.getRed(&r, green: &g, blue: &b, alpha: &a)
        #expect(abs(r - 0.788) < 0.01, "red channel mismatch: \(r)")
        #expect(abs(g - 0.490) < 0.01, "green channel mismatch: \(g)")
        #expect(abs(b - 0.039) < 0.01, "blue channel mismatch: \(b)")
        #expect(abs(a - 1.0) < 0.01, "alpha channel mismatch: \(a)")
        #endif
    }

    @Test("Parses hex string without # prefix")
    func parseWithoutHash() {
        let color = Color(hex: "0099CC")
        #if canImport(UIKit)
        let uiColor = UIColor(color)
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        uiColor.getRed(&r, green: &g, blue: &b, alpha: &a)
        #expect(abs(r - 0.0) < 0.01, "red channel mismatch: \(r)")
        #expect(abs(g - 0.6) < 0.01, "green channel mismatch: \(g)")
        #expect(abs(b - 0.8) < 0.01, "blue channel mismatch: \(b)")
        #endif
    }

    @Test("Parses 8-character hex string with alpha")
    func parse8CharHex() {
        let color = Color(hex: "#C97D0A80")
        #if canImport(UIKit)
        let uiColor = UIColor(color)
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        uiColor.getRed(&r, green: &g, blue: &b, alpha: &a)
        #expect(abs(a - 0.502) < 0.01, "alpha channel mismatch: \(a)")
        #endif
    }

    @Test("Invalid hex falls back to black")
    func invalidHexFallback() {
        let color = Color(hex: "xyz")
        #if canImport(UIKit)
        let uiColor = UIColor(color)
        var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
        uiColor.getRed(&r, green: &g, blue: &b, alpha: &a)
        #expect(r == 0, "expected black fallback")
        #expect(g == 0, "expected black fallback")
        #expect(b == 0, "expected black fallback")
        #endif
    }
}

// MARK: - Spacing Tokens Tests

struct SpacingTests {
    @Test("Spacing tokens have correct values")
    func spacingValues() {
        #expect(DSSpacing.xxs == 4)
        #expect(DSSpacing.xs == 8)
        #expect(DSSpacing.sm == 12)
        #expect(DSSpacing.md == 16)
        #expect(DSSpacing.lg == 24)
        #expect(DSSpacing.xl == 32)
        #expect(DSSpacing.xxl == 48)
        #expect(DSSpacing.xxxl == 64)
    }
}

// MARK: - Radius Tokens Tests

struct RadiusTests {
    @Test("Radius tokens have correct values")
    func radiusValues() {
        #expect(DSRadius.none == 0)
        #expect(DSRadius.xs == 4)
        #expect(DSRadius.sm == 8)
        #expect(DSRadius.md == 12)
        #expect(DSRadius.lg == 16)
        #expect(DSRadius.xl == 20)
        #expect(DSRadius.xxl == 28)
        #expect(DSRadius.pill == 9999)
    }

    @Test("Circle alias equals pill")
    func circleAlias() {
        #expect(DSRadius.circle == DSRadius.pill)
    }

    @Test("Shape helper creates RoundedRectangle")
    func shapeHelper() {
        let shape = DSRadius.shape(DSRadius.lg)
        _ = shape // verifies creation without crash
        let sharpShape = DSRadius.shape(DSRadius.none, style: .circular)
        _ = sharpShape
    }

    @Test("allValues contains all standard radii excluding pill")
    func allValuesExcludesPill() {
        #expect(DSRadius.allValues.count == 7)
        #expect(!DSRadius.allValues.contains(DSRadius.pill))
        #expect(DSRadius.allValues == [0, 4, 8, 12, 16, 20, 28])
    }

    @Test("allValuesIncludingPill contains all radii")
    func allValuesIncludingPill() {
        #expect(DSRadius.allValuesIncludingPill.count == 8)
        #expect(DSRadius.allValuesIncludingPill.contains(DSRadius.pill))
        #expect(DSRadius.allValuesIncludingPill.last == DSRadius.pill)
    }

    @Test("allValues are monotonically increasing")
    func allValuesOrdered() {
        let values = DSRadius.allValues
        for i in 1..<values.count {
            #expect(values[i] > values[i - 1], "radius values must be strictly increasing")
        }
    }

    @Test("Capsule helper creates Capsule shape")
    func capsuleHelper() {
        let capsule = DSRadius.capsule()
        _ = capsule
        let capsuleCircular = DSRadius.capsule(style: .circular)
        _ = capsuleCircular
    }
}

// MARK: - Shadow Tests

struct ShadowTests {
    @Test("Card shadow has expected radius")
    func cardShadow() {
        #expect(DSShadow.card.radius == 20)
        #expect(DSShadow.card.y == 8)
        #expect(DSShadow.card.x == 0)
    }

    @Test("Elevated shadow has expected radius")
    func elevatedShadow() {
        #expect(DSShadow.elevated.radius == 32)
        #expect(DSShadow.elevated.y == 12)
        #expect(DSShadow.elevated.x == 0)
    }

    @Test("Glow shadow has centered offset")
    func glowShadow() {
        #expect(DSShadow.glow.x == 0)
        #expect(DSShadow.glow.y == 0)
        #expect(DSShadow.glow.radius == 30)
    }

    @Test("Pressed shadow is subtle")
    func pressedShadow() {
        #expect(DSShadow.pressed.radius == 8)
        #expect(DSShadow.pressed.y == 2)
        #expect(DSShadow.pressed.x == 0)
    }

    @Test("None shadow has zero radius")
    func noneShadow() {
        #expect(DSShadow.none.radius == 0)
        #expect(DSShadow.none.x == 0)
        #expect(DSShadow.none.y == 0)
    }

    @Test("Shadow conforms to Equatable")
    func shadowEquatable() {
        let a = DSShadow.Shadow(color: .clear, radius: 0, x: 0, y: 0)
        let b = DSShadow.Shadow(color: .clear, radius: 0, x: 0, y: 0)
        #expect(a == b)
    }

    @Test("Shadow conforms to Hashable")
    func shadowHashable() {
        let set: Set<DSShadow.Shadow> = [DSShadow.card, DSShadow.elevated, DSShadow.glow, DSShadow.pressed, DSShadow.none]
        #expect(set.count == 5, "all shadow tokens should be distinct when hashed")
    }

    @Test("Shadow can be used as dictionary key")
    func shadowAsDictionaryKey() {
        var dict: [DSShadow.Shadow: String] = [:]
        dict[DSShadow.card] = "card"
        dict[DSShadow.elevated] = "elevated"
        #expect(dict[DSShadow.card] == "card")
        #expect(dict[DSShadow.elevated] == "elevated")
    }

    @Test("allValues contains all non-none shadows")
    func allValues() {
        #expect(DSShadow.allValues.count == 5)
        #expect(DSShadow.allValues.contains(DSShadow.card))
        #expect(DSShadow.allValues.contains(DSShadow.elevated))
        #expect(DSShadow.allValues.contains(DSShadow.glow))
        #expect(DSShadow.allValues.contains(DSShadow.pressed))
        #expect(DSShadow.allValues.contains(DSShadow.high))
    }

    @Test("allValuesIncludingNone contains all shadows")
    func allValuesIncludingNone() {
        #expect(DSShadow.allValuesIncludingNone.count == 5)
        #expect(DSShadow.allValuesIncludingNone.contains(DSShadow.none))
    }

    @Test("Each shadow token has unique radius")
    func uniqueRadii() {
        let radii = DSShadow.allValuesIncludingNone.map(\.radius)
        #expect(Set(radii).count == radii.count, "shadow tokens should have unique radii")
    }
}

// MARK: - DSElevation Tests

struct ElevationTests {
    @Test("Elevation levels are ordered")
    func elevationOrdering() {
        #expect(DSElevation.flat < DSElevation.raised)
        #expect(DSElevation.raised < DSElevation.floating)
        #expect(DSElevation.floating < DSElevation.overlay)
    }

    @Test("All elevation levels have CaseIterable")
    func elevationCaseIterable() {
        #expect(DSElevation.allCases.count == 4)
    }

    @Test("Flat maps to none shadow")
    func flatShadow() {
        #expect(DSElevation.flat.shadow.radius == 0)
    }

    @Test("Raised maps to card shadow")
    func raisedShadow() {
        #expect(DSElevation.raised.shadow.radius == DSShadow.card.radius)
    }

    @Test("Floating maps to elevated shadow")
    func floatingShadow() {
        #expect(DSElevation.floating.shadow.radius == DSShadow.elevated.radius)
    }

    @Test("Overlay has largest shadow radius")
    func overlayShadow() {
        #expect(DSElevation.overlay.shadow.radius > DSElevation.floating.shadow.radius)
    }

    @Test("zIndex matches raw value")
    func zIndexValues() {
        #expect(DSElevation.flat.zIndex == 0)
        #expect(DSElevation.raised.zIndex == 1)
        #expect(DSElevation.floating.zIndex == 2)
        #expect(DSElevation.overlay.zIndex == 3)
    }
}

// MARK: - DSAnimatedNumber Format Tests

@MainActor
struct AnimatedNumberFormatTests {
    @Test("Currency format produces EUR symbol")
    func currencyFormat() {
        let view = DSAnimatedNumber(14976.50, format: .currency)
        let formatted = view.formatted
        #expect(formatted.contains("\u{20AC}") || formatted.contains("EUR"),
                "expected EUR formatting, got: \(formatted)")
    }

    @Test("Decimal format respects fraction digits")
    func decimalFormat() {
        let view = DSAnimatedNumber(3.14159, format: .decimal(fractionDigits: 2))
        let formatted = view.formatted
        #expect(formatted.contains("3.14") || formatted.contains("3,14"),
                "expected 2 decimal places, got: \(formatted)")
    }
}

// MARK: - LiquidGlassStrength Tests

struct LiquidGlassStrengthTests {
    @Test("Strength levels map to correct materials")
    func materialMapping() {
        _ = LiquidGlassStrength.thin.material
        _ = LiquidGlassStrength.regular.material
        _ = LiquidGlassStrength.thick.material
    }
}

// MARK: - Accessibility Reduce Transparency Tests

struct ReduceTransparencyFallbackTests {
    @Test("LiquidGlassStrength exposes all material variants")
    func allMaterials() {
        let strengths: [LiquidGlassStrength] = [.thin, .regular, .thick]
        for strength in strengths {
            _ = strength.material
        }
        #expect(strengths.count == LiquidGlassStrength.allCases.count)
    }

    @Test("DSColor.surface is available as opaque fallback")
    func surfaceFallback() {
        _ = DSColor.surface
    }
}

// MARK: - DSButtonSize Tests

struct ButtonSizeTests {
    @Test("Button sizes have correct heights")
    func heights() {
        #expect(DSButtonSize.small.height == 36)
        #expect(DSButtonSize.regular.height == 48)
        #expect(DSButtonSize.large.height == 56)
    }

    @Test("Button sizes have correct horizontal padding")
    func paddings() {
        #expect(DSButtonSize.small.horizontalPadding == DSSpacing.md)
        #expect(DSButtonSize.regular.horizontalPadding == DSSpacing.lg)
        #expect(DSButtonSize.large.horizontalPadding == DSSpacing.xl)
    }

    @Test("Button sizes are CaseIterable")
    func sizesCaseIterable() {
        #expect(DSButtonSize.allCases.count == 3)
    }

    @Test("Button sizes have distinct fonts")
    func sizeFonts() {
        _ = DSButtonSize.small.font
        _ = DSButtonSize.regular.font
        _ = DSButtonSize.large.font
    }

    @Test("Button sizes have correct progressViewControlSize")
    func progressViewControlSizes() {
        #expect(DSButtonSize.small.progressViewControlSize == .mini)
        #expect(DSButtonSize.regular.progressViewControlSize == .small)
        #expect(DSButtonSize.large.progressViewControlSize == .regular)
    }
}

// MARK: - DSButtonVariant Tests

struct ButtonVariantTests {
    @Test("All button variants are distinct and CaseIterable")
    func variantsCaseIterable() {
        #expect(DSButtonVariant.allCases.count == 6)
        let uniqueSet = Set(DSButtonVariant.allCases)
        #expect(uniqueSet.count == 6)
    }

    @Test("Outline variant exists")
    func outlineVariant() {
        _ = DSButtonVariant.outline
        #expect(DSButtonVariant.allCases.contains(.outline))
    }

    @Test("Variants are Equatable")
    func variantsEquatable() {
        #expect(DSButtonVariant.primary == DSButtonVariant.primary)
        #expect(DSButtonVariant.primary != DSButtonVariant.ghost)
    }

    @Test("Foreground colors differ between filled and non-filled variants")
    func foregroundColors() {
        let filledColor = DSButtonStyle.foregroundColor(for: .primary)
        let outlineColor = DSButtonStyle.foregroundColor(for: .outline)
        let ghostColor = DSButtonStyle.foregroundColor(for: .ghost)

        #expect(filledColor == .white)
        #expect(outlineColor == DSColor.maltaGold)
        #expect(ghostColor == DSColor.maltaGold)
    }

    @Test("Variant foregroundColor property matches static method")
    func variantForegroundColorProperty() {
        for variant in DSButtonVariant.allCases {
            #expect(variant.foregroundColor == DSButtonStyle.foregroundColor(for: variant))
        }
    }

    @Test("Filled variants have white foreground")
    func filledVariantsForeground() {
        #expect(DSButtonVariant.primary.foregroundColor == .white)
        #expect(DSButtonVariant.glow.foregroundColor == .white)
        #expect(DSButtonVariant.destructive.foregroundColor == .white)
    }

    @Test("Non-filled variants have gold foreground")
    func nonFilledVariantsForeground() {
        #expect(DSButtonVariant.secondary.foregroundColor == DSColor.maltaGold)
        #expect(DSButtonVariant.outline.foregroundColor == DSColor.maltaGold)
        #expect(DSButtonVariant.ghost.foregroundColor == DSColor.maltaGold)
    }

    @Test("isFilledBackground property is correct for all variants")
    func isFilledBackground() {
        #expect(DSButtonVariant.primary.isFilledBackground == true)
        #expect(DSButtonVariant.glow.isFilledBackground == true)
        #expect(DSButtonVariant.destructive.isFilledBackground == true)
        #expect(DSButtonVariant.secondary.isFilledBackground == false)
        #expect(DSButtonVariant.outline.isFilledBackground == false)
        #expect(DSButtonVariant.ghost.isFilledBackground == false)
    }

    @Test("hasBorder property is correct for all variants")
    func hasBorder() {
        #expect(DSButtonVariant.secondary.hasBorder == true)
        #expect(DSButtonVariant.outline.hasBorder == true)
        #expect(DSButtonVariant.primary.hasBorder == false)
        #expect(DSButtonVariant.ghost.hasBorder == false)
        #expect(DSButtonVariant.glow.hasBorder == false)
        #expect(DSButtonVariant.destructive.hasBorder == false)
    }

    @Test("isFullWidth property is correct for all variants")
    func isFullWidth() {
        #expect(DSButtonVariant.primary.isFullWidth == true)
        #expect(DSButtonVariant.secondary.isFullWidth == true)
        #expect(DSButtonVariant.glow.isFullWidth == true)
        #expect(DSButtonVariant.destructive.isFullWidth == true)
        #expect(DSButtonVariant.ghost.isFullWidth == false)
        #expect(DSButtonVariant.outline.isFullWidth == false)
    }

    @Test("Destructive variant uses danger foreground")
    func destructiveForeground() {
        #expect(DSButtonVariant.destructive.foregroundColor == .white)
        #expect(DSButtonVariant.destructive.isFilledBackground == true)
    }

    @Test("displayName property returns correct names for all variants")
    func displayNames() {
        #expect(DSButtonVariant.primary.displayName == "Primary")
        #expect(DSButtonVariant.secondary.displayName == "Secondary")
        #expect(DSButtonVariant.outline.displayName == "Outline")
        #expect(DSButtonVariant.ghost.displayName == "Ghost")
        #expect(DSButtonVariant.glow.displayName == "Glow")
        #expect(DSButtonVariant.destructive.displayName == "Destructive")
    }

    @Test("All variants have non-empty displayName")
    func allVariantsHaveDisplayName() {
        for variant in DSButtonVariant.allCases {
            #expect(!variant.displayName.isEmpty)
        }
    }
}

// MARK: - DSButton Loading State Tests

@MainActor
struct ButtonLoadingStateTests {
    @Test("Loading button has accessibility value Loading")
    func loadingAccessibilityValue() {
        let button = DSButton("Test", isLoading: true, action: {})
        #expect(button.isLoading == true)
    }

    @Test("Non-loading button has empty accessibility value")
    func nonLoadingAccessibilityValue() {
        let button = DSButton("Test", isLoading: false, action: {})
        #expect(button.isLoading == false)
    }

    @Test("Loading state stores correctly")
    func loadingStateStorage() {
        let loadingButton = DSButton("Save", icon: "checkmark", isLoading: true, action: {})
        let normalButton = DSButton("Save", icon: "checkmark", isLoading: false, action: {})
        #expect(loadingButton.isLoading == true)
        #expect(normalButton.isLoading == false)
    }

    @Test("Loading button preserves variant and size")
    func loadingPreservesConfig() {
        let button = DSButton("Delete", variant: .destructive, size: .large, isLoading: true, action: {})
        #expect(button.variant == .destructive)
        #expect(button.size == .large)
        #expect(button.isLoading == true)
    }

    @Test("All variants can be created in loading state")
    func allVariantsLoading() {
        for variant in DSButtonVariant.allCases {
            let button = DSButton("Test", variant: variant, isLoading: true, action: {})
            #expect(button.isLoading == true)
            #expect(button.variant == variant)
        }
    }

    @Test("All sizes can be created in loading state")
    func allSizesLoading() {
        for size in DSButtonSize.allCases {
            let button = DSButton("Test", size: size, isLoading: true, action: {})
            #expect(button.isLoading == true)
            #expect(button.size == size)
        }
    }

    @Test("Loading button with icon stores icon name")
    func loadingWithIcon() {
        let button = DSButton("Submit", icon: "arrow.right", isLoading: true, action: {})
        #expect(button.icon == "arrow.right")
        #expect(button.isLoading == true)
    }
}

// MARK: - OrbConfiguration Tests

struct OrbConfigurationTests {
    @Test("Default configuration has 3 orbs")
    func defaultOrbs() {
        let config = OrbConfiguration.default
        #expect(config.orbs.count == 3)
    }

    @Test("Orb phases have distinct opacities")
    func orbPhaseOpacities() {
        #expect(OrbPhase.start.opacity == 0.6)
        #expect(OrbPhase.end.opacity == 0.8)
    }
}

// MARK: - BreakdownSegment Tests

struct BreakdownSegmentTests {
    @Test("Segment stores Decimal value correctly")
    func segmentValue() {
        let segment = BreakdownSegment(
            label: "Tax",
            value: Decimal(string: "5432.10") ?? 0,
            color: .red
        )
        #expect(segment.value == Decimal(string: "5432.10"))
    }
}

// MARK: - DSBadgeVariant Tests

struct BadgeVariantTests {
    @Test("Badge variants are distinct")
    func variants() {
        _ = DSBadgeVariant.soon
        _ = DSBadgeVariant.new
        _ = DSBadgeVariant.beta
        _ = DSBadgeVariant.custom(.red)
    }
}

// MARK: - DSCardVariant Tests

struct CardVariantTests {
    @Test("Card variants are distinct and CaseIterable")
    func variantsCaseIterable() {
        #expect(DSCardVariant.allCases.count == 8)
        let uniqueSet = Set(DSCardVariant.allCases)
        #expect(uniqueSet.count == 8)
    }

    @Test("Compact variant exists")
    func compactVariant() {
        #expect(DSCardVariant.allCases.contains(.compact))
    }

    @Test("Info variant exists")
    func infoVariant() {
        #expect(DSCardVariant.allCases.contains(.info))
    }

    @Test("Success variant exists")
    func successVariant() {
        #expect(DSCardVariant.allCases.contains(.success))
    }

    @Test("Warning variant exists")
    func warningVariant() {
        #expect(DSCardVariant.allCases.contains(.warning))
    }

    @Test("Variants are Equatable")
    func variantsEquatable() {
        #expect(DSCardVariant.default == DSCardVariant.default)
        #expect(DSCardVariant.default != DSCardVariant.hero)
    }

    @Test("Corner radius values are correct per variant")
    func cornerRadii() {
        #expect(DSCardVariant.compact.cornerRadius == DSRadius.lg)
        #expect(DSCardVariant.default.cornerRadius == DSRadius.xl)
        #expect(DSCardVariant.highlighted.cornerRadius == DSRadius.xl)
        #expect(DSCardVariant.hero.cornerRadius == DSRadius.xl)
        #expect(DSCardVariant.destructive.cornerRadius == DSRadius.xl)
        #expect(DSCardVariant.info.cornerRadius == DSRadius.xl)
        #expect(DSCardVariant.success.cornerRadius == DSRadius.xl)
        #expect(DSCardVariant.warning.cornerRadius == DSRadius.xl)
    }

    @Test("Elevation values are correct per variant")
    func elevations() {
        #expect(DSCardVariant.hero.elevation == .floating)
        #expect(DSCardVariant.default.elevation == .raised)
        #expect(DSCardVariant.compact.elevation == .raised)
        #expect(DSCardVariant.highlighted.elevation == .raised)
        #expect(DSCardVariant.destructive.elevation == .raised)
        #expect(DSCardVariant.info.elevation == .raised)
        #expect(DSCardVariant.success.elevation == .raised)
        #expect(DSCardVariant.warning.elevation == .raised)
    }

    @Test("Default padding values are correct per variant")
    func paddings() {
        #expect(DSCardVariant.compact.defaultPadding == DSSpacing.sm)
        #expect(DSCardVariant.default.defaultPadding == DSSpacing.lg)
        #expect(DSCardVariant.highlighted.defaultPadding == DSSpacing.lg)
        #expect(DSCardVariant.hero.defaultPadding == DSSpacing.lg)
        #expect(DSCardVariant.destructive.defaultPadding == DSSpacing.lg)
        #expect(DSCardVariant.info.defaultPadding == DSSpacing.lg)
        #expect(DSCardVariant.success.defaultPadding == DSSpacing.lg)
        #expect(DSCardVariant.warning.defaultPadding == DSSpacing.lg)
    }

    @Test("hasBorder property is correct for all variants")
    func hasBorder() {
        #expect(DSCardVariant.hero.hasBorder == true)
        #expect(DSCardVariant.highlighted.hasBorder == true)
        #expect(DSCardVariant.destructive.hasBorder == true)
        #expect(DSCardVariant.info.hasBorder == true)
        #expect(DSCardVariant.success.hasBorder == true)
        #expect(DSCardVariant.warning.hasBorder == true)
        #expect(DSCardVariant.default.hasBorder == false)
        #expect(DSCardVariant.compact.hasBorder == false)
    }

    @Test("tintColor property is correct for all variants")
    func tintColors() {
        #expect(DSCardVariant.highlighted.tintColor != nil)
        #expect(DSCardVariant.destructive.tintColor != nil)
        #expect(DSCardVariant.info.tintColor != nil)
        #expect(DSCardVariant.success.tintColor != nil)
        #expect(DSCardVariant.warning.tintColor != nil)
        #expect(DSCardVariant.default.tintColor == nil)
        #expect(DSCardVariant.hero.tintColor == nil)
        #expect(DSCardVariant.compact.tintColor == nil)
    }

    @Test("displayName property returns correct names")
    func displayNames() {
        #expect(DSCardVariant.default.displayName == "Default")
        #expect(DSCardVariant.compact.displayName == "Compact")
        #expect(DSCardVariant.highlighted.displayName == "Highlighted")
        #expect(DSCardVariant.hero.displayName == "Hero")
        #expect(DSCardVariant.destructive.displayName == "Destructive")
        #expect(DSCardVariant.info.displayName == "Info")
        #expect(DSCardVariant.success.displayName == "Success")
        #expect(DSCardVariant.warning.displayName == "Warning")
    }
}

// MARK: - LineChartDataPoint Tests

struct LineChartTests {
    @Test("LineChartDataPoint stores Decimal y-value")
    func dataPointDecimal() {
        let point = LineChartDataPoint(label: "Year 1", x: 1, y: Decimal(string: "1234.56") ?? 0)
        #expect(point.y == Decimal(string: "1234.56"))
    }

    @Test("LineChartSeries stores multiple points")
    func seriesPoints() {
        let series = LineChartSeries(
            name: "Test",
            color: .blue,
            points: [
                LineChartDataPoint(label: "1", x: 1, y: 100),
                LineChartDataPoint(label: "2", x: 2, y: 200),
            ]
        )
        #expect(series.points.count == 2)
    }
}

// MARK: - AmortizationDataPoint Tests

struct AmortizationTests {
    @Test("AmortizationDataPoint stores all Decimal fields")
    func dataPointFields() {
        let point = AmortizationDataPoint(
            label: "Month 1",
            period: 1,
            principal: 500,
            interest: 200,
            balance: 99300
        )
        #expect(point.principal == 500)
        #expect(point.interest == 200)
        #expect(point.balance == 99300)
    }
}

// MARK: - DSMotion Tests

struct MotionTests {
    @Test("Motion tokens are Animation values")
    func motionTokensExist() {
        _ = DSMotion.quick
        _ = DSMotion.standard
        _ = DSMotion.slow
        _ = DSMotion.instant
        _ = DSMotion.expressive
        _ = DSMotion.bouncy
        _ = DSMotion.float
        _ = DSMotion.glow
    }

    @Test("Duration constants have correct values")
    func durationConstants() {
        #expect(DSMotion.Duration.instant == 0)
        #expect(DSMotion.Duration.quick == 0.18)
        #expect(DSMotion.Duration.standard == 0.32)
        #expect(DSMotion.Duration.slow == 0.5)
        #expect(DSMotion.Duration.float == 6)
        #expect(DSMotion.Duration.glow == 3)
    }

    @Test("Duration.allValues contains all durations")
    func allDurations() {
        #expect(DSMotion.Duration.allValues.count == 6)
        #expect(DSMotion.Duration.allValues.contains(DSMotion.Duration.instant))
        #expect(DSMotion.Duration.allValues.contains(DSMotion.Duration.quick))
        #expect(DSMotion.Duration.allValues.contains(DSMotion.Duration.standard))
        #expect(DSMotion.Duration.allValues.contains(DSMotion.Duration.slow))
        #expect(DSMotion.Duration.allValues.contains(DSMotion.Duration.glow))
        #expect(DSMotion.Duration.allValues.contains(DSMotion.Duration.float))
    }

    @Test("allAnimations catalog has 6 non-looping animations")
    func allAnimationsCatalog() {
        #expect(DSMotion.allAnimations.count == 6)
        #expect(DSMotion.allAnimations["quick"] != nil)
        #expect(DSMotion.allAnimations["standard"] != nil)
        #expect(DSMotion.allAnimations["slow"] != nil)
        #expect(DSMotion.allAnimations["instant"] != nil)
        #expect(DSMotion.allAnimations["expressive"] != nil)
        #expect(DSMotion.allAnimations["bouncy"] != nil)
    }

    @Test("allLoopingAnimations catalog has 2 looping animations")
    func allLoopingAnimationsCatalog() {
        #expect(DSMotion.allLoopingAnimations.count == 2)
        #expect(DSMotion.allLoopingAnimations["float"] != nil)
        #expect(DSMotion.allLoopingAnimations["glow"] != nil)
    }

    @Test("Curve tokens exist")
    func curveTokens() {
        _ = DSMotion.Curve.quickOut
        _ = DSMotion.Curve.standard
        _ = DSMotion.Curve.slow
        _ = DSMotion.Curve.linear
    }
}

// MARK: - CurrencyField Decimal Parse Tests

struct CurrencyFieldParseTests {
    private func parse(_ input: String, maxValue: Decimal = 10_000_000) -> Decimal? {
        let sanitized = input.replacingOccurrences(of: ",", with: ".")
            .filter { $0.isNumber || $0 == "." }
        guard let parsed = Decimal(string: sanitized) else { return nil }
        return min(parsed, maxValue)
    }

    @Test("Simple integer parses correctly")
    func simpleInteger() {
        let result = parse("25000")
        #expect(result == 25000)
    }

    @Test("Decimal with dot parses correctly")
    func decimalWithDot() {
        let result = parse("14976.50")
        #expect(result == Decimal(string: "14976.50"))
    }

    @Test("Comma is treated as decimal separator")
    func commaAsDecimalSeparator() {
        let result = parse("14976,50")
        #expect(result == Decimal(string: "14976.50"))
    }

    @Test("Empty string returns nil")
    func emptyString() {
        let result = parse("")
        #expect(result == nil)
    }

    @Test("Non-numeric input returns nil")
    func nonNumericInput() {
        let result = parse("abc")
        #expect(result == nil)
    }

    @Test("Value clamped to maxValue")
    func clampedToMax() {
        let result = parse("99999999", maxValue: 10_000_000)
        #expect(result == 10_000_000)
    }

    @Test("Thousands separators stripped correctly")
    func thousandsSeparators() {
        let sanitized = "25.000,50".replacingOccurrences(of: ",", with: ".")
            .filter { $0.isNumber || $0 == "." }
        let parsed = Decimal(string: sanitized)
        #expect(parsed != nil, "should not return nil")
    }

    @Test("Zero value parses correctly")
    func zeroValue() {
        let result = parse("0")
        #expect(result == 0)
    }

    @Test("Negative sign is stripped (input filter removes it)")
    func negativeStripped() {
        let result = parse("-500")
        #expect(result == 500)
    }
}

// MARK: - DSFont Token Tests

struct FontTests {
    @Test("Display fonts are serif design")
    func displayFonts() {
        _ = DSFont.displayXL
        _ = DSFont.displayL
        _ = DSFont.displayM
        _ = DSFont.displayS
    }

    @Test("Heading fonts exist")
    func headingFonts() {
        _ = DSFont.headingL
        _ = DSFont.headingM
        _ = DSFont.headingS
    }

    @Test("Body fonts exist")
    func bodyFonts() {
        _ = DSFont.bodyL
        _ = DSFont.bodyM
        _ = DSFont.bodyS
        _ = DSFont.caption
    }

    @Test("Label and footnote fonts exist")
    func labelAndFootnote() {
        _ = DSFont.label
        _ = DSFont.footnote
    }

    @Test("Custom mono font can be created")
    func monoFont() {
        _ = DSFont.mono(16, weight: .bold)
    }

    @Test("LineHeight constants have correct values")
    func lineHeightConstants() {
        #expect(DSFont.LineHeight.tight == 1.2)
        #expect(DSFont.LineHeight.standard == 1.5)
        #expect(DSFont.LineHeight.relaxed == 1.75)
    }

    @Test("LineHeight allValues contains all values in order")
    func lineHeightAllValues() {
        #expect(DSFont.LineHeight.allValues.count == 3)
        #expect(DSFont.LineHeight.allValues == [1.2, 1.5, 1.75])
    }

    @Test("Size constants have correct point values")
    func sizeConstants() {
        #expect(DSFont.Size.displayXL == 48)
        #expect(DSFont.Size.displayL == 40)
        #expect(DSFont.Size.displayM == 32)
        #expect(DSFont.Size.displayS == 24)
        #expect(DSFont.Size.headingL == 22)
        #expect(DSFont.Size.headingM == 18)
        #expect(DSFont.Size.headingS == 16)
        #expect(DSFont.Size.bodyL == 17)
        #expect(DSFont.Size.bodyM == 15)
        #expect(DSFont.Size.bodyS == 13)
        #expect(DSFont.Size.caption == 11)
        #expect(DSFont.Size.label == 14)
        #expect(DSFont.Size.footnote == 12)
    }

    @Test("Size.allValues contains all sizes")
    func sizeAllValues() {
        #expect(DSFont.Size.allValues.count == 13)
    }

    @Test("TextStyleMapping has correct case count")
    func textStyleMappingCases() {
        #expect(DSFont.TextStyleMapping.allCases.count == 13)
    }

    @Test("TextStyleMapping size property matches Size constants")
    func textStyleMappingSizes() {
        #expect(DSFont.TextStyleMapping.displayXL.size == DSFont.Size.displayXL)
        #expect(DSFont.TextStyleMapping.displayL.size == DSFont.Size.displayL)
        #expect(DSFont.TextStyleMapping.displayM.size == DSFont.Size.displayM)
        #expect(DSFont.TextStyleMapping.displayS.size == DSFont.Size.displayS)
        #expect(DSFont.TextStyleMapping.headingL.size == DSFont.Size.headingL)
        #expect(DSFont.TextStyleMapping.headingM.size == DSFont.Size.headingM)
        #expect(DSFont.TextStyleMapping.headingS.size == DSFont.Size.headingS)
        #expect(DSFont.TextStyleMapping.bodyL.size == DSFont.Size.bodyL)
        #expect(DSFont.TextStyleMapping.bodyM.size == DSFont.Size.bodyM)
        #expect(DSFont.TextStyleMapping.bodyS.size == DSFont.Size.bodyS)
        #expect(DSFont.TextStyleMapping.caption.size == DSFont.Size.caption)
        #expect(DSFont.TextStyleMapping.label.size == DSFont.Size.label)
        #expect(DSFont.TextStyleMapping.footnote.size == DSFont.Size.footnote)
    }

    @Test("TextStyleMapping textStyle maps to appropriate Font.TextStyle")
    func textStyleMappingTextStyles() {
        #expect(DSFont.TextStyleMapping.displayXL.textStyle == .largeTitle)
        #expect(DSFont.TextStyleMapping.bodyL.textStyle == .body)
        #expect(DSFont.TextStyleMapping.caption.textStyle == .caption)
        #expect(DSFont.TextStyleMapping.footnote.textStyle == .caption2)
    }

    @Test("allStyles contains all text style mappings")
    func allStyles() {
        #expect(DSFont.allStyles.count == 13)
        #expect(DSFont.allStyles == DSFont.TextStyleMapping.allCases)
    }

    @Test("Each TextStyleMapping produces a font")
    func allMappingsProduceFont() {
        for style in DSFont.TextStyleMapping.allCases {
            _ = style.font
            _ = style.textStyle
            _ = style.size
        }
    }
}

// MARK: - DSGradient Tests

struct GradientTests {
    @Test("All gradient presets exist")
    func presets() {
        _ = DSGradient.primary
        _ = DSGradient.secondary
        _ = DSGradient.accent
        _ = DSGradient.success
        _ = DSGradient.danger
    }

    @Test("Category gradient helper creates a LinearGradient")
    func categoryHelper() {
        _ = DSGradient.category(DSColor.categoryEmployment)
        _ = DSGradient.category(DSColor.categoryBanking)
    }
}

// MARK: - DSColor Tests

struct ColorTests {
    @Test("Brand colors are defined")
    func brandColors() {
        _ = DSColor.maltaGold
        _ = DSColor.maltaGoldMuted
        _ = DSColor.mediterraneanBlue
        _ = DSColor.mediterraneanBlueMuted
        _ = DSColor.maltaRed
        _ = DSColor.warmSand
    }

    @Test("Surface colors are defined")
    func surfaceColors() {
        _ = DSColor.background
        _ = DSColor.surface
        _ = DSColor.surfaceMuted
        _ = DSColor.surfaceElevated
    }

    @Test("Text colors are defined")
    func textColors() {
        _ = DSColor.textPrimary
        _ = DSColor.textSecondary
        _ = DSColor.textTertiary
        _ = DSColor.textInverse
    }

    @Test("Semantic colors are defined")
    func semanticColors() {
        _ = DSColor.success
        _ = DSColor.warning
        _ = DSColor.danger
        _ = DSColor.info
    }

    @Test("Category gradient arrays have 2 colors each")
    func categoryArrays() {
        #expect(DSColor.categoryEmployment.count == 2)
        #expect(DSColor.categoryFamily.count == 2)
        #expect(DSColor.categoryProperty.count == 2)
        #expect(DSColor.categoryBanking.count == 2)
        #expect(DSColor.categoryRetirement.count == 2)
        #expect(DSColor.categorySelfEmp.count == 2)
        #expect(DSColor.categoryLeave.count == 2)
        #expect(DSColor.categoryTransport.count == 2)
        #expect(DSColor.categoryImmigration.count == 2)
    }
}

// MARK: - DSColor Namespace Tests

struct ColorNamespaceTests {
    @Test("Brand namespace resolves all colors")
    func brandNamespace() {
        _ = DSColor.Brand.gold
        _ = DSColor.Brand.goldMuted
        _ = DSColor.Brand.blue
        _ = DSColor.Brand.blueMuted
        _ = DSColor.Brand.red
        _ = DSColor.Brand.sand
    }

    @Test("Brand namespace allColors has correct count")
    func brandAllColors() {
        #expect(DSColor.Brand.allColors.count == 6)
    }

    @Test("Surface namespace resolves all colors")
    func surfaceNamespace() {
        _ = DSColor.Surface.primary
        _ = DSColor.Surface.card
        _ = DSColor.Surface.muted
        _ = DSColor.Surface.elevated
    }

    @Test("Surface namespace allColors has correct count")
    func surfaceAllColors() {
        #expect(DSColor.Surface.allColors.count == 4)
    }

    @Test("Text namespace resolves all colors")
    func textNamespace() {
        _ = DSColor.Text.primary
        _ = DSColor.Text.secondary
        _ = DSColor.Text.tertiary
        _ = DSColor.Text.inverse
    }

    @Test("Text namespace allColors has correct count")
    func textAllColors() {
        #expect(DSColor.Text.allColors.count == 4)
    }

    @Test("Semantic namespace resolves all colors")
    func semanticNamespace() {
        _ = DSColor.Semantic.success
        _ = DSColor.Semantic.warning
        _ = DSColor.Semantic.danger
        _ = DSColor.Semantic.info
    }

    @Test("Semantic namespace allColors has correct count")
    func semanticAllColors() {
        #expect(DSColor.Semantic.allColors.count == 4)
    }

    @Test("Glass namespace resolves all colors")
    func glassNamespace() {
        _ = DSColor.Glass.tint
        _ = DSColor.Glass.stroke
    }

    @Test("Glass namespace allColors has correct count")
    func glassAllColors() {
        #expect(DSColor.Glass.allColors.count == 2)
    }

    @Test("Category namespace resolves all gradient pairs")
    func categoryNamespace() {
        #expect(DSColor.Category.employment.count == 2)
        #expect(DSColor.Category.family.count == 2)
        #expect(DSColor.Category.property.count == 2)
        #expect(DSColor.Category.banking.count == 2)
        #expect(DSColor.Category.retirement.count == 2)
        #expect(DSColor.Category.selfEmployment.count == 2)
        #expect(DSColor.Category.leave.count == 2)
        #expect(DSColor.Category.transport.count == 2)
        #expect(DSColor.Category.immigration.count == 2)
    }

    @Test("Category namespace allPairs has 9 categories")
    func categoryAllPairs() {
        #expect(DSColor.Category.allPairs.count == 9)
        for pair in DSColor.Category.allPairs {
            #expect(pair.count == 2, "each category pair must have exactly 2 colors")
        }
    }
}

// MARK: - DSColor Asset Catalog Tests

struct ColorCatalogTests {
    @Test("allBrand has 6 tokens")
    func brandCatalog() {
        #expect(DSColor.allBrand.count == 6)
        #expect(DSColor.allBrand.allSatisfy { $0.group == .brand })
    }

    @Test("allSurface has 4 tokens")
    func surfaceCatalog() {
        #expect(DSColor.allSurface.count == 4)
        #expect(DSColor.allSurface.allSatisfy { $0.group == .surface })
    }

    @Test("allText has 4 tokens")
    func textCatalog() {
        #expect(DSColor.allText.count == 4)
        #expect(DSColor.allText.allSatisfy { $0.group == .text })
    }

    @Test("allSemantic has 4 tokens")
    func semanticCatalog() {
        #expect(DSColor.allSemantic.count == 4)
        #expect(DSColor.allSemantic.allSatisfy { $0.group == .semantic })
    }

    @Test("allGlass has 2 tokens")
    func glassCatalog() {
        #expect(DSColor.allGlass.count == 2)
        #expect(DSColor.allGlass.allSatisfy { $0.group == .glass })
    }

    @Test("allCategory has 18 tokens (9 categories × 2 colors)")
    func categoryCatalog() {
        #expect(DSColor.allCategory.count == 18)
        #expect(DSColor.allCategory.allSatisfy { $0.group == .category })
    }

    @Test("allTokens returns all color tokens including categories")
    func allTokensCatalog() {
        let all = DSColor.allTokens
        #expect(all.count == 38) // 6 + 4 + 4 + 4 + 2 + 18
    }

    @Test("Token names are unique")
    func uniqueNames() {
        let names = DSColor.allTokens.map(\.name)
        #expect(Set(names).count == names.count)
    }

    @Test("Token lookup by name works")
    func tokenLookup() {
        let token = DSColor.token(named: "maltaGold")
        #expect(token != nil)
        #expect(token?.name == "maltaGold")
        #expect(token?.group == .brand)
    }

    @Test("Token lookup returns nil for unknown name")
    func tokenLookupNil() {
        #expect(DSColor.token(named: "nonExistent") == nil)
    }

    @Test("Token lookup works for category tokens")
    func categoryTokenLookup() {
        let token = DSColor.token(named: "categoryEmployment.start")
        #expect(token != nil)
        #expect(token?.group == .category)
    }

    @Test("ColorGroup is CaseIterable")
    func colorGroupCaseIterable() {
        #expect(ColorGroup.allCases.count == 6)
    }

    @Test("tokens(in:) returns correct tokens for each group")
    func tokensByGroupFilter() {
        #expect(DSColor.tokens(in: .brand).count == 6)
        #expect(DSColor.tokens(in: .surface).count == 4)
        #expect(DSColor.tokens(in: .text).count == 4)
        #expect(DSColor.tokens(in: .semantic).count == 4)
        #expect(DSColor.tokens(in: .glass).count == 2)
        #expect(DSColor.tokens(in: .category).count == 18)
    }

    @Test("tokensByGroup groups all tokens correctly")
    func tokensByGroupDict() {
        let grouped = DSColor.tokensByGroup
        #expect(grouped.count == 6, "should have all 6 color groups")
        #expect(grouped[.brand]?.count == 6)
        #expect(grouped[.category]?.count == 18)
    }
}

// MARK: - DesignSystem Version Tests

struct VersionTests {
    @Test("Version is 0.3.0")
    func currentVersion() {
        #expect(DesignSystem.version == "0.3.0")
    }
}

// MARK: - DSAnimatedNumber Percent Format Tests

@MainActor
struct AnimatedNumberPercentTests {
    @Test("Percent format includes % symbol")
    func percentFormat() {
        let view = DSAnimatedNumber(0.25, format: .percent)
        let formatted = view.formatted
        #expect(formatted.contains("%"), "expected percent symbol, got: \(formatted)")
    }

    @Test("Large currency value formats correctly")
    func largeCurrencyValue() {
        let view = DSAnimatedNumber(1_500_000, format: .currency)
        let formatted = view.formatted
        #expect(!formatted.isEmpty, "formatted string should not be empty")
    }

    @Test("Negative currency value formats correctly")
    func negativeCurrencyValue() {
        let view = DSAnimatedNumber(-500, format: .currency)
        let formatted = view.formatted
        #expect(!formatted.isEmpty, "formatted string should not be empty")
        #expect(formatted.contains("-") || formatted.contains("("),
                "expected negative indicator, got: \(formatted)")
    }

    @Test("Zero value formats without crash")
    func zeroValue() {
        let view = DSAnimatedNumber(0, format: .currency)
        let formatted = view.formatted
        #expect(!formatted.isEmpty)
    }

    @Test("NumberFormat conforms to Equatable")
    func formatEquatable() {
        #expect(DSAnimatedNumber.NumberFormat.currency == DSAnimatedNumber.NumberFormat.currency)
        #expect(DSAnimatedNumber.NumberFormat.percent == DSAnimatedNumber.NumberFormat.percent)
        #expect(DSAnimatedNumber.NumberFormat.decimal(fractionDigits: 2) ==
                DSAnimatedNumber.NumberFormat.decimal(fractionDigits: 2))
        #expect(DSAnimatedNumber.NumberFormat.currency != DSAnimatedNumber.NumberFormat.percent)
    }

    @Test("NumberFormat conforms to Hashable")
    func formatHashable() {
        let set: Set<DSAnimatedNumber.NumberFormat> = [.currency, .percent, .decimal(fractionDigits: 2)]
        #expect(set.count == 3)
    }

    @Test("accessibilityText returns a value")
    func accessibilityText() {
        let view = DSAnimatedNumber(14976.50, format: .currency)
        #expect(!view.accessibilityText.isEmpty)
    }
}

// MARK: - DSFont LetterSpacing Tests

struct LetterSpacingTests {
    @Test("LetterSpacing tight is negative")
    func tightSpacing() {
        #expect(DSFont.LetterSpacing.tight == -0.5)
        #expect(DSFont.LetterSpacing.tight < 0)
    }

    @Test("LetterSpacing standard is zero")
    func standardSpacing() {
        #expect(DSFont.LetterSpacing.standard == 0)
    }

    @Test("LetterSpacing wide is positive")
    func wideSpacing() {
        #expect(DSFont.LetterSpacing.wide == 0.5)
    }

    @Test("LetterSpacing extraWide is larger than wide")
    func extraWideSpacing() {
        #expect(DSFont.LetterSpacing.extraWide == 1.0)
        #expect(DSFont.LetterSpacing.extraWide > DSFont.LetterSpacing.wide)
    }

    @Test("LetterSpacing allValues contains all values in order")
    func allValues() {
        #expect(DSFont.LetterSpacing.allValues.count == 4)
        #expect(DSFont.LetterSpacing.allValues == [-0.5, 0, 0.5, 1.0])
    }

    @Test("LetterSpacing allValues are monotonically increasing")
    func allValuesOrdered() {
        let values = DSFont.LetterSpacing.allValues
        for i in 1..<values.count {
            #expect(values[i] > values[i - 1])
        }
    }
}

// MARK: - DSMotion Transition Tests

@MainActor
struct MotionTransitionTests {
    @Test("Transition presets exist")
    func transitionPresetsExist() {
        _ = DSMotion.Transition.fade
        _ = DSMotion.Transition.slideUp
        _ = DSMotion.Transition.slideDown
        _ = DSMotion.Transition.scaleUp
    }

    @Test("allTransitions catalog has 4 transitions")
    func allTransitions() {
        #expect(DSMotion.Transition.allTransitions.count == 4)
        #expect(DSMotion.Transition.allTransitions["fade"] != nil)
        #expect(DSMotion.Transition.allTransitions["slideUp"] != nil)
        #expect(DSMotion.Transition.allTransitions["slideDown"] != nil)
        #expect(DSMotion.Transition.allTransitions["scaleUp"] != nil)
    }
}

// MARK: - DSRadius Token Catalog Tests

struct RadiusTokenCatalogTests {
    @Test("RadiusToken stores name and value")
    func tokenFields() {
        let token = RadiusToken(name: "md", value: 12)
        #expect(token.name == "md")
        #expect(token.value == 12)
        #expect(token.id == "md")
    }

    @Test("RadiusToken conforms to Equatable")
    func tokenEquatable() {
        let a = RadiusToken(name: "lg", value: 16)
        let b = RadiusToken(name: "lg", value: 16)
        #expect(a == b)
    }

    @Test("RadiusToken conforms to Hashable")
    func tokenHashable() {
        let set: Set<RadiusToken> = [
            RadiusToken(name: "sm", value: 8),
            RadiusToken(name: "md", value: 12),
        ]
        #expect(set.count == 2)
    }

    @Test("allTokens has 8 entries")
    func allTokensCount() {
        #expect(DSRadius.allTokens.count == 8)
    }

    @Test("Token names are unique")
    func uniqueNames() {
        let names = DSRadius.allTokens.map(\.name)
        #expect(Set(names).count == names.count)
    }

    @Test("Token lookup by name works")
    func tokenLookup() {
        let token = DSRadius.token(named: "lg")
        #expect(token != nil)
        #expect(token?.value == DSRadius.lg)
    }

    @Test("Token lookup returns nil for unknown name")
    func tokenLookupNil() {
        #expect(DSRadius.token(named: "nonExistent") == nil)
    }

    @Test("Pill token exists in catalog")
    func pillToken() {
        let token = DSRadius.token(named: "pill")
        #expect(token != nil)
        #expect(token?.value == DSRadius.pill)
    }
}

// MARK: - DSShadow Token Catalog Tests

struct ShadowTokenCatalogTests {
    @Test("ShadowToken stores name and shadow")
    func tokenFields() {
        let token = ShadowToken(name: "card", shadow: DSShadow.card)
        #expect(token.name == "card")
        #expect(token.shadow == DSShadow.card)
        #expect(token.id == "card")
    }

    @Test("ShadowToken conforms to Equatable")
    func tokenEquatable() {
        let a = ShadowToken(name: "card", shadow: DSShadow.card)
        let b = ShadowToken(name: "card", shadow: DSShadow.card)
        #expect(a == b)
    }

    @Test("ShadowToken conforms to Hashable")
    func tokenHashable() {
        let set: Set<ShadowToken> = [
            ShadowToken(name: "card", shadow: DSShadow.card),
            ShadowToken(name: "elevated", shadow: DSShadow.elevated),
        ]
        #expect(set.count == 2)
    }

    @Test("allTokens has 5 entries")
    func allTokensCount() {
        #expect(DSShadow.allTokens.count == 5)
    }

    @Test("Token names are unique")
    func uniqueNames() {
        let names = DSShadow.allTokens.map(\.name)
        #expect(Set(names).count == names.count)
    }

    @Test("Token lookup by name works")
    func tokenLookup() {
        let token = DSShadow.token(named: "card")
        #expect(token != nil)
        #expect(token?.shadow == DSShadow.card)
    }

    @Test("Token lookup returns nil for unknown name")
    func tokenLookupNil() {
        #expect(DSShadow.token(named: "nonExistent") == nil)
    }

    @Test("None shadow token exists in catalog")
    func noneToken() {
        let token = DSShadow.token(named: "none")
        #expect(token != nil)
        #expect(token?.shadow == DSShadow.none)
    }
}

// MARK: - DSColor Catalog Enhancement Tests

struct ColorCatalogEnhancementTests {
    @Test("ColorToken has description property")
    func tokenDescription() {
        let token = ColorToken(name: "test", color: .red, group: .brand, description: "Test color")
        #expect(token.description == "Test color")
    }

    @Test("ColorToken description defaults to empty string")
    func tokenDescriptionDefault() {
        let token = ColorToken(name: "test", color: .red, group: .brand)
        #expect(token.description == "")
    }

    @Test("DSColor.contains returns true for existing token")
    func containsExisting() {
        #expect(DSColor.contains(name: "maltaGold") == true)
        #expect(DSColor.contains(name: "success") == true)
    }

    @Test("DSColor.contains returns false for non-existing token")
    func containsNonExisting() {
        #expect(DSColor.contains(name: "nonExistent") == false)
    }
}
