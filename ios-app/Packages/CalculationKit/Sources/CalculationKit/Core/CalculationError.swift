import Foundation

/// Errors raised by CalculationKit motors and loaders.
public enum CalculationError: Error, LocalizedError, Sendable {
    case configNotFound
    case corruptedConfig(reason: String)
    case invalidYear(Int)
    case invalidInput(field: String, reason: String)
    case calculationFailed(reason: String)

    public var errorDescription: String? {
        switch self {
        case .configNotFound:
            "Tax configuration file not found in bundle."
        case .corruptedConfig(let reason):
            "Tax configuration is corrupted: \(reason)"
        case .invalidYear(let year):
            "Year \(year) is not supported."
        case .invalidInput(let field, let reason):
            "Invalid input for \(field): \(reason)"
        case .calculationFailed(let reason):
            "Calculation failed: \(reason)"
        }
    }
}
