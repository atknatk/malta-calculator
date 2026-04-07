//
//  DSSegmentedPicker.swift
//  DesignSystem
//

import SwiftUI

/// A styled segmented picker wrapper.
public struct DSSegmentedPicker<Value: Hashable>: View {
    @Binding var selection: Value
    let label: LocalizedStringResource
    let options: [(value: Value, label: LocalizedStringResource)]

    /// Creates a segmented picker.
    /// - Parameters:
    ///   - label: Picker label.
    ///   - selection: Binding to the selected value.
    ///   - options: Array of (value, label) pairs.
    public init(
        label: LocalizedStringResource,
        selection: Binding<Value>,
        options: [(value: Value, label: LocalizedStringResource)]
    ) {
        self.label = label
        self._selection = selection
        self.options = options
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Text(label)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
                .textCase(.uppercase)
                .tracking(0.5)

            Picker(selection: $selection) {
                ForEach(Array(options.enumerated()), id: \.offset) { _, option in
                    Text(option.label).tag(option.value)
                }
            } label: {
                Text(label)
            }
            .pickerStyle(.segmented)
        }
        .accessibilityElement(children: .contain)
    }
}
