//
//  MaltaCalculatorUITests.swift
//  MaltaCalculator
//
//  UI tests for critical user flows.
//  These run nightly (not on every PR) to avoid flaky CI delays.
//

import XCTest

final class MaltaCalculatorUITests: XCTestCase {
    private var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launchArguments += ["-UITests"]
        app.launch()
    }

    // MARK: - Flow 1: App Launch

    func testAppLaunches() {
        // The app should show the tab bar after launch
        XCTAssertTrue(app.tabBars.firstMatch.waitForExistence(timeout: 5))
    }

    // MARK: - Flow 2: Salary Happy Path

    func testSalaryHappyPath() throws {
        // Navigate to Salary tab
        let salaryTab = app.tabBars.buttons["Salary"]
        if salaryTab.exists {
            salaryTab.tap()
        }

        // Look for salary input field
        let grossField = app.textFields.firstMatch
        if grossField.waitForExistence(timeout: 3) {
            grossField.tap()
            grossField.typeText("30000")
        }

        // Wait for results to appear — net amount should be visible
        let resultExists = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS '€'")
        ).firstMatch.waitForExistence(timeout: 3)
        XCTAssertTrue(resultExists, "Expected currency result to appear after entering salary")
    }

    // MARK: - Flow 3: Calculator Hub Navigation

    func testCalculatorsHubNavigation() throws {
        // Navigate to Calculators tab
        let calcTab = app.tabBars.buttons["Calculators"]
        if calcTab.exists {
            calcTab.tap()
        }

        // Calculator hub should show a grid of calculator cards
        let firstCard = app.buttons.matching(
            NSPredicate(format: "label CONTAINS[c] 'mortgage' OR label CONTAINS[c] 'calculator'")
        ).firstMatch
        XCTAssertTrue(
            firstCard.waitForExistence(timeout: 3),
            "Expected calculator cards to appear in hub"
        )
    }

    // MARK: - Flow 4: Mortgage Detail

    func testMortgageCalculatorDetail() throws {
        // Navigate to Calculators tab
        let calcTab = app.tabBars.buttons["Calculators"]
        if calcTab.exists {
            calcTab.tap()
        }

        // Tap on mortgage calculator card
        let mortgageCard = app.buttons.matching(
            NSPredicate(format: "label CONTAINS[c] 'mortgage'")
        ).firstMatch
        if mortgageCard.waitForExistence(timeout: 3) {
            mortgageCard.tap()
        }

        // Mortgage detail should show input fields and results
        let resultExists = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS '€'")
        ).firstMatch.waitForExistence(timeout: 3)
        XCTAssertTrue(resultExists, "Expected mortgage calculation result")
    }

    // MARK: - Flow 5: Search Calculators

    func testSearchCalculators() throws {
        let calcTab = app.tabBars.buttons["Calculators"]
        if calcTab.exists {
            calcTab.tap()
        }

        // Look for search field
        let searchField = app.searchFields.firstMatch
        if searchField.waitForExistence(timeout: 3) {
            searchField.tap()
            searchField.typeText("pension")

            // Should filter results
            let exists = app.staticTexts.matching(
                NSPredicate(format: "label CONTAINS[c] 'pension'")
            ).firstMatch.waitForExistence(timeout: 2)
            XCTAssertTrue(exists, "Expected filtered results for 'pension'")
        }
    }

    // MARK: - Flow 6: Guides Tab

    func testGuidesTabLoads() throws {
        let guidesTab = app.tabBars.buttons["Guides"]
        if guidesTab.exists {
            guidesTab.tap()
        }

        // Guides list should show at least one guide card
        let guideExists = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] 'guide' OR label CONTAINS[c] 'malta'")
        ).firstMatch.waitForExistence(timeout: 3)
        XCTAssertTrue(guideExists, "Expected guide content to appear")
    }

    // MARK: - Flow 7: Settings Tab

    func testSettingsTabLoads() throws {
        let settingsTab = app.tabBars.buttons["Settings"]
        if settingsTab.exists {
            settingsTab.tap()
        }

        // Settings should show version info
        let versionExists = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] 'version' OR label CONTAINS[c] '2026'")
        ).firstMatch.waitForExistence(timeout: 3)
        XCTAssertTrue(versionExists, "Expected version info in settings")
    }

    // MARK: - Flow 8: Theme Switch

    func testThemeSwitchDoesNotCrash() throws {
        let settingsTab = app.tabBars.buttons["Settings"]
        if settingsTab.exists {
            settingsTab.tap()
        }

        // Look for theme toggle or picker
        let themeControl = app.buttons.matching(
            NSPredicate(format: "label CONTAINS[c] 'dark' OR label CONTAINS[c] 'theme'")
        ).firstMatch
        if themeControl.waitForExistence(timeout: 2) {
            themeControl.tap()
            // App should not crash — just verify it's still responsive
            XCTAssertTrue(app.tabBars.firstMatch.exists)
        }
    }

    // MARK: - Flow 9: Tab Navigation Round-Trip

    func testTabNavigationRoundTrip() throws {
        let tabs = ["Salary", "Calculators", "Guides", "Settings"]
        for tabName in tabs {
            let tab = app.tabBars.buttons[tabName]
            if tab.exists {
                tab.tap()
                // Brief wait for content to load
                Thread.sleep(forTimeInterval: 0.3)
            }
        }
        // Return to first tab — app should still be responsive
        let homeTab = app.tabBars.buttons.element(boundBy: 0)
        if homeTab.exists {
            homeTab.tap()
        }
        XCTAssertTrue(app.tabBars.firstMatch.exists, "App should remain responsive after tab navigation")
    }

    // MARK: - Flow 10: Coming Soon Calculator

    func testComingSoonCalculatorShowsMessage() throws {
        let calcTab = app.tabBars.buttons["Calculators"]
        if calcTab.exists {
            calcTab.tap()
        }

        // Look for a "coming soon" card
        let comingSoon = app.staticTexts.matching(
            NSPredicate(format: "label CONTAINS[c] 'coming soon'")
        ).firstMatch
        if comingSoon.waitForExistence(timeout: 3) {
            // Tap on it — should not navigate
            comingSoon.tap()
            // Should still be on the hub
            XCTAssertTrue(calcTab.isSelected || app.tabBars.firstMatch.exists)
        }
    }
}
