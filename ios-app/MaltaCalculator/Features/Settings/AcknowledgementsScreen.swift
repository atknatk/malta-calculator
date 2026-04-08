//
//  AcknowledgementsScreen.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// Lists the third-party libraries the app depends on.
///
/// Each entry links to its repository. The view is static; no runtime
/// fetching required.
struct AcknowledgementsScreen: View {
    @Environment(\.accessibilityReduceTransparency) private var reduceTransparency

    var body: some View {
        List {
            Section {
                Text(
                    // swiftlint:disable:next line_length
                    "Malta Calculator is built with the following open-source software. We gratefully acknowledge their authors."
                )
                    .font(.DS.body)
                    .foregroundStyle(DSColor.textSecondary)
                    .listRowBackground(Color.clear)
            }

            ForEach(libraries) { lib in
                if let url = URL(string: lib.url) {
                    Link(destination: url) {
                        VStack(alignment: .leading, spacing: DSSpacing.xxs) {
                            Text(verbatim: lib.name)
                                .font(.DS.headline)
                            Text(lib.license)
                                .font(.DS.footnote)
                                .foregroundStyle(DSColor.textTertiary)
                        }
                        .accessibilityElement(children: .combine)
                        .accessibilityLabel("\(lib.name), \(lib.license)")
                    }
                }
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
        .navigationTitle("Acknowledgements")
        .navigationBarTitleDisplayMode(.inline)
    }

    // MARK: - Data

    private var libraries: [Library] {
        [
            Library(name: "swift-snapshot-testing", license: "MIT", url: "https://github.com/pointfreeco/swift-snapshot-testing"),
            Library(name: "SwiftLint", license: "MIT", url: "https://github.com/realm/SwiftLint"),
            Library(name: "SwiftFormat", license: "MIT", url: "https://github.com/nicklockwood/SwiftFormat"),
            Library(name: "Mint", license: "MIT", url: "https://github.com/yonaskolb/Mint"),
            Library(name: "XcodeGen", license: "MIT", url: "https://github.com/yonaskolb/XcodeGen")
        ]
    }
}

// MARK: - Supporting types

private struct Library: Identifiable {
    let name: String
    let license: String
    let url: String
    var id: String { name }
}

#Preview { NavigationStack { AcknowledgementsScreen() } }
