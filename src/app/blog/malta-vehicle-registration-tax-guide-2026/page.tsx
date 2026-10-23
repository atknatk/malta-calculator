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
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Vehicle Registration Tax 2026: Complete Guide | Malta Calculator",
  description:
    "Malta vehicle registration tax 2026: WLTP and NEDC CO2 rate tables, length rates, hybrid and LPG reductions, EV exemptions, non-EU minimum tax and 2026 grants.",
  keywords: [
    "Malta vehicle registration tax",
    "Malta registration tax 2026",
    "Malta car import tax",
    "Malta CO2 tax",
    "Transport Malta registration",
    "Malta EV grant 2026",
    "Malta scrappage scheme",
  ],
  alternates: pageAlternates("/blog/malta-vehicle-registration-tax-guide-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Vehicle Registration Tax 2026 Guide",
    url: `${SITE_URL}/blog/malta-vehicle-registration-tax-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Vehicle Registration Tax 2026 Guide")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Vehicle Registration Tax 2026 Guide",
  },
};

const ARTICLE_SOURCES = [
  {
    name: "Transport Malta - SOPV 02 Registering & Licensing of Motor Vehicles",
    url: "https://www.transport.gov.mt/Land/Downloads-eForms/Vehicles/SOPV-02-REGISTERING-LICENSING-OF-NEW-USED-MOTOR-VEHICLES-3944",
  },
  {
    name: "Transport Malta - Registering a Vehicle (Documents required)",
    url: "https://www.transport.gov.mt/land/vehicles/registering-and-licensing-a-motor-vehicle/registering-a-vehicle-documents-required-3586",
  },
  {
    name: "Malta - Used Motor Vehicle Valuation (eReg)",
    url: "https://www.valuation.vehicleregistration.gov.mt/",
  },
  {
    name: "Transport Malta - 2026 Grant Schemes on New Electric Vehicles & Pedelecs",
    url: "https://www.transport.gov.mt/land/sustainable-transport/grant-schemes-on-new-electric-vehicles-and-pedelecs-2026-7655",
  },
  {
    name: "EU Alternative Fuels Observatory - Malta Incentives & Legislation",
    url: "https://alternative-fuels-observatory.ec.europa.eu/transport-mode/road/malta/incentives-legislations",
  },
  {
    name: "Clean Energy for EU Islands - Malta EV Tax Exemption",
    url: "https://clean-energy-islands.ec.europa.eu/countries/malta/legal/transport-support/tax-exemption-ev",
  },
];

const FAQ_QUESTIONS = [
  {
    question: "How is vehicle registration tax calculated in Malta?",
    answer:
      "For M1 passenger cars, the tax has two parts: CO2 Tax = CO2 (g/km) × Registration Value × CO2 rate%, and Length Tax = Length (mm) × Registration Value × Length rate%. For a new car the Registration Value is the CIF / invoice value; for a used car it is Transport Malta's online valuation, which already reflects the car's age, so there is no separate age-depreciation table. The CO2 rate comes from the WLTP table (if the original Certificate of Conformity shows WLTP values) or the NEDC table, where older Euro standards pay higher rates. Non-plug-in hybrids have their CO2 value reduced by 30% and LPG (autogas) cars by 10% before the tables are applied.",
  },
  {
    question:
      "Are electric vehicles exempt from Malta vehicle registration tax?",
    answer:
      "Yes. Battery electric vehicles (BEVs) and plug-in hybrids (PHEVs) with an electric-only range of at least 50 km are fully exempt from registration tax in Malta. Non-plug-in hybrids are not exempt, but their CO2 value is reduced by 30% before the tax is calculated. BEVs and PHEVs with at least 50 km range also pay €0 annual road licence for years 0-5 (counted from the year of manufacture) and €10 per year after that.",
  },
  {
    question: "Is there a minimum registration tax in Malta?",
    answer:
      "Only in one case: used M1 cars (including hybrids and autogas cars) imported from outside the EU, including the UK, that are more than 5 years old (counted from the year of manufacture). The minimum ranges from €900 (0-100 g/km, year 6) to €37,437 (over 250 g/km, 14+ years) depending on CO2 band and age. For example, a 101-130 g/km car pays at least €1,100 in year 6, €2,529 in year 8, €3,172 in year 10 and €4,992 at 14+ years. It does not apply to cars imported from other EU countries, and BEVs and PHEVs with at least 50 km range remain exempt.",
  },
  {
    question: "Can I register a Euro 4 or Euro 5 car in Malta in 2026?",
    answer:
      "Yes. There is no ban on registering used cars with older Euro standards (Euro 1 to Euro 5). They can be registered, but under the NEDC table they pay higher CO2 rates than a Euro 6 car. Only new cars must meet the latest emission standard. Separately, cars with CO2 of at least 200 g/km (NEDC) or 220 g/km (WLTP) and motorcycles of 801cc or more can opt to register for use on weekends and public holidays only.",
  },
  {
    question: "Do I pay VAT when importing a used car from another EU country?",
    answer:
      "Generally no. A used car from another EU member state that is more than 6 months old and has more than 6,000 km is not subject to Maltese VAT or customs duty, only registration tax. A 'new means of transport' (6 months or less since first entry into service, or 6,000 km or less) pays 18% VAT in Malta on the invoice value even if bought in another EU country. VAT is never charged on the registration tax itself.",
  },
  {
    question: "What grants are available for new EVs in Malta in 2026?",
    answer:
      "Under Transport Malta's Scheme for New Electric Vehicles and Pedelecs 2026, a new battery-electric car gets €8,000 if it costs up to €40,000 and €6,000 if it costs between €40,000 and €100,000 (no grant above €100,000). Scrapping a car at least 10 years old adds €1,000 (€500 if its licence expired more than 3 months earlier), and Gozo residents get an extra €1,000. A separate used-EV grant pays €4,000 for EVs first registered abroad up to 3 months before, or €3,000 for 3-6 months.",
  },
];

export default function VehicleRegistrationTaxGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Vehicle Registration Tax 2026: Complete Guide"
        description="Complete 2026 guide to vehicle registration tax in Malta: CO2 and length formula, WLTP and NEDC rate tables, EV/PHEV exemptions, non-EU minimum tax, EU/non-EU imports, and grant schemes."
        slug="malta-vehicle-registration-tax-guide-2026"
        datePublished="2026-01-01"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Vehicle Registration Tax",
            url: `${SITE_URL}/blog/malta-vehicle-registration-tax-guide-2026`,
          },
        ]}
      />
      <CustomFAQJsonLd questions={FAQ_QUESTIONS} />
      <main role="main">
        <Shell className="max-w-4xl py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <header className="mb-12 not-prose">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-slate-500/10 text-slate-600 text-sm font-semibold rounded-full">
                  Transport
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 10 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Vehicle Registration Tax 2026
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The complete guide to how Transport Malta calculates
                registration tax on M1 passenger cars in 2026 — including the
                CO2 + length formula, EV and PHEV exemptions, minimum tax, EU vs
                non-EU imports, and the new grant schemes.
              </p>
            </header>

            <section id="how-it-works">
              <h2>How Malta&apos;s Registration Tax Actually Works</h2>
              <p>
                Many online guides reduce Malta&apos;s registration tax to a
                flat &ldquo;€X per gram of CO2&rdquo; table. That is{" "}
                <strong>not</strong> how Transport Malta computes it. The real
                formula in SOPV 02 (version 38, January 2026) has two
                value-based components:
              </p>
              <ul>
                <li>
                  <strong>CO2 Tax</strong> = CO2 emissions (g/km) ×{" "}
                  <em>Registration Value</em> × CO2 rate %
                </li>
                <li>
                  <strong>Length Tax</strong> = Vehicle length (mm) ×{" "}
                  <em>Registration Value</em> × Length rate %
                </li>
                <li>
                  <strong>Total tax</strong> = CO2 Tax + Length Tax. A minimum
                  amount applies only to older used cars imported from outside
                  the EU (see below).
                </li>
              </ul>
              <p>
                The CO2 rate depends on whether the car has WLTP or NEDC CO2
                values and, under NEDC, on its Euro emissions standard. For
                diesel cars, particulate matter is also factored in. The result
                is that a long, expensive SUV with high CO2 pays substantially
                more than a small, low-CO2 hatchback.
              </p>
              <ul>
                <li>
                  <strong>Non-plug-in hybrids:</strong> the CO2 value on the
                  Certificate of Conformity is reduced by <strong>30%</strong>{" "}
                  before the rate tables are applied.
                </li>
                <li>
                  <strong>Autogas (LPG) cars:</strong> the CO2 value is reduced
                  by <strong>10%</strong>.
                </li>
                <li>If no CO2 value is available, the highest band applies.</li>
                <li>
                  <strong>No VAT</strong> is charged on the registration tax
                  itself.
                </li>
              </ul>
            </section>

            <section id="registration-value" className="mt-12">
              <h2>What is the &ldquo;Registration Value&rdquo;?</h2>
              <p>
                The Registration Value (RV) is{" "}
                <strong>not always the price you paid</strong>. For new cars it
                is the CIF / invoice value (Cost + Insurance + Freight). For
                used cars it is the Malta market value Transport Malta assigns
                from its{" "}
                <a
                  href="https://www.valuation.vehicleregistration.gov.mt/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  official used-vehicle valuation database
                </a>
                , which lists make, model, variant, month and odometer-band
                values. Because this valuation already reflects the car&apos;s
                age, there is no separate age-depreciation table for M1 cars.
                You can look up your specific make and model before you import.
              </p>
              <p>
                The <strong>WLTP</strong> (Worldwide Harmonised Light Vehicles
                Test Procedure) table is used when the original Certificate of
                Conformity shows WLTP values, which is generally the case for
                cars type-approved from 2021. Older cars homologated under the
                <strong> NEDC</strong> cycle use the NEDC table.
              </p>
            </section>

            <section id="rate-tables" className="mt-12">
              <h2>CO2 and Length Rate Tables (2026)</h2>
              <h3>WLTP CO2 rates (petrol and diesel)</h3>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">CO2 (g/km)</th>\n{" "}
                      <th className="border border-border p-3">CO2 rate</th>
                      \n{" "}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      \n <td className="border border-border p-3">0-120</td>\n{" "}
                      <td className="border border-border p-3">0.040%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">121-140</td>\n{" "}
                      <td className="border border-border p-3">0.045%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr>
                      \n <td className="border border-border p-3">141-150</td>\n{" "}
                      <td className="border border-border p-3">0.050%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">151-160</td>\n{" "}
                      <td className="border border-border p-3">0.060%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr>
                      \n <td className="border border-border p-3">161-190</td>\n{" "}
                      <td className="border border-border p-3">0.070%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">191-230</td>\n{" "}
                      <td className="border border-border p-3">0.100%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr>
                      \n <td className="border border-border p-3">231-260</td>\n{" "}
                      <td className="border border-border p-3">0.110%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">Over 260</td>
                      \n <td className="border border-border p-3">0.143%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                  </tbody>
                </table>
              </div>
              <h3>
                NEDC CO2 rates (petrol, and diesel with PM up to 0.005 g/km)
              </h3>
              <p>
                Under NEDC the rate depends on how the car&apos;s Euro standard
                compares with the latest standard (Euro 6). Older diesels with
                particulate emissions above 0.005 g/km pay higher rates, from
                0.21% to 0.75%.
              </p>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">CO2 (g/km)</th>\n{" "}
                      <th className="border border-border p-3">
                        Euro 6 (latest)
                      </th>
                      \n <th className="border border-border p-3">Euro 5</th>\n{" "}
                      <th className="border border-border p-3">Euro 4</th>\n{" "}
                      <th className="border border-border p-3">
                        Euro 3 and older
                      </th>
                      \n{" "}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      \n <td className="border border-border p-3">0-100</td>\n{" "}
                      <td className="border border-border p-3">0.07%</td>\n{" "}
                      <td className="border border-border p-3">0.15%</td>\n{" "}
                      <td className="border border-border p-3">0.20%</td>\n{" "}
                      <td className="border border-border p-3">0.23%</td>\n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">101-130</td>\n{" "}
                      <td className="border border-border p-3">0.09%</td>\n{" "}
                      <td className="border border-border p-3">0.17%</td>\n{" "}
                      <td className="border border-border p-3">0.23%</td>\n{" "}
                      <td className="border border-border p-3">0.26%</td>\n{" "}
                    </tr>
                    \n{" "}
                    <tr>
                      \n <td className="border border-border p-3">131-140</td>\n{" "}
                      <td className="border border-border p-3">0.10%</td>\n{" "}
                      <td className="border border-border p-3">0.19%</td>\n{" "}
                      <td className="border border-border p-3">0.26%</td>\n{" "}
                      <td className="border border-border p-3">0.30%</td>\n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">141-150</td>\n{" "}
                      <td className="border border-border p-3">0.11%</td>\n{" "}
                      <td className="border border-border p-3">0.22%</td>\n{" "}
                      <td className="border border-border p-3">0.29%</td>\n{" "}
                      <td className="border border-border p-3">0.33%</td>\n{" "}
                    </tr>
                    \n{" "}
                    <tr>
                      \n <td className="border border-border p-3">151-180</td>\n{" "}
                      <td className="border border-border p-3">0.16%</td>\n{" "}
                      <td className="border border-border p-3">0.24%</td>\n{" "}
                      <td className="border border-border p-3">0.32%</td>\n{" "}
                      <td className="border border-border p-3">0.37%</td>\n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">181-220</td>\n{" "}
                      <td className="border border-border p-3">0.18%</td>\n{" "}
                      <td className="border border-border p-3">0.26%</td>\n{" "}
                      <td className="border border-border p-3">0.35%</td>\n{" "}
                      <td className="border border-border p-3">0.40%</td>\n{" "}
                    </tr>
                    \n{" "}
                    <tr>
                      \n <td className="border border-border p-3">221-250</td>\n{" "}
                      <td className="border border-border p-3">0.21%</td>\n{" "}
                      <td className="border border-border p-3">0.29%</td>\n{" "}
                      <td className="border border-border p-3">0.38%</td>\n{" "}
                      <td className="border border-border p-3">0.44%</td>\n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">Over 250</td>
                      \n <td className="border border-border p-3">0.23%</td>\n{" "}
                      <td className="border border-border p-3">0.31%</td>\n{" "}
                      <td className="border border-border p-3">0.41%</td>\n{" "}
                      <td className="border border-border p-3">0.47%</td>\n{" "}
                    </tr>
                    \n{" "}
                  </tbody>
                </table>
              </div>
              <h3>Length rates</h3>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3">Length (mm)</th>
                      \n{" "}
                      <th className="border border-border p-3">Length rate</th>
                      \n{" "}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      \n{" "}
                      <td className="border border-border p-3">Up to 3450</td>\n{" "}
                      <td className="border border-border p-3">0.0020%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">3451-3640</td>
                      \n <td className="border border-border p-3">0.0022%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr>
                      \n <td className="border border-border p-3">3641-3770</td>
                      \n <td className="border border-border p-3">0.0024%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">3771-4030</td>
                      \n <td className="border border-border p-3">0.0026%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr>
                      \n <td className="border border-border p-3">4031-4370</td>
                      \n <td className="border border-border p-3">0.0028%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">4371-4570</td>
                      \n <td className="border border-border p-3">0.0030%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr>
                      \n <td className="border border-border p-3">4571-4770</td>
                      \n <td className="border border-border p-3">0.0032%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                    <tr className="bg-muted/50">
                      \n <td className="border border-border p-3">Over 4770</td>
                      \n <td className="border border-border p-3">0.0034%</td>
                      \n{" "}
                    </tr>
                    \n{" "}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="euro-standards" className="mt-12">
              <h2>Can Older Euro Standards Be Registered?</h2>
              <p>
                Yes. New cars must meet the latest emission standard, but there
                is <strong>no ban</strong> on registering used cars with older
                Euro standards. A used Euro 4 or Euro 5 car can be registered;
                it simply pays the higher NEDC rates shown above.
              </p>
              <p>
                Under L.N. 21/2026 there is also an option to register a vehicle
                for use on <strong>weekends and public holidays only</strong>.
                It is available for cars with CO2 of at least 200 g/km (NEDC) or
                220 g/km (WLTP), and for motorcycles of 801cc or more.
              </p>
            </section>

            <section id="minimum-tax" className="mt-12">
              <h2>Minimum Registration Tax</h2>
              <ul>
                <li>
                  The minimum tax applies <strong>only</strong> to used M1 cars
                  (including hybrids and autogas cars) imported from{" "}
                  <strong>outside the EU, including the UK</strong>, that are{" "}
                  <strong>older than 5 years</strong>, with age counted from the
                  year of manufacture.
                </li>
                <li>
                  It ranges from <strong>€900</strong> (0-100 g/km, year 6) to{" "}
                  <strong>€37,437</strong> (over 250 g/km, 14+ years), depending
                  on CO2 band and age.
                </li>
                <li>
                  Example for a 101-130 g/km car: €1,100 in year 6, €2,529 in
                  year 8, €3,172 in year 10 and €4,992 at 14+ years.
                </li>
                <li>
                  It does <strong>not</strong> apply to cars imported from other
                  EU member states, and BEVs and PHEVs with at least 50 km
                  electric range remain exempt.
                </li>
              </ul>
            </section>

            <section id="ev-phev" className="mt-12">
              <h2>EV, Plug-in Hybrid and Motorcycle Exemptions</h2>
              <ul>
                <li>
                  <strong>Battery electric vehicles (BEVs)</strong> are 100%
                  exempt from registration tax.
                </li>
                <li>
                  <strong>Plug-in hybrids (PHEVs)</strong> are exempt provided
                  the electric-only range is <strong>at least 50 km</strong>{" "}
                  (rule in force since 1 January 2023). PHEVs with a smaller
                  electric range pay normal tax.
                </li>
                <li>
                  <strong>Non-plug-in hybrids</strong> are not exempt, but their
                  CO2 value is reduced by 30% before the tax is calculated.
                </li>
                <li>
                  <strong>
                    Motorcycles up to 350cc and electric motorcycles
                  </strong>{" "}
                  pay 0% registration tax from 1 January 2026 (Budget 2026).
                </li>
                <li>
                  <strong>Hydrogen fuel cell</strong> vehicles are <em>not</em>{" "}
                  currently covered by the EV grants and exemptions framework.
                </li>
              </ul>
              <p>
                BEVs and PHEVs with at least 50 km range also pay{" "}
                <strong>€0</strong> annual road licence for years 0-5 (counted
                from the year of manufacture), then only{" "}
                <strong>€10 per year</strong>, compared with roughly €100 to
                €1,125 for a petrol car depending on CO2 band and age.
              </p>
            </section>

            <section id="imports" className="mt-12">
              <h2>Importing a Vehicle</h2>
              <h3>From another EU member state</h3>
              <ul>
                <li>No customs duty.</li>
                <li>
                  <strong>No VAT</strong> if the car is more than 6 months old
                  and has more than 6,000 km. A &ldquo;new means of
                  transport&rdquo; (<strong>6 months or less</strong> since
                  first entry into service, or <strong>6,000 km or less</strong>
                  ) pays 18% VAT in Malta on the invoice value, even if you
                  bought it in another EU country.
                </li>
                <li>Registration tax on the formula above (no minimum tax).</li>
                <li>
                  Registration must happen within{" "}
                  <strong>30 days of arrival</strong> in Malta; after that a
                  penalty of €30 per day applies.
                </li>
              </ul>
              <h3>From the UK / non-EU country</h3>
              <ul>
                <li>
                  10% customs duty on the CIF value. UK-origin cars may qualify
                  for 0% duty under the EU-UK Trade and Cooperation Agreement
                  rules of origin.
                </li>
                <li>18% VAT on (CIF value + duty).</li>
                <li>
                  Registration tax on the formula above, with the Registration
                  Value set by Transport Malta&apos;s valuation.
                </li>
                <li>
                  The minimum registration tax applies to used M1 cars older
                  than 5 years.
                </li>
                <li>€55 inspection fee for used imports.</li>
              </ul>
            </section>

            <section id="fees" className="mt-12">
              <h2>Other Fees You&apos;ll Pay on Registration</h2>
              <p>
                On top of the registration tax itself, Transport Malta charges
                fixed processing fees. These are <em>separate</em> from the
                CO2/length tax above:
              </p>
              <ul>
                <li>
                  <strong>€15</strong> administration fee.
                </li>
                <li>
                  <strong>€70</strong> random number plates (car / van).{" "}
                  <strong>€35</strong> for motorcycles.
                </li>
                <li>
                  Personalised plates: <strong>€200</strong> for cars,{" "}
                  <strong>€100</strong> for motorcycles. Fully customised
                  plates: <strong>€1,500</strong>. A third plate costs €45.
                </li>
                <li>
                  <strong>€55</strong> inspection fee for used vehicles imported
                  from the UK or from outside the EU. This is not the Vehicle
                  Roadworthiness Test (VRT), which is a separate test some
                  imports also need.
                </li>
                <li>
                  First-year annual road licence, based on CO2 band (or engine
                  size for pre-2009 cars) and age. For petrol cars registered
                  from 2009 it ranges from €100 to €1,125 per year. BEVs and
                  qualifying PHEVs pay €0 for years 0-5.
                </li>
              </ul>
              <p>
                Use our{" "}
                <Link href="/calculators/vehicle-registration-fee">
                  Vehicle Registration Fee calculator
                </Link>{" "}
                to estimate the fixed-fee portion (admin + plates + inspection +
                first year road tax). It does <em>not</em> include the
                CO2/length registration tax above — for that, you need the
                make-and-model Registration Value, which only the official
                Transport Malta valuation tool can give you.
              </p>
            </section>

            <section id="grants" className="mt-12">
              <h2>2026 Grants &amp; Scrappage Scheme</h2>
              <h3>New EV grant amounts (2026 scheme)</h3>
              <ul>
                <li>
                  <strong>€8,000</strong> for a new battery-electric car priced{" "}
                  <strong>up to €40,000</strong>.
                </li>
                <li>
                  <strong>€6,000</strong> for a new battery-electric car priced
                  between <strong>€40,000 and €100,000</strong>. No grant
                  applies above €100,000.
                </li>
                <li>
                  <strong>€650</strong> for a pedelec and{" "}
                  <strong>€2,000</strong> for an electric L1e-L4e vehicle
                  (mopeds, motorcycles and tricycles).
                </li>
              </ul>
              <h3>Scrappage and Gozo bonuses</h3>
              <ul>
                <li>
                  <strong>+€1,000</strong> when you scrap a car at least 10
                  years old (<strong>€500</strong> if its licence expired more
                  than 3 months earlier).
                </li>
                <li>
                  <strong>+€1,000</strong> for Gozo residents.
                </li>
              </ul>
              <h3>Used EV grant</h3>
              <ul>
                <li>
                  <strong>€4,000</strong> if the EV was first registered abroad
                  up to 3 months before, or <strong>€3,000</strong> if 3-6
                  months before.
                </li>
                <li>
                  The vehicle must come from the EU, the UK or another listed
                  country, must be kept for 36 months, and is claimed on form
                  VEH 077.
                </li>
              </ul>
              <p>
                Grants are paid while the scheme&apos;s funds last, so check
                Transport Malta for the current status before you buy.
              </p>
            </section>

            <section id="step-by-step" className="mt-12">
              <h2>Step by Step: Registering a Car in Malta</h2>
              <ol>
                <li>
                  Look up the Registration Value of your make/model on the{" "}
                  <a
                    href="https://www.valuation.vehicleregistration.gov.mt/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    eReg valuation tool
                  </a>
                  .
                </li>
                <li>
                  For used imports from the UK or outside the EU, have the
                  vehicle inspected (€55) and, where required, pass a Vehicle
                  Roadworthiness Test (VRT).
                </li>
                <li>
                  Submit form <strong>VEH 001</strong> with the Certificate of
                  Conformity, purchase invoice, and Bill of Lading / EU transfer
                  documentation.
                </li>
                <li>
                  Transport Malta computes the registration tax using the SOPV
                  formula and issues a tax assessment.
                </li>
                <li>
                  Pay registration tax + €15 admin + €70 plates (+ €55
                  inspection for non-EU used imports) + first-year road licence.
                </li>
                <li>
                  Plates are issued and the logbook is registered in your name.
                </li>
              </ol>
              <p>
                For imports you must complete this within{" "}
                <strong>30 days of the vehicle&apos;s arrival in Malta</strong>;
                late registration costs €30 per day.
              </p>
            </section>

            <section id="disclaimer" className="mt-12 not-prose">
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-sm leading-relaxed">
                <p className="font-semibold mb-2">Important</p>
                <p className="text-muted-foreground">
                  The rate tables above follow SOPV 02 as in force in 2026.
                  Because the formula uses the make-and-model Registration
                  Value, the only way to get an exact figure is the official
                  eReg valuation tool or by contacting Transport Malta directly.
                  The Malta Calculator fee calculator estimates the{" "}
                  <em>fixed-fee portion</em> only and does not include the
                  CO2/length registration tax itself. Budget 2027, presented on
                  26 October 2026, may change these rates, so recheck after the
                  budget.
                </p>
              </div>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-vehicle-registration-tax-guide-2026"
              title="Malta Vehicle Registration Tax 2026 Guide"
              ctaTitle="Estimate Registration Fees"
              ctaLink="/calculators/vehicle-registration-fee"
              ctaLinkText="Try Fee Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
