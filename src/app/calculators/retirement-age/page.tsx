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
} from "@/app/shared-metadata";
import { RetirementAgeCalculator } from "./_components/retirement-age-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Retirement Age Calculator | Malta Calculator",
  description:
    "Calculate your statutory retirement age in Malta from your date of birth. A free planning tool based on the Social Security Act and your pension start year.",
  alternates: pageAlternates("/calculators/retirement-age"),
  openGraph: {
    ...ogMetadata,
    title: "Retirement Age Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/retirement-age`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Retirement Age Calculator | Malta Calculator",
  },
};

export default function RetirementAgePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Retirement Age Calculator",
            url: `${SITE_URL}/calculators/retirement-age`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Retirement Age Calculator Malta"
        description="Find your statutory retirement age in Malta based on your date of birth. Includes pension eligibility, required SSC contribution years, and early retirement options under the Social Security Act."
        slug="retirement-age"
        category="Employment Calculator"
        features={[
          "Statutory retirement age by birth year",
          "Years until retirement countdown",
          "SSC contribution years required",
          "Early retirement eligibility",
          "Social Security Act 2026 rules",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is the statutory retirement age in Malta?",
            answer:
              "The statutory retirement age in Malta depends on your year of birth. For those born before 1952, retirement age is 61. It gradually increases to 65 for those born in 1968 or later. The phased increase was introduced under the Social Security Act to align with increased life expectancy.",
          },
          {
            question: "Can you retire early in Malta?",
            answer:
              "Yes, early retirement is possible in Malta under certain conditions. Individuals may be able to retire before the statutory retirement age if they have accumulated the required number of Social Security Contributions (SSC) and meet the minimum age requirements set by the Social Security Act. Early retirement typically results in a reduced pension amount.",
          },
          {
            question: "At what age can you claim a pension in Malta?",
            answer:
              "You can claim a contributory retirement pension in Malta upon reaching your statutory retirement age (between 61 and 65 depending on birth year) provided you have made sufficient Social Security Contributions. A non-contributory pension may be available to those who do not meet the contribution requirements.",
          },
          {
            question:
              "How many SSC contribution years are needed for a full pension in Malta?",
            answer:
              "To receive a full contributory retirement pension in Malta, you generally need a minimum of 35 years of Social Security Contributions (SSC). Individuals with fewer contribution years may receive a reduced pension. For those who started working later, contributions made while employed, self-employed, or voluntarily may all count towards the total.",
          },
          {
            question: "Is there a mandatory retirement age in Malta?",
            answer:
              "There is no mandatory retirement age in Malta for most employees. Employers cannot force an employee to retire solely on the basis of age, as this would constitute age discrimination under the Equal Treatment in Employment Regulations. Employees may choose to continue working beyond the statutory pension age while also drawing their pension.",
          },
        ]}
      />
      <main role="main" aria-label="Retirement Age Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <RetirementAgeCalculator />
          <RelatedGuide
            href="/blog/malta-retirement-age-guide-2026"
            title="Malta Retirement Age Guide 2026"
            description="Learn about statutory retirement ages, pension eligibility, and early retirement options in Malta."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
