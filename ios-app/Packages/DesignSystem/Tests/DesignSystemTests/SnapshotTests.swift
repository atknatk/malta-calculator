//
//  SnapshotTests.swift
//  DesignSystem
//
//  Snapshot tests for Dynamic Type scaling of design system components.
//  Uses swift-snapshot-testing to verify components render correctly
//  at multiple ContentSizeCategory levels.
//

import SwiftUI
import Testing
@testable import DesignSystem

#if canImport(UIKit)
import UIKit
import SnapshotTesting

// MARK: - Dynamic Type Snapshot Helpers

/// Wraps a SwiftUI view in a UIHostingController configured for snapshot testing.
@MainActor
private func hostView<V: View>(
    _ view: V,
    contentSizeCategory: UIContentSizeCategory = .large,
    colorScheme: UIUserInterfaceStyle = .light,
    width: CGFloat = 375
) -> UIViewController {
    let hostingController = UIHostingController(rootView: view)
    hostingController.overrideUserInterfaceStyle = colorScheme

    let traits = UITraitCollection(preferredContentSizeCategory: contentSizeCategory)
    hostingController.view.translatesAutoresizingMaskIntoConstraints = false

    let container = UIViewController()
    container.overrideUserInterfaceStyle = colorScheme
    container.addChild(hostingController)
    container.view.addSubview(hostingController.view)
    hostingController.didMove(toParent: container)

    NSLayoutConstraint.activate([
        hostingController.view.leadingAnchor.constraint(equalTo: container.view.leadingAnchor),
        hostingController.view.trailingAnchor.constraint(equalTo: container.view.trailingAnchor),
        hostingController.view.topAnchor.constraint(equalTo: container.view.topAnchor),
    ])

    container.view.frame = CGRect(x: 0, y: 0, width: width, height: 0)
    container.view.setNeedsLayout()
    container.view.layoutIfNeeded()

    let size = hostingController.view.intrinsicContentSize
    container.view.frame = CGRect(x: 0, y: 0, width: width, height: max(size.height, 60))

    hostingController.view.frame = container.view.bounds
    container.view.setNeedsLayout()
    container.view.layoutIfNeeded()

    // Apply content size category via trait collection
    let parentTraits = UITraitCollection(traitsFrom: [
        UITraitCollection(userInterfaceStyle: colorScheme),
        traits,
    ])
    container.setOverrideTraitCollection(parentTraits, forChild: hostingController)

    return container
}

// MARK: - Button Dynamic Type Snapshot Tests

@MainActor
@Suite("Button Dynamic Type Snapshots")
struct ButtonDynamicTypeSnapshotTests {
    @Test("Button renders at default content size")
    func buttonDefaultSize() {
        let view = DSButton("Calculate Salary", icon: "eurosign.circle", variant: .primary, action: {})
        let vc = hostView(view, contentSizeCategory: .large)
        // Record mode: set `record: .all` to generate initial reference images.
        // After references are generated, remove `record:` to assert against them.
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Button renders at AX3 content size")
    func buttonAX3Size() {
        let view = DSButton("Calculate Salary", icon: "eurosign.circle", variant: .primary, action: {})
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Button renders at extraSmall content size")
    func buttonExtraSmallSize() {
        let view = DSButton("Calculate Salary", icon: "eurosign.circle", variant: .primary, action: {})
        let vc = hostView(view, contentSizeCategory: .extraSmall)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Loading button renders at default content size")
    func loadingButtonDefaultSize() {
        let view = DSButton("Loading", variant: .primary, isLoading: true, action: {})
        let vc = hostView(view, contentSizeCategory: .large)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Loading button renders at AX3 content size")
    func loadingButtonAX3Size() {
        let view = DSButton("Loading", variant: .primary, isLoading: true, action: {})
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Ghost button renders at AX3 content size")
    func ghostButtonAX3Size() {
        let view = DSButton("Cancel", variant: .ghost, action: {})
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Destructive button renders at AX3 content size")
    func destructiveButtonAX3Size() {
        let view = DSButton("Delete", icon: "trash", variant: .destructive, action: {})
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("All button variants render at default size")
    func allVariantsDefaultSize() {
        let variants: [(DSButtonVariant, String)] = [
            (.primary, "Primary"),
            (.secondary, "Secondary"),
            (.outline, "Outline"),
            (.ghost, "Ghost"),
            (.glow, "Glow"),
            (.destructive, "Destructive"),
        ]
        for (variant, label) in variants {
            let view = DSButton(LocalizedStringResource(stringLiteral: label), variant: variant, action: {})
            let vc = hostView(view, contentSizeCategory: .large)
            assertSnapshot(of: vc, as: .image, named: label, record: .missing)
        }
    }

    @Test("All button sizes render at AX3")
    func allSizesAX3() {
        let sizes: [(DSButtonSize, String)] = [
            (.small, "Small"),
            (.regular, "Regular"),
            (.large, "Large"),
        ]
        for (size, label) in sizes {
            let view = DSButton(LocalizedStringResource(stringLiteral: label), size: size, action: {})
            let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
            assertSnapshot(of: vc, as: .image, named: label, record: .missing)
        }
    }

    @Test("Outline button renders at AX3 content size")
    func outlineButtonAX3Size() {
        let view = DSButton("Outline Action", variant: .outline, action: {})
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Secondary button renders at AX3 content size")
    func secondaryButtonAX3Size() {
        let view = DSButton("Secondary", variant: .secondary, action: {})
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Glow button renders at AX3 content size")
    func glowButtonAX3Size() {
        let view = DSButton("Glow Action", variant: .glow, action: {})
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Button renders at extraExtraLarge content size")
    func buttonExtraExtraLargeSize() {
        let view = DSButton("Calculate", icon: "eurosign.circle", variant: .primary, action: {})
        let vc = hostView(view, contentSizeCategory: .extraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Loading button with large size renders scaled spinner")
    func loadingButtonLargeSize() {
        let view = DSButton("Loading", variant: .primary, size: .large, isLoading: true, action: {})
        let vc = hostView(view, contentSizeCategory: .large)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Loading button with small size renders mini spinner")
    func loadingButtonSmallSize() {
        let view = DSButton("Loading", variant: .primary, size: .small, isLoading: true, action: {})
        let vc = hostView(view, contentSizeCategory: .large)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }
}

// MARK: - Card Dynamic Type Snapshot Tests

@MainActor
@Suite("Card Dynamic Type Snapshots")
struct CardDynamicTypeSnapshotTests {
    private var sampleCardContent: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            Text("Net Salary")
                .font(DSFont.headingM)
            Text("\u{20AC}24,500")
                .font(DSFont.displayM)
        }
    }

    @Test("Card renders at default content size")
    func cardDefaultSize() {
        let view = DSCard(.default) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .large)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Card renders at AX3 content size")
    func cardAX3Size() {
        let view = DSCard(.default) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Card renders at extraSmall content size")
    func cardExtraSmallSize() {
        let view = DSCard(.default) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .extraSmall)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Highlighted card renders at AX3")
    func highlightedCardAX3() {
        let view = DSCard(.highlighted) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Hero card renders at AX3")
    func heroCardAX3() {
        let view = DSCard(.hero) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Compact card renders at AX3")
    func compactCardAX3() {
        let view = DSCard(.compact) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Destructive card renders at AX3")
    func destructiveCardAX3() {
        let view = DSCard(.destructive) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Info card renders at AX3")
    func infoCardAX3() {
        let view = DSCard(.info) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Success card renders at AX3")
    func successCardAX3() {
        let view = DSCard(.success) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Warning card renders at AX3")
    func warningCardAX3() {
        let view = DSCard(.warning) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Card renders at extraExtraLarge content size")
    func cardExtraExtraLargeSize() {
        let view = DSCard(.default) { sampleCardContent }
        let vc = hostView(view, contentSizeCategory: .extraExtraLarge)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("All card variants render at default size")
    func allVariantsDefaultSize() {
        let variants: [(DSCardVariant, String)] = [
            (.default, "Default"),
            (.compact, "Compact"),
            (.highlighted, "Highlighted"),
            (.hero, "Hero"),
            (.destructive, "Destructive"),
            (.info, "Info"),
            (.success, "Success"),
            (.warning, "Warning"),
        ]
        for (variant, label) in variants {
            let view = DSCard(variant) { sampleCardContent }
            let vc = hostView(view, contentSizeCategory: .large)
            assertSnapshot(of: vc, as: .image, named: label, record: .missing)
        }
    }
}

// MARK: - Dark Mode Dynamic Type Snapshot Tests

@MainActor
@Suite("Dark Mode Dynamic Type Snapshots")
struct DarkModeDynamicTypeSnapshotTests {
    @Test("Button renders in dark mode at AX3")
    func buttonDarkAX3() {
        let view = DSButton("Calculate", icon: "eurosign.circle", variant: .primary, action: {})
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Card renders in dark mode at AX3")
    func cardDarkAX3() {
        let view = DSCard(.highlighted) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Net Salary").font(DSFont.headingM)
                Text("\u{20AC}24,500").font(DSFont.displayM)
            }
        }
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Loading button renders in dark mode")
    func loadingButtonDark() {
        let view = DSButton("Saving", variant: .secondary, isLoading: true, action: {})
        let vc = hostView(view, contentSizeCategory: .large, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("All button variants render in dark mode")
    func allButtonVariantsDark() {
        let variants: [(DSButtonVariant, String)] = [
            (.primary, "Primary"),
            (.secondary, "Secondary"),
            (.outline, "Outline"),
            (.ghost, "Ghost"),
            (.glow, "Glow"),
            (.destructive, "Destructive"),
        ]
        for (variant, label) in variants {
            let view = DSButton(LocalizedStringResource(stringLiteral: label), variant: variant, action: {})
            let vc = hostView(view, contentSizeCategory: .large, colorScheme: .dark)
            assertSnapshot(of: vc, as: .image, named: "Dark-\(label)", record: .missing)
        }
    }

    @Test("Destructive card renders in dark mode at AX3")
    func destructiveCardDarkAX3() {
        let view = DSCard(.destructive) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Error").font(DSFont.headingM)
                Text("Something went wrong").font(DSFont.bodyM)
            }
        }
        let vc = hostView(view, contentSizeCategory: .accessibilityExtraExtraExtraLarge, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Success card renders in dark mode")
    func successCardDark() {
        let view = DSCard(.success) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Success").font(DSFont.headingM)
                Text("Operation completed").font(DSFont.bodyM)
            }
        }
        let vc = hostView(view, contentSizeCategory: .large, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }

    @Test("Warning card renders in dark mode")
    func warningCardDark() {
        let view = DSCard(.warning) {
            VStack(alignment: .leading, spacing: DSSpacing.sm) {
                Text("Warning").font(DSFont.headingM)
                Text("Please review").font(DSFont.bodyM)
            }
        }
        let vc = hostView(view, contentSizeCategory: .large, colorScheme: .dark)
        assertSnapshot(of: vc, as: .image, record: .missing)
    }
}

#endif
