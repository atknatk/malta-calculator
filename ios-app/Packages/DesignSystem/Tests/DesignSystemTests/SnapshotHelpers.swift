//
//  SnapshotHelpers.swift
//  DesignSystem
//
//  Shared snapshot test helpers for the DesignSystem package.
//  Provides a single `hostView()` function that wraps SwiftUI views
//  in a UIHostingController configured for deterministic snapshot testing.
//
//  Supports: width, height, content size category, color scheme,
//  layout direction (RTL), and iPad horizontal size class traits.
//

import SwiftUI

#if canImport(UIKit)
import UIKit

/// Standard device widths for snapshot trait coverage.
enum DeviceWidth {
    /// iPhone SE (3rd gen) — 320pt
    static let iPhoneSE: CGFloat = 320
    /// iPhone 16 standard — 393pt
    static let iPhone16: CGFloat = 393
    /// iPhone 16 Pro Max — 430pt
    static let iPhone16ProMax: CGFloat = 430
    /// iPad (10th gen) — 820pt
    static let iPad: CGFloat = 820
}

/// Wraps a SwiftUI view in a UIHostingController configured for snapshot testing.
///
/// - Parameters:
///   - view: The SwiftUI view to host.
///   - contentSizeCategory: Dynamic Type size category (default: `.large`).
///   - colorScheme: Light or dark appearance (default: `.light`).
///   - width: Container width in points (default: `375`).
///   - height: Optional fixed height. If `nil`, uses intrinsic content size.
///   - layoutDirection: Layout direction for RTL testing (default: `.leftToRight`).
///   - horizontalSizeClass: Optional horizontal size class override (e.g. `.regular` for iPad).
/// - Returns: A `UIViewController` ready for snapshot assertion.
@MainActor
func hostView<V: View>(
    _ view: V,
    contentSizeCategory: UIContentSizeCategory = .large,
    colorScheme: UIUserInterfaceStyle = .light,
    width: CGFloat = 375,
    height: CGFloat? = nil,
    layoutDirection: UITraitEnvironmentLayoutDirection = .leftToRight,
    horizontalSizeClass: UIUserInterfaceSizeClass? = nil
) -> UIViewController {
    // Wrap view with explicit layout direction for RTL support
    let wrappedView = view.environment(
        \.layoutDirection,
        layoutDirection == .rightToLeft ? .rightToLeft : .leftToRight
    )

    let hostingController = UIHostingController(rootView: wrappedView)
    hostingController.overrideUserInterfaceStyle = colorScheme
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

    // Build trait collection
    var traitComponents: [UITraitCollection] = [
        UITraitCollection(userInterfaceStyle: colorScheme),
        UITraitCollection(preferredContentSizeCategory: contentSizeCategory),
        UITraitCollection(layoutDirection: layoutDirection),
    ]
    if let sizeClass = horizontalSizeClass {
        traitComponents.append(UITraitCollection(horizontalSizeClass: sizeClass))
    }
    let parentTraits = UITraitCollection(traitsFrom: traitComponents)
    container.setOverrideTraitCollection(parentTraits, forChild: hostingController)

    return container
}

#endif
