//
//  DSToggleGroup.swift
//  DesignSystem
//

import SwiftUI

/// A segmented toggle group with animated selection indicator.
///
/// Used for mutually exclusive options like tax category or employment type.
public struct DSToggleGroup<Value: Hashable & Sendable>: View {
    let options: [Value]
    @Binding var selection: Value
    let label: (Value) -> String

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @Namespace private var namespace

    /// Creates a toggle group.
    /// - Parameters:
    ///   - options: Array of selectable values.
    ///   - selection: Binding to the currently selected value.
    ///   - label: Closure that provides a display string for each value.
    public init(
        options: [Value],
        selection: Binding<Value>,
        label: @escaping (Value) -> String
    ) {
        self.options = options
        self._selection = selection
        self.label = label
    }

    public var body: some View {
        HStack(spacing: 0) {
            ForEach(Array(options.enumerated()), id: \.offset) { _, option in
                Button {
                    if reduceMotion {
                        selection = option
                    } else {
                        withAnimation(DSMotion.quick) { selection = option }
                    }
                } label: {
                    Text(label(option))
                        .font(DSFont.body(14, weight: .medium))
                        .foregroundStyle(selection == option ? .white : DSColor.textPrimary)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background {
                            if selection == option {
                                RoundedRectangle(cornerRadius: DSRadius.sm)
                                    .fill(DSGradient.primary)
                                    .matchedGeometryEffect(id: "toggle", in: namespace)
                            }
                        }
                }
                .buttonStyle(.plain)
                .accessibilityLabel(Text(label(option)))
                .accessibilityAddTraits(selection == option ? .isSelected : [])
            }
        }
        .padding(DSSpacing.xxs)
        .background(
            reduceTransparency
                ? AnyShapeStyle(DSColor.surface)
                : AnyShapeStyle(.regularMaterial),
            in: RoundedRectangle(cornerRadius: DSRadius.md)
        )
        .overlay(
            RoundedRectangle(cornerRadius: DSRadius.md)
                .strokeBorder(DSColor.textSecondary.opacity(0.15), lineWidth: 1)
        )
        #if os(iOS)
        .sensoryFeedback(.selection, trigger: selection)
        #endif
        .accessibilityElement(children: .contain)
    }
}
