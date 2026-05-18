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
  title: "Importing a Vehicle to Malta 2026: Complete Guide | Malta Calculator",
  description:
    "Full 2026 guide to importing a car to Malta: SOPV-02 registration tax, customs duty, VAT, EV grants, vintage rules, Transfer of Residence exemption, and the 30-day deadline.",
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
    name: "FMVA Malta — Federazzjoni Maltija Vetturi Antiki",
    url: "https://www.fmvamalta.org/",
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
      "For an EU used vehicle, only the SOPV-02 registration tax (typically €1,500–€5,000 for modern low-emission cars) plus around €120 in fixed fees. For a Non-EU import, add 10% customs duty on CIF value, 18% VAT on (CIF + duty), and another 18% VAT on the registration tax. A new electric vehicle pays €0 registration tax and can claim up to €11,000 in government grants.",
  },
  {
    question: "Can I import a Euro 1, 2, 3 or 4 vehicle to Malta?",
    answer:
      "Not for normal road registration. Under SOPV-02 (aligned with EU Directive 2007/46/EC), Malta only registers vehicles meeting Euro 5b/6b emission standards or higher. Older vehicles can only be registered through the FMVA vintage/classic path, which requires the vehicle to be at least 30 years old and in original condition.",
  },
  {
    question: "What is the Transfer of Residence (TORE) exemption?",
    answer:
      "If you are moving residence to Malta, you can import one M1 vehicle (passenger car) fully exempt from registration tax. The conditions: the vehicle must have been registered in your name for at least 24 months before the move, and you must have lived outside Malta for at least 24 months. Form VEH 007 must be submitted within 30 days of arrival. The vehicle cannot be sold or transferred for 12 months after import.",
  },
  {
    question: "Is the 30-day deadline real?",
    answer:
      "Yes. Article 21(4) of the Motor Vehicle Registration and Licensing Act (Cap 368) imposes an administrative fine of €30 per day past the 30-day deadline for completing customs, valuation, VRT and registration. Plan the shipping, customs broker and VRT booking before the vehicle lands.",
  },
  {
    question: "Do I have to pay VAT on a used car from the EU?",
    answer:
      "No. Used vehicles from EU countries (older than 6 months and over 6,000 km) pay no VAT and no customs duty in Malta. You only pay the SOPV-02 registration tax plus the fixed fees (VRT, plates, registration).",
  },
  {
    question: "How much is the EV grant in Malta in 2026?",
    answer:
      "Transport Malta's 2026 New EV Scheme grants up to €11,000 for a new battery-electric or plug-in hybrid vehicle (with electric range ≥ 50 km). A scrappage bonus of €2,000 applies if you deregister a passenger or commercial vehicle that is at least 10 years old at an Authorised Treatment Facility. A smaller used-EV grant (€1,000 base, +€1,000 scrappage) is available for used EVs registered in Malta after 1 January 2025.",
  },
  {
    question: "What is a vintage vehicle in Malta?",
    answer:
      "Any vehicle at least 30 years old from its year of manufacture, in original and unmodified condition. Vintage status requires FMVA certification (Form VEH 15) and brings black registration plates, €0 annual road licence (only €8 admin fee), and a 3,000 km/year mileage cap. Imported vintage vehicles aged 35–50 years get 50% off the registration tax; vehicles over 50 years pay zero registration tax.",
  },
  {
    question: "Can I import a left-hand drive car to Malta?",
    answer:
      "Yes, LHD vehicles are legally importable, but Malta drives on the left, so visibility for overtaking and parking-booth access is awkward. You will likely need to adjust headlight aim for VRT, and some practical inconveniences apply daily. If you can choose, right-hand drive is recommended.",
  },
  {
    question: "Do I still need to pay duty on a UK car after Brexit?",
    answer:
      "Yes, in most practical cases. The UK is non-EU since 1 January 2021, so the standard 10% customs duty and 18% VAT apply. The EU-UK Trade and Cooperation Agreement allows zero customs duty for goods that meet UK Rules of Origin, but most used cars don't qualify because they were not manufactured in the UK. Confirm with a customs broker before assuming the zero-duty rate.",
  },
  {
    question: "When is a VRT inspection required at import?",
    answer:
      "VRT (Vehicle Roadworthiness Test) is required at import if the vehicle is more than 4 years old, or if its odometer exceeds 160,000 km. New vehicles and very recent used vehicles below both thresholds skip the inspection at import — but VRT becomes mandatory once the vehicle reaches 4 years from first registration.",
  },
];

export default function ImportVehicleGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Importing a Vehicle to Malta 2026: Complete Guide"
        description="Full 2026 guide to importing a car to Malta — SOPV-02 registration tax, customs duty, VAT, EV grants, vintage rules, Transfer of Residence exemption, and the 30-day deadline."
        slug="malta-import-vehicle-guide-2026"
        datePublished="2026-01-01"
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
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-slate-500/10 text-slate-600 text-sm font-semibold rounded-full">
                  Transport
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> January 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 15 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Importing a Vehicle to Malta 2026 — The Complete Guide
              </h1>
              <p className="text-xl text-muted-foreground">
                Everything you actually need to know: the SOPV-02 registration
                tax formula, customs and VAT chain, EV incentives, vintage
                pathway, the Transfer of Residence exemption, and the expensive
                30-day deadline most people miss.
              </p>
            </header>

            <div className="not-prose mb-12 p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50">
              <h2 className="font-semibold mb-4 text-lg">
                Quick answer (TL;DR)
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <strong className="text-foreground">EU used car:</strong>{" "}
                  registration tax only (typically €1,500–€5,000) plus ~€120 in
                  fixed fees.
                </li>
                <li>
                  <strong className="text-foreground">Non-EU used car:</strong>{" "}
                  add 10% customs duty on CIF + 18% VAT on (CIF + duty) + 18%
                  VAT on registration tax.
                </li>
                <li>
                  <strong className="text-foreground">
                    Battery EV / PHEV ≥ 50 km range:
                  </strong>{" "}
                  €0 registration tax, €0 annual road licence for 5 years, up to
                  €13,000 in government grants for new vehicles.
                </li>
                <li>
                  <strong className="text-foreground">Moving to Malta:</strong>{" "}
                  one M1 vehicle can be fully exempt from registration tax via
                  the TORE scheme (Form VEH 007).
                </li>
                <li>
                  <strong className="text-foreground">
                    Pre-2009 (Euro 1–4):
                  </strong>{" "}
                  cannot be registered normally — only the vintage path is
                  available, and only for vehicles ≥ 30 years old.
                </li>
                <li>
                  <strong className="text-foreground">30-day rule:</strong>{" "}
                  whole process must complete within 30 days of arrival or you
                  pay €30 per day in fines.
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
                  <strong>Customs duty and VAT</strong> — only when importing
                  from outside the EU. The duty is 10% of the CIF value (vehicle
                  price + insurance + freight), and VAT is 18% on (CIF + duty).
                  Importantly, an additional 18% VAT is charged on top of the
                  registration tax for non-EU private imports.
                </li>
                <li>
                  <strong>Registration Tax (RegTax)</strong> — Malta's SOPV-02
                  framework computes this from the vehicle's Registration Value
                  (RV), its CO2 emissions, length, and Euro emission standard.
                  This is usually the largest single line for non-vintage
                  vehicles.
                </li>
                <li>
                  <strong>Fixed fees</strong> — VRT inspection (€36, only if the
                  vehicle is over 4 years or 160,000 km), number plates (€35
                  standard, €70 vintage black plates), and the first
                  registration fee (€50).
                </li>
              </ol>
              <p>
                On top of these there are practical costs the calculator won't
                itemise: shipping, transit insurance, port handling, customs
                broker fees, and any compliance work needed (headlight aim,
                missing Certificate of Conformity, etc.). Budget another
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
                  authority.
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
                  and pay the registration tax at Transport Malta&apos;s
                  Licensing and Testing Directorate.
                </li>
                <li>
                  Book the VRT inspection if required (vehicle &gt; 4 years or
                  &gt; 160,000 km). Bring all documents on the day.
                </li>
                <li>
                  Collect number plates and finalise registration. You should
                  walk out with a Maltese logbook and plates the same day in
                  most cases.
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
                  declaration. Customs Malta calculates the 10% duty and 18% VAT
                  on the CIF value. Pay before the car is released.
                </li>
                <li>
                  <strong>Registration valuation:</strong> Transport Malta
                  determines the official RV. For models in the CAP Motor
                  Research database this is automatic; for older or unusual
                  vehicles you may need Form VEH 14 (manual valuation).
                </li>
                <li>
                  <strong>Pay registration tax + 18% VAT on RegTax.</strong>
                </li>
                <li>VRT inspection.</li>
                <li>Number plates and final registration.</li>
              </ol>
              <p>
                All of this must complete within{" "}
                <strong>30 days of arrival</strong>, per Article 21(4) of the
                Motor Vehicle Registration and Licensing Act (Cap 368), or you
                pay an administrative fine of <strong>€30 per day</strong> until
                the vehicle is registered.
              </p>
            </section>

            <section id="regtax" className="mt-12">
              <h2>Registration tax — the SOPV-02 formula</h2>
              <p>
                For passenger cars (M1) registered after 2009, Malta uses a
                two-component formula:
              </p>
              <div className="not-prose my-6 p-5 rounded-xl bg-muted/40 border border-border/50 font-mono text-sm">
                <div>
                  RegTax = (CO2 × RV × CO2-rate%) + (Length × RV × Length-rate%)
                </div>
                <div className="mt-2 text-muted-foreground">
                  ↓ × (1 + diesel particulate matter surcharge, if diesel)
                </div>
                <div className="mt-2 text-muted-foreground">
                  ↓ × (1 − age depreciation)
                </div>
                <div className="mt-2 text-muted-foreground">
                  ↓ vintage concession (if applicable)
                </div>
              </div>

              <h3>Registration Value (RV)</h3>
              <p>
                The RV is{" "}
                <strong>
                  not the purchase price — it&apos;s the trade value Malta
                  assigns to your specific make and model
                </strong>
                . It comes from CAP Motor Research data and is published on the
                official portal at{" "}
                <a
                  href="https://www.valuation.vehicleregistration.gov.mt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  valuation.vehicleregistration.gov.mt
                </a>
                . If your vehicle isn&apos;t in the database (unusual model,
                very old, or commercial), file Form VEH 14 to request a manual
                valuation.
              </p>
              <p>
                The valuation printout is valid from the month it was issued
                until the end of the following month. Get it close to the day
                you actually register the vehicle.
              </p>

              <h3>Euro emission standard rule (critical for older cars)</h3>
              <p>
                Under SOPV-02 — aligned with EU Directive 2007/46/EC — Malta
                only registers passenger vehicles meeting{" "}
                <strong>Euro 5b/6b emission standards or higher</strong>. In
                practice this means model years from approximately 2009 onwards.
                A 2007 diesel, a 2003 petrol, or anything older cannot be plated
                as a regular passenger car, regardless of how much tax
                you&apos;re willing to pay.
              </p>
              <p>
                The only exception is the vintage / classic path (see below).
              </p>

              <h3>CO2, length and age — how each input matters</h3>
              <ul>
                <li>
                  <strong>CO2 rate by Euro standard:</strong> Euro 6 ≈ 0.041%,
                  Euro 5 ≈ 0.041%, Euro 4 ≈ 0.044%, Euro 3 ≈ 0.047%. The higher
                  your emissions, the higher the bill — Malta&apos;s reform was
                  deliberate.
                </li>
                <li>
                  <strong>Length rate by vehicle length:</strong> 0.0020% (≤
                  3,450 mm city car) up to 0.0034% (large SUV &gt; 4,770 mm).
                  Bigger cars cost more.
                </li>
                <li>
                  <strong>Diesel surcharge:</strong> roughly 15% additional on
                  the CO2 component, reflecting the particulate-matter component
                  in SOPV-02.
                </li>
                <li>
                  <strong>Hybrid / plug-in hybrid:</strong> regular hybrids get
                  a 25% discount on the CO2 component. Plug-in hybrids with
                  electric range ≥ 50 km are fully exempt (see EV section).
                </li>
                <li>
                  <strong>Age depreciation:</strong> reduces the RegTax
                  progressively — about 25% at 3 years, 40% at 6, 50% at 9.
                  Capped around 70% for very old vehicles.
                </li>
              </ul>
            </section>

            <section id="ev-incentives" className="mt-12">
              <h2>EV and PHEV incentives (2026)</h2>
              <p>
                If you&apos;re importing a battery-electric or plug-in hybrid
                vehicle, Malta stacks three separate incentives that completely
                change the math:
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
                        Annual road licence (first 5 years)
                      </td>
                      <td className="border border-border p-3">€0</td>
                      <td className="border border-border p-3">€0</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        New-vehicle grant (base)
                      </td>
                      <td className="border border-border p-3">€11,000</td>
                      <td className="border border-border p-3">€11,000</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Scrappage bonus (deregister ≥ 10 y ICE)
                      </td>
                      <td className="border border-border p-3">+€2,000</td>
                      <td className="border border-border p-3">+€2,000</td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Used-EV grant (registered in Malta after 1 Jan 2025)
                      </td>
                      <td className="border border-border p-3">
                        €1,000 (+€1,000 scrappage)
                      </td>
                      <td className="border border-border p-3">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                The grant requires <strong>36 months of retention</strong> — if
                you sell or transfer the vehicle before three years, Transport
                Malta will claw the grant back. There are also state-aid /
                no-state-aid variants of the 2026 scheme depending on the
                applicant; check the official application page before
                committing.
              </p>
              <p>
                For PHEVs, the 100% exemption is conditional on an electric-only
                range of at least 50 km. Older or smaller-battery PHEVs that
                fall below this threshold pay the standard CO2 + length tax.
                Always check the Certificate of Conformity (CoC) entry for
                electric range before assuming exemption.
              </p>
            </section>

            <section id="vintage" className="mt-12">
              <h2>Vintage / classic vehicles (30+ years)</h2>
              <p>
                Malta has a dedicated regime for cars that are at least 30 years
                old from their year of manufacture and remain in original,
                unmodified condition. Vintage status is granted by FMVA Malta
                (Federazzjoni Maltija Vetturi Antiki) through Form VEH 15.
              </p>

              <h3>Three age bands</h3>
              <ul>
                <li>
                  <strong>30–34 years:</strong> eligible for classic status.
                  Black plates, €0 annual road licence (€8 admin fee), 3,000
                  km/year usage cap, must remain original. Registration tax
                  still applies in full at first import.
                </li>
                <li>
                  <strong>35–50 years:</strong> all of the above, plus a{" "}
                  <strong>50% concession</strong> on the registration tax.
                </li>
                <li>
                  <strong>50+ years:</strong> all of the above, plus a{" "}
                  <strong>full exemption</strong> from the registration tax —
                  you only pay customs duty + VAT (if non-EU) and the fixed
                  fees.
                </li>
              </ul>

              <h3>Certification process</h3>
              <p>
                The FMVA application fee is €250, of which €200 is refunded upon
                successful certification. Transport Malta charges €50
                administration plus €55 inspection. Re-inspection is required
                every 5 years for vehicles aged 30–49 (waived for vehicles 50+
                if accompanied by a FIVA certificate).
              </p>
              <p>
                For very old vehicles, the SOPV-02 CO2-and-length formula
                doesn&apos;t strictly apply. FMVA&apos;s classification
                committee typically assigns a flat valuation, and the resulting
                registration tax for a 30–34-year-old car is usually somewhere
                between €100 and €600 in practice — much lower than the formula
                upper bound.
              </p>
            </section>

            <section id="tore" className="mt-12">
              <h2>Transfer of Residence exemption (TORE)</h2>
              <p>
                This is the single biggest exemption available to people moving
                to Malta. If you qualify, your registration tax — and the 18%
                VAT charged on top of it — drops to <strong>zero</strong>. For a
                3-year-old €35,000 BMW that&apos;s a saving of roughly €5,500 to
                €7,000.
              </p>

              <h3>Eligibility</h3>
              <ul>
                <li>
                  The vehicle must have been registered in your name for{" "}
                  <strong>at least 24 continuous months</strong> immediately
                  before you transferred residence to Malta, and still
                  registered in your name when the vehicle is imported.
                </li>
                <li>
                  You must have lived outside Malta for{" "}
                  <strong>at least 24 continuous months</strong> immediately
                  before transferring residence. An Administrative Review
                  Tribunal judgment in October 2025 clarified that the 24 months
                  is counted from the issuance of the residency document.
                </li>
                <li>
                  You must be importing one M1 vehicle (passenger car) or a
                  cycle. Multiple vehicles do not qualify — pick one.
                </li>
              </ul>

              <h3>Application</h3>
              <p>
                Submit Form VEH 007 within{" "}
                <strong>30 days of your residency transfer</strong> (or within
                30 days of the vehicle&apos;s arrival in Malta, if you arrived
                first). You can apply up to 2 months before the vehicle arrives.
              </p>

              <h3>The catch</h3>
              <p>
                A condition is recorded in the vehicle&apos;s logbook: you
                cannot sell or transfer the vehicle for{" "}
                <strong>12 months</strong> after import. If you do, the full
                registration tax becomes payable. Plan accordingly.
              </p>
            </section>

            <section id="pitfalls" className="mt-12">
              <h2>Common pitfalls (and how to avoid them)</h2>

              <h3>1. Missing the 30-day deadline</h3>
              <p>
                The single most expensive mistake. €30/day adds up to €900 in a
                month, and Transport Malta has no goodwill discount for shipping
                delays or customs paperwork issues. Book the VRT inspection and
                contact your customs broker <strong>before</strong> the vehicle
                lands.
              </p>

              <h3>2. Buying a Euro 1–4 vehicle for normal road use</h3>
              <p>
                A 2003 BMW you fell in love with in Italy cannot be registered
                for general road use in Malta — it&apos;s Euro 4. The only path
                is vintage classification, and only if it&apos;s at least 30
                years old. Always check the model year and Euro standard before
                paying for the car or the shipping.
              </p>

              <h3>3. Assuming the UK route is still cheap post-Brexit</h3>
              <p>
                The UK has been treated as a third country since 1 January 2021.
                The EU-UK Trade and Cooperation Agreement gives zero customs
                duty for goods that meet UK Rules of Origin — but most used cars
                don&apos;t qualify because the manufacturing happened in
                Germany, Japan, Korea, etc. Used UK imports generally pay the
                full 10% duty + 18% VAT chain. A specialist customs broker can
                tell you in advance.
              </p>

              <h3>4. Importing a left-hand drive vehicle</h3>
              <p>
                Legal but inconvenient. Daily driving on a left-hand drive car
                in Malta means worse visibility for overtaking, awkward
                parking-booth access, and headlight beam patterns aimed for LHD
                traffic. The VRT examiner can ask for headlight aim adjustment
                before passing the vehicle.
              </p>

              <h3>5. Ignoring the diesel particulate surcharge</h3>
              <p>
                Diesel passenger cars carry a particulate-matter component that
                adds roughly 15% on top of the CO2 tax. Older diesels are also
                more likely to fail the VRT visual inspection on emission
                grounds. Modern petrol or hybrid drivetrains are often
                significantly cheaper to import even at the same price point.
              </p>

              <h3>6. Forgetting to look up the Registration Value</h3>
              <p>
                Many importers assume the tax is calculated on their purchase
                price. It isn&apos;t — Transport Malta uses its own valuation,
                which is usually lower than retail but doesn&apos;t track steep
                depreciation perfectly. If you have an unusual vehicle, file
                Form VEH 14 early so you have a documented number before paying
                the customs broker.
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
                <li>Vehicle photographs (front, rear, sides, VIN plate)</li>
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
                <li>Certificate of Conformity (CoC) if available</li>
                <li>Single Vehicle Approval if no CoC</li>
              </ul>

              <h3>For vintage imports (additionally)</h3>
              <ul>
                <li>FMVA Form VEH 15 application + supporting photographs</li>
                <li>Originality dossier (no modifications, period-correct)</li>
                <li>FIVA certificate (for vehicles 50+ years, optional)</li>
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
                All four examples are computed with our{" "}
                <Link
                  href="/calculators/import-vehicle"
                  className="text-primary underline"
                >
                  Malta import vehicle calculator
                </Link>{" "}
                using the SOPV-02 formula. Your exact figures will depend on the
                official Registration Value from the valuation portal.
              </p>

              <h3>Example 1 — Used VW Golf from Germany</h3>
              <p>
                3-year-old petrol Golf, €18,000, 130 g/km CO2, 4,280 mm length,
                shipping €300, from Germany (EU).
              </p>
              <div className="not-prose my-6 p-5 rounded-xl bg-muted/40 border border-border/50">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Vehicle + shipping</div>
                  <div className="text-right">€18,300</div>
                  <div>Customs duty / VAT</div>
                  <div className="text-right">€0 (EU)</div>
                  <div>Registration tax</div>
                  <div className="text-right">~€2,340</div>
                  <div>Standard fees (VRT + plates + reg)</div>
                  <div className="text-right">€121</div>
                  <div className="font-semibold pt-2 border-t border-border">
                    All-in on-road cost
                  </div>
                  <div className="font-semibold text-right pt-2 border-t border-border">
                    ~€20,760
                  </div>
                </div>
              </div>

              <h3>Example 2 — Used petrol hatchback from the UK</h3>
              <p>
                2-year-old Polo, €15,000, 120 g/km CO2, 4,074 mm, shipping
                €1,200, from UK (non-EU, no rules-of-origin qualification).
              </p>
              <div className="not-prose my-6 p-5 rounded-xl bg-muted/40 border border-border/50">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Vehicle + shipping</div>
                  <div className="text-right">€16,200</div>
                  <div>Customs duty (10% on CIF)</div>
                  <div className="text-right">€1,620</div>
                  <div>VAT (18% on CIF + duty)</div>
                  <div className="text-right">€3,208</div>
                  <div>Registration tax</div>
                  <div className="text-right">~€2,200</div>
                  <div>VAT on RegTax (non-EU 18%)</div>
                  <div className="text-right">~€396</div>
                  <div>Standard fees</div>
                  <div className="text-right">€121</div>
                  <div className="font-semibold pt-2 border-t border-border">
                    All-in on-road cost
                  </div>
                  <div className="font-semibold text-right pt-2 border-t border-border">
                    ~€23,745
                  </div>
                </div>
              </div>
              <p>
                This is why post-Brexit UK imports lost their old appeal: the
                duty + VAT chain adds nearly €5,000 to an otherwise cheap car.
              </p>

              <h3>Example 3 — 1994 Japanese diesel (vintage path)</h3>
              <p>
                32-year-old diesel from Japan, €8,400, 300 g/km CO2, 4,400 mm,
                shipping €2,500 (non-EU, vintage-eligible).
              </p>
              <div className="not-prose my-6 p-5 rounded-xl bg-muted/40 border border-border/50">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Vehicle + shipping</div>
                  <div className="text-right">€10,900</div>
                  <div>Customs duty (10% on CIF)</div>
                  <div className="text-right">€1,090</div>
                  <div>VAT (18% on CIF + duty)</div>
                  <div className="text-right">€2,158</div>
                  <div>RegTax (FMVA flat valuation)</div>
                  <div className="text-right">€100–€600</div>
                  <div>VAT on RegTax</div>
                  <div className="text-right">€18–€108</div>
                  <div>Vintage cert + plates + VRT + reg</div>
                  <div className="text-right">€311</div>
                  <div className="font-semibold pt-2 border-t border-border">
                    All-in on-road cost
                  </div>
                  <div className="font-semibold text-right pt-2 border-t border-border">
                    ~€14,600–€15,200
                  </div>
                </div>
              </div>
              <p>
                A 1994 diesel <strong>cannot be registered normally</strong> —
                only as a vintage classic with FMVA approval, and only if
                it&apos;s completely original.
              </p>

              <h3>Example 4 — New Tesla Model 3 with EV grant</h3>
              <p>
                Brand-new BEV from Germany (EU), €45,000, 0 g/km CO2, 4,720 mm,
                shipping €200, applying the €11,000 new-EV grant plus €2,000
                scrappage bonus.
              </p>
              <div className="not-prose my-6 p-5 rounded-xl bg-muted/40 border border-border/50">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Vehicle + shipping</div>
                  <div className="text-right">€45,200</div>
                  <div>Customs duty</div>
                  <div className="text-right">€0 (EU)</div>
                  <div>VAT (new vehicle, 18% on CIF)</div>
                  <div className="text-right">€8,136</div>
                  <div>Registration tax (BEV exempt)</div>
                  <div className="text-right">€0</div>
                  <div>Standard fees</div>
                  <div className="text-right">€121</div>
                  <div>Less: Transport Malta EV grant</div>
                  <div className="text-right">−€11,000</div>
                  <div>Less: scrappage bonus</div>
                  <div className="text-right">−€2,000</div>
                  <div className="font-semibold pt-2 border-t border-border">
                    All-in on-road cost
                  </div>
                  <div className="font-semibold text-right pt-2 border-t border-border">
                    ~€40,457
                  </div>
                </div>
              </div>
              <p>
                On top of the cash savings, the first five years of road tax are
                €0 — another ~€1,000 of ownership-cost savings versus an ICE
                equivalent.
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
                  <strong>FMVA Malta (vintage classification):</strong>{" "}
                  <a
                    href="https://www.fmvamalta.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    fmvamalta.org
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
