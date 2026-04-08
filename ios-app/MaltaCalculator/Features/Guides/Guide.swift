//
//  Guide.swift
//  MaltaCalculator
//

import Foundation

/// A bundled Malta Calculator guide (Markdown reader content).
struct Guide: Identifiable, Hashable, Sendable, Codable {
    let slug: String
    let title: String
    let description: String
    let category: GuideCategory
    let tags: [String]
    let publishedAt: Date
    let updatedAt: Date
    let readingMinutes: Int
    let symbolName: String
    let gradientName: String

    var id: String { slug }
}

/// Top-level categories used for filtering guides.
enum GuideCategory: String, Codable, Sendable, CaseIterable, Hashable {
    case salary
    case tax
    case property
    case banking
    case retirement
    case employment
    case leave
    case immigration
    case general

    /// Localized, human-readable title for the category.
    var title: LocalizedStringResource {
        switch self {
        case .salary: return "guides.category.salary"
        case .tax: return "guides.category.tax"
        case .property: return "guides.category.property"
        case .banking: return "guides.category.banking"
        case .retirement: return "guides.category.retirement"
        case .employment: return "guides.category.employment"
        case .leave: return "guides.category.leave"
        case .immigration: return "guides.category.immigration"
        case .general: return "guides.category.general"
        }
    }
}
