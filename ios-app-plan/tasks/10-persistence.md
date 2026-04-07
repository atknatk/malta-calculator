# Task 10 — Persistence (SwiftData, iCloud sync)

> **Faz**: M7
> **Ön koşul**: Salary + en az 4 calculator detail ekranı çalışıyor
> **Çıktı**: SwiftData modelleri, store wrapper'ları, opt-in iCloud sync, migration plan

---

## 1. Amaç

Kullanıcının hesaplamalarını, rehber bookmark'larını, recently used'ı ve tercihlerini kalıcı saklamak. Opsiyonel iCloud ile cihazlar arası senkronizasyon (default kapalı, opt-in).

---

## 2. Modeller (SwiftData)

### 2.1 `SavedCalculation.swift`

```swift
import Foundation
import SwiftData

@Model
final class SavedCalculation {
    @Attribute(.unique) var id: UUID
    var calculatorID: String
    var title: String
    var createdAt: Date
    var updatedAt: Date
    var inputsJSON: Data
    var summary: String
    var pinned: Bool
    var tags: [String]
    var notes: String?

    init(
        id: UUID = UUID(),
        calculatorID: String,
        title: String,
        inputsJSON: Data,
        summary: String,
        pinned: Bool = false,
        tags: [String] = [],
        notes: String? = nil
    ) {
        self.id = id
        self.calculatorID = calculatorID
        self.title = title
        self.createdAt = .now
        self.updatedAt = .now
        self.inputsJSON = inputsJSON
        self.summary = summary
        self.pinned = pinned
        self.tags = tags
        self.notes = notes
    }
}
```

### 2.2 `CalculatorUsage.swift`

```swift
import Foundation
import SwiftData

@Model
final class CalculatorUsage {
    @Attribute(.unique) var id: String   // CalculatorID rawValue
    var lastUsedAt: Date
    var count: Int

    init(id: String, lastUsedAt: Date = .now, count: Int = 0) {
        self.id = id
        self.lastUsedAt = lastUsedAt
        self.count = count
    }
}
```

### 2.3 `GuideBookmark.swift`

```swift
import Foundation
import SwiftData

@Model
final class GuideBookmark {
    @Attribute(.unique) var slug: String
    var bookmarkedAt: Date
    var readingPosition: Double  // 0...1
    var lastOpenedAt: Date?

    init(slug: String, bookmarkedAt: Date = .now, readingPosition: Double = 0) {
        self.slug = slug
        self.bookmarkedAt = bookmarkedAt
        self.readingPosition = readingPosition
        self.lastOpenedAt = nil
    }
}
```

### 2.4 `UserPreferences.swift`

```swift
import Foundation
import SwiftData

@Model
final class UserPreferences {
    @Attribute(.unique) var id: String  // "default"
    var themeRawValue: String
    var currencyCode: String
    var defaultYear: Int
    var hapticsEnabled: Bool
    var iCloudSyncEnabled: Bool
    var hasCompletedOnboarding: Bool
    var preferredFontScale: Double
    var taxConfigVersion: String?
    var lastConfigCheckAt: Date?

    init(
        id: String = "default",
        themeRawValue: String = "system",
        currencyCode: String = "EUR",
        defaultYear: Int = 2026,
        hapticsEnabled: Bool = true,
        iCloudSyncEnabled: Bool = false,
        hasCompletedOnboarding: Bool = false,
        preferredFontScale: Double = 1.0
    ) {
        self.id = id
        self.themeRawValue = themeRawValue
        self.currencyCode = currencyCode
        self.defaultYear = defaultYear
        self.hapticsEnabled = hapticsEnabled
        self.iCloudSyncEnabled = iCloudSyncEnabled
        self.hasCompletedOnboarding = hasCompletedOnboarding
        self.preferredFontScale = preferredFontScale
    }
}

enum AppTheme: String, CaseIterable, Sendable {
    case system, light, dark

    var colorScheme: ColorScheme? {
        switch self {
        case .system: return nil
        case .light: return .light
        case .dark: return .dark
        }
    }
}
```

---

## 3. ModelContainer

### 3.1 `MaltaCalculatorApp.swift` (Updated)

```swift
import SwiftUI
import SwiftData

@main
struct MaltaCalculatorApp: App {
    let container: ModelContainer = makeContainer()

    var body: some Scene {
        WindowGroup {
            RootView()
        }
        .modelContainer(container)
    }

    private static func makeContainer() -> ModelContainer {
        let schema = Schema([
            SavedCalculation.self,
            CalculatorUsage.self,
            GuideBookmark.self,
            UserPreferences.self,
        ])

        // Check user preference for iCloud sync
        let useICloud = UserDefaults.standard.bool(forKey: "iCloudSyncEnabled")

        let configuration: ModelConfiguration
        if useICloud {
            configuration = ModelConfiguration(
                schema: schema,
                isStoredInMemoryOnly: false,
                cloudKitDatabase: .private("iCloud.com.maltacalculator.app")
            )
        } else {
            configuration = ModelConfiguration(
                schema: schema,
                isStoredInMemoryOnly: false,
                cloudKitDatabase: .none
            )
        }

        do {
            return try ModelContainer(for: schema, configurations: [configuration])
        } catch {
            // Fatal: container failed
            fatalError("Failed to create ModelContainer: \(error)")
        }
    }
}
```

> **Önemli**: iCloud sync için container yeniden yaratılması gerekir. Settings'te toggle değiştiğinde uygulamanın restart edilmesi gerekir → kullanıcıya alert göster.

---

## 4. Store Wrappers

### 4.1 `SavedCalculationStore.swift`

```swift
import Foundation
import SwiftData
import Observation

@Observable
@MainActor
final class SavedCalculationStore {
    private(set) var items: [SavedCalculation] = []
    private(set) var pinnedItems: [SavedCalculation] = []

    private let context: ModelContext

    init(context: ModelContext) {
        self.context = context
        refresh()
    }

    // MARK: - Read

    func refresh() {
        let descriptor = FetchDescriptor<SavedCalculation>(
            sortBy: [
                SortDescriptor(\.pinned, order: .reverse),
                SortDescriptor(\.updatedAt, order: .reverse),
            ]
        )
        items = (try? context.fetch(descriptor)) ?? []
        pinnedItems = items.filter(\.pinned)
    }

    func items(forCalculator id: String) -> [SavedCalculation] {
        items.filter { $0.calculatorID == id }
    }

    // MARK: - Create

    func save<T: Encodable>(
        calculatorID: String,
        title: String,
        summary: String,
        inputs: T,
        tags: [String] = [],
        notes: String? = nil
    ) throws {
        let data = try JSONEncoder().encode(inputs)
        let item = SavedCalculation(
            calculatorID: calculatorID,
            title: title,
            inputsJSON: data,
            summary: summary,
            tags: tags,
            notes: notes
        )
        context.insert(item)
        try context.save()
        refresh()
    }

    // MARK: - Update

    func togglePin(_ item: SavedCalculation) {
        item.pinned.toggle()
        item.updatedAt = .now
        try? context.save()
        refresh()
    }

    func updateNotes(_ item: SavedCalculation, notes: String?) {
        item.notes = notes
        item.updatedAt = .now
        try? context.save()
        refresh()
    }

    // MARK: - Delete

    func delete(_ item: SavedCalculation) {
        context.delete(item)
        try? context.save()
        refresh()
    }

    func deleteAll() throws {
        for item in items {
            context.delete(item)
        }
        try context.save()
        refresh()
    }

    // MARK: - Decode

    func decodeInputs<T: Decodable>(of item: SavedCalculation, as type: T.Type) -> T? {
        try? JSONDecoder().decode(type, from: item.inputsJSON)
    }
}
```

### 4.2 `UserPreferencesStore.swift`

```swift
import Foundation
import SwiftData
import Observation

@Observable
@MainActor
final class UserPreferencesStore {
    private(set) var preferences: UserPreferences

    private let context: ModelContext

    init(context: ModelContext) {
        self.context = context
        // Fetch or create the singleton
        let descriptor = FetchDescriptor<UserPreferences>(
            predicate: #Predicate { $0.id == "default" }
        )
        if let existing = try? context.fetch(descriptor).first {
            self.preferences = existing
        } else {
            let new = UserPreferences()
            context.insert(new)
            try? context.save()
            self.preferences = new
        }
    }

    func update(_ block: (UserPreferences) -> Void) {
        block(preferences)
        try? context.save()
    }

    var theme: AppTheme {
        get { AppTheme(rawValue: preferences.themeRawValue) ?? .system }
        set {
            preferences.themeRawValue = newValue.rawValue
            try? context.save()
        }
    }
}
```

---

## 5. iCloud Opt-In Flow

### 5.1 Onboarding Screen (Optional)

İlk launch'ta veya Settings'ten erişilebilir basit bir explanation:

```swift
struct ICloudOnboardingSheet: View {
    @Binding var isPresented: Bool
    let onAccept: () -> Void
    let onDecline: () -> Void

    var body: some View {
        VStack(spacing: DSSpacing.xl) {
            Image(systemName: "icloud.fill")
                .font(.system(size: 60))
                .foregroundStyle(DSGradient.secondary)

            VStack(spacing: DSSpacing.sm) {
                Text("Sync with iCloud")
                    .font(DSFont.heading(24))
                Text("Keep your saved calculations and bookmarks in sync across all your Apple devices. Your data stays in your private iCloud — we never see it.")
                    .font(DSFont.body())
                    .foregroundStyle(DSColor.textSecondary)
                    .multilineTextAlignment(.center)
            }

            VStack(spacing: DSSpacing.sm) {
                bullet("Encrypted in your private iCloud")
                bullet("Works offline, syncs when online")
                bullet("Free, included with iCloud")
                bullet("Can be turned off anytime")
            }

            DSButton("Enable iCloud Sync", variant: .primary) { onAccept() }
            DSButton("Maybe Later", variant: .ghost) { onDecline() }
        }
        .padding(DSSpacing.xl)
    }

    private func bullet(_ text: String) -> some View {
        HStack {
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(DSColor.success)
            Text(text)
                .font(DSFont.body(14))
            Spacer()
        }
    }
}
```

### 5.2 Settings Toggle Behavior

```swift
Toggle("iCloud Sync", isOn: $preferencesStore.preferences.iCloudSyncEnabled)
    .onChange(of: preferencesStore.preferences.iCloudSyncEnabled) { _, newValue in
        UserDefaults.standard.set(newValue, forKey: "iCloudSyncEnabled")
        showRestartAlert = true
    }
```

---

## 6. Migration Strategy

### 6.1 `SchemaMigrationPlan`

```swift
import SwiftData

enum MaltaCalculatorMigrationPlan: SchemaMigrationPlan {
    static var schemas: [any VersionedSchema.Type] {
        [V1Schema.self]
    }

    static var stages: [MigrationStage] {
        []  // No migrations yet — only V1
    }
}

enum V1Schema: VersionedSchema {
    static var versionIdentifier = Schema.Version(1, 0, 0)

    static var models: [any PersistentModel.Type] {
        [
            SavedCalculation.self,
            CalculatorUsage.self,
            GuideBookmark.self,
            UserPreferences.self,
        ]
    }
}
```

### 6.2 V2'ye Geçiş Planlaması

İleride alan eklendiğinde:

```swift
enum V2Schema: VersionedSchema {
    static var versionIdentifier = Schema.Version(2, 0, 0)
    static var models: [any PersistentModel.Type] { [...] }
}

static let migrateV1toV2 = MigrationStage.custom(
    fromVersion: V1Schema.self,
    toVersion: V2Schema.self,
    willMigrate: nil,
    didMigrate: { context in
        // Custom logic
    }
)
```

---

## 7. Export / Import (v1.1 hazırlık)

`ExportService.swift` (skeleton):

```swift
struct ExportService {
    let context: ModelContext

    func exportAllCalculations() throws -> Data {
        let descriptor = FetchDescriptor<SavedCalculation>()
        let items = try context.fetch(descriptor)
        let payload = items.map { item in
            ExportPayload(
                id: item.id,
                calculatorID: item.calculatorID,
                title: item.title,
                createdAt: item.createdAt,
                inputs: item.inputsJSON.base64EncodedString(),
                summary: item.summary,
                tags: item.tags,
                notes: item.notes
            )
        }
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return try encoder.encode(payload)
    }

    struct ExportPayload: Codable {
        let id: UUID
        let calculatorID: String
        let title: String
        let createdAt: Date
        let inputs: String  // base64
        let summary: String
        let tags: [String]
        let notes: String?
    }
}
```

---

## 8. Alt Adımlar

- [ ] 4 @Model dosyası (SavedCalculation, CalculatorUsage, GuideBookmark, UserPreferences)
- [ ] `MaltaCalculatorApp` ModelContainer kurulumu
- [ ] `SavedCalculationStore` actor/observable
- [ ] `UserPreferencesStore` actor/observable
- [ ] Salary feature'da "Save" butonu → store.save(...)
- [ ] Each calculator detail'da "Save" butonu
- [ ] `CalculatorHistoryScreen` (saved list, pin, delete)
- [ ] `CalculatorUsage` recently used beslemesi (Task 07'de bağlanmıştı)
- [ ] `GuideBookmark` Guides feature'ı bağlantısı (Task 09)
- [ ] iCloud opt-in onboarding sheet
- [ ] Settings toggle + restart alert
- [ ] `SchemaMigrationPlan` (V1)
- [ ] Unit testler (in-memory container)
- [ ] CloudKit container ID Apple Developer'da oluştur

---

## 9. Unit Tests

```swift
import Testing
import SwiftData
@testable import MaltaCalculator

@Suite("SavedCalculationStore")
@MainActor
struct SavedCalculationStoreTests {
    func makeStore() throws -> SavedCalculationStore {
        let schema = Schema([
            SavedCalculation.self,
            CalculatorUsage.self,
            GuideBookmark.self,
            UserPreferences.self,
        ])
        let config = ModelConfiguration(
            schema: schema,
            isStoredInMemoryOnly: true
        )
        let container = try ModelContainer(for: schema, configurations: [config])
        return SavedCalculationStore(context: container.mainContext)
    }

    @Test("save then refresh shows item")
    func saveAndRefresh() throws {
        let store = try makeStore()
        try store.save(
            calculatorID: "salary",
            title: "Test",
            summary: "€1,000",
            inputs: ["gross": "30000"]
        )
        #expect(store.items.count == 1)
        #expect(store.items.first?.title == "Test")
    }

    @Test("pin moves item to top")
    func pin() throws {
        let store = try makeStore()
        try store.save(calculatorID: "salary", title: "A", summary: "", inputs: [String: String]())
        try store.save(calculatorID: "salary", title: "B", summary: "", inputs: [String: String]())
        let secondItem = store.items[1]
        store.togglePin(secondItem)
        #expect(store.items.first?.pinned == true)
    }

    @Test("delete removes item")
    func delete() throws {
        let store = try makeStore()
        try store.save(calculatorID: "salary", title: "X", summary: "", inputs: [String: String]())
        store.delete(store.items[0])
        #expect(store.items.isEmpty)
    }

    @Test("deleteAll empties store")
    func deleteAll() throws {
        let store = try makeStore()
        for i in 0..<5 {
            try store.save(calculatorID: "salary", title: "\(i)", summary: "", inputs: [String: String]())
        }
        try store.deleteAll()
        #expect(store.items.isEmpty)
    }

    @Test("filter by calculator id")
    func filterByCalculator() throws {
        let store = try makeStore()
        try store.save(calculatorID: "salary", title: "S", summary: "", inputs: [String: String]())
        try store.save(calculatorID: "mortgage", title: "M", summary: "", inputs: [String: String]())
        #expect(store.items(forCalculator: "salary").count == 1)
        #expect(store.items(forCalculator: "mortgage").count == 1)
    }
}
```

---

## 10. Kabul Kriterleri

- [ ] App kapatılıp açıldığında kayıtlı hesaplamalar görünüyor
- [ ] iCloud toggle açılıp app restart edildiğinde ikinci cihaza senkron oluyor (manual test)
- [ ] Geçmiş listesi 1000+ item ile akıcı (LazyVStack)
- [ ] Pin / Unpin doğru sıralama
- [ ] Delete confirmation alert
- [ ] Unit test: CRUD operasyonları
- [ ] In-memory container test setup'ı kurulu
- [ ] Migration plan iskeleti hazır
- [ ] CloudKit container ID Developer Console'da kayıtlı
- [ ] Settings'te "Clear all data" çalışıyor

---

## 11. Sıradaki

[`11-share-export.md`](11-share-export.md)
