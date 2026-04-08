import Foundation

/// Calendar months used for payroll and COLA scheduling.
public enum Month: String, CaseIterable, Codable, Sendable, Hashable {
    case january, february, march, april, may, june
    case july, august, september, october, november, december

    /// Zero-based index (January = 0, December = 11).
    public var index: Int {
        Month.allCases.firstIndex(of: self) ?? 0
    }

    /// Three-letter abbreviation.
    public var shortName: String {
        switch self {
        case .january: "Jan"
        case .february: "Feb"
        case .march: "Mar"
        case .april: "Apr"
        case .may: "May"
        case .june: "Jun"
        case .july: "Jul"
        case .august: "Aug"
        case .september: "Sep"
        case .october: "Oct"
        case .november: "Nov"
        case .december: "Dec"
        }
    }

    /// Whether this month is a COLA (Government Bonus) payment month.
    public var isCOLAMonth: Bool {
        switch self {
        case .march, .june, .september, .december: true
        default: false
        }
    }
}
