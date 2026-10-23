import Foundation

enum Formatters {
    private static let currency: NumberFormatter = {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        formatter.locale = Locale(identifier: "en_MT")
        return formatter
    }()

    private static let isoDate: ISO8601DateFormatter = {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return formatter
    }()

    private static let isoDateNoFraction = ISO8601DateFormatter()

    static func euro(_ amount: Double) -> String {
        currency.string(from: NSNumber(value: amount)) ?? String(format: "€%.2f", amount)
    }

    static func period(month: Int, year: Int) -> String {
        // Arayüz İngilizce; cihaz dilinden bağımsız ay adları
        var calendar = Calendar(identifier: .gregorian)
        calendar.locale = Locale(identifier: "en_US_POSIX")
        let symbols = calendar.monthSymbols
        let name = (1...12).contains(month) ? symbols[month - 1] : "\(month)"
        return "\(name) \(year)"
    }

    static func date(fromISO value: String?) -> Date? {
        guard let value else { return nil }
        return isoDate.date(from: value) ?? isoDateNoFraction.date(from: value)
    }

    static func relative(_ value: String?) -> String {
        guard let date = date(fromISO: value) else { return "" }
        return date.formatted(.relative(presentation: .named))
    }
}
