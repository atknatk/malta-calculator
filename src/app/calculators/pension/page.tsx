import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
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
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Pension Calculator 2026 | Malta Calculator",
  description:
    "Calculate your Malta state pension for 2026. Two-thirds pension formula, child credits, deferral bonus, private pension tax credit and LN 53/2026 exemption.",
  keywords: [
    "malta pension calculator",
    "malta state pension 2026",
    "two thirds pension malta",
    "malta pension formula",
    "malta pension tax exemption",
    "private pension malta",
    "maximum pensionable income malta",
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
          "Two-thirds pension formula",
          "Maximum Pensionable Income (MPI) cap",
          "Child credits (4 years per child post-1962)",
          "Deferral bonus (+5% to +29%)",
          "Private pension 25% tax credit",
          "LN 53/2026 100% income tax exemption",
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
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
