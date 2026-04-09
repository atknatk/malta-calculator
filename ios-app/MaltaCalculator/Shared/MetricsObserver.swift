//
//  MetricsObserver.swift
//  MaltaCalculator
//
//  Passive MetricKit collection for production performance monitoring.
//  Captures launch times, hang rates, and disk writes — logs locally
//  in v1, transmit opt-in planned for v1.1.
//

import MetricKit
import os

/// Subscribes to ``MXMetricManager`` and logs payloads via `os.Logger`.
///
/// Created once in ``MaltaCalculatorApp.performDeferredInit()`` and
/// retained for the lifetime of the process. No data leaves the device
/// in v1 — the observer merely captures Apple's daily payloads so
/// they appear in Console.app / Instruments for developer debugging.
final class MetricsObserver: NSObject, MXMetricManagerSubscriber {

    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "MetricKit"
    )

    /// Registers this observer with MetricKit.
    func start() {
        MXMetricManager.shared.add(self)
        log.info("MetricsObserver registered")
    }

    /// Unregisters this observer.
    func stop() {
        MXMetricManager.shared.remove(self)
    }

    // MARK: - MXMetricManagerSubscriber

    func didReceive(_ payloads: [MXMetricPayload]) {
        for payload in payloads {
            if let launch = payload.applicationLaunchMetrics {
                let histogram = launch.histogrammedTimeToFirstDraw
                log.info(
                    "Launch metrics — buckets: \(histogram.totalBucketCount, privacy: .public)"
                )
            }
            if let hang = payload.applicationResponsivenessMetrics {
                log.info(
                    "Hang metrics — \(hang.histogrammedApplicationHangTime.totalBucketCount, privacy: .public) buckets"
                )
            }
            log.debug("MetricKit payload received — \(payload.timeStampEnd, privacy: .public)")
        }
    }

    func didReceive(_ payloads: [MXDiagnosticPayload]) {
        for payload in payloads {
            if let hangs = payload.hangDiagnostics {
                log.warning("Hang diagnostics: \(hangs.count, privacy: .public) entries")
            }
            if let crashes = payload.crashDiagnostics {
                log.error("Crash diagnostics: \(crashes.count, privacy: .public) entries")
            }
        }
    }
}
