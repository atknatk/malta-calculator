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
        var blocks: [MarkdownBlock] = []
        var nextId = 0
        func append(_ kind: Kind, _ raw: String) {
            let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !trimmed.isEmpty else { return }
            blocks.append(MarkdownBlock(id: nextId, kind: kind, raw: trimmed))
            nextId += 1
        }

        let lines = markdown.components(separatedBy: "\n")
        var index = 0
        var paragraphBuffer: [String] = []

        func flushParagraph() {
            guard !paragraphBuffer.isEmpty else { return }
            append(.paragraph, paragraphBuffer.joined(separator: " "))
            paragraphBuffer.removeAll()
        }

        while index < lines.count {
            let line = lines[index]
            let trimmed = line.trimmingCharacters(in: .whitespaces)

            if trimmed.isEmpty {
                flushParagraph()
                index += 1
                continue
            }

            if trimmed.hasPrefix("```") {
                flushParagraph()
                var code: [String] = []
                index += 1
                while index < lines.count,
                      !lines[index].trimmingCharacters(in: .whitespaces).hasPrefix("```")
                {
                    code.append(lines[index])
                    index += 1
                }
                append(.code, code.joined(separator: "\n"))
                if index < lines.count { index += 1 }
                continue
            }

            if trimmed.hasPrefix("### ") {
                flushParagraph()
                append(.h3, String(trimmed.dropFirst(4)))
                index += 1
                continue
            }
            if trimmed.hasPrefix("## ") {
                flushParagraph()
                append(.h2, String(trimmed.dropFirst(3)))
                index += 1
                continue
            }
            if trimmed.hasPrefix("# ") {
                flushParagraph()
                append(.h1, String(trimmed.dropFirst(2)))
                index += 1
                continue
            }
            if trimmed.hasPrefix("> ") {
                flushParagraph()
                append(.quote, String(trimmed.dropFirst(2)))
                index += 1
                continue
            }
            if trimmed.hasPrefix("- ") || trimmed.hasPrefix("* ") {
                flushParagraph()
                append(.bulleted, String(trimmed.dropFirst(2)))
                index += 1
                continue
            }

            paragraphBuffer.append(trimmed)
            index += 1
        }
        flushParagraph()
        return blocks
    }
}
