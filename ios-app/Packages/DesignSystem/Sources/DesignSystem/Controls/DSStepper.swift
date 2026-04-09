//
//  DSStepper.swift
//  DesignSystem
//

import SwiftUI

/// A pill-shaped stepper with +/- buttons for integer values.
///
/// Used for counts like number of children.
public struct DSStepper: View {
    @Binding var value: Int
    let label: LocalizedStringResource
    let range: ClosedRange<Int>

    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    /// Creates a design-system stepper.
    /// - Parameters:
    ///   - label: Descriptive label.
    ///   - value: Binding to the integer value.
    ///   - range: Allowed range. Defaults to `0...10`.
    public init(
        label: LocalizedStringResource,
        value: Binding<Int>,
        range: ClosedRange<Int> = 0...10
    ) {
        self.label = label
        self._value = value
        self.range = range
    }

    public var body: some View {
        HStack {
            Text(label)
                .font(DSFont.bodyM)
                .foregroundStyle(DSColor.textPrimary)

            Spacer()

            HStack(spacing: DSSpacing.sm) {
                Button {
                    if value > range.lowerBound {
                        value -= 1
                    }
                } label: {
                    Image(systemName: "minus")
                        .font(.system(size: 14, weight: .bold))
                        .frame(width: 44, height: 44)
                        .foregroundStyle(
                            value > range.lowerBound ? DSColor.maltaGold : DSColor.textTertiary
                        )
                }
                .disabled(value <= range.lowerBound)
                .accessibilityLabel(String(localized: "stepper.decrease"))
                .accessibilityHint(String(localized: "stepper.decrease.hint"))

                Text("\(value)")
                    .font(DSFont.body(18, weight: .bold))
                    .foregroundStyle(DSColor.textPrimary)
                    .frame(minWidth: 32)
                    .monospacedDigit()
                    .contentTransition(reduceMotion ? .identity : .numericText())

                Button {
                    if value < range.upperBound {
                        value += 1
                    }
                } label: {
                    Image(systemName: "plus")
                        .font(.system(size: 14, weight: .bold))
                        .frame(width: 44, height: 44)
                        .foregroundStyle(
                            value < range.upperBound ? DSColor.maltaGold : DSColor.textTertiary
                        )
                }
                .disabled(value >= range.upperBound)
                .accessibilityLabel(String(localized: "stepper.increase"))
                .accessibilityHint(String(localized: "stepper.increase.hint"))
            }
            .padding(.horizontal, DSSpacing.xs)
            .background(
                reduceTransparency
                    ? AnyShapeStyle(DSColor.surface)
                    : AnyShapeStyle(.regularMaterial),
                in: Capsule()
            )
            .overlay(
                Capsule().strokeBorder(DSColor.textSecondary.opacity(0.15), lineWidth: 1)
            )
        }
        #if os(iOS)
        .sensoryFeedback(.selection, trigger: value)
        #endif
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(label)
        .accessibilityValue("\(value)")
        .accessibilityAdjustableAction { direction in
            switch direction {
            case .increment:
                if value < range.upperBound { value += 1 }
            case .decrement:
                if value > range.lowerBound { value -= 1 }
            @unknown default:
                break
            }
        }
    }
}
