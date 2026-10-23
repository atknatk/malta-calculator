import SwiftUI

struct RootView: View {
    @Environment(AppSession.self) private var session
    @Environment(Router.self) private var router

    var body: some View {
        switch session.state {
        case .launching:
            ProgressView()
        case .signedOut:
            SignInView()
        case .locked:
            LockedView()
        case .ready:
            MainTabView()
        }
    }
}

private struct MainTabView: View {
    @Environment(AppSession.self) private var session
    @Environment(Router.self) private var router

    var body: some View {
        @Bindable var router = router
        TabView(selection: $router.tab) {
            HomeView()
                .tabItem { Label("Home", systemImage: "house") }
                .tag(Router.Tab.home)
            PayslipListView()
                .tabItem { Label("Payslips", systemImage: "doc.text") }
                .tag(Router.Tab.payslips)
            NotificationsView()
                .tabItem { Label("Inbox", systemImage: "bell") }
                .badge(session.unreadCount)
                .tag(Router.Tab.notifications)
            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape") }
                .tag(Router.Tab.settings)
        }
    }
}

private struct LockedView: View {
    @Environment(AppSession.self) private var session

    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "lock.fill")
                .font(.system(size: 44))
                .foregroundStyle(.tint)
            Text("Payslips locked")
                .font(.title2.weight(.semibold))
            Button("Unlock") { Task { await session.unlock() } }
                .buttonStyle(.borderedProminent)
        }
        .task { await session.unlock() }
    }
}
