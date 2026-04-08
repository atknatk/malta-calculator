//
//  SalaryScreen.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import SwiftUI

/// Full salary playground screen — input-driven, debounced recalculation
/// with 12-month breakdown, charts, insights, and share/save actions.
struct SalaryScreen: View {
    @State private var vm = SalaryViewModel()
    @Environment(AppState.self) private var appState
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        Group {
            switch vm.state {
            case .loading:
                loadingView
            case .empty:
                emptyView
            case .error(let message):
                errorView(message: message)
            case .content:
                contentView
            }
        }
        .navigationTitle(String(localized: "salary.title"))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar { toolbarContent }
        .sheet(isPresented: $vm.showingShareSheet) { shareSheet }
        .alert(
            String(localized: "salary.save.alertTitle"),
            isPresented: $vm.showingSaveConfirmation
        ) {
            Button(String(localized: "salary.save.ok"), role: .cancel) {}
        } message: {
            Text("salary.save.alertMessage")
        }
        .confirmationDialog(
            String(localized: "salary.reset.dialogTitle"),
            isPresented: $vm.showingResetConfirmation,
            titleVisibility: .visible
        ) {
            Button(
                String(localized: "salary.reset.confirm"),
                role: .destructive
            ) { vm.reset() }
        }
        .onAppear { applyDeepLinkIfNeeded() }
        .onChange(of: vm.grossAnnual) { vm.scheduleRecalculation() }
        .onChange(of: vm.year) { vm.scheduleRecalculation() }
        .onChange(of: vm.simpleTaxType) { vm.scheduleRecalculation() }
        .onChange(of: vm.childCount) { vm.scheduleRecalculation() }
        .onChange(of: vm.sscCategory) { vm.scheduleRecalculation() }
        .onChange(of: vm.birthDate) { vm.scheduleRecalculation() }
        .onChange(of: vm.yearlyNonTaxBenefit) { vm.scheduleRecalculation() }
        .onChange(of: vm.yearlyTaxableBenefit) { vm.scheduleRecalculation() }
        .onChange(of: vm.enableCOLA) { vm.scheduleRecalculation() }
    }

    // MARK: - State Views

    private var loadingView: some View {
        VStack(spacing: DSSpacing.lg) {
            ProgressView().tint(DSColor.maltaGold)
            Text("salary.loading")
                .font(DSFont.bodyM)
                .foregroundStyle(DSColor.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .accessibilityLabel(Text("salary.loading"))
    }

    private var emptyView: some View {
        DSEmptyState(
            title: "salary.empty.title",
            description: "salary.empty.message",
            icon: "eurosign.circle.fill"
        )
    }

    private func errorView(message: String) -> some View {
        VStack(spacing: DSSpacing.lg) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 40))
                .foregroundStyle(DSColor.danger)
            Text(message)
                .font(DSFont.bodyM)
                .foregroundStyle(DSColor.textSecondary)
                .multilineTextAlignment(.center)
            DSButton(
                "salary.error.retry",
                variant: .secondary
            ) { vm.retry() }
        }
        .padding(DSSpacing.xl)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text("salary.error.a11yLabel"))
    }

    // MARK: - Content

    private var contentView: some View {
        ScrollView {
            VStack(spacing: DSSpacing.lg) {
                headerSection
                SalaryInputCard(vm: vm)
                summaryCard
                monthlyBreakdownSection
                insightsSection
                disclaimerSection
            }
            .padding(.horizontal, DSSpacing.md)
            .padding(.top, DSSpacing.md)
            .padding(.bottom, DSSpacing.xxl)
        }
        .scrollDismissesKeyboard(.interactively)
        .background { MeshBackground().ignoresSafeArea() }
    }

    // MARK: - Header

    private var headerSection: some View {
        VStack(spacing: DSSpacing.md) {
            DSToggleGroup(
                options: SalaryViewModel.supportedYears,
                selection: $vm.year,
                label: { String($0) }
            )
            .accessibilityLabel(Text("salary.input.year"))
            .accessibilityHint(Text("salary.input.year.hint"))

            FloatingNetCard(
                annualNet: vm.summary?.annualNet ?? 0,
                monthlyNet: vm.summary?.averageMonthlyNet ?? 0,
                year: vm.year
            )
        }
    }

    // MARK: - Summary

    @ViewBuilder
    private var summaryCard: some View {
        if let summary = vm.summary {
            DSCard(.highlighted) {
                VStack(spacing: DSSpacing.lg) {
                    SalaryBreakdownDonut(summary: summary)
                    SalaryKeyFigures(summary: summary)
                }
            }
        }
    }

    // MARK: - Monthly Breakdown

    private var monthlyBreakdownSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("salary.section.monthlyBreakdown")
                .font(DSFont.headingM)
                .foregroundStyle(DSColor.textPrimary)
            ForEach(vm.monthly, id: \.month) { output in
                MonthlyRowCard(
                    output: output,
                    isExpanded: vm.expandedMonths.contains(output.month),
                    onToggle: { vm.toggleMonthExpansion(output.month) }
                )
            }
            SalaryCumulativeChart(monthly: vm.monthly)
                .padding(.top, DSSpacing.xs)
        }
    }

    // MARK: - Insights

    @ViewBuilder
    private var insightsSection: some View {
        let bullets = vm.insightBullets
        if !bullets.isEmpty {
            DSCard(.info) {
                VStack(alignment: .leading, spacing: DSSpacing.sm) {
                    Text("salary.section.insights")
                        .font(DSFont.headingS)
                        .foregroundStyle(DSColor.textPrimary)
                    ForEach(
                        Array(bullets.enumerated()),
                        id: \.offset
                    ) { _, bullet in
                        HStack(
                            alignment: .firstTextBaseline,
                            spacing: DSSpacing.xs
                        ) {
                            Image(systemName: "lightbulb.fill")
                                .font(DSFont.caption)
                                .foregroundStyle(DSColor.info)
                                .accessibilityHidden(true)
                            Text(bullet)
                                .font(DSFont.bodyS)
                                .foregroundStyle(DSColor.textSecondary)
                        }
                    }
                }
            }
            .accessibilityElement(children: .combine)
            .accessibilityLabel(Text("salary.section.insights"))
        }
    }

    // MARK: - Disclaimer

    private var disclaimerSection: some View {
        Text("salary.disclaimer")
            .font(DSFont.footnote)
            .foregroundStyle(DSColor.textTertiary)
            .multilineTextAlignment(.center)
            .padding(.horizontal, DSSpacing.md)
    }

    // MARK: - Toolbar

    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            Menu {
                shareButton
                saveButton
                resetButton
            } label: {
                Image(systemName: "ellipsis.circle")
                    .accessibilityLabel(Text("salary.action.menu"))
            }
        }
    }

    private var shareButton: some View {
        Button {
            vm.showingShareSheet = true
        } label: {
            Label(
                String(localized: "salary.action.share"),
                systemImage: "square.and.arrow.up"
            )
        }
        .accessibilityLabel(Text("salary.action.share"))
        .accessibilityHint(Text("salary.action.share.hint"))
    }

    private var saveButton: some View {
        Button {
            vm.save()
        } label: {
            Label(
                String(localized: "salary.action.save"),
                systemImage: "bookmark"
            )
        }
        .accessibilityLabel(Text("salary.action.save"))
        .accessibilityHint(Text("salary.action.save.hint"))
    }

    private var resetButton: some View {
        Button(role: .destructive) {
            vm.showingResetConfirmation = true
        } label: {
            Label(
                String(localized: "salary.action.reset"),
                systemImage: "arrow.counterclockwise"
            )
        }
        .accessibilityLabel(Text("salary.action.reset"))
    }

    // MARK: - Share Sheet

    @ViewBuilder
    private var shareSheet: some View {
        if let content = vm.buildShareContent() {
            let shareText = buildShareText(from: content)
            ShareLink(
                item: shareText,
                subject: Text("salary.share.subject"),
                message: Text(shareText)
            ) {
                Label(
                    String(localized: "salary.action.share"),
                    systemImage: "square.and.arrow.up"
                )
            }
            .presentationDetents([.medium])
        }
    }

    private func buildShareText(
        from content: SalaryShareContent
    ) -> String {
        let gross = content.annualGross.eur
        let net = content.annualNet.eur
        let yr = String(content.year)
        return "My \(yr) Malta Salary: \(gross) gross → \(net) net."
    }

    // MARK: - Deep Link

    private func applyDeepLinkIfNeeded() {
        let params = appState.salaryRouter.initialParams
        guard !params.isEmpty else { return }
        vm.applyInitialParams(params)
        appState.salaryRouter.initialParams = [:]
    }
}

#Preview {
    NavigationStack { SalaryScreen() }
        .environment(AppState())
}
