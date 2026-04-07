# Task 08 — Feature: Calculator Detail Screens

> **Faz**: M5
> **Ön koşul**: `CalculationKit` motor port edilmiş, `DesignSystem` hazır
> **Çıktı**: 16 aktif hesaplayıcı için detay ekranları (her biri test edilmiş)

---

## 1. Amaç

Her hesaplayıcı detay ekranı aynı "iskelet"e oturur: input bloğu + sonuç bloğu + (opsiyonel) grafik + bilgi notu + paylaş. Her biri için ayrı bir `ViewModel` + `View` çifti üretilir.

---

## 2. Ortak İskelet

```swift
struct CalculatorDetailScaffold<Inputs: View, Results: View>: View {
    let title: LocalizedStringResource
    let icon: String
    let gradient: LinearGradient
    @ViewBuilder var inputs: Inputs
    @ViewBuilder var results: Results
    let info: [InfoLine]
    let shareContent: ShareContent

    var body: some View {
        ScrollView {
            VStack(spacing: DSSpacing.lg) {
                HeroHeader(title: title, icon: icon, gradient: gradient)
                DSCard { inputs }
                DSCard(.highlighted) { results }
                InfoList(lines: info)
                ShareBar(content: shareContent)
            }
        }
        .scrollDismissesKeyboard(.interactively)
        .background(MeshBackground())
        .navigationBarTitleDisplayMode(.inline)
    }
}
```

Her detay ekranı bu scaffold'u kullanır, `inputs` ve `results` bloklarını kendi doldurur.

---

## 3. 16 Aktif Hesaplayıcı

Her biri için:

- Ayrı `ViewModel` — `CalculationKit` motorunu çağırır
- Ayrı `View` — scaffold + özelleştirilmiş input/result blokları
- Bilgi notu (web'deki `getXInfo()` helper karşılığı)
- ShareContent builder

| #   | ID                     | Not                                         |
| --- | ---------------------- | ------------------------------------------- |
| 1   | salary                 | Task 06 (ayrı feature)                      |
| 2   | mortgage               | Amortization chart + schedule expandable    |
| 3   | stampDuty              | First-time buyer discount toggle            |
| 4   | personalLoan           | Amortization chart                          |
| 5   | savingsInterest        | 15% tax toggle, compound freq               |
| 6   | pension                | Two-thirds pension + private pension credit |
| 7   | retirementAge          | Doğum yılı → yaş gösterimi                  |
| 8   | overtime               | 1.5x / 2x toggle                            |
| 9   | vacation               | Haftalık çalışma saati → yıllık entitlement |
| 10  | noticePeriod           | Hizmet yılı → notice hafta sayısı           |
| 11  | childrensAllowance     | Çocuk sayısı + aile geliri                  |
| 12  | familyReunification    | Salary requirement kontrolü                 |
| 13  | vehicleRegistrationFee | Araç tipi + yaşı                            |
| 14  | vehicleRegistrationTax | CO2 g/km + motor tipi                       |
| 15  | roadLicense            | Motor hacmi, yakıt                          |
| 16  | driversLicense         | Yenileme / yeni lisans                      |
| 17  | vrt                    | MOT test ücreti                             |
| 18  | importVehicle          | Toplam import maliyeti                      |

> Salary detay ekranı olmuyor, ana feature'a yönlendirir.

---

## 4. Alt Adımlar (Her Hesaplayıcı için Şablon)

- [ ] `Features/Calculators/{Name}/{Name}ViewModel.swift`
- [ ] `Features/Calculators/{Name}/{Name}Screen.swift`
- [ ] `Features/Calculators/{Name}/{Name}Info.swift` (statik bilgi)
- [ ] `Features/Calculators/{Name}/{Name}ShareCard.swift` (PNG için tasarım)
- [ ] `Tests/{Name}ViewModelTests.swift` — motor call'u doğru parametrelerle yapıyor mu

---

## 5. Teslim Sıralaması (Önem)

1. Mortgage
2. Personal Loan
3. Stamp Duty
4. Savings Interest
5. Pension
6. Overtime
7. Vacation + Notice Period
8. Retirement Age
9. Children's Allowance + Family Reunification
10. Vehicle kümesi (reg fee, reg tax, road license, driver license, VRT, import)

Her teslim: kendi branch, kendi PR, kendi snapshot.

---

## 6. Kabul Kriterleri (Her Detay için)

- [ ] Sonuç web'deki aynı input ile ±€0.01
- [ ] Input focus keyboard davranışı düzgün
- [ ] Share butonu PNG/Text üretiyor
- [ ] Snapshot test light + dark
- [ ] VoiceOver sonuç değerini okuyor
- [ ] Empty/edge case: 0 veya negatif → hatasız "—"

---

## 7. Sıradaki

[`09-feature-guides.md`](09-feature-guides.md)
