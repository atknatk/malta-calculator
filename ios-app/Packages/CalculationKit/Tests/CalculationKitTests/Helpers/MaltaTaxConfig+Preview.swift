import Foundation
@testable import CalculationKit

extension MaltaTaxConfig {
    /// Static preview instance for synchronous test usage.
    ///
    /// Loads the bundled JSON config once. This is safe for test fixtures
    /// because the config is read-only and deterministic.
    ///
    /// - Note: Uses `try!` intentionally — this is a test-only helper.
    ///   If the bundled config is missing, tests should fail immediately.
    static let preview: MaltaTaxConfig = {
        let url = Bundle.module.url(forResource: "tax-config-2020-2026", withExtension: "json")!
        let data = try! Data(contentsOf: url)
        let dto = try! JSONDecoder().decode(MaltaTaxConfigDTO.self, from: data)
        return try! dto.toDomain()
    }()
}
