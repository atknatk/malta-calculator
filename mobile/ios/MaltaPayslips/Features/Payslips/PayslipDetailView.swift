import SwiftUI

struct PayslipDetailView: View {
    let payslipId: String

    @Environment(AppSession.self) private var session
    @State private var state: LoadState<PayslipDetailResponse> = .loading
    @State private var pdfURL: URL?

    var body: some View {
        Group {
            switch state {
            case .loading:
                ProgressView()
            case let .failed(message):
                ErrorStateView(message: message, retry: load)
            case let .loaded(detail):
                ScrollView {
                    VStack(spacing: 16) {
                        if detail.payslip.status == .void {
                            VoidBanner(reason: detail.payslip.voidReason)
                        }
                        PayslipDocumentView(document: detail.document)
                            .padding()
                            .background(.background, in: RoundedRectangle(cornerRadius: 16))
                        IntegrityFooter(meta: detail.payslip)
                    }
                    .padding()
                }
                .background(Color(.systemGroupedBackground))
                .toolbar {
                    if let pdfURL {
                        ShareLink(item: pdfURL) {
                            Label("Share PDF", systemImage: "square.and.arrow.up")
                        }
                    }
                }
            }
        }
        .navigationTitle(title)
        .navigationBarTitleDisplayMode(.inline)
        .task { await load() }
    }

    private var title: String {
        if case let .loaded(detail) = state {
            return Formatters.period(month: detail.document.periodMonth, year: detail.document.periodYear)
        }
        return "Payslip"
    }

    private func load() async {
        do {
            let detail = try await session.api.payslip(id: payslipId)
            state = .loaded(detail)
            pdfURL = PayslipPDF.render(detail)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}

private struct VoidBanner: View {
    let reason: String?

    var body: some View {
        Label {
            VStack(alignment: .leading, spacing: 2) {
                Text("This payslip was withdrawn").font(.subheadline.weight(.semibold))
                if let reason { Text(reason).font(.footnote) }
            }
        } icon: {
            Image(systemName: "exclamationmark.octagon.fill")
        }
        .foregroundStyle(.red)
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(.red.opacity(0.1), in: RoundedRectangle(cornerRadius: 12))
    }
}

private struct IntegrityFooter: View {
    let meta: PayslipDetailResponse.Meta

    var body: some View {
        switch meta.integrity {
        case .verified:
            Label {
                Text("Verified document").font(.footnote.weight(.medium))
                    + Text(meta.fingerprint.map { "\n\($0)" } ?? "")
                    .font(.caption.monospaced())
            } icon: {
                Image(systemName: "checkmark.seal.fill").foregroundStyle(.green)
            }
            .foregroundStyle(.secondary)
        case .mismatch:
            Label("This document failed its integrity check. Contact your employer.", systemImage: "xmark.seal.fill")
                .font(.footnote)
                .foregroundStyle(.red)
        case .legacy, .draft:
            EmptyView()
        }
    }
}

/// Bordro belgesi: ekranda ve PDF'te aynı görünüm.
struct PayslipDocumentView: View {
    let document: PayslipDocument

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(document.company.name).font(.headline)
                    if let address = document.company.address {
                        Text(address).font(.caption).foregroundStyle(.secondary)
                    }
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text("PAYSLIP").font(.caption.weight(.bold)).foregroundStyle(.tint)
                    Text(document.payslipNumber).font(.caption.monospaced())
                }
            }

            Divider()

            VStack(alignment: .leading, spacing: 4) {
                Text(document.employee.name).font(.subheadline.weight(.semibold))
                detail("Position", document.employee.position)
                detail("Employee no.", document.employee.employee_code)
                detail("ID card", document.employee.id_number)
                detail("SSC no.", document.employee.ss_number)
                detail("Period", Formatters.period(month: document.periodMonth, year: document.periodYear))
                detail("Pay date", document.payDate)
            }

            section("Earnings") {
                if let earnings = document.earnings {
                    amount("Basic salary", earnings.basicSalary)
                    optionalAmount("COLA", earnings.cola)
                    optionalAmount("Overtime", earnings.overtime)
                    optionalAmount("Bonus", earnings.bonus)
                    optionalAmount("Allowance", earnings.allowance)
                    optionalAmount("Leave pay", earnings.leavePay)
                    optionalAmount("Fringe benefits", earnings.fringeBenefits)
                }
                amount("Gross pay", document.grossSalary, bold: true)
            }

            section("Deductions") {
                amount("Income tax (FSS)", document.incomeTax)
                amount(sscLabel, document.sscEmployee)
            }

            HStack {
                Text("Net pay").font(.headline)
                Spacer()
                Text(Formatters.euro(document.netSalary))
                    .font(.title3.weight(.bold))
                    .monospacedDigit()
            }
            .padding(12)
            .background(Color.accentColor.opacity(0.1), in: RoundedRectangle(cornerRadius: 10))

            section("Year to date") {
                amount("Gross", document.ytdTotals.grossTotal)
                amount("Tax", document.ytdTotals.taxTotal)
                amount("SSC", document.ytdTotals.sscTotal)
                amount("Net", document.ytdTotals.netTotal)
            }

            if let leave = document.leave {
                section("Leave (hours)") {
                    row("Entitlement", String(format: "%.2f", leave.entitledHours))
                    row("Taken this period", String(format: "%.2f", leave.takenThisPeriod))
                    row("Taken to date", String(format: "%.2f", leave.takenToDate))
                }
            }

            if let notes = document.notes, !notes.isEmpty {
                section("Notes") {
                    Text(notes).font(.footnote)
                }
            }
        }
    }

    private var sscLabel: String {
        var label = "Social security"
        if let weeks = document.sscWeeks { label += " (\(weeks) wks)" }
        if let category = document.salaryConfig?.sscCategory { label += " · Cat. \(category)" }
        return label
    }

    @ViewBuilder
    private func detail(_ title: String, _ value: String?) -> some View {
        if let value, !value.isEmpty {
            row(title, value)
        }
    }

    private func row(_ title: String, _ value: String) -> some View {
        HStack {
            Text(title).foregroundStyle(.secondary)
            Spacer()
            Text(value)
        }
        .font(.footnote)
    }

    private func amount(_ title: String, _ value: Double, bold: Bool = false) -> some View {
        HStack {
            Text(title)
            Spacer()
            Text(Formatters.euro(value)).monospacedDigit()
        }
        .font(.footnote.weight(bold ? .semibold : .regular))
    }

    @ViewBuilder
    private func optionalAmount(_ title: String, _ value: Double?) -> some View {
        if let value, value != 0 {
            amount(title, value)
        }
    }

    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title.uppercased())
                .font(.caption2.weight(.bold))
                .foregroundStyle(.tint)
            content()
        }
    }
}

/// Bordroyu cihazda A4 PDF'e çevirir (sunucu PDF üretmez).
enum PayslipPDF {
    @MainActor
    static func render(_ detail: PayslipDetailResponse) -> URL? {
        let pageWidth: CGFloat = 595 // A4, 72 dpi
        let content = PayslipDocumentView(document: detail.document)
            .padding(36)
            .frame(width: pageWidth)
            .background(.white)
            .environment(\.colorScheme, .light)

        let renderer = ImageRenderer(content: content)
        let name = detail.status == .void ? "VOID-Payslip" : "Payslip"
        let url = FileManager.default.temporaryDirectory
            .appendingPathComponent("\(name)-\(detail.document.payslipNumber).pdf")

        var rendered = false
        renderer.render { size, draw in
            var box = CGRect(origin: .zero, size: CGSize(width: pageWidth, height: max(size.height, 842)))
            guard let context = CGContext(url as CFURL, mediaBox: &box, nil) else { return }
            context.beginPDFPage(nil)
            draw(context)
            context.endPDFPage()
            context.closePDF()
            rendered = true
        }
        return rendered ? url : nil
    }
}

private extension PayslipDetailResponse {
    var status: PayslipStatus { payslip.status }
}
