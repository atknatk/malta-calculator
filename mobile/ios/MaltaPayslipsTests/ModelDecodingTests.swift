import XCTest
@testable import MaltaPayslips

/// API yanıtlarının docs/api/mobile-v1.yaml ile uyumunu doğrular.
final class ModelDecodingTests: XCTestCase {
    private let decoder = JSONDecoder()

    func testPayslipListDecodes() throws {
        let json = """
        {"payslips":[{"id":"a1","employeeId":"e1","companyId":"c1","companyName":"Acme Ltd",
        "payslipNumber":"ACM-2026-10-A1B2","periodMonth":10,"periodYear":2026,
        "grossSalary":2500.5,"netSalary":2000,"incomeTax":250,"sscEmployee":250.5,
        "status":"void","issuedAt":"2026-10-31T10:00:00.000Z","voidedAt":"2026-11-01T09:00:00Z",
        "voidReason":"Wrong hours","replacesPayslipId":null,"replacedByPayslipId":"b2"}]}
        """
        let response = try decoder.decode(PayslipListResponse.self, from: Data(json.utf8))
        let item = try XCTUnwrap(response.payslips.first)
        XCTAssertEqual(item.status, .void)
        XCTAssertEqual(item.replacedByPayslipId, "b2")
        XCTAssertEqual(item.period, "October 2026")
    }

    func testPayslipDetailDecodesSnapshotDocument() throws {
        let json = """
        {"payslip":{"id":"a1","employeeId":"e1","companyId":"c1","status":"final",
        "issuedAt":"2026-10-31T10:00:00.000Z","voidedAt":null,"voidReason":null,
        "integrity":"verified","fingerprint":"3F2A 9C1E 5B7D 4E8A"},
        "document":{"company":{"name":"Acme Ltd","address":null,"tax_number":null,"logo_url":null,"plan":"pro"},
        "employee":{"name":"Maria Borg","position":"Analyst","employee_code":"E01","email":null},
        "periodMonth":10,"periodYear":2026,"grossSalary":2500,"netSalary":2000,"incomeTax":250,
        "sscEmployee":250,"createdAt":"2026-10-31","payslipNumber":"ACM-2026-10-A1B2",
        "ytdTotals":{"grossTotal":25000,"taxTotal":2500,"sscTotal":2500,"netTotal":20000},
        "earnings":{"basicSalary":2378.84,"cola":121.16},"sscWeeks":5,
        "salaryConfig":{"taxType":"single","sscCategory":"C"},"unknownField":true}}
        """
        let detail = try decoder.decode(PayslipDetailResponse.self, from: Data(json.utf8))
        XCTAssertEqual(detail.payslip.integrity, .verified)
        XCTAssertEqual(detail.document.earnings?.cola, 121.16)
        XCTAssertEqual(detail.document.sscWeeks, 5)
    }

    func testNotificationToleratesNonStringData() throws {
        let json = """
        {"unreadCount":1,"notifications":[{"id":"n1","type":"payslip_issued","title":"New payslip",
        "body":"Ready","data":{"payslipId":"a1","count":3},"readAt":null,"createdAt":"2026-10-31T10:00:00Z"}]}
        """
        let response = try decoder.decode(NotificationsResponse.self, from: Data(json.utf8))
        XCTAssertEqual(response.unreadCount, 1)
        XCTAssertTrue(response.notifications[0].isUnread)
    }
}
