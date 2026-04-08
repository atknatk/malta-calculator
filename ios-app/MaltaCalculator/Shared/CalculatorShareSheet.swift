//
//  CalculatorShareSheet.swift
//  MaltaCalculator
//

import SwiftUI
import UIKit

/// Reusable share sheet presented from any calculator detail screen.
///
/// Backed by ``GenericShareRenderer``: offers plain-text, image (PNG), and
/// PDF export plus a copy-to-clipboard action. Mirrors the UX of
/// ``SalaryShareSheet`` so users get a consistent experience across every
/// calculator.
struct CalculatorShareSheet: View {
    /// The pre-formatted content to share.
    let content: GenericShareContent
    /// Bound presentation flag — set to `false` to dismiss.
    @Binding var isPresented: Bool

    @State private var isExporting: Bool = false

    private var renderer: GenericShareRenderer { GenericShareRenderer(content: content) }

    var body: some View {
        NavigationStack {
            List {
                textSection
                exportSection
            }
            .navigationTitle(Text("calculator.menu.share"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(String(localized: "salary.share.dismiss")) {
                        isPresented = false
                    }
                }
            }
        }
        .presentationDetents([.medium, .large])
    }

    // MARK: - Sections

    private var textSection: some View {
        Section {
            ShareLink(
                item: renderer.asText(),
                subject: Text(content.title),
                message: Text(renderer.asText())
            ) {
                Label(
                    String(localized: "salary.share.asText"),
                    systemImage: "doc.plaintext"
                )
            }
            .accessibilityHint(Text("salary.share.asText.hint"))

            Button {
                UIPasteboard.general.string = renderer.asText()
                isPresented = false
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
            .accessibilityHint(Text("salary.share.asPDF.hint"))
        } header: {
            Text("salary.share.exportHeader")
        }
    }

    // MARK: - Export actions

    private func exportImage() {
        isExporting = true
        let local = renderer
        Task {
            let image = await local.asImage()
            isExporting = false
            if let image {
                Self.presentActivityController(items: [image])
            }
        }
    }

    private func exportPDF() {
        isExporting = true
        let local = renderer
        Task {
            let url = await local.asPDF()
            isExporting = false
            if let url {
                Self.presentActivityController(items: [url])
            }
        }
    }

    @MainActor
    private static func presentActivityController(items: [Any]) {
        guard let scene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let root = scene.windows.first?.rootViewController else { return }
        let controller = UIActivityViewController(
            activityItems: items,
            applicationActivities: nil
        )
        controller.popoverPresentationController?.sourceView = root.view
        root.present(controller, animated: true)
    }
}
