# Task 15 — Performance & Animation Budgeting

> **Faz**: M8
> **Ön koşul**: Tüm feature'lar işlevsel
> **Çıktı**: 60 fps akıcı, cold launch < 400ms, binary < 25 MB

---

## 1. Hedefler

| Metrik       | Hedef                                 | Nasıl ölçülür                  |
| ------------ | ------------------------------------- | ------------------------------ |
| Cold launch  | < 400 ms                              | Xcode Instruments > App Launch |
| Warm launch  | < 150 ms                              | aynı                           |
| Frame rate   | 60 fps (120 hz cihazlar için 120 fps) | Instruments > Time Profiler    |
| Memory       | < 80 MB idle, < 150 MB peak           | Instruments > Allocations      |
| Binary size  | < 25 MB (compressed IPA)              | App Thinning Size Report       |
| Hesap motoru | Salary 12 ay < 20 ms                  | XCTest measure                 |

---

## 2. Optimization Checklist

### 2.1 Launch

- [ ] `@main` minimal — sadece container + `RootView`
- [ ] `RootView` sadece `TabView` oluşturuyor; her feature lazy yüklenir
- [ ] `AsyncImage` / ağ çağrısı launch sırasında yok
- [ ] `TaxConfigStore` lazy load (ilk hesaplamada)
- [ ] `FloatingOrbs` animasyonları ilk frame'den sonra başlar

### 2.2 Rendering

- [ ] `LazyVStack` / `LazyVGrid` her liste için
- [ ] `id` key'leri stabil
- [ ] Heavy view'ler `drawingGroup()` ile flatten (sadece test edilmiş yerler)
- [ ] `scrollTransition` sadece gerektiğinde
- [ ] Glass effect sayısı bir ekranda < 8

### 2.3 Calculation

- [ ] `Decimal` operasyonları gereksiz yerde `Double`'a dönüştürülmüyor
- [ ] 12 aylık salary hesaplaması tek geçişte — redundan döngü yok
- [ ] `ViewModel.recalculate()` debounce 50ms (hızlı typing için)

### 2.4 Memory

- [ ] `@MainActor` gereksiz yerde kullanılmıyor
- [ ] Image cache'leri sınırlı (`URLCache` 20 MB limit)
- [ ] Bundle'lanmış guide markdown'ları lazy read

### 2.5 Binary Size

- [ ] App Thinning rapor → sadece kullanılan asset'ler
- [ ] Vector assets (SF Symbol + SVG) tercih et, PNG yerine
- [ ] JSON dosyaları gerekirse `.gz` ile yüklenir (decoder'da inflate)
- [ ] Unused SPM dependency yok

---

## 3. Animation Budget

- [ ] Aynı anda < 5 animasyon
- [ ] Mesh gradient + orbs + floating card + numeric transition = 4, tamam
- [ ] Reduce Motion'da tüm "nice to have" animasyonlar kapanır
- [ ] 120 Hz ProMotion'a saygılı (`.animation(.interpolatingSpring, ...)`

---

## 4. Profiling Adımları

- [ ] Instruments > Time Profiler: salary input → result path
- [ ] Instruments > Allocations: 10 dakika kullanım sonrası memory leak var mı
- [ ] Instruments > Hitches: scroll hitch > 1 ise durumlar
- [ ] `os_signpost` ile recalculate süresi log'la

---

## 5. Kabul Kriterleri

- [ ] Instruments hitch count 60s kullanımda ≤ 1
- [ ] Cold launch < 400 ms (iPhone 15)
- [ ] Salary recalculate < 50 ms
- [ ] Binary < 25 MB
- [ ] 10 dakika kullanım sonrası memory growth < 10 MB

---

## 6. Sıradaki

[`16-release.md`](16-release.md)
