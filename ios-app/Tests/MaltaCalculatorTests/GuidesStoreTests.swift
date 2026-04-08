//
//  GuidesStoreTests.swift
//  MaltaCalculatorTests
//

import Foundation
import Testing
@testable import MaltaCalculator

@MainActor
@Suite("GuidesStore")
struct GuidesStoreTests {
    private func makeDefaults() -> UserDefaults {
        let suite = "guides.tests.\(UUID().uuidString)"
        guard let defaults = UserDefaults(suiteName: suite) else {
            fatalError("Failed to create isolated UserDefaults suite")
        }
        return defaults
    }

    @Test("Loads 10 bundled guides from the manifest")
    func loadsManifest() {
        let store = GuidesStore(userDefaults: makeDefaults())
        #expect(store.allGuides.count == 10)
        if case .content(let guides) = store.state {
            #expect(guides.count == 10)
        } else {
            Issue.record("Expected .content state after load")
        }
    }

    @Test("Case-insensitive search filters by title, description and tags")
    func search() {
        let store = GuidesStore(userDefaults: makeDefaults())
        store.searchText = "PENSION"
        if case .content(let guides) = store.state {
            let allMatch = guides.allSatisfy { guide in
                guide.slug.contains("pension")
                    || guide.title.lowercased().contains("pension")
                    || guide.tags.contains("pension")
            }
            #expect(allMatch)
            #expect(!guides.isEmpty)
        } else {
            Issue.record("Expected content state for search")
        }
    }

    @Test("Category filter returns only matching guides")
    func categoryFilter() {
        let store = GuidesStore(userDefaults: makeDefaults())
        store.selectedCategory = .property
        if case .content(let guides) = store.state {
            #expect(guides.allSatisfy { $0.category == .property })
            #expect(guides.count >= 1)
        } else {
            Issue.record("Expected content state for category filter")
        }
    }

    @Test("Empty state when filter has no matches")
    func emptyFilter() {
        let store = GuidesStore(userDefaults: makeDefaults())
        store.searchText = "zzz-no-match-zzz"
        #expect(store.state == .empty)
    }

    @Test("Bookmark toggle persists and round-trips through UserDefaults")
    func bookmarkToggle() {
        let defaults = makeDefaults()
        let slug = "malta-tax-rates-2026-complete-guide"
        do {
            let store = GuidesStore(userDefaults: defaults)
            #expect(!store.isBookmarked(slug))
            store.toggleBookmark(slug)
            #expect(store.isBookmarked(slug))
            #expect(store.bookmarkedGuides.contains(where: { $0.slug == slug }))
        }
        // Reload from same defaults — state must persist.
        let reloaded = GuidesStore(userDefaults: defaults)
        #expect(reloaded.isBookmarked(slug))
    }

    @Test("Markdown content loads for each bundled slug")
    func markdownLoads() {
        let store = GuidesStore(userDefaults: makeDefaults())
        for guide in store.allGuides {
            let markdown = store.loadMarkdown(for: guide.slug)
            #expect(markdown.count > 100, "Markdown for \(guide.slug) should not be empty")
        }
    }

    @Test("Markdown parser identifies headings, bullets and paragraphs")
    func markdownParser() {
        let sample = """
        # Title

        Intro paragraph here.

        ## Subheading

        - item one
        - item two

        > quote text

        ```
        code line
        ```
        """
        let blocks = MarkdownBlock.parse(sample)
        #expect(blocks.contains(where: { $0.kind == .h1 }))
        #expect(blocks.contains(where: { $0.kind == .h2 }))
        #expect(blocks.filter { $0.kind == .bulleted }.count == 2)
        #expect(blocks.contains(where: { $0.kind == .quote }))
        #expect(blocks.contains(where: { $0.kind == .code }))
        #expect(blocks.contains(where: { $0.kind == .paragraph }))
    }
}
