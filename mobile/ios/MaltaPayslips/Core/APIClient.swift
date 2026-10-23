import Foundation

enum APIError: LocalizedError {
    case unauthorized
    case notFound
    case server(String)
    case network(Error)

    var errorDescription: String? {
        switch self {
        case .unauthorized: "Your session has expired. Please sign in again."
        case .notFound: "This item could not be found."
        case let .server(message): message
        case .network: "Check your internet connection and try again."
        }
    }
}

/// /api/mobile/v1 istemcisi. Her istek Clerk session token'ı ile gider.
final class APIClient {
    typealias TokenProvider = () async throws -> String?

    private let baseURL: URL
    private let session: URLSession
    private let tokenProvider: TokenProvider
    private let decoder = JSONDecoder()

    init(
        baseURL: URL = AppConfig.apiBaseURL,
        session: URLSession = .shared,
        tokenProvider: @escaping TokenProvider
    ) {
        self.baseURL = baseURL
        self.session = session
        self.tokenProvider = tokenProvider
    }

    func me() async throws -> MeResponse {
        try await request("me")
    }

    func deleteAccount() async throws {
        let _: EmptyResponse = try await request("me", method: "DELETE")
    }

    func payslips(year: Int? = nil, employeeId: String? = nil) async throws -> [PayslipListItem] {
        var query: [URLQueryItem] = []
        if let year { query.append(URLQueryItem(name: "year", value: String(year))) }
        if let employeeId { query.append(URLQueryItem(name: "employeeId", value: employeeId)) }
        let response: PayslipListResponse = try await request("payslips", query: query)
        return response.payslips
    }

    func payslip(id: String) async throws -> PayslipDetailResponse {
        try await request("payslips/\(id)")
    }

    func summary(year: Int) async throws -> SummaryResponse {
        try await request("summary", query: [URLQueryItem(name: "year", value: String(year))])
    }

    func notifications() async throws -> NotificationsResponse {
        try await request("notifications")
    }

    func markNotificationsRead(ids: [String]? = nil) async throws {
        let body: [String: Any] = ids.map { ["ids": $0] } ?? ["all": true]
        let _: EmptyResponse = try await request("notifications/read", method: "POST", body: body)
    }

    func registerDevice(fcmToken: String, appVersion: String?) async throws {
        var body: [String: Any] = ["fcmToken": fcmToken, "platform": "ios"]
        if let appVersion { body["appVersion"] = appVersion }
        let _: EmptyResponse = try await request("devices", method: "POST", body: body)
    }

    func unregisterDevice(fcmToken: String) async throws {
        let _: EmptyResponse = try await request("devices", method: "DELETE", body: ["fcmToken": fcmToken])
    }

    // MARK: - Private

    private struct EmptyResponse: Decodable {}

    private func request<T: Decodable>(
        _ path: String,
        method: String = "GET",
        query: [URLQueryItem] = [],
        body: [String: Any]? = nil
    ) async throws -> T {
        var components = URLComponents(
            url: baseURL.appendingPathComponent(path),
            resolvingAgainstBaseURL: false
        )!
        if !query.isEmpty { components.queryItems = query }

        var request = URLRequest(url: components.url!)
        request.httpMethod = method
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        if let token = try await tokenProvider() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        if let body {
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        }

        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await session.data(for: request)
        } catch {
            throw APIError.network(error)
        }

        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        switch status {
        case 200..<300:
            return try decoder.decode(T.self, from: data)
        case 401:
            throw APIError.unauthorized
        case 404:
            throw APIError.notFound
        default:
            let message = (try? decoder.decode(APIErrorBody.self, from: data))?.error.message
            throw APIError.server(message ?? "Something went wrong (\(status)).")
        }
    }
}
