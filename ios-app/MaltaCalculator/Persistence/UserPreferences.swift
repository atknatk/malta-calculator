//
//  UserPreferences.swift
//  MaltaCalculator
//

import Foundation
import SwiftData
import SwiftUI

/// Singleton-style user preference blob, keyed on the literal string
/// `"default"` so there is exactly one persistent row.
@Model
final class UserPreferences {
    /// Primary key — always `"default"` for the v1 schema.
    @Attribute(.unique) var id: String
    /// Raw value of ``AppTheme``.
    var themeRawValue: String
    /// ISO-4217 currency code. Fixed to `EUR` for v1 but persisted so
    /// the UI never hard-codes it.
    var currencyCode: String
    /// Default tax year surfaced by calculators.
    var defaultYear: Int
    /// Whether haptic feedback is enabled.
    var hapticsEnabled: Bool
    /// Opt-in iCloud sync toggle (requires app restart to take effect).
    var iCloudSyncEnabled: Bool
    /// Whether the user has completed the first-launch onboarding.
    var hasCompletedOnboarding: Bool
    /// User-preferred font scale multiplier.
    var preferredFontScale: Double
    /// Cached tax config version string (set by ``TaxConfigStore``).
    var taxConfigVersion: String?
    /// Last time the tax config refresh endpoint was polled.
    var lastConfigCheckAt: Date?

    init(
        id: String = "default",
        themeRawValue: String = AppTheme.system.rawValue,
        currencyCode: String = "EUR",
        defaultYear: Int = 2026,
        hapticsEnabled: Bool = true,
        iCloudSyncEnabled: Bool = false,
        hasCompletedOnboarding: Bool = false,
        preferredFontScale: Double = 1.0
    ) {
        self.id = id
        self.themeRawValue = themeRawValue
        self.currencyCode = currencyCode
        self.defaultYear = defaultYear
        self.hapticsEnabled = hapticsEnabled
        self.iCloudSyncEnabled = iCloudSyncEnabled
        self.hasCompletedOnboarding = hasCompletedOnboarding
        self.preferredFontScale = preferredFontScale
    }
}

/// User-visible theme selector. Maps to a SwiftUI `ColorScheme?`.
enum AppTheme: String, CaseIterable, Sendable {
    case system
    case light
    case dark

    /// The SwiftUI color scheme to force, or `nil` to follow the system.
    var colorScheme: ColorScheme? {
        switch self {
        case .system: return nil
        case .light: return .light
        case .dark: return .dark
        }
    }
}
