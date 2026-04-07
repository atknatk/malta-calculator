# Task 11 — Share & Export (ShareLink, PDF)

> **Faz**: M7
> **Ön koşul**: Detay ekranları çalışıyor
> **Çıktı**: Hesaplama sonuçlarını PNG, PDF ve metin olarak paylaşma

---

## 1. Amaç

Her hesaplamanın sonucunu **paylaşılabilir** kılmak. Üç format:

1. **PNG share card** — kare (Instagram story için 1080×1920 opsiyonu da)
2. **PDF** — A4 özet (salary için payslip-benzeri, mortgage için schedule)
3. **Plain text** — WhatsApp/iMessage için özet

---

## 2. Mimari

```swift
protocol ShareableCalculation {
    var shareTitle: String { get }
    func shareText() -> String
    @MainActor func shareImageSnapshot() -> ImageRenderer<AnyView>
    @MainActor func sharePDFData() -> Data
}
```

Her feature için `XxxShareCard` view'i var → `ImageRenderer` ve `PDFKit` ile export edilir.

---

## 3. Salary Share Card

`SalaryShareCard`:

- Üstte "Malta Calculator" logo + yıl
- Ortada büyük net pay (monthly + annual)
- Alt: gross, SSC, income tax breakdown (mini donut)
- Footer: "Generated with Malta Calculator"
- 1080×1080 veya 1080×1920 versiyonları

---

## 4. Mortgage Share Card

- Property price, deposit, rate, term
- Monthly payment (büyük)
- Total interest, total cost
- Mini amortization line chart

---

## 5. PDF Export (A4)

Sadece bazı hesaplayıcılar için v1:

- [ ] Salary — 12 ay tablosu + özet (web'deki payslip tasarımından ilham)
- [ ] Mortgage — Yıllık amortization tablosu
- [ ] Personal Loan — Amortization

PDF oluşturma:

```swift
import PDFKit

func renderPDF<Content: View>(size: CGSize, @ViewBuilder content: () -> Content) -> Data {
    let renderer = ImageRenderer(content: content())
    renderer.proposedSize = ProposedViewSize(size)
    var data = Data()
    renderer.render { size, renderContext in
        let ctx = UIGraphicsPDFRenderer(bounds: CGRect(origin: .zero, size: size))
        data = ctx.pdfData { ctx in
            ctx.beginPage()
            renderContext(ctx.cgContext)
        }
    }
    return data
}
```

---

## 6. Alt Adımlar

- [ ] `ShareableCalculation` protocol ve default implementasyon
- [ ] `SalaryShareCard` + PNG + PDF
- [ ] `MortgageShareCard` + PNG + PDF
- [ ] `PersonalLoanShareCard` + PNG + PDF
- [ ] Diğer 13 hesaplayıcı için generic `GenericShareCard`
- [ ] `ShareLink` bileşeni ile `Transferable` conformance
- [ ] Activity types filtreleme (email, messages, more)
- [ ] Haptic feedback `.success` paylaşım başlatıldığında

---

## 7. Transferable

```swift
struct SalaryShareItem: Transferable {
    let summary: String
    let imageData: Data
    let pdfData: Data

    static var transferRepresentation: some TransferRepresentation {
        ProxyRepresentation(exporting: \.summary)
        DataRepresentation(exportedContentType: .png) { $0.imageData }
        DataRepresentation(exportedContentType: .pdf) { $0.pdfData }
    }
}
```

---

## 8. Kabul Kriterleri

- [ ] Share card render süresi < 200ms
- [ ] PNG 1080×1080 kalitesi net
- [ ] PDF A4 sayfa sayısı içeriğe göre doğru
- [ ] ShareLink tüm sistem activity'leri listeliyor
- [ ] Snapshot test: share card'ların kendisi için

---

## 9. Sıradaki

[`12-settings-localization.md`](12-settings-localization.md)
