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
  Scale,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Users,
  Calculator,
} from "lucide-react";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

const ARTICLE_SOURCES = [
  {
    name: "Legal Notice 173 of 2026 — Equal Pay (Transparency and Reporting) Regulations, 2026",
    url: "https://legislation.mt/eli/ln/2026/173/eng",
  },
  {
    name: "Directive (EU) 2023/970 — EU Pay Transparency Directive",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023L0970",
  },
  {
    name: "Mamo TCV Advocates — The New Equal Pay Regulations 2026 Published",
    url: "https://www.mamotcv.com/insights/the-new-equal-pay-regulations-2026-published-implementing-the-eu-pay-transparency-directive-in-malta/",
  },
  {
    name: "Ius Laboris — Malta implements the Pay Transparency Directive",
    url: "https://iuslaboris.com/insights/malta-implements-the-pay-transparency-directive/",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Pay Transparency Rules 2026: New Law From 7 June",
  description:
    "Malta's Equal Pay Regulations (LN 173/2026) are in force from 7 June 2026. Salary ranges in job ads, no salary history questions, gender pay gap reports.",
  keywords: [
    "malta pay transparency",
    "pay transparency directive malta",
    "LN 173 2026 malta",
    "equal pay regulations malta",
    "salary range job ads malta",
    "salary history question malta",
    "gender pay gap reporting malta",
    "malta employment law 2026",
    "EU pay transparency directive 2023/970",
    "malta equal pay 2026",
  ],
  alternates: pageAlternates("/blog/malta-pay-transparency-rules-2026"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Pay Transparency Rules 2026: New Law From 7 June",
    url: `${SITE_URL}/blog/malta-pay-transparency-rules-2026`,
    type: "article",
    images: [getBlogOgImage("Malta Pay Transparency Rules 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Pay Transparency Rules 2026: New Law From 7 June",
  },
};

export default function MaltaPayTransparencyPage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Pay Transparency Rules 2026: New Law From 7 June"
        description="Malta's Equal Pay (Transparency and Reporting) Regulations 2026 — LN 173 of 2026 — are in force from 7 June 2026. What the new salary transparency rules mean for employees, job seekers and employers."
        slug="malta-pay-transparency-rules-2026"
        datePublished="2026-06-12"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Malta Pay Transparency Rules 2026",
            url: `${SITE_URL}/blog/malta-pay-transparency-rules-2026`,
          },
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "When did Malta's pay transparency rules come into force?",
            answer:
              "Malta's Equal Pay (Transparency and Reporting) Regulations 2026 were published as Legal Notice 173 of 2026 on 5 June 2026 and came into force on 7 June 2026, the EU-wide transposition deadline of Directive (EU) 2023/970. Malta was the fourth EU member state to implement the Directive, after Italy, Lithuania and Slovakia.",
          },
          {
            question: "Do job ads in Malta now have to show a salary range?",
            answer:
              "Job applicants in Malta now have a legal right to receive the initial pay or pay range for an advertised position, plus any relevant collective agreement provisions. This information must be provided in the vacancy notice or in good time before the interview, so candidates can negotiate from an informed position.",
          },
          {
            question:
              "Can a Malta employer still ask about my previous salary?",
            answer:
              "No. Since 7 June 2026, employers in Malta are prohibited from asking job applicants about their pay history in current or previous employment. This salary history ban applies during the entire recruitment process.",
          },
          {
            question:
              "Can I ask my employer how much my colleagues are paid in Malta?",
            answer:
              "You cannot demand a named colleague's exact salary, but you can request your own individual pay level and the average pay levels, broken down by sex, for categories of workers performing the same work as you or work of equal value. Pay secrecy clauses that stop you discussing your own pay for equal-pay purposes are no longer enforceable.",
          },
          {
            question: "Which Malta companies must report their gender pay gap?",
            answer:
              "Employers with 250 or more workers must report their gender pay gap annually, starting in 2027. Employers with 150 to 249 workers report every three years from 2027, and those with 100 to 149 workers report every three years starting in 2031. If a report shows an unjustified gap of 5% or more that is not remedied within six months, a joint pay assessment with workers' representatives is required.",
          },
          {
            question:
              "What happens if a Malta employer breaches the pay transparency rules?",
            answer:
              "In pay discrimination claims the burden of proof now shifts to the employer, who must show that no discrimination occurred. Workers can claim full compensation, including back pay and related bonuses or payments in kind. Non-compliance can also expose employers to financial liability and criminal sanctions under Maltese law.",
          },
        ]}
      />
      <main role="main" aria-label="Malta Pay Transparency Rules 2026">
        <Shell className="max-w-4xl py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <header className="mb-12 not-prose">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-semibold rounded-full">
                  Employment
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  June 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />9 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Pay Transparency Rules 2026: What the New Law Means for
                Your Salary
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                On <strong>7 June 2026</strong>, Malta&apos;s new{" "}
                <strong>
                  Equal Pay (Transparency and Reporting) Regulations
                </strong>{" "}
                (Legal Notice 173 of 2026) came into force, transposing the EU
                Pay Transparency Directive. Salary ranges in recruitment, a ban
                on salary history questions, new pay information rights and
                gender pay gap reporting — here is what employees, job seekers
                and employers in Malta need to know.
              </p>
            </header>

            <div className="not-prose mb-10 p-6 rounded-2xl bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-violet-500/10 border border-violet-500/20">
              <div className="flex gap-3">
                <AlertCircle className="h-6 w-6 text-violet-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-lg font-semibold mb-2">
                    Key dates at a glance
                  </h2>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      • <strong>5 June 2026</strong> — LN 173 of 2026 published
                      in the Government Gazette (No. 21,661)
                    </li>
                    <li>
                      • <strong>7 June 2026</strong> — regulations in force;
                      recruitment and pay information rights apply immediately
                    </li>
                    <li>
                      • <strong>2027</strong> — first gender pay gap reports due
                      from employers with 150+ workers
                    </li>
                    <li>
                      • <strong>2031</strong> — first reports due from employers
                      with 100–149 workers
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <nav className="p-6 bg-muted/30 rounded-2xl mb-12 not-prose">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#overview" className="text-primary hover:underline">
                    1. Overview: What Happened on 7 June 2026
                  </a>
                </li>
                <li>
                  <a
                    href="#job-seekers"
                    className="text-primary hover:underline"
                  >
                    2. New Rights for Job Seekers
                  </a>
                </li>
                <li>
                  <a href="#employees" className="text-primary hover:underline">
                    3. New Rights for Current Employees
                  </a>
                </li>
                <li>
                  <a href="#employers" className="text-primary hover:underline">
                    4. Employer Obligations by Company Size
                  </a>
                </li>
                <li>
                  <a href="#reporting" className="text-primary hover:underline">
                    5. Gender Pay Gap Reporting &amp; the 5% Rule
                  </a>
                </li>
                <li>
                  <a
                    href="#enforcement"
                    className="text-primary hover:underline"
                  >
                    6. Enforcement, Burden of Proof &amp; Penalties
                  </a>
                </li>
                <li>
                  <a href="#practice" className="text-primary hover:underline">
                    7. What to Do Now
                  </a>
                </li>
                <li>
                  <a href="#faqs" className="text-primary hover:underline">
                    8. FAQs
                  </a>
                </li>
              </ul>
            </nav>

            <section id="overview">
              <h2>1. Overview: What Happened on 7 June 2026</h2>
              <p>
                The <strong>EU Pay Transparency Directive</strong> (Directive
                (EU) 2023/970) required all member states to transpose its rules
                into national law by <strong>7 June 2026</strong>. Malta did so
                right on the deadline: the{" "}
                <strong>
                  Equal Pay (Transparency and Reporting) Regulations, 2026
                </strong>{" "}
                were published as <strong>Legal Notice 173 of 2026</strong> on 5
                June 2026 and entered into force two days later.
              </p>
              <p>
                Malta is the <strong>fourth EU member state</strong> to
                implement the Directive, after Italy, Lithuania and Slovakia.
                The goal is simple: close the gender pay gap by making pay
                structures visible — to candidates before they sign, to workers
                while they are employed, and to regulators through periodic
                reporting.
              </p>
              <p>
                The recruitment and information rights apply to{" "}
                <strong>all employers from day one</strong>. Documentation and
                reporting obligations scale with company size, with the heaviest
                duties on companies employing 100 or more workers.
              </p>
            </section>

            <section id="job-seekers" className="mt-12">
              <h2>2. New Rights for Job Seekers</h2>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    You now have the right to
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • See the <strong>initial pay or pay range</strong> for
                      the role — in the vacancy notice or before the interview
                    </li>
                    <li>
                      • Receive any relevant{" "}
                      <strong>collective agreement</strong> provisions on pay
                    </li>
                    <li>• Negotiate from an informed position</li>
                  </ul>
                </div>
                <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                  <XCircle className="h-8 w-8 text-rose-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    Employers can no longer
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Ask about your <strong>salary history</strong> in
                      current or previous jobs
                    </li>
                    <li>• Keep pay levels secret until the offer stage</li>
                    <li>• Base your offer on what you earned before</li>
                  </ul>
                </div>
              </div>

              <p>
                In practice, expect Maltese job adverts to start carrying salary
                brackets the way Irish and German ones increasingly do. If an
                advert does not state the pay, you are entitled to ask for it{" "}
                <strong>before the interview</strong> — and the employer must
                provide it. Wondering what a gross figure in an advert actually
                leaves in your pocket? Run it through our{" "}
                <Link href="/salary">Malta salary calculator</Link> or work
                backwards from your target take-home with the{" "}
                <Link href="/net-to-gross">net-to-gross calculator</Link>.
              </p>
            </section>

            <section id="employees" className="mt-12">
              <h2>3. New Rights for Current Employees</h2>
              <p>
                The regulations give every worker in Malta a{" "}
                <strong>right to pay information</strong>. You can request, in
                writing, and your employer must provide:
              </p>
              <ul>
                <li>
                  Your <strong>individual pay level</strong>; and
                </li>
                <li>
                  The <strong>average pay levels, broken down by sex</strong>,
                  for categories of workers performing the{" "}
                  <strong>same work</strong> as you or{" "}
                  <strong>work of equal value</strong>.
                </li>
              </ul>
              <p>
                Employers must inform workers annually of their right to request
                this information. Equally important is what disappears:{" "}
                <strong>pay secrecy clauses</strong>. Contract terms that
                prevent you from disclosing your own pay for the purpose of
                enforcing equal pay are no longer enforceable in Malta.
              </p>
              <p>
                Employers must also make the{" "}
                <strong>criteria used to set pay and pay progression</strong>{" "}
                accessible to their workers (see the size thresholds below).
                Those criteria must be{" "}
                <strong>objective and gender-neutral</strong>.
              </p>
            </section>

            <section id="employers" className="mt-12">
              <h2>4. Employer Obligations by Company Size</h2>

              <div className="not-prose my-8 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-semibold">
                        Company size
                      </th>
                      <th className="text-left p-3 font-semibold">
                        Key obligations
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium text-foreground">
                        All employers
                      </td>
                      <td className="p-3">
                        Pay range to applicants, salary history ban,
                        workers&apos; right to pay information, no pay secrecy
                        clauses
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium text-foreground">
                        25–49 workers
                      </td>
                      <td className="p-3">
                        Internally document the criteria used to determine pay
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium text-foreground">
                        50+ workers
                      </td>
                      <td className="p-3">
                        Written, accessible criteria for pay, pay levels and pay
                        progression
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium text-foreground">
                        100–149 workers
                      </td>
                      <td className="p-3">
                        Gender pay gap report every 3 years, starting 2031
                      </td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="p-3 font-medium text-foreground">
                        150–249 workers
                      </td>
                      <td className="p-3">
                        Gender pay gap report every 3 years, starting 2027
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-foreground">
                        250+ workers
                      </td>
                      <td className="p-3">
                        Gender pay gap report <strong>annually</strong>,
                        starting 2027
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Note that the recruitment-stage rules — pay ranges and the
                salary history ban — apply to{" "}
                <strong>every employer in Malta</strong> regardless of
                headcount, from the village grocer to the largest iGaming
                operator.
              </p>
            </section>

            <section id="reporting" className="mt-12">
              <h2>5. Gender Pay Gap Reporting &amp; the 5% Rule</h2>
              <p>
                Companies above the 100-worker threshold must compile a{" "}
                <strong>pay gap report</strong> showing the difference in
                average pay levels between female and male workers, including
                complementary and variable components such as bonuses.
              </p>
              <p>
                The teeth of the system is the <strong>5% rule</strong>: where a
                report reveals a gender pay gap of <strong>at least 5%</strong>{" "}
                in any category of workers that cannot be justified by
                objective, gender-neutral criteria, and the employer does not
                remedy it <strong>within six months</strong>, the employer must
                carry out a <strong>joint pay assessment</strong> in cooperation
                with workers&apos; representatives — a structured audit of pay
                levels, the proportion of men and women in each category, and
                the measures that will close the gap.
              </p>
            </section>

            <section id="enforcement" className="mt-12">
              <h2>6. Enforcement, Burden of Proof &amp; Penalties</h2>
              <p>
                Two changes make these rules considerably easier to enforce than
                previous equal-pay provisions:
              </p>
              <ul>
                <li>
                  <strong>Reversed burden of proof.</strong> In pay
                  discrimination claims, it is now for the{" "}
                  <strong>employer</strong> to prove that no discrimination
                  occurred — not for the worker to prove that it did. An
                  employer that failed to meet its transparency obligations will
                  find this especially difficult.
                </li>
                <li>
                  <strong>Full compensation.</strong> Workers who suffer pay
                  discrimination are entitled to compensation including{" "}
                  <strong>back pay</strong> and related bonuses or payments in
                  kind.
                </li>
              </ul>
              <p>
                Beyond civil claims, non-compliance can expose employers to{" "}
                <strong>financial liability and criminal sanctions</strong>{" "}
                under Maltese law.
              </p>
            </section>

            <section id="practice" className="mt-12">
              <h2>7. What to Do Now</h2>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
                <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <Users className="h-8 w-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    If you are an employee
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      • Exercise your right: request your pay level and the
                      sex-disaggregated averages for your category
                    </li>
                    <li>
                      • Benchmark offers — adverts must now show ranges, so
                      compare before you negotiate
                    </li>
                    <li>
                      • Check your payslip against the{" "}
                      <strong>2026 tax bands and COLA</strong> with our salary
                      tools
                    </li>
                  </ul>
                </div>
                <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                  <Scale className="h-8 w-8 text-amber-600 mb-3" />
                  <h3 className="font-semibold text-lg mb-2">
                    If you are an employer
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      • Add pay ranges to vacancy notices and strip salary
                      history questions from interview scripts
                    </li>
                    <li>
                      • Map workers into categories of equal-value work and
                      document objective pay criteria
                    </li>
                    <li>
                      • Run an internal pay audit before the first reporting
                      cycle in 2027
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mt-12">
              <h2>Related Tools &amp; Guides</h2>
              <ul>
                <li>
                  <Link href="/salary">Malta Salary Calculator</Link> — gross to
                  net with 2026 tax bands, SSC and COLA
                </li>
                <li>
                  <Link href="/net-to-gross">
                    Net to Gross Salary Calculator
                  </Link>{" "}
                  — work out the gross you should ask for in a negotiation
                </li>
                <li>
                  <Link href="/calculators/overtime">Overtime Calculator</Link>{" "}
                  — 1.5x and 2x rates for extra hours
                </li>
                <li>
                  <Link href="/blog/malta-minimum-wage-2026-guide">
                    Malta Minimum Wage 2026 Guide
                  </Link>
                </li>
                <li>
                  <Link href="/blog/malta-tax-rates-2026-complete-guide">
                    Malta Tax Rates 2026: Complete Guide
                  </Link>
                </li>
              </ul>
            </section>

            <section id="faqs" className="mt-12">
              <h2>8. Frequently Asked Questions</h2>

              <div className="space-y-4 not-prose my-8">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    When did Malta&apos;s pay transparency rules come into
                    force?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The Equal Pay (Transparency and Reporting) Regulations 2026
                    were published as <strong>LN 173 of 2026</strong> on 5 June
                    2026 and came into force on <strong>7 June 2026</strong>,
                    the EU transposition deadline. Malta was the fourth member
                    state to implement the Directive.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Do job ads in Malta now have to show a salary range?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Applicants have a legal right to the{" "}
                    <strong>initial pay or pay range</strong> of the position —
                    in the vacancy notice or in good time before the interview —
                    plus any relevant collective agreement provisions.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Can an employer still ask what I earned in my last job?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    No. Asking job applicants about their{" "}
                    <strong>pay history</strong> in current or former employment
                    is prohibited from 7 June 2026.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Can I find out what colleagues doing the same job are paid?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You can request your own pay level and the{" "}
                    <strong>average pay, broken down by sex</strong>, for
                    workers doing the same work or work of equal value. You
                    cannot demand a named individual&apos;s salary, but pay
                    secrecy clauses are no longer enforceable.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Which companies must publish a gender pay gap report?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    250+ workers: annually from 2027. 150–249 workers: every
                    three years from 2027. 100–149 workers: every three years
                    from 2031. Unjustified gaps of 5% or more that are not fixed
                    within six months trigger a joint pay assessment.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h4 className="font-semibold mb-2">
                    Does this apply to small businesses too?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The recruitment rules — pay ranges for applicants and the
                    salary history ban — apply to <strong>all employers</strong>
                    . Documentation duties start at 25 workers, written
                    pay-progression criteria at 50, and reporting at 100.
                  </p>
                </div>
              </div>
            </section>

            <div className="mt-16 p-8 bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-violet-500/10 rounded-3xl border border-violet-500/20 not-prose text-center">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-violet-600" />
              <h2 className="text-2xl font-cal font-bold mb-4">
                Negotiating with a salary range in hand?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Now that adverts must show pay ranges, turn any gross figure
                into your actual take-home — 2026 tax bands, SSC and COLA
                included.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/salary"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-violet-600 text-white font-semibold hover:bg-violet-700 transition-colors"
                >
                  Salary Calculator
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/net-to-gross"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-border bg-background text-foreground font-semibold hover:bg-muted/50 transition-colors"
                >
                  Net to Gross Calculator
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <BlogArticleAuthor
              datePublished="2026-06-12"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-pay-transparency-rules-2026"
              title="Malta Pay Transparency Rules 2026: New Law From 7 June"
            />
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
