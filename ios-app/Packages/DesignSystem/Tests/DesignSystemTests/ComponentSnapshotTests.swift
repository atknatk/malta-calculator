//
//  ComponentSnapshotTests.swift
//  DesignSystem
//
//  Snapshot tests for additional design system components covering
//  light/dark/AX5 matrix per the testing strategy spec.
//  Uses swift-snapshot-testing (pointfreeco).
//

import SwiftUI
import Testing
@testable import DesignSystem

#if canImport(UIKit)
import UIKit
import SnapshotTesting

// hostView() is provided by SnapshotHelpers.swift (shared across all test files)

// MARK: - DSEmptyState Snapshots

@MainActor
@Suite("DSEmptyState Snapshots")
struct DSEmptyStateSnapshotTests {
    @Test("Empty state renders at default size — light")
    func emptyStateLight() {
        let view = DSEmptyState(
            title: "No Results",
            description: "Try adjusting your search criteria",
            icon: "magnifyingglass"
        )
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Empty state renders in dark mode")
    func emptyStateDark() {
        let view = DSEmptyState(
            title: "No Results",
            description: "Try adjusting your search criteria",
            icon: "magnifyingglass"
        )
        let vc = hostView(view, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Empty state renders at AX5")
    func emptyStateAX5() {
        let view = DSEmptyState(
            title: "No Results",
            description: "Try adjusting your search criteria",
            icon: "magnifyingglass"
        )
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSErrorState Snapshots

@MainActor
@Suite("DSErrorState Snapshots")
struct DSErrorStateSnapshotTests {
    @Test("Error state with retry — light")
    func errorStateWithRetryLight() {
        let view = DSErrorState(
            title: "Something Went Wrong",
            description: "Please check your connection and try again.",
            retryAction: {}
        )
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Error state with retry — dark")
    func errorStateWithRetryDark() {
        let view = DSErrorState(
            title: "Something Went Wrong",
            description: "Please check your connection and try again.",
            retryAction: {}
        )
        let vc = hostView(view, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Error state without retry — light")
    func errorStateWithoutRetry() {
        let view = DSErrorState(
            title: "Calculation Error",
            description: "The input values are out of range."
        )
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Error state at AX5")
    func errorStateAX5() {
        let view = DSErrorState(
            title: "Something Went Wrong",
            description: "Please check your connection and try again.",
            retryAction: {}
        )
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSSkeleton Snapshots

@MainActor
@Suite("DSSkeleton Snapshots")
struct DSSkeletonSnapshotTests {
    @Test("Skeleton line renders — light")
    func skeletonLineLight() {
        let view = VStack(spacing: DSSpacing.sm) {
            DSSkeleton(height: 20)
            DSSkeleton(width: 200, height: 16)
            DSSkeleton(height: 14)
        }
        .padding()
        .frame(width: 375)
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Skeleton card renders — light")
    func skeletonCardLight() {
        let view = DSSkeletonCard()
            .padding()
            .frame(width: 375)
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Skeleton list renders — light")
    func skeletonListLight() {
        let view = DSSkeletonList(cardCount: 3)
            .padding()
            .frame(width: 375)
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Skeleton card renders — dark")
    func skeletonCardDark() {
        let view = DSSkeletonCard()
            .padding()
            .frame(width: 375)
        let vc = hostView(view, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Skeleton list renders at AX5")
    func skeletonListAX5() {
        let view = DSSkeletonList(cardCount: 2)
            .padding()
            .frame(width: 375)
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSCurrencyField Snapshots

@MainActor
@Suite("DSCurrencyField Snapshots")
struct DSCurrencyFieldSnapshotTests {
    @Test("Currency field with value — light")
    func currencyFieldLight() {
        struct Wrapper: View {
            @State var value: Decimal = 25_000
            var body: some View {
                DSCurrencyField(label: "Annual Gross Salary", value: $value)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Currency field with value — dark")
    func currencyFieldDark() {
        struct Wrapper: View {
            @State var value: Decimal = 25_000
            var body: some View {
                DSCurrencyField(label: "Annual Gross Salary", value: $value)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), colorScheme: .dark, width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Currency field with zero — light")
    func currencyFieldZero() {
        struct Wrapper: View {
            @State var value: Decimal = 0
            var body: some View {
                DSCurrencyField(label: "Property Price", value: $value)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Currency field at AX5")
    func currencyFieldAX5() {
        struct Wrapper: View {
            @State var value: Decimal = 50_000
            var body: some View {
                DSCurrencyField(label: "Annual Salary", value: $value)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), contentSizeCategory: .accessibilityExtraExtraExtraLarge, width: 375)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSToggleGroup Snapshots

@MainActor
@Suite("DSToggleGroup Snapshots")
struct DSToggleGroupSnapshotTests {
    @Test("Toggle group with 3 options — light")
    func toggleGroupLight() {
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
        let vc = hostView(Wrapper(), width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Toggle group — dark")
    func toggleGroupDark() {
        struct Wrapper: View {
            @State var selection = "Yearly"
            var body: some View {
                DSToggleGroup(
                    options: ["Monthly", "Yearly", "Weekly"],
                    selection: $selection,
                    label: { $0 }
                )
                .padding()
            }
        }
        let vc = hostView(Wrapper(), colorScheme: .dark, width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Toggle group at AX5")
    func toggleGroupAX5() {
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
        let vc = hostView(Wrapper(), contentSizeCategory: .accessibilityExtraExtraExtraLarge, width: 375)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSSearchField Snapshots

@MainActor
@Suite("DSSearchField Snapshots")
struct DSSearchFieldSnapshotTests {
    @Test("Search field empty — light")
    func searchFieldEmptyLight() {
        struct Wrapper: View {
            @State var text = ""
            var body: some View {
                DSSearchField(text: $text)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Search field with text — light")
    func searchFieldWithTextLight() {
        struct Wrapper: View {
            @State var text = "mortgage"
            var body: some View {
                DSSearchField(text: $text)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Search field — dark")
    func searchFieldDark() {
        struct Wrapper: View {
            @State var text = ""
            var body: some View {
                DSSearchField(text: $text)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), colorScheme: .dark, width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Search field at AX5")
    func searchFieldAX5() {
        struct Wrapper: View {
            @State var text = "pension"
            var body: some View {
                DSSearchField(text: $text)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), contentSizeCategory: .accessibilityExtraExtraExtraLarge, width: 375)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSSectionHeader Snapshots

@MainActor
@Suite("DSSectionHeader Snapshots")
struct DSSectionHeaderSnapshotTests {
    @Test("Section header — light")
    func sectionHeaderLight() {
        let view = DSSectionHeader(
            title: "Employment",
            subtitle: "Salary & benefits calculators",
            icon: "briefcase"
        )
        .padding()
        .frame(width: 375)
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Section header — dark")
    func sectionHeaderDark() {
        let view = DSSectionHeader(
            title: "Employment",
            subtitle: "Salary & benefits calculators",
            icon: "briefcase"
        )
        .padding()
        .frame(width: 375)
        let vc = hostView(view, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Section header without subtitle — light")
    func sectionHeaderNoSubtitle() {
        let view = DSSectionHeader(
            title: "Property",
            icon: "house"
        )
        .padding()
        .frame(width: 375)
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Section header at AX5")
    func sectionHeaderAX5() {
        let view = DSSectionHeader(
            title: "Vehicle & Transport",
            subtitle: "Registration, license, and import costs",
            icon: "car"
        )
        .padding()
        .frame(width: 375)
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSChip Snapshots

@MainActor
@Suite("DSChip Snapshots")
struct DSChipSnapshotTests {
    @Test("Chip unselected — light")
    func chipUnselectedLight() {
        let view = HStack(spacing: DSSpacing.xs) {
            DSChip("All", action: {})
            DSChip("Employment", icon: "briefcase", action: {})
            DSChip("Property", icon: "house", isSelected: true, action: {})
        }
        .padding()
        .frame(width: 375)
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Chip — dark")
    func chipDark() {
        let view = HStack(spacing: DSSpacing.xs) {
            DSChip("All", isSelected: true, action: {})
            DSChip("Employment", icon: "briefcase", action: {})
        }
        .padding()
        .frame(width: 375)
        let vc = hostView(view, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Chip at AX5")
    func chipAX5() {
        let view = VStack(spacing: DSSpacing.xs) {
            DSChip("Employment", icon: "briefcase", isSelected: true, action: {})
            DSChip("Property", icon: "house", action: {})
        }
        .padding()
        .frame(width: 375)
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSAnimatedNumber Snapshots

@MainActor
@Suite("DSAnimatedNumber Snapshots")
struct DSAnimatedNumberSnapshotTests {
    @Test("Currency format — light")
    func currencyLight() {
        let view = DSAnimatedNumber(24_500, format: .currency)
            .padding()
            .frame(width: 375)
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Percent format — light")
    func percentLight() {
        let view = DSAnimatedNumber(Decimal(string: "22.5") ?? 0, format: .percent)
            .padding()
            .frame(width: 375)
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Currency format — dark")
    func currencyDark() {
        let view = DSAnimatedNumber(14_976, format: .currency)
            .padding()
            .frame(width: 375)
        let vc = hostView(view, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Currency format at AX5")
    func currencyAX5() {
        let view = DSAnimatedNumber(32_000, format: .currency)
            .padding()
            .frame(width: 375)
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Decimal format — light")
    func decimalLight() {
        let view = DSAnimatedNumber(Decimal(string: "4.5") ?? 0, format: .decimal(fractionDigits: 1))
            .padding()
            .frame(width: 375)
        let vc = hostView(view)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSStepper Snapshots

@MainActor
@Suite("DSStepper Snapshots")
struct DSStepperSnapshotTests {
    @Test("Stepper with value — light")
    func stepperLight() {
        struct Wrapper: View {
            @State var value = 2
            var body: some View {
                DSStepper(label: "Number of Children", value: $value, range: 0...10)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Stepper — dark")
    func stepperDark() {
        struct Wrapper: View {
            @State var value = 3
            var body: some View {
                DSStepper(label: "Number of Children", value: $value, range: 0...10)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), colorScheme: .dark, width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Stepper at minimum — light")
    func stepperAtMinimum() {
        struct Wrapper: View {
            @State var value = 0
            var body: some View {
                DSStepper(label: "Deferral Years", value: $value, range: 0...5)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Stepper at AX5")
    func stepperAX5() {
        struct Wrapper: View {
            @State var value = 5
            var body: some View {
                DSStepper(label: "Family Members", value: $value, range: 1...10)
                    .padding()
            }
        }
        let vc = hostView(Wrapper(), contentSizeCategory: .accessibilityExtraExtraExtraLarge, width: 375)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSSliderField Snapshots

@MainActor
@Suite("DSSliderField Snapshots")
struct DSSliderFieldSnapshotTests {
    @Test("Slider field — light")
    func sliderFieldLight() {
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
        let vc = hostView(Wrapper(), width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Slider field — dark")
    func sliderFieldDark() {
        struct Wrapper: View {
            @State var value: Decimal = 7
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
        let vc = hostView(Wrapper(), colorScheme: .dark, width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Slider field at AX5")
    func sliderFieldAX5() {
        struct Wrapper: View {
            @State var value: Decimal = 25
            var body: some View {
                DSSliderField(
                    label: "Loan Term",
                    value: $value,
                    range: 1...30,
                    step: 1,
                    suffix: " years",
                    fractionDigits: 0
                )
                .padding()
            }
        }
        let vc = hostView(Wrapper(), contentSizeCategory: .accessibilityExtraExtraExtraLarge, width: 375)
        assertSnapshot(of: vc, as: .image)
    }
}

// MARK: - DSBreakdownChart Snapshots

@MainActor
@Suite("DSBreakdownChart Snapshots")
struct DSBreakdownChartSnapshotTests {
    @Test("Breakdown chart — light")
    func breakdownChartLight() {
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
        let vc = hostView(view, width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Breakdown chart — dark")
    func breakdownChartDark() {
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
        let vc = hostView(view, colorScheme: .dark, width: 375)
        assertSnapshot(of: vc, as: .image)
    }

    @Test("Breakdown chart at AX5")
    func breakdownChartAX5() {
        let segments = [
            BreakdownSegment(label: "Principal", value: 240_000, color: DSColor.info),
            BreakdownSegment(label: "Interest", value: 160_000, color: DSColor.warning),
        ]
        let view = DSBreakdownChart(
            segments: segments,
            centerValue: 400_000,
            centerLabel: "Total Cost"
        )
        .frame(width: 300, height: 300)
        .padding()
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge, width: 375)
        assertSnapshot(of: vc, as: .image)
    }
}

#endif
