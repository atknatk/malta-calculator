//
//  GenericShareRenderer.swift
//  MaltaCalculator
//

import SwiftUI
import UIKit

/// Renders ``GenericShareContent`` to a PNG share card and an A4 PDF summary.
///
/// Conforms to ``Shareable``. Generated artifacts are cached in
/// `NSCachesDirectory` via ``ShareCache`` and never include personally
/// identifying information.
@MainActor
final class GenericShareRenderer: Shareable {
    /// The numeric content to render.
    private let content: GenericShareContent

    /// Creates a renderer for the given share content.
    /// - Parameter content: The pre-formatted breakdown to render.
    init(content: GenericShareContent) {
        self.content = content
    }

    // MARK: - Shareable

    /// Renders a square share card as a PNG-backed `UIImage`.
    ///
    /// The card is laid out at 540x540pt and rendered at 2x scale, producing
    /// a 1080x1080 raster suitable for Instagram, Twitter, or system share.
    func asImage() async -> UIImage? {
        let view = GenericShareCard(content: content)
        let renderer = ImageRenderer(content: view)
        renderer.scale = 2.0
        renderer.proposedSize = .init(width: 540, height: 540)
        return renderer.uiImage
    }

    /// Renders a single-page A4 PDF summary and returns its cached file URL.
    ///
    /// Returns `nil` if the PDF context fails to write.
    func asPDF() async -> URL? {
        let pageWidth: CGFloat = 595.2  // A4 @ 72dpi
        let pageHeight: CGFloat = 841.8
        let margin: CGFloat = 50
        let usableWidth = pageWidth - margin * 2

        let outputURL = ShareCache.fileURL(prefix: content.id, extension: "pdf")

        let renderer = UIGraphicsPDFRenderer(
            bounds: CGRect(x: 0, y: 0, width: pageWidth, height: pageHeight)
        )

        do {
            try renderer.writePDF(to: outputURL) { context in
                context.beginPage()
                var yOffset = margin
                yOffset = drawHeader(at: yOffset, margin: margin, usableWidth: usableWidth)
                yOffset = drawHero(at: yOffset, margin: margin, usableWidth: usableWidth)
                yOffset = drawRows(at: yOffset, margin: margin, usableWidth: usableWidth)
                drawDisclaimer(at: yOffset, margin: margin, usableWidth: usableWidth)
            }
            return outputURL
        } catch {
            return nil
        }
    }

    /// Builds the plain-text representation suitable for WhatsApp / iMessage.
    func asText() -> String {
        var lines: [String] = []
        lines.append(content.title)
        if let subtitle = content.subtitle {
            lines.append(subtitle)
        }
        lines.append("")
        lines.append("\(content.heroLabel): \(content.heroValue)")
        lines.append(String(repeating: "─", count: 24))
        for row in content.rows {
            lines.append("\(row.label): \(row.value)")
        }
        lines.append("")
        lines.append(String(localized: "share.text.footer"))
        return lines.joined(separator: "\n")
    }

    // MARK: - PDF drawing

    @discardableResult
    private func drawHeader(at startY: CGFloat, margin: CGFloat, usableWidth: CGFloat) -> CGFloat {
        var yOffset = startY
        let titleAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 24, weight: .bold),
            .foregroundColor: UIColor.label
        ]
        NSAttributedString(string: content.title, attributes: titleAttrs)
            .draw(at: CGPoint(x: margin, y: yOffset))
        yOffset += 36

        if let subtitle = content.subtitle {
            let subtitleAttrs: [NSAttributedString.Key: Any] = [
                .font: UIFont.systemFont(ofSize: 14, weight: .regular),
                .foregroundColor: UIColor.secondaryLabel
            ]
            NSAttributedString(string: subtitle, attributes: subtitleAttrs)
                .draw(at: CGPoint(x: margin, y: yOffset))
            yOffset += 24
        }

        let path = UIBezierPath()
        path.move(to: CGPoint(x: margin, y: yOffset))
        path.addLine(to: CGPoint(x: margin + usableWidth, y: yOffset))
        UIColor.separator.setStroke()
        path.lineWidth = 0.5
        path.stroke()
        return yOffset + 18
    }

    @discardableResult
    private func drawHero(at startY: CGFloat, margin: CGFloat, usableWidth: CGFloat) -> CGFloat {
        var yOffset = startY
        let labelAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 11, weight: .semibold),
            .foregroundColor: UIColor.secondaryLabel,
            .kern: NSNumber(value: 1.5)
        ]
        NSAttributedString(string: content.heroLabel.uppercased(), attributes: labelAttrs)
            .draw(at: CGPoint(x: margin, y: yOffset))
        yOffset += 18

        let valueAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.monospacedDigitSystemFont(ofSize: 32, weight: .bold),
            .foregroundColor: UIColor(red: 201 / 255, green: 125 / 255, blue: 10 / 255, alpha: 1)
        ]
        NSAttributedString(string: content.heroValue, attributes: valueAttrs)
            .draw(at: CGPoint(x: margin, y: yOffset))
        yOffset += 44

        let path = UIBezierPath()
        path.move(to: CGPoint(x: margin, y: yOffset))
        path.addLine(to: CGPoint(x: margin + usableWidth, y: yOffset))
        UIColor.separator.setStroke()
        path.lineWidth = 0.5
        path.stroke()
        return yOffset + 18
    }

    @discardableResult
    private func drawRows(at startY: CGFloat, margin: CGFloat, usableWidth: CGFloat) -> CGFloat {
        var yOffset = startY
        let labelAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 13, weight: .regular),
            .foregroundColor: UIColor.label
        ]
        let valueAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.monospacedDigitSystemFont(ofSize: 13, weight: .semibold),
            .foregroundColor: UIColor.label
        ]
        for row in content.rows {
            let labelStr = NSAttributedString(string: row.label, attributes: labelAttrs)
            let valueStr = NSAttributedString(string: row.value, attributes: valueAttrs)
            labelStr.draw(at: CGPoint(x: margin, y: yOffset))
            let valueWidth = valueStr.size().width
            valueStr.draw(at: CGPoint(x: margin + usableWidth - valueWidth, y: yOffset))
            yOffset += 24
        }
        return yOffset + 14
    }

    @discardableResult
    private func drawDisclaimer(at startY: CGFloat, margin: CGFloat, usableWidth: CGFloat) -> CGFloat {
        let attrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 10, weight: .regular),
            .foregroundColor: UIColor.tertiaryLabel
        ]
        let disclaimer = NSAttributedString(
            string: String(localized: "share.pdf.disclaimer"),
            attributes: attrs
        )
        let rect = CGRect(x: margin, y: startY, width: usableWidth, height: 80)
        disclaimer.draw(in: rect)
        return startY + 80
    }
}

// MARK: - Share Card View

/// SwiftUI view rendered by ``ImageRenderer`` to produce the PNG share card.
///
/// Static layout — no animations, no Liquid Glass, no Dynamic Type — because
/// it is rasterised offscreen and must be deterministic across devices.
private struct GenericShareCard: View {
    let content: GenericShareContent

    var body: some View {
        VStack(spacing: 14) {
            HStack(spacing: 8) {
                Image(systemName: content.symbolName)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundStyle(.orange)
                Text(content.title)
                    .font(.system(size: 18, weight: .bold, design: .rounded))
                    .foregroundStyle(.primary)
                Spacer()
            }

            if let subtitle = content.subtitle {
                HStack {
                    Text(subtitle)
                        .font(.system(size: 12))
                        .foregroundStyle(.secondary)
                    Spacer()
                }
            }

            Divider()

            VStack(spacing: 6) {
                Text(content.heroLabel.uppercased())
                    .font(.system(size: 11, weight: .semibold))
                    .tracking(1.5)
                    .foregroundStyle(.secondary)
                Text(content.heroValue)
                    .font(.system(size: 36, weight: .bold, design: .rounded))
                    .monospacedDigit()
                    .foregroundStyle(.orange)
                    .minimumScaleFactor(0.5)
                    .lineLimit(1)
            }

            Divider()

            VStack(spacing: 8) {
                ForEach(Array(content.rows.enumerated()), id: \.offset) { _, row in
                    HStack {
                        Text(row.label)
                            .font(.system(size: 13))
                            .foregroundStyle(.secondary)
                        Spacer()
                        Text(row.value)
                            .font(.system(size: 13, weight: .medium, design: .monospaced))
                            .foregroundStyle(.primary)
                    }
                }
            }

            Spacer()

            HStack {
                Text("share.card.footer")
                    .font(.system(size: 10))
                    .foregroundStyle(.tertiary)
                Spacer()
                Text(Date.now, format: .dateTime.day().month().year())
                    .font(.system(size: 10))
                    .foregroundStyle(.tertiary)
            }
        }
        .padding(28)
        .frame(width: 540, height: 540)
        .background(Color(.systemBackground))
    }
}
