//
//  AppSignpost.swift
//  MaltaCalculator
//

import os

/// Centralized signpost instrumentation for performance profiling.
///
/// Usage:
/// ```swift
/// AppSignpost.begin(.calculation, name: "SalaryMotor")
/// // ... computation ...
/// AppSignpost.end(.calculation, name: "SalaryMotor")
/// ```
enum AppSignpost {
    /// Signpost categories for the app.
    enum Category: String {
        case calculation = "Calculation"
        case rendering = "Rendering"
        case persistence = "Persistence"
        case navigation = "Navigation"
        case network = "Network"

        var log: OSLog {
            OSLog(subsystem: "com.maltacalculator.app", category: rawValue)
        }
    }

    /// Begins a signpost interval.
    /// - Parameters:
    ///   - category: The signpost category.
    ///   - name: A descriptive name for the interval.
    static func begin(_ category: Category, name: StaticString) {
        os_signpost(.begin, log: category.log, name: name)
    }

    /// Ends a signpost interval.
    /// - Parameters:
    ///   - category: The signpost category.
    ///   - name: A descriptive name for the interval (must match `begin`).
    static func end(_ category: Category, name: StaticString) {
        os_signpost(.end, log: category.log, name: name)
    }

    /// Emits a point-in-time event.
    /// - Parameters:
    ///   - category: The signpost category.
    ///   - name: A descriptive name for the event.
    static func event(_ category: Category, name: StaticString) {
        os_signpost(.event, log: category.log, name: name)
    }

    /// Measures a synchronous block and emits signpost interval.
    /// - Parameters:
    ///   - category: The signpost category.
    ///   - name: A descriptive name.
    ///   - block: The work to measure.
    /// - Returns: The result of the block.
    static func measure<T>(_ category: Category, name: StaticString, block: () throws -> T) rethrows -> T {
        os_signpost(.begin, log: category.log, name: name)
        defer { os_signpost(.end, log: category.log, name: name) }
        return try block()
    }

    /// Measures an async block and emits signpost interval.
    /// - Parameters:
    ///   - category: The signpost category.
    ///   - name: A descriptive name.
    ///   - block: The async work to measure.
    /// - Returns: The result of the block.
    static func measureAsync<T>(_ category: Category, name: StaticString, block: () async throws -> T) async rethrows -> T {
        os_signpost(.begin, log: category.log, name: name)
        defer { os_signpost(.end, log: category.log, name: name) }
        return try await block()
    }
}
