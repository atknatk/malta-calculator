//
//  DSErrorState.swift
//  DesignSystem
//

import SwiftUI

/// A reusable error state view with retry action.
///
/// Shows an error icon, localized title, description, and a retry button.
/// Used by all feature screens when an error occurs.
public struct DSErrorState: View {
    let title: LocalizedStringResource
    let description: LocalizedStringResource
    let icon: String
    let retryAction: (() -> Void)?

    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    /// Creates an error state view.
    /// - Parameters:
    ///   - title: Error title.
    ///   - description: Explanatory error text.
    ///   - icon: SF Symbol name. Defaults to `"exclamationmark.triangle"`.
    ///   - retryAction: Optional retry closure. If nil, no retry button is shown.
    public init(
        title: LocalizedStringResource,
        description: LocalizedStringResource,
        icon: String = "exclamationmark.triangle",
        retryAction: (() -> Void)? = nil
    ) {
        self.title = title
        self.description = description
        self.icon = icon
        self.retryAction = retryAction
    }

    public var body: some View {
        ContentUnavailableView {
            Label(title, systemImage: icon)
                .foregroundStyle(DSColor.danger)
        } description: {
            Text(description)
                .font(DSFont.bodyM)
                .foregroundStyle(DSColor.textSecondary)
        } actions: {
            if let retryAction {
                Button(action: retryAction) {
                    Label(String(localized: "error.retry", bundle: .module), systemImage: "arrow.clockwise")
                        .font(DSFont.label)
                }
                .buttonStyle(.borderedProminent)
                .tint(DSColor.maltaGold)
                .accessibilityLabel(String(localized: "error.retry", bundle: .module))
                .accessibilityHint(String(localized: "error.retry.hint", bundle: .module))
            }
        }
    }
}
