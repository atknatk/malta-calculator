# Task 10 — Persistence (SwiftData, iCloud sync)

> **Faz**: M7
> **Ön koşul**: Salary + Calculators detay ekranları çalışıyor
> **Çıktı**: Geçmiş hesaplamalar, bookmark'lar, kullanıcı tercihleri — SwiftData + opt-in iCloud

---

## 1. Amaç

Kullanıcının hesaplamalarını, rehber bookmark'larını ve tercihlerini kalıcı saklamak. Opsiyonel iCloud ile cihazlar arası senkronizasyon.

---

## 2. Modeller (SwiftData)

```swift
@Model
final class SavedCalculation {
    @Attribute(.unique) var id: UUID
    var calculatorID: String          // CalculatorID rawValue
    var title: String
    var createdAt: Date
    var updatedAt: Date
    var inputsJSON: Data              // serialized input
    var summary: String               // quick preview (e.g., "€1,248/mo")
    var pinned: Bool = false

    init(id: UUID = UUID(), calculatorID: String, title: String,
         inputsJSON: Data, summary: String) { ... }
}

@Model
final class CalculatorUsage {
    @Attribute(.unique) var id: String   // CalculatorID rawValue
    var lastUsedAt: Date
    var count: Int = 0
}

@Model
final class GuideBookmark {
    @Attribute(.unique) var slug: String
    var bookmarkedAt: Date
    var readingPosition: Double = 0      // 0...1
}

@Model
final class UserPreferences {
    @Attribute(.unique) var id: String = "default"
    var themeRawValue: String = "system"        // system/light/dark
    var currencyCode: String = "EUR"
    var defaultYear: Int = 2026
    var hapticsEnabled: Bool = true
    var iCloudSyncEnabled: Bool = false
}
```

---

## 3. ModelContainer

```swift
@main
struct MaltaCalculatorApp: App {
    let container: ModelContainer = {
        let schema = Schema([
            SavedCalculation.self,
            CalculatorUsage.self,
            GuideBookmark.self,
            UserPreferences.self
        ])
        let config = ModelConfiguration(
            schema: schema,
            cloudKitDatabase: .private("iCloud.com.maltacalculator.app")
        )
        return try! ModelContainer(for: schema, configurations: [config])
    }()

    var body: some Scene {
        WindowGroup {
            RootView()
        }
        .modelContainer(container)
    }
}
```

- iCloud container yalnızca `UserPreferences.iCloudSyncEnabled = true` ise aktif
- İlk kurulumda kullanıcıya onboarding'de sorulur (opt-in)

---

## 4. Alt Adımlar

- [ ] 4 @Model tanımı
- [ ] ModelContainer kurulumu
- [ ] `SavedCalculationStore` — CRUD actor/observable
- [ ] Salary feature'da "Save" butonu → `SavedCalculation` üretir
- [ ] Each calculator detail'da "History" butonu → geçmiş listesi
- [ ] `CalculatorUsage` — recently used beslemesi
- [ ] `GuideBookmark` — Guides feature'ının bookmark verisi
- [ ] `UserPreferences` — Settings ekranı ile bağlı
- [ ] iCloud opt-in akışı + Settings toggle
- [ ] Export: `SavedCalculation` JSON dışa aktar (v1.1 için hazırlık)

---

## 5. Migration Stratejisi

- [ ] `SchemaMigrationPlan` hazırla (boş, v1)
- [ ] Unit test: container boot ile crash yok
- [ ] Field eklendiğinde migration eklenir, test edilir

---

## 6. Kabul Kriterleri

- [ ] App kapatılıp açıldığında kayıtlı hesaplamalar görünüyor
- [ ] iCloud toggle açıldığında ikinci cihaza senkron oluyor
- [ ] Geçmiş listesi 1000+ item ile akıcı (LazyVStack)
- [ ] Unit test: CRUD operasyonları, concurrency güvenli

---

## 7. Sıradaki

[`11-share-export.md`](11-share-export.md)
