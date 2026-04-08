//
//  ExportService.swift
//  MaltaCalculator
//

import Foundation
import SwiftData
import os

/// Builds an opaque JSON blob containing the user's saved calculations
/// and bookmarked guides. Designed for the "Export All Data" action in
/// Settings so users can back up or migrate their data.
///
/// The exporter never includes PII beyond what the user themselves has
/// typed into the app (calculation titles and notes). The output is a
/// self-describing envelope versioned by ``Envelope/version`` so future
/// imports can migrate between schemas.
struct ExportService {
    private let context: ModelContext
    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "ExportService"
    )

    init(context: ModelContext) {
        self.context = context
    }

    /// The top-level envelope written to disk.
    struct Envelope: Codable, Equatable {
        /// Schema version of the export format.
        let version: Int
        /// When the export was generated.
        let exportedAt: Date
        /// Saved calculations, serialised as opaque JSON payloads.
        let savedCalculations: [SavedCalculationExport]
        /// Guide bookmarks.
        let bookmarkedGuides: [BookmarkExport]
    }

    /// Exported form of a ``SavedCalculation``.
    struct SavedCalculationExport: Codable, Equatable {
        let id: String
        let calculatorID: String
        let title: String
        let summary: String
        let createdAt: Date
        let updatedAt: Date
        let pinned: Bool
        let tags: [String]
        let notes: String?
        let inputs: String
    }

    /// Exported form of a ``GuideBookmark``.
    struct BookmarkExport: Codable, Equatable {
        let slug: String
        let bookmarkedAt: Date
    }

    /// Current export schema version.
    static let currentVersion: Int = 1

    /// Encode all saved calculations and bookmarks to JSON data.
    func exportAllCalculations() throws -> Data {
        let calculations = (try? context.fetch(FetchDescriptor<SavedCalculation>())) ?? []
        let bookmarks = (try? context.fetch(FetchDescriptor<GuideBookmark>())) ?? []

        let exportedCalcs = calculations.map { calc in
            SavedCalculationExport(
                id: calc.id.uuidString,
                calculatorID: calc.calculatorID,
                title: calc.title,
                summary: calc.summary,
                createdAt: calc.createdAt,
                updatedAt: calc.updatedAt,
                pinned: calc.pinned,
                tags: calc.tags,
                notes: calc.notes,
                inputs: String(data: calc.inputsJSON, encoding: .utf8) ?? ""
            )
        }
        let exportedBookmarks = bookmarks.map {
            BookmarkExport(slug: $0.slug, bookmarkedAt: $0.bookmarkedAt)
        }

        let envelope = Envelope(
            version: Self.currentVersion,
            exportedAt: Date(),
            savedCalculations: exportedCalcs,
            bookmarkedGuides: exportedBookmarks
        )

        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601
        return try encoder.encode(envelope)
    }

    /// Writes the export to a temporary file so a share sheet can hand
    /// out a real on-disk URL. Returns the file URL on success.
    func writeExportToTemporaryFile() throws -> URL {
        let data = try exportAllCalculations()
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withFullDate]
        let stamp = formatter.string(from: Date())
        let url = FileManager.default.temporaryDirectory
            .appendingPathComponent("malta-calculator-export-\(stamp).json")
        try data.write(to: url, options: .atomic)
        return url
    }
}
