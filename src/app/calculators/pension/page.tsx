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
  getDynamicOgImage,
} from "@/app/shared-metadata";
import { PensionCalculator } from "./_components/pension-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
  HowToJsonLd,
} from "@/components/json-ld";
import { Budget2027Update } from "@/app/blog/_shared/budget-2027-update";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Pension Calculator 2026 | Malta Calculator",
  description:
    "Estimate your Malta Two-Thirds state pension for 2026. MPI €29,083 cap, child credits, deferral bonus and LN 53/2026 100% pension income tax exemption.",
  keywords: [
    "malta pension calculator",
    "malta state pension 2026",
    "two thirds pension malta",
    "malta pension formula",
    "malta pension tax exemption",
    "private pension malta",
    "maximum pensionable income malta",
    "ln 53 2026 pension",
    "malta deferral bonus pension",
  ],
  alternates: pageAlternates("/calculators/pension"),
  openGraph: {
    ...ogMetadata,
    title: "Malta Pension Calculator 2026 | Malta Calculator",
    url: `${SITE_URL}/calculators/pension`,
    images: [getDynamicOgImage("Malta Pension Calculator 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Pension Calculator 2026 | Malta Calculator",
    images: [getDynamicOgImage("Malta Pension Calculator 2026")],
  },
};

export default function PensionPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Pension Calculator",
            url: `${SITE_URL}/calculators/pension`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Malta Pension Calculator 2026"
        description="Estimate your Malta state pension using the Two-Thirds formula. Includes child credits, deferral bonus, private pension tax credit and LN 53/2026 income-tax exemption."
        slug="pension"
        category="Retirement Calculator"
        features={[
          "Two-thirds pension formula (annual = pensionable income × 2/3 × proportion)",
          "Maximum Pensionable Income cap €29,083 (2026)",
          "Child credits — 4 years per child for the first 3 (post-1962), 2 from the 4th",
          "Deferral bonus schedule: +6.5% / +13.5% / +21% / +29% for 1–4 year deferral",
          "LN 53/2026 — 100% pension income tax exemption up to €37,104/year",
          "2026 pension increase for pensions in payment: €10/week (€4.66 COLA + €5.34)",
          "Private pension tax credit — 25% of contributions, capped at €750/year",
          "Birth-year contribution requirement (30 / 35 / 40 / 41 / 42 years)",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is the maximum Malta state pension in 2026?",
            answer:
              "The maximum Two-Thirds Pension in 2026 is approximately €19,389/year (roughly €373/week). This is two-thirds of the Maximum Pensionable Income (MPI) of €29,083.36 for those born in 1962 or later. For those born before 1962 the 2026 MPI is €25,500, so the maximum is about €17,000/year (€327/week). Pensions already in payment rose by €10/week in 2026 (€4.66 COLA plus €5.34), and further increases are set in each year's Budget.",
          },
          {
            question:
              "How many SSC contribution years are needed for a full Malta pension?",
            answer:
              "It depends on your birth year. Born before 1952: 30 years. Born 1952–1961: 35 years. Born 1962–1968: 40 years. Born 1969–1975: 41 years. Born 1976 onwards: 42 years. The minimum to qualify for any pension is 10 years (520 weeks) of paid contributions; those born from 1962 also need 12 years in total, which can include up to 2 credited years. From 2026 you can pay up to 5 years of missing contributions to reach the 10-year threshold, even if you are no longer working.",
          },
          {
            question: "How do child credits work in the Malta pension system?",
            answer:
              "Parents born in 1962 or later receive 4 years of credited contributions for each of their first 3 children and 2 years for each child from the 4th onwards (only if the parent returns to work for at least as long as the credit). Credits are doubled for a child with a disability. Those born 1952–1961 receive 2 years per child for the first 3 children and 1 year from the 4th. From 2026, credits for the first three children run until the child's 10th year. Full-time studies also earn credits (for example 26 weeks per year of a degree at MQF level 6 for those born from 1962). Child credits count toward the contribution proportion used in the two-thirds formula but do not raise your pensionable income average.",
          },
          {
            question: "Is my Malta state pension taxable in 2026?",
            answer:
              "Under LN 53/2026, effective from basis year 2026, the total pension income of people aged 61 and over (state, service, occupational, private and foreign pensions combined) is 100% exempt from income tax up to €37,104 per year. Because the maximum state pension is below this threshold, most pensioners owe no income tax on their pension. Other income, such as a salary, is still taxed at normal rates. The old pensioners' tax rebate was discontinued for income after 31 December 2025 (LN 52/2026).",
          },
          {
            question: "What is the deferral bonus for Malta pensions?",
            answer:
              "If you qualify for early retirement at 61 (full contribution years) but wait, your pension is increased for life. The schedule, counted from age 61, is: claim at 62 → +6.5%, 63 → +13.5%, 64 → +21%, 65 → +29%. The increase stops at your statutory pension age: there is no extra increase for claiming after 65. Those who take an early pension at 61 cannot be in gainful employment until they reach pension age, while those who defer can keep working.",
          },
          {
            question: "How does the private pension tax credit work?",
            answer:
              "Contributions to a qualifying Personal Retirement Scheme (PRS) earn a 25% tax credit, capped at €750 per year (maximum qualifying contribution €3,000/year). Employee contributions to a voluntary occupational pension scheme earn a separate 25% credit, also capped at €750. From 2026, pension payouts from these schemes fall under the €37,104 pension income exemption.",
          },
          {
            question:
              "How much extra do I get if I defer my Malta pension by 4 years?",
            answer:
              "If you could retire at 61 with full contributions and instead claim at 65, the Department of Social Security increases your pension by 29% (6.5% at 62, 13.5% at 63, 21% at 64). On the maximum 2026 pension of approximately €19,389, that adds roughly €5,623 per year, for about €25,012 a year. There is no further increase for claiming after 65.",
          },
          {
            question: "At what age can I claim a Malta pension?",
            answer:
              "Your statutory retirement age depends on your birth year: born 1951 or earlier → 61, 1952–1955 → 62, 1956–1958 → 63, 1959–1961 → 64, and 1962 or later → 65. You can claim at these ages provided you meet the minimum 10 years (520 weeks) of paid contributions. For a full pension you need 30 years (born before 1952), 35 years (1952–1961), 40 years (1962–1968), 41 years (1969–1975) or 42 years (born 1976+). With the full number of years you can retire from 61 if you stop working.",
          },
        ]}
      />
      <HowToJsonLd
        name="How to estimate your Malta state pension (2026)"
        description="Five-step method to estimate your Malta Two-Thirds Pension under the Social Security Act (Cap. 318) and LN 53/2026."
        totalTime="PT3M"
        steps={[
          {
            name: "Enter your birth year and contribution history",
            text: "Your birth year sets your retirement age (61–65) and the required full-pension contribution years (35 if born 1952–1961, up to 42 for 1976+). The minimum to qualify for any pension is 10 years (520 weeks).",
          },
          {
            name: "Enter your average best-years salary",
            text: "Use the average gross annual salary of your best qualifying years. Pensionable income is capped at the 2026 Maximum Pensionable Income of €29,083 (born 1962 or later) or €25,500 (born before 1962). Earnings above the cap are ignored.",
          },
          {
            name: "Apply the Two-Thirds formula with proportion",
            text: "Base annual pension = pensionable income × 2/3 × (effective years / required years). Effective years include child credits: 4 years each for the first 3 children and 2 from the 4th (born 1962 or later), or 2 years each for the first 3 and 1 from the 4th (born before 1962).",
          },
          {
            name: "Add the deferral bonus",
            text: "If you qualify to retire at 61 but claim later, add +6.5% (at 62), +13.5% (63), +21% (64) or +29% (65). There is no increase for claiming after your pension age.",
          },
          {
            name: "Check tax treatment and private pension credit",
            text: "Under LN 53/2026 the first €37,104 of annual pension income of people aged 61+ is 100% income-tax exempt. Personal Retirement Scheme contributions earn a 25% tax credit capped at €750/year (max qualifying contribution €3,000/year).",
          },
        ]}
      />
      <main role="main" aria-label="Malta Pension Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-6xl py-8">
          <PensionCalculator />
          <Budget2027Update
            title="Budget 2027: pension changes from January 2027"
            items={[
              "This calculator uses 2026 rules. In 2027 pensions rise by €10 a week (including COLA)",
              "Tax-free pension income threshold rises to €37,624; maximum pensionable income for those born before 1962 rises to €28,000",
            ]}
          />
          <RelatedGuide
            href="/blog/malta-pension-system-2026-guide"
            title="Malta Pension System 2026 Guide"
            description="Understand Malta's state pension system, eligibility rules and how to maximise your retirement benefits."
          />
          <AffiliateCard slug="pension" />
          <RelatedCalculators slug="pension" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
