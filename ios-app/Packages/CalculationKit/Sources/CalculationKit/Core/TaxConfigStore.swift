import Foundation
import os

/// Thread-safe, singleton loader for the bundled Malta tax configuration JSON.
///
/// The store caches the parsed ``MaltaTaxConfig`` after the first load so
/// subsequent calls return instantly without disk I/O.
///
/// Usage:
/// ```swift
/// let config = try await TaxConfigStore.shared.load()
/// let brackets = config.brackets(for: 2026, type: .single)
/// ```
public actor TaxConfigStore {
    /// Shared singleton instance.
    public static let shared = TaxConfigStore()

    private static let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "TaxConfigStore"
    )

    private var cached: MaltaTaxConfig?
    private var bundleOverride: Bundle?

    private init() {}

    /// Override the bundle used for resource lookup (for testing).
    public func setBundle(_ bundle: Bundle) {
        self.bundleOverride = bundle
        self.cached = nil
    }

    /// Loads and caches the tax configuration from the bundle.
    ///
    /// The first call reads from disk and parses the JSON. Subsequent calls
    /// return the cached instance without re-reading.
    public func load() throws -> MaltaTaxConfig {
        if let cached {
            return cached
        }

        let bundle = bundleOverride ?? Bundle.module
        guard let url = bundle.url(
            forResource: "tax-config-2020-2026",
            withExtension: "json"
        ) else {
            Self.log.error("Tax config JSON not found in bundle")
            throw CalculationError.configNotFound
        }

        let data = try Data(contentsOf: url)
        let dto = try JSONDecoder().decode(MaltaTaxConfigDTO.self, from: data)
        let config = try dto.toDomain()

        Self.log.info(
            "Loaded tax config v\(config.version) with \(config.availableYears.count) years"
        )
        cached = config
        return config
    }

    /// Loads a tax config from a remote URL (v1.1 preparation).
    ///
    /// The downloaded config replaces any cached value.
    public func loadRemote(from url: URL) async throws -> MaltaTaxConfig {
        let (data, _) = try await URLSession.shared.data(from: url)
        let dto = try JSONDecoder().decode(MaltaTaxConfigDTO.self, from: data)
        let config = try dto.toDomain()
        self.cached = config
        return config
    }

    /// Clears the cached config, forcing a reload on the next `load()` call.
    public func invalidateCache() {
        cached = nil
    }
}
