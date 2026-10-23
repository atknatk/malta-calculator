import SwiftUI

struct NotificationsView: View {
    @Environment(AppSession.self) private var session
    @Environment(Router.self) private var router

    @State private var state: LoadState<[AppNotification]> = .loading

    var body: some View {
        NavigationStack {
            Group {
                switch state {
                case .loading:
                    ProgressView()
                case let .failed(message):
                    ErrorStateView(message: message, retry: load)
                case let .loaded(items) where items.isEmpty:
                    ContentUnavailableView(
                        "No notifications",
                        systemImage: "bell",
                        description: Text("You'll be notified when a new payslip is issued.")
                    )
                case let .loaded(items):
                    List(items) { item in
                        Button {
                            open(item)
                        } label: {
                            NotificationRow(item: item)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .navigationTitle("Inbox")
            .toolbar {
                if session.unreadCount > 0 {
                    Button("Mark all read") {
                        Task {
                            try? await session.api.markNotificationsRead()
                            await load()
                        }
                    }
                }
            }
            .refreshable { await load() }
            .task { await load() }
        }
    }

    private func load() async {
        do {
            let response = try await session.api.notifications()
            session.unreadCount = response.unreadCount
            state = .loaded(response.notifications)
        } catch {
            state = .failed(error.localizedDescription)
        }
    }

    private func open(_ item: AppNotification) {
        Task {
            if item.isUnread {
                try? await session.api.markNotificationsRead(ids: [item.id])
                await load()
            }
        }
        if let payslipId = item.payslipId {
            router.open(payslipId: payslipId)
        }
    }
}

private struct NotificationRow: View {
    let item: AppNotification

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Circle()
                .fill(item.isUnread ? Color.accentColor : .clear)
                .frame(width: 8, height: 8)
                .padding(.top, 6)
            VStack(alignment: .leading, spacing: 4) {
                Text(item.title).font(.body.weight(item.isUnread ? .semibold : .regular))
                Text(item.body).font(.footnote).foregroundStyle(.secondary)
                Text(Formatters.relative(item.createdAt))
                    .font(.caption2)
                    .foregroundStyle(.tertiary)
            }
        }
        .contentShape(Rectangle())
    }
}
