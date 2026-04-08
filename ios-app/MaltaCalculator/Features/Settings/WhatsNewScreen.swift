//
//  WhatsNewScreen.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// Release notes / changelog screen.
///
/// v1.0.0 is the only entry for now. Future versions will append to the
/// ``releases`` array. The data is in-memory; no remote fetch needed.
struct WhatsNewScreen: View {
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DSSpacing.xl) {
                ForEach(releases) { release in
                    ReleaseRow(release: release)
                }
            }
            .padding(DSSpacing.lg)
        }
        .background {
            if reduceTransparency {
                DSColor.background.ignoresSafeArea()
            } else {
                MeshBackground().ignoresSafeArea()
            }
        }
        .navigationTitle("What's New")
        .navigationBarTitleDisplayMode(.inline)
    }

    // MARK: - Data

    private var releases: [Release] {
        [
            Release(
                version: "1.0.0",
                date: "April 2026",
                items: [
                    "28+ financial calculators for Malta",
                    "Salary, mortgage, pension, stamp duty & more",
                    "Save & compare calculations",
                    "Offline-first — no internet required",
                    "Optional iCloud sync across devices",
                    "10+ financial guides for living in Malta",
                    "Liquid Glass design on iOS 26",
                    "Full VoiceOver & Dynamic Type support"
                ]
            )
        ]
    }
}

// MARK: - Supporting types

private struct Release: Identifiable {
    let version: String
    let date: String
    let items: [String]
    var id: String { version }
}

private struct ReleaseRow: View {
    let release: Release

    var body: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            HStack {
                Text(verbatim: release.version)
                    .font(.DS.title3)
                    .fontWeight(.bold)
                    .accessibilityAddTraits(.isHeader)
                Spacer()
                Text(verbatim: release.date)
                    .font(.DS.footnote)
                    .foregroundStyle(DSColor.textSecondary)
            }

            VStack(alignment: .leading, spacing: DSSpacing.xs) {
                ForEach(release.items, id: \.self) { item in
                    HStack(alignment: .top, spacing: DSSpacing.sm) {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundStyle(DSColor.success)
                            .font(.DS.footnote)
                            .accessibilityHidden(true)
                        Text(item)
                            .font(.DS.body)
                            .foregroundStyle(DSColor.textPrimary)
                    }
                }
            }
        }
    }
}

#Preview { NavigationStack { WhatsNewScreen() } }
