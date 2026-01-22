# Malta Payroll Calculation Rules

Bu dosya, `Payroll Working.xlsx` dosyasından çıkarılan Malta maaş bordrosu hesaplama kurallarını içermektedir.
Bu kurallar `src/utils/salary-calculator.ts` dosyasında uygulanmalıdır.

---

## Giriş Parametreleri (Input Parameters)

| Parametre | Açıklama | Örnek Değer |
|-----------|----------|-------------|
| `grossSalary` | Yıllık brüt maaş (€) | 36,000 |
| `yearlyNonTaxBenefit` | Yıllık vergi dışı yan hak (€) | 1,170 (aylık €97.50) |
| `yearlyTaxableBenefit` | Yıllık vergiye tabi yan hak (€) | 1,170 (aylık €97.50) |
| `birthDate` | Doğum tarihi | 1990-01-15 |
| `sscCategory` | SSC Kategorisi | "A", "B", "C", "D" |
| `weeksInMonth` | Ay içindeki hafta sayısı | 4 veya 5 |

---

## Aylık Hesaplama Formülleri

### 1. Temel Maaş Bileşenleri

```
basicSalary = grossSalary / 12
nonTaxBenefit = yearlyNonTaxBenefit / 12
taxBenefit = yearlyTaxableBenefit / 12
```

### 2. Brüt Toplam (Gross Total)

```
grossTotal = basicSalary + nonTaxBenefit + taxBenefit + bonus + governmentBonus
```

---

## SSC (Social Security Contribution) Hesaplama

### 3. SSC Base (Haftalık Cap ile)

```
weeklyEquivalent = (basicSalary * 12) / 52
WEEKLY_CAP = 559.31

IF weeklyEquivalent < WEEKLY_CAP:
    sscBase = weeklyEquivalent * weeksInMonth
ELSE:
    sscBase = WEEKLY_CAP * weeksInMonth
```

**Önemli:** SSC Base, haftalık €559.31 tavanı aşamaz!

### 4. SSC Tax (Kategori Bazlı)

SSC vergisi, çalışanın kategorisine göre hesaplanır:

| Kategori | Açıklama | Formül |
|----------|----------|--------|
| **A** | Pensioner (Emekli) | `6.62 * weeksInMonth` |
| **B** | Part-time | `MIN(22.94 * weeksInMonth, sscBase * 0.10)` |
| **C** | Full-time (Standart) | Doğum tarihine bağlı (aşağıya bakın) |
| **D** | Self-employed | Doğum tarihine bağlı (aşağıya bakın) |

#### Kategori C ve D için Doğum Tarihi Kontrolü:

```
IF birthDate < 1962-01-01:
    // Eski regime
    Category C: MIN(49.04 * weeksInMonth, sscBase * 0.10)
    Category D: 49.04 * weeksInMonth
ELSE:
    // Yeni regime (1962 ve sonrası doğumlular)
    Category C: MIN(55.93 * weeksInMonth, sscBase * 0.10)
    Category D: 55.93 * weeksInMonth
```

---

## Gelir Vergisi (Income Tax) Hesaplama

### 5. Income Base

```
incomeBase = grossTotal - nonTaxBenefit
```

**Not:** Non-Tax Benefit vergiye tabi değildir, bu yüzden çıkarılır.

### 6. Kümülatif Income Base

```
cumulativeIncomeBase = previousCumulativeIncomeBase + incomeBase
```

### 7. Income Tax Dilimleri (Malta CFR Resmi - Single Rates)

Malta'da kümülatif vergilendirme sistemi kullanılır. Aylık vergi, yıllık projeksiyon üzerinden hesaplanır:

| Yıllık Gelir (€) | Vergi Oranı | Yıllık Kesinti (€) |
|------------------|-------------|-------------------|
| 0 - 9,100 | 0% | 0 |
| 9,101 - 14,500 | 15% | 1,365 |
| 14,501 - 19,500 | 25% | 2,815 |
| 19,501 - 60,000 | 25% | 2,725 |
| 60,001+ | 35% | 8,725 |

**Not:** Bu dilimler Malta CFR (Commissioner for Revenue) resmi oranlarıdır.
Evli (married) ve ebeveyn (parent) için farklı dilimler mevcuttur.

### 8. Aylık Income Tax Formülü

**İlk ay için:**
```
IF annualGross <= 12000:
    incomeTax = 0
ELSE IF annualGross <= 16000:
    incomeTax = (((incomeBase * 12) * 0.15) - 1800) / 12
ELSE IF annualGross <= 60000:
    incomeTax = (((incomeBase * 12) * 0.25) - 3400) / 12
ELSE:
    incomeTax = (((incomeBase * 12) * 0.35) - 9400) / 12
```

**Sonraki aylar için (kümülatif hesaplama):**
```
IF annualGross <= 12000:
    incomeTax = 0
ELSE IF annualGross <= 16000:
    incomeTax = (((cumulativeIncomeBase / month * 12) * 0.15) - 1800) / 12 * month - previousCumulativeTax
ELSE IF annualGross <= 60000:
    incomeTax = (((cumulativeIncomeBase / month * 12) * 0.25) - 3400) / 12 * month - previousCumulativeTax
ELSE:
    incomeTax = (((cumulativeIncomeBase / month * 12) * 0.35) - 9400) / 12 * month - previousCumulativeTax
```

---

## Net Maaş Hesaplama

### 9. Net Maaş

```
net = grossTotal - sscTax - incomeTax
```

---

## Haftalık Sabitler (2024)

| Sabit | Değer (€) | Açıklama |
|-------|-----------|----------|
| `WEEKLY_SSC_CAP` | 559.31 | SSC Base haftalık tavan |
| `SSC_RATE_A` | 6.62 | Kategori A haftalık SSC |
| `SSC_RATE_B` | 22.94 | Kategori B haftalık SSC max |
| `SSC_RATE_C_OLD` | 49.04 | Kategori C (doğum <1962) haftalık SSC max |
| `SSC_RATE_C_NEW` | 55.93 | Kategori C (doğum >=1962) haftalık SSC max |
| `SSC_RATE_D_OLD` | 49.04 | Kategori D (doğum <1962) sabit haftalık SSC |
| `SSC_RATE_D_NEW` | 55.93 | Kategori D (doğum >=1962) sabit haftalık SSC |

---

## Örnek Hesaplama

**Girişler:**
- Yıllık Brüt: €36,000
- SSC Kategorisi: C
- Doğum Tarihi: 1990-01-15
- Ayda 4 hafta

**Hesaplama:**
```
basicSalary = 36000 / 12 = 3000
weeklyEquivalent = (3000 * 12) / 52 = 692.31
sscBase = 559.31 * 4 = 2237.24  // Cap uygulandı
sscTax = MIN(55.93 * 4, 2237.24 * 0.10) = MIN(223.72, 223.72) = 223.72
incomeBase = 3000 - 0 = 3000  // Non-tax benefit olmadan
incomeTax = (((3000 * 12) * 0.25) - 3400) / 12 = (9000 - 3400) / 12 = 466.67
net = 3000 - 223.72 - 466.67 = 2309.61
```

---

## Uygulama Notları

1. **Kümülatif Sistem:** Malta'da vergi yıl boyunca kümülatif olarak hesaplanır. Her ay, yılbaşından o aya kadar olan toplam gelir üzerinden vergi hesaplanır ve önceki ayların vergisi düşülür.

2. **Hafta Sayısı:** Bazı aylar 4, bazıları 5 hafta içerir. Bu SSC hesabını etkiler.

3. **Government Bonus:** Malta'da devlet tarafından ödenen ek ödenekler bulunabilir (örn: Cost of Living Adjustment).

4. **Farklı Vergi Tarifeleri:** Evli çiftler ve ebeveynler için farklı vergi dilimleri mevcuttur. Bu kurallar "Single" tarifesi içindir.

---

## Referanslar

- Kaynak: `Payroll Working.xlsx`
- Malta CFR (Commissioner for Revenue): https://cfr.gov.mt
- Malta SSC Rates: https://socialsecurity.gov.mt
