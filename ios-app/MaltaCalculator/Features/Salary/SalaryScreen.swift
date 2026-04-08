//
//  SalaryScreen.swift
//  MaltaCalculator
//

import SwiftUI
import UIKit
import DesignSystem
import CalculationKit

/// The Salary Calculator playground — full interactive experience.
///
/// Provides input controls for gross salary, tax type, SSC category, benefits,
/// and COLA. Displays a real-time breakdown with donut chart, monthly detail rows,
/// cumulative line chart, and actionable insights.
struct SalaryScreen: View {
    @State private var vm = SalaryViewModel()
    @Environment(AppState.self) private var appState
    @ScaledMetric private var cardSpacing: CGFloat = DSSpacing.lg

    var body: some View {
        scrollContent
            .scrollDismissesKeyboard(.interactively)
            .background { MeshBackground().ignoresSafeArea() }
            .navigationTitle(String(localized: "salary.title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { toolbarContent }
            .sheet(isPresented: $vm.showingShareSheet) { shareSheet }
            .alert(
                String(localized: "salary.saved.title"),
                isPresented: $vm.showingSaveConfirmation
            ) {
                Button(String(localized: "salary.saved.ok"), role: .cancel) {}
            } message: {
                Text("salary.saved.message")
            }
            .modifier(RecalculationModifier(vm: vm))
            .modifier(HapticFeedbackModifier(vm: vm))
            .onAppear { applyDeepLinkParams() }
    }

    // MARK: - Scroll Content

    private var scrollContent: some View {
        ScrollView {
            VStack(spacing: cardSpacing) {
                headerSection
                SalaryInputCard(vm: vm)
                if let summary = vm.summary {
                    summaryCard(summary)
                    monthlyBreakdownSection
                    insightsSection(summary)
                }
                disclaimerSection
            }
            .padding(.horizontal, DSSpacing.md)
            .padding(.top, DSSpacing.md)
            .padding(.bottom, DSSpacing.xxl)
        }
    }

    // MARK: - Share Sheet

    @ViewBuilder
    private var shareSheet: some View {
        if let content = vm.buildShareContent() {
            ShareSheet(text: content.shareText)
        }
    }

    // MARK: - Toolbar

    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            Menu {
                Button {
                    vm.showingShareSheet = true
                } label: {
                    Label(
                        String(localized: "salary.toolbar.share"),
                        systemImage: "square.and.arrow.up"
                    )
                }
                Button {
                    vm.showingSaveConfirmation = true
                } label: {
                    Label(
                        String(localized: "salary.toolbar.save"),
                        systemImage: "bookmark"
                    )
                }
                Button(role: .destructive) {
                    UINotificationFeedbackGenerator()
                        .notificationOccurred(.warning)
                    vm.reset()
                } label: {
                    Label(
                        String(localized: "salary.toolbar.reset"),
                        systemImage: "arrow.counterclockwise"
                    )
                }
            } label: {
                Image(systemName: "ellipsis.circle")
                    .accessibilityLabel(
                        String(localized: "salary.toolbar.more")
                    )
                    .accessibilityHint(
                        String(localized: "salary.toolbar.more.hint")
                    )
            }
        }
    }

    // MARK: - Header

    private var headerSection: some View {
        VStack(spacing: DSSpacing.md) {
            DSToggleGroup(
                options: Array(2020...2026),
                selection: $vm.year,
                label: { String($0) }
            )
            .accessibilityLabel(
                String(localized: "salary.yearPicker.accessibilityLabel")
            )

            FloatingNetCard(
                annualNet: vm.summary?.annualNet ?? 0,
                monthlyNet: vm.summary?.averageMonthlyNet ?? 0,
                year: vm.year
            )
        }
    }

    // MARK: - Summary Card

    private func summaryCard(_ summary: SalarySummary) -> some View {
        DSCard(.highlighted) {
            VStack(spacing: DSSpacing.lg) {
                SalaryBreakdownDonut(summary: summary)
                keyFiguresGrid(summary)
            }
        }
    }

    private func keyFiguresGrid(_ summary: SalarySummary) -> some View {
        LazyVGrid(columns: [
            GridItem(.flexible()),
            GridItem(.flexible())
        ], spacing: DSSpacing.md) {
            keyFigure(
                label: "salary.summary.annualGross",
                value: summary.annualGross
            )
            keyFigure(
                label: "salary.summary.annualSSC",
                value: summary.annualSSC
            )
            keyFigure(
                label: "salary.summary.annualTax",
                value: summary.annualIncomeTax
            )
            keyFigure(
                label: "salary.summary.effectiveRate",
                value: nil,
                rate: summary.effectiveTaxRate
            )
        }
    }

    private func keyFigure(
        label: LocalizedStringKey,
        value: Decimal?,
        rate: Decimal? = nil
    ) -> some View {
        VStack(spacing: DSSpacing.xxs) {
            Text(label)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
            if let value {
                DSAnimatedNumber(
                    value,
                    format: .currency,
                    font: DSFont.heading(18)
                )
                .foregroundStyle(DSColor.textPrimary)
            } else if let rate {
                DSAnimatedNumber(
                    rate,
                    format: .percent,
                    font: DSFont.heading(18)
                )
                .foregroundStyle(DSColor.textPrimary)
            }
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Monthly Breakdown

    private var monthlyBreakdownSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("salary.monthly.title")
                .font(DSFont.headingM)
                .foregroundStyle(DSColor.textPrimary)

            ForEach(vm.monthly, id: \.month) { output in
                MonthlyRowCard(
                    output: output,
                    isExpanded: vm.expandedMonths.contains(output.month),
                    onToggle: { vm.toggleMonthExpansion(output.month) }
                )
            }

            if !vm.monthly.isEmpty {
                DSCard(.default) {
                    VStack(alignment: .leading, spacing: DSSpacing.sm) {
                        Text("salary.chart.cumulativeNet")
                            .font(DSFont.headingS)
                            .foregroundStyle(DSColor.textPrimary)
                        SalaryCumulativeChart(monthly: vm.monthly)
                    }
                }
            }
        }
    }

    // MARK: - Insights

    private func insightsSection(
        _ summary: SalarySummary
    ) -> some View {
        let insights = SalaryInsights(
            summary: summary,
            year: vm.year,
            simpleTaxType: vm.simpleTaxType
        )
        return DSCard(.info) {
            VStack(alignment: .leading, spacing: DSSpacing.md) {
                HStack(spacing: DSSpacing.xs) {
                    Image(systemName: "lightbulb.fill")
                        .foregroundStyle(DSColor.maltaGold)
                    Text("salary.insights.title")
                        .font(DSFont.headingS)
                        .foregroundStyle(DSColor.textPrimary)
                }
                ForEach(insights.bullets, id: \.self) { bullet in
                    HStack(alignment: .top, spacing: DSSpacing.xs) {
                        Text("•")
                            .font(DSFont.bodyM)
                            .foregroundStyle(DSColor.maltaGold)
                        Text(bullet)
                            .font(DSFont.bodyS)
                            .foregroundStyle(DSColor.textSecondary)
                    }
                }
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(
            String(localized: "salary.insights.accessibilityLabel")
        )
    }

    // MARK: - Disclaimer

    private var disclaimerSection: some View {
        Text("salary.disclaimer")
            .font(DSFont.footnote)
            .foregroundStyle(DSColor.textTertiary)
            .multilineTextAlignment(.center)
            .padding(.horizontal, DSSpacing.md)
    }

    // MARK: - Helpers

    private func applyDeepLinkParams() {
        let params = appState.salaryRouter.initialParams
        if !params.isEmpty {
            vm.applyInitialParams(params)
            appState.salaryRouter.initialParams = [:]
        }
    }
}

// MARK: - Recalculation Modifier

/// Bundles all `.onChange` triggers for salary input recalculation.
private struct RecalculationModifier: ViewModifier {
    @Bindable var vm: SalaryViewModel

    func body(content: Content) -> some View {
        content
            .onChange(of: vm.grossAnnual) { vm.scheduleRecalculation() }
            .onChange(of: vm.year) { vm.scheduleRecalculation() }
            .onChange(of: vm.simpleTaxType) {
                vm.scheduleRecalculation()
            }
            .onChange(of: vm.childCount) { vm.scheduleRecalculation() }
            .onChange(of: vm.sscCategory) { vm.scheduleRecalculation() }
            .onChange(of: vm.birthDate) { vm.scheduleRecalculation() }
            .onChange(of: vm.yearlyNonTaxBenefit) {
                vm.scheduleRecalculation()
            }
            .onChange(of: vm.yearlyTaxableBenefit) {
                vm.scheduleRecalculation()
            }
            .onChange(of: vm.enableCOLA) { vm.scheduleRecalculation() }
    }
}

// MARK: - Haptic Feedback Modifier

/// Provides haptic feedback for calculation success and UI triggers.
private struct HapticFeedbackModifier: ViewModifier {
    @Bindable var vm: SalaryViewModel

    func body(content: Content) -> some View {
        content
            .sensoryFeedback(
                .success,
                trigger: vm.calculationSucceeded
            ) { old, new in
                new && !old
            }
            .sensoryFeedback(
                .success,
                trigger: vm.showingSaveConfirmation
            ) { _, new in
                new
            }
            .sensoryFeedback(
                .selection,
                trigger: vm.showingShareSheet
            ) { _, new in
                new
            }
    }
}

// MARK: - Share Sheet

/// Simple UIActivityViewController wrapper for sharing text.
private struct ShareSheet: UIViewControllerRepresentable {
    let text: String

    func makeUIViewController(
        context: Context
    ) -> UIActivityViewController {
        UIActivityViewController(
            activityItems: [text],
            applicationActivities: nil
        )
    }

    func updateUIViewController(
        _ uiViewController: UIActivityViewController,
        context: Context
    ) {}
}

#Preview {
    NavigationStack {
        SalaryScreen()
            .environment(AppState())
    }
}
