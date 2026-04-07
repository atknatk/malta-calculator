# Task 04 — Tax Config JSON & Loader

> **Faz**: M3
> **Ön koşul**: [`03-calculation-kit.md`](03-calculation-kit.md) başladı
> **Çıktı**: `tax-config-2020-2026.json`, `MaltaTaxConfig.swift` loader + unit testleri

---

## 1. Amaç

Web'deki `src/config/malta-tax-config.ts` dosyasını iOS-dostu, uzun vadede **tek kaynak** olabilecek bir JSON formatına çevirmek ve CalculationKit içinden erişilebilir bir loader kurmak.

---

## 2. JSON Şeması

```json
{
  "version": "2026.1",
  "generatedAt": "2026-04-07",
  "years": [
    {
      "year": 2026,
      "brackets": {
        "single": [
          { "min": 0, "max": 12000, "rate": 0, "deduction": 0 },
          { "min": 12001, "max": 16000, "rate": 0.15, "deduction": 1800 },
          { "min": 16001, "max": 60000, "rate": 0.25, "deduction": 3400 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 9400 }
        ],
        "married": [ ... ],
        "married_1child": [ ... ],
        "married_2plus": [ ... ],
        "parent": [ ... ],
        "parent_1child": [ ... ],
        "parent_2plus": [ ... ]
      },
      "ssc": {
        "categoryA": 6.62,
        "categoryB": 22.94,
        "categoryCOld": 49.04,
        "categoryCNew": 55.93,
        "categoryDOld": 49.04,
        "categoryDNew": 55.93,
        "weeklyCapOld": 490.38,
        "weeklyCapNew": 559.31,
        "minimumWage": 225.0
      },
      "cola": {
        "march": 121.16,
        "june": 135.10,
        "september": 121.16,
        "december": 135.10
      }
    }
  ]
}
```

> `max: null` → `Infinity` karşılığı. Loader parse sırasında `Money.greatestFiniteMagnitude` olarak saklar.

---

## 3. Üretim Script'i

`scripts/export-tax-config.ts` (Node.js, ts-node) — web'deki `malta-tax-config.ts`'i import eder, yukarıdaki JSON şemasına çevirip `Packages/CalculationKit/Resources/tax-config-2020-2026.json` olarak yazar.

- [ ] `npm run export:tax-config` komutu `package.json`'a eklenir
- [ ] CI'de web değişikliği sonrası iOS JSON'u drift yapmasın diye bir check: JSON güncel mi?

---

## 4. Swift Loader

```swift
public struct MaltaTaxConfig: Sendable {
    public let version: String
    public let years: [Int: YearConfig]

    public struct YearConfig: Sendable {
        public let year: Int
        public let brackets: [TaxRateType: [TaxBracket]]
        public let ssc: SSCRates
        public let cola: COLA
    }

    public struct TaxBracket: Sendable, Codable, Equatable {
        public let min: Money
        public let max: Money
        public let rate: Decimal
        public let deduction: Money
    }

    public struct SSCRates: Sendable, Codable {
        public let categoryA: Money
        public let categoryB: Money
        public let categoryCOld: Money
        public let categoryCNew: Money
        public let categoryDOld: Money
        public let categoryDNew: Money
        public let weeklyCapOld: Money
        public let weeklyCapNew: Money
        public let minimumWage: Money
    }

    public struct COLA: Sendable, Codable {
        public let march: Money
        public let june: Money
        public let september: Money
        public let december: Money
    }
}

public enum TaxRateType: String, Sendable, Codable, CaseIterable {
    case single, married, marriedOneChild = "married_1child", marriedTwoPlus = "married_2plus"
    case parent, parentOneChild = "parent_1child", parentTwoPlus = "parent_2plus"
}

public actor TaxConfigStore {
    public static let shared = TaxConfigStore()
    private var cached: MaltaTaxConfig?

    public func load() throws -> MaltaTaxConfig {
        if let cached { return cached }
        guard let url = Bundle.module.url(forResource: "tax-config-2020-2026", withExtension: "json") else {
            throw CalculationError.configNotFound
        }
        let data = try Data(contentsOf: url)
        let decoded = try JSONDecoder().decode(MaltaTaxConfigDTO.self, from: data)
        let mapped = MaltaTaxConfig(from: decoded)
        self.cached = mapped
        return mapped
    }
}
```

---

## 5. Alt Adımlar

- [ ] `scripts/export-tax-config.ts` yaz
- [ ] `npm run export:tax-config` ile ilk JSON'u üret
- [ ] JSON'u paket resource'u olarak ekle (`.process("Resources")`)
- [ ] `MaltaTaxConfig` struct + DTO (decoder ara tipi) yaz
- [ ] `TaxConfigStore` actor'ü ile cache
- [ ] `resolveTaxRateType(year, simpleType, childCount)` helper'ı port et
- [ ] `getTaxBracketsForYear`, `getSSCRatesForYear`, `getCOLAForMonth` helper'ları port et
- [ ] `getMondaysInMonth`, `getWeeksForMonth`, `getWeeksPerMonthForYear` helper'ları `Foundation.Calendar` ile

---

## 6. Testler

- [ ] Her yıl için her kategori dilimleri web ile aynı (snapshot JSON compare)
- [ ] `resolveTaxRateType(2024, .married, 1)` → `.married` (fallback)
- [ ] `resolveTaxRateType(2026, .married, 1)` → `.marriedOneChild`
- [ ] `getMondaysInMonth(2026, 2)` → doğru Pazartesi sayısı (Foundation Calendar ile)
- [ ] Bozuk JSON: `CalculationError.corruptedConfig` atmalı

---

## 7. Remote Update (v1.1 Hazırlığı)

- [ ] JSON'un versiyonu var (`version` alanı)
- [ ] `TaxConfigStore.load(from: URL)` overload'ı (v1.1'de uzaktan JSON çekimi)
- [ ] Signature doğrulama (v1.1'de `CryptoKit` ile imzalı JSON)

Bu kısım v1'de implement edilmiyor, sadece yapı hazır.

---

## 8. Kabul Kriterleri

- [ ] JSON dosyası `taxBracketsByYear` ile birebir uyumlu
- [ ] `swift test` 100% geçiyor
- [ ] Loader cache'li ve thread-safe (actor)
- [ ] Web'deki `scripts/export-tax-config.ts` idempotent (aynı çıktı üretir)

---

## 9. Sıradaki

[`05-navigation.md`](05-navigation.md)
