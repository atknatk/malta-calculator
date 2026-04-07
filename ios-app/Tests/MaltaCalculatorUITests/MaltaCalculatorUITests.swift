//
//  MaltaCalculatorUITests.swift
//  MaltaCalculator
//

import XCTest

final class MaltaCalculatorUITests: XCTestCase {
    private var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launch()
    }

    func testAppLaunches() {
        XCTAssertTrue(app.staticTexts["Malta Calculator"].exists)
    }
}
