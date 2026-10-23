import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  getBlogOgImage,
  pageAlternates,
} from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
  DefinedTermJsonLd,
  HowToJsonLd,
} from "@/components/json-ld";
import { VEHICLE_IMPORT_GLOSSARY } from "@/app/calculators/import-vehicle/_glossary";

const LAST_UPDATED = "2026-10-23";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Importing a Vehicle to Malta 2026: Complete Guide | Malta Calculator",
  description:
    "2026 guide to importing a car to Malta: SOPV-02 registration tax, customs duty, VAT, EV grants, vintage rules, Transfer of Residence and the 30-day deadline.",
  keywords: [
    "Malta import vehicle 2026",
    "Malta car import tax",
    "SOPV-02 registration tax",
    "Malta vintage vehicle registration",
    "Transport Malta vehicle import",
    "Malta EV grant 2026",
    "Transfer of Residence Malta vehicle",
    "Malta UK car Brexit import",
  ],
  alternates: pageAlternates("/blog/malta-import-vehicle-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Vehicle Import 2026 — Complete Guide",
    url: `${SITE_URL}/blog/malta-import-vehicle-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Vehicle Import 2026 Guide")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Vehicle Import 2026 — Complete Guide",
  },
};

const ARTICLE_SOURCES = [
  {
    name: "Transport Malta — SOPV-02 (Registering & Licensing of New/Used Motor Vehicles)",
    url: "https://www.transport.gov.mt/Land/Downloads-eForms/Vehicles/SOPV-02-REGISTERING-LICENSING-OF-NEW-USED-MOTOR-VEHICLES-3944",
  },
  {
    name: "Transport Malta — Used Motor Vehicle Valuation Portal",
    url: "https://www.valuation.vehicleregistration.gov.mt/",
  },
  {
    name: "Transport Malta — Transfer of Residence Scheme",
    url: "https://www.transport.gov.mt/land/vehicles/registering-and-licensing-a-motor-vehicle/transfer-of-residence-scheme-807",
  },
  {
    name: "Transport Malta — Vintage Vehicle Registration",
    url: "https://www.transport.gov.mt/land/vehicles/registering-and-licensing-a-motor-vehicle/registering-and-licensing-a-vintage-motor-vehicle-805",
  },
  {
    name: "Transport Malta — 2026 EV & Pedelec Grant Schemes",
    url: "https://www.transport.gov.mt/land/sustainable-transport/grant-schemes-on-new-electric-vehicles-and-pedelecs-2026-7655",
  },
  {
    name: "Malta Customs Department",
    url: "https://customs.gov.mt/",
  },
];

const FAQ_ITEMS = [
  {
    question: "How much does it cost to import a car to Malta in 2026?",
    answer:
      "For a used car from another EU country (over 6 months old and over 6,000 km), you pay no VAT or duty — only the SOPV-02 registration tax (typically €1,500–€5,000 for modern low-emission cars) plus fixed fees of about €85 (€15 registration + €70 number plates), and a roadworthiness test (max €30.27) if one is needed. For a non-EU import (including the UK), add 10% customs duty on the CIF value, 18% VAT on (CIF + duty) and a €55 inspection fee for used cars. VAT is not charged on the registration tax itself. A new battery-electric car pays €0 registration tax and can claim a grant of €8,000 (price up to €40,000) or €6,000 (€40,000–€100,000).",
  },
  {
    question: "Can I import a Euro 1, 2, 3 or 4 vehicle to Malta?",
    answer:
      "Yes. There is no ban on registering used cars built to older Euro standards. Under SOPV-02, cars without WLTP values are taxed on the NEDC table, where the rate depends on the CO2 band and on how far the car's Euro standard is behind the latest one — so a Euro 4 or older car pays a much higher percentage than a Euro 6 car. Older diesels with particulate emissions above 0.005 g/km use an even higher rate column (0.21%–0.75%). Used cars from outside the EU (including the UK) older than 5 years are also subject to a minimum registration tax.",
  },
  {
    question: "What is the Transfer of Residence (TORE) exemption?",
    answer:
      "If you are moving your residence to Malta, you can bring one M1 car (or one motorcycle) exempt from registration tax. You must have owned the vehicle for at least 24 months and lived abroad for at least 24 months, both immediately before the move. Form VEH 007 must be submitted within 30 days. A €100 fee applies if the application is approved, and the Ministry decides within 90 days. If you later sell the vehicle in Malta, registration tax becomes due on its market value at that time.",
  },
  {
    question: "Is the 30-day deadline real?",
    answer:
      "Yes. Article 21(4) of the Motor Vehicle Registration and Licensing Act (Cap 368) requires an imported vehicle to be registered within 30 days of arrival, with an administrative fine of €30 per day after that. Plan the shipping, customs broker, valuation and any roadworthiness test before the vehicle lands.",
  },
  {
    question: "Do I have to pay VAT on a used car from the EU?",
    answer:
      'No, provided it counts as used: more than 6 months since first entry into service and more than 6,000 km. Such cars pay no Maltese VAT and no customs duty — only the SOPV-02 registration tax and the fixed fees. A car that is 6 months old or less, or has 6,000 km or less, is a "new means of transport" and pays 18% VAT in Malta on its invoice value, even if bought in another EU country.',
  },
  {
    question: "How much is the EV grant in Malta in 2026?",
    answer:
      "Under Transport Malta's Scheme for New Electric Vehicles and Pedelecs 2026, a new battery-electric M1 car gets €8,000 if its price is up to €40,000, or €6,000 if it costs between €40,000 and €100,000 (no grant above €100,000). Scrapping a car that is at least 10 years old adds €1,000 (€500 if its licence expired more than 3 months earlier), and Gozo residents get a further €1,000. A separate used-EV grant pays €4,000 if the EV was first registered abroad up to 3 months before, or €3,000 if 3–6 months before; the car must be kept for 36 months.",
  },
  {
    question: "What is a vintage vehicle in Malta?",
    answer:
      "A vehicle at least 30 years old from its year of manufacture, in original condition. Since 1 September 2025, vintage certification is handled by Transport Malta's Vintage Vehicle Classification Committee after a physical inspection (imported vehicles: €50 application + €55 inspection). Vintage vehicles get silver-on-black plates (€35 each), the annual road licence is waived except for an €8 admin fee, and vehicles under 50 years are limited to 3,000 km a year. Registration tax for vehicles aged 30–49 is roughly 25.5%–37.5% of the estimated value depending on engine size; vehicles aged 50+ pay 0%.",
  },
  {
    question: "Can I import a left-hand drive car to Malta?",
    answer:
      "Yes, LHD vehicles are legally importable, but Malta drives on the left, so visibility for overtaking and parking-booth access is awkward. You may need to adjust the headlight beam for the roadworthiness test, and some practical inconveniences apply daily. If you can choose, right-hand drive is recommended.",
  },
  {
    question: "Do I still need to pay duty on a UK car after Brexit?",
    answer:
      "Usually, yes. The UK is non-EU since 1 January 2021, so the standard 10% customs duty and 18% VAT apply, plus the €55 inspection fee for used imports. The EU-UK Trade and Cooperation Agreement allows zero customs duty for goods that meet the rules of origin, but many used cars don't qualify because they were not manufactured in the UK. Used UK cars older than 5 years also face the non-EU minimum registration tax. Confirm with a customs broker before assuming the zero-duty rate.",
  },
  {
    question: "When is a roadworthiness test (VRT) required at import?",
    answer:
      "From outside the EU, a test is needed if the vehicle is over 4 years old, or over 1 year old with more than 160,000 km (motorcycles and other L-category vehicles excluded). From the UK, a test is needed unless the car has 160,000 km or less and is at most 4 years old (vans: 2 years). Valid roadworthiness certificates from other EU countries are recognised. The maximum fee for a car is €30.27. After registration, private cars are tested at 4 years from first registration and then every 2 years (annually once they pass 160,000 km).",
  },
];

export default function ImportVehicleGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Importing a Vehicle to Malta 2026: Complete Guide"
        description="2026 guide to importing a car to Malta — SOPV-02 registration tax (WLTP/NEDC), customs duty, VAT, EV grants, vintage rules, Transfer of Residence exemption, and the 30-day deadline."
        slug="malta-import-vehicle-guide-2026"
        datePublished="2026-01-01"
        dateModified={LAST_UPDATED}
        articleType="TechArticle"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Import Vehicle",
            url: `${SITE_URL}/blog/malta-import-vehicle-guide-2026`,
          },
        ]}
      />
      <CustomFAQJsonLd questions={FAQ_ITEMS} />
      <DefinedTermJsonLd
        pageUrl={`${SITE_URL}/blog/malta-import-vehicle-guide-2026`}
        setName="Malta Vehicle Import — Glossary"
        setDescription="Definitions for the acronyms and statutory forms referenced throughout this guide: SOPV-02, RV, VRT, CIF, TORE, CoC, and the Transport Malta application forms."
        terms={VEHICLE_IMPORT_GLOSSARY}
      />
      <HowToJsonLd
        name="How to import a vehicle to Malta in 2026"
        description="Official Maltese process for importing and registering an M1 passenger vehicle, from arrival at port to receiving the logbook and plates."
        totalTime="P30D"
        steps={[
          {
            name: "Customs clearance (non-EU imports only)",
            text: "On arrival at Valletta Freeport or Marsaxlokk, a customs broker submits the declaration. Customs Malta calculates 10% duty on the CIF value (vehicle + insurance + freight) and 18% VAT on (CIF + duty). Used vehicles from the UK or outside the EU are also inspected (€55 fee). EU used imports skip this step.",
          },
          {
            name: "Obtain the official Registration Value (RV)",
            text: "For a used car, the RV is Transport Malta's valuation of the vehicle's Malta market value, available through the official valuation portal at valuation.vehicleregistration.gov.mt. For a new car, the RV is the CIF/invoice value. RV is the basis for registration tax, not your purchase price.",
          },
          {
            name: "Pay registration tax",
            text: "Pay the SOPV-02 registration tax (CO2 component + length component, both a percentage of the RV) at Transport Malta. VAT is not charged on the registration tax. Apply the Transfer of Residence exemption (Form VEH 007) here if eligible.",
          },
          {
            name: "Pass the roadworthiness test (if required)",
            text: "A test is needed for non-EU imports over 4 years old (or over 1 year with more than 160,000 km); UK imports need one unless the car is at most 4 years old with 160,000 km or less. Valid EU roadworthiness certificates are recognised. Maximum fee for a car: €30.27.",
          },
          {
            name: "Collect number plates and finalise registration",
            text: "Registration admin fee €15, standard number plates €70 per pair (vintage plates €35 each). The vehicle must be registered within 30 days of arrival or you pay €30/day in administrative fines (Cap 368, Art. 21(4)).",
          },
        ]}
      />
      <main role="main">
        <Shell className="max-w-4xl py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <header className="mb-12 not-prose">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-slate-500/10 text-slate-600 text-sm font-semibold rounded-full">
                  Transport
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Published January 2026
                </span>
                <time
                  dateTime={LAST_UPDATED}
                  className="flex items-center gap-1 text-sm text-muted-foreground"
                >
                  <Calendar className="h-4 w-4" /> Last updated{" "}
                  {new Date(LAST_UPDATED).toLocaleDateString("en-MT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 15 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Importing a Vehicle to Malta 2026 — The Complete Guide
              </h1>
              <p className="text-xl text-muted-foreground">
                Everything you actually need to know: the SOPV-02 (Malta&apos;s
                vehicle registration tax framework) formula, the customs and VAT
                chain on CIF (Cost + Insurance + Freight) value, EV incentives,
                the vintage pathway through Transport Malta&apos;s Vintage
                Vehicle Classification Committee, the Transfer of Residence
                (TORE) exemption, and the expensive 30-day deadline most people
                miss.
              </p>
            </header>

            <div className="not-prose mb-12 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50">
              <h2 className="font-semibold mb-4 text-lg">
                Quick answer (TL;DR)
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">EU used car:</strong>{" "}
                  registration tax only (typically €1,500–€5,000) plus ~€85 in
                  fixed fees (€15 registration + €70 plates), and a
                  roadworthiness test (max €30.27) if one is needed.
                </li>
                <li>
                  <strong className="text-foreground">
                    Non-EU used car (incl. UK):
                  </strong>{" "}
                  add 10% customs duty on CIF + 18% VAT on (CIF + duty) + €55
                  inspection fee. No VAT is charged on the registration tax.
                </li>
                <li>
                  <strong className="text-foreground">
                    Battery EV / PHEV ≥ 50 km range:
                  </strong>{" "}
                  €0 registration tax and €0 road licence for the first years;
                  new BEVs get an €8,000 grant (up to €40,000) or €6,000
                  (€40,000–€100,000), plus €1,000 for scrappage.
                </li>
                <li>
                  <strong className="text-foreground">Moving to Malta:</strong>{" "}
                  one M1 car can be exempt from registration tax via the TORE
                  scheme (Form VEH 007).
                </li>
                <li>
                  <strong className="text-foreground">
                    Older cars (Euro 1–5):
                  </strong>{" "}
                  can be registered, but pay much higher NEDC rates; non-EU used
                  cars over 5 years old also face a minimum tax.
                </li>
                <li>
                  <strong className="text-foreground">30-day rule:</strong>{" "}
                  register within 30 days of arrival or pay €30 per day in
                  fines.
                </li>
              </ul>
              <p className="mt-4 text-sm">
                Get a personalised estimate with our{" "}
                <Link
                  href="/calculators/import-vehicle"
                  className="text-primary underline"
                >
                  Malta import vehicle calculator
                </Link>{" "}
                — it handles every case below.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Rates below are those in force in 2026. Budget 2027 is presented
                on 26 October 2026 and may change vehicle taxes — recheck after
                the budget.
              </p>
            </div>

            <nav className="not-prose mb-12 p-5 rounded-xl border border-border/50 bg-muted/30">
              <p className="text-sm font-semibold mb-3">On this page</p>
              <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                <li>
                  <a href="#three-buckets" className="hover:text-primary">
                    The three cost buckets
                  </a>
                </li>
                <li>
                  <a href="#process" className="hover:text-primary">
                    Step-by-step process (EU and non-EU)
                  </a>
                </li>
                <li>
                  <a href="#regtax" className="hover:text-primary">
                    Registration tax — the SOPV-02 formula
                  </a>
                </li>
                <li>
                  <a href="#ev-incentives" className="hover:text-primary">
                    EV and PHEV incentives (2026)
                  </a>
                </li>
                <li>
                  <a href="#vintage" className="hover:text-primary">
                    Vintage / classic vehicles (30+ years)
                  </a>
                </li>
                <li>
                  <a href="#tore" className="hover:text-primary">
                    Transfer of Residence exemption (huge for expats)
                  </a>
                </li>
                <li>
                  <a href="#pitfalls" className="hover:text-primary">
                    Common pitfalls (and how to avoid them)
                  </a>
                </li>
                <li>
                  <a href="#documents" className="hover:text-primary">
                    Required documents checklist
                  </a>
                </li>
                <li>
                  <a href="#examples" className="hover:text-primary">
                    Real-world cost examples
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-primary">
                    Frequently asked questions
                  </a>
                </li>
              </ol>
            </nav>

            <section id="three-buckets">
              <h2>The three cost buckets</h2>
              <p>
                Whatever the origin of your vehicle, the on-road cost in Malta
                always breaks down into the same three categories:
              </p>
              <ol>
                <li>
                  <strong>Customs duty and VAT</strong> — when importing from
                  outside the EU (including the UK), duty is 10% of the CIF
                  value (vehicle price + insurance + freight) and VAT is 18% on
                  (CIF + duty). UK-origin cars may qualify for 0% duty under the
                  Trade and Cooperation Agreement rules of origin. From the EU,
                  a used car (more than 6 months old and more than 6,000 km)
                  pays neither; a &quot;new means of transport&quot; (6 months
                  or less, or 6,000 km or less) pays 18% Maltese VAT on its
                  invoice value. VAT is never charged on the registration tax
                  itself.
                </li>
                <li>
                  <strong>Registration Tax (RegTax)</strong> — Malta&apos;s
                  SOPV-02 framework computes this from the vehicle&apos;s
                  Registration Value (RV), its CO2 emissions and its length
                  (and, for cars taxed on NEDC values, its Euro emission
                  standard). This is usually the largest single line for
                  non-vintage vehicles.
                </li>
                <li>
                  <strong>Fixed fees</strong> — €15 registration admin fee, €70
                  for a standard pair of number plates, a €55 inspection fee for
                  used imports from the UK or outside the EU, and a
                  roadworthiness test (maximum €30.27 for a car) only when the
                  import rules require one.
                </li>
              </ol>
              <p>
                On top of these there are practical costs the calculator
                won&apos;t itemise: shipping, transit insurance, port handling,
                customs broker fees, and any compliance work needed (headlight
                aim, missing Certificate of Conformity, etc.). Budget another
                €200–€600 for these.
              </p>
            </section>

            <section id="process" className="mt-12">
              <h2>Step-by-step process</h2>

              <h3>If you&apos;re importing from another EU country</h3>
              <ol>
                <li>
                  Buy the vehicle and obtain the original{" "}
                  <em>foreign registration certificate</em> and a
                  de-registration certificate from the seller&apos;s national
                  authority. Keep the original Certificate of Conformity (CoC) —
                  it shows the WLTP CO2 value used for the tax.
                </li>
                <li>
                  Ship the vehicle to Malta. From mainland Europe this is
                  usually a few days via ro-ro ferry through Genoa or Salerno.
                </li>
                <li>
                  Within <strong>30 days of arrival</strong>, look up the
                  Registration Value at{" "}
                  <a
                    href="https://www.valuation.vehicleregistration.gov.mt"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    valuation.vehicleregistration.gov.mt
                  </a>{" "}
                  and pay the registration tax at Transport Malta.
                </li>
                <li>
                  A valid roadworthiness certificate from another EU country is
                  recognised. If the car is due a test and has no valid
                  certificate, book a VRT (max €30.27 for a car).
                </li>
                <li>
                  Pay the €15 registration fee, collect your number plates (€70
                  per pair) and finalise registration.
                </li>
              </ol>

              <h3>If you&apos;re importing from outside the EU</h3>
              <p>
                The process is the same, but with a customs clearance step at
                the start:
              </p>
              <ol>
                <li>
                  <strong>Customs clearance:</strong> on arrival at Valletta
                  Freeport or Marsaxlokk, your customs broker submits the
                  declaration. Customs Malta calculates the 10% duty on the CIF
                  value and 18% VAT on (CIF + duty). Pay before the car is
                  released.
                </li>
                <li>
                  <strong>Inspection and valuation:</strong> used cars from the
                  UK or outside the EU are inspected (€55 fee) and valued by
                  Transport Malta to set the RV.
                </li>
                <li>
                  <strong>Pay registration tax</strong> (no VAT is added to it).
                  Used cars older than 5 years pay at least the non-EU minimum
                  tax.
                </li>
                <li>
                  <strong>Roadworthiness test</strong> if required: non-EU cars
                  over 4 years old, or over 1 year with more than 160,000 km; UK
                  cars unless at most 4 years old with 160,000 km or less.
                </li>
                <li>Number plates and final registration.</li>
              </ol>
              <p>
                The vehicle must be registered within{" "}
                <strong>30 days of arrival</strong>, per Article 21(4) of the
                Motor Vehicle Registration and Licensing Act (Cap 368), or you
                pay an administrative fine of <strong>€30 per day</strong> until
                it is registered.
              </p>
            </section>

            <section id="regtax" className="mt-12">
              <h2>Registration tax — the SOPV-02 formula</h2>
              <p>
                For passenger cars (M1), Malta uses a two-component formula in
                which both rates are percentages of the Registration Value:
              </p>
              <div className="not-prose my-6 p-5 rounded-xl bg-muted/40 border border-border/50 font-mono text-sm">
                <div>
                  RegTax = (CO2 × RV × CO2-rate%) + (Length × RV × Length-rate%)
                </div>
                <div className="mt-2 text-muted-foreground">
                  CO2: −30% for hybrids, −10% for LPG; highest band if no CO2
                  value
                </div>
                <div className="mt-2 text-muted-foreground">
                  ↓ at least the minimum tax (non-EU used cars &gt; 5 years)
                </div>
                <div className="mt-2 text-muted-foreground">
                  ↓ €0 for BEVs and PHEVs with ≥ 50 km electric range
                </div>
              </div>

              <h3 id="registration-value">Registration Value (RV)</h3>
              <p>
                For a new car, the RV is the CIF/invoice value. For a used car,
                the RV is{" "}
                <strong>
                  not the purchase price — it&apos;s Transport Malta&apos;s
                  valuation of the car&apos;s Malta market value
                </strong>
                , published through the official portal at{" "}
                <a
                  href="https://www.valuation.vehicleregistration.gov.mt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  valuation.vehicleregistration.gov.mt
                </a>
                . Because the valuation already reflects the car&apos;s age and
                condition in the Maltese market, there is no separate
                age-depreciation step in the formula. Used cars from the UK or
                outside the EU are valued after an inspection at customs.
              </p>

              <h3 id="co2-rates-wltp">CO2 rates — WLTP table</h3>
              <p>
                Cars with an original CoC showing WLTP values (generally cars
                type-approved from 2021) use this table. Petrol and diesel pay
                the same rates:
              </p>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        CO2 (g/km, WLTP)
                      </th>
                      <th className="border border-border p-3 text-left">
                        CO2 rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["0–120", "0.040%"],
                      ["121–140", "0.045%"],
                      ["141–150", "0.050%"],
                      ["151–160", "0.060%"],
                      ["161–190", "0.070%"],
                      ["191–230", "0.100%"],
                      ["231–260", "0.110%"],
                      ["Over 260", "0.143%"],
                    ].map(([band, rate], i) => (
                      <tr key={band} className={i % 2 ? "bg-muted/50" : ""}>
                        <td className="border border-border p-3">{band}</td>
                        <td className="border border-border p-3">{rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 id="euro-standard-rule">
                CO2 rates — NEDC table and the Euro standard (older cars)
              </h3>
              <p>
                There is <strong>no ban</strong> on registering used cars built
                to older Euro standards — Euro 1 to Euro 5 cars can be
                registered. Cars without WLTP values are taxed on the NEDC
                table, where the rate depends on both the CO2 band and how far
                the car&apos;s Euro standard is behind the latest one (Euro 6).
                For petrol cars (and diesels with particulates ≤ 0.005 g/km):
              </p>
              <ul>
                <li>
                  <strong>Latest standard (Euro 6):</strong> 0.07% (0–100 g/km)
                  up to 0.23% (over 250 g/km).
                </li>
                <li>
                  <strong>One standard behind (Euro 5):</strong> 0.15% up to
                  0.31%.
                </li>
                <li>
                  <strong>Two behind (Euro 4):</strong> 0.20% up to 0.41%.
                </li>
                <li>
                  <strong>Three or more behind (Euro 3 and older):</strong>{" "}
                  0.23% up to 0.47%.
                </li>
                <li>
                  <strong>Older diesels</strong> with particulate emissions
                  above 0.005 g/km use a separate, higher rate column of about
                  0.21%–0.75%.
                </li>
              </ul>
              <p>
                New cars must meet the latest emission standard. Cars emitting
                200 g/km or more (NEDC) or 220 g/km or more (WLTP) can also opt
                for a cheaper weekend- and public-holiday-only registration
                (L.N. 21/2026).
              </p>

              <h3 id="length-rates">Length rates</h3>
              <div className="overflow-x-auto not-prose my-6">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Length (mm)
                      </th>
                      <th className="border border-border p-3 text-left">
                        Length rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Up to 3,450", "0.0020%"],
                      ["3,451–3,640", "0.0022%"],
                      ["3,641–3,770", "0.0024%"],
                      ["3,771–4,030", "0.0026%"],
                      ["4,031–4,370", "0.0028%"],
                      ["4,371–4,570", "0.0030%"],
                      ["4,571–4,770", "0.0032%"],
                      ["Over 4,770", "0.0034%"],
                    ].map(([band, rate], i) => (
                      <tr key={band} className={i % 2 ? "bg-muted/50" : ""}>
                        <td className="border border-border p-3">{band}</td>
                        <td className="border border-border p-3">{rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3>Hybrids, LPG and missing data</h3>
              <ul>
                <li>
                  <strong>Regular (non-plug-in) hybrids:</strong> the CO2 value
                  on the CoC is reduced by 30% before the table is applied.
                </li>
                <li>
                  <strong>LPG (autogas):</strong> CO2 value reduced by 10%.
                </li>
                <li>
                  <strong>Plug-in hybrids</strong> with electric range ≥ 50 km
                  are fully exempt (see EV section).
                </li>
                <li>
                  <strong>No CO2 value available:</strong> the highest band
                  applies.
                </li>
              </ul>

              <h3 id="minimum-tax">Minimum tax (non-EU used cars)</h3>
              <p>
                Used M1 cars (including hybrids and LPG cars) imported from
                outside the EU — including the UK — that are{" "}
                <strong>older than 5 years</strong> (counted from the year of
                manufacture) pay at least a minimum registration tax. It does
                not apply to EU imports, and BEVs/PHEVs ≥ 50 km are exempt. The
                minimum ranges from €900 (0–100 g/km, year 6) to €37,437 (over
                250 g/km, 14+ years). For example, a 101–130 g/km car pays at
                least €1,100 in year 6, €2,529 in year 8, €3,172 in year 10 and
                €4,992 from year 14.
              </p>
            </section>

            <section id="ev-incentives" className="mt-12">
              <h2>EV and PHEV incentives (2026)</h2>
              <p>
                If you&apos;re importing a battery-electric or plug-in hybrid
                vehicle, Malta offers incentives that completely change the
                math:
              </p>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Incentive
                      </th>
                      <th className="border border-border p-3 text-left">
                        BEV (battery EV)
                      </th>
                      <th className="border border-border p-3 text-left">
                        PHEV (≥ 50 km range)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Registration tax
                      </td>
                      <td className="border border-border p-3">100% exempt</td>
                      <td className="border border-border p-3">100% exempt</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Annual road licence
                      </td>
                      <td className="border border-border p-3">
                        €0 for years 0–5, then €10/year
                      </td>
                      <td className="border border-border p-3">
                        €0 for years 0–5, then €10/year
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        New-vehicle grant (2026 scheme)
                      </td>
                      <td className="border border-border p-3">
                        €8,000 (price ≤ €40,000) / €6,000 (€40,000–€100,000)
                      </td>
                      <td className="border border-border p-3">
                        Not stated in the scheme — check before buying
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Scrappage bonus (car ≥ 10 years old)
                      </td>
                      <td className="border border-border p-3">
                        +€1,000 (€500 if its licence expired &gt; 3 months
                        earlier)
                      </td>
                      <td className="border border-border p-3">—</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Gozo residents
                      </td>
                      <td className="border border-border p-3">+€1,000</td>
                      <td className="border border-border p-3">—</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Used-EV grant (Form VEH 077)
                      </td>
                      <td className="border border-border p-3">
                        €4,000 if first registered abroad up to 3 months before;
                        €3,000 if 3–6 months
                      </td>
                      <td className="border border-border p-3">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                Grants require <strong>36 months of retention</strong> — if you
                sell or transfer the vehicle before three years, Transport Malta
                can claw the grant back. The used-EV grant applies to vehicles
                from the EU, the UK and other listed countries. Check the
                official application page before committing.
              </p>
              <p>
                For PHEVs, the registration tax exemption is conditional on an
                electric-only range of at least 50 km. PHEVs below this
                threshold pay the standard CO2 + length tax. Always check the
                Certificate of Conformity (CoC) entry for electric range before
                assuming exemption.
              </p>
            </section>

            <section id="vintage" className="mt-12">
              <h2>Vintage / classic vehicles (30+ years)</h2>
              <p>
                Malta has a dedicated regime for vehicles that are at least 30
                years old from their year of manufacture and remain in original
                condition. Since 1 September 2025, vintage status is granted by
                Transport Malta&apos;s{" "}
                <strong>Vintage Vehicle Classification Committee</strong> after
                a physical inspection (this role previously sat with FMVA).
              </p>

              <h3 id="vintage-age-bands">Registration tax by age</h3>
              <ul>
                <li>
                  <strong>30–49 years:</strong> registration tax of roughly{" "}
                  <strong>25.5%–37.5% of the estimated value</strong>, depending
                  on engine size. Limited to 3,000 km per year.
                </li>
                <li>
                  <strong>50+ years:</strong> <strong>0%</strong> registration
                  tax — you only pay customs duty + VAT (if non-EU) and the
                  fixed fees. No annual mileage limit.
                </li>
              </ul>
              <p>
                Certified vintage vehicles get silver-on-black plates (€35 per
                plate), and the annual road licence is waived except for an €8
                admin fee, as long as the mileage limit is respected.
              </p>

              <h3 id="vintage-certification">Certification process</h3>
              <p>
                For an imported vehicle, the fees are a €50 application fee plus
                a €55 inspection fee. For a vehicle already registered in Malta,
                the application fee is €250, of which €200 is refunded if the
                vehicle is approved.
              </p>
            </section>

            <section id="tore" className="mt-12">
              <h2>Transfer of Residence exemption (TORE)</h2>
              <p>
                This is the single biggest exemption available to people moving
                to Malta. If you qualify, your registration tax drops to{" "}
                <strong>zero</strong>. For a 3-year-old BMW with an RV of
                €35,000, 140 g/km (WLTP) and 4,710 mm length, that&apos;s a
                saving of roughly €7,500.
              </p>

              <h3 id="tore-eligibility">Eligibility</h3>
              <ul>
                <li>
                  You must have owned the vehicle for{" "}
                  <strong>at least 24 months</strong> immediately before
                  transferring your residence to Malta.
                </li>
                <li>
                  You must have lived outside Malta for{" "}
                  <strong>at least 24 months</strong> immediately before
                  transferring your residence.
                </li>
                <li>
                  The exemption covers one M1 car or one motorcycle. Multiple
                  vehicles do not qualify — pick one.
                </li>
              </ul>

              <h3 id="tore-application">Application</h3>
              <p>
                Submit Form VEH 007 within <strong>30 days</strong>. A{" "}
                <strong>€100 fee</strong> applies if the application is
                approved, and the Ministry decides within{" "}
                <strong>90 days</strong>.
              </p>

              <h3 id="tore-resale-restriction">The catch</h3>
              <p>
                The exemption is tied to your personal use. If you later sell
                the vehicle in Malta, registration tax becomes due on its market
                value at that time. Plan accordingly.
              </p>
            </section>

            <section id="pitfalls" className="mt-12">
              <h2>Common pitfalls (and how to avoid them)</h2>

              <h3 id="pitfall-30-day-deadline">
                1. Missing the 30-day deadline
              </h3>
              <p>
                The single most expensive mistake. €30/day adds up to €900 in a
                month, and Transport Malta has no goodwill discount for shipping
                delays or customs paperwork issues. Book any roadworthiness test
                and contact your customs broker <strong>before</strong> the
                vehicle lands.
              </p>

              <h3 id="pitfall-pre-euro-5">
                2. Underestimating the tax on an older Euro standard car
              </h3>
              <p>
                A 2008 Euro 4 car can be registered in Malta, but it is taxed on
                the NEDC table two columns behind the latest standard — for a
                120 g/km car that is 0.23% of the RV for the CO2 component,
                versus 0.040% for a WLTP car in the same band. If it comes from
                outside the EU and is over 5 years old, the minimum tax also
                applies. Always check the Euro standard, CO2 value and RV before
                paying for the car or the shipping.
              </p>

              <h3 id="pitfall-uk-brexit">
                3. Assuming the UK route is still cheap post-Brexit
              </h3>
              <p>
                The UK has been treated as a third country since 1 January 2021.
                The EU-UK Trade and Cooperation Agreement gives zero customs
                duty for goods that meet the rules of origin — but many used
                cars don&apos;t qualify because the manufacturing happened in
                Germany, Japan, Korea, etc. Used UK imports generally pay the
                full 10% duty + 18% VAT chain, a €55 inspection fee and — if
                older than 5 years — the minimum registration tax. A specialist
                customs broker can tell you in advance.
              </p>

              <h3>4. Importing a left-hand drive vehicle</h3>
              <p>
                Legal but inconvenient. Daily driving on a left-hand drive car
                in Malta means worse visibility for overtaking, awkward
                parking-booth access, and headlight beam patterns aimed for LHD
                traffic. The roadworthiness examiner can ask for headlight aim
                adjustment before passing the vehicle.
              </p>

              <h3>5. Ignoring the particulate rate for older diesels</h3>
              <p>
                Diesels with particulate emissions above 0.005 g/km (typically
                pre-Euro 5 diesels) are taxed on a separate, higher NEDC rate
                column of roughly 0.21%–0.75% of the RV for the CO2 component.
                Older diesels are also more likely to fail the roadworthiness
                test on emission grounds. Modern petrol or hybrid drivetrains
                are often significantly cheaper to import at the same price
                point.
              </p>

              <h3>6. Forgetting to look up the Registration Value</h3>
              <p>
                Many importers assume the tax is calculated on their purchase
                price. For used cars it isn&apos;t — Transport Malta uses its
                own valuation of the Malta market value, which can be higher or
                lower than what you paid. Check the valuation portal before
                buying so you have a realistic number.
              </p>

              <h3>7. Confusing CIF with purchase price for customs</h3>
              <p>
                Customs Malta calculates the 10% duty on the{" "}
                <strong>CIF value</strong> — vehicle price + insurance +
                shipping — not the purchase price alone. Shipping a €15,000 car
                for €2,000 means duty is calculated on €17,000.
              </p>
            </section>

            <section id="documents" className="mt-12">
              <h2>Required documents checklist</h2>

              <h3>For all imports</h3>
              <ul>
                <li>Original foreign registration certificate</li>
                <li>Bill of sale or commercial invoice</li>
                <li>Bill of lading (shipping document)</li>
                <li>Photo ID and Maltese ID card (or eResidence)</li>
                <li>Valid third-party insurance certificate</li>
                <li>Mileage/odometer reading certificate</li>
                <li>
                  Original Certificate of Conformity (CoC) — needed for WLTP CO2
                  values
                </li>
                <li>Valid EU roadworthiness certificate, if the car has one</li>
              </ul>

              <h3>For non-EU imports (additionally)</h3>
              <ul>
                <li>
                  Customs declaration (single administrative document) with
                  duty/VAT paid receipt
                </li>
                <li>
                  Export certificate or deregistration from origin country
                </li>
                <li>Single Vehicle Approval if no CoC</li>
              </ul>

              <h3>For vintage imports (additionally)</h3>
              <ul>
                <li>
                  Vintage classification application to Transport Malta, with
                  supporting photographs
                </li>
                <li>Evidence of originality (period-correct, unmodified)</li>
                <li>FIVA certificate (optional, if available)</li>
                <li>Vintage-class insurance quote</li>
              </ul>

              <h3>For Transfer of Residence (TORE)</h3>
              <ul>
                <li>Form VEH 007</li>
                <li>Proof of residency abroad for ≥ 24 months</li>
                <li>Proof of vehicle ownership for ≥ 24 months</li>
                <li>Maltese residency document (eResidence card)</li>
                <li>
                  Utility bills or rental contract evidencing both periods
                </li>
              </ul>
            </section>

            <section id="examples" className="mt-12">
              <h2>Real-world cost examples</h2>
              <p>
                All four examples use the SOPV-02 formula and 2026 fees. Your
                exact figures will depend on the official Registration Value
                from the valuation portal — try your own numbers in our{" "}
                <Link
                  href="/calculators/import-vehicle"
                  className="text-primary underline"
                >
                  Malta import vehicle calculator
                </Link>
                .
              </p>

              <h3>Example 1 — Used VW Golf from Germany</h3>
              <p>
                3-year-old (2023, WLTP) petrol Golf, RV €18,000, 130 g/km CO2,
                4,280 mm length, shipping €300, from Germany (EU). CO2: 130 ×
                €18,000 × 0.045% = €1,053. Length: 4,280 × €18,000 × 0.0028% =
                €2,157. No roadworthiness test needed at 3 years.
              </p>
              <div className="not-prose my-6 p-5 rounded-xl bg-muted/40 border border-border/50">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Vehicle + shipping</div>
                  <div className="text-right">€18,300</div>
                  <div>Customs duty / VAT</div>
                  <div className="text-right">€0 (EU used)</div>
                  <div>Registration tax</div>
                  <div className="text-right">~€3,210</div>
                  <div>Fees (€15 registration + €70 plates)</div>
                  <div className="text-right">€85</div>
                  <div className="font-semibold pt-2 border-t border-border">
                    All-in on-road cost
                  </div>
                  <div className="font-semibold text-right pt-2 border-t border-border">
                    ~€21,595
                  </div>
                </div>
              </div>

              <h3>Example 2 — Used petrol hatchback from the UK</h3>
              <p>
                2-year-old Polo, €15,000 (RV €15,000), 120 g/km CO2 (WLTP),
                4,074 mm, shipping €1,200, from the UK (non-EU, no
                rules-of-origin qualification). CO2: 120 × €15,000 × 0.040% =
                €720. Length: 4,074 × €15,000 × 0.0028% = €1,711. No
                roadworthiness test needed (under 4 years, under 160,000 km).
              </p>
              <div className="not-prose my-6 p-5 rounded-xl bg-muted/40 border border-border/50">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Vehicle + shipping (CIF)</div>
                  <div className="text-right">€16,200</div>
                  <div>Customs duty (10% on CIF)</div>
                  <div className="text-right">€1,620</div>
                  <div>VAT (18% on CIF + duty)</div>
                  <div className="text-right">€3,208</div>
                  <div>Registration tax</div>
                  <div className="text-right">~€2,431</div>
                  <div>Fees (€15 + €70 plates + €55 inspection)</div>
                  <div className="text-right">€140</div>
                  <div className="font-semibold pt-2 border-t border-border">
                    All-in on-road cost
                  </div>
                  <div className="font-semibold text-right pt-2 border-t border-border">
                    ~€23,599
                  </div>
                </div>
              </div>
              <p>
                This is why post-Brexit UK imports lost their old appeal: the
                duty + VAT chain adds nearly €5,000 to an otherwise cheap car.
              </p>

              <h3>Example 3 — 1994 Japanese diesel (vintage path)</h3>
              <p>
                32-year-old diesel from Japan, €8,400, shipping €2,500 (non-EU,
                vintage-eligible). Assuming Transport Malta&apos;s estimated
                value is also €8,400, the vintage registration tax is roughly
                25.5%–37.5% of that, depending on engine size. As a non-EU car
                over 4 years old it also needs a roadworthiness test.
              </p>
              <div className="not-prose my-6 p-5 rounded-xl bg-muted/40 border border-border/50">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Vehicle + shipping (CIF)</div>
                  <div className="text-right">€10,900</div>
                  <div>Customs duty (10% on CIF)</div>
                  <div className="text-right">€1,090</div>
                  <div>VAT (18% on CIF + duty)</div>
                  <div className="text-right">€2,158</div>
                  <div>RegTax (~25.5%–37.5% of estimated value)</div>
                  <div className="text-right">~€2,140–€3,150</div>
                  <div>
                    Vintage cert (€50 + €55) + plates €70 + reg €15 + inspection
                    €55 + VRT €30
                  </div>
                  <div className="text-right">€275</div>
                  <div className="font-semibold pt-2 border-t border-border">
                    All-in on-road cost
                  </div>
                  <div className="font-semibold text-right pt-2 border-t border-border">
                    ~€16,565–€17,573
                  </div>
                </div>
              </div>
              <p>
                A 1994 diesel could also be registered as a normal car, but it
                would be taxed on the high older-diesel NEDC rates (or the
                highest band if no CO2 value is available) and would face the
                non-EU minimum tax — the vintage route, if the car is original
                and passes classification, is usually far cheaper.
              </p>

              <h3>Example 4 — New Tesla Model 3 with EV grant</h3>
              <p>
                Brand-new BEV from Germany (EU), €45,000, 0 g/km CO2, 4,720 mm,
                shipping €200. Because the price is over €40,000, the 2026 grant
                is €6,000, plus the €1,000 scrappage bonus.
              </p>
              <div className="not-prose my-6 p-5 rounded-xl bg-muted/40 border border-border/50">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Vehicle + shipping</div>
                  <div className="text-right">€45,200</div>
                  <div>Customs duty</div>
                  <div className="text-right">€0 (EU)</div>
                  <div>VAT (new means of transport, 18%)</div>
                  <div className="text-right">€8,136</div>
                  <div>Registration tax (BEV exempt)</div>
                  <div className="text-right">€0</div>
                  <div>Fees (€15 + €70 plates)</div>
                  <div className="text-right">€85</div>
                  <div>Less: Transport Malta EV grant</div>
                  <div className="text-right">−€6,000</div>
                  <div>Less: scrappage bonus</div>
                  <div className="text-right">−€1,000</div>
                  <div className="font-semibold pt-2 border-t border-border">
                    All-in on-road cost
                  </div>
                  <div className="font-semibold text-right pt-2 border-t border-border">
                    ~€46,421
                  </div>
                </div>
              </div>
              <p>
                On top of the cash savings, the road licence is €0 for the first
                years (then €10/year) — several hundred euros of ownership-cost
                savings versus an equivalent petrol car.
              </p>
            </section>

            <section id="faq" className="mt-12">
              <h2>Frequently asked questions</h2>
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="mt-6">
                  <h3 className="text-lg font-semibold">{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </section>

            <section className="mt-12">
              <h2>Useful links and contacts</h2>
              <ul>
                <li>
                  <strong>Transport Malta — Licensing & Testing:</strong> +356
                  2122 2203 · licensing.tm@gov.mt
                </li>
                <li>
                  <strong>Customs Malta — Vehicle Section:</strong> +356 2568
                  5119
                </li>
                <li>
                  <strong>
                    Vintage vehicle classification (Transport Malta):
                  </strong>{" "}
                  <a
                    href="https://www.transport.gov.mt/land/vehicles/registering-and-licensing-a-motor-vehicle/registering-and-licensing-a-vintage-motor-vehicle-805"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    transport.gov.mt
                  </a>
                </li>
                <li>
                  <strong>Vehicle valuation portal:</strong>{" "}
                  <a
                    href="https://www.valuation.vehicleregistration.gov.mt"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    valuation.vehicleregistration.gov.mt
                  </a>
                </li>
                <li>
                  <strong>SOPV-02 official document:</strong>{" "}
                  <a
                    href="https://www.transport.gov.mt/Land/Downloads-eForms/Vehicles/SOPV-02-REGISTERING-LICENSING-OF-NEW-USED-MOTOR-VEHICLES-3944"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    transport.gov.mt
                  </a>
                </li>
              </ul>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-import-vehicle-guide-2026"
              title="Malta Vehicle Import 2026 Guide"
              ctaTitle="Calculate Your Import Cost"
              ctaLink="/calculators/import-vehicle"
              ctaLinkText="Open Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
