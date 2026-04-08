//
//  PerformanceUITests.swift
//  MaltaCalculator
//
//  App launch performance tests.
//  Runs nightly, not on every PR.
//

import XCTest

final class MaltaCalculatorPerformanceUITests: XCTestCase {

    func testAppLaunchPerformance() throws {
        let options = XCTMeasureOptions.default
        options.iterationCount = 5

        measure(metrics: [XCTApplicationLaunchMetric()], options: options) {
            let app = XCUIApplication()
            app.launch()
            app.terminate()
        }
    }
}
