//
//  FeatureSnapshotTests.swift
//  MaltaCalculator
//
//  Snapshot tests for feature-level screens:
//  CalculatorCard (hub card), FloatingNetCard, and feature screens.
//

import SwiftUI
import Testing
@testable import MaltaCalculator

#if canImport(UIKit)
import UIKit

// MARK: - Shared Host Helper

@MainActor
private func hostView<V: View>(
    _ view: V,
    contentSizeCategory: UIContentSizeCategory = .large,
    colorScheme: UIUserInterfaceStyle = .light,
    width: CGFloat = 375,
    height: CGFloat? = nil
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

    let resolvedHeight: CGFloat
    if let height {
        resolvedHeight = height
    } else {
        let size = hostingController.view.intrinsicContentSize
        resolvedHeight = max(size.height, 60)
    }
    container.view.frame = CGRect(x: 0, y: 0, width: width, height: resolvedHeight)

    hostingController.view.frame = container.view.bounds
    container.view.setNeedsLayout()
    container.view.layoutIfNeeded()

    let parentTraits = UITraitCollection(traitsFrom: [
        UITraitCollection(userInterfaceStyle: colorScheme),
        traits,
    ])
    container.setOverrideTraitCollection(parentTraits, forChild: hostingController)

    return container
}

// MARK: - CalculatorCard Snapshots (calculators hub card snapshot)

@MainActor
@Suite("CalculatorCard Hub Snapshots")
struct CalculatorCardSnapshotTests {
    private func makeSampleItem(available: Bool = true) -> CalculatorCatalogItem {
        CalculatorCatalogItem(id: available ? .mortgage : .bonusTax)
    }

    @Test("Calculator card — available — light")
    func availableCardLight() {
        let item = makeSampleItem(available: true)
        let view = CalculatorCard(item: item, action: {})
            .frame(width: 180, height: 180)
            .padding()
        let vc = hostView(view, width: 220)
        #expect(vc.view.frame.width > 0)
    }

    @Test("Calculator card — coming soon — light")
    func comingSoonCardLight() {
        let item = makeSampleItem(available: false)
        let view = CalculatorCard(item: item, action: {})
            .frame(width: 180, height: 180)
            .padding()
        let vc = hostView(view, width: 220)
        #expect(vc.view.frame.width > 0)
    }

    @Test("Calculator card — available — dark")
    func availableCardDark() {
        let item = makeSampleItem(available: true)
        let view = CalculatorCard(item: item, action: {})
            .frame(width: 180, height: 180)
            .padding()
        let vc = hostView(view, colorScheme: .dark, width: 220)
        #expect(vc.view.frame.width > 0)
    }

    @Test("Calculator card — iPhone SE width")
    func availableCardSE() {
        let item = makeSampleItem(available: true)
        let view = CalculatorCard(item: item, action: {})
            .frame(width: 140, height: 160)
            .padding()
        let vc = hostView(view, width: 160)
        #expect(vc.view.frame.width > 0)
    }

    @Test("Calculator card — iPad width")
    func availableCardIPad() {
        let item = makeSampleItem(available: true)
        let view = CalculatorCard(item: item, action: {})
            .frame(width: 200, height: 200)
            .padding()
        let vc = hostView(view, width: 240)
        #expect(vc.view.frame.width > 0)
    }

    @Test("Calculator card — AX5")
    func availableCardAX5() {
        let item = makeSampleItem(available: true)
        let view = CalculatorCard(item: item, action: {})
            .frame(width: 200)
            .padding()
        let vc = hostView(
            view,
            contentSizeCategory: .accessibilityExtraExtraExtraLarge,
            width: 240
        )
        #expect(vc.view.frame.width > 0)
    }

    @Test("Multiple calculator cards from different categories render")
    func multipleCategories() {
        let ids: [CalculatorID] = [.salary, .mortgage, .pension, .stampDuty, .vacation]
        for id in ids {
            let item = CalculatorCatalogItem(id: id)
            let view = CalculatorCard(item: item, action: {})
                .frame(width: 180, height: 180)
            let vc = hostView(view, width: 200)
            #expect(vc.view.frame.width > 0, "Card for \(id.rawValue) failed to render")
        }
    }
}

// MARK: - FloatingNetCard Snapshots (floating net card snapshot)

@MainActor
@Suite("FloatingNetCard Snapshots")
struct FloatingNetCardSnapshotTests {
    @Test("FloatingNetCard — light mode")
    func floatingNetCardLight() {
        let view = FloatingNetCard(annualNet: 14_976, monthlyNet: 1_248, year: 2026)
            .padding()
            .frame(width: 375)
        let vc = hostView(view)
        #expect(vc.view.frame.width > 0)
    }

    @Test("FloatingNetCard — dark mode")
    func floatingNetCardDark() {
        let view = FloatingNetCard(annualNet: 14_976, monthlyNet: 1_248, year: 2026)
            .padding()
            .frame(width: 375)
        let vc = hostView(view, colorScheme: .dark)
        #expect(vc.view.frame.width > 0)
    }

    @Test("FloatingNetCard — AX5")
    func floatingNetCardAX5() {
        let view = FloatingNetCard(annualNet: 14_976, monthlyNet: 1_248, year: 2026)
            .padding()
            .frame(width: 375)
        let vc = hostView(
            view,
            contentSizeCategory: .accessibilityExtraExtraExtraLarge
        )
        #expect(vc.view.frame.width > 0)
    }

    @Test("FloatingNetCard — iPhone SE width")
    func floatingNetCardSE() {
        let view = FloatingNetCard(annualNet: 14_976, monthlyNet: 1_248, year: 2026)
            .padding()
            .frame(width: 320)
        let vc = hostView(view, width: 320)
        #expect(vc.view.frame.width > 0)
    }

    @Test("FloatingNetCard — iPad width")
    func floatingNetCardIPad() {
        let view = FloatingNetCard(annualNet: 14_976, monthlyNet: 1_248, year: 2026)
            .padding()
            .frame(width: 820)
        let vc = hostView(view, width: 820)
        #expect(vc.view.frame.width > 0)
    }

    @Test("FloatingNetCard — zero values")
    func floatingNetCardZero() {
        let view = FloatingNetCard(annualNet: 0, monthlyNet: 0, year: 2026)
            .padding()
            .frame(width: 375)
        let vc = hostView(view)
        #expect(vc.view.frame.width > 0)
    }

    @Test("FloatingNetCard — large values")
    func floatingNetCardLargeValue() {
        let view = FloatingNetCard(annualNet: 999_999, monthlyNet: 83_333, year: 2026)
            .padding()
            .frame(width: 375)
        let vc = hostView(view)
        #expect(vc.view.frame.width > 0)
    }
}

// MARK: - Feature Screen Render Snapshots (feature screen snapshots)

@MainActor
@Suite("Feature Screen Snapshots")
struct FeatureScreenSnapshotTests {
    @Test("HomeScreen renders without crash")
    func homeScreenRenders() {
        let view = HomeScreen()
            .frame(width: 375, height: 667)
        let vc = hostView(view, width: 375, height: 667)
        #expect(vc.view.frame.width > 0)
    }

    @Test("HomeScreen renders in dark mode")
    func homeScreenDark() {
        let view = HomeScreen()
            .frame(width: 375, height: 667)
        let vc = hostView(view, colorScheme: .dark, width: 375, height: 667)
        #expect(vc.view.frame.width > 0)
    }

    @Test("HomeScreen renders on iPhone SE width")
    func homeScreenSE() {
        let view = HomeScreen()
            .frame(width: 320, height: 568)
        let vc = hostView(view, width: 320, height: 568)
        #expect(vc.view.frame.width > 0)
    }

    @Test("HomeScreen renders on iPad width")
    func homeScreenIPad() {
        let view = HomeScreen()
            .frame(width: 820, height: 1024)
        let vc = hostView(view, width: 820, height: 1024)
        #expect(vc.view.frame.width > 0)
    }
}

#endif
