import Foundation
import os

/// Thread-safe, singleton loader for the bundled Malta tax configuration JSON.
///
/// Usage:
/// ```swift
/// let config = try await TaxConfigStore.shared.load()
/// ```
public actor TaxConfigStore {
    /// Shared singleton instance.
    public static let shared = TaxConfigStore()

    private static let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "TaxConfigStore"
    )

    private var cached: MaltaTaxConfig?

    private init() {}

    /// Loads and caches the tax configuration from the bundle.
    ///
    /// Subsequent calls return the cached instance without re-reading disk.
    public func load() throws -> MaltaTaxConfig {
        if let cached {
            return cached
        }

        guard let url = Bundle.module.url(
            forResource: "tax-config-2020-2026",
            withExtension: "json"
        ) else {
            Self.log.error("Tax config JSON not found in bundle")
            throw CalculationError.configNotFound
        }

        let data = try Data(contentsOf: url)
        let decoder = JSONDecoder()
        let dto = try decoder.decode(TaxConfigDTO.self, from: data)
        let config = dto.toDomain()

        Self.log.info("Loaded tax config with \(config.availableYears.count) years")
        cached = config
        return config
    }

    /// Forces a cache reload — useful for testing.
    public func invalidateCache() {
        cached = nil
    }
}
