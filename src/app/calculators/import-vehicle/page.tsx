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
    "Calculate the cost of importing a car to Malta in 2026: registration tax (WLTP/NEDC), non-EU minimum tax, 10% duty, 18% VAT, shipping and Transport Malta fees.",
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
        description="Calculate the total cost of importing a vehicle to Malta including registration tax, the non-EU minimum tax, import duty, VAT, shipping, and Transport Malta fees."
        slug="import-vehicle"
        category="Vehicle Calculator"
        features={[
          "Import duty and VAT for EU and non-EU vehicles",
          "Registration tax with WLTP and NEDC CO2 tables",
          "30% CO2 reduction for non-plug-in hybrids",
          "Minimum registration tax for non-EU used cars over 5 years",
          "Transport Malta inspection, admin and plate fees",
          "Total landed cost breakdown",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What customs duty and VAT apply when importing a vehicle to Malta in 2026?",
            answer:
              "Non-EU passenger car imports (UK, Japan, USA, Switzerland, etc.) pay a 10% customs duty on the CIF value (vehicle + insurance + freight), then 18% VAT on (CIF + duty). UK-origin cars that meet the EU–UK Trade and Cooperation Agreement rules of origin can qualify for 0% duty. VAT is not charged on the registration tax itself. Used vehicles from the EU (more than 6 months old and more than 6,000 km) pay no Maltese customs duty or VAT — only registration tax. A new means of transport (6 months or less since first entry into service, or 6,000 km or less) pays 18% Maltese VAT on the invoice value even when bought in another EU country.",
          },
          {
            question:
              "How is registration tax calculated when importing a vehicle to Malta?",
            answer:
              "Under Transport Malta SOPV-02 for M1 passenger cars: Registration Tax = (CO2 g/km × Registration Value × CO2 rate%) + (Length mm × Registration Value × Length rate%). The Registration Value is the invoice / CIF value for a new car, and Transport Malta's online valuation (Malta market value, which already reflects age) for a used car — there is no separate age-depreciation table. Cars whose original CoC shows WLTP values use the WLTP table (from 0.040% up to 120 g/km to 0.143% above 260 g/km). Other cars use the NEDC table, where the rate also depends on how far the car's Euro standard is behind Euro 6 (from 0.07% for a Euro 6 car up to 100 g/km to 0.47% for a car three or more Euro standards behind above 250 g/km; older diesels with high particulates pay up to 0.75%). Length rates run from 0.0020% to 0.0034%. Non-plug-in hybrids have their CO2 reduced by 30% (LPG by 10%) before the tables apply. Used cars over 5 years old imported from outside the EU, including the UK, pay at least the minimum registration tax (€900 to €37,437 depending on CO2 and age). Battery EVs and plug-in hybrids with at least 50 km electric range are exempt.",
          },
          {
            question:
              "Can I import an older (Euro 4 or Euro 5) car to Malta for normal road use?",
            answer:
              "Yes. Malta does not ban the registration of used cars with older Euro emission standards — Euro 1 to Euro 5 used cars can be registered, they simply pay higher NEDC registration tax rates. Only brand-new cars must meet the latest standard. Used cars over 5 years old coming from outside the EU (including the UK) are also subject to the minimum registration tax, and older imports may need a roadworthiness test before registration. Vehicles at least 30 years old can instead apply for vintage classification with Transport Malta's Vintage Vehicle Classification Committee.",
          },
          {
            question: "What is the Transfer of Residence (TORE) exemption?",
            answer:
              "If you are moving residence to Malta, one M1 car or motorcycle can be registered exempt from registration tax. Conditions: you have owned the vehicle for at least 24 months and lived outside Malta for at least 24 months, both immediately before the move. Submit Form VEH 007 within 30 days of arrival; a €100 fee is charged if the application is approved, and the Ministry decides within 90 days. If you later sell the vehicle in Malta, registration tax becomes due on its market value at that time.",
          },
          {
            question: "What are the Malta EV import incentives in 2026?",
            answer:
              "Battery electric vehicles (BEV) and plug-in hybrids (PHEV) with an electric range of at least 50 km are exempt from registration tax, and pay €0 annual road licence for years 0–5 (then €10 a year). Transport Malta's 2026 scheme for new electric vehicles pays €8,000 for a new battery electric car priced up to €40,000, or €6,000 for one priced €40,000–€100,000, plus €1,000 for scrapping a car at least 10 years old (€500 if its licence expired more than 3 months earlier) and an extra €1,000 for Gozo residents. The 2026 used EV grant pays €4,000 if the car was first registered abroad up to 3 months before, or €3,000 if 3–6 months before; the car must come from the EU, the UK or another listed country, be kept for 36 months, and be claimed on Form VEH 077.",
          },
          {
            question:
              "When is an inspection or roadworthiness test (VRT) required at import?",
            answer:
              "Transport Malta charges a €55 inspection fee for used vehicles imported from the UK or outside the EU. Separately, a Vehicle Roadworthiness Test is needed for non-EU imports over 4 years old, or over 1 year old with more than 160,000 km (motorcycles and other L-category vehicles excluded). UK imports need one unless the car has 160,000 km or less and is 4 years old or less (vans: 2 years). Valid roadworthiness certificates from other EU countries are recognised. The VRT fee for a car is capped at €30.27. After registration, cars follow the normal schedule: first test 4 years from first registration, then every 2 years, annually after 160,000 km.",
          },
          {
            question: "What happens if I miss the 30-day deadline?",
            answer:
              "Article 21(4) of the Motor Vehicle Registration and Licensing Act (Cap 368) imposes an administrative fine of €30 per day for every day past the 30-day deadline from the vehicle's arrival in Malta. The whole process — customs clearance (non-EU), registration value lookup, registration tax payment, any required inspection or roadworthiness test, and number plates — must complete within those 30 days. Engage a customs broker and book any required test before the vehicle lands.",
          },
          {
            question:
              "Are vintage / classic vehicles taxed differently in Malta?",
            answer:
              "Yes. Vehicles at least 30 years old from year of manufacture can be certified as vintage. Since 1 September 2025 certification is done by Transport Malta's Vintage Vehicle Classification Committee after a physical inspection: imported vehicles pay a €50 application fee plus a €55 inspection, while Malta-registered vehicles pay €250 (€200 refunded if approved). Vintage vehicles 30–49 years old pay roughly 25.5%–37.5% of the estimated value in registration tax, depending on engine size; at 50 years or more registration tax is 0%. Vintage plates (silver on black) cost €35 each, the annual road licence is waived except for an €8 admin fee, and vehicles under 50 years are limited to 3,000 km a year.",
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
            text: "On arrival at Valletta Freeport or Marsaxlokk, a customs broker submits the declaration. Customs Malta calculates 10% duty on the CIF value (vehicle + insurance + freight) and 18% VAT on (CIF + duty); UK-origin cars may qualify for 0% duty. Payment must be settled before the vehicle is released. Used EU imports skip this step; new means of transport from the EU pay 18% Maltese VAT.",
          },
          {
            name: "Obtain the Registration Value (RV)",
            text: "For a new car the RV is the invoice / CIF value. For a used car, look it up at valuation.vehicleregistration.gov.mt — Transport Malta's online valuation, which reflects the Malta market value for that make, model and age. For vehicles not in the database, file Form VEH 14 for a manual valuation.",
          },
          {
            name: "Pay registration tax",
            text: "Pay the SOPV-02 registration tax (CO2 + length, using the WLTP or NEDC table) to Transport Malta. Used cars over 5 years old imported from outside the EU, including the UK, pay at least the minimum registration tax. No VAT is charged on the registration tax. Apply the Transfer of Residence exemption (Form VEH 007) if you qualify — it removes the registration tax.",
          },
          {
            name: "Inspection and roadworthiness test (where required)",
            text: "Used vehicles from the UK or outside the EU pay a €55 Transport Malta inspection fee. A roadworthiness test (VRT, up to €30.27 for a car) is also needed for non-EU imports over 4 years old or with more than 160,000 km; valid EU roadworthiness certificates are recognised. Bring all import documents on the day.",
          },
          {
            name: "Collect number plates and finalise registration",
            text: "A random pair of car plates costs €70 (personalised €200, customised €1,500); motorcycle plates cost €35 and vintage silver-on-black plates €35 each. The registration admin fee is €15. The entire process — from arrival to plates — must complete within 30 days or a €30/day administrative fine applies.",
          },
        ]}
      />
      <DefinedTermJsonLd
        pageUrl={`${SITE_URL}/calculators/import-vehicle`}
        setName="Malta Vehicle Import — Glossary"
        setDescription="Authoritative definitions for the acronyms and forms referenced by Malta's vehicle import calculator: SOPV-02, RV, VRT, CIF, TORE, the Vintage Vehicle Classification Committee, CoC, and the VEH 007 / VEH 14 / VEH 077 forms."
        terms={VEHICLE_IMPORT_GLOSSARY}
      />
      <main role="main" aria-label="Import Vehicle Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <ImportVehicleCalculator />
          <p className="mt-8 text-xs text-center text-muted-foreground">
            Rates and fees current as of{" "}
            <time dateTime="2026-10-23">23 October 2026</time>, based on
            Transport Malta SOPV-02 (January 2026), the 2026 new and used EV
            grant schemes, and Transport Malta&apos;s vintage classification
            rules effective 1 September 2025. Rates may change after Budget
            2027.
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
