//
//  CalculationKitTests.swift
//  MaltaCalculator
//

import Foundation
import Testing
@testable import CalculationKit

struct CalculationKitBootstrapTests {
    @Test("Package exposes a semantic version string")
    func versionIsSemver() {
        let version = CalculationKit.version
        let parts = version.split(separator: ".")
        #expect(parts.count == 3, "expected MAJOR.MINOR.PATCH, got \(version)")
        for part in parts {
            #expect(UInt(part) != nil, "non-numeric semver component: \(part)")
        }
    }

    @Test("Money typealias is Foundation.Decimal")
    func moneyIsDecimal() {
        let value: Money = Decimal(string: "1234.56") ?? .zero
        #expect(value == Decimal(string: "1234.56"))
    }
}
