# Task 14 — Accessibility (VoiceOver, Dynamic Type, Contrast)

> **Faz**: M8
> **Ön koşul**: Tüm feature'lar işlevsel
> **Çıktı**: WCAG AA seviyesinde erişilebilir, Apple Accessibility Inspector temiz rapor

---

## 1. Prensipler

- **VoiceOver Everything** — hiçbir etkileşimli öğe label'sız kalmaz
- **Dynamic Type** — xSmall → AX5 arası layout kırılmaz
- **Color Contrast** — 4.5:1 minimum metin/arkaplan
- **Reduce Motion** — liquid glass ve animasyonlar kapanır, blur sabit
- **Reduce Transparency** — glass yerine solid background
- **Increased Contrast** — border ve focus state'ler belirginleşir

---

## 2. VoiceOver

### 2.1 Genel Kurallar

- [ ] Her `Button` için `accessibilityLabel` + `accessibilityHint`
- [ ] Değeri olan kontroller (slider, stepper, toggle) için `accessibilityValue`
- [ ] Dekoratif öğeler `accessibilityHidden(true)` (orb'lar, gradient arkaplan)
- [ ] Custom component'lar `.accessibilityElement(children: .combine)` veya `.contain` ile mantıklı gruplanmış

### 2.2 Salary Feature Özel

- [ ] Net pay card → "Net pay: 1,248 euros per month, 14,976 euros per year"
- [ ] Monthly row → "January: 1,248 euros net after 234 euros tax and 120 euros SSC"
- [ ] Donut chart → tek label özet
- [ ] Input'lar → `accessibilityLabel: "Annual gross salary in euros"`

### 2.3 Calculators Grid

- [ ] Kart → "Mortgage Calculator, Home loan with 10% minimum deposit, available"
- [ ] Coming soon → "Bonus Tax, coming soon, not available"

---

## 3. Dynamic Type

- [ ] Tüm `Text` / `Label` SF Symbol `.symbolRenderingMode(.hierarchical)` ve `Font` scaling
- [ ] `ScaledMetric` ile padding/spacing değerleri ölçekleniyor
- [ ] AX5'te layout kırılmıyor → `ViewThatFits` veya `Layout` protocol kullan
- [ ] Multi-column grid AX3+'te tek kolona düşüyor
- [ ] Tab bar etiketleri gizlenip yalnızca ikon kalıyor gerektiğinde

---

## 4. Contrast & Colors

- [ ] Primary Malta gold `#C97D0A` — beyaz üzerinde 4.5:1 ✓
- [ ] Secondary Mediterranean blue `#0099CC` — beyaz üzerinde test edilmeli, gerekirse koyulaştırılır
- [ ] Text on glass background: min 4.5:1 — `DesignSystem` token'larda test et
- [ ] Dark mode renkleri: Apple HIG önerilen aralıkta
- [ ] High contrast override: daha koyu primary, daha belirgin border

---

## 5. Reduce Motion / Transparency

```swift
@Environment(\.accessibilityReduceMotion) private var reduceMotion
@Environment(\.accessibilityReduceTransparency) private var reduceTransparency

var background: some View {
    Group {
        if reduceTransparency {
            Color.DS.surface
        } else {
            MeshBackground()
        }
    }
}
```

- [ ] Orb'lar reduceMotion ile hareket etmez
- [ ] Phase animasyonlar kapanır
- [ ] Mesh gradient → solid yüzey
- [ ] Liquid glass → opak surface

---

## 6. Alt Adımlar

- [ ] `DesignSystem`'de a11y utility'leri (`.dsAccessible(label:hint:value:)`)
- [ ] Her feature için a11y audit
- [ ] Xcode Accessibility Inspector'da "Run Audit"
- [ ] VoiceOver swipe flow test (her feature en az bir kere)
- [ ] Dynamic Type AX3 snapshot testleri
- [ ] Reduce Motion/Transparency snapshot testleri

---

## 7. Kabul Kriterleri

- [ ] Accessibility Inspector audit: 0 error
- [ ] VoiceOver ile Salary ekranı tam kullanılabilir
- [ ] Dynamic Type AX5 layout kırılmıyor
- [ ] Reduce Motion açıkken hiç animasyon yok
- [ ] Reduce Transparency açıkken glass kullanılmıyor
- [ ] Color contrast tool'u ile test edildi (Stark, Contrast)

---

## 8. Sıradaki

[`15-performance.md`](15-performance.md)
