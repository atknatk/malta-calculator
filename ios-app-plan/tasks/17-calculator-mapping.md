# Task 17 — Calculator Mapping (Web TS → Swift)

> **Referans**: Bu doküman port sırasında kullanılacak tam eşleme tablosudur. Her motor için web kaynağı, public API'ler, Swift karşılığı ve test notları içerir.

---

## Toplam İş Yükü

- **18 hesap motoru** (1 legacy fonksiyon hariç)
- Web TS satır sayısı: **~3,702 LOC**
- Tahmini Swift LOC: **~4,500** (type safety ve decimal handling nedeniyle daha uzun)
- Test fixture sayısı: **~20 golden + ~100 unit**

---

## Motor Haritası

### 1. Salary — `src/utils/salary-calculator.ts` (308 LOC)

| TS Public API                        | Swift Karşılığı                       | Notlar               |
| ------------------------------------ | ------------------------------------- | -------------------- |
| `SalaryCalculatorConfig`             | `SalaryCalculatorConfig` (struct)     | `Decimal` alanlar    |
| `MonthlySalaryInput`                 | `SalaryInput`                         | `Month` enum         |
| `MonthlySalaryOutput`                | `SalaryOutput`                        |                      |
| `calculateMonthlyDeductions()`       | `SalaryCalculator.calculate(inputs:)` | Kümülatif vergi      |
| `defaultConfig`                      | `SalaryCalculatorConfig.default`      | Static property      |
| `calculateMonthlyDeductionsLegacy()` | —                                     | Legacy, port edilmez |

**Bağımlılıklar**: `TaxConfigStore.load()`, `Calendar` (Monday counts)
**Karmaşıklık**: **Yüksek** — kümülatif hesap, SSC kategorisi, COLA, 1962 flag
**Golden fixture**: 4 adet (single 2026, married+2 child, parent 2025, 1962 pensioner)

---

### 2. Mortgage — `src/utils/mortgage-calculator.ts` (202 LOC)

| TS                                        | Swift                                  |
| ----------------------------------------- | -------------------------------------- |
| `MortgageInput`                           | `MortgageInput`                        |
| `MortgageOutput`                          | `MortgageOutput`                       |
| `YearlyPayment`                           | `YearlyPayment`                        |
| `MORTGAGE_CONSTRAINTS`                    | `MortgageConstraints` (enum)           |
| `calculateMortgage(input)`                | `MortgageCalculator.calculate(input:)` |
| `formatCurrency`, `formatCurrencyDecimal` | — (DesignSystem/Money helper)          |
| `getMortgageInfo()`                       | `Mortgage.info` (static struct)        |

**Formül**: `PMT = P × [r(1+r)^n] / [(1+r)^n - 1]`
**Karmaşıklık**: Orta (amortization schedule)
**Golden fixture**: 2 adet (300k 25y, min-deposit 500k)

---

### 3. Personal Loan — `src/utils/loan-calculator.ts` (173 LOC)

| TS                       | Swift                                      |
| ------------------------ | ------------------------------------------ |
| `LoanInput`              | `LoanInput`                                |
| `LoanOutput`             | `LoanOutput`                               |
| `MonthlyPayment`         | `MonthlyPayment`                           |
| `LOAN_CONSTRAINTS`       | `LoanConstraints`                          |
| `calculateLoan()`        | `PersonalLoanCalculator.calculate(input:)` |
| `getLoanInfo()`          | `PersonalLoan.info`                        |
| `formatLoanTerm(months)` | `String.loanTerm(months:)` extension       |

**Karmaşıklık**: Orta
**Golden fixture**: 2 adet

---

### 4. Stamp Duty — `src/utils/stamp-duty-calculator.ts` (93 LOC)

| TS                     | Swift                                   |
| ---------------------- | --------------------------------------- |
| `StampDutyInput`       | `StampDutyInput`                        |
| `StampDutyOutput`      | `StampDutyOutput`                       |
| `calculateStampDuty()` | `StampDutyCalculator.calculate(input:)` |
| `getStampDutyInfo()`   | `StampDuty.info`                        |

**Özellik**: First-time buyer, Urban Conservation Area, Gozo discount
**Karmaşıklık**: Düşük (rule-based)
**Golden fixture**: 3 adet (standart, first-time, gozo)

---

### 5. Savings Interest — `src/utils/savings-calculator.ts` (189 LOC)

| TS                   | Swift                                 |
| -------------------- | ------------------------------------- |
| `SavingsInput`       | `SavingsInput`                        |
| `SavingsOutput`      | `SavingsOutput`                       |
| `YearlySavings`      | `YearlySavings`                       |
| `SAVINGS_CONSTANTS`  | `SavingsConstants`                    |
| `calculateSavings()` | `SavingsCalculator.calculate(input:)` |

**Özellik**: Compound frequency, 15% tax toggle
**Formül**: `A = P(1 + r/n)^(nt)`
**Karmaşıklık**: Orta

---

### 6. Pension — `src/utils/pension-calculator.ts` (306 LOC)

| TS                            | Swift                                            |
| ----------------------------- | ------------------------------------------------ |
| `PensionInput`                | `PensionInput`                                   |
| `PensionOutput`               | `PensionOutput`                                  |
| `MPI_2026` + sabitler         | `PensionConstants` enum                          |
| `getRequiredYears(birthYear)` | `PensionRules.requiredYears(birthYear:)`         |
| `getRetirementAge(birthYear)` | `PensionRules.retirementAge(birthYear:)`         |
| `getChildCredits()`           | `PensionRules.childCredits(birthYear:children:)` |
| `getDeferralBonusRate()`      | `PensionRules.deferralBonusRate(years:)`         |
| `calculatePension()`          | `PensionCalculator.calculate(input:)`            |
| `getPensionReferenceTable()`  | `Pension.referenceTable`                         |

**Özellik**: Two-thirds pension, private pension tax credit, targeted rebate, exemption
**Karmaşıklık**: **Yüksek** — birden fazla kural bir arada
**Golden fixture**: 3 adet

---

### 7. Retirement Age — `src/utils/retirement-age-calculator.ts` (105 LOC)

| TS                           | Swift                                       |
| ---------------------------- | ------------------------------------------- |
| `RetirementAgeInput`         | `RetirementAgeInput`                        |
| `RetirementAgeOutput`        | `RetirementAgeOutput`                       |
| `calculateRetirementAge()`   | `RetirementAgeCalculator.calculate(input:)` |
| `getRetirementAgeBrackets()` | `RetirementAge.brackets`                    |

**Karmaşıklık**: Düşük

---

### 8. Overtime — `src/utils/overtime-calculator.ts` (130 LOC)

| TS                            | Swift                                  |
| ----------------------------- | -------------------------------------- |
| `OvertimeInput`               | `OvertimeInput`                        |
| `OvertimeOutput`              | `OvertimeOutput`                       |
| `calculateOvertime()`         | `OvertimeCalculator.calculate(input:)` |
| `calculateHourlyRate(annual)` | `Overtime.hourlyRate(annual:)`         |
| `getOvertimeRates()`          | `Overtime.rates`                       |

**Karmaşıklık**: Düşük
**Özellik**: 1.5x / 2x toggle, weekend/public holiday rates

---

### 9. Vacation — `src/utils/vacation-calculator.ts` (124 LOC)

| TS                            | Swift                                  |
| ----------------------------- | -------------------------------------- |
| `VacationLeaveInput`          | `VacationInput`                        |
| `VacationLeaveOutput`         | `VacationOutput`                       |
| `calculateVacationLeave()`    | `VacationCalculator.calculate(input:)` |
| `getPublicHolidayInfo(year)`  | `Vacation.publicHolidays(year:)`       |
| `getAvailableVacationYears()` | `Vacation.availableYears`              |

**Karmaşıklık**: Düşük
**Özellik**: Min 192 hours/year, weekly hours → entitlement

---

### 10. Notice Period — `src/utils/notice-period-calculator.ts` (115 LOC)

| TS                        | Swift                                      |
| ------------------------- | ------------------------------------------ |
| `NoticePeriodInput`       | `NoticePeriodInput`                        |
| `NoticePeriodOutput`      | `NoticePeriodOutput`                       |
| `calculateNoticePeriod()` | `NoticePeriodCalculator.calculate(input:)` |

**Karmaşıklık**: Düşük
**Özellik**: Service years → notice weeks (Malta Employment Act)

---

### 11. Children's Allowance — `src/utils/childrens-allowance-calculator.ts` (247 LOC)

| TS                              | Swift                                            |
| ------------------------------- | ------------------------------------------------ |
| `CA_CONSTANTS`                  | `ChildrensAllowanceConstants`                    |
| `ChildrensAllowanceInput`       | `ChildrensAllowanceInput`                        |
| `ChildrensAllowanceResult`      | `ChildrensAllowanceResult`                       |
| `BirthBonusResult`              | `BirthBonusResult`                               |
| `calculateChildrensAllowance()` | `ChildrensAllowanceCalculator.calculate(input:)` |
| `calculateBirthBonus(order)`    | `ChildrensAllowance.birthBonus(order:)`          |
| `getRateTypeDescription()`      | (UI layer'da string catalog)                     |

**Karmaşıklık**: Orta
**Özellik**: Aile gelirine göre değişken oranlar, ilk çocuk bonus'u

---

### 12. Family Reunification — `src/utils/family-reunification-calculator.ts` (201 LOC)

| TS                               | Swift                                             |
| -------------------------------- | ------------------------------------------------- |
| `WAGE_DATA`                      | `FamilyReunification.wageData`                    |
| `FamilyReunificationInput`       | `FamilyReunificationInput`                        |
| `FamilyReunificationOutput`      | `FamilyReunificationOutput`                       |
| `calculateFamilyReunification()` | `FamilyReunificationCalculator.calculate(input:)` |
| `compareBothSchemes(count)`      | `FamilyReunification.compareSchemes(count:)`      |
| `getSchemeInfo(scheme)`          | `FamilyReunification.schemeInfo(_:)`              |
| `getMonthlyBreakdown(annual)`    | `FamilyReunification.monthlyBreakdown(annual:)`   |

**Karmaşıklık**: Orta
**Özellik**: Single Permit vs ordinary permit karşılaştırması

---

### 13. Vehicle Registration Fee — `src/utils/vehicle-registration-fee-calculator.ts` (271 LOC)

| TS                                  | Swift                                                |
| ----------------------------------- | ---------------------------------------------------- |
| `VehicleRegistrationFeeInput`       | `VehicleRegistrationFeeInput`                        |
| `VehicleRegistrationFeeOutput`      | `VehicleRegistrationFeeOutput`                       |
| `calculateVehicleRegistrationFee()` | `VehicleRegistrationFeeCalculator.calculate(input:)` |
| `getVehicleRegistrationInfo()`      | `VehicleRegistrationFee.info`                        |

**Karmaşıklık**: Orta (araç tipi ve yaşı kombinasyonları)

---

### 14. Vehicle Registration Tax — `src/utils/vehicle-registration-tax-calculator.ts` (204 LOC)

| TS                                  | Swift                                                |
| ----------------------------------- | ---------------------------------------------------- |
| `VehicleRegistrationTaxInput`       | `VehicleRegistrationTaxInput`                        |
| `VehicleRegistrationTaxOutput`      | `VehicleRegistrationTaxOutput`                       |
| `calculateVehicleRegistrationTax()` | `VehicleRegistrationTaxCalculator.calculate(input:)` |
| `getVehicleRegistrationTaxInfo()`   | `VehicleRegistrationTax.info`                        |

**Karmaşıklık**: Orta (CO2 g/km bracketing)
**Golden fixture**: 2 adet (düşük/yüksek CO2)

---

### 15. Road License — `src/utils/road-license-calculator.ts` (215 LOC)

| TS                       | Swift                                     |
| ------------------------ | ----------------------------------------- |
| `RoadLicenseInput`       | `RoadLicenseInput`                        |
| `RoadLicenseOutput`      | `RoadLicenseOutput`                       |
| `calculateRoadLicense()` | `RoadLicenseCalculator.calculate(input:)` |
| `getRoadLicenseInfo()`   | `RoadLicense.info`                        |

**Karmaşıklık**: Orta (motor hacmi + yakıt tipi)

---

### 16. Driver's License — `src/utils/drivers-license-calculator.ts` (278 LOC)

| TS                              | Swift                                        |
| ------------------------------- | -------------------------------------------- |
| `DriversLicenseInput`           | `DriversLicenseInput`                        |
| `DriversLicenseOutput`          | `DriversLicenseOutput`                       |
| `calculateDriversLicenseFees()` | `DriversLicenseCalculator.calculate(input:)` |
| `getDriversLicenseInfo()`       | `DriversLicense.info`                        |

**Karmaşıklık**: Orta

---

### 17. VRT (MOT) — `src/utils/vrt-calculator.ts` (222 LOC)

| TS               | Swift                             |
| ---------------- | --------------------------------- |
| `VRTInput`       | `VRTInput`                        |
| `VRTOutput`      | `VRTOutput`                       |
| `calculateVRT()` | `VRTCalculator.calculate(input:)` |
| `getVRTInfo()`   | `VRT.info`                        |

**Karmaşıklık**: Orta

---

### 18. Import Vehicle — `src/utils/import-vehicle-calculator.ts` (286 LOC)

| TS                         | Swift                                       |
| -------------------------- | ------------------------------------------- |
| `ImportVehicleInput`       | `ImportVehicleInput`                        |
| `ImportVehicleOutput`      | `ImportVehicleOutput`                       |
| `calculateImportVehicle()` | `ImportVehicleCalculator.calculate(input:)` |
| `getImportVehicleInfo()`   | `ImportVehicle.info`                        |

**Karmaşıklık**: **Yüksek** — VRT + reg tax + reg fee + shipping + customs compound
**Golden fixture**: 2 adet

---

## Ortak Port Kuralları

### Sayısal Tip Dönüşümü

| TS Tip                           | Swift Tip           |
| -------------------------------- | ------------------- |
| `number` (para)                  | `Money` = `Decimal` |
| `number` (oran 0-1)              | `Decimal`           |
| `number` (yaş, saat, hafta)      | `Int`               |
| `number` (boyutsuz, yüzde 0-100) | `Decimal`           |

### Enum Dönüşümü

| TS `type X = "a" \| "b"` | Swift `enum X: String, CaseIterable, Sendable, Codable { case a, b }` |

### `Infinity` Yönetimi

TS'te `max: Infinity` → Swift'te `max: Money.greatestFiniteMagnitude`. Loader parse sırasında `null` → max değer dönüşümü yapar.

### Formatter'lar

Web'deki `formatCurrency` ve `formatCurrencyDecimal` port edilmez — `DesignSystem.Money.eur` tek yerden servis edilir.

### `getXInfo()` Helper'ları

Bilgi metinleri kod içinde değil, `Localizable.xcstrings` içinde saklanır; key pattern: `info.mortgage.description`.

---

## Golden Fixture Üretimi

- `scripts/generate-golden-fixtures.ts` tek bir script — yukarıdaki tüm motorlar için JSON üretir
- Çıktı: `Packages/CalculationKit/Tests/CalculationKitTests/Golden/`
- CI pre-check: `scripts/golden-drift-check.sh` — bilgi fixture'ları güncel değilse CI fail

---

## Tamamlama Kontrol Listesi

- [ ] 18 motor port edildi
- [ ] Her biri unit test + golden test ile kapsandı
- [ ] Web TS çıktısı ile Swift çıktısı ±€0.01 tolerans içinde
- [ ] Public API DocC dokümanlı
- [ ] `grep -r "Double" Sources/` sonucu 0
- [ ] SPM package iOS/iPadOS/macOS simulator'larda derleniyor
- [ ] Umbrella `CalculationKit.swift` doğru re-export'lar
