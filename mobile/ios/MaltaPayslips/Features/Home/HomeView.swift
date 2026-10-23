import SwiftUI

struct HomeView: View {
    @Environment(AppSession.self) private var session
    @Environment(Router.self) private var router

    @State private var summary: LoadState<SummaryResponse> = .loading
    @State private var latest: PayslipListItem?
    private let year = Calendar.current.component(.year, from: .now)

    var body: some View {
        NavigationStack {
            Group {
                if session.employments.isEmpty {
                    NoEmployerView()
                } else {
                    content
                }
            }
            .navigationTitle("Home")
            .refreshable { await load() }
            .task { await load() }
        }
    }

    @ViewBuilder
    private var content: some View {
        List {
            if let latest {
                Section("Latest payslip") {
                    Button {
                        router.open(payslipId: latest.id)
                    } label: {
                        PayslipRow(item: latest)
                    }
                    .buttonStyle(.plain)
                }
            }

            switch summary {
            case .loading:
                Section { ProgressView() }
            case let .failed(message):
                Section { Text(message).foregroundStyle(.secondary) }
            case let .loaded(response):
                ForEach(response.employers) { employer in
                    Section("\(employer.companyName) · \(String(response.year))") {
                        TotalRow(title: "Gross pay", amount: employer.grossTotal)
                        TotalRow(title: "Income tax", amount: employer.taxTotal)
                        TotalRow(title: "Social security", amount: employer.sscTotal)
                        TotalRow(title: "Net pay", amount: employer.netTotal, emphasized: true)
                        Text("\(employer.payslipCount) payslip\(employer.payslipCount == 1 ? "" : "s") this year")
                            .font(.footnote)
                            .foregroundStyle(.secondary)
                    }
                }
            }
        }
    }

    private func load() async {
        await session.refreshProfile()
        async let summaryResult = session.api.summary(year: year)
        async let listResult = session.api.payslips()
        do {
            summary = .loaded(try await summaryResult)
        } catch {
            summary = .failed(error.localizedDescription)
        }
        latest = (try? await listResult)?.first { $0.status == .final }
    }
}

private struct TotalRow: View {
    let title: String
    let amount: Double
    var emphasized = false

    var body: some View {
        LabeledContent(title) {
            Text(Formatters.euro(amount))
                .monospacedDigit()
                .fontWeight(emphasized ? .semibold : .regular)
                .foregroundStyle(emphasized ? .primary : .secondary)
        }
    }
}

struct NoEmployerView: View {
    @Environment(AppSession.self) private var session

    var body: some View {
        ContentUnavailableView {
            Label("No employer linked yet", systemImage: "building.2")
        } description: {
            Text("Ask your employer to invite \(session.email ?? "your email address") from Malta Calculator. Your payslips appear here once they do.")
        } actions: {
            Button("Check again") { Task { await session.refreshProfile() } }
        }
    }
}
