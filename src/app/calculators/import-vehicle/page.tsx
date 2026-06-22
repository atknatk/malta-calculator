import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import { RelatedCalculators } from "@/components/marketing/related-calculators";
import { AffiliateCard } from "@/components/affiliate/affiliate-card";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { ImportVehicleCalculator } from "./_components/import-vehicle-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
  DefinedTermJsonLd,
  HowToJsonLd,
} from "@/components/json-ld";
import { VEHICLE_IMPORT_GLOSSARY } from "./_glossary";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Import Vehicle Calculator | Malta Calculator",
  description:
    "Calculate the total cost of importing a vehicle to Malta. Includes registration tax, import duty, VAT, shipping, plus all fees for EU and non-EU imports.",
  alternates: pageAlternates("/calculators/import-vehicle"),
  openGraph: {
    ...ogMetadata,
    title: "Import Vehicle Calculator Malta",
    url: `${SITE_URL}/calculators/import-vehicle`,
  },
  twitter: { ...twitterMetadata, title: "Import Vehicle Calculator Malta" },
};

export default function ImportVehiclePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Import Vehicle",
            url: `${SITE_URL}/calculators/import-vehicle`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Vehicle Import Cost Calculator Malta"
        description="Calculate the total cost of importing a vehicle to Malta including registration tax, import duty, VAT, shipping, and all associated fees."
        slug="import-vehicle"
        category="Vehicle Calculator"
        features={[
          "Import duty calculation for EU and non-EU vehicles",
          "Vehicle registration tax (VRT) estimation",
          "VAT calculation on imported vehicles",
          "Compliance certificate fee inclusion",
          "Total landed cost breakdown",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What customs duty and VAT apply when importing a vehicle to Malta in 2026?",
            answer:
              "Non-EU passenger car imports (UK, Japan, USA, Switzerland, etc.) pay a 10% customs duty on the CIF value (vehicle + insurance + freight), plus 18% VAT on (CIF + duty), and another 18% VAT charged on top of the registration tax. EU used vehicles pay no customs duty and no VAT — only Malta's registration tax. New vehicles (under 6 months and 6,000 km) pay VAT even when imported from EU countries.",
          },
          {
            question:
              "How is registration tax calculated when importing a vehicle to Malta?",
            answer:
              "Malta uses the SOPV-02 framework for M1 passenger cars: Registration Tax = (CO2 g/km × Registration Value × CO2 rate%) + (Length mm × Registration Value × Length rate%), then adjusted for diesel particulate surcharge (~15%), age depreciation, and any vintage concession. The Registration Value (RV) is the official Transport Malta valuation from valuation.vehicleregistration.gov.mt, not the purchase price. Rates depend on Euro emission standard: Euro 6 ≈ 0.041%, Euro 5 ≈ 0.041%, Euro 4 ≈ 0.044%, Euro 3 ≈ 0.047%.",
          },
          {
            question:
              "Can I import a pre-2009 vehicle to Malta for normal road use?",
            answer:
              "No. Under SOPV-02 (aligned with EU Directive 2007/46/EC), Malta only registers passenger vehicles meeting Euro 5b/6b emission standards or higher — effectively model year 2009 onwards. Pre-2009 (Euro 1–4) vehicles cannot be plated as regular passenger cars. The only path is the vintage / classic route via FMVA Malta, available only when the vehicle is at least 30 years old from its year of manufacture and remains in original, unmodified condition.",
          },
          {
            question: "What is the Transfer of Residence (TORE) exemption?",
            answer:
              "If you are moving residence to Malta, you can import one M1 passenger vehicle fully exempt from registration tax and the 18% VAT on RegTax. Conditions: the vehicle has been registered in your name for at least 24 continuous months before the move, and you have lived outside Malta for at least 24 continuous months. Submit Form VEH 007 within 30 days of arrival. The vehicle cannot be sold or transferred for 12 months after import — this restriction is recorded in the logbook.",
          },
          {
            question: "What are the Malta EV import incentives in 2026?",
            answer:
              "Battery electric vehicles (BEV) and plug-in hybrids (PHEV) with electric range ≥ 50 km are 100% exempt from registration tax in Malta. The first 5 years of annual road licence are also €0. Transport Malta's 2026 New EV Scheme offers an €11,000 grant for new BEV/PHEV vehicles, plus a €2,000 scrappage bonus for deregistering a passenger or commercial vehicle ≥ 10 years old. A separate used-EV grant of €1,000 (+€1,000 scrappage) applies to used EVs registered in Malta after 1 January 2025. Grant retention requirement: 36 months.",
          },
          {
            question: "When is a VRT inspection required at import?",
            answer:
              "A VRT (Vehicle Roadworthiness Test) inspection is mandatory at import when the vehicle is more than 4 years old, or when its odometer exceeds 160,000 km. The current fee is €36. Vehicles below both thresholds skip the inspection at import — but VRT becomes mandatory once the vehicle reaches 4 years from first registration regardless.",
          },
          {
            question: "What happens if I miss the 30-day deadline?",
            answer:
              "Article 21(4) of the Motor Vehicle Registration and Licensing Act (Cap 368) imposes an administrative fine of €30 per day for every day past the 30-day deadline from the vehicle's arrival in Malta. The whole process — customs clearance (non-EU), registration value lookup, registration tax payment, VRT inspection, and number plates — must complete within those 30 days. Book the VRT inspection and engage a customs broker before the vehicle lands.",
          },
          {
            question:
              "Are vintage / classic vehicles taxed differently in Malta?",
            answer:
              "Yes. Vehicles at least 30 years old from year of manufacture, in original unmodified condition, qualify for FMVA classic status (Form VEH 15). Benefits include black licence plates, €0 annual road licence (only €8 admin fee), and a 3,000 km/year usage cap. At 30–34 years the standard registration tax still applies. At 35–50 years a 50% concession is granted. At 50 years or more the registration tax is fully waived. FMVA assigns a flat valuation in practice, so real-world vintage RegTax for a 30–34 year car is typically €100–€600.",
          },
        ]}
      />
      <HowToJsonLd
        name="How to import a vehicle to Malta (2026)"
        description="The official process for importing and registering a passenger vehicle in Malta, from arrival at port to receiving Maltese plates."
        totalTime="P30D"
        steps={[
          {
            name: "Customs clearance (non-EU imports only)",
            text: "On arrival at Valletta Freeport or Marsaxlokk, a customs broker submits the declaration. Customs Malta calculates 10% duty on the CIF value (vehicle + insurance + freight) and 18% VAT on (CIF + duty). Payment must be settled before the vehicle is released. EU imports skip this step entirely.",
          },
          {
            name: "Obtain the official Registration Value (RV)",
            text: "Look up the vehicle at valuation.vehicleregistration.gov.mt — Transport Malta's official valuation portal using CAP Motor Research trade values. The RV is what registration tax is computed on, not the purchase price. For vehicles not in the database, file Form VEH 14 for a manual valuation.",
          },
          {
            name: "Pay registration tax and VAT on RegTax",
            text: "Pay the SOPV-02 registration tax at Transport Malta's Licensing and Testing Directorate. Non-EU private imports also pay an additional 18% VAT on top of the registration tax. Apply the Transfer of Residence Exemption (Form VEH 007) here if you qualify — it zeros both.",
          },
          {
            name: "Pass the VRT inspection",
            text: "Required when the vehicle is older than 4 years or has more than 160,000 km on the odometer. Fee: €36. Book ahead of time as availability is limited. Bring all import documents on the day.",
          },
          {
            name: "Collect number plates and finalise registration",
            text: "Standard plates cost €35, vintage black plates €70. The first registration fee is €50. You leave with the Maltese logbook and plates the same day in most cases. The entire process — from arrival to plates — must complete within 30 days or a €30/day administrative fine applies.",
          },
        ]}
      />
      <DefinedTermJsonLd
        pageUrl={`${SITE_URL}/calculators/import-vehicle`}
        setName="Malta Vehicle Import — Glossary"
        setDescription="Authoritative definitions for the acronyms and forms referenced by Malta's vehicle import calculator: SOPV-02, RV, VRT, CIF, TORE, FMVA, CoC, and the VEH 007 / VEH 14 / VEH 15 forms."
        terms={VEHICLE_IMPORT_GLOSSARY}
      />
      <main role="main" aria-label="Import Vehicle Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <ImportVehicleCalculator />
          <p className="mt-8 text-xs text-center text-muted-foreground">
            Rates and fees current as of{" "}
            <time dateTime="2026-05-18">18 May 2026</time>, based on Transport
            Malta SOPV-02, the 2026 EV/PHEV grant scheme, and the FMVA vintage
            classification rules effective September 2025.
          </p>
          <RelatedGuide
            href="/blog/malta-import-vehicle-guide-2026"
            title="Malta Import Vehicle Guide 2026"
            description="Step-by-step guide to importing a vehicle to Malta: costs, procedures, and requirements."
          />
          <AffiliateCard slug="import-vehicle" />
          <RelatedCalculators slug="import-vehicle" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
