import Foundation

/// Codable DTO for deserialising the bundled `tax-config-2020-2026.json`.
struct TaxConfigDTO: Codable, Sendable {
    let taxBracketsByYear: [YearlyTaxDTO]
    let sscRatesByYear: [YearlySSCDTO]
    let colaByYear: [YearlyCOLADTO]

    struct YearlyTaxDTO: Codable, Sendable {
        let year: Int
        let brackets: [String: [BracketDTO]]
    }

    struct BracketDTO: Codable, Sendable {
        let min: Decimal
        let max: Decimal?       // null → Decimal.greatestFiniteMagnitude
        let rate: Decimal
        let deduction: Decimal

        enum CodingKeys: String, CodingKey {
            case min, max, rate, deduction
        }

        init(from decoder: Decoder) throws {
            let container = try decoder.container(keyedBy: CodingKeys.self)
            min = try container.decode(Decimal.self, forKey: .min)
            rate = try container.decode(Decimal.self, forKey: .rate)
            deduction = try container.decode(Decimal.self, forKey: .deduction)
            if let val = try container.decodeIfPresent(Decimal.self, forKey: .max) {
                max = val
            } else {
                max = nil
            }
        }
    }

    /// Flat SSC structure: year + rate fields at the same level.
    struct YearlySSCDTO: Codable, Sendable {
        let year: Int
        let categoryA: Decimal
        let categoryB: Decimal
        let categoryCOld: Decimal
        let categoryCNew: Decimal
        let categoryDOld: Decimal
        let categoryDNew: Decimal
        let weeklyCapOld: Decimal
        let weeklyCapNew: Decimal
        let minimumWage: Decimal

        var toSSCRates: MaltaTaxConfig.SSCRates {
            MaltaTaxConfig.SSCRates(
                categoryA: categoryA, categoryB: categoryB,
                categoryCOld: categoryCOld, categoryCNew: categoryCNew,
                categoryDOld: categoryDOld, categoryDNew: categoryDNew,
                weeklyCapOld: weeklyCapOld, weeklyCapNew: weeklyCapNew,
                minimumWage: minimumWage
            )
        }
    }

    /// Flat COLA structure: year + month fields at the same level.
    struct YearlyCOLADTO: Codable, Sendable {
        let year: Int
        let march: Decimal
        let june: Decimal
        let september: Decimal
        let december: Decimal
    }
}

extension TaxConfigDTO {
    /// Converts the DTO to the domain model.
    func toDomain() -> MaltaTaxConfig {
        // Build SSC and COLA lookup maps
        var sscByYear: [Int: MaltaTaxConfig.SSCRates] = [:]
        for entry in sscRatesByYear {
            sscByYear[entry.year] = entry.toSSCRates
        }

        var colaByYearMap: [Int: MaltaTaxConfig.COLAConfig] = [:]
        for entry in colaByYear {
            colaByYearMap[entry.year] = MaltaTaxConfig.COLAConfig(
                march: entry.march,
                june: entry.june,
                september: entry.september,
                december: entry.december
            )
        }

        var yearConfigs: [Int: MaltaTaxConfig.YearConfig] = [:]

        for taxYear in taxBracketsByYear {
            let year = taxYear.year

            // Parse brackets
            var brackets: [TaxRateType: [MaltaTaxConfig.TaxBracket]] = [:]
            for (key, dtos) in taxYear.brackets {
                guard let rateType = TaxRateType(rawValue: key) else { continue }
                brackets[rateType] = dtos.map { dto in
                    MaltaTaxConfig.TaxBracket(
                        min: dto.min,
                        max: dto.max ?? Decimal.greatestFiniteMagnitude,
                        rate: dto.rate,
                        deduction: dto.deduction
                    )
                }
            }

            // SSC fallback: use latest available if missing for this year
            let ssc = sscByYear[year] ?? sscByYear[sscByYear.keys.max() ?? year]
            // COLA fallback: use latest available if missing for this year
            let cola = colaByYearMap[year] ?? colaByYearMap[colaByYearMap.keys.max() ?? year]

            guard let sscRates = ssc else { continue }
            let colaConfig = cola ?? MaltaTaxConfig.COLAConfig(march: 0, june: 0, september: 0, december: 0)

            yearConfigs[year] = MaltaTaxConfig.YearConfig(
                year: year,
                brackets: brackets,
                ssc: sscRates,
                cola: colaConfig
            )
        }

        return MaltaTaxConfig(years: yearConfigs)
    }
}
