//
//  View+Haptic.swift
//  DesignSystem
//

import SwiftUI

/// Haptic feedback styles available in the design system.
public enum DSHaptic: Sendable {
    /// Light impact (tap).
    case light
    /// Medium impact (selection change).
    case medium
    /// Heavy impact (significant action).
    case heavy
    /// Selection tick.
    case selection
    /// Success notification.
    case success
    /// Warning notification.
    case warning
    /// Error notification.
    case error
}

public extension View {
    /// Triggers haptic feedback when a value changes.
    ///
    /// Uses `sensoryFeedback` on iOS 17+. No-op on macOS.
    /// - Parameters:
    ///   - style: The haptic feedback style.
    ///   - trigger: A value that triggers the feedback when it changes.
    /// - Returns: A view that provides haptic feedback on value change.
    @ViewBuilder
    func dsHaptic<V: Equatable>(_ style: DSHaptic, trigger: V) -> some View {
        #if os(iOS)
        switch style {
        case .light:
            self.sensoryFeedback(.impact(flexibility: .soft, intensity: 0.5), trigger: trigger)
        case .medium:
            self.sensoryFeedback(.impact(flexibility: .solid, intensity: 0.7), trigger: trigger)
        case .heavy:
            self.sensoryFeedback(.impact(weight: .heavy), trigger: trigger)
        case .selection:
            self.sensoryFeedback(.selection, trigger: trigger)
        case .success:
            self.sensoryFeedback(.success, trigger: trigger)
        case .warning:
            self.sensoryFeedback(.warning, trigger: trigger)
        case .error:
            self.sensoryFeedback(.error, trigger: trigger)
        }
        #else
        self
        #endif
    }
}
