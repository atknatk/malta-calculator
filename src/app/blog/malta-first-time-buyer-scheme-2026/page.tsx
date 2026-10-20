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
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Calculator,
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
  title:
    "Malta First-Time Buyer Scheme 2026: Stamp Duty & Benefits | Malta Calculator",
  description:
    "Malta first-time buyer scheme 2026: €200,000 stamp duty exemption, €10,000 grant (€20,000 with Disability Card), new second-time buyer grant, UCA incentives.",
  keywords: [
    "Malta first-time buyer",
    "Malta first property",
    "Malta stamp duty reduction",
    "Malta property grant",
    "Malta second-time buyer grant",
    "Malta disability card property grant",
    "Property Acquisition Grant Malta",
  ],
  alternates: pageAlternates("/blog/malta-first-time-buyer-scheme-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta First-Time Buyer Scheme 2026",
    url: `${SITE_URL}/blog/malta-first-time-buyer-scheme-2026`,
    type: "article",
    images: [getBlogOgImage("Malta First-Time Buyer Scheme 2026")],
  },
  twitter: { ...twitterMetadata, title: "Malta First-Time Buyer Scheme 2026" },
};

const LAST_UPDATED = "2026-10-20";

const ARTICLE_SOURCES = [
  {
    name: "Malta Tax and Customs Administration (MTCA) - First-Time Buyers",
    url: "https://mtca.gov.mt/personal-tax/property-taxes/general-information-on-duty",
  },
  {
    name: "Housing Authority - First-Time Buyer Scheme",
    url: "https://housingauthority.gov.mt/scheme/first-time-buyer-scheme/",
  },
  {
    name: "Housing Authority - Property Acquisition Grant Scheme terms (2026)",
    url: "https://housingauthority.gov.mt/wp-content/uploads/2026/08/FTB-E10K-Grant-ENG-2026.pdf",
  },
];

const FAQS = [
  {
    question: "How much stamp duty does a first-time buyer pay in Malta?",
    answer:
      "None on the first €200,000 of the price. Any amount above €200,000 is charged at the standard 5%, so a €300,000 home costs €5,000 in duty instead of €15,000. For qualifying UCA or long-vacant properties the exemption extends to the first €750,000.",
  },
  {
    question: "How much is the first-time buyer grant in Malta?",
    answer:
      "€10,000, paid by the Housing Authority as €1,000 a year for ten years, for a first home bought after 1 January 2022 with a bank loan. It is €20,000 (€2,000 a year) for a first-time buyer with an EU Disability Card, and €5,000 when a couple buys and the property is not the first home of one partner.",
  },
  {
    question: "Can second-time buyers get the grant?",
    answer:
      "Yes, since August 2026. If you previously owned a home but own no other residential property now, and you buy your sole primary residence after 1 January 2026 with a bank loan, you can claim up to €10,000 minus any grant you already received.",
  },
  {
    question: "When must I apply for the first-time buyer grant?",
    answer:
      "By 31 July of the year after you sign the deed — for example, by 31 July 2027 for a 2026 deed. Each year of late submission forfeits that year's payment. Payments are made every June into the account that repays your home loan.",
  },
];

export default function MaltaFirstTimeBuyerPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta First-Time Buyer Scheme 2026: Stamp Duty & Benefits"
        description="Complete guide to first-time property buyer benefits in Malta including reduced stamp duty."
        slug="malta-first-time-buyer-scheme-2026"
        datePublished="2026-01-01"
        dateModified={LAST_UPDATED}
        sources={ARTICLE_SOURCES}
      />
      <CustomFAQJsonLd questions={FAQS} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "First-Time Buyer",
            url: `${SITE_URL}/blog/malta-first-time-buyer-scheme-2026`,
          },
        ]}
      />
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
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 text-sm font-semibold rounded-full">
                  Property
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Updated{" "}
                  <time dateTime={LAST_UPDATED}>October 2026</time>
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 6 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta First-Time Buyer Scheme 2026
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Save thousands on your first home with Malta&apos;s stamp duty
                exemption, the Property Acquisition Grant and UCA incentives —
                now including second-time buyers and a higher grant for persons
                with disability.
              </p>
            </header>

            <section
              id="whats-new"
              className="not-prose p-6 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/20 mb-12"
            >
              <h2 className="text-xl font-semibold mb-3">
                What&apos;s New — August 2026
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • <strong className="text-foreground">€20,000 grant</strong>{" "}
                  (€2,000 a year) for first-time buyers holding a valid EU
                  Disability Card who buy after 1 January 2026.
                </li>
                <li>
                  •{" "}
                  <strong className="text-foreground">
                    Second-time buyers
                  </strong>{" "}
                  who own no other home can claim the grant for a sole primary
                  residence bought after 1 January 2026.
                </li>
                <li>
                  • Announced (not yet in the published terms): homes donated
                  after 2022 and completed with a bank loan would get €1,000 a
                  year for ten years — confirm with the Housing Authority.
                </li>
              </ul>
            </section>

            <section id="benefits">
              <h2>Key Benefits</h2>
              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Benefit
                      </th>
                      <th className="border border-border p-3 text-left">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-border p-3">
                        Stamp duty exemption
                      </td>
                      <td className="border border-border p-3">
                        <strong className="text-primary">
                          No duty on the first €200,000
                        </strong>
                        ; 5% on the rest. Made permanent in Budget 2026.
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Property Acquisition Grant
                      </td>
                      <td className="border border-border p-3">
                        €10,000 (€1,000 × 10 years) with a bank loan; €20,000
                        with an EU Disability Card
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        Couple, one partner owned before
                      </td>
                      <td className="border border-border p-3">
                        €5,000 grant (€10,000 with a Disability Card)
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Second-time buyers
                      </td>
                      <td className="border border-border p-3">
                        Up to €10,000 grant, minus any grant already received.
                        No €200,000 duty exemption.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3">
                        UCA / vacant 20+ years
                      </td>
                      <td className="border border-border p-3">
                        Duty exemption on the first €750,000, plus a €15,000
                        (Malta) or €30,000 (Gozo) grant for first-time buyers
                      </td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="border border-border p-3">
                        Deposit Assistance Scheme
                      </td>
                      <td className="border border-border p-3">
                        Help with the 10% deposit on homes up to €250,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="savings" className="mt-12">
              <h2>Savings Example</h2>
              <div className="p-6 bg-muted/30 rounded-xl not-prose">
                <h3 className="font-semibold mb-4">
                  €300,000 home bought with a bank loan
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    • Standard stamp duty (5% × €300,000):{" "}
                    <strong>€15,000</strong>
                  </li>
                  <li>
                    • First-time buyer duty (5% × €100,000):{" "}
                    <strong className="text-primary">€5,000</strong> — saving
                    €10,000
                  </li>
                  <li>
                    • Property Acquisition Grant:{" "}
                    <strong className="text-green-600">+€10,000</strong> over
                    ten years (€20,000 with a Disability Card)
                  </li>
                  <li>
                    • Total benefit:{" "}
                    <strong className="text-green-600">€20,000</strong>
                  </li>
                </ul>
              </div>
            </section>

            <section id="grant-rules" className="mt-12">
              <h2>How the Grant Is Paid</h2>
              <ul>
                <li>
                  The property must be bought with a{" "}
                  <strong>bank home loan</strong> and used only as your ordinary
                  residence.
                </li>
                <li>
                  Apply <strong>by 31 July of the year after the deed</strong>{" "}
                  (e.g. by 31 July 2027 for a 2026 deed). Each late year
                  forfeits that year&apos;s payment.
                </li>
                <li>
                  The Housing Authority pays once a year, in{" "}
                  <strong>June</strong>, into the account that repays your loan.
                  Couples need a joint account.
                </li>
                <li>
                  Payments stop if the loan is closed or the property is
                  transferred — you must tell the Housing Authority within two
                  weeks.
                </li>
                <li>
                  Second-time buyers must attach notary searches showing they
                  own no other residential property.
                </li>
              </ul>
            </section>

            <section id="eligibility" className="mt-12">
              <h2>Eligibility Requirements</h2>
              <ul>
                <li>
                  First-time buyer: you have not owned residential property
                  before (as defined in S.L. 364.12)
                </li>
                <li>
                  Second-time buyer: you owned a home before but own none now,
                  and the contract is dated after 1 January 2026
                </li>
                <li>
                  Property must be your <strong>sole ordinary residence</strong>
                </li>
                <li>Applicants must be over 18 and Maltese or EU citizens</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                Second-time buyers may still qualify for other duty reliefs on a
                sole ordinary residence. Check the current rates with your
                notary or the MTCA before signing.
              </p>
            </section>

            <BlogArticleAuthor
              datePublished="2026-01-01"
              dateModified={LAST_UPDATED}
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-first-time-buyer-scheme-2026"
              title="Malta First-Time Buyer Scheme 2026"
              ctaTitle="Calculate Your Savings"
              ctaLink="/calculators/first-time-buyer"
              ctaLinkText="Try First-Time Buyer Calculator"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
