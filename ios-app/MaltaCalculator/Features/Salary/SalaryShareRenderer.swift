//
//  SalaryShareRenderer.swift
//  MaltaCalculator
//

import CalculationKit
import SwiftUI
import UIKit

/// Renders salary calculation results as shareable PNG cards and PDF summaries.
///
/// Implements the ``Shareable`` protocol. Generated artifacts are cached
/// in `NSCachesDirectory` and never include PII (no names, no emails).
@MainActor
final class SalaryShareRenderer: Shareable {
    /// The numeric content to render.
    private let content: SalaryShareContent

    /// Creates a renderer for the given share content.
    /// - Parameter content: The salary calculation summary to render.
    init(content: SalaryShareContent) {
        self.content = content
    }

    // MARK: - Shareable

    /// Renders a 1080x1080 share card as a PNG image.
    func asImage() async -> UIImage? {
        let view = SalaryShareCard(content: content)
        let renderer = ImageRenderer(content: view)
        renderer.scale = 2.0
        renderer.proposedSize = .init(width: 540, height: 540)
        return renderer.uiImage
    }

    /// Renders a single-page PDF summary and returns its cached file URL.
    func asPDF() async -> URL? {
        let pageWidth: CGFloat = 612
        let pageHeight: CGFloat = 792
        let margin: CGFloat = 50
        let usableWidth = pageWidth - margin * 2

        let outputURL = ShareCache.fileURL(prefix: "Salary", extension: "pdf")

        let renderer = UIGraphicsPDFRenderer(
            bounds: CGRect(x: 0, y: 0, width: pageWidth, height: pageHeight)
        )

        do {
            try renderer.writePDF(to: outputURL) { context in
                context.beginPage()
                var yOffset = margin

                yOffset = drawHeader(at: yOffset, margin: margin, usableWidth: usableWidth)
                yOffset = drawKeyFigures(at: yOffset, margin: margin, usableWidth: usableWidth)
                drawDisclaimer(at: yOffset, margin: margin, usableWidth: usableWidth)
            }
            return outputURL
        } catch {
            return nil
        }
    }

    // MARK: - PDF Drawing Helpers

    @discardableResult
    private func drawHeader(at startY: CGFloat, margin: CGFloat, usableWidth: CGFloat) -> CGFloat {
        var yOffset = startY

        let titleAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 24, weight: .bold),
            .foregroundColor: UIColor.label
        ]
        let title = NSAttributedString(
            string: String(localized: "salary.pdf.title"),
            attributes: titleAttrs
        )
        title.draw(at: CGPoint(x: margin, y: yOffset))
        yOffset += 40

        let subtitleAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 14, weight: .regular),
            .foregroundColor: UIColor.secondaryLabel
        ]
        let subtitle = NSAttributedString(
            string: String(localized: "salary.pdf.subtitle \(String(content.year))"),
            attributes: subtitleAttrs
        )
        subtitle.draw(at: CGPoint(x: margin, y: yOffset))
        yOffset += 40

        let dividerPath = UIBezierPath()
        dividerPath.move(to: CGPoint(x: margin, y: yOffset))
        dividerPath.addLine(to: CGPoint(x: margin + usableWidth, y: yOffset))
        UIColor.separator.setStroke()
        dividerPath.lineWidth = 0.5
        dividerPath.stroke()
        yOffset += 20

        return yOffset
    }

    @discardableResult
    private func drawKeyFigures(at startY: CGFloat, margin: CGFloat, usableWidth: CGFloat) -> CGFloat {
        var yOffset = startY

        let rows: [(String, String)] = [
            (String(localized: "salary.pdf.annualGross"), content.annualGross.eur),
            (String(localized: "salary.pdf.annualSSC"), content.annualSSC.eur),
            (String(localized: "salary.pdf.annualIncomeTax"), content.annualIncomeTax.eur),
            (String(localized: "salary.pdf.annualNet"), content.annualNet.eur),
            (String(localized: "salary.pdf.monthlyNet"), content.monthlyNet.eur),
            (String(localized: "salary.pdf.effectiveRate"), formatRate(content.effectiveTaxRate))
        ]

        let labelAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 14, weight: .regular),
            .foregroundColor: UIColor.label
        ]
        let valueAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.monospacedDigitSystemFont(ofSize: 14, weight: .semibold),
            .foregroundColor: UIColor.label
        ]

        for (label, value) in rows {
            let labelStr = NSAttributedString(string: label, attributes: labelAttrs)
            let valueStr = NSAttributedString(string: value, attributes: valueAttrs)
            labelStr.draw(at: CGPoint(x: margin, y: yOffset))
            let valueWidth = valueStr.size().width
            valueStr.draw(at: CGPoint(x: margin + usableWidth - valueWidth, y: yOffset))
            yOffset += 28
        }

        yOffset += 10

        let bottomPath = UIBezierPath()
        bottomPath.move(to: CGPoint(x: margin, y: yOffset))
        bottomPath.addLine(to: CGPoint(x: margin + usableWidth, y: yOffset))
        UIColor.separator.setStroke()
        bottomPath.lineWidth = 0.5
        bottomPath.stroke()
        yOffset += 20

        return yOffset
    }

    @discardableResult
    private func drawDisclaimer(at startY: CGFloat, margin: CGFloat, usableWidth: CGFloat) -> CGFloat {
        let disclaimerAttrs: [NSAttributedString.Key: Any] = [
            .font: UIFont.systemFont(ofSize: 10, weight: .regular),
            .foregroundColor: UIColor.tertiaryLabel
        ]
        let disclaimer = NSAttributedString(
            string: String(localized: "salary.pdf.disclaimer"),
            attributes: disclaimerAttrs
        )
        let disclaimerRect = CGRect(x: margin, y: startY, width: usableWidth, height: 60)
        disclaimer.draw(in: disclaimerRect)
        return startY + 60
    }

    // MARK: - Private

    private func formatRate(_ rate: Decimal) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .percent
        formatter.minimumFractionDigits = 0
        formatter.maximumFractionDigits = 1
        return formatter.string(from: rate as NSDecimalNumber) ?? "—"
    }
}

// MARK: - Share Card View

/// A 540x540pt card rendered by ``ImageRenderer`` for PNG share output.
///
/// Uses system styling for offline rendering. No PII is included.
private struct SalaryShareCard: View {
    let content: SalaryShareContent

    var body: some View {
        VStack(spacing: 16) {
            Text("salary.share.card.title")
                .font(.system(size: 22, weight: .bold, design: .rounded))
                .foregroundStyle(.primary)

            yearBadge

            Divider()

            netFigures

            Divider()

            breakdownRows

            Spacer()

            Text("salary.share.card.footer")
                .font(.system(size: 10))
                .foregroundStyle(.tertiary)
        }
        .padding(32)
        .frame(width: 540, height: 540)
        .background(Color(.systemBackground))
    }

    private var yearBadge: some View {
        Text(verbatim: String(content.year))
            .font(.system(size: 13, weight: .semibold))
            .padding(.horizontal, 12)
            .padding(.vertical, 4)
            .background(Color.orange.opacity(0.15), in: Capsule())
            .foregroundStyle(.orange)
    }

    private var netFigures: some View {
        VStack(spacing: 8) {
            HStack(alignment: .firstTextBaseline) {
                Text("salary.share.card.annualNet")
                    .font(.system(size: 14))
                    .foregroundStyle(.secondary)
                Spacer()
                Text(content.annualNet.eur)
                    .font(.system(size: 28, weight: .bold, design: .rounded))
                    .monospacedDigit()
                    .foregroundStyle(.orange)
            }

            HStack(alignment: .firstTextBaseline) {
                Text("salary.share.card.monthlyNet")
                    .font(.system(size: 14))
                    .foregroundStyle(.secondary)
                Spacer()
                Text(content.monthlyNet.eur)
                    .font(.system(size: 20, weight: .semibold, design: .rounded))
                    .monospacedDigit()
            }
        }
    }

    private var breakdownRows: some View {
        VStack(spacing: 8) {
            shareRow(
                label: String(localized: "salary.share.card.gross"),
                value: content.annualGross.eur
            )
            shareRow(
                label: String(localized: "salary.share.card.ssc"),
                value: content.annualSSC.eur,
                isNegative: true
            )
            shareRow(
                label: String(localized: "salary.share.card.tax"),
                value: content.annualIncomeTax.eur,
                isNegative: true
            )
        }
    }

    private func shareRow(
        label: String,
        value: String,
        isNegative: Bool = false
    ) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 13))
                .foregroundStyle(.secondary)
            Spacer()
            Text(isNegative ? "\u{2212}" + value : value)
                .font(.system(size: 13, weight: .medium, design: .monospaced))
                .foregroundStyle(isNegative ? .red : .primary)
        }
    }
}
