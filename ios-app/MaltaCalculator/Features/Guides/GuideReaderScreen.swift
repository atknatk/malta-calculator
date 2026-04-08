//
//  GuideReaderScreen.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI
import UIKit

/// Markdown reader for a bundled guide. Supports bookmarking, font scaling,
/// scroll-position persistence, and share.
struct GuideReaderScreen: View {
    let slug: String

    @State private var store = GuidesStore()
    @State private var blocks: [MarkdownBlock] = []
    @State private var guide: Guide?
    @State private var scrollProgress: Double = 0

    @AppStorage("guides.fontScale") private var fontScale: Double = 1.0
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    private var positionKey: String { "guides.position.\(slug)" }

    private var savedPosition: Double {
        get { UserDefaults.standard.double(forKey: positionKey) }
        nonmutating set { UserDefaults.standard.set(newValue, forKey: positionKey) }
    }

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                VStack(alignment: .leading, spacing: DSSpacing.md) {
                    if let guide {
                        header(guide)
                    }
                    readerBody
                        .id("reader-body")
                    Color.clear
                        .frame(height: 80)
                        .id("reader-bottom")
                }
                .padding(.horizontal, DSSpacing.md)
                .background(
                    GeometryReader { geo in
                        Color.clear
                            .preference(
                                key: ScrollOffsetPreferenceKey.self,
                                value: -geo.frame(in: .named("reader-scroll")).minY
                            )
                            .preference(
                                key: ScrollContentHeightPreferenceKey.self,
                                value: geo.size.height
                            )
                    }
                )
            }
            .coordinateSpace(name: "reader-scroll")
            .onPreferenceChange(ScrollOffsetPreferenceKey.self) { offset in
                updateProgress(offset: offset)
            }
            .onAppear {
                load()
                if savedPosition > 0.02, !reduceMotion {
                    // Scroll to saved position on a short delay so layout settles.
                    Task { @MainActor in
                        try? await Task.sleep(nanoseconds: 200_000_000)
                        withAnimation(nil) {
                            proxy.scrollTo(
                                savedPosition > 0.95 ? "reader-bottom" : "reader-body",
                                anchor: .top
                            )
                        }
                    }
                }
            }
        }
        .background {
            MeshBackground().ignoresSafeArea().accessibilityHidden(true)
        }
        .overlay(alignment: .top) { progressBar }
        .navigationTitle(Text(guide?.title ?? ""))
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                fontSizeMenu
                bookmarkButton
                shareButton
            }
        }
    }

    // MARK: - Content sections

    @ViewBuilder
    private func header(_ guide: Guide) -> some View {
        VStack(alignment: .leading, spacing: DSSpacing.xs) {
            HStack {
                Label {
                    Text("\(guide.readingMinutes) min")
                } icon: {
                    Image(systemName: "clock")
                }
                .font(DSFont.caption)
                Spacer()
                Text(guide.publishedAt, style: .date)
                    .font(DSFont.caption)
            }
            .foregroundStyle(DSColor.textSecondary)

            Text(guide.title)
                .font(DSFont.displayS)
                .foregroundStyle(DSColor.textPrimary)
                .accessibilityAddTraits(.isHeader)
        }
        .padding(.top, DSSpacing.sm)
    }

    private var readerBody: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            ForEach(blocks) { block in
                blockView(block)
            }
        }
    }

    @ViewBuilder
    private func blockView(_ block: MarkdownBlock) -> some View {
        switch block.kind {
        case .h1:
            Text(block.attributed(fontScale: fontScale))
                .font(.system(size: 28 * fontScale, weight: .bold))
                .foregroundStyle(DSColor.textPrimary)
                .padding(.top, DSSpacing.sm)
                .accessibilityAddTraits(.isHeader)
        case .h2:
            Text(block.attributed(fontScale: fontScale))
                .font(.system(size: 22 * fontScale, weight: .semibold))
                .foregroundStyle(DSColor.textPrimary)
                .padding(.top, DSSpacing.xs)
                .accessibilityAddTraits(.isHeader)
        case .h3:
            Text(block.attributed(fontScale: fontScale))
                .font(.system(size: 18 * fontScale, weight: .semibold))
                .foregroundStyle(DSColor.textPrimary)
                .accessibilityAddTraits(.isHeader)
        case .paragraph:
            Text(block.attributed(fontScale: fontScale))
                .font(.system(size: 16 * fontScale))
                .foregroundStyle(DSColor.textPrimary)
                .lineSpacing(4 * fontScale)
        case .bulleted:
            HStack(alignment: .top, spacing: DSSpacing.xs) {
                Text("•")
                    .font(.system(size: 16 * fontScale, weight: .bold))
                    .foregroundStyle(DSColor.maltaGold)
                Text(block.attributed(fontScale: fontScale))
                    .font(.system(size: 16 * fontScale))
                    .foregroundStyle(DSColor.textPrimary)
                    .lineSpacing(4 * fontScale)
            }
        case .quote:
            Text(block.attributed(fontScale: fontScale))
                .font(.system(size: 16 * fontScale).italic())
                .foregroundStyle(DSColor.textSecondary)
                .padding(.leading, DSSpacing.sm)
                .overlay(alignment: .leading) {
                    Rectangle()
                        .fill(DSColor.maltaGold)
                        .frame(width: 3)
                }
        case .code:
            Text(block.raw)
                .font(.system(size: 14 * fontScale, design: .monospaced))
                .foregroundStyle(DSColor.textPrimary)
                .padding(DSSpacing.sm)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(DSColor.surfaceMuted, in: RoundedRectangle(cornerRadius: DSRadius.sm))
        }
    }

    private var progressBar: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Rectangle()
                    .fill(Color.clear)
                Rectangle()
                    .fill(DSGradient.primary)
                    .frame(width: max(0, geo.size.width * scrollProgress), height: 3)
            }
        }
        .frame(height: 3)
        .accessibilityElement()
        .accessibilityLabel(Text("guides.reader.progress.label"))
        .accessibilityValue(Text("\(Int(scrollProgress * 100)) percent"))
    }

    // MARK: - Toolbar

    private var fontSizeMenu: some View {
        Menu {
            Button("85%") { fontScale = 0.85 }
            Button("100%") { fontScale = 1.0 }
            Button("115%") { fontScale = 1.15 }
            Button("130%") { fontScale = 1.3 }
        } label: {
            Image(systemName: "textformat.size")
        }
        .accessibilityLabel(Text("guides.reader.font-size"))
    }

    private var bookmarkButton: some View {
        let isBookmarked = store.isBookmarked(slug)
        return Button {
            store.toggleBookmark(slug)
        } label: {
            Image(systemName: isBookmarked ? "bookmark.fill" : "bookmark")
                .foregroundStyle(isBookmarked ? DSColor.maltaGold : DSColor.textSecondary)
        }
        .sensoryFeedback(.success, trigger: isBookmarked)
        .accessibilityLabel(
            Text(
                isBookmarked
                    ? "guides.reader.bookmark.remove"
                    : "guides.reader.bookmark.add"
            )
        )
    }

    @ViewBuilder
    private var shareButton: some View {
        if let url = URL(string: "https://maltacalculator.com/blog/\(slug)") {
            ShareLink(item: url, subject: Text(guide?.title ?? "")) {
                Image(systemName: "square.and.arrow.up")
            }
            .accessibilityLabel(Text("guides.reader.share"))
        }
    }

    // MARK: - Loading + progress

    private func load() {
        guide = store.guide(for: slug)
        let markdown = store.loadMarkdown(for: slug)
        blocks = MarkdownBlock.parse(markdown)
    }

    private func updateProgress(offset: CGFloat) {
        // Simple progress estimate: 0 at top, 1 when scrolled one screen.
        // The real content height preference updates separately.
        let screen = UIScreen.main.bounds.height
        let progress = max(0, min(1, Double(offset / max(screen, 1))))
        scrollProgress = progress
        // Debounced persistence — throttle on significant deltas only.
        if abs(progress - savedPosition) > 0.05 {
            savedPosition = progress
        }
    }
}

// MARK: - Scroll preferences

private struct ScrollOffsetPreferenceKey: PreferenceKey {
    static let defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}

private struct ScrollContentHeightPreferenceKey: PreferenceKey {
    static let defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = max(value, nextValue())
    }
}
