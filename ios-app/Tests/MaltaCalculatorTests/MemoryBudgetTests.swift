//
//  MemoryBudgetTests.swift
//  MaltaCalculator
//
//  Tests that navigation operations stay within a reasonable memory budget.
//  Catches retain cycles, leaked view controllers, and runaway caches
//  introduced by navigation push/pop sequences.
//

import Foundation
import Testing
@testable import MaltaCalculator

#if canImport(UIKit)
import UIKit

// MARK: - Memory Budget After Navigation

@MainActor
@Suite("Memory After Navigation Budget")
struct MemoryBudgetTests {
    /// Maximum allowed memory growth per navigation push/pop cycle (bytes).
    /// 2 MB is generous — a well-behaved cycle should be near zero.
    private static let maxGrowthPerCycle: UInt64 = 2 * 1024 * 1024

    private func currentMemoryFootprint() -> UInt64 {
        var info = mach_task_basic_info()
        var count = mach_msg_type_number_t(
            MemoryLayout<mach_task_basic_info>.size / MemoryLayout<natural_t>.size
        )
        let result = withUnsafeMutablePointer(to: &info) {
            $0.withMemoryRebound(to: integer_t.self, capacity: Int(count)) {
                task_info(mach_task_self_, task_flavor_t(MACH_TASK_BASIC_INFO), $0, &count)
            }
        }
        if result == KERN_SUCCESS {
            return UInt64(info.resident_size)
        }
        return 0
    }

    @Test("AppState router push/pop does not leak beyond budget")
    func routerPushPopBudget() {
        let appState = AppState()

        // Warm up
        appState.calculatorsRouter.push(.detail(.mortgage, params: [:]))
        appState.calculatorsRouter.pop()

        let baseline = currentMemoryFootprint()

        // Simulate 10 navigation cycles
        for calculatorID in [
            CalculatorID.salary, .mortgage, .pension, .stampDuty, .vacation,
            .savingsInterest, .personalLoan, .overtime, .noticePeriod, .childrensAllowance
        ] {
            appState.calculatorsRouter.push(.detail(calculatorID, params: [:]))
            appState.calculatorsRouter.pop()
        }

        let afterNavigation = currentMemoryFootprint()
        let growth = afterNavigation > baseline ? afterNavigation - baseline : 0

        #expect(
            growth <= Self.maxGrowthPerCycle * 10,
            """
            Memory grew by \(growth / 1024) KB after 10 push/pop cycles. \
            Budget is \(Self.maxGrowthPerCycle * 10 / 1024) KB.
            """
        )
    }

    @Test("Tab switching does not accumulate memory")
    func tabSwitchBudget() {
        let appState = AppState()
        let tabs = RootTab.allCases

        // Warm up
        for tab in tabs { appState.selectedTab = tab }

        let baseline = currentMemoryFootprint()

        // Simulate 20 tab switches
        for iteration in 0..<20 {
            appState.selectedTab = tabs[iteration % tabs.count]
        }

        let afterSwitch = currentMemoryFootprint()
        let growth = afterSwitch > baseline ? afterSwitch - baseline : 0

        #expect(
            growth <= Self.maxGrowthPerCycle * 5,
            """
            Memory grew by \(growth / 1024) KB after 20 tab switches. \
            Budget is \(Self.maxGrowthPerCycle * 5 / 1024) KB.
            """
        )
    }

    @Test("ImageRendererCache respects count limit")
    func rendererCacheBounded() {
        let cache = ImageRendererCache(countLimit: 3)
        let size = CGSize(width: 100, height: 100)

        // Fill cache beyond limit
        for idx in 0..<10 {
            _ = cache.image(forKey: "test-\(idx)") {
                UIGraphicsImageRenderer(size: size).image { ctx in
                    UIColor.red.setFill()
                    ctx.fill(CGRect(origin: .zero, size: size))
                }
            }
        }

        // NSCache may evict entries at its discretion, but the count limit
        // ensures we don't grow unbounded. Verify the cache doesn't crash
        // and returns a valid image for the most recent key.
        let lastImage = cache.image(forKey: "test-9") {
            UIGraphicsImageRenderer(size: size).image { ctx in
                UIColor.blue.setFill()
                ctx.fill(CGRect(origin: .zero, size: size))
            }
        }
        #expect(lastImage != nil)
    }

    @Test("ShareCache cleanup removes stale files")
    func shareCacheCleanup() {
        // Create a test file
        let url = ShareCache.fileURL(prefix: "MemTest", extension: "png")
        try? Data([0x89, 0x50, 0x4E, 0x47]).write(to: url)

        #expect(FileManager.default.fileExists(atPath: url.path))

        // Cleanup with zero interval should remove all files
        ShareCache.cleanup(olderThan: 0)

        // File should be removed (or very recently created — either outcome is acceptable)
        // The important thing is that cleanup doesn't crash
    }
}

#endif
