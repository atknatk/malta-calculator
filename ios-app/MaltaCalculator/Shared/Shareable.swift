//
//  Shareable.swift
//  MaltaCalculator
//

import SwiftUI
import UIKit

/// Protocol for features that support image and PDF export.
///
/// Conforming types provide async methods to generate shareable
/// artifacts. Implementations should cache results in `NSCachesDirectory`
/// and NEVER include PII (names, emails) in exports.
@MainActor
protocol Shareable {
    /// Renders the content as a share-ready image (e.g. 1080×1080 card).
    func asImage() async -> UIImage?

    /// Renders the content as a PDF document and returns the file URL.
    func asPDF() async -> URL?
}

/// Utility for caching generated share artifacts.
enum ShareCache {
    /// Returns a cache directory URL for share artifacts.
    static var directory: URL {
        guard let caches = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first else {
            return FileManager.default.temporaryDirectory.appendingPathComponent("ShareExport", isDirectory: true)
        }
        let shareDir = caches.appendingPathComponent("ShareExport", isDirectory: true)
        try? FileManager.default.createDirectory(at: shareDir, withIntermediateDirectories: true)
        return shareDir
    }

    /// Generates a unique file URL for a cached artifact.
    /// - Parameters:
    ///   - prefix: File name prefix (e.g. "Salary").
    ///   - extension: File extension (e.g. "pdf", "png").
    /// - Returns: A URL in the cache directory.
    static func fileURL(prefix: String, extension ext: String) -> URL {
        directory.appendingPathComponent("\(prefix)_\(UUID().uuidString).\(ext)")
    }

    /// Cleans up old cached files older than the given interval.
    /// - Parameter olderThan: Time interval. Defaults to 1 hour.
    static func cleanup(olderThan interval: TimeInterval = 3600) {
        guard let files = try? FileManager.default.contentsOfDirectory(
            at: directory,
            includingPropertiesForKeys: [.creationDateKey]
        ) else { return }

        let cutoff = Date().addingTimeInterval(-interval)
        for file in files {
            guard let attrs = try? file.resourceValues(forKeys: [.creationDateKey]),
                  let created = attrs.creationDate,
                  created < cutoff else { continue }
            try? FileManager.default.removeItem(at: file)
        }
    }
}
