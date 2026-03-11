import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";
import { Palmtree } from "lucide-react";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Pension Estimator | Malta Calculator",
  description:
    "Estimate your Malta state pension based on SSC contributions. Free pension calculator for retirement planning.",
  alternates: { canonical: `${SITE_URL}/calculators/pension` },
  openGraph: {
    ...ogMetadata,
    title: "Pension Estimator | Malta Calculator",
    url: `${SITE_URL}/calculators/pension`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Pension Estimator | Malta Calculator",
  },
  robots: { index: false, follow: true },
};

export default function PensionPage() {
  return (
    <>
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
        name="Pension Calculator Malta"
        description="Estimate your Malta state pension based on SSC contribution history and expected retirement age."
        slug="pension"
        category="Retirement Calculator"
        features={[
          "Two-thirds pension eligibility check",
          "Contribution-based pension calculation",
          "Minimum pension guarantee amounts",
          "Early retirement impact assessment",
          "2026 SSC rates and thresholds",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is the two-thirds pension in Malta?",
            answer:
              "The two-thirds pension is Malta's main state pension, designed to provide retirees with approximately two-thirds of their average pensionable income. Eligibility requires a minimum number of Social Security Contribution (SSC) weeks paid over the working life, with the full two-thirds pension typically requiring around 2,457 contributions (approximately 47 years of work).",
          },
          {
            question:
              "How many SSC contributions are needed for a full Malta pension?",
            answer:
              "To receive a full two-thirds pension in Malta, individuals generally need approximately 2,457 paid or credited SSC contributions (roughly 47 years). A reduced pension is payable with a minimum of around 780 contributions (15 years). The exact number depends on your date of birth and the applicable legislation.",
          },
          {
            question: "What is the maximum state pension in Malta for 2026?",
            answer:
              "The maximum two-thirds pension in Malta is capped based on a pensionable income ceiling, which is reviewed annually. For 2026, the maximum pensionable income is €28,080 per year, meaning the maximum two-thirds pension would be approximately €18,720 per year (€360 per week). The actual amount depends on your average income during your working life.",
          },
          {
            question: "Is there a minimum pension guarantee in Malta?",
            answer:
              "Yes, Malta provides a minimum pension guarantee. For 2026, those who qualify for a pension but whose calculated amount falls below the minimum threshold receive the guaranteed minimum pension rate instead. This ensures pensioners receive a basic level of income regardless of their contribution history, provided they have met the minimum contribution requirements.",
          },
          {
            question: "Is the Malta state pension taxable?",
            answer:
              "Yes, Malta state pension income is subject to income tax. However, pension income benefits from the same tax brackets and exemptions as employment income. Persons of pensionable age may also be eligible for additional tax credits or exemptions. It is advisable to consult the Commissioner for Revenue (CFR) for your specific tax position as a pensioner.",
          },
        ]}
      />
      <ComingSoonPage
        title="Pension Estimator"
        description="Estimate your Malta state pension based on your SSC contribution history and expected retirement age."
        icon={<Palmtree className="h-12 w-12 text-primary" />}
        category="Retirement"
        features={[
          "Contribution-based calculation",
          "Minimum pension amounts",
          "Two-thirds pension eligibility",
          "Early retirement impact",
        ]}
      />
    </>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
