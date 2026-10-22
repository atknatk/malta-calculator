import SwiftUI

struct PayslipListView: View {
    @Environment(AppSession.self) private var session
    @Environment(Router.self) private var router

    @State private var state: LoadState<[PayslipListItem]> = .loading

    var body: some View {
        @Bindable var router = router
        NavigationStack(path: $router.payslipPath) {
            Group {
                switch state {
                case .loading:
                    ProgressView()
                case let .failed(message):
                    ErrorStateView(message: message, retry: load)
                case let .loaded(items) where items.isEmpty:
                    if session.employments.isEmpty {
                        NoEmployerView()
                    } else {
                        ContentUnavailableView(
                            "No payslips yet",
                            systemImage: "doc.text",
                            description: Text("Issued payslips appear here.")
                        )
                    }
                case let .loaded(items):
                    list(items)
                }
            }
            .navigationTitle("Payslips")
            .navigationDestination(for: String.self) { id in
                PayslipDetailView(payslipId: id)
            }
            .refreshable { await load() }
            .task { await load() }
        }
    }

    private func list(_ items: [PayslipListItem]) -> some View {
        let years = Dictionary(grouping: items, by: \.periodYear)
        return List {
            ForEach(years.keys.sorted(by: >), id: \.self) { year in
                Section(String(year)) {
                    ForEach(years[year] ?? []) { item in
                        NavigationLink(value: item.id) {
                            PayslipRow(item: item)
                        }
                    }
                }
            }
        }
    }

    private func load() async {
        if case .loading = state, let cached = PayslipCache.load(),
           let items = try? JSONDecoder().decode([PayslipListItem].self, from: cached) {
            state = .loaded(items)
        }
        do {
            let items = try await session.api.payslips()
            state = .loaded(items)
            if let data = try? JSONEncoder().encode(items) { PayslipCache.save(data) }
        } catch {
            if case .loaded = state { return }
            state = .failed(error.localizedDescription)
        }
    }
}

struct PayslipRow: View {
    let item: PayslipListItem

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(item.period).font(.body.weight(.medium))
                Text(item.companyName)
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            if item.status == .void {
                Text("Withdrawn")
                    .font(.caption.weight(.semibold))
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(.red.opacity(0.12), in: Capsule())
                    .foregroundStyle(.red)
            } else {
                VStack(alignment: .trailing, spacing: 2) {
                    Text(Formatters.euro(item.netSalary))
                        .font(.body.weight(.semibold))
                        .monospacedDigit()
                    Text("net").font(.caption2).foregroundStyle(.secondary)
                }
            }
        }
        .contentShape(Rectangle())
    }
}
