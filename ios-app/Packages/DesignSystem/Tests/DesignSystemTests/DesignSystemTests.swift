//
//  DesignSystemTests.swift
//  MaltaCalculator
//

import Testing
@testable import DesignSystem

struct DesignSystemBootstrapTests {
    @Test("Package exposes a semantic version string")
    func versionIsSemver() {
        let version = DesignSystem.version
        let parts = version.split(separator: ".")
        #expect(parts.count == 3, "expected MAJOR.MINOR.PATCH, got \(version)")
        for part in parts {
            #expect(UInt(part) != nil, "non-numeric semver component: \(part)")
        }
    }
}
