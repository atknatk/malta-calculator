import SwiftUI

@main
struct MaltaPayslipsApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) private var appDelegate
    @State private var session = AppSession()
    @State private var router = Router()
    @Environment(\.scenePhase) private var scenePhase

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(session)
                .environment(router)
                .task {
                    PushRegistrar.shared.onToken = { token in
                        Task { await session.registerPush(token: token) }
                    }
                    PushRegistrar.shared.onOpenPayslip = { id in
                        router.open(payslipId: id)
                    }
                    await session.start()
                    if session.state != .signedOut {
                        PushRegistrar.shared.requestAuthorization()
                    }
                }
                .onChange(of: scenePhase) { _, phase in
                    if phase == .background { session.appDidEnterBackground() }
                }
        }
    }
}
