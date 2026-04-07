# Task 00 — Ön Çalışma (Pre-Study / Discovery)

> **Faz**: M0
> **Süre niyeti**: Plan doğrulandıktan sonra tek oturumda bitirilmeli
> **Ön koşul**: Yok — proje bu task ile başlıyor
> **Çıktı**: Bu doküman + `ios-app-plan/` ağacı; ekip/kullanıcı plan üzerinde hemfikir

---

## 1. Amaç

Web tarafında mevcut Malta Calculator uygulamasının iOS portunu **güvenli, tekrar edilebilir, test edilebilir** bir şekilde üretebilmek için:

- Web kod tabanını sindirmek
- Port edilecek hesap motorlarını sayısallaştırmak
- iOS-özgün tasarım diline (Liquid Glass) karar vermek
- Teknik yığın seçimlerini gerekçelendirmek
- Task'leri zincirlemek
- Risklerin altını çizmek ve azaltma stratejisi kurmak

---

## 2. Web Code Base Analizi

### 2.1 Teknoloji (Web)

- **Next.js 16** App Router, TS strict
- **Tailwind + Radix UI** bileşen seti
- **Framer Motion** animasyonlar
- **Supabase + Clerk** backend (B2B SaaS için)
- **Vercel** hosting

### 2.2 Dosya Sayıları (kaynak: `wc -l src/utils/*.ts`)

| Dosya                                  | LOC       |
| -------------------------------------- | --------- |
| salary-calculator.ts                   | 308       |
| import-vehicle-calculator.ts           | 286       |
| drivers-license-calculator.ts          | 278       |
| vehicle-registration-fee-calculator.ts | 271       |
| childrens-allowance-calculator.ts      | 247       |
| vrt-calculator.ts                      | 222       |
| road-license-calculator.ts             | 215       |
| vehicle-registration-tax-calculator.ts | 204       |
| mortgage-calculator.ts                 | 202       |
| pension-calculator.ts                  | 306       |
| family-reunification-calculator.ts     | 201       |
| savings-calculator.ts                  | 189       |
| loan-calculator.ts                     | 173       |
| overtime-calculator.ts                 | 130       |
| vacation-calculator.ts                 | 124       |
| notice-period-calculator.ts            | 115       |
| retirement-age-calculator.ts           | 105       |
| stamp-duty-calculator.ts               | 93        |
| **Toplam (hesap motoru)**              | **3,669** |

Toplam helper dahil: **3,702 LOC**.

### 2.3 Hesap Motoru Fonksiyon Sayıları

```
salary-calculator.ts         → 1 main + 2 helper + 1 legacy
mortgage-calculator.ts       → 1 main + 4 helper
loan-calculator.ts           → 1 main + 4 helper
stamp-duty-calculator.ts     → 1 main + 2 helper
savings-calculator.ts        → 1 main + 3 helper
pension-calculator.ts        → 1 main + 6 rule helper + 2 helper
retirement-age-calculator.ts → 1 main + 1 helper
overtime-calculator.ts       → 1 main + 3 helper
vacation-calculator.ts       → 1 main + 2 helper
notice-period-calculator.ts  → 1 main + 2 helper
childrens-allowance-calculator.ts → 2 main + 3 helper
family-reunification-calculator.ts → 1 main + 5 helper
vehicle-registration-fee-calculator.ts → 1 main + 2 helper
vehicle-registration-tax-calculator.ts → 1 main + 2 helper
road-license-calculator.ts   → 1 main + 2 helper
drivers-license-calculator.ts → 1 main + 2 helper
vrt-calculator.ts            → 1 main + 2 helper
import-vehicle-calculator.ts → 1 main + 2 helper
```

**Toplam 18 ana motor, ~50 helper.**

### 2.4 Aktif / Coming Soon Durumu

`src/app/calculators/page.tsx`'teki kategori tablosundan:

| Kategori             | Aktif                                                                                 | Soon                                  |
| -------------------- | ------------------------------------------------------------------------------------- | ------------------------------------- |
| Employment & Salary  | Salary, Notice Period, Overtime                                                       | Bonus Tax, Part-Time, Expat Tax       |
| Family & Children    | Children's Allowance                                                                  | Childcare, Maternity, In-Work Benefit |
| Property & Housing   | Stamp Duty                                                                            | Rental Tax, First-Time Buyer          |
| Banking & Loans      | Mortgage, Savings Interest, Personal Loan                                             | —                                     |
| Retirement & Savings | Pension, Retirement Age                                                               | —                                     |
| Self-Employment      | —                                                                                     | Self-Employed Tax, Self-Employed SSC  |
| Leave & Time Off     | Vacation Days                                                                         | Sick Leave                            |
| Transport & Vehicles | Vehicle Reg Fee, Vehicle Reg Tax, Road License, Driver's License, VRT, Import Vehicle | —                                     |
| Immigration & Visa   | Family Reunification                                                                  | —                                     |
| **Toplam**           | **16**                                                                                | **12**                                |

**v1 iOS scope = tüm "Aktif" olanlar** (16 kullanıcıya açık) + Salary (ana ekran). "Soon" olanlar v1.1'e ertelenecek.

> Dikkat: Motor sayısı 18 ama UI'da 16 gösterim var çünkü Vehicle Registration Fee/Tax ayrı motorlar ama tek bir calculator girişi olarak gösterilebilir (v1 iOS'ta ayrı ekranlar tercih edildi).

### 2.5 Blog / Guides

38+ Markdown yazısı (`src/app/blog/*`). Port stratejisi:

- İlk build'de en popüler **10 rehber** bundled Markdown olarak gelir.
- Kalanı v1.1'de "download more" ile opsiyonel senkronizasyon.
- Markdown içinden relative link ve resim referansları temizlenecek bir ETL script yazılır.
- v1'de seçilen 10 guide: bkz. [`09-feature-guides.md`](09-feature-guides.md) §2.

### 2.6 Tasarım Dili (Web) — Ayrıntılı Analiz

`src/app/globals.css` incelendi — öne çıkanlar:

**CSS Değişkenleri (HSL)**:

- `--primary: 38 92% 32%` → Malta gold darkened for a11y → HEX `#C97D0A`
- `--secondary: 199 89% 48%` → Mediterranean blue → HEX `#0E9ACB`
- `--background: 40 33% 98%` → Warm off-white → HEX `#FBF9F4`
- `--foreground: 20 14% 12%` → Dark charcoal → HEX `#221D18`
- `--destructive: 0 72% 51%` → Malta red → HEX `#DC2626`

**Utility Sınıflar**:

- `.glass` → `rgba(255,255,255,0.7)` + `backdrop-filter: blur(20px)` + border
- `.glass-strong` → daha opak versiyonu
- `.gradient-border` → iç borderli cam kart
- `.premium-card` → glass + rounded-2xl + padding + elevation shadow
- `.text-gradient` → primary gradient içinde text
- `.btn-glow` → primary gradient + shimmer + glow shadow

**Gradientler**:

- `--gradient-primary`: `linear-gradient(135deg, #c97d0a 0%, #b86f08 50%, #a56006 100%)`
- `--gradient-secondary`: `linear-gradient(135deg, #0099cc 0%, #0077b6 50%, #005f8a 100%)`
- `--gradient-mesh`: 4 nokta radial blend (gold sol-üst, blue sağ-üst, coral sağ-alt, red sol-alt)

**Animasyonlar**:

- `animate-float` → 6s ease-in-out infinite, Y ekseni -8px bounce
- `animate-orb` → 15s ease-in-out infinite, translate/scale/opacity
- `animate-glow` → 3s glow shadow pulse
- `animate-fade-in-up` → 0.8s scroll reveal
- `animate-scale-in` → 0.5s scale 0.9 → 1.0

**Orb Floating Elements**:

- `.orb-gold` → radial gold 40% opacity center, blur 60px
- `.orb-blue` → aynısı blue 35%
- `.orb-coral` → aynısı red 25%

### 2.7 Web → iOS Karşılık Tablosu

| Web                | iOS 26                                          | iOS 18 Fallback                           |
| ------------------ | ----------------------------------------------- | ----------------------------------------- |
| `.glass`           | `.glassEffect()`                                | `.background(.regularMaterial)`           |
| `.glass-strong`    | `.glassEffect(.regular.tint(.clear))` daha opak | `.background(.thickMaterial)`             |
| mesh gradient body | `MeshGradient` (4×4 grid, 4 color)              | 4 x `RadialGradient` ZStack               |
| `.orb-*`           | `RadialGradient` + `.blur(radius: 60)`          | aynı                                      |
| `animate-float`    | `PhaseAnimator` 3-phase                         | `withAnimation(.easeInOut.repeatForever)` |
| `.text-gradient`   | `.foregroundStyle(LinearGradient(...))`         | aynı                                      |
| `.btn-glow`        | `ButtonStyle` + `shadow` + shimmer overlay      | aynı                                      |
| `.gradient-border` | `stroke(AngularGradient)` overlay               | aynı                                      |
| `.premium-card`    | `RoundedRectangle` + glass + shadow             | aynı                                      |
| `animate-gradient` | `TimelineView` + phase shift                    | aynı                                      |

---

## 3. iOS 26 Liquid Glass Derinlemesine

Karar: **native** kullanıyoruz, taklit etmiyoruz.

### 3.1 Yeni API'ler (iOS 26)

- `glassEffect(_:in:)` — view'e cam yüzey uygula
- `glassBackgroundEffect(in:)` — background olarak cam
- `GlassEffectContainer` — birden fazla cam yüzeyi tek bir kırılma katmanında birleştirir (refraction shared)
- `TabView` — iOS 26'da otomatik floating glass bar
- `.toolbar` — iOS 26'da glass background varsayılan
- `.presentationBackground(.glass)` — sheet/popover için cam
- `Tab(title, systemImage:, value:)` — yeni init
- `.tabViewStyle(.sidebarAdaptable)` — iPad/iPhone uyumlu

### 3.2 Fallback Stratejisi (iOS 18)

Tek bir merkezi modifier:

```swift
extension View {
    @ViewBuilder
    func liquidGlass(
        shape: some Shape = RoundedRectangle(cornerRadius: 20),
        tint: Color? = nil
    ) -> some View {
        if #available(iOS 26.0, *) {
            self.glassEffect(.regular.tint(tint ?? .clear), in: shape)
        } else {
            self
                .background(.regularMaterial, in: shape)
                .overlay(shape.strokeBorder(.white.opacity(0.2), lineWidth: 1))
                .shadow(color: .black.opacity(0.08), radius: 20, y: 8)
        }
    }
}
```

Bu uzantı `DesignSystem` paketinde tek yerden yönetilir ve tüm feature'lar bunu kullanır.

### 3.3 Performans Notları

- Bir ekranda aynı anda **< 8 cam yüzey** olmalı (GPU overdraw limiti)
- `GlassEffectContainer` ile birden fazla glass view tek container altında olmalı → daha az render pass
- `reduceTransparency` açıkken glass yerine solid surface kullanılmalı

---

## 4. Mimari Kararlar (ADR Kayıtları)

### ADR-001: SwiftUI + `@Observable` + Observation

- **Karar**: SwiftUI + Observation framework (iOS 17+)
- **Durum**: Kabul edildi
- **Alternatifler**:
  - UIKit (reddedildi — modern değil, iOS 26 API'leri SwiftUI-first)
  - SwiftUI + TCA/Redux (reddedildi — boilerplate, SwiftUI'nin doğasına aykırı)
  - SwiftUI + Combine + `ObservableObject` (reddedildi — eski, `@Observable` makrosu daha performanslı)
- **Gerekçe**: iOS 26 Liquid Glass API'leri SwiftUI-first. `@Observable` Combine'a ihtiyaç bırakmıyor, fine-grained observation ile gereksiz view render'ı engelliyor.
- **Sonuç**: Daha az boilerplate, daha hızlı iterasyon.

### ADR-002: SPM Modülerleştirme

- **Karar**: Local SwiftPM paketleri (`CalculationKit`, `DesignSystem`)
- **Durum**: Kabul edildi
- **Alternatifler**:
  - Tek target (reddedildi — hesap motoru UI'dan ayrılamaz)
  - Cocoapods (reddedildi — legacy)
  - Her feature ayrı paket (reddedildi — build süresi uzar, feature-scoped için overkill)
- **Gerekçe**: UI'dan bağımsız test edilebilir motor; hızlı build; macOS/iPadOS/watchOS paylaşımı kolay; Xcode yerel paket desteği olgun.

### ADR-003: Foundation.Decimal Kullanımı

- **Karar**: Tüm para hesapları `Decimal` ile
- **Durum**: Kabul edildi
- **Alternatifler**:
  - Double (reddedildi — kayan nokta hatası finansal hesaplarda kabul edilemez, IEEE 754 yuvarlama sürprizi)
  - Custom BigDecimal (reddedildi — overkill)
- **Gerekçe**: Web tarafında JS Number ile küçük yuvarlama farkları var; iOS'ta daha sağlam olalım. Golden testlerde tolerans = ±€0.01.
- **Not**: `Decimal` operasyonları biraz daha yavaş ama finansal doğruluk > micro-perf.

### ADR-004: JSON-kaynaklı Tax Config

- **Karar**: Tax config `Content/tax-config-2020-2026.json` olarak bundle
- **Durum**: Kabul edildi
- **Alternatifler**:
  - Hard-coded Swift enums (reddedildi — yıllık güncelleme için kod değişikliği + store submission)
  - Remote-only (reddedildi — offline-first prensibi bozulur)
- **Gerekçe**: Web ve iOS aynı dosyayı share edebilir (v2). Yıllık update için store submission gerekmeyebilir (remote JSON v1.1).

### ADR-005: MVVM, Feature-scoped

- **Karar**: Feature klasörleri `View` + `ViewModel` + `State` + `Router` içerir
- **Durum**: Kabul edildi
- **Reddedilen**:
  - Clean Architecture (aşırı katman)
  - Redux-like (SwiftUI'ye zıt)
  - MV (no VM) — test edilebilirlik kötü
- **Gerekçe**: Basit, test edilebilir, SwiftUI ile doğal uyum. Her feature izole, cross-feature iletişim Router üzerinden.

### ADR-006: Tek bir `@main` Target

- **Karar**: `MaltaCalculator` uygulaması tek target. Her feature SPM paketi değil, feature **klasörü**. `CalculationKit` ve `DesignSystem` paket.
- **Durum**: Kabul edildi
- **Gerekçe**: Feature'ların SPM paketi olması build süresini uzatıyor, teşhis zorlaşıyor. Sadece gerçek bağımsız katmanları paketle. 16 feature için 16 paket = 16 build ünitesi, pratik değil.

### ADR-007: iOS 18 Minimum Deployment

- **Karar**: Minimum iOS 18.0, optimum iOS 26.0
- **Durum**: ✅ Onaylandı (kullanıcı, 2026-04-07)
- **Gerekçe**:
  - iOS 18 → Mesh gradient, native SwiftData, Observation macro full support
  - iOS 26 → Liquid Glass API'leri
  - Cihaz pazar payı: iOS 18 → %85+, iOS 26 → %40+ (launch 6 ay sonra)
- **Alternatif**: iOS 26 only — pazar payı v1'de çok düşük

### ADR-008: Navigation — `NavigationStack` per Tab

- **Karar**: Her tab kendi `NavigationStack`'ini tutar; root'ta ortak `NavigationStack` yok
- **Durum**: Kabul edildi
- **Alternatifler**:
  - Global Stack (reddedildi — tab değiştirince stack korunmaz, UX kötü)
  - `NavigationSplitView` (reddedildi — 5 tab için overkill)

### ADR-009: SwiftData over Core Data

- **Karar**: Persistence için SwiftData
- **Durum**: Kabul edildi
- **Alternatifler**:
  - Core Data (reddedildi — boilerplate, iOS 17+ için SwiftData stable)
  - GRDB (reddedildi — minimal state için overkill)
  - `@AppStorage` only (reddedildi — geçmiş listesi ihtiyacı için yetersiz)

### ADR-010: Analytics Sıfır veya Privacy-First

- **Karar**: v1'de sıfır analytics. v1.1'de TelemetryDeck opsiyonu değerlendirilecek.
- **Durum**: ✅ Onaylandı (kullanıcı, 2026-04-07)
- **Gerekçe**: ATT dialog istemiyoruz, privacy label "Data Not Collected" kalsın v1'de.

### ADR-011: v1 EN-only Localization

- **Karar**: v1 yalnızca İngilizce. MT/TR/IT v1.1'e bırakıldı.
- **Durum**: ✅ Onaylandı (kullanıcı, 2026-04-07)
- **Gerekçe**: Hızlı launch, dar scope. String Catalog iskeleti hazır → v1.1'de kod değişikliği olmadan dil eklenecek.

### ADR-012: Offline-First, Zero Backend v1

- **Karar**: v1'de Clerk/Supabase/auth yok. Tüm özellikler offline.
- **Durum**: ✅ Onaylandı (kullanıcı, 2026-04-07)
- **Gerekçe**: B2B payroll SaaS v2'ye ertelendi. v1 = halka açık calculator + guides + opsiyonel iCloud.

### ADR-013: iCloud Sync Opt-In, Default Off

- **Karar**: SwiftData + CloudKit private DB, kullanıcı Settings'ten açar.
- **Durum**: ✅ Onaylandı (kullanıcı, 2026-04-07)
- **Gerekçe**: Privacy label temiz kalır ("Data Not Collected"). Kullanıcı bilinçli seçim yapar.

### ADR-014: Fiyat Modeli — Tamamen Ücretsiz v1

- **Karar**: v1 tamamen ücretsiz, IAP yok. v1.2+'de PRO tier değerlendirilecek.
- **Durum**: ✅ Onaylandı (kullanıcı, 2026-04-07)
- **Gerekçe**: Hızlı kullanıcı build-up, App Review basit, launch friction sıfır.

### ADR-015: Brand ve Bundle ID

- **Karar**: App Name = `Malta Calculator`, Bundle ID = `com.maltacalculator.app`, Primary color = `#C97D0A` (Malta Gold).
- **Durum**: ✅ Onaylandı (kullanıcı, 2026-04-07)
- **Gerekçe**: Web ile birebir tutarlılık, ASO için "malta" + "calculator" title'da.

---

## 5. Port Önceliği (İlk 4 Hafta Hedefi)

| Hafta | Teslim                                                                  | Milestone |
| ----- | ----------------------------------------------------------------------- | --------- |
| 1     | M1 (project setup) + M2 (design system temeli: tokens + materials)      | PR merged |
| 2     | CalculationKit: Salary + Mortgage + Stamp Duty + Loan + testleri        | PR merged |
| 3     | Salary Feature UI + Calculators grid iskeleti                           | PR merged |
| 4     | Mortgage + Stamp Duty + Personal Loan detay ekranları + Guides iskeleti | PR merged |

---

## 6. Açık Sorular (Kullanıcı Onayı Gerekli)

> **Tümü karara bağlandı — 2026-04-07**. ADR-007, 010, 011, 012, 013, 014, 015'e bakın.

- [x] **Minimum iOS sürümü**: iOS 18 + iOS 26 optimum
- [x] **Dil**: v1 EN-only. MT/TR/IT → v1.1
- [x] **Analytics**: Hiç yok. Privacy label "Data Not Collected"
- [x] **Auth/Backend**: Offline-first, hiç backend yok
- [x] **iCloud Sync**: Opt-in, default kapalı (Settings'ten açılır)
- [x] **Tasarım paleti**: Malta Gold `#C97D0A` (web ile birebir)
- [x] **Apple Developer**: Individual hesap mevcut
- [x] **Bundle ID**: `com.maltacalculator.app`
- [x] **App Name**: `Malta Calculator`
- [x] **Premium/IAP**: v1 tamamen ücretsiz, IAP yok. v1.2+'de PRO tier değerlendirilecek.

---

## 7. Riskler ve Azaltma

| #   | Risk                                                                   | Etki              | Olasılık  | Azaltma                                         |
| --- | ---------------------------------------------------------------------- | ----------------- | --------- | ----------------------------------------------- |
| R1  | iOS 26 Liquid Glass API'leri WWDC sonrası değişir                      | UI bozulması      | Orta      | `#available` fallback + centralized modifier    |
| R2  | Vergi kuralları yıllık değişir, app güncellenmeden eski kalır          | Yanlış hesap      | Yüksek    | Remote JSON config (v1.1) + bundled default     |
| R3  | Decimal işlemlerinde TS ↔ Swift fark                                   | Finansal hata     | Orta      | Golden fixture test %100 coverage               |
| R4  | SwiftData migration hataları                                           | Data loss         | Düşük     | SchemaMigrationPlan'ı baştan hazırla            |
| R5  | App Store review rejection (finansal tavsiye?)                         | Launch gecikmesi  | Orta      | Disclaimer metni + "informational only" vurgusu |
| R6  | Binary size iOS önerilen limiti (200 MB cellular) aşar                 | Download friction | Düşük     | Asset thinning + lazy content loading           |
| R7  | CalculationKit port sırasında TS edge case kaçırılır                   | Bug               | Orta      | Golden test + web tarafındaki mevcut testler    |
| R8  | Liquid Glass + Orb animasyonları düşük-end cihazda 60 fps altına düşer | UX kötü           | Orta      | `reduceMotion` + ProMotion check + profiling    |
| R9  | Localization hazır değilken store listesinde sadece EN                 | Discoverability   | Düşük     | ASO için keyword stratejisi v1.1'e              |
| R10 | iCloud CloudKit quota (privacy DB)                                     | Sync fail         | Çok düşük | Quota < 10 MB kullanıcı başı, izleme            |

---

## 8. Kabul Kriterleri (Bu Task için)

- [x] `ios-app-plan/README.md` master plan yazıldı
- [x] `tasks/00-pre-study.md` (bu dosya) yazıldı
- [x] 17 task dosyası iskeleti hazır
- [ ] Açık sorular kullanıcı ile teyit edildi
- [x] `tasks/17-calculator-mapping.md` tüm motorlar için eksiksiz
- [x] Risk matrisi yazıldı
- [x] ADR kayıtları yazıldı

---

## 9. Sıradaki Adım

Kullanıcı açık soruları yanıtlayınca → `tasks/01-project-setup.md` başlıyor.

Branch önerisi: `feat/ios-bootstrap`
PR başlığı: `chore(ios): bootstrap Xcode workspace + SPM packages + CI`
