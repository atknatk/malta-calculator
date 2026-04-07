# Task 13 — Testing Strategy

> **Faz**: M3'ten itibaren sürekli, M8'de kapanış
> **Ön koşul**: CalculationKit, DesignSystem, en az bir feature hazır
> **Çıktı**: Unit + Snapshot + UI + Golden test paketleri, CI entegre

---

## 1. Test Piramidi

```
         UI Tests (5%)
        ─────────────
      Snapshot (20%)
    ─────────────────
  Unit (75%) + Golden
─────────────────────────
```

---

## 2. Unit Tests

### 2.1 CalculationKit (%100 coverage hedefi)

- [ ] Her motor için pozitif + sınır + negatif input
- [ ] Decimal rounding davranışı
- [ ] Tax bracket kenar değerleri (min/max tam)
- [ ] SSC category switch (A → B → C)
- [ ] Doğum tarihi 1962 öncesi/sonrası
- [ ] COLA toggle etkisi

### 2.2 ViewModels

- [ ] State değişimi observed değerleri güncelliyor
- [ ] Computed value'lar doğru
- [ ] Persistence mock'u ile CRUD

### 2.3 Utilities

- [ ] Money formatter
- [ ] Date helpers (Mondays in month vs)

---

## 3. Golden Tests

### 3.1 Nedir?

Web tarafında üretilen referans çıktıların Swift'te aynı olduğunu doğrulayan testler. Bkz. [`03-calculation-kit.md`](03-calculation-kit.md) bölüm 6.

### 3.2 Fixture Listesi (Minimum)

| Fixture                       | Motor      | İçerik                   |
| ----------------------------- | ---------- | ------------------------ |
| salary_2026_single_25k        | Salary     | 25k single 2026          |
| salary_2026_married_2child    | Salary     | 35k married 2 child 2026 |
| salary_2025_parent            | Salary     | 28k parent 2025          |
| salary_1962_pensioner         | Salary     | 1960 doğumlu 20k         |
| mortgage_300k_25y_4.5         | Mortgage   | standart                 |
| mortgage_500k_30y_min_deposit | Mortgage   | min deposit              |
| stamp_duty_first_time         | Stamp Duty | first-time buyer         |
| personal_loan_10k_5y          | Loan       | 10k 5y                   |
| savings_100k_5y_compound      | Savings    | compound                 |
| pension_two_thirds            | Pension    | two-thirds               |
| overtime_weekend              | Overtime   | 2x rate                  |
| vacation_full_time            | Vacation   | 40h/week                 |
| vehicle_reg_tax_co2_high      | Vehicle    | 200 g/km                 |

Toplam ~20 golden fixture.

---

## 4. Snapshot Tests

### 4.1 DesignSystem

- [ ] Her `DSButton` variant (5 × 3 state × 2 theme × 2 dynamic type)
- [ ] `DSCard`, `DSNumericField`, `DSToggleGroup`
- [ ] `MeshBackground`, `FloatingOrbs` (deterministik seed ile)

### 4.2 Features

- [ ] `SalaryScreen` — default, input değişmiş, empty
- [ ] Her calculator detail — default state
- [ ] `CalculatorsScreen` — full grid, searched, empty

### 4.3 Kütüphane

`pointfreeco/swift-snapshot-testing`. Record mode'da yeniden üretme komutu: `FASTLANE_SNAPSHOT_RECORD=true fastlane test`.

---

## 5. UI Tests (XCUITest)

Yalnızca en kritik 3 flow:

1. **Salary happy path** — 30k gross input → sonuç doğru görünür → share açılır
2. **Calculator grid → mortgage** → input → sonuç → save → history'de görünür
3. **Settings → clear history** → confirm → boş state

UI testler CI'da nightly çalışır (pull request'lerde değil, süre uzun).

---

## 6. Performance Tests

- [ ] `XCTMemoryMetric` — Salary feature memory < 50 MB
- [ ] `XCTClockMetric` — cold launch < 400ms
- [ ] `XCTCPUMetric` — 12 aylık breakdown hesaplama < 50ms

---

## 7. CI Entegrasyonu

- [ ] `xcodebuild test` her PR'da
- [ ] Coverage raporu (`xccov`) — %80 target, hesap motoru %100
- [ ] Coverage artifact olarak kaydedilir
- [ ] Snapshot test fail olursa artifact (image diff) PR'a eklenir

---

## 8. Kabul Kriterleri

- [ ] CalculationKit %100 coverage
- [ ] Overall %80+ coverage
- [ ] Tüm golden fixture'lar geçiyor
- [ ] Snapshot test suite 5 dakikadan kısa
- [ ] UI test nightly yeşil

---

## 9. Sıradaki

[`14-accessibility.md`](14-accessibility.md)
