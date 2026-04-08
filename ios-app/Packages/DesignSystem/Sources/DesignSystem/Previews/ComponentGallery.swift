//
//  ComponentGallery.swift
//  DesignSystem
//

import SwiftUI

/// A gallery view showing all design system components for visual review.
///
/// Use this in Xcode Previews to verify light/dark/AX sizing.
public struct ComponentGallery: View {
    @State private var sampleDecimal: Decimal = 35000
    @State private var samplePercent: Decimal = 15
    @State private var sampleSlider: Decimal = 25
    @State private var sampleToggle = 0
    @State private var sampleChildren = 2
    @State private var sampleDate = Date()
    @State private var sampleSearch = ""

    /// Creates a component gallery.
    public init() {}

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: DSSpacing.xl) {
                    buttonsSection
                    cardsSection
                    fieldsSection
                    togglesSection
                    miscSection
                }
                .padding()
            }
            .background(MeshBackground())
            .navigationTitle(String(localized: "gallery.title"))
        }
    }

    // MARK: - Sections

    private var buttonsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("Buttons").font(DSFont.headingM)
            DSButton("Primary", action: {})
            DSButton("Secondary", variant: .secondary, action: {})
            DSButton("Ghost", variant: .ghost, action: {})
            DSButton("Glow", icon: "sparkles", variant: .glow, action: {})
            DSButton("Destructive", variant: .destructive, action: {})
            DSButton("Loading", isLoading: true, action: {})
        }
    }

    private var cardsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("Cards").font(DSFont.headingM)
            DSCard {
                Text("Default Card").font(DSFont.bodyL)
            }
            DSCard(.highlighted) {
                Text("Highlighted Card").font(DSFont.bodyL)
            }
            DSCard(.hero) {
                Text("Hero Card").font(DSFont.bodyL)
            }
        }
    }

    private var fieldsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("Fields").font(DSFont.headingM)
            DSCurrencyField(label: "Annual Salary", value: $sampleDecimal)
            DSPercentField(label: "Tax Rate", value: $samplePercent)
            DSSliderField(
                label: "Loan Term",
                value: $sampleSlider,
                range: 1...40,
                step: 1,
                suffix: " years",
                fractionDigits: 0
            )
            DSStepper(label: "Children", value: $sampleChildren)
            DSSearchField(text: $sampleSearch)
        }
    }

    private var togglesSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("Toggles").font(DSFont.headingM)
            DSToggleGroup(
                options: [0, 1, 2],
                selection: $sampleToggle,
                label: { ["Single", "Married", "Parent"][$0] }
            )
        }
    }

    private var miscSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("Misc").font(DSFont.headingM)

            HStack {
                DSBadge("New", variant: .new)
                DSBadge("Soon", variant: .soon)
                DSBadge("Beta", variant: .beta)
            }

            DSSectionHeader(
                title: "Employment & Salary",
                subtitle: "Salary, Notice Period, Overtime",
                icon: "briefcase.fill"
            )

            DSAnimatedNumber(14976.50, format: .currency)
                .foregroundStyle(DSGradient.primary)
        }
    }
}

#Preview("Light") { ComponentGallery() }
#Preview("Dark") { ComponentGallery().preferredColorScheme(.dark) }
#Preview("AX3") { ComponentGallery().environment(\.sizeCategory, .accessibilityLarge) }
