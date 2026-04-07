# Task 09 — Feature: Guides (Markdown Render, Bookmark)

> **Faz**: M6
> **Ön koşul**: `DesignSystem` + Navigation hazır
> **Çıktı**: Guides tab'ı — Malta finansal rehber yazılarını offline okur, bookmark'lar

---

## 1. Amaç

Web'deki blog yazılarının en önemli 10 tanesini **bundled** Markdown olarak iOS'a taşımak. Okuma deneyimi, bookmark, paylaşma.

---

## 2. Bundled İçerik Seçimi (v1)

Web blog'dan öne çıkan 10 yazı (SEO/trafik verisine göre ileride güncellenir — v1 için öneri):

1. `how-to-calculate-net-salary-malta-2026`
2. `malta-tax-rates-2026-complete-guide`
3. `malta-ssc-contributions-2026-explained`
4. `malta-mortgage-guide-2026`
5. `malta-stamp-duty-complete-guide-2026`
6. `malta-minimum-wage-2026-guide`
7. `malta-public-holidays-2026-complete-guide`
8. `malta-pension-system-2026-guide`
9. `malta-rental-income-tax-15-percent-guide`
10. `malta-vacation-leave-entitlement-2026`

Kalan 28 yazı v1.1'de "More Guides" ile uzaktan çekilir (JSON manifest).

---

## 3. Content Pipeline

- [ ] Node script: `scripts/export-guides.ts`
  - Web'deki ilgili 10 MDX/MD dosyasını okur
  - Frontmatter'ı (title, description, publishedAt, category, tags) YAML olarak korur
  - İçindeki React bileşen referanslarını ve resim URL'lerini temizler
  - Relative linkleri `maltacalc://` deep link'lere çevirir
  - Her yazıyı `MaltaCalculator/Resources/Content/guides/{slug}.md` olarak yazar
- [ ] `guides-manifest.json` — başlık, description, cover image (SF Symbol + gradient), okuma süresi
- [ ] `npm run export:guides` ile pipeline çalıştırılır

---

## 4. Swift Modeli

```swift
struct Guide: Identifiable, Hashable, Sendable {
    let id: String              // slug
    let title: String
    let description: String
    let category: GuideCategory
    let tags: [String]
    let publishedAt: Date
    let readingMinutes: Int
    let symbolName: String
    let gradient: GradientName
    let markdownURL: URL        // Bundle.main path
}

@Observable
final class GuidesStore {
    private(set) var guides: [Guide] = []
    private(set) var bookmarks: Set<String> = []

    func load() { /* manifest parse */ }
    func toggleBookmark(_ id: String) { /* SwiftData */ }
}
```

---

## 5. Ekran Yapısı

```
GuidesScreen
├── SearchBar (.searchable)
├── CategoryFilterChips (DSChip, horizontal)
├── BookmarkedSection (varsa)
└── GuideGrid (LazyVGrid, 1 col iPhone, 2 col iPad)
    └── GuideCard -> GuideReader
```

### 5.1 `GuideCard`

- SF Symbol + gradient icon box
- Başlık, description (2 satır)
- Footer: okuma süresi + kategori pill + bookmark butonu

### 5.2 `GuideReader`

- `swift-markdown-ui` ile render
- Custom theme: `DesignSystem` tipografisi ile uyumlu
- Font boyutu slider (S/M/L/XL) — Dynamic Type ile entegre
- Reading progress bar (top)
- Floating action bar: bookmark, share, text-size
- Table of contents sheet (H2/H3'lerden üretilir)

---

## 6. Alt Adımlar

- [ ] `scripts/export-guides.ts` pipeline
- [ ] İlk 10 guide'ın export edilmiş markdown'u bundled
- [ ] `guides-manifest.json`
- [ ] `Guide` modeli + `GuidesStore`
- [ ] `GuidesScreen`, `GuideCard`, `GuideReader`
- [ ] Bookmark persistence (SwiftData)
- [ ] Reading position persistence
- [ ] Search içerisi tam metin arama (basit `String.contains`)
- [ ] Share: ShareLink ile link veya markdown text

---

## 7. A11y

- [ ] Reader: Dynamic Type AX3'e kadar kırılmadan render
- [ ] VoiceOver: başlıklar rotor ile navigable
- [ ] Reading progress bar → `accessibilityValue`
- [ ] Reduce Motion: progress animasyonu kapalı

---

## 8. Kabul Kriterleri

- [ ] 10 guide bundled ve açılıyor
- [ ] Markdown render'da bozuk yer yok
- [ ] Bookmark persistence çalışıyor
- [ ] Text size slider reader'ı anında güncelliyor
- [ ] Snapshot test light + dark

---

## 9. Sıradaki

[`10-persistence.md`](10-persistence.md)
