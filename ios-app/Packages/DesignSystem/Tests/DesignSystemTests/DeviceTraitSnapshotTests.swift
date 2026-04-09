//
//  DeviceTraitSnapshotTests.swift
//  DesignSystem
//
//  Snapshot tests covering multiple device widths (iPhone SE, iPad)
//  to ensure design system components adapt correctly across form factors.
//

import SwiftUI
import Testing
@testable import DesignSystem

#if canImport(UIKit)
import SnapshotTesting
import UIKit

// hostView() and DeviceWidth are provided by SnapshotHelpers.swift

// MARK: - iPhone SE Snapshots

@MainActor
@Suite("iPhone SE Device Trait Snapshots")
struct IPhoneSESnapshotTests {
    @Test("Button renders on iPhone SE width")
    func buttonSE() {
        let view = DSButton("Calculate Salary", icon: "eurosign.circle", variant: .primary, action: {})
        let vc = hostView(view, width: DeviceWidth.iPhoneSE)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Card renders on iPhone SE width")
    func cardSE() {
        let view = DSCard(.highlighted) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Net Salary").font(DSFont.headingM)
                Text("\u{20AC}24,500").font(DSFont.displayM)
            }
        }
        let vc = hostView(view, width: DeviceWidth.iPhoneSE)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Currency field renders on iPhone SE width")
    func currencyFieldSE() {
        struct Wrapper: View {
            @State var value: Decimal = 25_000
            var body: some View {
                DSCurrencyField(label: "Annual Gross Salary", value: $value)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), width: DeviceWidth.iPhoneSE)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Toggle group renders on iPhone SE width")
    func toggleGroupSE() {
        struct Wrapper: View {
            @State var selection = "Monthly"
            var body: some View {
                DSToggleGroup(
                    options: ["Monthly", "Yearly", "Weekly"],
                    selection: $selection,
                    label: { $0 }
                )
                .padding()
            }
        }
        let vc = hostView(Wrapper(), width: DeviceWidth.iPhoneSE)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Empty state renders on iPhone SE width")
    func emptyStateSE() {
        let view = DSEmptyState(
            title: "No Results",
            description: "Try adjusting your search criteria",
            icon: "magnifyingglass"
        )
        let vc = hostView(view, width: DeviceWidth.iPhoneSE)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Skeleton list renders on iPhone SE width")
    func skeletonListSE() {
        let view = DSSkeletonList(cardCount: 2)
            .padding()
            .frame(width: DeviceWidth.iPhoneSE)
        let vc = hostView(view, width: DeviceWidth.iPhoneSE)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Breakdown chart renders on iPhone SE width")
    func breakdownChartSE() {
        let segments = [
            BreakdownSegment(label: "Net Pay", value: 20_000, color: DSColor.success),
            BreakdownSegment(label: "Income Tax", value: 3_000, color: DSColor.error),
            BreakdownSegment(label: "SSC", value: 2_000, color: DSColor.warning),
        ]
        let view = DSBreakdownChart(
            segments: segments,
            centerValue: 25_000,
            centerLabel: "Gross"
        )
        .frame(width: 260, height: 260)
        .padding()
        let vc = hostView(view, width: DeviceWidth.iPhoneSE)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - iPad Snapshots

@MainActor
@Suite("iPad Device Trait Snapshots")
struct IPadSnapshotTests {
    @Test("Button renders on iPad width")
    func buttonIPad() {
        let view = DSButton("Calculate Salary", icon: "eurosign.circle", variant: .primary, action: {})
        let vc = hostView(view, width: DeviceWidth.iPad)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Card renders on iPad width")
    func cardIPad() {
        let view = DSCard(.highlighted) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Net Salary").font(DSFont.headingM)
                Text("\u{20AC}24,500").font(DSFont.displayM)
            }
        }
        let vc = hostView(view, width: DeviceWidth.iPad)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Currency field renders on iPad width")
    func currencyFieldIPad() {
        struct Wrapper: View {
            @State var value: Decimal = 25_000
            var body: some View {
                DSCurrencyField(label: "Annual Gross Salary", value: $value)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), width: DeviceWidth.iPad)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Section header renders on iPad width")
    func sectionHeaderIPad() {
        let view = DSSectionHeader(
            title: "Employment",
            subtitle: "Salary & benefits calculators",
            icon: "briefcase"
        )
        .padding()
        .frame(width: DeviceWidth.iPad)
        let vc = hostView(view, width: DeviceWidth.iPad)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Search field renders on iPad width")
    func searchFieldIPad() {
        struct Wrapper: View {
            @State var text = "mortgage"
            var body: some View {
                DSSearchField(text: $text)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), width: DeviceWidth.iPad)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Skeleton list renders on iPad width")
    func skeletonListIPad() {
        let view = DSSkeletonList(cardCount: 3)
            .padding()
            .frame(width: DeviceWidth.iPad)
        let vc = hostView(view, width: DeviceWidth.iPad)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Error state renders on iPad width")
    func errorStateIPad() {
        let view = DSErrorState(
            title: "Something Went Wrong",
            description: "Please check your connection and try again.",
            retryAction: {}
        )
        let vc = hostView(view, width: DeviceWidth.iPad)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Chip row renders on iPad width")
    func chipRowIPad() {
        let view = HStack(spacing: DSSpacing.xs) {
            DSChip("All", isSelected: true, action: {})
            DSChip("Employment", icon: "briefcase", action: {})
            DSChip("Property", icon: "house", action: {})
            DSChip("Banking", icon: "building.columns", action: {})
        }
        .padding()
        .frame(width: DeviceWidth.iPad)
        let vc = hostView(view, width: DeviceWidth.iPad)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Breakdown chart renders on iPad width")
    func breakdownChartIPad() {
        let segments = [
            BreakdownSegment(label: "Net Pay", value: 20_000, color: DSColor.success),
            BreakdownSegment(label: "Income Tax", value: 3_000, color: DSColor.error),
            BreakdownSegment(label: "SSC", value: 2_000, color: DSColor.warning),
        ]
        let view = DSBreakdownChart(
            segments: segments,
            centerValue: 25_000,
            centerLabel: "Gross"
        )
        .frame(width: 400, height: 400)
        .padding()
        let vc = hostView(view, width: DeviceWidth.iPad)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - iPhone SE + AX5 Combined Snapshots

@MainActor
@Suite("iPhone SE AX5 Device Trait Snapshots")
struct IPhoneSEAX5SnapshotTests {
    @Test("Button renders on iPhone SE at AX5")
    func buttonSEAX5() {
        let view = DSButton("Calculate", icon: "eurosign.circle", variant: .primary, action: {})
        let vc = hostView(
            view,
            contentSizeCategory: .accessibilityExtraExtraExtraLarge,
            width: DeviceWidth.iPhoneSE
        )
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Card renders on iPhone SE at AX5")
    func cardSEAX5() {
        let view = DSCard(.highlighted) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Net Salary").font(DSFont.headingM)
                Text("\u{20AC}24,500").font(DSFont.displayM)
            }
        }
        let vc = hostView(
            view,
            contentSizeCategory: .accessibilityExtraExtraExtraLarge,
            width: DeviceWidth.iPhoneSE
        )
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Toggle group renders on iPhone SE at AX5")
    func toggleGroupSEAX5() {
        struct Wrapper: View {
            @State var selection = "Monthly"
            var body: some View {
                DSToggleGroup(
                    options: ["Monthly", "Yearly"],
                    selection: $selection,
                    label: { $0 }
                )
                .padding()
            }
        }
        let vc = hostView(
            Wrapper(),
            contentSizeCategory: .accessibilityExtraExtraExtraLarge,
            width: DeviceWidth.iPhoneSE
        )
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - RTL Layout Direction Snapshots

@MainActor
@Suite("RTL Layout Direction Snapshots")
struct RTLLayoutSnapshotTests {
    @Test("Button renders in RTL layout")
    func buttonRTL() {
        let view = DSButton("Calculate Salary", icon: "eurosign.circle", variant: .primary, action: {})
        let vc = hostView(view, layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Card renders in RTL layout")
    func cardRTL() {
        let view = DSCard(.highlighted) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Net Salary").font(DSFont.headingM)
                Text("\u{20AC}24,500").font(DSFont.displayM)
            }
        }
        let vc = hostView(view, layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Currency field renders in RTL layout")
    func currencyFieldRTL() {
        struct Wrapper: View {
            @State var value: Decimal = 25_000
            var body: some View {
                DSCurrencyField(label: "Annual Gross Salary", value: $value)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Toggle group renders in RTL layout")
    func toggleGroupRTL() {
        struct Wrapper: View {
            @State var selection = "Monthly"
            var body: some View {
                DSToggleGroup(
                    options: ["Monthly", "Yearly", "Weekly"],
                    selection: $selection,
                    label: { $0 }
                )
                .padding()
            }
        }
        let vc = hostView(Wrapper(), layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Search field renders in RTL layout")
    func searchFieldRTL() {
        struct Wrapper: View {
            @State var text = "mortgage"
            var body: some View {
                DSSearchField(text: $text)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Section header renders in RTL layout")
    func sectionHeaderRTL() {
        let view = DSSectionHeader(
            title: "Employment",
            subtitle: "Salary & benefits calculators",
            icon: "briefcase"
        )
        .padding()
        .frame(width: 375)
        let vc = hostView(view, layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Chip row renders in RTL layout")
    func chipRowRTL() {
        let view = HStack(spacing: DSSpacing.xs) {
            DSChip("All", isSelected: true, action: {})
            DSChip("Employment", icon: "briefcase", action: {})
            DSChip("Property", icon: "house", action: {})
        }
        .padding()
        .frame(width: 375)
        let vc = hostView(view, layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Error state renders in RTL layout")
    func errorStateRTL() {
        let view = DSErrorState(
            title: "Something Went Wrong",
            description: "Please check your connection and try again.",
            retryAction: {}
        )
        let vc = hostView(view, layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Empty state renders in RTL layout")
    func emptyStateRTL() {
        let view = DSEmptyState(
            title: "No Results",
            description: "Try adjusting your search criteria",
            icon: "magnifyingglass"
        )
        let vc = hostView(view, layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Stepper renders in RTL layout")
    func stepperRTL() {
        struct Wrapper: View {
            @State var value = 2
            var body: some View {
                DSStepper(label: "Number of Children", value: $value, range: 0...10)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Breakdown chart renders in RTL layout")
    func breakdownChartRTL() {
        let segments = [
            BreakdownSegment(label: "Net Pay", value: 20_000, color: DSColor.success),
            BreakdownSegment(label: "Income Tax", value: 3_000, color: DSColor.error),
            BreakdownSegment(label: "SSC", value: 2_000, color: DSColor.warning),
        ]
        let view = DSBreakdownChart(
            segments: segments,
            centerValue: 25_000,
            centerLabel: "Gross"
        )
        .frame(width: 300, height: 300)
        .padding()
        let vc = hostView(view, layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Skeleton list renders in RTL layout")
    func skeletonListRTL() {
        let view = DSSkeletonList(cardCount: 2)
            .padding()
            .frame(width: 375)
        let vc = hostView(view, layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Animated number renders in RTL layout")
    func animatedNumberRTL() {
        let view = DSAnimatedNumber(24_500, format: .currency)
            .padding()
            .frame(width: 375)
        let vc = hostView(view, layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Slider field renders in RTL layout")
    func sliderFieldRTL() {
        struct Wrapper: View {
            @State var value: Decimal = Decimal(string: "4.5") ?? 0
            var body: some View {
                DSSliderField(
                    label: "Interest Rate",
                    value: $value,
                    range: 0...15,
                    step: 0.1,
                    suffix: "%"
                )
                .padding()
            }
        }
        let vc = hostView(Wrapper(), layoutDirection: .rightToLeft)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - iPad with Regular Size Class Snapshots

@MainActor
@Suite("iPad Regular Size Class Snapshots")
struct IPadRegularSizeClassSnapshotTests {
    @Test("Button renders with regular horizontal size class")
    func buttonRegularSizeClass() {
        let view = DSButton("Calculate Salary", icon: "eurosign.circle", variant: .primary, action: {})
        let vc = hostView(view, width: DeviceWidth.iPad, horizontalSizeClass: .regular)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Card renders with regular horizontal size class")
    func cardRegularSizeClass() {
        let view = DSCard(.highlighted) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Net Salary").font(DSFont.headingM)
                Text("\u{20AC}24,500").font(DSFont.displayM)
            }
        }
        let vc = hostView(view, width: DeviceWidth.iPad, horizontalSizeClass: .regular)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Error state renders with regular horizontal size class")
    func errorStateRegularSizeClass() {
        let view = DSErrorState(
            title: "Something Went Wrong",
            description: "Please check your connection and try again.",
            retryAction: {}
        )
        let vc = hostView(view, width: DeviceWidth.iPad, horizontalSizeClass: .regular)
        assertSnapshot(of: vc, as: .image)
    }
}

#endif
