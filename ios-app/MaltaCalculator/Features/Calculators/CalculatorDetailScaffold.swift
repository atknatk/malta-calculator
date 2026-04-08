//
//  CalculatorDetailScaffold.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// A single line of explanatory information rendered inside the
/// ``CalculatorInfoSheet``.
struct InfoLine: Identifiable {
    /// Stable identifier for SwiftUI diffing.
    let id = UUID()
    /// Label shown on the leading side of the row.
    let label: LocalizedStringResource
    /// Value or description shown on the trailing side of the row.
    let value: LocalizedStringResource
}

/// Shared container that every calculator detail screen adopts.
///
/// The scaffold owns the hero header, input card, results card, info sheet
/// and the toolbar menu (share / save / reset). Feature screens provide two
/// `@ViewBuilder` closures for the input and results sections and a list of
/// ``InfoLine`` entries — no feature view contains its own navigation,
/// backgrounds, or sheet state.
struct CalculatorDetailScaffold<Inputs: View, Results: View>: View {
    /// Calculator identifier — used for VoiceOver label context.
    let id: CalculatorID
    /// Localized screen title (navigation bar + hero).
    let title: LocalizedStringResource
    /// Localized subtitle shown beneath the title.
    let subtitle: LocalizedStringResource
    /// SF Symbol rendered inside the hero badge.
    let symbolName: String
    /// Category used to color the hero badge gradient.
    let category: CalculatorCategory
    /// Input section builder.
    @ViewBuilder var inputs: () -> Inputs
    /// Results section builder.
    @ViewBuilder var results: () -> Results
    /// Lines rendered in the "How this is calculated" info sheet.
    let infoLines: [InfoLine]
    /// Invoked when the user taps the Save menu item. `nil` hides the action.
    let onSave: (() -> Void)?
    /// Invoked when the user taps the Share menu item. `nil` hides the action.
    let onShare: (() -> Void)?
    /// Invoked when the user taps the Reset menu item. `nil` hides the action.
    let onReset: (() -> Void)?

    @State private var showingInfo: Bool = false
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @ScaledMetric private var sectionSpacing: CGFloat = DSSpacing.lg

    var body: some View {
        ScrollView {
            VStack(spacing: sectionSpacing) {
                heroHeader
                DSCard { inputs() }
                DSCard(.highlighted) { results() }
                if !infoLines.isEmpty {
                    infoButton
                }
            }
            .padding(.horizontal, DSSpacing.md)
            .padding(.top, DSSpacing.md)
            .padding(.bottom, DSSpacing.xxl)
        }
        .scrollDismissesKeyboard(.interactively)
        .navigationTitle(Text(title))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar { toolbarContent }
        .sheet(isPresented: $showingInfo) {
            CalculatorInfoSheet(title: title, lines: infoLines)
        }
    }

    private var heroHeader: some View {
        HStack(spacing: DSSpacing.md) {
            ZStack {
                RoundedRectangle(cornerRadius: DSRadius.md)
                    .fill(
                        LinearGradient(
                            colors: category.gradientColors,
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    )
                    .frame(width: 56, height: 56)
                Image(systemName: symbolName)
                    .font(.title2.weight(.bold))
                    .foregroundStyle(.white)
            }
            .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(DSFont.headingL)
                    .foregroundStyle(DSColor.textPrimary)
                Text(subtitle)
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)
            }
            Spacer(minLength: 0)
        }
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(.isHeader)
    }

    private var infoButton: some View {
        Button {
            showingInfo = true
        } label: {
            HStack {
                Image(systemName: "info.circle")
                Text("calculator.info.button")
                Spacer()
                Image(systemName: "chevron.right")
            }
            .font(DSFont.body(15))
            .foregroundStyle(DSColor.textPrimary)
            .padding(DSSpacing.md)
            .frame(minHeight: 44)
            .background(
                RoundedRectangle(cornerRadius: DSRadius.lg)
                    .fill(reduceTransparency ? AnyShapeStyle(DSColor.surface) : AnyShapeStyle(.regularMaterial))
            )
        }
        .buttonStyle(.plain)
        .accessibilityHint(Text("calculator.info.hint"))
    }

    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            Menu {
                if let onShare {
                    Button(action: onShare) {
                        Label("calculator.menu.share", systemImage: "square.and.arrow.up")
                    }
                }
                if let onSave {
                    Button(action: onSave) {
                        Label("calculator.menu.save", systemImage: "bookmark")
                    }
                }
                if let onReset {
                    Button(role: .destructive, action: onReset) {
                        Label("calculator.menu.reset", systemImage: "arrow.counterclockwise")
                    }
                }
            } label: {
                Image(systemName: "ellipsis.circle")
            }
            .accessibilityLabel(Text("calculator.menu.label"))
        }
    }
}

/// Sheet shown when the user taps "How this is calculated" on a detail screen.
struct CalculatorInfoSheet: View {
    let title: LocalizedStringResource
    let lines: [InfoLine]
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List(lines) { line in
                VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                    Text(line.label)
                        .font(DSFont.caption)
                        .foregroundStyle(DSColor.textSecondary)
                        .textCase(.uppercase)
                        .tracking(0.5)
                    Text(line.value)
                        .font(DSFont.body(15))
                        .foregroundStyle(DSColor.textPrimary)
                }
                .padding(.vertical, DSSpacing.xxs)
            }
            .listStyle(.insetGrouped)
            .navigationTitle(Text(title))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(String(localized: "calculator.info.done")) { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
    }
}

/// Shared formatter for consumer-facing euro values in result cards.
enum CalculatorFormat {
    /// Returns a rounded euro string, e.g. `€1,336.76`.
    static func currency(_ value: Decimal, fractionDigits: Int = 2) -> String {
        value.formatted(
            .currency(code: "EUR")
                .precision(.fractionLength(fractionDigits))
        )
    }

    /// Returns a percentage string, e.g. `4.5%`.
    static func percent(_ value: Decimal, fractionDigits: Int = 2) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .decimal
        formatter.maximumFractionDigits = fractionDigits
        formatter.minimumFractionDigits = 0
        let str = formatter.string(from: value as NSDecimalNumber) ?? "\(value)"
        return "\(str)%"
    }
}

/// A reusable key/value row used inside the results card of every calculator.
struct CalculatorResultRow: View {
    let label: LocalizedStringResource
    let value: String
    var emphasis: Bool = false

    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            Text(label)
                .font(DSFont.body(15))
                .foregroundStyle(DSColor.textSecondary)
            Spacer(minLength: DSSpacing.md)
            Text(value)
                .font(emphasis ? DSFont.headingM : DSFont.body(15, weight: .semibold))
                .foregroundStyle(emphasis ? DSColor.maltaGold : DSColor.textPrimary)
                .monospacedDigit()
        }
        .padding(.vertical, 2)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text(label))
        .accessibilityValue(value)
    }
}
