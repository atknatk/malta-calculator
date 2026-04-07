# Task 09 — Feature: Guides (Markdown Render, Bookmark)

> **Faz**: M6
> **Ön koşul**: `DesignSystem` + Navigation hazır
> **Çıktı**: Guides tab — bundled markdown reader, bookmark, search, text-size, share

---

## 1. Amaç

Web'deki blog yazılarının en önemli **10 tanesini** bundled Markdown olarak iOS'a taşımak. Okuma deneyimi premium, offline-first.

---

## 2. v1 İçin Bundled İçerik (10 guide)

| #   | Slug                                        | Kategori   | Tahmini Reading Time |
| --- | ------------------------------------------- | ---------- | -------------------- |
| 1   | `how-to-calculate-net-salary-malta-2026`    | Salary     | 8 min                |
| 2   | `malta-tax-rates-2026-complete-guide`       | Tax        | 10 min               |
| 3   | `malta-ssc-contributions-2026-explained`    | Tax        | 7 min                |
| 4   | `malta-mortgage-guide-2026`                 | Property   | 9 min                |
| 5   | `malta-stamp-duty-complete-guide-2026`      | Property   | 6 min                |
| 6   | `malta-minimum-wage-2026-guide`             | Employment | 5 min                |
| 7   | `malta-public-holidays-2026-complete-guide` | Leave      | 4 min                |
| 8   | `malta-pension-system-2026-guide`           | Retirement | 11 min               |
| 9   | `malta-rental-income-tax-15-percent-guide`  | Property   | 6 min                |
| 10  | `malta-vacation-leave-entitlement-2026`     | Leave      | 5 min                |

Kalan 28 yazı v1.1'de "More Guides" ile uzaktan çekilir.

---

## 3. Content Pipeline

### 3.1 Export Script — `scripts/export-guides.ts`

```typescript
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface GuideManifestEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  symbolName: string;
  gradientName: string;
}

const SELECTED_GUIDES = [
  "how-to-calculate-net-salary-malta-2026",
  "malta-tax-rates-2026-complete-guide",
  "malta-ssc-contributions-2026-explained",
  "malta-mortgage-guide-2026",
  "malta-stamp-duty-complete-guide-2026",
  "malta-minimum-wage-2026-guide",
  "malta-public-holidays-2026-complete-guide",
  "malta-pension-system-2026-guide",
  "malta-rental-income-tax-15-percent-guide",
  "malta-vacation-leave-entitlement-2026",
];

const BLOG_DIR = path.join(__dirname, "../src/app/blog");
const OUT_DIR = path.join(
  __dirname,
  "../ios-app/MaltaCalculator/Resources/Content/guides",
);
fs.mkdirSync(OUT_DIR, { recursive: true });

const manifest: GuideManifestEntry[] = [];

for (const slug of SELECTED_GUIDES) {
  // 1. Find the page.tsx and extract markdown content
  const pagePath = path.join(BLOG_DIR, slug, "page.tsx");
  if (!fs.existsSync(pagePath)) {
    console.warn(`⚠ ${slug}: page.tsx not found`);
    continue;
  }

  const source = fs.readFileSync(pagePath, "utf-8");

  // 2. Extract content (custom logic — depends on how page.tsx structures content)
  const content = extractMarkdownFromPage(source);

  // 3. Strip JSX, fix relative links/images
  const cleaned = sanitizeMarkdown(content, slug);

  // 4. Extract metadata from page.tsx const declarations
  const meta = extractMetadata(source);

  // 5. Compute reading time
  const wordCount = cleaned.split(/\s+/).length;
  const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // 6. Write markdown
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.md`), cleaned);

  // 7. Add to manifest
  manifest.push({
    slug,
    title: meta.title,
    description: meta.description,
    category: meta.category ?? "general",
    tags: meta.tags ?? [],
    publishedAt: meta.publishedAt ?? new Date().toISOString(),
    updatedAt: meta.updatedAt ?? new Date().toISOString(),
    readingMinutes,
    symbolName: pickSymbol(meta.category),
    gradientName: pickGradient(meta.category),
  });

  console.log(`✓ ${slug} (${readingMinutes} min)`);
}

fs.writeFileSync(
  path.join(
    __dirname,
    "../ios-app/MaltaCalculator/Resources/Content/guides-manifest.json",
  ),
  JSON.stringify(
    { version: "1.0", generatedAt: new Date().toISOString(), guides: manifest },
    null,
    2,
  ),
);

console.log(`\nDone. ${manifest.length} guides exported.`);

// === Helper functions ===
function extractMarkdownFromPage(source: string): string {
  // Custom parser depending on web's blog page structure
  // Use regex / AST to extract <p>, <h1>, <ul> etc and convert to markdown
  // OR keep a parallel `.md` source file in the web project
  return ""; // implementation
}

function sanitizeMarkdown(md: string, slug: string): string {
  return (
    md
      // Strip relative links to other blog posts → maltacalc:// deep links
      .replace(/\]\(\/blog\/([^)]+)\)/g, "](maltacalc://guides/$1)")
      // Strip image references (we don't bundle images v1)
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")
      // Trim
      .trim()
  );
}

function extractMetadata(source: string): Partial<GuideManifestEntry> {
  // Parse `export const metadata = { ... }` from page.tsx
  return {};
}

function pickSymbol(category?: string): string {
  switch (category) {
    case "salary":
      return "eurosign.circle.fill";
    case "tax":
      return "doc.text.fill";
    case "property":
      return "house.fill";
    case "retirement":
      return "leaf.fill";
    case "leave":
      return "calendar";
    case "employment":
      return "briefcase.fill";
    default:
      return "book.fill";
  }
}

function pickGradient(category?: string): string {
  return category ?? "default";
}
```

> **Pratik öneri**: Web tarafında her blog post için **paralel `.md` source** dosyası tutmak en pratik yol. `page.tsx` o `.md`'yi import edip render eder, script de aynı `.md`'yi iOS'a kopyalar. Bu, JSX parse karmaşıklığını ortadan kaldırır.

Önerilen yapı (web tarafında):

```text
src/app/blog/{slug}/
├── page.tsx           # Server component, content.md'yi import eder
└── content.md         # Single source of truth
```

### 3.2 NPM Script

```json
{
  "scripts": {
    "export:guides": "tsx scripts/export-guides.ts"
  }
}
```

### 3.3 CI Drift Check

`scripts/guides-drift-check.sh` — bundled markdown'lar web ile sync mı?

---

## 4. Manifest JSON Şeması

`Resources/Content/guides-manifest.json`:

```json
{
  "version": "1.0",
  "generatedAt": "2026-04-07T00:00:00Z",
  "guides": [
    {
      "slug": "malta-tax-rates-2026-complete-guide",
      "title": "Malta Tax Rates 2026 Complete Guide",
      "description": "Everything you need to know about income tax brackets, SSC contributions and deductions in Malta for 2026.",
      "category": "tax",
      "tags": ["tax", "2026", "income-tax", "ssc"],
      "publishedAt": "2026-01-15T00:00:00Z",
      "updatedAt": "2026-03-20T00:00:00Z",
      "readingMinutes": 10,
      "symbolName": "doc.text.fill",
      "gradientName": "tax"
    }
  ]
}
```

---

## 5. Swift Modeli

### 5.1 `Guide.swift`

```swift
import Foundation

public struct Guide: Identifiable, Hashable, Sendable, Codable {
    public let slug: String
    public let title: String
    public let description: String
    public let category: GuideCategory
    public let tags: [String]
    public let publishedAt: Date
    public let updatedAt: Date
    public let readingMinutes: Int
    public let symbolName: String
    public let gradientName: String

    public var id: String { slug }
}

public enum GuideCategory: String, Codable, Sendable, CaseIterable {
    case salary, tax, property, banking, retirement, employment, leave, immigration, general

    public var title: LocalizedStringResource {
        switch self {
        case .salary: return "Salary"
        case .tax: return "Tax"
        case .property: return "Property"
        case .banking: return "Banking"
        case .retirement: return "Retirement"
        case .employment: return "Employment"
        case .leave: return "Leave"
        case .immigration: return "Immigration"
        case .general: return "General"
        }
    }
}
```

### 5.2 `GuidesStore.swift`

```swift
import Foundation
import Observation
import SwiftData

@Observable
@MainActor
final class GuidesStore {
    private(set) var allGuides: [Guide] = []
    private(set) var bookmarkedSlugs: Set<String> = []
    var searchText: String = "" { didSet { applyFilter() } }
    var selectedCategory: GuideCategory? = nil { didSet { applyFilter() } }
    private(set) var filtered: [Guide] = []

    private var modelContext: ModelContext?

    init() {
        loadManifest()
    }

    func bind(context: ModelContext) {
        self.modelContext = context
        loadBookmarks()
    }

    // MARK: - Loading

    private func loadManifest() {
        guard let url = Bundle.main.url(
            forResource: "guides-manifest",
            withExtension: "json",
            subdirectory: "Content"
        ) else {
            print("⚠ guides-manifest.json missing")
            return
        }
        do {
            let data = try Data(contentsOf: url)
            struct Wrapper: Decodable {
                let version: String
                let guides: [Guide]
            }
            let decoder = JSONDecoder()
            decoder.dateDecodingStrategy = .iso8601
            let wrapper = try decoder.decode(Wrapper.self, from: data)
            self.allGuides = wrapper.guides.sorted { $0.publishedAt > $1.publishedAt }
            self.filtered = self.allGuides
        } catch {
            print("Manifest load error: \(error)")
        }
    }

    private func loadBookmarks() {
        guard let modelContext else { return }
        let descriptor = FetchDescriptor<GuideBookmark>()
        guard let bookmarks = try? modelContext.fetch(descriptor) else { return }
        self.bookmarkedSlugs = Set(bookmarks.map(\.slug))
    }

    // MARK: - Markdown Loading

    func loadMarkdown(for slug: String) -> String {
        guard let url = Bundle.main.url(
            forResource: slug,
            withExtension: "md",
            subdirectory: "Content/guides"
        ),
              let content = try? String(contentsOf: url, encoding: .utf8)
        else { return "# Not Found\n\nThis guide is unavailable." }
        return content
    }

    // MARK: - Bookmarks

    func toggleBookmark(_ slug: String) {
        guard let modelContext else { return }
        if bookmarkedSlugs.contains(slug) {
            let descriptor = FetchDescriptor<GuideBookmark>(
                predicate: #Predicate { $0.slug == slug }
            )
            if let existing = try? modelContext.fetch(descriptor).first {
                modelContext.delete(existing)
            }
            bookmarkedSlugs.remove(slug)
        } else {
            modelContext.insert(GuideBookmark(slug: slug, bookmarkedAt: .now))
            bookmarkedSlugs.insert(slug)
        }
        try? modelContext.save()
    }

    func isBookmarked(_ slug: String) -> Bool {
        bookmarkedSlugs.contains(slug)
    }

    var bookmarkedGuides: [Guide] {
        allGuides.filter { bookmarkedSlugs.contains($0.slug) }
    }

    // MARK: - Filter

    private func applyFilter() {
        var result = allGuides
        if let category = selectedCategory {
            result = result.filter { $0.category == category }
        }
        let trimmed = searchText.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()
        if !trimmed.isEmpty {
            result = result.filter { guide in
                guide.title.lowercased().contains(trimmed)
                    || guide.description.lowercased().contains(trimmed)
                    || guide.tags.contains { $0.lowercased().contains(trimmed) }
            }
        }
        self.filtered = result
    }
}
```

---

## 6. Ekran Yapısı

### 6.1 `GuidesListScreen.swift`

```swift
import SwiftUI
import DesignSystem
import SwiftData

struct GuidesListScreen: View {
    @State private var store = GuidesStore()
    @Environment(\.modelContext) private var modelContext
    @Environment(AppState.self) private var appState

    private let columns = [GridItem(.adaptive(minimum: 280, maximum: 400), spacing: DSSpacing.md)]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: DSSpacing.lg) {
                categoryChips
                if !store.bookmarkedGuides.isEmpty && store.searchText.isEmpty && store.selectedCategory == nil {
                    bookmarkedSection
                }
                guidesGrid
            }
            .padding(.horizontal)
            .padding(.bottom, DSSpacing.xxl)
        }
        .searchable(text: $store.searchText, prompt: "Search guides")
        .background { MeshBackground().ignoresSafeArea() }
        .navigationTitle("Guides")
        .onAppear { store.bind(context: modelContext) }
    }

    private var categoryChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: DSSpacing.xs) {
                DSChip(title: "All", isSelected: store.selectedCategory == nil) {
                    store.selectedCategory = nil
                }
                ForEach(GuideCategory.allCases, id: \.self) { category in
                    DSChip(
                        title: String(localized: category.title),
                        isSelected: store.selectedCategory == category
                    ) {
                        store.selectedCategory = (store.selectedCategory == category) ? nil : category
                    }
                }
            }
            .padding(.horizontal, DSSpacing.xs)
        }
    }

    private var bookmarkedSection: some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            HStack {
                Image(systemName: "bookmark.fill")
                    .foregroundStyle(DSColor.maltaGold)
                Text("Bookmarked").font(DSFont.headingS)
            }
            ForEach(store.bookmarkedGuides) { guide in
                GuideCard(guide: guide, isBookmarked: true) {
                    appState.guidesRouter.push(.reader(guide.slug))
                }
            }
        }
    }

    private var guidesGrid: some View {
        LazyVGrid(columns: columns, spacing: DSSpacing.md) {
            ForEach(store.filtered) { guide in
                GuideCard(guide: guide, isBookmarked: store.isBookmarked(guide.slug)) {
                    appState.guidesRouter.push(.reader(guide.slug))
                }
            }
        }
    }
}
```

### 6.2 `GuideCard.swift`

```swift
import SwiftUI
import DesignSystem

struct GuideCard: View {
    let guide: Guide
    let isBookmarked: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(alignment: .top, spacing: DSSpacing.md) {
                ZStack {
                    RoundedRectangle(cornerRadius: DSRadius.md)
                        .fill(DSGradient.primary)
                        .frame(width: 56, height: 56)
                    Image(systemName: guide.symbolName)
                        .font(.title2.weight(.semibold))
                        .foregroundStyle(.white)
                }
                VStack(alignment: .leading, spacing: 4) {
                    Text(guide.title)
                        .font(DSFont.body(16, weight: .semibold))
                        .foregroundStyle(DSColor.textPrimary)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                    Text(guide.description)
                        .font(DSFont.body(13))
                        .foregroundStyle(DSColor.textSecondary)
                        .lineLimit(3)
                        .multilineTextAlignment(.leading)
                    HStack(spacing: DSSpacing.xs) {
                        Label("\(guide.readingMinutes) min", systemImage: "clock")
                            .font(DSFont.caption)
                            .foregroundStyle(DSColor.textTertiary)
                        Text(String(localized: guide.category.title))
                            .font(DSFont.caption)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(DSColor.maltaGold.opacity(0.12), in: Capsule())
                            .foregroundStyle(DSColor.maltaGold)
                    }
                }
                if isBookmarked {
                    Image(systemName: "bookmark.fill")
                        .foregroundStyle(DSColor.maltaGold)
                        .padding(.top, 4)
                }
            }
            .padding(DSSpacing.md)
            .frame(maxWidth: .infinity, alignment: .leading)
            .liquidGlass()
        }
        .buttonStyle(.plain)
    }
}
```

### 6.3 `GuideReaderScreen.swift`

```swift
import SwiftUI
import DesignSystem
import MarkdownUI
import SwiftData

struct GuideReaderScreen: View {
    let slug: String
    @State private var store = GuidesStore()
    @Environment(\.modelContext) private var modelContext
    @AppStorage("guides.fontScale") private var fontScale: Double = 1.0
    @State private var scrollProgress: Double = 0
    @State private var markdown: String = ""
    @State private var guide: Guide?

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                VStack(alignment: .leading, spacing: DSSpacing.md) {
                    if let guide {
                        header(guide)
                    }
                    Markdown(markdown)
                        .markdownTheme(.maltaCalculator(fontScale: fontScale))
                        .padding(.horizontal, DSSpacing.md)
                    Spacer().frame(height: 80)
                }
            }
            .background(GeometryReader { geo in
                Color.clear.preference(
                    key: ScrollOffsetPreferenceKey.self,
                    value: geo.frame(in: .named("scroll")).minY
                )
            })
        }
        .coordinateSpace(name: "scroll")
        .overlay(alignment: .top) {
            progressBar
        }
        .background { MeshBackground().ignoresSafeArea() }
        .toolbar {
            ToolbarItemGroup(placement: .topBarTrailing) {
                fontSizeMenu
                bookmarkButton
                shareButton
            }
        }
        .onAppear {
            store.bind(context: modelContext)
            self.guide = store.allGuides.first { $0.slug == slug }
            self.markdown = store.loadMarkdown(for: slug)
            saveReadingPosition(0)
        }
    }

    private func header(_ guide: Guide) -> some View {
        VStack(alignment: .leading, spacing: DSSpacing.sm) {
            HStack {
                Label("\(guide.readingMinutes) min read", systemImage: "clock")
                    .font(DSFont.caption)
                Spacer()
                Text(guide.publishedAt, style: .date)
                    .font(DSFont.caption)
            }
            .foregroundStyle(DSColor.textSecondary)
            Text(guide.title)
                .font(DSFont.display(28))
        }
        .padding(DSSpacing.md)
    }

    private var progressBar: some View {
        GeometryReader { geo in
            Rectangle()
                .fill(DSGradient.primary)
                .frame(width: geo.size.width * scrollProgress, height: 3)
        }
        .frame(height: 3)
    }

    private var fontSizeMenu: some View {
        Menu {
            ForEach([0.85, 1.0, 1.15, 1.3], id: \.self) { scale in
                Button("\(Int(scale * 100))%") { fontScale = scale }
            }
        } label: {
            Image(systemName: "textformat.size")
        }
    }

    private var bookmarkButton: some View {
        Button {
            store.toggleBookmark(slug)
        } label: {
            Image(systemName: store.isBookmarked(slug) ? "bookmark.fill" : "bookmark")
                .foregroundStyle(store.isBookmarked(slug) ? DSColor.maltaGold : DSColor.textSecondary)
        }
        .sensoryFeedback(.success, trigger: store.isBookmarked(slug))
    }

    private var shareButton: some View {
        let url = URL(string: "https://maltacalculator.com/blog/\(slug)")!
        return ShareLink(item: url, subject: Text(guide?.title ?? "Malta Calculator Guide"))
    }

    private func saveReadingPosition(_ position: Double) {
        // SwiftData update on bookmark
    }
}

struct ScrollOffsetPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {}
}

extension MarkdownUI.Theme {
    static func maltaCalculator(fontScale: Double) -> Self {
        Theme.basic
            .text { FontFamilyVariant(.normal) }
            // ... custom fonts, colors, code blocks
    }
}
```

---

## 7. Reading Position Persistence

`GuideBookmark` modeline `readingPosition: Double` ekliyoruz (Task 10). ScrollView'in `geometry.frame.minY` üzerinden 0...1 progress hesaplanır, debounce ile her 2 saniyede bir SwiftData'ya yazılır.

Açılışta önce kayıtlı pozisyona scroll eder.

---

## 8. Alt Adımlar

- [ ] Web tarafında 10 guide için `.md` source dosyaları (içerik halen page.tsx içinde ise migration)
- [ ] `scripts/export-guides.ts` yaz ve test et
- [ ] `npm run export:guides` ile bundled dosyaları üret
- [ ] `Guide` modeli + `GuidesStore`
- [ ] `GuidesListScreen`
- [ ] `GuideCard`
- [ ] `GuideReaderScreen` + `Markdown` integration
- [ ] Custom `Markdown.Theme.maltaCalculator`
- [ ] Bookmark persistence (SwiftData — Task 10 ile birlikte)
- [ ] Reading position persistence
- [ ] Search içerisi tam metin arama (basit `String.contains`)
- [ ] Font size slider (`@AppStorage("guides.fontScale")`)
- [ ] ShareLink ile dışa aktar
- [ ] Snapshot tests

---

## 9. Markdown Theme

Custom `MarkdownUI.Theme`:

- Heading 1 → DSFont.display(28), DSColor.textPrimary
- Heading 2 → DSFont.heading(22), DSColor.textPrimary
- Heading 3 → DSFont.heading(18), DSColor.textPrimary
- Body → DSFont.body(16), DSColor.textPrimary, line height 1.6
- Code block → DSFont.mono, DSColor.surfaceMuted background, rounded
- Inline code → DSFont.mono, DSColor.warmSand background
- Link → DSColor.maltaGold, underline
- Blockquote → left border 4px DSColor.maltaGold, italic
- List → bullet/number styling
- Table → DSColor.surface bg, borders DSColor.textSecondary opacity 0.1

---

## 10. A11y

- [ ] Reader: Dynamic Type AX3'e kadar kırılmadan render
- [ ] VoiceOver: başlıklar rotor ile navigable (`accessibilityHeading`)
- [ ] Reading progress bar → `accessibilityValue("\(Int(progress * 100)) percent read")`
- [ ] Reduce Motion: progress animasyonu kapalı, scroll-to-position smooth değil
- [ ] Bookmark butonu durumu okunuyor ("bookmarked" / "not bookmarked")
- [ ] Font scale 0.85 - 1.30 arası, AX kategori desteği

---

## 11. Kabul Kriterleri

- [ ] 10 guide bundled ve açılıyor (offline)
- [ ] Markdown render'da bozuk yer yok
- [ ] Bookmark persistence çalışıyor
- [ ] Bookmark'lar liste ekranında ayrı section'da görünüyor
- [ ] Text size slider reader'ı anında güncelliyor (smooth)
- [ ] Reading progress bar üstte görünüyor
- [ ] Reading position persistence: ekran kapanıp açıldığında aynı yere döner
- [ ] Search içerisi case-insensitive doğru sonuç verir
- [ ] Snapshot test light + dark + AX3
- [ ] CI drift check: bundled markdown'lar web ile sync

---

## 12. Sıradaki

[`10-persistence.md`](10-persistence.md)
