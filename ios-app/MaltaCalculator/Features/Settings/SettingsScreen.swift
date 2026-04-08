//
//  SettingsScreen.swift
//  MaltaCalculator
//

import DesignSystem
import StoreKit
import SwiftData
import SwiftUI

/// Full Settings screen (Task 12).
///
/// Renders a grouped `Form` with sections for appearance, defaults,
/// sync & data, privacy, tax data source, help, and about. All mutable
/// state lives in ``SettingsViewModel``; this view is passive and only
/// binds to its published properties.
///
/// String literals passed into SwiftUI text-bearing views (`Text`,
/// `Label`, `navigationTitle`, `Picker`, `Toggle`) are automatically
/// interpreted as `LocalizedStringKey`, so Xcode extracts them into the
/// String Catalog at build time.
// swiftlint:disable:next type_body_length
struct SettingsScreen: View {
    @State private var vm: SettingsViewModel?
    @Environment(\.modelContext) private var modelContext
    @Environment(\.requestReview) private var requestReview
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency
    @Environment(AppState.self) private var appState

    var body: some View {
        Form {
            if let vm {
                appearanceSection(vm)
                defaultsSection(vm)
                syncDataSection(vm)
                privacySection(vm)
                taxDataSection(vm)
                helpSection(vm)
                aboutSection(vm)
            } else {
                DSSkeletonList()
                    .listRowBackground(Color.clear)
            }
        }
        .scrollContentBackground(.hidden)
        .background {
            if reduceTransparency {
                DSColor.background.ignoresSafeArea()
            } else {
                MeshBackground().ignoresSafeArea()
            }
        }
        .navigationTitle("Settings")
        .onAppear {
            if vm == nil {
                vm = SettingsViewModel(modelContext: modelContext)
            }
            vm?.refreshDerived()
        }
        .alert("Clear History?", isPresented: bindingClearHistoryAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Clear All", role: .destructive) { vm?.clearHistory() }
        } message: {
            Text("This will permanently remove all saved calculations from this device. This cannot be undone.")
        }
        .alert("Clear Bookmarks?", isPresented: bindingClearBookmarksAlert) {
            Button("Cancel", role: .cancel) {}
            Button("Clear All", role: .destructive) { vm?.clearBookmarks() }
        } message: {
            Text("This will permanently remove all guide bookmarks from this device.")
        }
        .alert("Restart Required", isPresented: bindingRestartAlert) {
            Button("OK", role: .cancel) {}
        } message: {
            Text("Please quit and reopen the app for iCloud sync changes to take effect.")
        }
        .sheet(isPresented: bindingExportSheet) {
            if let url = vm?.exportedURL {
                ActivityView(items: [url])
            }
        }
    }

    // MARK: - Binding helpers

    private var bindingClearHistoryAlert: Binding<Bool> {
        Binding(
            get: { vm?.showingClearHistoryAlert ?? false },
            set: { vm?.showingClearHistoryAlert = $0 }
        )
    }

    private var bindingClearBookmarksAlert: Binding<Bool> {
        Binding(
            get: { vm?.showingClearBookmarksAlert ?? false },
            set: { vm?.showingClearBookmarksAlert = $0 }
        )
    }

    private var bindingRestartAlert: Binding<Bool> {
        Binding(
            get: { vm?.showingICloudRestartAlert ?? false },
            set: { vm?.showingICloudRestartAlert = $0 }
        )
    }

    private var bindingExportSheet: Binding<Bool> {
        Binding(
            get: { vm?.showingExportSheet ?? false },
            set: { vm?.showingExportSheet = $0 }
        )
    }

    // MARK: - Sections

    @ViewBuilder
    private func appearanceSection(_ vm: SettingsViewModel) -> some View {
        Section {
            Picker("Theme", selection: Binding(
                get: { vm.preferencesStore.theme },
                set: { vm.setTheme($0) }
            )) {
                ForEach(AppTheme.allCases, id: \.self) { theme in
                    Text(theme.title).tag(theme)
                }
            }
            .accessibilityHint("Choose light, dark, or follow system appearance")
        } header: {
            Text("Appearance")
                .accessibilityAddTraits(.isHeader)
        }
    }

    @ViewBuilder
    private func defaultsSection(_ vm: SettingsViewModel) -> some View {
        Section {
            Picker("Default Year", selection: Binding(
                get: { vm.preferencesStore.preferences.defaultYear },
                set: { vm.setDefaultYear($0) }
            )) {
                ForEach(2020...2026, id: \.self) { year in
                    Text(verbatim: String(year)).tag(year)
                }
            }
            .accessibilityHint("Tax year used by default across calculators")

            LabeledContent("Currency") {
                Text(verbatim: "EUR (€)")
                    .foregroundStyle(DSColor.textSecondary)
                    .accessibilityLabel("Euro")
            }
        } header: {
            Text("Defaults")
                .accessibilityAddTraits(.isHeader)
        }
    }

    @ViewBuilder
    private func syncDataSection(_ vm: SettingsViewModel) -> some View {
        Section {
            syncToggleRow(vm)
            syncCountRows(vm)
            syncActionRows(vm)
        } header: {
            Text("Sync & Data")
                .accessibilityAddTraits(.isHeader)
        }
    }

    @ViewBuilder
    private func syncToggleRow(_ vm: SettingsViewModel) -> some View {
        Toggle(isOn: Binding(
            get: { vm.preferencesStore.iCloudSyncEnabled },
            set: { vm.setICloudSyncEnabled($0) }
        )) {
            Label("iCloud Sync", systemImage: "icloud.fill")
        }
        .accessibilityHint(
            "Sync saved calculations across your devices. Requires app restart."
        )
    }

    @ViewBuilder
    private func syncCountRows(_ vm: SettingsViewModel) -> some View {
        LabeledContent {
            Text(verbatim: "\(vm.savedCount)")
                .foregroundStyle(DSColor.textSecondary)
                .monospacedDigit()
        } label: {
            Label("Saved Calculations", systemImage: "bookmark.fill")
        }
        .accessibilityLabel("Saved Calculations")
        .accessibilityValue("\(vm.savedCount)")

        LabeledContent {
            Text(verbatim: "\(vm.bookmarkedCount)")
                .foregroundStyle(DSColor.textSecondary)
                .monospacedDigit()
        } label: {
            Label("Bookmarked Guides", systemImage: "book.fill")
        }
        .accessibilityLabel("Bookmarked Guides")
        .accessibilityValue("\(vm.bookmarkedCount)")

        LabeledContent {
            Text(verbatim: vm.storageUsed)
                .foregroundStyle(DSColor.textSecondary)
                .monospacedDigit()
        } label: {
            Label("Storage Used", systemImage: "internaldrive")
        }
    }

    @ViewBuilder
    private func syncActionRows(_ vm: SettingsViewModel) -> some View {
        Button {
            vm.exportAllData()
        } label: {
            Label("Export All Data", systemImage: "square.and.arrow.up")
        }
        .accessibilityHint(
            "Export calculations and bookmarks as a JSON file"
        )

        Button(role: .destructive) {
            vm.showingClearHistoryAlert = true
        } label: {
            Label("Clear History", systemImage: "trash")
        }
        .accessibilityHint("Permanently delete saved calculations")

        Button(role: .destructive) {
            vm.showingClearBookmarksAlert = true
        } label: {
            Label("Clear Bookmarks", systemImage: "trash.slash")
        }
        .accessibilityHint("Permanently delete guide bookmarks")
    }

    @ViewBuilder
    private func privacySection(_ vm: SettingsViewModel) -> some View {
        Section {
            Toggle(isOn: .constant(false)) {
                Label("Analytics", systemImage: "chart.bar.fill")
            }
            .disabled(true)
            .accessibilityHint("Analytics are disabled in version 1.0")

            Toggle(isOn: .constant(false)) {
                Label("Crash Reports", systemImage: "exclamationmark.triangle.fill")
            }
            .disabled(true)
            .accessibilityHint("Crash reporting is disabled in version 1.0")

            if let url = URL(string: "https://maltacalculator.com/privacy") {
                Link(destination: url) {
                    Label("Privacy Policy", systemImage: "hand.raised.fill")
                }
            }

            if let url = URL(string: "https://maltacalculator.com/terms") {
                Link(destination: url) {
                    Label("Terms of Service", systemImage: "doc.text")
                }
            }
        } header: {
            Text("Privacy")
                .accessibilityAddTraits(.isHeader)
        }
    }

    @ViewBuilder
    private func taxDataSection(_ vm: SettingsViewModel) -> some View {
        Section {
            LabeledContent {
                Text(verbatim: vm.taxConfigVersion)
                    .foregroundStyle(DSColor.textSecondary)
                    .monospacedDigit()
            } label: {
                Text("Config Version")
            }

            if let url = URL(string: "https://cfr.gov.mt") {
                Link(destination: url) {
                    Label("Malta CFR", systemImage: "link")
                }
                .accessibilityHint("Open Malta Commissioner for Tax and Customs website")
            }

            if let url = URL(string: "https://socialsecurity.gov.mt") {
                Link(destination: url) {
                    Label("Social Security Department", systemImage: "link")
                }
                .accessibilityHint("Open Malta Social Security Department website")
            }

            Button {
                appState.settingsRouter.push(.disclaimer)
            } label: {
                HStack {
                    Label("Disclaimer", systemImage: "info.circle")
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.footnote.weight(.semibold))
                        .foregroundStyle(DSColor.textTertiary)
                }
            }
            .buttonStyle(.plain)
            .contentShape(Rectangle())
            .accessibilityAddTraits(.isButton)
        } header: {
            Text("Tax Data")
                .accessibilityAddTraits(.isHeader)
        }
    }

    @ViewBuilder
    private func helpSection(_ vm: SettingsViewModel) -> some View {
        Section {
            if let url = URL(string: "mailto:support@maltacalculator.com") {
                Link(destination: url) {
                    Label("Contact Support", systemImage: "envelope.fill")
                }
            }
            if let url = URL(string: "mailto:feedback@maltacalculator.com?subject=Feature%20Request") {
                Link(destination: url) {
                    Label("Suggest a Feature", systemImage: "lightbulb.fill")
                }
            }
            if let url = URL(string: "mailto:bugs@maltacalculator.com?subject=Bug%20Report") {
                Link(destination: url) {
                    Label("Report a Bug", systemImage: "ant.fill")
                }
            }
            Button {
                requestReview()
            } label: {
                Label("Rate on App Store", systemImage: "star.fill")
            }
            .accessibilityHint("Prompt to leave a review on the App Store")
        } header: {
            Text("Help & Feedback")
                .accessibilityAddTraits(.isHeader)
        }
    }

    @ViewBuilder
    private func aboutSection(_ vm: SettingsViewModel) -> some View {
        Section {
            LabeledContent {
                Text(verbatim: vm.appVersion)
                    .foregroundStyle(DSColor.textSecondary)
                    .monospacedDigit()
            } label: {
                Text("Version")
            }
            .accessibilityLabel("App version")
            .accessibilityValue(vm.appVersion)

            aboutNavigationRows
            madeInMaltaRow
        } header: {
            Text("About")
                .accessibilityAddTraits(.isHeader)
        }
    }

    @ViewBuilder
    private var aboutNavigationRows: some View {
        Button {
            appState.settingsRouter.push(.whatsNew)
        } label: {
            HStack {
                Text("What's New")
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(DSColor.textTertiary)
            }
        }
        .buttonStyle(.plain)
        .contentShape(Rectangle())
        .accessibilityAddTraits(.isButton)

        Button {
            appState.settingsRouter.push(.acknowledgements)
        } label: {
            HStack {
                Text("Acknowledgements")
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.footnote.weight(.semibold))
                    .foregroundStyle(DSColor.textTertiary)
            }
        }
        .buttonStyle(.plain)
        .contentShape(Rectangle())
        .accessibilityAddTraits(.isButton)
    }

    private var madeInMaltaRow: some View {
        HStack {
            Spacer()
            Text("Made in Malta")
            Image(systemName: "heart.fill").foregroundStyle(.red)
            Spacer()
        }
        .font(.footnote)
        .foregroundStyle(DSColor.textSecondary)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Made in Malta with love")
    }
}

// MARK: - Theme labels

extension AppTheme {
    /// Localized label used inside the theme picker.
    var title: LocalizedStringKey {
        switch self {
        case .system: return "System"
        case .light: return "Light"
        case .dark: return "Dark"
        }
    }
}

// MARK: - Share sheet wrapper

/// Minimal `UIActivityViewController` wrapper used for the export flow.
private struct ActivityView: UIViewControllerRepresentable {
    let items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ controller: UIActivityViewController, context: Context) {}
}

#Preview {
    NavigationStack {
        SettingsScreen()
            .environment(AppState())
    }
}
