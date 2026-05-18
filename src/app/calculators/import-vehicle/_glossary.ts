/**
 * Vehicle-import domain glossary. Used by both the calculator page and the
 * companion guide to emit a DefinedTermSet JSON-LD block so AI assistants
 * can map acronyms (SOPV-02, VRT, RV, TORE, …) to authoritative definitions
 * anchored on this site.
 */
export interface VehicleImportTerm {
  name: string;
  slug: string;
  description: string;
  sourceUrl?: string;
}

export const VEHICLE_IMPORT_GLOSSARY: VehicleImportTerm[] = [
  {
    name: "SOPV-02",
    slug: "sopv-02",
    description:
      "Transport Malta Standard Operating Procedure for Vehicles 02 — the framework that governs registration and licensing of new and used motor vehicles in Malta. It defines the CO2 + length registration tax formula for M1 passenger cars and the minimum Euro 5b/6b emission standard required for normal registration.",
    sourceUrl:
      "https://www.transport.gov.mt/Land/Downloads-eForms/Vehicles/SOPV-02-REGISTERING-LICENSING-OF-NEW-USED-MOTOR-VEHICLES-3944",
  },
  {
    name: "RV (Registration Value)",
    slug: "registration-value",
    description:
      "The official taxable value Transport Malta assigns to a specific make and model, drawn from CAP Motor Research trade-value data, used as the base of the registration tax formula. It is not the purchase price. Look it up at valuation.vehicleregistration.gov.mt or request manual valuation via Form VEH 14.",
    sourceUrl: "https://www.valuation.vehicleregistration.gov.mt/",
  },
  {
    name: "VRT (Vehicle Roadworthiness Test)",
    slug: "vrt",
    description:
      "Malta's mandatory roadworthiness inspection. At import it is required when the vehicle is more than 4 years old or has more than 160,000 km on the odometer. Standard fee €36. Distinct from the SOPV-02 registration tax — VRT is a safety/emissions inspection, not a tax.",
  },
  {
    name: "CIF (Cost, Insurance, Freight)",
    slug: "cif",
    description:
      "The customs value of a non-EU import: vehicle purchase price plus shipping insurance plus freight to Malta. Customs Malta calculates the 10% import duty on the CIF value, then 18% VAT on (CIF + duty).",
  },
  {
    name: "TORE (Transfer of Residence Exemption)",
    slug: "tore",
    description:
      "Full waiver of the registration tax and the 18% VAT charged on top of it, available to one M1 vehicle per person moving residence to Malta. Conditions: the vehicle has been registered in the applicant's name for at least 24 continuous months and the applicant has lived outside Malta for at least 24 continuous months. Application via Form VEH 007. The vehicle cannot be sold or transferred for 12 months after import.",
    sourceUrl:
      "https://www.transport.gov.mt/land/vehicles/registering-and-licensing-a-motor-vehicle/transfer-of-residence-scheme-807",
  },
  {
    name: "FMVA (Federazzjoni Maltija Vetturi Antiki)",
    slug: "fmva",
    description:
      "Malta's vintage-vehicle classification body. Issues classic status (Form VEH 15) for vehicles at least 30 years old from year of manufacture, in original unmodified condition. Classic vehicles get black licence plates, €0 annual road licence, and a 3,000 km/year usage cap. Re-certification required every 5 years for vehicles aged 30–49.",
    sourceUrl: "https://www.fmvamalta.org/",
  },
  {
    name: "VEH 007",
    slug: "veh-007",
    description:
      "Transport Malta application form for the Transfer of Residence registration-tax exemption. Must be submitted within 30 days of arrival in Malta. Requires proof of 24+ months residency abroad and 24+ months vehicle ownership in the applicant's name.",
  },
  {
    name: "VEH 14",
    slug: "veh-14",
    description:
      "Transport Malta application form to request a manual Registration Value (RV) for a used motor vehicle when the vehicle is not available in the online valuation database (typically unusual models, very old vehicles, or commercial vehicles).",
  },
  {
    name: "VEH 15",
    slug: "veh-15",
    description:
      "Transport Malta and FMVA application form for vintage / classic vehicle certification. Application fee €250, of which €200 is refunded on successful certification. Required for any vehicle 30+ years old being registered with black classic plates.",
  },
  {
    name: "CoC (Certificate of Conformity)",
    slug: "coc",
    description:
      "Manufacturer-issued certificate confirming that a vehicle meets EU type-approval standards. Required for new-vehicle registration in Malta. Vehicles without a CoC must undergo individual vehicle approval at Transport Malta, which can require modifications to meet Maltese standards.",
  },
];
