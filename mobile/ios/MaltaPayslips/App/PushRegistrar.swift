import FirebaseCore
import FirebaseMessaging
import UIKit
import UserNotifications

/// FCM kaydı ve bildirime dokununca açılacak bordro.
/// GoogleService-Info.plist yoksa push sessizce devre dışı kalır.
@MainActor
final class PushRegistrar: NSObject {
    static let shared = PushRegistrar()

    var onToken: ((String) -> Void)?
    var onOpenPayslip: ((String) -> Void)?

    private(set) var isConfigured = false

    func configure() {
        guard Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") != nil else {
            return
        }
        FirebaseApp.configure()
        Messaging.messaging().delegate = self
        UNUserNotificationCenter.current().delegate = self
        isConfigured = true
    }

    func requestAuthorization() {
        guard isConfigured else { return }
        Task {
            let granted = (try? await UNUserNotificationCenter.current()
                .requestAuthorization(options: [.alert, .badge, .sound])) ?? false
            if granted { UIApplication.shared.registerForRemoteNotifications() }
        }
    }

    func setAPNSToken(_ token: Data) {
        guard isConfigured else { return }
        Messaging.messaging().apnsToken = token
    }
}

extension PushRegistrar: MessagingDelegate {
    nonisolated func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
        guard let fcmToken else { return }
        Task { @MainActor in self.onToken?(fcmToken) }
    }
}

extension PushRegistrar: UNUserNotificationCenterDelegate {
    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        willPresent notification: UNNotification
    ) async -> UNNotificationPresentationOptions {
        [.banner, .sound, .list]
    }

    nonisolated func userNotificationCenter(
        _ center: UNUserNotificationCenter,
        didReceive response: UNNotificationResponse
    ) async {
        let payslipId = response.notification.request.content.userInfo["payslipId"] as? String
        guard let payslipId else { return }
        await MainActor.run { self.onOpenPayslip?(payslipId) }
    }
}

final class AppDelegate: NSObject, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
    ) -> Bool {
        PushRegistrar.shared.configure()
        return true
    }

    func application(
        _ application: UIApplication,
        didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
    ) {
        PushRegistrar.shared.setAPNSToken(deviceToken)
    }
}
