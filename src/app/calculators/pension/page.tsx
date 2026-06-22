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
          "Child credits — 4 years per child (post-1962), max 3 children",
          "Deferral bonus schedule: +5% / +10% / +18% / +29% for 1–4 year deferral",
          "LN 53/2026 — 100% pension income tax exemption up to €37,104/year",
          "Pensioner COLA 2026: €10/week (€520/year)",
          "Private pension tax credit — 25% of contributions, capped at €750/year",
          "Birth-year contribution requirement (35 / 40 / 41 / 42 years)",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is the maximum Malta state pension in 2026?",
            answer:
              "The maximum Two-Thirds Pension in 2026 is approximately €19,388/year (roughly €373/week) before COLA. This is based on the Maximum Pensionable Income (MPI) cap of €29,083 × 2/3. The pensioner COLA increase adds a further €10/week (€520/year) on top of the base pension.",
          },
          {
            question:
              "How many SSC contribution years are needed for a full Malta pension?",
            answer:
              "It depends on your birth year. Born before 1962: 35 years. Born 1962–1968: 40 years. Born 1969–1975: 41 years. Born 1976 onwards: 42 years. The absolute minimum to qualify for any pension is 10 years (520 weeks). If you are close but short, you may be able to retrospectively pay back up to 5 years of missing contributions.",
          },
          {
            question: "How do child credits work in the Malta pension system?",
            answer:
              "Parents born after 1962 receive 4 years of credited contributions per child, up to 3 children (a maximum of 12 extra years). Those born before 1962 receive 2 years per child. Child credits count toward the contribution proportion used in the two-thirds formula but do not raise your pensionable income average.",
          },
          {
            question: "Is my Malta state pension taxable in 2026?",
            answer:
              "Under LN 53/2026, effective 1 January 2026, pension income is 100% exempt from income tax up to €37,104 per year. Because the maximum state pension is below this threshold, most pensioners will owe no income tax on their state pension. The previous pensioners' rebate under S.L. 123.174 was discontinued; a new targeted rebate applies from 2026 for those with chargeable income above €15,000 (capped at €540).",
          },
          {
            question: "What is the deferral bonus for Malta pensions?",
            answer:
              "If you defer claiming your state pension past retirement age, your weekly payment increases. The schedule is: +1 year → +5%, +2 years → +10%, +3 years → +18%, +4 years → +29%. You cannot be in gainful employment while deferring an early pension, so deferral is most useful for those who intend to keep working past their statutory retirement age.",
          },
          {
            question: "How does the private pension tax credit work?",
            answer:
              "Contributions to a qualifying Personal Retirement Scheme (PRS) or workplace pension earn a 25% tax credit, capped at €750 per year. This means a maximum qualifying contribution of €3,000/year. You can claim this credit in addition to the 100% pension income exemption and, if you also participate in a workplace scheme, you can claim the tax credit on both.",
          },
          {
            question:
              "How much extra do I get if I defer my Malta pension by 4 years?",
            answer:
              "Malta's Department of Social Security applies a deferral uplift of +5% after 1 year, +10% after 2 years, +18% after 3 years and +29% after 4 years. On the maximum 2026 base pension of approximately €19,388, a 4-year deferral adds roughly €5,623 per year, for a gross annual pension of around €25,011 before the €520 pensioner COLA. You cannot be in gainful employment while deferring an early pension.",
          },
          {
            question: "At what age can I claim a Malta pension?",
            answer:
              "Your statutory retirement age depends on your birth year: born 1951 or earlier → 61, 1952–1955 → 62, 1956–1958 → 63, 1959–1961 → 64, and 1962 or later → 65. You can claim at these ages provided you meet the minimum 10 years (520 weeks) of paid contributions. For a full pension you need 35 years (born <1962), 40 years (1962–1968), 41 years (1969–1975) or 42 years (born 1976+).",
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
            text: "Your birth year sets your retirement age (61–65) and the required full-pension contribution years (35 if born before 1962, up to 42 for 1976+). The minimum to qualify for any pension is 10 years (520 weeks).",
          },
          {
            name: "Enter your average best-years salary",
            text: "Use the average gross annual salary of your best qualifying years. Pensionable income is capped at the Maximum Pensionable Income of €29,083 for 2026 — earnings above this are ignored.",
          },
          {
            name: "Apply the Two-Thirds formula with proportion",
            text: "Base annual pension = pensionable income × 2/3 × (effective years / required years). Effective years include child credits: 4 years per child (born post-1962, max 3 children) or 2 years per child (born pre-1962).",
          },
          {
            name: "Add deferral bonus and pensioner COLA",
            text: "If you defer claiming, add +5% (1 year), +10% (2 years), +18% (3 years) or +29% (4 years). Then add the 2026 pensioner COLA of €10/week (€520/year).",
          },
          {
            name: "Check tax treatment and private pension credit",
            text: "Under LN 53/2026 the first €37,104 of annual pension income is 100% income-tax exempt. Personal Retirement Scheme contributions earn a 25% tax credit capped at €750/year (max qualifying contribution €3,000/year).",
          },
        ]}
      />
      <main role="main" aria-label="Malta Pension Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-6xl py-8">
          <PensionCalculator />
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
