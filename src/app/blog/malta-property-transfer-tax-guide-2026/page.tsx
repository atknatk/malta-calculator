import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  getBlogOgImage,
} from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Calculator,
  AlertTriangle,
  CheckCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Property Transfer Tax Guide 2026 | Malta Calculator",
  description:
    "Complete guide to Malta property transfer tax 2026. Stamp duty rates (5%, 3.5%), notarial fees, capital gains tax, and all costs when buying property in Malta.",
  keywords: [
    "malta property transfer tax",
    "property transfer tax malta",
    "malta stamp duty",
    "malta notarial fees",
    "malta property buying costs",
    "duty on documents malta",
    "malta immovable property tax",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-property-transfer-tax-guide-2026`,
  },
  openGraph: {
    ...ogMetadata,
    title: "Malta Property Transfer Tax Guide 2026",
    url: `${SITE_URL}/blog/malta-property-transfer-tax-guide-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Property Transfer Tax Guide 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Property Transfer Tax Guide 2026",
  },
};

const ARTICLE_SOURCES = [
  {
    name: "Malta Commissioner for Revenue (CFR) - Duty on Documents",
    url: "https://cfr.gov.mt/en/inlandrevenue/Pages/Duty-on-Documents-and-Transfers.aspx",
  },
  {
    name: "Malta Tax Compliance Authority (MTCA)",
    url: "https://mtca.gov.mt",
  },
];

export default function MaltaPropertyTransferTaxGuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Property Transfer Tax Guide 2026"
        description="Complete guide to all taxes and fees involved in property transfers in Malta."
        slug="malta-property-transfer-tax-guide-2026"
        datePublished="2026-02-16"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Property Transfer Tax Guide",
            url: `${SITE_URL}/blog/malta-property-transfer-tax-guide-2026`,
          },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What is the property transfer tax rate in Malta for 2026?",
            answer:
              "The standard property transfer tax (stamp duty) rate in Malta is 5% of the property value or market value, whichever is higher. First-time buyers get a reduced rate of 3.5% and may be exempt on the first €200,000. The 5% is paid in two stages: 1% within 21 days of signing the preliminary agreement (Konvenju) and 4% upon final deed transfer.",
          },
          {
            question: "What are notarial fees for property transfer in Malta?",
            answer:
              "Notarial fees in Malta typically range from 1-2% of the property value, averaging around €1,500-€3,000 for standard residential properties. The exact fee depends on the complexity of the transaction, property value, and negotiations with the notary. These fees cover the preparation and registration of the deed of sale.",
          },
          {
            question:
              "Do first-time buyers pay less property transfer tax in Malta?",
            answer:
              "Yes, first-time buyers in Malta receive significant benefits: they are exempt from stamp duty on the first €200,000 of property value, and pay a reduced rate of 3.5% (instead of 5%) on any amount exceeding €200,000. To qualify, you must not have previously owned property in Malta or Gozo, and the property must be your primary residence.",
          },
          {
            question: "What is capital gains tax on property sales in Malta?",
            answer:
              "Malta applies an 8% final withholding tax on the selling price of property. This is not a tax on the profit but on the full transfer value, and it is typically deducted by the notary at the time of sale. Alternatively, sellers can elect to be taxed on the actual gain at progressive income tax rates (12%-35%). The seller is responsible for this tax, not the buyer.",
          },
          {
            question:
              "What additional costs are involved in Malta property transfers?",
            answer:
              "Beyond stamp duty and notarial fees, Malta property transfers involve: architect/surveyor fees (€500-€1,500), bank valuation fees (€200-€400), legal fees (€500-€1,500), mortgage arrangement fees (0.5-1%), registration fees at the Land Registry, and utility connection/transfer fees. Total additional costs typically range from 7-10% of the property value.",
          },
        ]}
      />
      <main role="main" aria-label="Malta Property Transfer Tax Guide">
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
                <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 text-sm font-semibold rounded-full">
                  Tax Guide
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> February 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 10 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Property Transfer Tax Guide 2026
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Complete breakdown of all taxes, fees, and costs involved when
                transferring property ownership in Malta.
              </p>
            </header>

            {/* Table of Contents */}
            <nav className="p-6 bg-muted/30 rounded-xl not-prose mb-12">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#overview"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    Overview of Property Transfer Costs
                  </a>
                </li>
                <li>
                  <a
                    href="#stamp-duty"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    Stamp Duty (Duty on Documents)
                  </a>
                </li>
                <li>
                  <a
                    href="#first-time-buyer"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    First-Time Buyer Benefits
                  </a>
                </li>
                <li>
                  <a
                    href="#notarial-fees"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    Notarial Fees
                  </a>
                </li>
                <li>
                  <a
                    href="#capital-gains"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    Capital Gains Tax (Seller)
                  </a>
                </li>
                <li>
                  <a
                    href="#additional-costs"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    Additional Transfer Costs
                  </a>
                </li>
                <li>
                  <a
                    href="#payment-timeline"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    Payment Timeline
                  </a>
                </li>
                <li>
                  <a
                    href="#example-calculation"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    Example: €300,000 Property
                  </a>
                </li>
                <li>
                  <a
                    href="#exemptions"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    Exemptions & Special Cases
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    <ArrowRight className="h-3 w-3" />
                    Frequently Asked Questions
                  </a>
                </li>
              </ul>
            </nav>

            <section id="overview">
              <h2>Overview of Property Transfer Costs in Malta</h2>
              <p>
                When buying or selling property in Malta, you need to account
                for multiple taxes and fees beyond the purchase price. The main
                costs include:
              </p>
              <ul>
                <li>
                  <strong>Stamp Duty</strong> (5% standard, 3.5% first-time
                  buyers)
                </li>
                <li>
                  <strong>Notarial Fees</strong> (1-2% of property value)
                </li>
                <li>
                  <strong>Capital Gains Tax</strong> (8%, paid by seller)
                </li>
                <li>
                  <strong>Additional Costs</strong> (architect, legal, bank
                  fees)
                </li>
              </ul>
              <div className="p-6 bg-amber-500/10 rounded-xl not-prose my-6 border border-amber-500/20">
                <AlertTriangle className="h-8 w-8 text-amber-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  Budget for 7-10% Extra
                </h3>
                <p className="text-muted-foreground">
                  As a rule of thumb, buyers should budget an additional{" "}
                  <strong>7-10% of the property value</strong> to cover all
                  transfer costs, fees, and taxes.
                </p>
              </div>
            </section>

            <section id="stamp-duty" className="mt-12">
              <h2>Stamp Duty (Duty on Documents)</h2>
              <p>
                Stamp duty is the primary tax on property transfers in Malta. It
                is calculated on the property&apos;s purchase price or market
                value, whichever is higher. This ensures the government receives
                fair tax revenue even if properties are sold below market value.
              </p>

              <h3>Stamp Duty Rates 2026</h3>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Buyer Type
                      </th>
                      <th className="border border-border p-3 text-right">
                        Rate
                      </th>
                      <th className="border border-border p-3 text-left">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Standard Buyers
                      </td>
                      <td className="border border-border p-3 text-right font-semibold text-primary">
                        5%
                      </td>
                      <td className="border border-border p-3 text-sm text-muted-foreground">
                        Full property value
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        First-Time Buyers
                      </td>
                      <td className="border border-border p-3 text-right font-semibold text-green-600">
                        3.5%
                      </td>
                      <td className="border border-border p-3 text-sm text-muted-foreground">
                        Reduced rate + exemption on first €200k
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Gozo Property
                      </td>
                      <td className="border border-border p-3 text-right font-semibold">
                        3%
                      </td>
                      <td className="border border-border p-3 text-sm text-muted-foreground">
                        2% reduction for Gozo properties
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Heritage Buildings (UCA)
                      </td>
                      <td className="border border-border p-3 text-right font-semibold">
                        2.5%
                      </td>
                      <td className="border border-border p-3 text-sm text-muted-foreground">
                        Urban Conservation Areas
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3>Two-Stage Payment Structure</h3>
              <p>
                The 5% stamp duty is paid in two installments to align with the
                property transfer process:
              </p>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                  <div className="text-4xl font-bold text-primary mb-2">1%</div>
                  <h4 className="font-semibold mb-2">First Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    Due within <strong>21 days</strong> of signing the Promise
                    of Sale (Konvenju) agreement.
                  </p>
                </div>
                <div className="p-6 bg-secondary/5 rounded-xl border border-secondary/20">
                  <div className="text-4xl font-bold text-secondary mb-2">
                    4%
                  </div>
                  <h4 className="font-semibold mb-2">Final Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    Due upon <strong>final deed transfer</strong> at the
                    notary&apos;s office.
                  </p>
                </div>
              </div>

              <div className="p-6 bg-blue-500/10 rounded-xl not-prose my-6 border border-blue-500/20">
                <FileText className="h-8 w-8 text-blue-500 mb-4" />
                <h4 className="font-semibold text-lg mb-2">
                  Source: Duty on Documents and Transfers Act
                </h4>
                <p className="text-sm text-muted-foreground">
                  Stamp duty rates are regulated by Malta&apos;s Duty on
                  Documents and Transfers Act (Chapter 364 of the Laws of
                  Malta). See the{" "}
                  <a
                    href="https://legislation.mt/eli/cap/364/eng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    official legislation
                  </a>{" "}
                  for the full legal text.
                </p>
              </div>
            </section>

            <section id="first-time-buyer" className="mt-12">
              <h2>First-Time Buyer Benefits</h2>
              <div className="p-6 bg-green-500/10 rounded-xl not-prose my-6 border border-green-500/20">
                <CheckCircle className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  Major Savings Available
                </h3>
                <p className="text-muted-foreground">
                  First-time buyers can save thousands through stamp duty
                  exemptions and reduced rates. This is one of Malta&apos;s most
                  significant property incentives.
                </p>
              </div>

              <h3>First-Time Buyer Rates</h3>
              <ul>
                <li>
                  <strong>€0-€200,000:</strong> <strong>0% stamp duty</strong>{" "}
                  (fully exempt)
                </li>
                <li>
                  <strong>Above €200,000:</strong>{" "}
                  <strong>3.5% on excess amount</strong>
                </li>
              </ul>

              <h3>Eligibility Requirements</h3>
              <p>To qualify as a first-time buyer in Malta:</p>
              <ul>
                <li>
                  You must not have previously owned immovable property in Malta
                  or Gozo
                </li>
                <li>
                  The property must be your <strong>primary residence</strong>{" "}
                  (sole ordinary residence)
                </li>
                <li>
                  You must reside in the property for a minimum period
                  (typically 3 years)
                </li>
                <li>
                  Property value typically under €200,000 for full exemption
                </li>
              </ul>

              <h3>Savings Calculation Example</h3>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Property Value
                      </th>
                      <th className="border border-border p-3 text-right">
                        Standard (5%)
                      </th>
                      <th className="border border-border p-3 text-right">
                        First-Time (3.5%)
                      </th>
                      <th className="border border-border p-3 text-right">
                        Savings
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">€150,000</td>
                      <td className="border border-border p-3 text-right">
                        €7,500
                      </td>
                      <td className="border border-border p-3 text-right font-semibold text-green-600">
                        €0
                      </td>
                      <td className="border border-border p-3 text-right font-bold text-green-600">
                        €7,500
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">€250,000</td>
                      <td className="border border-border p-3 text-right">
                        €12,500
                      </td>
                      <td className="border border-border p-3 text-right font-semibold text-green-600">
                        €1,750
                      </td>
                      <td className="border border-border p-3 text-right font-bold text-green-600">
                        €10,750
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">€350,000</td>
                      <td className="border border-border p-3 text-right">
                        €17,500
                      </td>
                      <td className="border border-border p-3 text-right font-semibold text-green-600">
                        €5,250
                      </td>
                      <td className="border border-border p-3 text-right font-bold text-green-600">
                        €12,250
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground">
                *First-time buyer calculation: 3.5% × (Property Value -
                €200,000)
              </p>
            </section>

            <section id="notarial-fees" className="mt-12">
              <h2>Notarial Fees</h2>
              <p>
                A notary public is required for all property transfers in Malta.
                The notary prepares the deed of sale (konvenju), verifies all
                legal requirements, and registers the transfer with the Land
                Registry.
              </p>

              <h3>Typical Notarial Fee Structure</h3>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Property Value
                      </th>
                      <th className="border border-border p-3 text-right">
                        Typical Fee Range
                      </th>
                      <th className="border border-border p-3 text-right">
                        % of Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Up to €200,000
                      </td>
                      <td className="border border-border p-3 text-right">
                        €1,500 - €2,500
                      </td>
                      <td className="border border-border p-3 text-right">
                        ~1-1.5%
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        €200,000 - €400,000
                      </td>
                      <td className="border border-border p-3 text-right">
                        €2,500 - €4,000
                      </td>
                      <td className="border border-border p-3 text-right">
                        ~1-1.5%
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Above €400,000
                      </td>
                      <td className="border border-border p-3 text-right">
                        €4,000+
                      </td>
                      <td className="border border-border p-3 text-right">
                        ~1-2%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                <strong>Note:</strong> Notarial fees are negotiable and can vary
                between notaries. It&apos;s advisable to request quotes from
                multiple notaries before proceeding.
              </p>

              <h3>What Notarial Fees Cover</h3>
              <ul>
                <li>Preparation of the Promise of Sale (Konvenju)</li>
                <li>Preparation of the Final Deed of Sale</li>
                <li>
                  Title verification and due diligence (checking for
                  encumbrances)
                </li>
                <li>Registration with the Malta Land Registry</li>
                <li>Payment of stamp duty on your behalf</li>
                <li>Coordination with banks for mortgage documentation</li>
              </ul>
            </section>

            <section id="capital-gains" className="mt-12">
              <h2>Capital Gains Tax (Seller&apos;s Responsibility)</h2>
              <p>
                While buyers pay stamp duty, sellers must pay capital gains tax
                on property sales. Malta offers two options: an{" "}
                <strong>8% final withholding tax</strong> on the selling price,
                or taxation on the actual gain at progressive income tax rates.
                Most sellers opt for the 8% final withholding tax for
                simplicity.
              </p>

              <h3>Capital Gains Tax Details</h3>
              <ul>
                <li>
                  <strong>Rate:</strong> 8% final withholding tax on the selling
                  price (not the profit)
                </li>
                <li>
                  <strong>Alternative:</strong> Sellers may elect to be taxed on
                  the actual gain at progressive rates (12%-35%)
                </li>
                <li>
                  <strong>Who Pays:</strong> Seller (not buyer)
                </li>
                <li>
                  <strong>Collection:</strong> Deducted by notary at time of
                  sale
                </li>
              </ul>

              <div className="p-6 bg-muted/30 rounded-xl not-prose my-6">
                <h4 className="font-semibold mb-2">
                  Example: Selling a €300,000 Property
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Sale Price: <strong>€300,000</strong>
                  </li>
                  <li>
                    • Final Withholding Tax (8% of selling price):{" "}
                    <strong>€24,000</strong>
                  </li>
                  <li>
                    • Net to Seller: <strong>€276,000</strong> (minus other
                    costs)
                  </li>
                </ul>
              </div>

              <p>
                <strong>Important:</strong> The 8% final withholding tax is
                calculated on the full selling price, not on the profit. It is a
                final tax, meaning no further tax is due on the sale proceeds.
                This is governed by{" "}
                <a
                  href="https://legislation.mt/eli/cap/123/eng"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  the Income Tax Act (Chapter 123)
                </a>
                .
              </p>
            </section>

            <section id="additional-costs" className="mt-12">
              <h2>Additional Transfer Costs</h2>
              <p>
                Beyond stamp duty and notarial fees, buyers should budget for
                these additional expenses:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Cost Item
                      </th>
                      <th className="border border-border p-3 text-right">
                        Typical Range
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Architect/Surveyor Fees
                      </td>
                      <td className="border border-border p-3 text-right">
                        €500 - €1,500
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Bank Valuation Fee
                      </td>
                      <td className="border border-border p-3 text-right">
                        €200 - €400
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">Legal Fees</td>
                      <td className="border border-border p-3 text-right">
                        €500 - €1,500
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Mortgage Arrangement Fee
                      </td>
                      <td className="border border-border p-3 text-right">
                        0.5 - 1% of loan
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Land Registry Fees
                      </td>
                      <td className="border border-border p-3 text-right">
                        €100 - €300
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Utility Connection/Transfer
                      </td>
                      <td className="border border-border p-3 text-right">
                        €200 - €500
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        AIP Permit (Non-EU, if needed)
                      </td>
                      <td className="border border-border p-3 text-right">
                        €233
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="payment-timeline" className="mt-12">
              <h2>Payment Timeline</h2>
              <p>
                Understanding when each payment is due helps with financial
                planning:
              </p>

              <div className="space-y-4 my-8 not-prose">
                <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">
                        Promise of Sale (Konvenju)
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• 10% deposit to seller</li>
                        <li>• 1% stamp duty (within 21 days)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">
                        Between Konvenju and Final Deed
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Architect/surveyor inspection</li>
                        <li>• Bank valuation</li>
                        <li>• Mortgage approval</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">
                        Final Deed Transfer
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Remaining 90% of purchase price</li>
                        <li>• 4% stamp duty (final payment)</li>
                        <li>• Notarial fees</li>
                        <li>• All additional costs</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="example-calculation" className="mt-12">
              <h2>Complete Example: €300,000 Property Purchase</h2>
              <p>
                Let&apos;s calculate the total costs for a standard buyer
                purchasing a €300,000 property:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Cost Item
                      </th>
                      <th className="border border-border p-3 text-right">
                        Calculation
                      </th>
                      <th className="border border-border p-3 text-right">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3 font-semibold">
                        Property Price
                      </td>
                      <td className="border border-border p-3 text-right">-</td>
                      <td className="border border-border p-3 text-right font-semibold">
                        €300,000
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Stamp Duty</td>
                      <td className="border border-border p-3 text-right text-sm">
                        5% × €300,000
                      </td>
                      <td className="border border-border p-3 text-right">
                        €15,000
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Notarial Fees
                      </td>
                      <td className="border border-border p-3 text-right text-sm">
                        ~1.2% × €300,000
                      </td>
                      <td className="border border-border p-3 text-right">
                        €3,600
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Architect/Surveyor
                      </td>
                      <td className="border border-border p-3 text-right">-</td>
                      <td className="border border-border p-3 text-right">
                        €1,000
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Bank Valuation
                      </td>
                      <td className="border border-border p-3 text-right">-</td>
                      <td className="border border-border p-3 text-right">
                        €300
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Legal Fees</td>
                      <td className="border border-border p-3 text-right">-</td>
                      <td className="border border-border p-3 text-right">
                        €1,000
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Mortgage Arrangement
                      </td>
                      <td className="border border-border p-3 text-right text-sm">
                        0.7% × €270,000
                      </td>
                      <td className="border border-border p-3 text-right">
                        €1,890
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">Other Costs</td>
                      <td className="border border-border p-3 text-right">-</td>
                      <td className="border border-border p-3 text-right">
                        €600
                      </td>
                    </tr>
                    <tr className="bg-primary/10">
                      <td className="border border-border p-3 font-bold">
                        TOTAL COST
                      </td>
                      <td className="border border-border p-3 text-right">-</td>
                      <td className="border border-border p-3 text-right font-bold text-primary text-lg">
                        €323,390
                      </td>
                    </tr>
                    <tr className="bg-muted">
                      <td className="border border-border p-3 font-semibold">
                        Additional Costs
                      </td>
                      <td className="border border-border p-3 text-right text-sm">
                        (Total - Price)
                      </td>
                      <td className="border border-border p-3 text-right font-semibold">
                        €23,390 (7.8%)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground">
                *Assumes 10% deposit (€30,000) and 90% mortgage (€270,000)
              </p>

              <h3 className="mt-8">First-Time Buyer Comparison</h3>
              <p>
                If the same buyer qualified as a first-time buyer, their costs
                would be:
              </p>
              <div className="p-6 bg-green-500/10 rounded-xl not-prose my-6 border border-green-500/20">
                <ul className="space-y-2 text-sm">
                  <li>
                    • Stamp Duty: <strong>€3,500</strong> (3.5% on €100k over
                    €200k exemption)
                  </li>
                  <li>
                    • Total Cost: <strong>€311,890</strong>
                  </li>
                  <li>
                    •{" "}
                    <strong className="text-green-600">Savings: €11,500</strong>
                  </li>
                </ul>
              </div>
            </section>

            <section id="exemptions" className="mt-12">
              <h2>Exemptions & Special Cases</h2>

              <h3>Gozo Property Discount</h3>
              <p>
                Properties located in Gozo benefit from a{" "}
                <strong>2% reduction</strong> in stamp duty (3% instead of 5%).
                This incentive aims to promote development and population growth
                in Malta&apos;s sister island.
              </p>

              <h3>Urban Conservation Areas (UCA)</h3>
              <p>
                Heritage buildings within designated Urban Conservation Areas
                qualify for a reduced stamp duty rate of <strong>2.5%</strong>{" "}
                to encourage restoration and preservation of historical
                properties.
              </p>

              <h3>Property Inheritance</h3>
              <p>
                Inherited property is subject to a different duty structure:
              </p>
              <ul>
                <li>
                  <strong>Spouse & descendants:</strong> 5% on amounts over
                  €250,000
                </li>
                <li>
                  <strong>Ascendants:</strong> 5% on amounts over €250,000
                </li>
                <li>
                  <strong>Other relatives:</strong> 7% on amounts over €12,000
                </li>
              </ul>

              <h3>Property Gifts (Donation)</h3>
              <p>
                Property transfers by donation (gift) are subject to duty on
                documents at rates similar to inheritance, depending on the
                relationship between donor and recipient.
              </p>
            </section>

            <section id="faq" className="mt-12">
              <h2>Frequently Asked Questions</h2>

              <div className="space-y-6 mt-6">
                <div>
                  <h3>
                    What is the property transfer tax rate in Malta for 2026?
                  </h3>
                  <p>
                    The standard property transfer tax (stamp duty) rate in
                    Malta is 5% of the property value or market value, whichever
                    is higher. First-time buyers get a reduced rate of 3.5% and
                    may be exempt on the first €200,000. The 5% is paid in two
                    stages: 1% within 21 days of signing the preliminary
                    agreement (Konvenju) and 4% upon final deed transfer.
                  </p>
                </div>

                <div>
                  <h3>
                    What are notarial fees for property transfer in Malta?
                  </h3>
                  <p>
                    Notarial fees in Malta typically range from 1-2% of the
                    property value, averaging around €1,500-€3,000 for standard
                    residential properties. The exact fee depends on the
                    complexity of the transaction, property value, and
                    negotiations with the notary. These fees cover the
                    preparation and registration of the deed of sale.
                  </p>
                </div>

                <div>
                  <h3>
                    Do first-time buyers pay less property transfer tax in
                    Malta?
                  </h3>
                  <p>
                    Yes, first-time buyers in Malta receive significant
                    benefits: they are exempt from stamp duty on the first
                    €200,000 of property value, and pay a reduced rate of 3.5%
                    (instead of 5%) on any amount exceeding €200,000. To
                    qualify, you must not have previously owned property in
                    Malta or Gozo, and the property must be your primary
                    residence.
                  </p>
                </div>

                <div>
                  <h3>What is capital gains tax on property sales in Malta?</h3>
                  <p>
                    Malta applies an 8% final withholding tax on the full
                    selling price of property. This is not a tax on the profit
                    but on the transfer value, and it is typically deducted by
                    the notary at the time of sale. Alternatively, sellers can
                    elect to be taxed on the actual gain at progressive income
                    tax rates (12%-35%). The seller is responsible for this tax,
                    not the buyer.
                  </p>
                </div>

                <div>
                  <h3>
                    What additional costs are involved in Malta property
                    transfers?
                  </h3>
                  <p>
                    Beyond stamp duty and notarial fees, Malta property
                    transfers involve: architect/surveyor fees (€500-€1,500),
                    bank valuation fees (€200-€400), legal fees (€500-€1,500),
                    mortgage arrangement fees (0.5-1%), registration fees at the
                    Land Registry, and utility connection/transfer fees. Total
                    additional costs typically range from 7-10% of the property
                    value.
                  </p>
                </div>
              </div>
            </section>

            {/* Related Guides */}
            <section className="mt-16 not-prose">
              <h2 className="text-2xl font-cal font-bold mb-6">
                Related Guides
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Link
                  href="/blog/malta-stamp-duty-complete-guide-2026"
                  className="p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-semibold mb-2">
                    Malta Stamp Duty Complete Guide
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    In-depth guide to stamp duty rates and calculations
                  </p>
                </Link>
                <Link
                  href="/blog/malta-first-time-buyer-scheme-2026"
                  className="p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-semibold mb-2">
                    First-Time Buyer Scheme 2026
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    How to save thousands with first-time buyer benefits
                  </p>
                </Link>
                <Link
                  href="/blog/malta-expat-mortgage-guide-2026"
                  className="p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-semibold mb-2">
                    Malta Expat Mortgage Guide
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    AIP permit, residency rules, and stamp duty for expats
                  </p>
                </Link>
                <Link
                  href="/blog/malta-mortgage-guide-2026"
                  className="p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-semibold mb-2">
                    Malta Mortgage Guide 2026
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Home loan essentials, LTV ratios, and monthly payments
                  </p>
                </Link>
              </div>
            </section>

            {/* Official Sources */}
            <section className="mt-16 not-prose">
              <h2 className="text-2xl font-cal font-bold mb-6">
                Official Sources & References
              </h2>
              <div className="space-y-3">
                <a
                  href="https://legislation.mt/eli/cap/364/eng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors text-sm"
                >
                  <ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-semibold">
                      Duty on Documents and Transfers Act (Cap. 364)
                    </span>
                    <span className="text-muted-foreground ml-2">
                      - legislation.mt
                    </span>
                  </div>
                </a>
                <a
                  href="https://legislation.mt/eli/cap/123/eng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors text-sm"
                >
                  <ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-semibold">
                      Income Tax Act (Cap. 123) - Capital Gains Rules
                    </span>
                    <span className="text-muted-foreground ml-2">
                      - legislation.mt
                    </span>
                  </div>
                </a>
                <a
                  href="https://cfr.gov.mt/en/inlandrevenue/Pages/Duty-on-Documents-and-Transfers.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors text-sm"
                >
                  <ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-semibold">
                      Commissioner for Revenue - Duty on Documents
                    </span>
                    <span className="text-muted-foreground ml-2">
                      - cfr.gov.mt
                    </span>
                  </div>
                </a>
                <a
                  href="https://cfr.gov.mt/en/inlandrevenue/Pages/Property-Transfers.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/50 transition-colors text-sm"
                >
                  <ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <span className="font-semibold">
                      Commissioner for Revenue - Property Transfers
                    </span>
                    <span className="text-muted-foreground ml-2">
                      - cfr.gov.mt
                    </span>
                  </div>
                </a>
              </div>
            </section>

            {/* CTA Box */}
            <BlogArticleAuthor
              datePublished="2026-02-16"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-property-transfer-tax-guide-2026"
              title="Malta Property Transfer Tax Guide 2026"
              ctaTitle="Calculate Your Property Transfer Costs"
              ctaDescription="Use our free stamp duty calculator to estimate all costs involved in your property purchase."
              ctaLink="/calculators/stamp-duty"
              ctaLinkText="Try Stamp Duty Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
