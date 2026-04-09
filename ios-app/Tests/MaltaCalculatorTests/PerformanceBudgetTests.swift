//
//  PerformanceBudgetTests.swift
//  MaltaCalculator
//
//  Tests that enforce the Task 15 performance budgets at the unit level:
//  animation budget constants, signpost instrumentation availability,
//  and MetricsObserver instantiation.
//

import Foundation
import Testing
@testable import MaltaCalculator

// MARK: - Animation Budget Tests

@Suite("Animation Budget Constants")
struct AnimationBudgetTests {

    @Test("Spring animation budget is 5")
    func springBudget() {
        #expect(AnimationBudget.maxSpringAnimations == 5)
    }

    @Test("Phase animator budget is 2")
    func phaseBudget() {
        #expect(AnimationBudget.maxPhaseAnimators == 2)
    }

    @Test("Repeating animation budget is 3")
    func repeatingBudget() {
        #expect(AnimationBudget.maxRepeatingAnimations == 3)
    }

    @Test("Glass effect budget is 8")
    func glassBudget() {
        #expect(AnimationBudget.maxGlassEffects == 8)
    }
}

// MARK: - MetricsObserver Tests

@Suite("MetricsObserver")
struct MetricsObserverTests {

    @Test("Observer can be instantiated without crash")
    func instantiation() {
        let observer = MetricsObserver()
        _ = observer
    }

    @Test("Start and stop do not crash")
    func startStop() {
        let observer = MetricsObserver()
        observer.start()
        observer.stop()
    }
}

// MARK: - AppSignpost Category Tests

@Suite("AppSignpost Categories")
struct AppSignpostCategoryTests {

    @Test("All expected categories exist", arguments: [
        AppSignpost.Category.calculation,
        .rendering,
        .persistence,
        .navigation,
        .network
    ])
    func categoryExists(category: AppSignpost.Category) {
        #expect(!category.rawValue.isEmpty)
    }

    @Test("Measure block returns correct value")
    func measureReturnsValue() {
        let result = AppSignpost.measure(.calculation, name: "TestMeasure") {
            42
        }
        #expect(result == 42)
    }

    @Test("MeasureAsync block returns correct value")
    func measureAsyncReturnsValue() async {
        let result = await AppSignpost.measureAsync(.calculation, name: "TestAsyncMeasure") {
            99
        }
        #expect(result == 99)
    }
}
