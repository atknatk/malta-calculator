import Foundation

// docs/api/mobile-v1.yaml ile birebir. Alan adları API'deki camelCase.

struct MeResponse: Decodable {
    struct User: Decodable {
        let id: String
        let emails: [String]
    }

    let user: User
    let employments: [Employment]
}

struct Employment: Decodable, Identifiable, Hashable {
    let employeeId: String
    let companyId: String
    let companyName: String
    let companyLogoUrl: String?
    let employeeName: String
    let position: String?
    let employeeCode: String?
    let linkedAt: String

    var id: String { employeeId }
}

enum PayslipStatus: String, Codable {
    case final
    case void
}

struct PayslipListItem: Codable, Identifiable, Hashable {
    let id: String
    let employeeId: String
    let companyId: String
    let companyName: String
    let payslipNumber: String
    let periodMonth: Int
    let periodYear: Int
    let grossSalary: Double
    let netSalary: Double
    let incomeTax: Double
    let sscEmployee: Double
    let status: PayslipStatus
    let issuedAt: String?
    let voidedAt: String?
    let voidReason: String?
    let replacesPayslipId: String?
    let replacedByPayslipId: String?

    var period: String { Formatters.period(month: periodMonth, year: periodYear) }
}

struct PayslipListResponse: Decodable {
    let payslips: [PayslipListItem]
}

enum PayslipIntegrity: String, Decodable {
    case verified
    case mismatch
    case legacy
    case draft
}

struct PayslipDetailResponse: Decodable {
    struct Meta: Decodable {
        let id: String
        let employeeId: String
        let companyId: String
        let status: PayslipStatus
        let issuedAt: String?
        let voidedAt: String?
        let voidReason: String?
        let integrity: PayslipIntegrity
        let fingerprint: String?
    }

    let payslip: Meta
    let document: PayslipDocument
}

/// Web'deki PayslipDocumentProps'un uygulamada gösterilen kısmı.
struct PayslipDocument: Decodable {
    struct Company: Decodable {
        let name: String
        let address: String?
        let tax_number: String?
        let logo_url: String?
    }

    struct Employee: Decodable {
        let name: String
        let position: String?
        let employee_code: String?
        let id_number: String?
        let ss_number: String?
        let department: String?
    }

    struct Totals: Decodable {
        let grossTotal: Double
        let taxTotal: Double
        let sscTotal: Double
        let netTotal: Double
    }

    struct Earnings: Decodable {
        let basicSalary: Double
        let cola: Double?
        let bonus: Double?
        let allowance: Double?
        let overtime: Double?
        let leavePay: Double?
        let fringeBenefits: Double?
    }

    struct SalaryConfig: Decodable {
        let taxType: String?
        let sscCategory: String?
    }

    struct Leave: Decodable {
        let entitledHours: Double
        let takenThisPeriod: Double
        let takenToDate: Double
    }

    let company: Company
    let employee: Employee
    let periodMonth: Int
    let periodYear: Int
    let grossSalary: Double
    let netSalary: Double
    let incomeTax: Double
    let sscEmployee: Double
    let payslipNumber: String
    let ytdTotals: Totals
    let salaryConfig: SalaryConfig?
    let earnings: Earnings?
    let sscWeeks: Int?
    let payDate: String?
    let leave: Leave?
    let notes: String?
}

struct YearSummary: Decodable, Identifiable {
    let employeeId: String
    let companyId: String
    let companyName: String
    let year: Int
    let payslipCount: Int
    let grossTotal: Double
    let netTotal: Double
    let taxTotal: Double
    let sscTotal: Double

    var id: String { employeeId }
}

struct SummaryResponse: Decodable {
    let year: Int
    let employers: [YearSummary]
}

struct AppNotification: Decodable, Identifiable {
    let id: String
    let type: String
    let title: String
    let body: String
    let data: [String: String]?
    let readAt: String?
    let createdAt: String

    var payslipId: String? { data?["payslipId"] }
    var isUnread: Bool { readAt == nil }

    private enum CodingKeys: String, CodingKey {
        case id, type, title, body, data, readAt, createdAt
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(String.self, forKey: .id)
        type = try container.decode(String.self, forKey: .type)
        title = try container.decode(String.self, forKey: .title)
        body = try container.decode(String.self, forKey: .body)
        // data serbest jsonb; yalnızca string alanlar kullanılır
        data = try? container.decode([String: String].self, forKey: .data)
        readAt = try container.decodeIfPresent(String.self, forKey: .readAt)
        createdAt = try container.decode(String.self, forKey: .createdAt)
    }
}

struct NotificationsResponse: Decodable {
    let unreadCount: Int
    let notifications: [AppNotification]
}

struct APIErrorBody: Decodable {
    struct Detail: Decodable {
        let code: String
        let message: String
    }

    let error: Detail
}
