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
      "Transport Malta Standard Operating Procedure for Vehicles 02 — the framework that governs registration and licensing of new and used motor vehicles in Malta. It defines the CO2 + length registration tax formula for M1 passenger cars (separate WLTP and NEDC CO2 tables, with NEDC rates depending on the car's Euro standard), the 30% CO2 reduction for non-plug-in hybrids, and the minimum registration tax for used cars over 5 years old imported from outside the EU. Older Euro standards are not banned; they pay higher rates.",
    sourceUrl:
      "https://www.transport.gov.mt/Land/Downloads-eForms/Vehicles/SOPV-02-REGISTERING-LICENSING-OF-NEW-USED-MOTOR-VEHICLES-3944",
  },
  {
    name: "RV (Registration Value)",
    slug: "registration-value",
    description:
      "The value the registration tax formula is applied to. For a new vehicle it is the invoice / CIF value; for a used vehicle it is Transport Malta's online valuation, which reflects the Malta market value of that make, model and age (there is no separate age-depreciation table). It is not simply the purchase price. Look it up at valuation.vehicleregistration.gov.mt or request a manual valuation via Form VEH 14.",
    sourceUrl: "https://www.valuation.vehicleregistration.gov.mt/",
  },
  {
    name: "VRT (Vehicle Roadworthiness Test)",
    slug: "vrt",
    description:
      "Malta's mandatory roadworthiness test under S.L. 65.15. Private cars are first tested 4 years after first registration, then every 2 years, and annually once the odometer passes 160,000 km. The maximum fee for a car is €30.27 (incl. VAT). At import, a test is needed for non-EU vehicles over 4 years old (or over 1 year with more than 160,000 km); valid EU roadworthiness certificates are recognised. Distinct from the SOPV-02 registration tax and from Transport Malta's €55 inspection fee for used UK / non-EU imports.",
  },
  {
    name: "CIF (Cost, Insurance, Freight)",
    slug: "cif",
    description:
      "The customs value of a non-EU import: vehicle purchase price plus shipping insurance plus freight to Malta. Customs Malta calculates the 10% import duty on the CIF value, then 18% VAT on (CIF + duty). UK-origin cars may qualify for 0% duty under the EU–UK Trade and Cooperation Agreement rules of origin.",
  },
  {
    name: "TORE (Transfer of Residence Exemption)",
    slug: "tore",
    description:
      "Exemption from registration tax for one M1 car or motorcycle per person moving residence to Malta. Conditions: the applicant has owned the vehicle for at least 24 months and lived outside Malta for at least 24 months, both immediately before the move. Application via Form VEH 007 within 30 days; a €100 fee applies if approved and the Ministry decides within 90 days. If the vehicle is later sold in Malta, registration tax becomes due on its market value.",
    sourceUrl:
      "https://www.transport.gov.mt/land/vehicles/registering-and-licensing-a-motor-vehicle/transfer-of-residence-scheme-807",
  },
  {
    name: "Vintage Vehicle Classification Committee",
    slug: "vintage-vehicle-classification-committee",
    description:
      "Since 1 September 2025, Transport Malta's Vintage Vehicle Classification Committee certifies vintage vehicles (at least 30 years from year of manufacture) after a physical inspection. Imported vehicles pay a €50 application fee plus a €55 inspection; Malta-registered vehicles pay €250, of which €200 is refunded if approved. Vintage vehicles 30–49 years old pay roughly 25.5%–37.5% of the estimated value in registration tax depending on engine size (0% at 50+ years), get silver-on-black plates (€35 each), pay only an €8 annual admin fee instead of road licence, and are limited to 3,000 km a year until they reach 50 years.",
  },
  {
    name: "VEH 007",
    slug: "veh-007",
    description:
      "Transport Malta application form for the Transfer of Residence registration-tax exemption. Must be submitted within 30 days of arrival in Malta. Requires proof of 24+ months residency abroad and 24+ months vehicle ownership, both immediately before the move.",
  },
  {
    name: "VEH 14",
    slug: "veh-14",
    description:
      "Transport Malta application form to request a manual Registration Value (RV) for a used motor vehicle when the vehicle is not available in the online valuation database (typically unusual models, very old vehicles, or commercial vehicles).",
  },
  {
    name: "VEH 077",
    slug: "veh-077",
    description:
      "Transport Malta application form for the 2026 used electric vehicle grant: €4,000 if the car was first registered abroad up to 3 months before, or €3,000 if 3–6 months before. The vehicle must come from the EU, the UK or another listed country and be kept for 36 months.",
  },
  {
    name: "CoC (Certificate of Conformity)",
    slug: "coc",
    description:
      "Manufacturer-issued certificate confirming that a vehicle meets EU type-approval standards. Its CO2 figure decides which registration tax table applies: the WLTP table needs an original CoC showing WLTP values (generally cars type-approved from 2021); otherwise the NEDC table is used, and if no CO2 value is available the highest band applies. Vehicles without a CoC must undergo individual vehicle approval at Transport Malta.",
  },
];
