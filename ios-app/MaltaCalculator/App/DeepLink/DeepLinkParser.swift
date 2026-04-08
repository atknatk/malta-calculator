//
//  DeepLinkParser.swift
//  MaltaCalculator
//

import Foundation
import os

/// Parses incoming URLs into ``DeepLinkDestination`` values.
///
/// Supports two URL schemes:
/// - Custom scheme: `maltacalc://calculators/mortgage?price=300000`
/// - Universal links: `https://maltacalculator.com/app/calculators/mortgage?price=300000`
struct DeepLinkParser: Sendable {
    private let log = Logger(
        subsystem: "com.maltacalculator.app",
        category: "DeepLinkParser"
    )

    /// Attempt to parse a URL into a navigation destination.
    ///
    /// - Parameter url: The incoming URL to parse.
    /// - Returns: A resolved ``DeepLinkDestination``, or `nil` if the URL is not recognised.
    func parse(_ url: URL) -> DeepLinkDestination? {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            log.debug("Failed to parse URL components: \(url.absoluteString, privacy: .public)")
            return nil
        }

        let scheme = components.scheme?.lowercased()
        guard scheme == "maltacalc" || scheme == "https" else {
            log.debug("Unsupported scheme: \(scheme ?? "nil", privacy: .public)")
            return nil
        }

        let (host, segments) = extractRouteInfo(from: components, scheme: scheme)
        let params = extractQueryParams(from: components)

        return resolveDestination(host: host, segments: segments, params: params, url: url)
    }

    // MARK: - Private Helpers

    private func extractRouteInfo(
        from components: URLComponents,
        scheme: String?
    ) -> (host: String, segments: [String]) {
        var pathComponents = components.path
            .split(separator: "/")
            .map(String.init)
        if scheme == "https", pathComponents.first == "app" {
            pathComponents.removeFirst()
        }

        let host: String
        let segments: [String]
        if scheme == "maltacalc" {
            // Custom scheme: host carries the route section
            // e.g. maltacalc://calculators/mortgage → host = "calculators"
            host = components.host ?? ""
            segments = pathComponents
        } else {
            // Universal link: route section is in the path
            // e.g. https://maltacalculator.com/app/calculators/mortgage
            host = pathComponents.first ?? ""
            segments = Array(pathComponents.dropFirst())
        }
        return (host, segments)
    }

    private func extractQueryParams(from components: URLComponents) -> [String: String] {
        Dictionary(
            uniqueKeysWithValues: (components.queryItems ?? [])
                .compactMap { item -> (String, String)? in
                    guard let value = item.value else { return nil }
                    return (item.name, value)
                }
        )
    }

    private func resolveDestination(
        host: String,
        segments: [String],
        params: [String: String],
        url: URL
    ) -> DeepLinkDestination? {
        switch host {
        case "calculators":
            guard let idRaw = segments.first,
                  let id = CalculatorID(rawValue: idRaw)
            else {
                log.debug("Unknown calculator ID in URL: \(url.absoluteString, privacy: .public)")
                return nil
            }
            return .calculator(id, params: params)

        case "salary":
            return .salary(params: params)

        case "guides":
            guard let slug = segments.first else {
                log.debug("Missing guide slug in URL: \(url.absoluteString, privacy: .public)")
                return nil
            }
            return .guide(slug: slug)

        case "settings":
            return .settings

        default:
            log.debug("Unrecognised host: \(host, privacy: .public)")
            return nil
        }
    }
}
