//
//  MarkdownBlock.swift
//  MaltaCalculator
//

import Foundation

/// A lightweight block-level markdown model used by `GuideReaderScreen`.
///
/// This is intentionally small — we render bundled guides which use a limited
/// markdown subset (headings, paragraphs, bullet lists, blockquotes, fenced
/// code). Inline emphasis, links and code are delegated to
/// `AttributedString(markdown:)`.
struct MarkdownBlock: Identifiable, Hashable {
    enum Kind: Hashable {
        case h1
        case h2
        case h3
        case paragraph
        case bulleted
        case quote
        case code
    }

    let id: Int
    let kind: Kind
    let raw: String

    /// Convert the block's raw inline markdown into an `AttributedString`,
    /// scaled for the user's preferred font size.
    func attributed(fontScale: Double) -> AttributedString {
        if kind == .code {
            return AttributedString(raw)
        }
        var options = AttributedString.MarkdownParsingOptions()
        options.interpretedSyntax = .inlineOnlyPreservingWhitespace
        options.allowsExtendedAttributes = true
        if let attributed = try? AttributedString(markdown: raw, options: options) {
            return attributed
        }
        return AttributedString(raw)
    }

    /// Parse a markdown document into a flat list of block-level chunks.
    ///
    /// This parser is deliberately forgiving — it is designed for the
    /// well-formed markdown files bundled with the app, not arbitrary input.
    static func parse(_ markdown: String) -> [MarkdownBlock] {
        var state = ParseState()
        let lines = markdown.components(separatedBy: "\n")
        var index = 0

        while index < lines.count {
            let trimmed = lines[index].trimmingCharacters(in: .whitespaces)
            index = parseLine(trimmed, lines: lines, at: index, state: &state)
        }
        state.flushParagraph()
        return state.blocks
    }

    private static func parseLine(
        _ trimmed: String,
        lines: [String],
        at index: Int,
        state: inout ParseState
    ) -> Int {
        if trimmed.isEmpty {
            state.flushParagraph()
            return index + 1
        }

        if trimmed.hasPrefix("```") {
            state.flushParagraph()
            return parseCodeBlock(lines: lines, from: index + 1, state: &state)
        }

        if let (kind, drop) = headingOrBlock(trimmed) {
            state.flushParagraph()
            state.append(kind, String(trimmed.dropFirst(drop)))
            return index + 1
        }

        state.paragraphBuffer.append(trimmed)
        return index + 1
    }

    private static func headingOrBlock(_ line: String) -> (Kind, Int)? {
        if line.hasPrefix("### ") { return (.h3, 4) }
        if line.hasPrefix("## ") { return (.h2, 3) }
        if line.hasPrefix("# ") { return (.h1, 2) }
        if line.hasPrefix("> ") { return (.quote, 2) }
        if line.hasPrefix("- ") || line.hasPrefix("* ") { return (.bulleted, 2) }
        return nil
    }

    private static func parseCodeBlock(
        lines: [String],
        from start: Int,
        state: inout ParseState
    ) -> Int {
        var code: [String] = []
        var idx = start
        while idx < lines.count,
              !lines[idx].trimmingCharacters(in: .whitespaces).hasPrefix("```")
        {
            code.append(lines[idx])
            idx += 1
        }
        state.append(.code, code.joined(separator: "\n"))
        return idx < lines.count ? idx + 1 : idx
    }
}

// MARK: - Parse State

private struct ParseState {
    var blocks: [MarkdownBlock] = []
    var paragraphBuffer: [String] = []
    private var nextId = 0

    mutating func append(_ kind: MarkdownBlock.Kind, _ raw: String) {
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        blocks.append(MarkdownBlock(id: nextId, kind: kind, raw: trimmed))
        nextId += 1
    }

    mutating func flushParagraph() {
        guard !paragraphBuffer.isEmpty else { return }
        append(.paragraph, paragraphBuffer.joined(separator: " "))
        paragraphBuffer.removeAll()
    }
}
