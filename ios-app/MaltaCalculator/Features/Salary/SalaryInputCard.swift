//
//  SalaryInputCard.swift
//  MaltaCalculator
//

import SwiftUI
import DesignSystem
import CalculationKit

/// The input card section of the Salary Calculator.
///
/// Contains gross salary field, tax type, child count, SSC category,
/// birth date, benefits, and COLA toggle.
struct SalaryInputCard: View {
    @Bindable var vm: SalaryViewModel
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        DSCard(.default) {
            VStack(alignment: .leading, spacing: DSSpacing.lg) {
                Text("salary.input.title")
                    .font(DSFont.headingM)
                    .foregroundStyle(DSColor.textPrimary)

                DSCurrencyField(
                    label: "salary.input.annualGross",
                    value: $vm.grossAnnual,
                    maxValue: 10_000_000
                )

                Text("salary.input.monthlyEquivalent \(vm.monthlyGross.eur)")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)

                Divider()

                taxTypeSection
                if vm.isChildCountVisible {
                    childCountSection
                }
                sscCategorySection
                birthDateSection
                benefitsSection
                if vm.isCOLAVisible {
                    colaSection
                }
            }
        }
    }

    // MARK: - Tax Type

    private var taxTypeSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Text("salary.input.taxType")
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
                .textCase(.uppercase)
                .tracking(DSFont.LetterSpacing.wide)

            DSToggleGroup(
                options: SimpleTaxType.allCases,
                selection: $vm.simpleTaxType,
                label: { type in
                    switch type {
                    case .single: String(localized: "salary.taxType.single")
                    case .married: String(localized: "salary.taxType.married")
                    case .parent: String(localized: "salary.taxType.parent")
                    }
                }
            )
            .accessibilityLabel(
                String(localized: "salary.input.taxType.accessibilityLabel")
            )
        }
    }

    // MARK: - Child Count

    private var childCountSection: some View {
        DSStepper(
            label: "salary.input.childCount",
            value: $vm.childCount,
            range: 0...10
        )
    }

    // MARK: - SSC Category

    private var sscCategorySection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Text("salary.input.sscCategory")
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
                .textCase(.uppercase)
                .tracking(DSFont.LetterSpacing.wide)

            DSToggleGroup(
                options: SSCCategory.allCases,
                selection: $vm.sscCategory,
                label: { $0.rawValue }
            )
            .accessibilityLabel(
                String(localized: "salary.input.sscCategory.accessibilityLabel")
            )

            if let suggested = vm.suggestedSSCCategory {
                HStack(spacing: DSSpacing.xs) {
                    Image(systemName: "info.circle.fill")
                        .foregroundStyle(DSColor.info)
                    Text("salary.input.sscSuggestion \(suggested.rawValue)")
                        .font(DSFont.caption)
                        .foregroundStyle(DSColor.textSecondary)
                }
            }
        }
    }

    // MARK: - Birth Date

    private var birthDateSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            Button {
                withAnimation(reduceMotion ? DSMotion.instant : DSMotion.standard) {
                    vm.showingBirthDatePicker.toggle()
                }
            } label: {
                HStack {
                    Text("salary.input.birthDate")
                        .font(DSFont.caption)
                        .foregroundStyle(DSColor.textSecondary)
                        .textCase(.uppercase)
                        .tracking(DSFont.LetterSpacing.wide)
                    Spacer()
                    Text(vm.birthDate, format: .dateTime.day().month().year())
                        .font(DSFont.bodyM)
                        .foregroundStyle(DSColor.textPrimary)
                    Image(systemName: vm.showingBirthDatePicker ? "chevron.up" : "chevron.down")
                        .font(.caption)
                        .foregroundStyle(DSColor.textTertiary)
                }
            }
            .buttonStyle(.plain)
            .accessibilityLabel(
                String(localized: "salary.input.birthDate.accessibilityLabel")
            )
            .accessibilityHint(
                String(localized: "salary.input.birthDate.accessibilityHint")
            )

            if vm.showingBirthDatePicker {
                DSDatePickerCard(
                    label: "salary.input.birthDate.picker",
                    date: $vm.birthDate
                )
            }

            if vm.isBornBefore1962 {
                HStack(spacing: DSSpacing.xs) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundStyle(DSColor.warning)
                    Text("salary.input.birthDate.pre1962Warning")
                        .font(DSFont.caption)
                        .foregroundStyle(DSColor.textSecondary)
                }
                .accessibilityLabel(
                    String(localized: "salary.input.birthDate.pre1962Warning")
                )
            }
        }
    }

    // MARK: - Benefits

    private var benefitsSection: some View {
        DisclosureGroup(isExpanded: $vm.showingBenefitsSection) {
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
            .padding(.top, DSSpacing.sm)
        } label: {
            Text("salary.input.benefits")
                .font(DSFont.bodyM)
                .foregroundStyle(DSColor.textPrimary)
        }
        .tint(DSColor.maltaGold)
        .accessibilityLabel(
            String(localized: "salary.input.benefits.accessibilityLabel")
        )
        .accessibilityHint(
            String(localized: "salary.input.benefits.accessibilityHint")
        )
    }

    // MARK: - COLA

    private var colaSection: some View {
        Toggle(isOn: $vm.enableCOLA) {
            VStack(alignment: .leading, spacing: 2) {
                Text("salary.input.cola")
                    .font(DSFont.bodyM)
                    .foregroundStyle(DSColor.textPrimary)
                Text("salary.input.cola.description")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)
            }
        }
        .tint(DSColor.maltaGold)
        .accessibilityLabel(
            String(localized: "salary.input.cola.accessibilityLabel")
        )
        .accessibilityHint(
            String(localized: "salary.input.cola.accessibilityHint")
        )
    }
}
