# Task 24 — Markdown Table Support in Guides

> **Referans**: Bu task, [09-feature-guides.md](09-feature-guides.md) tarafından oluşturulan markdown reader'ı `swift-markdown-ui` ile değiştirir. Mevcut native `AttributedString(markdown:)` parser'ı tabloları desteklemediği için Malta tax rates gibi tablolu rehberler bozuk görünüyor.

---

## Problem

`ios-app/MaltaCalculator/Features/Guides/MarkdownBlock.swift` dosyası native `AttributedString(markdown:)` API'ını kullanıyor. Bu parser:

1. **Block-level markdown** desteklemiyor — sadece bold/italic/link gibi inline syntax
2. **Tabloları paragraf** olarak işliyor → `| header | cell |` borular ham metin olarak kalıyor
3. `.interpretedSyntax = .inlineOnlyPreservingWhitespace` ayarı bunu zorunlu kılıyor

**Etkilenen rehberler** (tablo içerenler):

- `guide-malta-tax-rates-2026-complete-guide.md` (Single/Married/Parent rate tabloları)
- `guide-malta-ssc-contributions-2026-explained.md` (Category A/B/C tabloları)
- `guide-malta-pension-system-2026-guide.md`
- `guide-malta-stamp-duty-complete-guide-2026.md`
- `guide-malta-rental-income-tax-15-percent-guide.md`
- `guide-malta-vacation-leave-entitlement-2026.md`
- `guide-malta-public-holidays-2026-complete-guide.md`
- `guide-malta-mortgage-guide-2026.md`

---

## Çözüm: swift-markdown-ui

[gonzalezreal/swift-markdown-ui](https://github.com/gonzalezreal/swift-markdown-ui) — SwiftUI için tam GFM (GitHub Flavored Markdown) desteği:

- ✅ Tablolar
- ✅ Code fences (syntax highlighting opsiyonel)
- ✅ Footnotes
- ✅ Task lists
- ✅ Strikethrough
- ✅ Custom block & inline styling (DSColor, DSFont entegrasyonu)
- ✅ Reduce motion / Dynamic Type uyumlu
- ✅ Pure SwiftUI, no UIKit
- ✅ iOS 15+

---

## Adımlar

### 1. SPM Dependency Ekle

`ios-app/project.yml` `packages:` bölümüne:

```yaml
packages:
  CalculationKit:
    path: Packages/CalculationKit
  DesignSystem:
    path: Packages/DesignSystem
  MarkdownUI:
    url: https://github.com/gonzalezreal/swift-markdown-ui
    from: 2.4.1
```

`MaltaCalculator` target dependencies'e `MarkdownUI` ekle.

### 2. MarkdownBlock'u Kaldır veya Devre Dışı Bırak

`ios-app/MaltaCalculator/Features/Guides/MarkdownBlock.swift` artık gerekli değil. Ama public API kullanan yerler varsa (örneğin `GuideReaderScreen`), önce onları MarkdownUI'ya geçir.

### 3. GuideReaderScreen'i Güncelle

`ios-app/MaltaCalculator/Features/Guides/GuideReaderScreen.swift`:

```swift
import SwiftUI
import MarkdownUI
import DesignSystem

struct GuideReaderScreen: View {
    let guide: GuideDocument
    @ObservedObject var bookmarks: BookmarksStore

    @State private var fontScale: Double = 1.0
    @Environment(\.accessibilityReduceMotion) private var reduceMotion

    var body: some View {
        ScrollView {
            Markdown(guide.body)
                .markdownTheme(.maltaCalculator)
                .padding(.horizontal, DSSpacing.lg)
                .padding(.vertical, DSSpacing.md)
                .accessibilityIdentifier("guide.body")
        }
        .navigationTitle(guide.title)
        .navigationBarTitleDisplayMode(.large)
        .toolbar { /* font scale, bookmark, share */ }
    }
}
```

### 4. Custom Theme Tanımla

`ios-app/MaltaCalculator/Features/Guides/MarkdownTheme+Malta.swift` (yeni dosya):

```swift
import MarkdownUI
import SwiftUI
import DesignSystem

extension Theme {
    static let maltaCalculator = Theme()
        .text {
            FontFamily(.system(.serif))
            ForegroundColor(DSColor.textPrimary)
            FontSize(17)
        }
        .heading1 { configuration in
            configuration.label
                .markdownTextStyle {
                    FontWeight(.bold)
                    FontSize(32)
                }
                .markdownMargin(top: DSSpacing.xl, bottom: DSSpacing.md)
                .foregroundStyle(DSColor.maltaGold)
        }
        .heading2 { configuration in
            configuration.label
                .markdownTextStyle {
                    FontWeight(.semibold)
                    FontSize(24)
                }
                .markdownMargin(top: DSSpacing.lg, bottom: DSSpacing.sm)
        }
        .heading3 { configuration in
            configuration.label
                .markdownTextStyle {
                    FontWeight(.semibold)
                    FontSize(20)
                }
                .markdownMargin(top: DSSpacing.md, bottom: DSSpacing.xs)
        }
        .paragraph { configuration in
            configuration.label
                .lineSpacing(6)
                .markdownMargin(top: 0, bottom: DSSpacing.sm)
        }
        .table { configuration in
            configuration.label
                .markdownTableBorderStyle(.init(color: DSColor.separator, strokeStyle: .init(lineWidth: 1)))
                .markdownTableBackgroundStyle(.alternatingRows(DSColor.surface, DSColor.surface.opacity(0.5)))
                .markdownMargin(top: DSSpacing.md, bottom: DSSpacing.md)
        }
        .tableCell { configuration in
            configuration.label
                .padding(.vertical, DSSpacing.xs)
                .padding(.horizontal, DSSpacing.sm)
        }
        .tableHeader { configuration in
            configuration.label
                .markdownTextStyle {
                    FontWeight(.semibold)
                    ForegroundColor(DSColor.maltaGold)
                }
        }
        .blockquote { configuration in
            configuration.label
                .padding(.leading, DSSpacing.md)
                .overlay(alignment: .leading) {
                    Rectangle()
                        .fill(DSColor.maltaGold)
                        .frame(width: 3)
                }
        }
        .code {
            FontFamily(.system(.monospaced))
            FontSize(15)
            BackgroundColor(DSColor.surface)
        }
        .codeBlock { configuration in
            configuration.label
                .padding(DSSpacing.sm)
                .background(DSColor.surface)
                .clipShape(RoundedRectangle(cornerRadius: DSRadius.md))
                .overlay(
                    RoundedRectangle(cornerRadius: DSRadius.md)
                        .strokeBorder(DSColor.separator, lineWidth: 1)
                )
                .markdownMargin(top: DSSpacing.sm, bottom: DSSpacing.sm)
        }
        .link {
            ForegroundColor(DSColor.maltaGold)
            UnderlineStyle(.single)
        }
        .listItem { configuration in
            configuration.label
                .markdownMargin(top: DSSpacing.xs, bottom: DSSpacing.xs)
        }
}
```

### 5. Eski MarkdownBlock'u Sil

`MarkdownBlock.swift` artık kullanılmıyor → silebilirsin. Eğer testler `MarkdownBlock.parse()` kullanıyorsa onları MarkdownUI tabanlı yardımcılara çevir veya kaldır.

### 6. Snapshot Tests

`ios-app/Tests/MaltaCalculatorTests/GuideMarkdownTests.swift`:

```swift
import XCTest
import SwiftUI
import SnapshotTesting
import MarkdownUI
@testable import MaltaCalculator

final class GuideMarkdownTests: XCTestCase {
    func test_taxRatesGuide_rendersTablesCorrectly() {
        let markdown = """
        # Malta Tax Rates 2026

        Malta uses **progressive income tax brackets**.

        ## Single rates

        | Taxable income  | Rate | Subtract |
        | --------------- | ---- | -------- |
        | 0 – 9,100       | 0%   | 0        |
        | 9,101 – 14,500  | 15%  | 1,365    |
        | 14,501 – 19,500 | 25%  | 2,815    |
        | 19,501 – 60,000 | 25%  | 2,725    |
        | 60,001 +        | 35%  | 8,725    |
        """

        let view = ScrollView {
            Markdown(markdown)
                .markdownTheme(.maltaCalculator)
                .padding()
        }
        .frame(width: 390, height: 1200)

        assertSnapshot(
            of: view,
            as: .image(layout: .device(config: .iPhone13Pro)),
            named: "tax-rates-light"
        )
    }

    func test_taxRatesGuide_darkMode() {
        let markdown = """
        ## Single rates

        | Taxable income  | Rate |
        | --------------- | ---- |
        | 0 – 9,100       | 0%   |
        | 60,001 +        | 35%  |
        """

        let view = ScrollView {
            Markdown(markdown)
                .markdownTheme(.maltaCalculator)
                .environment(\.colorScheme, .dark)
                .padding()
        }
        .frame(width: 390, height: 800)

        assertSnapshot(
            of: view,
            as: .image(layout: .device(config: .iPhone13Pro)),
            named: "tax-rates-dark"
        )
    }

    func test_dynamicType_AX5() {
        let markdown = "## Heading\n\nBody text with **bold** and *italic*."
        let view = Markdown(markdown)
            .markdownTheme(.maltaCalculator)
            .environment(\.dynamicTypeSize, .accessibility5)
            .frame(width: 390)

        assertSnapshot(of: view, as: .image, named: "ax5")
    }
}
```

### 7. Acceptance Criteria

- [ ] `swift-markdown-ui` SPM dep eklendi (`from: 2.4.1`)
- [ ] `MarkdownBlock.swift` silindi (veya deprecated edildi)
- [ ] `GuideReaderScreen` MarkdownUI kullanıyor
- [ ] `Theme.maltaCalculator` tanımlı (DSColor, DSSpacing, DSFont entegre)
- [ ] Tablolar 8 rehberde de düzgün render oluyor (manual visual check)
- [ ] Snapshot testleri light/dark/AX5 için baselines ile commit edildi
- [ ] Build green, lint clean, 0 warnings
- [ ] Reduce-transparency modunda tablo arka planı opaque
- [ ] VoiceOver tablo cell'leri okuyor

### 8. Risk

- **Düşük**: MarkdownUI olgun bir kütüphane (5k+ stars), aktif maintain
- **Orta**: Theme tanımı detaylı yazılmazsa görsel bozulabilir → snapshot testler korumalı
- **Düşük**: Build size ~50KB artar (kabul edilebilir)

### 9. Tahmini Süre

- Implementation: ~15 dk (basit migration)
- Theme tuning: ~10 dk
- Snapshot tests: ~10 dk
- **Toplam: ~35 dk**
