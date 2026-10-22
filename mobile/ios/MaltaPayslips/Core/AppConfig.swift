import Foundation

/// Info.plist'e xcconfig'ten gelen ayarlar (bkz. Config/Shared.xcconfig).
enum AppConfig {
    static var apiBaseURL: URL {
        guard
            let value = Bundle.main.object(forInfoDictionaryKey: "APIBaseURL") as? String,
            let url = URL(string: value)
        else {
            fatalError("APIBaseURL is missing from Info.plist")
        }
        return url
    }

    static var clerkPublishableKey: String {
        (Bundle.main.object(forInfoDictionaryKey: "ClerkPublishableKey") as? String) ?? ""
    }
}
