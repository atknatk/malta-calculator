//
//  GuidesStore.swift
//  MaltaCalculator
//

import Foundation
import Observation
import os

/// Loads bundled guides from `guides-manifest.json`, applies search / category
/// filters, manages bookmarks (persisted in `UserDefaults` for v1), and reads
/// markdown content on demand.
@Observable
@MainActor
final class GuidesStore {
    /// All guides loaded from the bundled manifest, sorted newest first.
    private(set) var allGuides: [Guide] = []

    /// Slugs the user has bookmarked.
    private(set) var bookmarkedSlugs: Set<String> = []

    /// The current list view state.
    private(set) var state: GuidesViewState = .loading

    /// Current search text. Mutations re-apply the filter.
    var searchText: String = "" {
        didSet { applyFilter() }
    }

    /// Currently selected category, or `nil` for all categories.
    var selectedCategory: GuideCategory? {
        didSet { applyFilter() }
    }

    private let bookmarksKey = "guides.bookmarked-slugs.v1"
    private let userDefaults: UserDefaults
    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "GuidesStore"
    )

    init(userDefaults: UserDefaults = .standard) {
        self.userDefaults = userDefaults
        loadBookmarks()
        load()
    }

    // MARK: - Loading

    /// Load (or reload) the manifest and transition `state` accordingly.
    func load() {
        state = .loading
        guard let url = Bundle.main.url(
            forResource: "guides-manifest",
            withExtension: "json"
        ) else {
            log.error("guides-manifest.json not found in main bundle")
            state = .error(String(localized: "guides.error.manifest-missing"))
            return
        }
        do {
            let data = try Data(contentsOf: url)
            struct Wrapper: Decodable {
                let version: String
                let guides: [Guide]
            }
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601
            let wrapper = try decoder.decode(Wrapper.self, from: data)
            allGuides = wrapper.guides.sorted { $0.publishedAt > $1.publishedAt }
            applyFilter()
        } catch {
            log.error("Failed to decode guides manifest: \(error.localizedDescription, privacy: .public)")
            state = .error(String(localized: "guides.error.decode-failed"))
        }
    }

    /// Retry loading after a previous error.
    func retry() {
        load()
    }

    // MARK: - Markdown

    /// Load the bundled markdown body for a given slug.
    ///
    /// Returns a short placeholder string if the resource cannot be found.
    func loadMarkdown(for slug: String) -> String {
        let resourceName = "guide-\(slug)"
        guard let url = Bundle.main.url(
            forResource: resourceName,
            withExtension: "md"
        ) else {
            log.error("Markdown missing for slug: \(slug, privacy: .public)")
            return String(localized: "guides.reader.missing-content")
        }
        do {
            return try String(contentsOf: url, encoding: .utf8)
        } catch {
            log.error(
                // swiftlint:disable:next line_length
                "Failed to read markdown \(resourceName, privacy: .public): \(error.localizedDescription, privacy: .public)"
            )
            return String(localized: "guides.reader.missing-content")
        }
    }

    /// Return the `Guide` metadata for a slug, if present.
    func guide(for slug: String) -> Guide? {
        allGuides.first { $0.slug == slug }
    }

    // MARK: - Bookmarks

    /// Toggle bookmark state for the given slug and persist the change.
    func toggleBookmark(_ slug: String) {
        if bookmarkedSlugs.contains(slug) {
            bookmarkedSlugs.remove(slug)
        } else {
            bookmarkedSlugs.insert(slug)
        }
        persistBookmarks()
        applyFilter()
    }

    /// Whether the given slug is currently bookmarked.
    func isBookmarked(_ slug: String) -> Bool {
        bookmarkedSlugs.contains(slug)
    }

    /// Guides the user has bookmarked, in manifest order.
    var bookmarkedGuides: [Guide] {
        allGuides.filter { bookmarkedSlugs.contains($0.slug) }
    }

    private func loadBookmarks() {
        guard let stored = userDefaults.array(forKey: bookmarksKey) as? [String] else {
            return
        }
        bookmarkedSlugs = Set(stored)
    }

    private func persistBookmarks() {
        userDefaults.set(Array(bookmarkedSlugs).sorted(), forKey: bookmarksKey)
    }

    // MARK: - Filter

    private func applyFilter() {
        var result = allGuides
        if let category = selectedCategory {
            result = result.filter { $0.category == category }
        }
        let trimmed = searchText
            .trimmingCharacters(in: .whitespacesAndNewlines)
            .lowercased()
        if !trimmed.isEmpty {
            result = result.filter { guide in
                guide.title.lowercased().contains(trimmed)
                    || guide.description.lowercased().contains(trimmed)
                    || guide.tags.contains { $0.lowercased().contains(trimmed) }
            }
        }
        state = result.isEmpty ? .empty : .content(result)
    }
}
