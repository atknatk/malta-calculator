//
//  DSDatePickerCard.swift
//  DesignSystem
//

import SwiftUI

/// A date picker wrapped in a design-system card with label.
public struct DSDatePickerCard: View {
    @Binding var date: Date
    let label: LocalizedStringResource
    let displayedComponents: DatePickerComponents

    /// Creates a date picker card.
    /// - Parameters:
    ///   - label: Field label.
    ///   - date: Binding to the selected date.
    ///   - displayedComponents: Date picker components to show. Defaults to `.date`.
    public init(
        label: LocalizedStringResource,
        date: Binding<Date>,
        displayedComponents: DatePickerComponents = .date
    ) {
        self.label = label
        self._date = date
        self.displayedComponents = displayedComponents
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Text(label)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
                .textCase(.uppercase)
                .tracking(0.5)

            DatePicker(selection: $date, displayedComponents: displayedComponents) {
                EmptyView()
            }
            .datePickerStyle(.graphical)
            .tint(DSColor.maltaGold)
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(label)
    }
}
