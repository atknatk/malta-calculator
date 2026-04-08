//
//  SalaryShareSheet.swift
//  MaltaCalculator
//

import CalculationKit
import DesignSystem
import SwiftUI

/// Share sheet presented from the Salary screen with text, CSV,
/// image (PNG), and PDF export options.
struct SalaryShareSheet: View {
    /// The view model that owns the calculation state.
    @Bindable var vm: SalaryViewModel
    /// The share content derived from the current calculation.
    let content: SalaryShareContent

    @State private var isExporting: Bool = false

    var body: some View {
        NavigationStack {
            List {
                textSection
                exportSection
            }
            .navigationTitle(String(localized: "salary.action.share"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(String(localized: "salary.share.dismiss")) {
                        vm.showingShareSheet = false
                    }
                }
            }
        }
        .presentationDetents([.medium, .large])
    }

    // MARK: - Text & CSV

    private var textSection: some View {
        Section {
            ShareLink(
                item: buildShareText(),
                subject: Text("salary.share.subject"),
                message: Text(buildShareText())
            ) {
                Label(
                    String(localized: "salary.share.asText"),
                    systemImage: "doc.plaintext"
                )
            }
            .accessibilityHint(Text("salary.share.asText.hint"))

            ShareLink(
                item: buildCSV(),
                subject: Text("salary.share.subject")
            ) {
                Label(
                    String(localized: "salary.share.asCSV"),
                    systemImage: "tablecells"
                )
            }
            .accessibilityHint(Text("salary.share.asCSV.hint"))

            Button {
                UIPasteboard.general.string = buildShareText()
                vm.showingShareSheet = false
            } label: {
                Label(
                    String(localized: "salary.share.copyClipboard"),
                    systemImage: "doc.on.doc"
                )
            }
            .accessibilityHint(Text("salary.share.copyClipboard.hint"))
        } header: {
            Text("salary.share.formatHeader")
        }
    }

    // MARK: - Image & PDF Export

    private var exportSection: some View {
        Section {
            Button {
                exportImage()
            } label: {
                HStack {
                    Label(
                        String(localized: "salary.share.asImage"),
                        systemImage: "photo"
                    )
                    if isExporting {
                        Spacer()
                        ProgressView().controlSize(.small)
                    }
                }
            }
            .disabled(isExporting)
            .accessibilityLabel(Text("salary.share.asImage"))
            .accessibilityHint(Text("salary.share.asImage.hint"))

            Button {
                exportPDF()
            } label: {
                HStack {
                    Label(
                        String(localized: "salary.share.asPDF"),
                        systemImage: "doc.richtext"
                    )
                    if isExporting {
                        Spacer()
                        ProgressView().controlSize(.small)
                    }
                }
            }
            .disabled(isExporting)
            .accessibilityLabel(Text("salary.share.asPDF"))
            .accessibilityHint(Text("salary.share.asPDF.hint"))
        } header: {
            Text("salary.share.exportHeader")
        }
    }

    // MARK: - Export Actions

    private func exportImage() {
        guard let renderer = vm.buildShareRenderer() else { return }
        isExporting = true
        Task {
            let image = await renderer.asImage()
            isExporting = false
            if let image {
                presentActivityController(items: [image])
            }
        }
    }

    private func exportPDF() {
        guard let renderer = vm.buildShareRenderer() else { return }
        isExporting = true
        Task {
            let url = await renderer.asPDF()
            isExporting = false
            if let url {
                presentActivityController(items: [url])
            }
        }
    }

    private func presentActivityController(items: [Any]) {
        guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let root = scene.windows.first?.rootViewController else { return }
        let controller = UIActivityViewController(
            activityItems: items,
            applicationActivities: nil
        )
        controller.popoverPresentationController?.sourceView = root.view
        root.present(controller, animated: true)
    }

    // MARK: - Text Builders

    private func buildShareText() -> String {
        String(
            localized: "salary.share.text \(content.annualGross.eur) \(content.annualNet.eur) \(String(content.year))"
        )
    }

    private func buildCSV() -> String {
        let header = String(localized: "salary.csv.header")
        let rows = [
            "\(String(localized: "salary.csv.year")),\(content.year)",
            "\(String(localized: "salary.csv.annualGross")),\(content.annualGross.eur)",
            "\(String(localized: "salary.csv.annualSSC")),\(content.annualSSC.eur)",
            "\(String(localized: "salary.csv.annualIncomeTax")),\(content.annualIncomeTax.eur)",
            "\(String(localized: "salary.csv.annualNet")),\(content.annualNet.eur)",
            "\(String(localized: "salary.csv.monthlyNetAvg")),\(content.monthlyNet.eur)",
            "\(String(localized: "salary.csv.effectiveTaxRate")),\(content.effectiveTaxRate)"
        ]

        var csvLines = [header] + rows

        let monthly = vm.monthly
        if !monthly.isEmpty {
            csvLines.append("")
            csvLines.append(String(localized: "salary.csv.monthlyHeader"))
            for output in monthly {
                let row = [
                    output.month.shortName,
                    output.grossWage.eur,
                    output.sscTax.eur,
                    output.incomeTax.eur,
                    output.net.eur
                ].joined(separator: ",")
                csvLines.append(row)
            }
        }

        return csvLines.joined(separator: "\n")
    }
}
