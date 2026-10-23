import Foundation

/// Son bordro listesi, çevrimdışı açılış için cihazda saklanır.
/// Dosya tam koruma ile yazılır (cihaz kilitliyken okunamaz), çıkışta silinir.
enum PayslipCache {
    private static var url: URL {
        FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("payslips.json")
    }

    static func save(_ data: Data) {
        try? FileManager.default.createDirectory(
            at: url.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )
        try? data.write(to: url, options: [.atomic, .completeFileProtection])
    }

    static func load() -> Data? {
        try? Data(contentsOf: url)
    }

    static func clear() {
        try? FileManager.default.removeItem(at: url)
    }
}
