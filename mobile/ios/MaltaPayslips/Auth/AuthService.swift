import Clerk
import Foundation

/// Clerk e-posta kodu ile şifresiz giriş. Clerk SDK'sına dokunan tek yer;
/// SDK sürümü değişirse yalnızca bu dosya güncellenir.
@MainActor
final class AuthService {
    enum Step {
        case signIn(SignIn)
        case signUp(SignUp)
    }

    private let clerk = Clerk.shared

    func configure() async {
        clerk.configure(publishableKey: AppConfig.clerkPublishableKey)
        try? await clerk.load()
    }

    var isSignedIn: Bool { clerk.user != nil }

    /// E-postaya kod gönderir. Hesap yoksa kayıt akışı başlar; çalışanın
    /// davet edildiği e-posta ile giriş yapması yeterlidir.
    func sendCode(to email: String) async throws -> Step {
        do {
            let signIn = try await SignIn.create(
                strategy: .identifier(email, strategy: .emailCode())
            )
            return .signIn(signIn)
        } catch let error as ClerkAPIError where error.code == "form_identifier_not_found" {
            let signUp = try await SignUp.create(strategy: .standard(emailAddress: email))
            try await signUp.prepareVerification(strategy: .emailCode)
            return .signUp(signUp)
        }
    }

    func verify(code: String, step: Step) async throws {
        switch step {
        case let .signIn(signIn):
            try await signIn.attemptFirstFactor(strategy: .emailCode(code: code))
        case let .signUp(signUp):
            try await signUp.attemptVerification(strategy: .emailCode(code: code))
        }
    }

    /// API istekleri için kısa ömürlü session JWT'si
    func sessionToken() async throws -> String? {
        try await clerk.session?.getToken()?.jwt
    }

    func signOut() async {
        try? await clerk.signOut()
    }
}
