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
    "Malta vehicle registration tax 2026: how the CO2 + length + Euro standard formula on Registration Value works, EV exemptions, minimum tax, EU/non-EU imports, and 2026 grants.",
  keywords: [
    "Malta vehicle registration tax",
    "Malta VRT 2026",
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
      "For M1 passenger cars, Malta's registration tax is a percentage of the vehicle's Registration Value (the CIF / market value the Commissioner for Revenue assigns) plus a length-based component. The formula is: CO2 Tax = CO2 (g/km) × Registration Value × CO2 rate%; Length Tax = Length (mm) × Registration Value × Length rate%. Both rates depend on the vehicle's Euro emissions standard. The result is then adjusted for age. A €2,000 minimum applies to M1 vehicles registered under the Weekends and Public Holidays Scheme.",
  },
  {
    question:
      "Are electric vehicles exempt from Malta vehicle registration tax?",
    answer:
      "Yes. Battery electric vehicles (BEVs) and plug-in hybrids (PHEVs) with an electric-only range of at least 50 km are fully exempt from registration tax in Malta. Pure hybrids without a plug do not get a statutory exemption — they pay normal tax based on their CO2 emissions, which is usually low anyway. EVs are also exempt from the annual circulation (road) tax for the first 5 years from first registration.",
  },
  {
    question: "Is there a minimum registration tax in Malta?",
    answer:
      "Yes, but it applies in specific scenarios rather than universally. A €2,000 minimum applies to M1 cars (and €1,000 for motorcycles) being registered under the Weekends and Public Holidays Scheme. A €1,000 minimum applies to vehicles registered from outside the EU. Used M1 cars imported from the UK that are more than 5 years old are subject to a separate minimum tax table published by Transport Malta. For a standard Euro 6 M1 import, the formula above produces the tax bill directly.",
  },
  {
    question: "Can I register a Euro 4 or Euro 5 car in Malta in 2026?",
    answer:
      "No. Only vehicles meeting Euro 6 or higher emission standards can be newly registered in Malta. Older Euro 3/4/5 cars cannot be registered for normal road use. M1 vehicles with CO2 ≥ 221 g/km and emissions of the latest standard (or one/two below) can only be registered for limited use under the Weekends and Public Holidays Scheme, which has its own minimum tax of €2,000 (M1) or €1,000 (motorcycles).",
  },
  {
    question: "Do I pay VAT when importing a used car from another EU country?",
    answer:
      "Generally no. A used car from another EU member state is not subject to Maltese VAT or customs duty — only registration tax. The exception is a 'new means of transport' under EU VAT rules: a vehicle that is less than 6 months old OR has less than 6,000 km on the odometer. In that case, Malta charges 18% VAT on the purchase price even if you bought it in another EU country.",
  },
  {
    question: "What grants are available for new EVs in Malta in 2026?",
    answer:
      "Under the 2026 Sustainable Transport Grant Scheme, Transport Malta offers €8,000 for new battery-electric cars and vans priced up to €40,000, and €6,000 for those priced between €40,000 and €100,000. There is also a scrappage bonus of €1,000 (cars) or €500 (motorcycles) when you deregister a vehicle older than 10 years at an Authorised Treatment Facility, plus an additional €1,000 for Gozo residents. Grants run on a first-come-first-served basis until 31 December 2026 or until the budget is exhausted.",
  },
];

export default function VehicleRegistrationTaxGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Vehicle Registration Tax 2026: Complete Guide"
        description="Complete 2026 guide to vehicle registration tax in Malta: formula, Euro 6 requirement, EV/PHEV exemptions, minimum tax, EU/non-EU imports, and grant schemes."
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
                formula in SOPV-02 has two value-based components:
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
                  <strong>Total tax</strong> = CO2 Tax + Length Tax, adjusted
                  for age depreciation and subject to a minimum amount.
                </li>
              </ul>
              <p>
                The CO2 and length percentages depend on the vehicle&apos;s Euro
                emissions standard. For diesel vehicles, particulate matter is
                also factored in. The result is that a long, heavy, expensive
                SUV with high CO2 pays substantially more than a small, low-CO2
                hatchback of the same Euro standard.
              </p>
            </section>

            <section id="registration-value" className="mt-12">
              <h2>What is the &ldquo;Registration Value&rdquo;?</h2>
              <p>
                The Registration Value (RV) is{" "}
                <strong>not the price you paid</strong>. For new cars it is
                broadly the CIF value (Cost + Insurance + Freight). For used
                cars it is the value Transport Malta assigns from its{" "}
                <a
                  href="https://www.valuation.vehicleregistration.gov.mt/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  official used-vehicle valuation database
                </a>
                , which lists make, model, variant, month and odometer-band
                values. You can look up your specific make and model there
                before you import.
              </p>
              <p>
                Since 1 January 2021 Transport Malta uses <strong>WLTP</strong>{" "}
                (Worldwide Harmonised Light Vehicles Test Procedure) CO2
                figures. Older vehicles homologated under the
                <strong> NEDC</strong> cycle use the manufacturer&apos;s NEDC
                values from the Certificate of Conformity.
              </p>
            </section>

            <section id="euro-6" className="mt-12">
              <h2>Only Euro 6 or Newer Can Be Registered</h2>
              <p>
                Since the tightening of the emissions regime, only vehicles with
                Euro 6 or higher emission standards can be newly registered in
                Malta. Older Euro 3 / 4 / 5 cars cannot be put on Maltese plates
                for normal road use. The one exception is the Weekends and
                Public Holidays scheme, available for vehicles with CO2 ≥ 221
                g/km on the latest emission level (or one/two standards below),
                with a minimum tax of €2,000 for M1 cars and €1,000 for
                motorcycles.
              </p>
            </section>

            <section id="minimum-tax" className="mt-12">
              <h2>Minimum Registration Tax</h2>
              <ul>
                <li>
                  <strong>€2,000</strong> minimum for M1 passenger cars and{" "}
                  <strong>€1,000</strong> for motorcycles registered under the{" "}
                  <strong>Weekends and Public Holidays Scheme</strong> (the
                  scheme for high-CO2 or older-standard vehicles that may only
                  be used on weekends/public holidays).
                </li>
                <li>
                  <strong>€1,000</strong> minimum for vehicles being registered
                  from outside the EU.
                </li>
                <li>
                  Used M1 cars and L7e quadricycles imported{" "}
                  <strong>from the UK and older than 5 years</strong> follow a
                  separate minimum-tax table published by Transport Malta.
                </li>
                <li>
                  For standard M1 imports the formula above produces the tax
                  bill. Practical experience suggests the realistic floor for a
                  Euro 6 family car is in the low €1,000s once the formula and
                  age depreciation are applied — but there is no published
                  universal flat minimum that overrides the formula for normal
                  registrations.
                </li>
              </ul>
            </section>

            <section id="ev-phev" className="mt-12">
              <h2>EV and Plug-in Hybrid Exemptions</h2>
              <p>
                The Maltese government uses two main levers to push EV adoption:
              </p>
              <ul>
                <li>
                  <strong>Battery electric vehicles (BEVs)</strong> are 100%
                  exempt from registration tax — their CO2 is zero, and the
                  exemption is statutory.
                </li>
                <li>
                  <strong>Plug-in hybrids (PHEVs)</strong> are exempt from
                  registration tax provided the manufacturer-declared
                  electric-only range is <strong>at least 50 km</strong>. PHEVs
                  with a smaller electric range pay normal tax based on their
                  WLTP CO2.
                </li>
                <li>
                  <strong>Pure (non-plug-in) hybrids</strong> do <em>not</em>{" "}
                  get a flat statutory discount. They pay normal tax — but their
                  CO2 is naturally lower than an equivalent petrol car, so the
                  bill tends to be modest.
                </li>
                <li>
                  <strong>Hydrogen fuel cell</strong> vehicles are <em>not</em>{" "}
                  currently covered by the EV grants and exemptions framework.
                </li>
              </ul>
              <p>
                EVs and qualifying PHEVs also get an exemption from the annual
                road licence (circulation tax) for the first{" "}
                <strong>five years</strong> from first registration. After the
                five-year window, BEVs pay only a nominal{" "}
                <strong>€10 per year</strong> annual licence — compared with
                roughly €100–€749 for an equivalent ICE car.
              </p>
            </section>

            <section id="imports" className="mt-12">
              <h2>Importing a Vehicle</h2>
              <h3>From another EU member state</h3>
              <ul>
                <li>No customs duty.</li>
                <li>
                  <strong>No VAT</strong> — unless the car is a &ldquo;new means
                  of transport&rdquo; under EU VAT rules: less than{" "}
                  <strong>6 months old</strong> OR with less than{" "}
                  <strong>6,000 km</strong>. In that case Malta charges 18% VAT
                  on the purchase price even though you bought it inside the EU.
                </li>
                <li>Registration tax on the formula above.</li>
                <li>
                  Registration must happen within{" "}
                  <strong>30 days of arrival</strong> in Malta to avoid
                  penalties.
                </li>
              </ul>
              <h3>From the UK / non-EU country</h3>
              <ul>
                <li>10% customs duty on the vehicle&apos;s value.</li>
                <li>18% VAT on (vehicle value + duty + shipping).</li>
                <li>Registration tax on the formula above.</li>
                <li>Minimum €1,000 registration tax applies.</li>
              </ul>
            </section>

            <section id="fees" className="mt-12">
              <h2>Other Fees You&apos;ll Pay on Registration</h2>
              <p>
                On top of the registration tax itself, Transport Malta charges
                fixed processing fees. These are <em>separate</em> from the
                CO2/length tax above and are the same for almost every vehicle:
              </p>
              <ul>
                <li>
                  <strong>€15</strong> administration fee.
                </li>
                <li>
                  <strong>€70</strong> random number plates (car / van /
                  commercial). <strong>€35</strong> for motorcycles.
                </li>
                <li>
                  <strong>€200</strong> for personalised plates,{" "}
                  <strong>€1,500</strong> for fully customised plates.
                </li>
                <li>
                  <strong>€55</strong> VRT (Vehicle Roadworthiness Test)
                  inspection for imported vehicles.
                </li>
                <li>
                  First-year annual road licence (circulation tax), based on
                  engine size and CO2. For post-01/01/2009 petrol cars this
                  ranges roughly €100–€650 per year, and for diesel cars
                  €100–€749. EVs and qualifying PHEVs pay €0 for the first five
                  years.
                </li>
              </ul>
              <p>
                Use our{" "}
                <Link href="/calculators/vehicle-registration-fee">
                  Vehicle Registration Fee calculator
                </Link>{" "}
                to estimate the fixed-fee portion (admin + plates + VRT + first
                year road tax). It does <em>not</em> include the CO2/length
                registration tax above — for that, you need the make-and-model
                Registration Value, which only the official Transport Malta
                valuation tool can give you.
              </p>
            </section>

            <section id="grants" className="mt-12">
              <h2>2026 Grants &amp; Scrappage Scheme</h2>
              <h3>New EV grant amounts (2026 scheme)</h3>
              <ul>
                <li>
                  <strong>€8,000</strong> for new BEV cars and vans priced{" "}
                  <strong>up to €40,000</strong>.
                </li>
                <li>
                  <strong>€6,000</strong> for new BEV cars and vans priced
                  between <strong>€40,000 and €100,000</strong>.
                </li>
                <li>
                  Grants for new pedelecs (electric pedal-assist bicycles) also
                  apply, with their own schedule.
                </li>
              </ul>
              <h3>Scrappage bonus</h3>
              <ul>
                <li>
                  <strong>+€1,000</strong> when you scrap a car older than 10
                  years at an Authorised Treatment Facility.
                </li>
                <li>
                  <strong>+€500</strong> for scrapping a motorcycle.
                </li>
                <li>
                  <strong>Additional €1,000</strong> for Gozo residents
                  scrapping a vehicle registered in Gozo.
                </li>
              </ul>
              <p>
                The 2026 scheme runs on a first-come-first-served basis until{" "}
                <strong>31 December 2026</strong> or until the allocated budget
                is exhausted. Destruction Certificates must be dated 2025 or
                2026. Used-EV imports and used-EV transfers between Maltese
                owners have their own (smaller) grant tracks.
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
                  Bring the vehicle to a VRT testing station for the €55
                  inspection (imported vehicles).
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
                  Pay registration tax + €15 admin + €70 plates (+ €55 VRT for
                  imports) + first-year road licence.
                </li>
                <li>
                  Plates are issued and the V5 (logbook) is registered in your
                  name.
                </li>
              </ol>
              <p>
                You must complete this within{" "}
                <strong>30 days of the vehicle&apos;s arrival in Malta</strong>{" "}
                (for imports) or within 30 days of purchase (for a local
                second-hand car).
              </p>
            </section>

            <section id="disclaimer" className="mt-12 not-prose">
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-sm leading-relaxed">
                <p className="font-semibold mb-2">Important</p>
                <p className="text-muted-foreground">
                  The exact CO2 and length rate percentages depend on each
                  vehicle&apos;s Euro emission standard and the SOPV-02 rate
                  tables in force on the day of registration. Because the
                  formula uses the make-and-model Registration Value, the only
                  way to get an exact figure is the official eReg valuation tool
                  or by contacting Transport Malta directly. The Malta
                  Calculator fee calculator estimates the{" "}
                  <em>fixed-fee portion</em> only and does not include the
                  CO2/length registration tax itself.
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
