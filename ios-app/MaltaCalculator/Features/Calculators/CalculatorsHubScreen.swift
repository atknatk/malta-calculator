//
//  CalculatorsHubScreen.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// Main Calculators tab root: categorised grid, search, recently used, and
/// a stats bar. Missing calculators show a "Soon" badge and a negative
/// haptic on tap.
struct CalculatorsHubScreen: View {
    @State private var vm = CalculatorsViewModel()
    @State private var comingSoonAlertItem: CalculatorCatalogItem?
    @Environment(AppState.self) private var appState
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private let columns = [
        GridItem(.adaptive(minimum: 160, maximum: 200), spacing: DSSpacing.md)
    ]

    var body: some View {
        content
            .searchable(
                text: $vm.searchText,
                placement: .navigationBarDrawer(displayMode: .always),
                prompt: Text("calculators.search.prompt")
            )
            .scrollDismissesKeyboard(.interactively)
            .navigationTitle(Text("tab.calculators"))
            .navigationBarTitleDisplayMode(.large)
            .alert(
                Text("calculators.comingSoon.title"),
                isPresented: Binding(
                    get: { comingSoonAlertItem != nil },
                    set: { if !$0 { comingSoonAlertItem = nil } }
                ),
                presenting: comingSoonAlertItem
            ) { _ in
                Button("common.ok", role: .cancel) { comingSoonAlertItem = nil }
            } message: { item in
                Text("calculators.comingSoon.message \(item.title)")
            }
    }

    @ViewBuilder
    private var content: some View {
        switch vm.state {
        case .loading:
            ScrollView { DSSkeletonList(cardCount: 4).padding() }
        case .empty:
            DSEmptyState(
                title: "calculators.empty.title",
                description: "calculators.empty.description",
                icon: "function"
            )
        case .error(let message):
            DSErrorState(
                title: "calculators.error.title",
                description: LocalizedStringResource(stringLiteral: message),
                icon: "exclamationmark.triangle.fill",
                retryAction: { vm.retry() }
            )
        case .content:
            hubScroll
        }
    }

    private var hubScroll: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DSSpacing.xl) {
                statsBar
                if !vm.recentlyUsed.isEmpty, vm.searchText.isEmpty {
                    recentlyUsedSection
                }
                if vm.searchText.isEmpty {
                    categoriesSection
                } else {
                    searchResultsSection
                }
            }
            .padding(.horizontal, DSSpacing.md)
            .padding(.top, DSSpacing.sm)
            .padding(.bottom, DSSpacing.xxl)
        }
    }

    // MARK: - Sections

    private var statsBar: some View {
        DSCard(.compact) {
            HStack(spacing: 0) {
                statItem(value: "\(vm.statistics.active)", labelKey: "calculators.stats.active")
                divider
                statItem(value: "\(vm.statistics.soon)", labelKey: "calculators.stats.soon")
                divider
                statItem(
                    value: "\(vm.statistics.categories)",
                    labelKey: "calculators.stats.categories"
                )
                divider
                statItem(value: "€0", labelKey: "calculators.stats.price")
            }
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel(
            Text(
                """
                \(vm.statistics.active) active, \
                \(vm.statistics.soon) coming soon, \
                \(vm.statistics.categories) categories, free forever
                """
            )
        )
    }

    private var divider: some View {
        Rectangle()
            .fill(DSColor.textTertiary.opacity(0.25))
            .frame(width: 1, height: 28)
    }

    private func statItem(value: String, labelKey: LocalizedStringKey) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(DSFont.heading(18))
                .foregroundStyle(DSGradient.primary)
            Text(labelKey)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }

    private var recentlyUsedSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            Text("calculators.recentlyUsed")
                .font(DSFont.headingS)
                .foregroundStyle(DSColor.textPrimary)
                .accessibilityAddTraits(.isHeader)
                .padding(.horizontal, DSSpacing.xs)
            ScrollView(.horizontal, showsIndicators: false) {
                LazyHStack(spacing: DSSpacing.sm) {
                    ForEach(vm.recentlyUsed) { item in
                        compactCard(item)
                            .frame(width: 200)
                    }
                }
                .padding(.horizontal, DSSpacing.xs)
            }
        }
    }

    private var searchResultsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text(
                "^[\(vm.filteredItems.count) result](inflect: true)"
            )
            .font(DSFont.caption)
            .foregroundStyle(DSColor.textSecondary)
            .accessibilityAddTraits(.isHeader)

            if vm.filteredItems.isEmpty {
                ContentUnavailableView.search(text: vm.searchText)
                    .frame(maxWidth: .infinity)
                    .padding(.top, DSSpacing.xl)
            } else {
                LazyVGrid(columns: columns, spacing: DSSpacing.md) {
                    ForEach(vm.filteredItems) { item in
                        CalculatorCard(item: item) { handleTap(item) }
                    }
                }
            }
        }
    }

    private var categoriesSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.xxl) {
            ForEach(CalculatorCategory.allCases, id: \.self) { category in
                if let items = vm.groupedItems[category], !items.isEmpty {
                    VStack(alignment: .leading, spacing: DSSpacing.md) {
                        CategoryHeaderView(category: category, itemCount: items.count)
                        LazyVGrid(columns: columns, spacing: DSSpacing.md) {
                            ForEach(items) { item in
                                CalculatorCard(item: item) { handleTap(item) }
                            }
                        }
                    }
                }
            }
        }
    }

    private func compactCard(_ item: CalculatorCatalogItem) -> some View {
        Button { handleTap(item) } label: {
            HStack(spacing: DSSpacing.sm) {
                ZStack {
                    RoundedRectangle(cornerRadius: DSRadius.sm)
                        .fill(DSGradient.category(item.category.gradientColors))
                        .frame(width: 32, height: 32)
                    Image(systemName: item.symbolName)
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(.white)
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(item.title)
                        .font(DSFont.body(13, weight: .semibold))
                        .foregroundStyle(DSColor.textPrimary)
                        .lineLimit(1)
                    Text(item.subtitle)
                        .font(DSFont.body(11))
                        .foregroundStyle(DSColor.textSecondary)
                        .lineLimit(1)
                }
                Spacer(minLength: 0)
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundStyle(DSColor.textTertiary)
                    .accessibilityHidden(true)
            }
            .padding(DSSpacing.sm)
            .frame(maxWidth: .infinity, alignment: .leading)
            .liquidGlass(shape: RoundedRectangle(cornerRadius: DSRadius.sm))
        }
        .buttonStyle(.plain)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(Text(item.title))
        .accessibilityHint(Text("calculators.card.hint.recent"))
    }

    // MARK: - Actions

    private func handleTap(_ item: CalculatorCatalogItem) {
        guard item.available else {
            comingSoonAlertItem = item
            return
        }
        vm.recordUsage(item.id)
        if item.id == .salary {
            appState.selectedTab = .salary
        } else {
            appState.calculatorsRouter.push(.detail(item.id, params: [:]))
        }
    }
}

#Preview {
    NavigationStack { CalculatorsHubScreen() }
        .environment(AppState())
}
