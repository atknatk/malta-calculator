# Task 04 — Tax Config JSON & Loader

> **Faz**: M3 (CalculationKit ile paralel)
> **Ön koşul**: [`03-calculation-kit.md`](03-calculation-kit.md) başladı
> **Çıktı**: `tax-config-2020-2026.json` + Swift loader + testler

---

## 1. Amaç

Web'deki `src/config/malta-tax-config.ts` dosyasını **tek kaynak** olabilecek JSON formatına çevirmek ve CalculationKit içinden thread-safe, cache'li erişim sağlamak.

---

## 2. Tam JSON Şeması

```json
{
  "version": "2026.1",
  "generatedAt": "2026-04-07T00:00:00Z",
  "source": "src/config/malta-tax-config.ts",
  "years": [
    {
      "year": 2020,
      "brackets": {
        "single": [
          { "min": 0, "max": 9100, "rate": 0, "deduction": 0 },
          { "min": 9101, "max": 14500, "rate": 0.15, "deduction": 1365 },
          { "min": 14501, "max": 19500, "rate": 0.25, "deduction": 2815 },
          { "min": 19501, "max": 60000, "rate": 0.25, "deduction": 2725 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 8725 }
        ],
        "married": [
          { "min": 0, "max": 12700, "rate": 0, "deduction": 0 },
          { "min": 12701, "max": 21200, "rate": 0.15, "deduction": 1905 },
          { "min": 21201, "max": 28700, "rate": 0.25, "deduction": 4025 },
          { "min": 28701, "max": 60000, "rate": 0.25, "deduction": 3905 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 9905 }
        ],
        "parent": [
          { "min": 0, "max": 10500, "rate": 0, "deduction": 0 },
          { "min": 10501, "max": 15800, "rate": 0.15, "deduction": 1575 },
          { "min": 15801, "max": 21200, "rate": 0.25, "deduction": 3155 },
          { "min": 21201, "max": 60000, "rate": 0.25, "deduction": 3050 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 9050 }
        ]
      },
      "ssc": {
        "categoryA": 6.62,
        "categoryB": 19.77,
        "categoryCOld": 44.41,
        "categoryCNew": 50.63,
        "categoryDOld": 44.41,
        "categoryDNew": 50.63,
        "weeklyCapOld": 444.14,
        "weeklyCapNew": 506.31,
        "minimumWage": 175.84
      },
      "cola": null
    },
    {
      "year": 2026,
      "brackets": {
        "single": [
          { "min": 0, "max": 12000, "rate": 0, "deduction": 0 },
          { "min": 12001, "max": 16000, "rate": 0.15, "deduction": 1800 },
          { "min": 16001, "max": 60000, "rate": 0.25, "deduction": 3400 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 9400 }
        ],
        "married": [
          { "min": 0, "max": 15000, "rate": 0, "deduction": 0 },
          { "min": 15001, "max": 23000, "rate": 0.15, "deduction": 2250 },
          { "min": 23001, "max": 60000, "rate": 0.25, "deduction": 4550 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 10550 }
        ],
        "married_1child": [
          { "min": 0, "max": 17500, "rate": 0, "deduction": 0 },
          { "min": 17501, "max": 26500, "rate": 0.15, "deduction": 2625 },
          { "min": 26501, "max": 60000, "rate": 0.25, "deduction": 5275 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 11275 }
        ],
        "married_2plus": [
          { "min": 0, "max": 22500, "rate": 0, "deduction": 0 },
          { "min": 22501, "max": 32000, "rate": 0.15, "deduction": 3375 },
          { "min": 32001, "max": 60000, "rate": 0.25, "deduction": 6575 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 12575 }
        ],
        "parent": [
          { "min": 0, "max": 13000, "rate": 0, "deduction": 0 },
          { "min": 13001, "max": 17500, "rate": 0.15, "deduction": 1950 },
          { "min": 17501, "max": 60000, "rate": 0.25, "deduction": 3700 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 9700 }
        ],
        "parent_1child": [
          { "min": 0, "max": 14500, "rate": 0, "deduction": 0 },
          { "min": 14501, "max": 21000, "rate": 0.15, "deduction": 2175 },
          { "min": 21001, "max": 60000, "rate": 0.25, "deduction": 4275 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 10275 }
        ],
        "parent_2plus": [
          { "min": 0, "max": 18500, "rate": 0, "deduction": 0 },
          { "min": 18501, "max": 25500, "rate": 0.15, "deduction": 2775 },
          { "min": 25501, "max": 60000, "rate": 0.25, "deduction": 5325 },
          { "min": 60001, "max": null, "rate": 0.35, "deduction": 11325 }
        ]
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
        "june": 135.1,
        "september": 121.16,
        "december": 135.1
      }
    }
  ]
}
```

> **Not**: `max: null` → `Infinity` karşılığı. Loader parse sırasında `Decimal.greatestFiniteMagnitude` olarak saklar. `cola: null` → o yılda COLA yok (2023 ve öncesi).

---

## 3. Export Script — `scripts/export-tax-config.ts`

```typescript
import fs from "fs";
import path from "path";
import {
  taxBracketsByYear,
  sscRatesByYear,
  colaByYear,
  type TaxBracket,
} from "../src/config/malta-tax-config";

interface JSONBracket {
  min: number;
  max: number | null;
  rate: number;
  deduction: number;
}

function mapBracket(b: TaxBracket): JSONBracket {
  return {
    min: b.min,
    max: b.max === Infinity ? null : b.max,
    rate: b.rate,
    deduction: b.deduction,
  };
}

function buildYearEntry(year: number) {
  const taxEntry = taxBracketsByYear.find((c) => c.year === year);
  const sscEntry = sscRatesByYear.find((c) => c.year === year);
  const colaEntry = colaByYear.find((c) => c.year === year);

  if (!taxEntry || !sscEntry) {
    throw new Error(`Missing tax or SSC config for ${year}`);
  }

  const brackets: Record<string, JSONBracket[]> = {};
  for (const [key, value] of Object.entries(taxEntry.brackets)) {
    if (value) {
      brackets[key] = value.map(mapBracket);
    }
  }

  return {
    year,
    brackets,
    ssc: sscEntry.rates,
    cola: colaEntry?.cola ?? null,
  };
}

const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const payload = {
  version: "2026.1",
  generatedAt: new Date().toISOString(),
  source: "src/config/malta-tax-config.ts",
  years: years.map(buildYearEntry),
};

const outputPath = path.join(
  __dirname,
  "../ios/Packages/CalculationKit/Resources/tax-config-2020-2026.json",
);
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));

console.log(`✓ Tax config exported: ${outputPath}`);
console.log(`  Version: ${payload.version}`);
console.log(`  Years: ${years.join(", ")}`);
```

`package.json`:

```json
{
  "scripts": {
    "export:tax-config": "tsx scripts/export-tax-config.ts",
    "export:all": "npm run export:tax-config && npm run export:golden && npm run export:guides"
  }
}
```

---

## 4. Swift DTO

`MaltaTaxConfigDTO.swift`:

```swift
import Foundation

/// JSON'dan parse edilen ara tip. Public değil.
/// `MaltaTaxConfig`'e dönüştürülmek için kullanılır.
struct MaltaTaxConfigDTO: Decodable {
    let version: String
    let generatedAt: String
    let source: String?
    let years: [YearDTO]

    struct YearDTO: Decodable {
        let year: Int
        let brackets: [String: [BracketDTO]]
        let ssc: SSCDTO
        let cola: COLADTO?
    }

    struct BracketDTO: Decodable {
        let min: Decimal
        let max: Decimal?
        let rate: Decimal
        let deduction: Decimal
    }

    struct SSCDTO: Decodable {
        let categoryA: Decimal
        let categoryB: Decimal
        let categoryCOld: Decimal
        let categoryCNew: Decimal
        let categoryDOld: Decimal
        let categoryDNew: Decimal
        let weeklyCapOld: Decimal
        let weeklyCapNew: Decimal
        let minimumWage: Decimal
    }

    struct COLADTO: Decodable {
        let march: Decimal
        let june: Decimal
        let september: Decimal
        let december: Decimal
    }
}
```

---

## 5. Swift Model

`MaltaTaxConfig.swift`:

```swift
import Foundation

public struct MaltaTaxConfig: Sendable {
    public let version: String
    public let generatedAt: String
    public let years: [Int: YearConfig]

    public struct YearConfig: Sendable {
        public let year: Int
        public let brackets: [TaxRateType: [TaxBracket]]
        public let ssc: SSCRates
        public let cola: COLA?
    }

    public struct TaxBracket: Sendable, Equatable {
        public let min: Money
        public let max: Money
        public let rate: Decimal
        public let deduction: Money

        public func contains(_ income: Money) -> Bool {
            income >= min && income <= max
        }
    }

    public struct SSCRates: Sendable, Equatable {
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

    public struct COLA: Sendable, Equatable {
        public let march: Money
        public let june: Money
        public let september: Money
        public let december: Money

        public func amount(for month: Month) -> Money {
            switch month {
            case .march: return march
            case .june: return june
            case .september: return september
            case .december: return december
            default: return 0
            }
        }
    }

    // MARK: - Init from DTO

    init(from dto: MaltaTaxConfigDTO) throws {
        self.version = dto.version
        self.generatedAt = dto.generatedAt

        var years: [Int: YearConfig] = [:]
        for yearDTO in dto.years {
            var brackets: [TaxRateType: [TaxBracket]] = [:]
            for (key, dtoBrackets) in yearDTO.brackets {
                guard let type = TaxRateType(rawValue: key) else {
                    throw CalculationError.corruptedConfig(
                        reason: "Unknown tax rate type: \(key)"
                    )
                }
                brackets[type] = dtoBrackets.map { bracket in
                    TaxBracket(
                        min: bracket.min,
                        max: bracket.max ?? Decimal.greatestFiniteMagnitude,
                        rate: bracket.rate,
                        deduction: bracket.deduction
                    )
                }
            }

            let ssc = SSCRates(
                categoryA: yearDTO.ssc.categoryA,
                categoryB: yearDTO.ssc.categoryB,
                categoryCOld: yearDTO.ssc.categoryCOld,
                categoryCNew: yearDTO.ssc.categoryCNew,
                categoryDOld: yearDTO.ssc.categoryDOld,
                categoryDNew: yearDTO.ssc.categoryDNew,
                weeklyCapOld: yearDTO.ssc.weeklyCapOld,
                weeklyCapNew: yearDTO.ssc.weeklyCapNew,
                minimumWage: yearDTO.ssc.minimumWage
            )

            let cola: COLA? = yearDTO.cola.map {
                COLA(
                    march: $0.march, june: $0.june,
                    september: $0.september, december: $0.december
                )
            }

            years[yearDTO.year] = YearConfig(
                year: yearDTO.year,
                brackets: brackets,
                ssc: ssc,
                cola: cola
            )
        }
        self.years = years
    }
}

// MARK: - Helper Accessors

public extension MaltaTaxConfig {
    func brackets(for year: Int, type: TaxRateType) -> [TaxBracket] {
        guard let yearConfig = years[year] else { return [] }
        if let exact = yearConfig.brackets[type] { return exact }
        // Fallback: married_1child -> married
        let baseKey = type.rawValue.replacingOccurrences(of: "_1child", with: "")
            .replacingOccurrences(of: "_2plus", with: "")
        if let base = TaxRateType(rawValue: baseKey), let brackets = yearConfig.brackets[base] {
            return brackets
        }
        return yearConfig.brackets[.single] ?? []
    }

    func ssc(for year: Int) -> SSCRates? {
        years[year]?.ssc
    }

    func cola(for year: Int, month: Month) -> Money {
        years[year]?.cola?.amount(for: month) ?? 0
    }

    var availableYears: [Int] {
        years.keys.sorted()
    }

    static func isChildCountEffective(year: Int) -> Bool {
        year >= 2026
    }
}
```

---

## 6. Loader (Actor)

`TaxConfigStore.swift`:

```swift
import Foundation

public actor TaxConfigStore {
    public static let shared = TaxConfigStore()

    private var cached: MaltaTaxConfig?
    private var bundleOverride: Bundle?

    private init() {}

    /// Test target için bundle override
    public func setBundle(_ bundle: Bundle) {
        self.bundleOverride = bundle
        self.cached = nil
    }

    /// Cache'li yükler. İlk çağrıda disk okur, sonraki çağrılarda cache'den döner.
    public func load() throws -> MaltaTaxConfig {
        if let cached { return cached }

        let bundle = bundleOverride ?? Bundle.module
        guard let url = bundle.url(
            forResource: "tax-config-2020-2026",
            withExtension: "json"
        ) else {
            throw CalculationError.configNotFound
        }

        let data = try Data(contentsOf: url)
        let decoder = JSONDecoder()
        let dto: MaltaTaxConfigDTO
        do {
            dto = try decoder.decode(MaltaTaxConfigDTO.self, from: data)
        } catch {
            throw CalculationError.corruptedConfig(reason: error.localizedDescription)
        }

        let config = try MaltaTaxConfig(from: dto)
        self.cached = config
        return config
    }

    /// Remote URL'den yeni config yükler (v1.1 için hazırlık)
    public func loadRemote(from url: URL) async throws -> MaltaTaxConfig {
        let (data, _) = try await URLSession.shared.data(from: url)
        let dto = try JSONDecoder().decode(MaltaTaxConfigDTO.self, from: data)
        let config = try MaltaTaxConfig(from: dto)
        self.cached = config
        return config
    }

    /// Cache'i temizle (config güncellendiğinde)
    public func invalidate() {
        self.cached = nil
    }
}
```

---

## 7. Alt Adımlar

- [ ] `scripts/export-tax-config.ts` yaz
- [ ] `npm run export:tax-config` ile ilk JSON'u üret
- [ ] JSON'u paket resource'u olarak ekle (`.process("Resources")` Package.swift'te)
- [ ] `MaltaTaxConfigDTO` struct (decoder ara tipi)
- [ ] `MaltaTaxConfig` struct (public API)
- [ ] `TaxConfigStore` actor + cache
- [ ] `resolveTaxRateType(year:simpleType:childCount:)` helper (zaten `03`'te)
- [ ] `DateHelpers` içindeki ay fonksiyonları
- [ ] Unit testler

---

## 8. Testler

```swift
import Testing
import Foundation
@testable import CalculationKit

@Suite("TaxConfigStore")
struct TaxConfigStoreTests {

    @Test("loads and caches config")
    func loadCaches() async throws {
        let store = TaxConfigStore.shared
        let first = try await store.load()
        let second = try await store.load()
        #expect(first.years.count == second.years.count)
        #expect(first.version == second.version)
    }

    @Test("2026 contains 7 tax rate types")
    func allTaxTypes2026() async throws {
        let config = try await TaxConfigStore.shared.load()
        let year2026 = try #require(config.years[2026])
        #expect(year2026.brackets.count == 7)
        #expect(year2026.brackets[.married] != nil)
        #expect(year2026.brackets[.marriedOneChild] != nil)
        #expect(year2026.brackets[.marriedTwoPlus] != nil)
        #expect(year2026.brackets[.parent] != nil)
        #expect(year2026.brackets[.parentOneChild] != nil)
        #expect(year2026.brackets[.parentTwoPlus] != nil)
        #expect(year2026.brackets[.single] != nil)
    }

    @Test("2024 has 3 tax types (no children)")
    func threeTypes2024() async throws {
        let config = try await TaxConfigStore.shared.load()
        let year2024 = try #require(config.years[2024])
        #expect(year2024.brackets.count == 3)
    }

    @Test("SSC weekly cap 2026 new is 559.31")
    func ssc2026() async throws {
        let config = try await TaxConfigStore.shared.load()
        let ssc = try #require(config.years[2026]?.ssc)
        #expect(ssc.weeklyCapNew == Decimal(559.31))
        #expect(ssc.minimumWage == Decimal(225.0))
    }

    @Test("COLA for June 2026 is 135.10")
    func cola2026() async throws {
        let config = try await TaxConfigStore.shared.load()
        #expect(config.cola(for: 2026, month: .june) == Decimal(135.10))
        #expect(config.cola(for: 2026, month: .march) == Decimal(121.16))
    }

    @Test("resolveTaxRateType for 2025 married with 1 child falls back to married")
    func resolveFallback() {
        let type = resolveTaxRateType(year: 2025, simpleType: .married, childCount: 1)
        #expect(type == .married)
    }

    @Test("resolveTaxRateType for 2026 married with 2 children")
    func resolve2026TwoChildren() {
        let type = resolveTaxRateType(year: 2026, simpleType: .married, childCount: 2)
        #expect(type == .marriedTwoPlus)
    }

    @Test("DateHelpers mondays in Feb 2026")
    func mondaysFeb2026() {
        let count = DateHelpers.mondaysInMonth(year: 2026, monthIndex: 1)
        // Şubat 2026: 2, 9, 16, 23 → 4 Pazartesi
        #expect(count == 4)
    }

    @Test("Infinity bracket max parsed correctly")
    func infinityMax() async throws {
        let config = try await TaxConfigStore.shared.load()
        let single2026 = try #require(config.brackets(for: 2026, type: .single).last)
        #expect(single2026.max == Decimal.greatestFiniteMagnitude)
    }
}
```

---

## 9. CI Drift Check — `scripts/tax-config-drift-check.sh`

```bash
#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

# Generate fresh JSON into temp
TMP=$(mktemp)
tsx scripts/export-tax-config.ts --output "$TMP"

# Compare with committed
if ! diff -q "$TMP" "ios/Packages/CalculationKit/Resources/tax-config-2020-2026.json" > /dev/null; then
  echo "❌ Tax config drift detected!"
  echo "Run 'npm run export:tax-config' and commit the result."
  diff "$TMP" "ios/Packages/CalculationKit/Resources/tax-config-2020-2026.json" || true
  exit 1
fi

echo "✓ Tax config in sync"
```

CI job'da şu step eklenir:

```yaml
- name: Check tax config drift
  run: bash scripts/tax-config-drift-check.sh
```

---

## 10. Remote Update (v1.1 Hazırlığı)

- [ ] JSON'un `version` alanı var — comparison için
- [ ] `TaxConfigStore.loadRemote(from:)` hazır
- [ ] Signature doğrulama (v1.1'de `CryptoKit` ile ED25519 imzalı JSON)
- [ ] Host: `https://config.maltacalculator.com/tax-config.json`

Bu kısım v1'de implement edilmiyor, sadece yapı hazır.

---

## 11. Kabul Kriterleri

- [ ] JSON dosyası web'deki `taxBracketsByYear` ile birebir uyumlu (drift check yeşil)
- [ ] Tüm yıllar (2020-2026) ve kategoriler dahil
- [ ] Loader actor, thread-safe
- [ ] Cache ilk load sonrası disk I/O yapmıyor
- [ ] Unit testler yeşil
- [ ] `null` max → `Decimal.greatestFiniteMagnitude` parse ediliyor
- [ ] Kategori fallback (2024 `married_1child` → `married`) çalışıyor
- [ ] DateHelpers Gregorian + Europe/Malta timezone doğruluğu test edildi

---

## 12. Sıradaki

[`05-navigation.md`](05-navigation.md)
