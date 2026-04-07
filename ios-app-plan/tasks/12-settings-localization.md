# Task 12 — Settings & Localization

> **Faz**: M7 / M8
> **Ön koşul**: Persistence (Task 10) hazır
> **Çıktı**: Settings ekranı + string catalog ile EN-only lokalizasyon iskeleti

---

## 1. Amaç

Kullanıcı tercihlerini yönetmek, uygulama bilgilerini göstermek, v1.1 için lokalizasyon iskeletini hazırlamak.

---

## 2. Ekran Bölümleri

```
SettingsScreen
├── ProfileHeader (opsiyonel v1.1)
├── Preferences
│   ├── Theme (System / Light / Dark)
│   ├── Default Year (2020-2026)
│   ├── Currency (EUR sabit v1)
│   ├── Haptics (toggle)
│   └── Reduce Motion override (toggle, sistem de var)
├── Data
│   ├── iCloud Sync (toggle)
│   ├── Export all calculations (JSON)
│   ├── Clear history (confirm alert)
│   └── Clear bookmarks
├── Information
│   ├── Tax Config Version (read-only)
│   ├── Data Sources (Malta CFR, Social Security)
│   ├── Last Update (Content JSON version date)
│   ├── Disclaimer (uyarı metni)
│   └── Privacy Policy (link)
├── About
│   ├── App Version + Build
│   ├── Acknowledgements
│   ├── Contact / Feedback
│   └── Rate on App Store
```

---

## 3. Localization

- [ ] `Localizable.xcstrings` (String Catalog, Xcode 15+)
- [ ] Tüm user-facing string'ler `LocalizedStringResource` ile
- [ ] v1 dil: `en` (default)
- [ ] v1.1 hedef: `mt` (Maltaca), `tr` (Türkçe), `it` (İtalyanca)
- [ ] Pluralization gereken yerlerde `%lld months` vb.
- [ ] Currency/number formatter local-aware olsa da **EUR sabit** v1

---

## 4. Disclaimer Metni (Örnek)

> Bu uygulama yalnızca bilgilendirme amaçlıdır. Hesaplanan değerler tahmindir ve resmi bir vergi beyannamesi veya mali tavsiye yerine geçmez. Kesin bilgi için Malta CFR (cfr.gov.mt) ve Social Security (socialsecurity.gov.mt) ile doğrulayın.

---

## 5. Alt Adımlar

- [ ] `SettingsViewModel` — `UserPreferences` SwiftData bağlı
- [ ] `SettingsScreen` — `Form` + section'lar (iOS 26 glass form otomatik)
- [ ] Theme picker bağlı ve tüm uygulamaya uygulanır
- [ ] `Localizable.xcstrings` oluştur, tüm EN string'leri taşı
- [ ] About bölümünde build version otomatik (Info.plist'ten)
- [ ] "Rate on App Store" → `StoreKit.RequestReviewAction`
- [ ] Clear history confirm alert
- [ ] Tax Config version read-only gösterimi

---

## 6. Kabul Kriterleri

- [ ] Settings içindeki tüm toggle/picker'lar persiste ediyor
- [ ] Theme switch anlık uygulanıyor
- [ ] Localization: en-US sistemde doğru görüntü
- [ ] v1.1 için dil eklediğimizde sıfır kod değişikliği — sadece xcstrings güncellenecek
- [ ] Snapshot test

---

## 7. Sıradaki

[`13-testing.md`](13-testing.md)
