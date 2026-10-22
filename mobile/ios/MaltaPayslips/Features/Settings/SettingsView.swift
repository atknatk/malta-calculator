import SwiftUI

struct SettingsView: View {
    @Environment(AppSession.self) private var session

    @State private var lockEnabled = true
    @State private var confirmDelete = false
    @State private var errorMessage: String?

    var body: some View {
        NavigationStack {
            Form {
                Section("Account") {
                    LabeledContent("Email", value: session.email ?? "—")
                }

                Section("Employers") {
                    if session.employments.isEmpty {
                        Text("No employer linked yet").foregroundStyle(.secondary)
                    }
                    ForEach(session.employments) { employment in
                        VStack(alignment: .leading, spacing: 2) {
                            Text(employment.companyName)
                            Text([employment.position, employment.employeeCode]
                                .compactMap { $0 }
                                .joined(separator: " · "))
                                .font(.footnote)
                                .foregroundStyle(.secondary)
                        }
                    }
                }

                Section {
                    Toggle("Require Face ID", isOn: $lockEnabled)
                        .disabled(!session.lock.isAvailable)
                        .onChange(of: lockEnabled) { _, value in
                            session.lock.isEnabled = value
                        }
                } footer: {
                    Text("Locks the app when you leave it.")
                }

                Section {
                    Button("Sign out") { Task { await session.signOut() } }
                    Button("Delete account", role: .destructive) { confirmDelete = true }
                } footer: {
                    Text("Deleting your account removes your login from this app. Your employer keeps your payslips as payroll records.")
                }

                if let errorMessage {
                    Section { Text(errorMessage).foregroundStyle(.red) }
                }
            }
            .navigationTitle("Settings")
            .onAppear { lockEnabled = session.lock.isEnabled }
            .confirmationDialog(
                "Delete your account?",
                isPresented: $confirmDelete,
                titleVisibility: .visible
            ) {
                Button("Delete account", role: .destructive) {
                    Task {
                        do {
                            try await session.deleteAccount()
                        } catch {
                            errorMessage = error.localizedDescription
                        }
                    }
                }
            }
        }
    }
}
