//
//  CategoryHeaderView.swift
//  MaltaCalculator
//

import DesignSystem
import SwiftUI

/// Section header rendered above each category grid in the Calculators Hub.
struct CategoryHeaderView: View {
    let category: CalculatorCategory
    let itemCount: Int

    var body: some View {
        HStack(spacing: DSSpacing.sm) {
            ZStack {
                RoundedRectangle(cornerRadius: DSRadius.md)
                    .fill(DSGradient.category(category.gradientColors))
                    .frame(width: 44, height: 44)
                Image(systemName: category.symbolName)
                    .font(.title3.weight(.semibold))
                    .foregroundStyle(.white)
                    .accessibilityHidden(true)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(category.title)
                    .font(DSFont.heading(20))
                    .foregroundStyle(DSColor.textPrimary)
                Text("^[\(itemCount) calculator](inflect: true)")
                    .font(DSFont.caption)
                    .foregroundStyle(DSColor.textSecondary)
            }
            Spacer()
        }
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(.isHeader)
    }
}
