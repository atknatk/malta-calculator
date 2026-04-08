import Foundation
@testable import CalculationKit

/// Generic container for golden fixture JSON files.
struct GoldenFixture<Input: Decodable, Expected: Decodable>: Decodable {
    let input: Input
    let expected: Expected
    let generatedAt: String
}

/// Loads golden fixture JSON from the test bundle.
enum GoldenLoader {
    static func load<Input: Decodable, Expected: Decodable>(
        _ name: String,
        input: Input.Type = Input.self,
        expected: Expected.Type = Expected.self
    ) throws -> GoldenFixture<Input, Expected> {
        guard let url = Bundle.module.url(forResource: name, withExtension: "json")
        else {
            throw CalculationError.configNotFound
        }
        let data = try Data(contentsOf: url)
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return try decoder.decode(GoldenFixture<Input, Expected>.self, from: data)
    }
}
