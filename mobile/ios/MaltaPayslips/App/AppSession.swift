import Foundation
import Observation

/// Uygulamanın oturum durumu: giriş, Face ID kilidi, işveren kayıtları.
@MainActor
@Observable
final class AppSession {
    enum State {
        case launching
        case signedOut
        case locked
        case ready
    }

    private(set) var state: State = .launching
    private(set) var employments: [Employment] = []
    private(set) var email: String?
    var unreadCount = 0

    let auth = AuthService()
    @ObservationIgnored lazy var api = APIClient { [weak self] in
        try await self?.auth.sessionToken()
    }

    @ObservationIgnored let lock = AppLock()
    @ObservationIgnored private var pushToken: String?

    func start() async {
        await auth.configure()
        if auth.isSignedIn {
            state = lock.isEnabled ? .locked : .ready
            await refreshProfile()
        } else {
            state = .signedOut
        }
    }

    func didSignIn() async {
        state = .ready
        await refreshProfile()
        PushRegistrar.shared.requestAuthorization()
    }

    /// Bekleyen davetler bu çağrıda hesaba bağlanır
    func refreshProfile() async {
        do {
            let me = try await api.me()
            employments = me.employments
            email = me.user.emails.first
            if let pushToken { await registerPush(token: pushToken) }
        } catch APIError.unauthorized {
            await signOut()
        } catch {
            // Ağ hatası: ekranlar kendi hatalarını gösterir
        }
    }

    func unlock() async {
        if await lock.authenticate() { state = .ready }
    }

    func appDidEnterBackground() {
        if state == .ready, lock.isEnabled { state = .locked }
    }

    func registerPush(token: String) async {
        pushToken = token
        guard state != .signedOut, state != .launching else { return }
        let version = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String
        try? await api.registerDevice(fcmToken: token, appVersion: version)
    }

    func signOut() async {
        if let pushToken { try? await api.unregisterDevice(fcmToken: pushToken) }
        await auth.signOut()
        reset()
    }

    func deleteAccount() async throws {
        try await api.deleteAccount()
        await auth.signOut()
        reset()
    }

    private func reset() {
        employments = []
        email = nil
        unreadCount = 0
        PayslipCache.clear()
        state = .signedOut
    }
}
