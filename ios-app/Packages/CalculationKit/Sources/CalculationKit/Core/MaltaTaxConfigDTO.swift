import Foundation

/// Intermediate Codable DTO for deserialising the bundled `tax-config-2020-2026.json`.
///
/// The JSON uses a unified per-year format with `version`, `generatedAt`, and a `years` array
/// where each entry contains brackets, SSC rates, and COLA together.
/// This struct is internal — callers interact with ``MaltaTaxConfig`` via ``TaxConfigStore``.
struct MaltaTaxConfigDTO: Decodable, Sendable {
    let version: String
    let generatedAt: String
    let source: String?
    let years: [YearDTO]

    struct YearDTO: Decodable, Sendable {
        let year: Int
        let brackets: [String: [BracketDTO]]
        let ssc: SSCDTO
        let cola: COLADTO?
    }

    struct BracketDTO: Decodable, Sendable {
        let min: Decimal
        let max: Decimal?
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
            max = try container.decodeIfPresent(Decimal.self, forKey: .max)
        }
    }

    struct SSCDTO: Decodable, Sendable {
        let categoryA: Decimal
        let categoryB: Decimal
        let categoryCOld: Decimal
        let categoryCNew: Decimal
        let categoryDOld: Decimal
        let categoryDNew: Decimal
        let weeklyCapOld: Decimal
        let weeklyCapNew: Decimal
        let minimumWage: Decimal
    }

    struct COLADTO: Decodable, Sendable {
        let march: Decimal
        let june: Decimal
        let september: Decimal
        let december: Decimal
    }
}

// MARK: - Domain Conversion

extension MaltaTaxConfigDTO {
    /// Converts the DTO to the domain model, mapping JSON `null` max to `Decimal.greatestFiniteMagnitude`.
    func toDomain() throws -> MaltaTaxConfig {
        var yearConfigs: [Int: MaltaTaxConfig.YearConfig] = [:]

        for yearDTO in years {
            var brackets: [TaxRateType: [MaltaTaxConfig.TaxBracket]] = [:]
            for (key, dtoBrackets) in yearDTO.brackets {
                guard let rateType = TaxRateType(rawValue: key) else {
                    throw CalculationError.corruptedConfig(
                        reason: "Unknown tax rate type: \(key)"
                    )
                }
                brackets[rateType] = dtoBrackets.map { dto in
                    MaltaTaxConfig.TaxBracket(
                        min: dto.min,
                        max: dto.max ?? Decimal.greatestFiniteMagnitude,
                        rate: dto.rate,
                        deduction: dto.deduction
                    )
                }
            }

            let ssc = MaltaTaxConfig.SSCRates(
                categoryA: yearDTO.ssc.categoryA,
                categoryB: yearDTO.ssc.categoryB,
                categoryCOld: yearDTO.ssc.categoryCOld,
                categoryCNew: yearDTO.ssc.categoryCNew,
                categoryDOld: yearDTO.ssc.categoryDOld,
                categoryDNew: yearDTO.ssc.categoryDNew,
                weeklyCapOld: yearDTO.ssc.weeklyCapOld,
                weeklyCapNew: yearDTO.ssc.weeklyCapNew,
                minimumWage: yearDTO.ssc.minimumWage
            )

            let cola: MaltaTaxConfig.COLAConfig
            if let colaDTO = yearDTO.cola {
                cola = MaltaTaxConfig.COLAConfig(
                    march: colaDTO.march,
                    june: colaDTO.june,
                    september: colaDTO.september,
                    december: colaDTO.december
                )
            } else {
                cola = MaltaTaxConfig.COLAConfig(march: 0, june: 0, september: 0, december: 0)
            }

            yearConfigs[yearDTO.year] = MaltaTaxConfig.YearConfig(
                year: yearDTO.year,
                brackets: brackets,
                ssc: ssc,
                cola: cola
            )
        }

        return MaltaTaxConfig(version: version, generatedAt: generatedAt, years: yearConfigs)
    }
}
