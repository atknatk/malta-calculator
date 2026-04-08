//
//  DisclaimerScreen.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// Static disclaimer view displayed from the Tax Data section of
/// Settings. Content is the agreed-upon legal text from Task 12.
struct DisclaimerScreen: View {
    @Environment(\.accessibilityReduceTransparency)
    private var reduceTransparency

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DSSpacing.lg) {
                introSection
                notTaxAdviceSection
                accuracySection
                consultSection
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
        .navigationTitle("Disclaimer")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var introSection: some View {
        Text(Self.introText)
            .font(.DS.body)
            .foregroundStyle(DSColor.textPrimary)
    }

    private var notTaxAdviceSection: some View {
        Group {
            Text("Not Tax Advice")
                .font(.DS.headline)
                .accessibilityAddTraits(.isHeader)

            Text(Self.notTaxAdviceText)
                .font(.DS.body)
                .foregroundStyle(DSColor.textPrimary)
        }
    }

    private var accuracySection: some View {
        Group {
            Text("Accuracy")
                .font(.DS.headline)
                .accessibilityAddTraits(.isHeader)

            Text(Self.accuracyText)
                .font(.DS.body)
                .foregroundStyle(DSColor.textPrimary)

            VStack(alignment: .leading, spacing: DSSpacing.xs) {
                if let url = URL(string: "https://cfr.gov.mt") {
                    Link("Malta CFR: cfr.gov.mt", destination: url)
                        .font(.DS.body)
                }
                if let url = URL(string: "https://socialsecurity.gov.mt") {
                    Link(
                        "Social Security: socialsecurity.gov.mt",
                        destination: url
                    )
                    .font(.DS.body)
                }
            }
        }
    }

    private var consultSection: some View {
        Group {
            Text("Consult a Professional")
                .font(.DS.headline)
                .accessibilityAddTraits(.isHeader)

            Text(Self.consultText)
                .font(.DS.body)
                .foregroundStyle(DSColor.textPrimary)
        }
    }

    // MARK: - Copy

    private static let introText = String(localized: """
        Malta Calculator provides financial calculations \
        for informational and educational purposes only. \
        The values calculated are estimates based on \
        publicly available data from Malta CFR \
        (Commissioner for Tax and Customs) and the Social \
        Security Department.
        """)

    private static let notTaxAdviceText = String(localized: """
        This application does not constitute professional \
        tax, legal, or financial advice. Individual \
        circumstances may affect actual amounts owed \
        or received.
        """)

    private static let accuracyText = String(localized: """
        We strive to keep the tax data current. However, \
        regulations change frequently. Always verify with \
        official sources before making financial decisions:
        """)

    private static let consultText = String(localized: """
        For binding tax advice, payroll administration, \
        or legal matters, please consult a licensed \
        Maltese accountant, tax advisor, or lawyer.
        """)
}

#Preview { NavigationStack { DisclaimerScreen() } }
