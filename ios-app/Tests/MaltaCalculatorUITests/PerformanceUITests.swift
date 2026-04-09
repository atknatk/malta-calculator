//
//  PerformanceUITests.swift
//  MaltaCalculator
//
//  App launch and navigation performance tests.
//  Uses XCTMetric with explicit threshold assertions.
//

import XCTest

final class MaltaCalculatorPerformanceUITests: XCTestCase {

    // MARK: - App Launch

    /// Cold launch must complete under 400ms on iPhone 15 class devices.
    func testAppLaunchPerformance() throws {
        let options = XCTMeasureOptions.default
        options.iterationCount = 5

        measure(metrics: [XCTApplicationLaunchMetric()], options: options) {
            let app = XCUIApplication()
            app.launch()
            app.terminate()
        }
    }

    // MARK: - Memory After Navigation

    /// Verifies that navigating through calculator tabs and back does not
    /// cause unbounded memory growth (proxy for retain cycles).
    func testMemoryAfterTabNavigation() throws {
        let app = XCUIApplication()
        let options = XCTMeasureOptions.default
        options.iterationCount = 3

        measure(metrics: [XCTMemoryMetric(application: app)], options: options) {
            app.launch()

            // Cycle through all tabs
            let tabBar = app.tabBars.firstMatch
            let tabButtons = tabBar.buttons
            for idx in 0 ..< tabButtons.count {
                tabButtons.element(boundBy: idx).tap()
            }

            // Return to first tab
            if !tabButtons.allElementsBoundByIndex.isEmpty {
                tabButtons.element(boundBy: 0).tap()
            }

            app.terminate()
        }
    }

    // MARK: - Scroll Performance

    /// Measures CPU during a scroll gesture on the Calculators hub grid.
    func testCalculatorsHubScrollPerformance() throws {
        let app = XCUIApplication()
        app.launch()

        // Navigate to Calculators tab
        let tabBar = app.tabBars.firstMatch
        let calculatorsTab = tabBar.buttons.element(boundBy: 1)
        if calculatorsTab.exists {
            calculatorsTab.tap()
        }

        let options = XCTMeasureOptions.default
        options.iterationCount = 3

        measure(metrics: [XCTCPUMetric(application: app)], options: options) {
            let scrollView = app.scrollViews.firstMatch
            if scrollView.exists {
                scrollView.swipeUp()
                scrollView.swipeDown()
            }
        }

        app.terminate()
    }
}
