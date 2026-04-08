//
//  GuidesListScreen.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// Guides tab root — searchable list of bundled Malta Calculator guides.
struct GuidesListScreen: View {
    @State private var store = GuidesStore()
    @Environment(AppState.self) private var appState

    private let columns = [
        GridItem(.adaptive(minimum: 280, maximum: 480), spacing: DSSpacing.md)
    ]

    var body: some View {
        content
            .searchable(
                text: $store.searchText,
                prompt: Text("guides.search.prompt")
            )
            .background {
                MeshBackground()
                    .ignoresSafeArea()
                    .accessibilityHidden(true)
            }
            .navigationTitle(Text("tab.guides"))
    }

    @ViewBuilder
    private var content: some View {
        switch store.state {
        case .loading:
            ScrollView {
                VStack(spacing: DSSpacing.md) {
                    ForEach(0..<4, id: \.self) { _ in
                        DSSkeletonCard()
                    }
                }
                .padding(DSSpacing.md)
            }
        case .empty:
            DSEmptyState(
                title: "guides.empty.title",
                description: "guides.empty.description",
                icon: "book.closed"
            )
        case .error:
            DSErrorState(
                title: "guides.error.title",
                description: "guides.error.description",
                retryAction: { store.retry() }
            )
        case .content(let guides):
            loadedList(guides)
        }
    }

    private func loadedList(_ guides: [Guide]) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DSSpacing.lg) {
                categoryChips
                if !store.bookmarkedGuides.isEmpty
                    && store.searchText.isEmpty
                    && store.selectedCategory == nil
                {
                    bookmarkedSection
                }
                allSection(guides)
            }
            .padding(.horizontal, DSSpacing.md)
            .padding(.bottom, DSSpacing.xxl)
        }
    }

    private var categoryChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: DSSpacing.xs) {
                DSChip("guides.filter.all", isSelected: store.selectedCategory == nil) {
                    store.selectedCategory = nil
                }
                ForEach(GuideCategory.allCases, id: \.self) { category in
                    DSChip(
                        category.title,
                        isSelected: store.selectedCategory == category
                    ) {
                        store.selectedCategory =
                            (store.selectedCategory == category) ? nil : category
                    }
                }
            }
            .padding(.vertical, DSSpacing.xxs)
        }
        .accessibilityLabel(Text("guides.filter.accessibility"))
    }

    private var bookmarkedSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            HStack(spacing: DSSpacing.xxs) {
                Image(systemName: "bookmark.fill")
                    .foregroundStyle(DSColor.maltaGold)
                    .accessibilityHidden(true)
                Text("guides.section.bookmarked")
                    .font(DSFont.headingS)
            }
            .accessibilityAddTraits(.isHeader)

            LazyVGrid(columns: columns, spacing: DSSpacing.md) {
                ForEach(store.bookmarkedGuides) { guide in
                    GuideCard(
                        guide: guide,
                        isBookmarked: true
                    ) {
                        appState.guidesRouter.push(.reader(guide.slug))
                    }
                }
            }
        }
    }

    private func allSection(_ guides: [Guide]) -> some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            Text("guides.section.all")
                .font(DSFont.headingS)
                .accessibilityAddTraits(.isHeader)
            LazyVGrid(columns: columns, spacing: DSSpacing.md) {
                ForEach(guides) { guide in
                    GuideCard(
                        guide: guide,
                        isBookmarked: store.isBookmarked(guide.slug)
                    ) {
                        appState.guidesRouter.push(.reader(guide.slug))
                    }
                }
            }
        }
    }
}

#Preview {
    NavigationStack {
        GuidesListScreen()
    }
    .environment(AppState())
}
