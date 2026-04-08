//
//  TokensGallery.swift
//  DesignSystem
//

import SwiftUI

/// A gallery view showing all design system tokens (colors, fonts, spacing).
public struct TokensGallery: View {

    /// Creates a tokens gallery.
    public init() {}

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: DSSpacing.xl) {
                    colorsSection
                    typographySection
                    spacingSection
                    gradientsSection
                }
                .padding()
            }
            .background(MeshBackground())
            .navigationTitle(String(localized: "tokens.gallery.title"))
        }
    }

    // MARK: - Colors

    private var colorsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("Colors").font(DSFont.headingM)

            LazyVGrid(columns: [GridItem(.adaptive(minimum: 80))], spacing: DSSpacing.sm) {
                colorSwatch("maltaGold", DSColor.maltaGold)
                colorSwatch("medBlue", DSColor.mediterraneanBlue)
                colorSwatch("maltaRed", DSColor.maltaRed)
                colorSwatch("warmSand", DSColor.warmSand)
                colorSwatch("success", DSColor.success)
                colorSwatch("warning", DSColor.warning)
                colorSwatch("danger", DSColor.danger)
                colorSwatch("info", DSColor.info)
            }

            LazyVGrid(columns: [GridItem(.adaptive(minimum: 80))], spacing: DSSpacing.sm) {
                colorSwatch("bg", DSColor.background)
                colorSwatch("surface", DSColor.surface)
                colorSwatch("surfMuted", DSColor.surfaceMuted)
                colorSwatch("surfElev", DSColor.surfaceElevated)
                colorSwatch("txtPri", DSColor.textPrimary)
                colorSwatch("txtSec", DSColor.textSecondary)
                colorSwatch("txtTer", DSColor.textTertiary)
            }
        }
    }

    private func colorSwatch(_ name: String, _ color: Color) -> some View {
        VStack(spacing: DSSpacing.xxs) {
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .fill(color)
                .frame(height: 50)
                .overlay(
                    RoundedRectangle(cornerRadius: DSRadius.sm)
                        .strokeBorder(Color.primary.opacity(0.1), lineWidth: 1)
                )
            Text(name)
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textSecondary)
        }
    }

    // MARK: - Typography

    private var typographySection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("Typography").font(DSFont.headingM)
            Text("Display XL").font(DSFont.displayXL)
            Text("Display L").font(DSFont.displayL)
            Text("Display M").font(DSFont.displayM)
            Text("Display S").font(DSFont.displayS)
            Text("Heading L").font(DSFont.headingL)
            Text("Heading M").font(DSFont.headingM)
            Text("Heading S").font(DSFont.headingS)
            Text("Body L").font(DSFont.bodyL)
            Text("Body M").font(DSFont.bodyM)
            Text("Body S").font(DSFont.bodyS)
            Text("Caption").font(DSFont.caption)
            Text("1234.56").font(DSFont.mono())
        }
    }

    // MARK: - Spacing

    private var spacingSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("Spacing").font(DSFont.headingM)
            spacingRow("xxs", DSSpacing.xxs)
            spacingRow("xs", DSSpacing.xs)
            spacingRow("sm", DSSpacing.sm)
            spacingRow("md", DSSpacing.md)
            spacingRow("lg", DSSpacing.lg)
            spacingRow("xl", DSSpacing.xl)
            spacingRow("xxl", DSSpacing.xxl)
        }
    }

    private func spacingRow(_ name: String, _ value: CGFloat) -> some View {
        HStack {
            Text(name)
                .font(DSFont.bodyS)
                .frame(width: 40, alignment: .leading)
            RoundedRectangle(cornerRadius: 2)
                .fill(DSColor.maltaGold)
                .frame(width: value * 4, height: 16)
            Text("\(Int(value))pt")
                .font(DSFont.caption)
                .foregroundStyle(DSColor.textTertiary)
        }
    }

    // MARK: - Gradients

    private var gradientsSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.md) {
            Text("Gradients").font(DSFont.headingM)
            gradientRow("Primary", DSGradient.primary)
            gradientRow("Secondary", DSGradient.secondary)
            gradientRow("Accent", DSGradient.accent)
            gradientRow("Success", DSGradient.success)
            gradientRow("Danger", DSGradient.danger)
        }
    }

    private func gradientRow(_ name: String, _ gradient: LinearGradient) -> some View {
        VStack(alignment: .leading, spacing: DSSpacing.xxs) {
            Text(name)
                .font(DSFont.bodyS)
            RoundedRectangle(cornerRadius: DSRadius.sm)
                .fill(gradient)
                .frame(height: 32)
        }
    }
}

#Preview("Light") { TokensGallery() }
#Preview("Dark") { TokensGallery().preferredColorScheme(.dark) }
