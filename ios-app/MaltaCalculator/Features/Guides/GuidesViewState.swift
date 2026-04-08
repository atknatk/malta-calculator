//
//  GuidesViewState.swift
//  MaltaCalculator
//

import Foundation

/// View state for the Guides list screen.
enum GuidesViewState: Equatable {
    case loading
    case empty
    case error(String)
    case content([Guide])
}
