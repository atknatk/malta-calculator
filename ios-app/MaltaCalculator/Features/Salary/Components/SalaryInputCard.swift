//
//  SalaryInputCard.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import SwiftUI

/// The main input card for the Salary screen — contains the gross
/// salary field, tax type/child/SSC pickers, birth date, benefits,
/// and COLA toggle.
struct SalaryInputCard: View {
    @Bindable var vm: SalaryViewModel

    var body: some View {
        DSCard {
            VStack(alignment: .leading, spacing: DSSpacing.lg) {
                Text("salary.input.sectionTitle")
                    .font(DSFont.headingM)
                    .foregroundStyle(DSColor.textPrimary)

                DSCurrencyField(
                    label: "salary.input.annualGross",
                    value: $vm.grossAnnual,
                    maxValue: 10_000_000
                )

                grossSplitPreview

                Divider()

                taxTypeSection
                if vm.isChildCountApplicable {
                    childCountSection
                }
                sscCategorySection
                birthDateSection
                benefitsSection
                colaSection
            }
        }
    }

    // MARK: - Gross Split

    private var grossSplitPreview: some View {
        Text(
            "salary.input.monthlySplit \((vm.grossAnnual / 12).eur)"
        )
        .font(DSFont.caption)
        .foregroundStyle(DSColor.textSecondary)
    }

    // MARK: - Tax Type

    private var taxTypeSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Text("salary.input.taxType")
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
                .textCase(.uppercase)
                .tracking(0.5)
            DSToggleGroup(
                options: SimpleTaxType.allCases,
                selection: $vm.simpleTaxType,
                label: { type in
                    switch type {
                    case .single:
                        String(localized: "salary.input.taxType.single")
                    case .married:
                        String(localized: "salary.input.taxType.married")
                    case .parent:
                        String(localized: "salary.input.taxType.parent")
                    }
                }
            )
            .accessibilityLabel(Text("salary.input.taxType"))
            .accessibilityHint(Text("salary.input.taxType.hint"))
        }
    }

    // MARK: - Child Count

    private var childCountSection: some View {
        DSStepper(
            label: "salary.input.childCount",
            value: $vm.childCount,
            range: 0...10
        )
        .accessibilityHint(Text("salary.input.childCount.hint"))
    }

    // MARK: - SSC Category

    private var sscCategorySection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Text("salary.input.sscCategory")
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
                .textCase(.uppercase)
                .tracking(0.5)
            DSToggleGroup(
                options: SSCCategory.allCases,
                selection: $vm.sscCategory,
                label: { $0.rawValue }
            )
            .accessibilityLabel(Text("salary.input.sscCategory"))
            .accessibilityHint(Text("salary.input.sscCategory.hint"))

            if vm.sscCategory != .c {
                autoSuggestBanner
            }
        }
    }

    private var autoSuggestBanner: some View {
        HStack(spacing: DSSpacing.xs) {
            Image(systemName: "lightbulb.fill")
                .foregroundStyle(DSColor.info)
                .imageScale(.small)
            Text("salary.input.sscRecommendation")
                .font(DSFont.caption)
                .foregroundStyle(DSColor.info)
        }
        .padding(.horizontal, DSSpacing.sm)
        .padding(.vertical, DSSpacing.xs)
        .background(
            DSColor.info.opacity(0.08),
            in: RoundedRectangle(cornerRadius: DSRadius.sm)
        )
        .accessibilityElement(children: .combine)
    }

    // MARK: - Birth Date

    private var birthDateSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            DSDatePickerCard(
                label: "salary.input.birthDate",
                date: $vm.birthDate
            )
            .accessibilityHint(Text("salary.input.birthDate.hint"))

            if vm.isBornBefore1962 {
                pre1962Banner
            }
        }
    }

    private var pre1962Banner: some View {
        HStack(spacing: DSSpacing.xs) {
            Image(systemName: "info.circle.fill")
                .foregroundStyle(DSColor.warning)
                .imageScale(.small)
            Text("salary.input.pre1962Warning")
                .font(DSFont.caption)
                .foregroundStyle(DSColor.warning)
        }
        .padding(.horizontal, DSSpacing.sm)
        .padding(.vertical, DSSpacing.xs)
        .background(
            DSColor.warning.opacity(0.08),
            in: RoundedRectangle(cornerRadius: DSRadius.sm)
        )
        .accessibilityElement(children: .combine)
    }

    // MARK: - Benefits

    private var benefitsSection: some View {
        DisclosureGroup(
            isExpanded: $vm.showingBenefitsSection,
            content: {
                VStack(spacing: DSSpacing.md) {
                    DSCurrencyField(
                        label: "salary.input.nonTaxBenefit",
                        value: $vm.yearlyNonTaxBenefit,
                        maxValue: 1_000_000
                    )
                    DSCurrencyField(
                        label: "salary.input.taxableBenefit",
                        value: $vm.yearlyTaxableBenefit,
                        maxValue: 1_000_000
                    )
                }
                .padding(.top, DSSpacing.xs)
            },
            label: {
                Text("salary.input.benefits")
                    .font(DSFont.bodyM)
                    .foregroundStyle(DSColor.textPrimary)
            }
        )
        .tint(DSColor.maltaGold)
        .accessibilityLabel(Text("salary.input.benefits"))
    }

    // MARK: - COLA

    @ViewBuilder
    private var colaSection: some View {
        if vm.isCOLASupported {
            Toggle(isOn: $vm.enableCOLA) {
                VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                    Text("salary.input.cola")
                        .font(DSFont.bodyM)
                        .foregroundStyle(DSColor.textPrimary)
                    Text("salary.input.cola.subtitle")
                        .font(DSFont.caption)
                        .foregroundStyle(DSColor.textSecondary)
                }
            }
            .tint(DSColor.maltaGold)
            .accessibilityLabel(Text("salary.input.cola"))
            .accessibilityHint(Text("salary.input.cola.hint"))
        }
    }
}
