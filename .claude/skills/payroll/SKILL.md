---
name: payroll
description: Malta payroll calculation rules and formulas reference
disable-model-invocation: true
user-invocable: true
---

# Malta Payroll Calculation Rules

Malta bordro hesaplama kuralları ve formülleri.

## Input Parametreleri

| Parametre | Açıklama | Örnek |
|-----------|----------|-------|
| `grossSalary` | Yıllık brüt maaş (€) | 36,000 |
| `yearlyNonTaxBenefit` | Yıllık vergi dışı yan hak | 1,170 |
| `yearlyTaxableBenefit` | Yıllık vergiye tabi yan hak | 1,170 |
| `birthDate` | Doğum tarihi | 1990-01-15 |
| `sscCategory` | SSC Kategorisi | "A", "B", "C", "D" |
| `weeksInMonth` | Ay içindeki hafta sayısı | 4 veya 5 |

---

## Hesaplama Formülleri

### 1. Temel Maaş Bileşenleri
```
basicSalary = grossSalary / 12
nonTaxBenefit = yearlyNonTaxBenefit / 12
taxBenefit = yearlyTaxableBenefit / 12
```

### 2. Brüt Toplam
```
grossTotal = basicSalary + nonTaxBenefit + taxBenefit + bonus + governmentBonus
```

---

## SSC (Social Security Contribution)

### SSC Base (Haftalık Cap ile)
```
weeklyEquivalent = (basicSalary * 12) / 52
WEEKLY_CAP = 559.31

IF weeklyEquivalent < WEEKLY_CAP:
    sscBase = weeklyEquivalent * weeksInMonth
ELSE:
    sscBase = WEEKLY_CAP * weeksInMonth
```

### SSC Tax (Kategori Bazlı)

| Kategori | Açıklama | Formül |
|----------|----------|--------|
| **A** | Pensioner | `6.62 * weeksInMonth` |
| **B** | Part-time | `MIN(22.94 * weeksInMonth, sscBase * 0.10)` |
| **C** | Full-time | Doğum tarihine bağlı |
| **D** | Self-employed | Doğum tarihine bağlı |

### Kategori C ve D için Doğum Tarihi Kontrolü
```
IF birthDate < 1962-01-01:
    // Eski regime
    Category C: MIN(49.04 * weeksInMonth, sscBase * 0.10)
    Category D: 49.04 * weeksInMonth
ELSE:
    // Yeni regime (1962 ve sonrası)
    Category C: MIN(55.93 * weeksInMonth, sscBase * 0.10)
    Category D: 55.93 * weeksInMonth
```

---

## Gelir Vergisi (Income Tax)

### Income Base
```
incomeBase = grossTotal - nonTaxBenefit
```

### Kümülatif Income Base
```
cumulativeIncomeBase = previousCumulativeIncomeBase + incomeBase
```

### Vergi Dilimleri (2026 - Single)

| Yıllık Gelir (€) | Oran | Yıllık Kesinti (€) |
|------------------|------|-------------------|
| 0 - 9,100 | 0% | 0 |
| 9,101 - 14,500 | 15% | 1,365 |
| 14,501 - 19,500 | 25% | 2,815 |
| 19,501 - 60,000 | 25% | 2,725 |
| 60,001+ | 35% | 8,725 |

### Aylık Income Tax (İlk Ay)
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

---

## Net Maaş
```
net = grossTotal - sscTax - incomeTax
```

---

## COLA (Cost of Living Adjustment) 2026

| Çeyrek | Tutar (€) |
|--------|-----------|
| Q1 (Mart) | 121.16 |
| Q2 (Haziran) | 135.10 |
| Q3 (Eylül) | 121.16 |
| Q4 (Aralık) | 135.10 |

---

## Sabitler (2026)

| Sabit | Değer (€) |
|-------|-----------|
| `WEEKLY_SSC_CAP` | 559.31 |
| `SSC_RATE_A` | 6.62 |
| `SSC_RATE_B` | 22.94 |
| `SSC_RATE_C_OLD` | 49.04 |
| `SSC_RATE_C_NEW` | 55.93 |
| `SSC_RATE_D_OLD` | 49.04 |
| `SSC_RATE_D_NEW` | 55.93 |

---

## Örnek Hesaplama

**Girişler:**
- Yıllık Brüt: €36,000
- SSC Kategorisi: C
- Doğum: 1990-01-15
- Ayda 4 hafta

**Hesaplama:**
```
basicSalary = 36000 / 12 = 3000
weeklyEquivalent = (3000 * 12) / 52 = 692.31
sscBase = 559.31 * 4 = 2237.24  (Cap uygulandı)
sscTax = MIN(55.93 * 4, 2237.24 * 0.10) = 223.72
incomeBase = 3000
incomeTax = (((3000 * 12) * 0.25) - 3400) / 12 = 466.67
net = 3000 - 223.72 - 466.67 = 2309.61
```

---

## Referanslar
- Kaynak Dosya: `Payroll Working.xlsx`
- Malta CFR: https://cfr.gov.mt
- Malta SSC: https://socialsecurity.gov.mt
- Kod: `src/utils/salary-calculator.ts`
- Config: `src/config/malta-tax-config.ts`
