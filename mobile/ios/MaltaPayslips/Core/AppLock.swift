import Foundation
import LocalAuthentication

/// Face ID / cihaz şifresi kilidi (Ayarlar'dan açılır, varsayılan açık).
final class AppLock {
    private let key = "appLockEnabled"

    var isEnabled: Bool {
        get { UserDefaults.standard.object(forKey: key) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: key) }
    }

    var isAvailable: Bool {
        LAContext().canEvaluatePolicy(.deviceOwnerAuthentication, error: nil)
    }

    func authenticate() async -> Bool {
        let context = LAContext()
        guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: nil) else {
            // Cihazda şifre yoksa kilit uygulanamaz
            return true
        }
        return (try? await context.evaluatePolicy(
            .deviceOwnerAuthentication,
            localizedReason: "Unlock your payslips"
        )) ?? false
    }
}
