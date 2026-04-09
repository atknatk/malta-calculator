//
//  ScreenshotTests.swift
//  MaltaCalculator
//
//  App Store screenshot capture tests.
//  Run via `fastlane screenshots` to generate framed screenshots.
//

import XCTest

final class ScreenshotTests: XCTestCase {
    private var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments += ["-UITests", "-ScreenshotMode"]
        setupSnapshot(app)
        app.launch()
    }

    // MARK: - Screenshot 1: Home Hero

    func testScreenshot01_HomeHero() throws {
        // Wait for tab bar to appear
        XCTAssertTrue(app.tabBars.firstMatch.waitForExistence(timeout: 5))

        // Navigate to Salary tab (home screen)
        let salaryTab = app.tabBars.buttons["Salary"]
        if salaryTab.exists {
            salaryTab.tap()
        }

        // Brief pause for animations to settle
        Thread.sleep(forTimeInterval: 1.0)
        snapshot("01_HomeHero")
    }

    // MARK: - Screenshot 2: Salary Calculator

    func testScreenshot02_SalaryCalculator() throws {
        let salaryTab = app.tabBars.buttons["Salary"]
        if salaryTab.exists {
            salaryTab.tap()
        }

        // Enter a salary value to show results
        let grossField = app.textFields.firstMatch
        if grossField.waitForExistence(timeout: 3) {
            grossField.tap()
            grossField.typeText("35000")
        }

        // Wait for calculation to complete
        Thread.sleep(forTimeInterval: 1.5)
        snapshot("02_SalaryCalculator")
    }

    // MARK: - Screenshot 3: Mortgage Calculator

    func testScreenshot03_MortgageCalculator() throws {
        let calcTab = app.tabBars.buttons["Calculators"]
        if calcTab.exists {
            calcTab.tap()
        }

        let mortgageCard = app.buttons.matching(
            NSPredicate(format: "label CONTAINS[c] 'mortgage'")
        ).firstMatch
        if mortgageCard.waitForExistence(timeout: 3) {
            mortgageCard.tap()
        }

        // Wait for mortgage detail to load
        Thread.sleep(forTimeInterval: 1.5)
        snapshot("03_MortgageCalculator")
    }

    // MARK: - Screenshot 4: Calculators Grid

    func testScreenshot04_CalculatorsGrid() throws {
        let calcTab = app.tabBars.buttons["Calculators"]
        if calcTab.exists {
            calcTab.tap()
        }

        // Wait for grid to load
        Thread.sleep(forTimeInterval: 1.0)
        snapshot("04_CalculatorsGrid")
    }

    // MARK: - Screenshot 5: Guides

    func testScreenshot05_GuidesReader() throws {
        let guidesTab = app.tabBars.buttons["Guides"]
        if guidesTab.exists {
            guidesTab.tap()
        }

        // Wait for guides to load
        Thread.sleep(forTimeInterval: 1.0)
        snapshot("05_GuidesReader")
    }

    // MARK: - Screenshot 6: Settings

    func testScreenshot06_Settings() throws {
        let settingsTab = app.tabBars.buttons["Settings"]
        if settingsTab.exists {
            settingsTab.tap()
        }

        // Wait for settings to load
        Thread.sleep(forTimeInterval: 1.0)
        snapshot("06_Settings")
    }
}
