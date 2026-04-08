//
//  GuideBookmark.swift
//  MaltaCalculator
//

import Foundation
import SwiftData

/// Bookmark + reading progress for a bundled Guide.
///
/// `readingPosition` is a normalised `0...1` value so different device
/// sizes / font scales converge on the same logical progress.
@Model
final class GuideBookmark {
    /// Guide slug — matches the bundled `guides-manifest.json`.
    @Attribute(.unique) var slug: String
    /// When the user first bookmarked the guide.
    var bookmarkedAt: Date
    /// Reading progress in the 0...1 range.
    var readingPosition: Double
    /// Most recent time the user opened this guide.
    var lastOpenedAt: Date?

    init(slug: String, bookmarkedAt: Date = .now, readingPosition: Double = 0) {
        self.slug = slug
        self.bookmarkedAt = bookmarkedAt
        self.readingPosition = readingPosition
        self.lastOpenedAt = nil
    }
}
