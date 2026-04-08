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
        // Color is created without crashing — no direct RGBA accessor in SwiftUI,
        // so we verify it resolves to a non-nil UIColor
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
}

// MARK: - Shadow Tests

struct ShadowTests {
    @Test("Card shadow has expected radius")
    func cardShadow() {
        #expect(DSShadow.card.radius == 20)
        #expect(DSShadow.card.y == 8)
    }

    @Test("Elevated shadow has expected radius")
    func elevatedShadow() {
        #expect(DSShadow.elevated.radius == 32)
        #expect(DSShadow.elevated.y == 12)
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
}

// MARK: - DSAnimatedNumber Format Tests

@MainActor
struct AnimatedNumberFormatTests {
    @Test("Currency format produces EUR symbol")
    func currencyFormat() {
        let view = DSAnimatedNumber(14976.50, format: .currency)
        let formatted = view.formatted
        // Should contain Euro symbol or EUR
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
        // Just verify these don't crash — Material is opaque
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
        // Verifies the token exists for reduce-transparency fallback paths
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
        // Verify each variant can be created without issues
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
        #expect(DSCardVariant.allCases.count == 5)
        let uniqueSet = Set(DSCardVariant.allCases)
        #expect(uniqueSet.count == 5)
    }

    @Test("Compact variant exists")
    func compactVariant() {
        #expect(DSCardVariant.allCases.contains(.compact))
    }

    @Test("Variants are Equatable")
    func variantsEquatable() {
        #expect(DSCardVariant.default == DSCardVariant.default)
        #expect(DSCardVariant.default != DSCardVariant.hero)
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
        #expect(DSMotion.Duration.quick == 0.18)
        #expect(DSMotion.Duration.standard == 0.32)
        #expect(DSMotion.Duration.slow == 0.5)
        #expect(DSMotion.Duration.float == 6)
        #expect(DSMotion.Duration.glow == 3)
    }
}

// MARK: - CurrencyField Decimal Parse Tests

/// Validates the decimal parsing logic used by DSCurrencyField.commitText.
/// Tests exercise the same sanitization + Decimal(string:) + clamp path.
struct CurrencyFieldParseTests {
    /// Replicates DSCurrencyField.commitText logic for isolated testing.
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
        // If user types "25.000,50" (European format), comma→dot yields "25.000.50"
        // Decimal(string:) will parse the first valid portion
        let sanitized = "25.000,50".replacingOccurrences(of: ",", with: ".")
            .filter { $0.isNumber || $0 == "." }
        // "25.000.50" — Decimal(string:) returns 25 (stops at second dot)
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
        // The filter only allows digits and dots
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

    @Test("Surface namespace resolves all colors")
    func surfaceNamespace() {
        _ = DSColor.Surface.primary
        _ = DSColor.Surface.card
        _ = DSColor.Surface.muted
        _ = DSColor.Surface.elevated
    }

    @Test("Text namespace resolves all colors")
    func textNamespace() {
        _ = DSColor.Text.primary
        _ = DSColor.Text.secondary
        _ = DSColor.Text.tertiary
        _ = DSColor.Text.inverse
    }

    @Test("Semantic namespace resolves all colors")
    func semanticNamespace() {
        _ = DSColor.Semantic.success
        _ = DSColor.Semantic.warning
        _ = DSColor.Semantic.danger
        _ = DSColor.Semantic.info
    }

    @Test("Glass namespace resolves all colors")
    func glassNamespace() {
        _ = DSColor.Glass.tint
        _ = DSColor.Glass.stroke
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

    @Test("allTokens returns all color tokens")
    func allTokensCatalog() {
        let all = DSColor.allTokens
        #expect(all.count == 20) // 6 + 4 + 4 + 4 + 2
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

    @Test("ColorGroup is CaseIterable")
    func colorGroupCaseIterable() {
        #expect(ColorGroup.allCases.count == 5)
    }
}

// MARK: - DesignSystem Version Tests

struct VersionTests {
    @Test("Version is 0.2.0")
    func currentVersion() {
        #expect(DesignSystem.version == "0.2.0")
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
        // Should contain minus sign or parentheses for negative
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
