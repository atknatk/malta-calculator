# Task 11 — Share & Export (ShareLink, PNG, PDF)

> **Faz**: M7
> **Ön koşul**: Salary + en az 4 calculator detail ekranı çalışıyor
> **Çıktı**: Her hesaplayıcı için paylaşılabilir PNG card + (öncelikli olanlar için) PDF + plain text

---

## 1. Amaç

Her hesaplamanın sonucunu **paylaşılabilir** kılmak. Üç format:

1. **PNG share card** — kare 1080×1080 (Instagram), portre 1080×1920 (Stories), Twitter 1200×675
2. **PDF** — A4 özet (öncelikli olanlar için)
3. **Plain text** — WhatsApp/iMessage için kısa özet

---

## 2. Mimari

### 2.1 `Shareable` Protocol

```swift
import SwiftUI

@MainActor
protocol Shareable {
    associatedtype Card: View
    var shareTitle: String { get }
    func shareText() -> String
    @ViewBuilder func shareCard() -> Card
}

extension Shareable {
    func renderImage(scale: CGFloat = 3, size: CGSize = CGSize(width: 1080, height: 1080)) -> Data? {
        let renderer = ImageRenderer(content: shareCard().frame(width: size.width, height: size.height))
        renderer.scale = scale
        return renderer.uiImage?.pngData()
    }
}
```

### 2.2 `ShareableContent.swift`

`Transferable` conformance:

```swift
import CoreTransferable
import UIKit

struct ShareableContent: Transferable {
    let title: String
    let text: String
    let imageData: Data?
    let pdfData: Data?
    let url: URL?

    static var transferRepresentation: some TransferRepresentation {
        // Plain text
        ProxyRepresentation(exporting: \.text)

        // Image
        DataRepresentation(exportedContentType: .png) { content in
            content.imageData ?? Data()
        }

        // PDF
        DataRepresentation(exportedContentType: .pdf) { content in
            content.pdfData ?? Data()
        }

        // URL (for web fallback)
        ProxyRepresentation { content in
            content.url ?? URL(string: "https://maltacalculator.com")!
        }
    }
}
```

---

## 3. Salary Share Card

### 3.1 `SalaryShareCard.swift`

```swift
import SwiftUI
import DesignSystem
import CalculationKit

struct SalaryShareCard: View {
    let summary: SalarySummary
    let year: Int

    var body: some View {
        ZStack {
            DSGradient.primary.ignoresSafeArea()

            VStack(spacing: 32) {
                // Header
                HStack {
                    Image(systemName: "sparkles")
                        .foregroundStyle(.white)
                    Text("Malta Calculator")
                        .font(.system(.title3, design: .rounded, weight: .bold))
                        .foregroundStyle(.white)
                    Spacer()
                    Text("Year \(String(year))")
                        .font(.system(.callout, design: .rounded, weight: .semibold))
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(.white.opacity(0.2), in: Capsule())
                        .foregroundStyle(.white)
                }

                Spacer()

                // Hero
                VStack(spacing: 8) {
                    Text("YOUR NET SALARY")
                        .font(.system(.subheadline, design: .rounded, weight: .semibold))
                        .foregroundStyle(.white.opacity(0.85))
                        .tracking(2)
                    Text(summary.annualNet.eur)
                        .font(.system(size: 80, weight: .black, design: .serif))
                        .foregroundStyle(.white)
                        .minimumScaleFactor(0.5)
                        .lineLimit(1)
                    Text("per year")
                        .font(.system(.body, design: .rounded))
                        .foregroundStyle(.white.opacity(0.85))
                }

                Spacer()

                // Breakdown
                VStack(spacing: 16) {
                    breakdownRow("Annual Gross", summary.annualGross)
                    breakdownRow("Income Tax", summary.annualIncomeTax)
                    breakdownRow("Social Security", summary.annualSSC)
                    Divider().background(.white.opacity(0.3))
                    breakdownRow("Take Home", summary.annualNet, highlight: true)
                }
                .padding(24)
                .background(.white.opacity(0.15), in: RoundedRectangle(cornerRadius: 24))

                Spacer()

                // Footer
                HStack {
                    Text("maltacalculator.com")
                        .font(.system(.caption, design: .rounded, weight: .medium))
                    Spacer()
                    Text("Generated \(Date.now, format: .dateTime.day().month().year())")
                        .font(.system(.caption, design: .rounded))
                }
                .foregroundStyle(.white.opacity(0.7))
            }
            .padding(48)
        }
        .frame(width: 1080, height: 1080)
    }

    private func breakdownRow(_ label: String, _ value: Decimal, highlight: Bool = false) -> some View {
        HStack {
            Text(label)
                .font(.system(.callout, design: .rounded, weight: highlight ? .bold : .regular))
            Spacer()
            Text(value.eur)
                .font(.system(.callout, design: .rounded, weight: highlight ? .bold : .semibold))
                .monospacedDigit()
        }
        .foregroundStyle(.white)
    }
}

#Preview {
    SalaryShareCard(
        summary: SalarySummary(from: []),
        year: 2026
    )
    .scaleEffect(0.3)
}
```

### 3.2 `SalaryShareable.swift`

```swift
struct SalaryShareable: Shareable {
    let summary: SalarySummary
    let year: Int

    var shareTitle: String { "My Malta Salary \(year)" }

    func shareText() -> String {
        """
        💼 My Malta Salary Breakdown — \(year)

        Annual Gross: \(summary.annualGross.eur)
        Income Tax: -\(summary.annualIncomeTax.eur)
        Social Security: -\(summary.annualSSC.eur)
        ────────────────────────
        Net: \(summary.annualNet.eur)/year (\(summary.averageMonthlyNet.eur)/month)

        Calculated with Malta Calculator
        https://maltacalculator.com
        """
    }

    func shareCard() -> some View {
        SalaryShareCard(summary: summary, year: year)
    }
}
```

---

## 4. Mortgage Share Card

### 4.1 `MortgageShareCard.swift`

```swift
struct MortgageShareCard: View {
    let output: MortgageOutput
    let propertyPrice: Decimal
    let depositPercent: Decimal
    let interestRate: Decimal
    let loanTermYears: Int

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [Color(hex: "#0EA5E9"), Color(hex: "#2563EB")],
                startPoint: .topLeading, endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 28) {
                // Header
                HStack {
                    Image(systemName: "house.fill")
                        .foregroundStyle(.white)
                    Text("Malta Mortgage").font(.system(.title3, design: .rounded, weight: .bold))
                    Spacer()
                }
                .foregroundStyle(.white)

                // Property
                Text(propertyPrice.eur)
                    .font(.system(size: 60, weight: .heavy, design: .serif))
                    .foregroundStyle(.white)

                Text("Property Price")
                    .font(.system(.callout, design: .rounded))
                    .foregroundStyle(.white.opacity(0.85))

                // Hero: monthly payment
                VStack(spacing: 6) {
                    Text("MONTHLY PAYMENT")
                        .font(.system(.caption, design: .rounded, weight: .semibold))
                        .tracking(2)
                    Text(output.monthlyPayment.eur)
                        .font(.system(size: 72, weight: .black, design: .serif))
                }
                .foregroundStyle(.white)

                // Stats grid
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 16) {
                    statBlock("Loan Amount", output.loanAmount.eur)
                    statBlock("Total Interest", output.totalInterest.eur)
                    statBlock("Term", "\(loanTermYears) years")
                    statBlock("Rate", "\(interestRate)%")
                }
                .padding(20)
                .background(.white.opacity(0.15), in: RoundedRectangle(cornerRadius: 20))

                Spacer()

                Text("maltacalculator.com")
                    .font(.system(.caption, design: .rounded, weight: .medium))
                    .foregroundStyle(.white.opacity(0.7))
            }
            .padding(48)
        }
        .frame(width: 1080, height: 1080)
    }

    private func statBlock(_ label: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.system(.caption, design: .rounded))
                .foregroundStyle(.white.opacity(0.75))
            Text(value)
                .font(.system(.title3, design: .rounded, weight: .bold))
                .foregroundStyle(.white)
                .monospacedDigit()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
```

---

## 5. Diğer Hesaplayıcılar — `GenericShareCard`

13 hesaplayıcı için bireysel card tasarlamaktansa generic bir tasarım:

```swift
struct GenericShareCard: View {
    let title: String
    let symbolName: String
    let gradient: LinearGradient
    let heroValue: String
    let heroLabel: String
    let rows: [(String, String)]
    let footer: String

    var body: some View {
        ZStack {
            gradient.ignoresSafeArea()

            VStack(spacing: 28) {
                HStack {
                    Image(systemName: symbolName)
                        .foregroundStyle(.white)
                    Text(title)
                        .font(.system(.title3, design: .rounded, weight: .bold))
                        .foregroundStyle(.white)
                    Spacer()
                }

                Spacer()

                VStack(spacing: 6) {
                    Text(heroLabel.uppercased())
                        .font(.system(.caption, design: .rounded, weight: .semibold))
                        .tracking(2)
                    Text(heroValue)
                        .font(.system(size: 80, weight: .black, design: .serif))
                        .minimumScaleFactor(0.5)
                        .lineLimit(1)
                }
                .foregroundStyle(.white)

                Spacer()

                VStack(spacing: 12) {
                    ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                        HStack {
                            Text(row.0)
                            Spacer()
                            Text(row.1)
                                .monospacedDigit()
                                .fontWeight(.semibold)
                        }
                        .font(.system(.callout, design: .rounded))
                    }
                }
                .padding(20)
                .background(.white.opacity(0.15), in: RoundedRectangle(cornerRadius: 16))
                .foregroundStyle(.white)

                Spacer()

                HStack {
                    Text("maltacalculator.com")
                    Spacer()
                    Text(Date.now, format: .dateTime.day().month().year())
                }
                .font(.system(.caption, design: .rounded))
                .foregroundStyle(.white.opacity(0.7))
            }
            .padding(48)
        }
        .frame(width: 1080, height: 1080)
    }
}
```

---

## 6. PDF Export

### 6.1 PDF Renderer

```swift
import SwiftUI
import PDFKit
import UIKit

@MainActor
enum PDFRenderer {
    static func render<Content: View>(
        size: CGSize = CGSize(width: 595.2, height: 841.8),  // A4
        @ViewBuilder content: () -> Content
    ) -> Data {
        let renderer = ImageRenderer(content: content().frame(width: size.width, height: size.height))
        renderer.scale = 2.0

        var data = Data()

        renderer.render { renderSize, renderContext in
            let pdfContext = UIGraphicsPDFRenderer(
                bounds: CGRect(origin: .zero, size: renderSize)
            )
            data = pdfContext.pdfData { ctx in
                ctx.beginPage()
                renderContext(ctx.cgContext)
            }
        }

        return data
    }
}
```

### 6.2 Salary PDF (A4 Tablo)

```swift
struct SalaryPDFView: View {
    let monthly: [SalaryOutput]
    let summary: SalarySummary
    let year: Int

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Malta Calculator")
                        .font(.system(.title2, design: .serif, weight: .bold))
                    Text("Salary Breakdown \(String(year))")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                Text(Date.now, format: .dateTime.day().month().year())
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            Divider()

            // Summary
            HStack(spacing: 24) {
                summaryStat("Annual Gross", summary.annualGross.eur)
                summaryStat("Annual Net", summary.annualNet.eur, highlight: true)
                summaryStat("Effective Rate", "\(summary.effectiveTaxRate * 100)%")
            }

            Divider()

            // Monthly table
            Text("Monthly Breakdown")
                .font(.headline)

            HStack {
                Text("Month").frame(width: 80, alignment: .leading)
                Text("Gross").frame(maxWidth: .infinity, alignment: .trailing)
                Text("SSC").frame(maxWidth: .infinity, alignment: .trailing)
                Text("Tax").frame(maxWidth: .infinity, alignment: .trailing)
                Text("Net").frame(maxWidth: .infinity, alignment: .trailing)
            }
            .font(.system(.caption, weight: .semibold))
            .padding(.bottom, 4)

            ForEach(monthly, id: \.month) { row in
                HStack {
                    Text(row.month.shortName).frame(width: 80, alignment: .leading)
                    Text(row.grossTotal.eur).frame(maxWidth: .infinity, alignment: .trailing)
                    Text("-\(row.sscTax.eur)").frame(maxWidth: .infinity, alignment: .trailing)
                    Text("-\(row.incomeTax.eur)").frame(maxWidth: .infinity, alignment: .trailing)
                    Text(row.net.eur).frame(maxWidth: .infinity, alignment: .trailing).fontWeight(.semibold)
                }
                .font(.system(.caption, design: .monospaced))
                .padding(.vertical, 2)
            }

            Spacer()

            Divider()

            // Disclaimer
            Text("This document is for informational purposes only and does not constitute tax advice. Verify with Malta CFR and Social Security Department.")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .padding(40)
        .frame(width: 595.2, height: 841.8)
        .background(.white)
    }

    private func summaryStat(_ label: String, _ value: String, highlight: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.system(highlight ? .title3 : .body, design: .rounded, weight: .bold))
                .foregroundStyle(highlight ? Color(hex: "#C97D0A") : .primary)
        }
    }
}
```

---

## 7. ShareSheet Integration

```swift
struct ShareButton: View {
    let content: ShareableContent

    var body: some View {
        ShareLink(
            item: content,
            subject: Text(content.title),
            preview: SharePreview(
                content.title,
                image: content.imageData.flatMap { Image(uiImage: UIImage(data: $0) ?? UIImage()) }
                    ?? Image(systemName: "doc.fill")
            )
        ) {
            Label("Share", systemImage: "square.and.arrow.up")
        }
        .sensoryFeedback(.selection, trigger: content.title)
    }
}
```

---

## 8. Hangi Hesaplayıcılar Hangi Format

| #     | Calculator           | PNG       | PDF                 | Text |
| ----- | -------------------- | --------- | ------------------- | ---- |
| 1     | Salary               | ✓         | ✓ A4 12-month table | ✓    |
| 2     | Mortgage             | ✓         | ✓ Amortization      | ✓    |
| 3     | Personal Loan        | ✓         | ✓ Amortization      | ✓    |
| 4     | Stamp Duty           | ✓ generic | —                   | ✓    |
| 5     | Savings              | ✓ generic | ✓ Year breakdown    | ✓    |
| 6     | Pension              | ✓ generic | ✓ A4 detailed       | ✓    |
| 7     | Retirement Age       | ✓ generic | —                   | ✓    |
| 8     | Overtime             | ✓ generic | —                   | ✓    |
| 9     | Vacation             | ✓ generic | —                   | ✓    |
| 10    | Notice Period        | ✓ generic | —                   | ✓    |
| 11    | Children's Allowance | ✓ generic | —                   | ✓    |
| 12    | Family Reunification | ✓ generic | —                   | ✓    |
| 13-18 | Vehicle (6)          | ✓ generic | —                   | ✓    |

---

## 9. Alt Adımlar

- [ ] `Shareable` protocol
- [ ] `ShareableContent` Transferable
- [ ] `SalaryShareCard` + `SalaryShareable`
- [ ] `MortgageShareCard`
- [ ] `PersonalLoanShareCard`
- [ ] `GenericShareCard` (kalan 14 hesaplayıcı için)
- [ ] `PDFRenderer` utility
- [ ] `SalaryPDFView`
- [ ] `MortgagePDFView`
- [ ] `PersonalLoanPDFView`
- [ ] `PensionPDFView`
- [ ] `SavingsPDFView`
- [ ] `ShareButton` reusable component
- [ ] Her detay ekranında share butonu bağlı
- [ ] Activity types filtreleme (saveToFiles, copy, message, mail, more)
- [ ] Snapshot test her share card için

---

## 10. Kabul Kriterleri

- [ ] Share card render süresi < 200 ms
- [ ] PNG 1080×1080 net, file size < 500 KB
- [ ] PDF A4, sayfa sayısı içeriğe göre doğru
- [ ] ShareLink tüm sistem activity'leri listeliyor
- [ ] Plain text WhatsApp/iMessage kopyala-yapıştır temiz
- [ ] Snapshot test: tüm share card'lar
- [ ] Reduce Motion / Reduce Transparency etki etmiyor (statik render)
- [ ] iPad share popover doğru anchor'lanmış
- [ ] PDF dosya isimleri okunabilir: `Malta_Salary_2026.pdf`

---

## 11. Sıradaki

[`12-settings-localization.md`](12-settings-localization.md)
