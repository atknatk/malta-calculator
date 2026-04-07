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

---

## 2. Web Code Base Analizi

### 2.1 Teknoloji (Web)

- Next.js 16 App Router, TS strict
- Tailwind + Radix UI
- Tax config: `src/config/malta-tax-config.ts` (2020-2026, 7 vergi kategorisi)
- Hesap motorları: `src/utils/*-calculator.ts` (17+ dosya)
- Her hesaplayıcı `src/app/calculators/{slug}/_components/*-calculator.tsx` altında
- UI stili: glass + gradient + framer-motion

### 2.2 Hesap Motorları (Web'de mevcut)

Repo'dan direkt teyit edildi:

```
childrens-allowance-calculator.ts
drivers-license-calculator.ts
family-reunification-calculator.ts
import-vehicle-calculator.ts
loan-calculator.ts
mortgage-calculator.ts
notice-period-calculator.ts
overtime-calculator.ts
pension-calculator.ts
retirement-age-calculator.ts
road-license-calculator.ts
salary-calculator.ts         ← ana motor (kümülatif vergi + SSC + COLA)
savings-calculator.ts
stamp-duty-calculator.ts
vacation-calculator.ts
vehicle-registration-fee-calculator.ts
vehicle-registration-tax-calculator.ts
vrt-calculator.ts
```

### 2.3 Aktif / Coming Soon Durumu

`src/app/calculators/page.tsx`'teki kategori tablosundan:

| Kategori             | Aktif                                                                           | Soon                                  |
| -------------------- | ------------------------------------------------------------------------------- | ------------------------------------- |
| Employment & Salary  | Salary, Notice Period, Overtime                                                 | Bonus Tax, Part-Time, Expat Tax       |
| Family & Children    | Children's Allowance                                                            | Childcare, Maternity, In-Work Benefit |
| Property & Housing   | Stamp Duty                                                                      | Rental Tax, First-Time Buyer          |
| Banking & Loans      | Mortgage, Savings Interest, Personal Loan                                       | —                                     |
| Retirement & Savings | Pension, Retirement Age                                                         | —                                     |
| Self-Employment      | —                                                                               | Self-Employed Tax, Self-Employed SSC  |
| Leave & Time Off     | Vacation Days                                                                   | Sick Leave                            |
| Transport & Vehicles | Vehicle Reg Fee, VRT, Road License, Driver's License, VRT (MOT), Import Vehicle | —                                     |
| Immigration & Visa   | Family Reunification                                                            | —                                     |

**v1 iOS scope = tüm "Aktif" olanlar** (16 hesaplayıcı). "Soon" olanlar v1.1'e ertelenecek.

### 2.4 Blog / Guides

38+ Markdown yazısı (`src/app/blog/*`). Port stratejisi:

- İlk build'de en popüler **10 rehber** bundled Markdown olarak gelir.
- Kalanı v1.1'de "download more" ile opsiyonel senkronizasyon.
- Markdown içinden relative link ve resim referansları temizlenecek bir ETL script yazılır.

### 2.5 Tasarım Dili (Web)

`src/app/globals.css` incelendi — öne çıkanlar:

- HSL bazlı tema değişkenleri (Malta gold + Mediterranean blue + warm off-white)
- `glass`, `glass-strong`, `gradient-border`, `premium-card` utility sınıfları
- `.orb-gold / orb-blue / orb-coral` floating blur elementleri
- Mesh gradient background (radial 4 nokta)
- `animate-float, animate-gradient, animate-glow` keyframe'ler

**iOS karşılıkları**:

| Web                | iOS (iOS 26)                               | iOS (iOS 18 fallback)                     |
| ------------------ | ------------------------------------------ | ----------------------------------------- |
| `.glass`           | `.glassEffect()`                           | `.background(.regularMaterial)`           |
| `.glass-strong`    | `.glassEffect(.thick)`                     | `.background(.thickMaterial)`             |
| mesh gradient body | `MeshGradient` view                        | 4 x `RadialGradient` + blend              |
| `.orb-*`           | `RadialGradient` + `.blur(radius: 60)`     | aynı                                      |
| `animate-float`    | `PhaseAnimator`                            | `withAnimation(.easeInOut.repeatForever)` |
| `.text-gradient`   | `ForegroundStyle(LinearGradient(...))`     | aynı                                      |
| `.btn-glow`        | `ButtonStyle` + `shadow` + shimmer overlay | aynı                                      |

---

## 3. iOS 26 Liquid Glass Notları

Karar: **native** kullanıyoruz, taklit etmiyoruz.

- `glassEffect(_:in:)` ve `glassBackgroundEffect(in:)` iOS 26 API'leri
- `GlassEffectContainer` — birden fazla cam yüzeyi tek bir kırılma katmanında birleştirir
- `TabView` iOS 26'da otomatik olarak floating glass bar kullanır — ek iş yok
- `ToolBar` iOS 26'da glass background varsayılan
- Sheet ve popover'lar `.presentationBackground(.glass)` modifier'ı ile cam

**Fallback stratejisi** (iOS 18):

```swift
extension View {
    @ViewBuilder
    func liquidGlass(radius: CGFloat = 20) -> some View {
        if #available(iOS 26.0, *) {
            self.glassEffect(.regular, in: .rect(cornerRadius: radius))
        } else {
            self
                .background(.regularMaterial, in: .rect(cornerRadius: radius))
                .overlay(
                    RoundedRectangle(cornerRadius: radius)
                        .strokeBorder(Color.white.opacity(0.2))
                )
        }
    }
}
```

Bu uzantı `DesignSystem` paketinde tek yerden yönetilir.

---

## 4. Mimari Kararlar (ADR özet)

### ADR-001: SwiftUI + `@Observable`

- **Seçim**: SwiftUI + Observation framework (iOS 17+)
- **Alternatifler**: UIKit (reddedildi — modern değil), SwiftUI + TCA (reddedildi — overkill)
- **Gerekçe**: iOS 26 Liquid Glass API'leri SwiftUI-first. `@Observable` makrosu Combine'a ihtiyaç bırakmıyor.

### ADR-002: SPM Modülerleştirme

- **Seçim**: Local SwiftPM paketleri (`CalculationKit`, `DesignSystem`)
- **Gerekçe**: UI'dan bağımsız test edilebilir motor, hızlı build, macOS/iPadOS paylaşımı kolay.

### ADR-003: Foundation.Decimal Kullanımı

- **Seçim**: Tüm para hesapları `Decimal` ile
- **Gerekçe**: Double kayan nokta hatası finansal hesaplarda kabul edilemez. Web tarafında JS Number ile küçük yuvarlama farkları var; iOS'ta daha sağlam olalım, golden testlerde tolerans = ±€0.01.

### ADR-004: JSON-kaynaklı Tax Config

- **Seçim**: Tax config `Content/tax-config-2020-2026.json` olarak bundle
- **Gerekçe**: Web ve iOS aynı dosyayı share edebilir (v2). Yıllık update için store submission gerekmeyebilir (remote JSON v1.1).

### ADR-005: MVVM, Feature-scoped

- **Seçim**: Feature klasörleri `View` + `ViewModel` + `State` içerir
- **Reddedilen**: Clean Architecture (aşırı katman), Redux-like (SwiftUI'ye zıt)

### ADR-006: Tek bir `@main` Target

- **Seçim**: `MaltaCalculator` uygulaması tek target. Her feature SPM paketi değil, feature **klasörü**. `CalculationKit` ve `DesignSystem` paket.
- **Gerekçe**: Feature'ların SPM paketi olması build süresini uzatıyor, teşhis zorlaşıyor. Sadece gerçek bağımsız katmanları paketle.

---

## 5. Port Önceliği (İlk 4 Hafta Hedefi)

| Hafta | Teslim                                                                  |
| ----- | ----------------------------------------------------------------------- |
| 1     | M1 (setup) + M2 (design system temeli)                                  |
| 2     | CalculationKit: Salary + Mortgage + Stamp Duty + Loan                   |
| 3     | Salary Feature UI + Calculators grid                                    |
| 4     | Mortgage + Stamp Duty + Personal Loan detay ekranları + Guides iskeleti |

---

## 6. Açık Sorular (Kullanıcı Onayı Gerekli)

- [ ] **Minimum iOS sürümü**: iOS 18 mi, iOS 26 mı? (Öneri: iOS 18 fallback ile 26 optimum)
- [ ] **Dil**: v1 sadece İngilizce mi, yoksa Türkçe/Maltaca'yı da kapsayacak mı? (Öneri: v1 EN-only, MT/TR v1.1)
- [ ] **Analytics**: TelemetryDeck (paid, privacy-first) mi yoksa Apple MetricKit (free ama sınırlı) mı?
- [ ] **Auth/Backend**: Offline-first tamam ama Clerk/Supabase hesapları iOS'a taşınacak mı? (Öneri: v1'de hayır)
- [ ] **Hesap geçmişi iCloud sync**: SwiftData + iCloud açık mı? (Öneri: evet, kullanıcı tercihine bağlı)
- [ ] **Tasarım paleti**: Malta gold #C97D0A renkli ana vurgu tamam mı? (Web ile aynı)
- [ ] **App Store geliştirici hesabı**: Mevcut mu, individual mı enterprise mı?
- [ ] **Bundle ID**: `com.maltacalculator.app` mi, başka bir değer mi?

---

## 7. Kabul Kriterleri (Bu Task için)

- [x] `ios-app-plan/README.md` master plan yazıldı
- [x] `tasks/00-pre-study.md` (bu dosya) yazıldı
- [ ] Kalan 17 task dosyası iskeleti hazır
- [ ] Açık sorular kullanıcı ile teyit edildi
- [ ] `tasks/17-calculator-mapping.md` tüm motorlar için eksiksiz

---

## 8. Sıradaki Adım

Kullanıcı açık soruları yanıtlayınca → `tasks/01-project-setup.md` başlıyor.
