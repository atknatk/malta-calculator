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
import { OvertimeCalculator } from "./_components/overtime-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Overtime Calculator | Malta Calculator",
  description:
    "Calculate overtime pay in Malta at 1.5x and 2x rates. Free tool covering weekday, weekend, and public holiday overtime, with gross and net take-home estimates.",
  alternates: pageAlternates("/calculators/overtime"),
  openGraph: {
    ...ogMetadata,
    title: "Overtime Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/overtime`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Overtime Calculator | Malta Calculator",
  },
};

export default function OvertimePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Overtime Calculator",
            url: `${SITE_URL}/calculators/overtime`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Overtime Pay Calculator Malta"
        description="Calculate overtime pay in Malta at the statutory 1.5x rate for regular overtime and 2x rate for public holidays, based on the Employment and Industrial Relations Act."
        slug="overtime"
        category="Employment Calculator"
        features={[
          "1.5x regular overtime rate",
          "2x public holiday overtime rate",
          "Weekly and monthly overtime totals",
          "Hourly rate from annual salary",
          "EIRA-compliant calculations",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is the overtime rate in Malta?",
            answer:
              "In Malta, the standard overtime rate is 1.5 times (150%) the normal hourly rate for overtime worked on regular working days and weekends. This rate applies under the Employment and Industrial Relations Act (EIRA) and applicable Wage Regulation Orders.",
          },
          {
            question:
              "What rate is paid for working on public holidays in Malta?",
            answer:
              "Employees who are required to work on public holidays in Malta are entitled to double pay — 2 times (200%) their normal hourly rate. This applies to all 14 official Maltese public holidays. If the public holiday falls on a weekly rest day, additional compensatory leave may also be applicable.",
          },
          {
            question: "Is there a maximum number of overtime hours in Malta?",
            answer:
              "Yes. Under EU Working Time Directive regulations as applied in Malta, the maximum average working time including overtime is 48 hours per week, averaged over a reference period (usually 17 weeks). Employees may opt out of the 48-hour limit individually in writing, but this cannot be made a condition of employment.",
          },
          {
            question: "Can employers make overtime mandatory in Malta?",
            answer:
              "Employers in Malta can require employees to work reasonable overtime under certain circumstances, especially if specified in the employment contract or applicable Wage Regulation Order. However, employees cannot be forced to work beyond the statutory maximum hours, and overtime must be compensated at the correct statutory rates.",
          },
          {
            question:
              "How is overtime pay calculated for public holidays in Malta?",
            answer:
              "For public holiday overtime in Malta, the calculation is: (Annual Salary ÷ 52 ÷ Standard Weekly Hours) × 2. For example, if an employee earns €25,000 per year and works 40 hours per week, their hourly rate is approximately €12.02, and their public holiday overtime rate would be €24.04 per hour.",
          },
        ]}
      />
      <main role="main" aria-label="Overtime Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <OvertimeCalculator />
          <RelatedGuide
            href="/blog/malta-overtime-pay-rates-2026"
            title="Malta Overtime Pay Rates 2026"
            description="Complete guide to overtime regulations, pay rates, and compensation in Malta."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
