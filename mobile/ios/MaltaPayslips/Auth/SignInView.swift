import SwiftUI

struct SignInView: View {
    @Environment(AppSession.self) private var session

    @State private var email = ""
    @State private var code = ""
    @State private var step: AuthService.Step?
    @State private var isWorking = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Image(systemName: "doc.text.fill")
                            .font(.system(size: 40))
                            .foregroundStyle(.tint)
                        Text("Your payslips, in one place")
                            .font(.title2.weight(.semibold))
                        Text("Sign in with the email address your employer invited.")
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 8)
                }
                .listRowBackground(Color.clear)

                if step == nil {
                    Section("Email") {
                        TextField("you@example.com", text: $email)
                            .keyboardType(.emailAddress)
                            .textContentType(.emailAddress)
                            .textInputAutocapitalization(.never)
                            .autocorrectionDisabled()
                    }
                    Section {
                        Button(action: sendCode) {
                            label("Send code")
                        }
                        .disabled(!isValidEmail || isWorking)
                    }
                } else {
                    Section {
                        TextField("6-digit code", text: $code)
                            .keyboardType(.numberPad)
                            .textContentType(.oneTimeCode)
                    } header: {
                        Text("Code")
                    } footer: {
                        Text("We sent a code to \(email).")
                    }
                    Section {
                        Button(action: verify) {
                            label("Sign in")
                        }
                        .disabled(code.count < 6 || isWorking)
                        Button("Use a different email") {
                            step = nil
                            code = ""
                        }
                    }
                }

                if let errorMessage {
                    Section {
                        Text(errorMessage).foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle("Sign in")
        }
    }

    private var isValidEmail: Bool {
        email.contains("@") && email.contains(".")
    }

    private func label(_ title: String) -> some View {
        HStack {
            Text(title)
            if isWorking {
                Spacer()
                ProgressView()
            }
        }
    }

    private func sendCode() {
        run {
            step = try await session.auth.sendCode(
                to: email.trimmingCharacters(in: .whitespaces).lowercased()
            )
        }
    }

    private func verify() {
        guard let step else { return }
        run {
            try await session.auth.verify(code: code, step: step)
            await session.didSignIn()
        }
    }

    private func run(_ work: @escaping () async throws -> Void) {
        isWorking = true
        errorMessage = nil
        Task {
            do {
                try await work()
            } catch {
                errorMessage = error.localizedDescription
            }
            isWorking = false
        }
    }
}
