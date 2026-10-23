import Foundation
import Observation

/// Sekme seçimi ve bildirimden açılan bordro.
@MainActor
@Observable
final class Router {
    enum Tab: Hashable {
        case home, payslips, notifications, settings
    }

    var tab: Tab = .home
    var payslipPath: [String] = []

    func open(payslipId: String) {
        tab = .payslips
        payslipPath = [payslipId]
    }
}
