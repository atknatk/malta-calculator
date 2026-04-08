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
        // Verify the app launches and the tab bar is present by checking
        // for the Salary tab button which is a fixed anchor of the navigation.
        let salaryTab = app.tabBars.buttons["Salary"]
        XCTAssertTrue(salaryTab.waitForExistence(timeout: 5))
    }
}
