//
//  ImageRendererCache.swift
//  MaltaCalculator
//

import SwiftUI
import UIKit

/// Thread-safe, size-bounded cache for ``ImageRenderer``-produced images.
///
/// Share renderers (``SalaryShareRenderer``, ``GenericShareRenderer``) create
/// `UIImage` via `ImageRenderer`. These are expensive to produce and can be
/// reused when the same content is shared multiple times (e.g. user taps
/// share, dismisses, taps again). This cache avoids redundant rendering.
///
/// The cache is bounded by `countLimit` and uses `NSCache` internally so
/// the system can evict entries under memory pressure automatically.
@MainActor
final class ImageRendererCache {
    /// Shared singleton instance.
    static let shared = ImageRendererCache()

    private let cache = NSCache<NSString, UIImage>()

    init(countLimit: Int = 10) {
        cache.countLimit = countLimit
    }

    /// Returns a cached image for the key, or renders one using the closure
    /// and caches it before returning.
    /// - Parameters:
    ///   - key: A stable string identifying the content (e.g. calculator ID + inputs hash).
    ///   - render: Closure that produces the image if not cached.
    /// - Returns: The rendered or cached image, or `nil` if rendering fails.
    func image(forKey key: String, render: () -> UIImage?) -> UIImage? {
        let nsKey = key as NSString
        if let cached = cache.object(forKey: nsKey) {
            return cached
        }
        guard let rendered = render() else { return nil }
        cache.setObject(rendered, forKey: nsKey)
        return rendered
    }

    /// Removes all cached images.
    func removeAll() {
        cache.removeAllObjects()
    }

    /// Removes a specific cached image.
    func removeImage(forKey key: String) {
        cache.removeObject(forKey: key as NSString)
    }
}
