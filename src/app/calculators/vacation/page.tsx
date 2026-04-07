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
import { VacationCalculator } from "./_components/vacation-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Vacation Days Calculator | Malta Calculator",
  description:
    "Calculate your annual leave entitlement in Malta. Minimum 192 hours (24 days) plus public holiday additions.",
  alternates: pageAlternates("/calculators/vacation"),
  openGraph: {
    ...ogMetadata,
    title: "Vacation Days Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/vacation`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Vacation Days Calculator | Malta Calculator",
  },
};

export default function VacationPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Vacation Leave Calculator",
            url: `${SITE_URL}/calculators/vacation`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Vacation Leave Calculator Malta"
        description="Calculate annual leave entitlement in Malta. The statutory minimum is 192 hours (24 days) per year plus public holiday additions under the Employment and Industrial Relations Act."
        slug="vacation"
        category="Employment Calculator"
        features={[
          "Minimum 192 hours annual leave",
          "Public holiday entitlement",
          "Pro-rata calculation for new employees",
          "Part-time leave entitlement",
          "Hours and days display",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is the minimum annual leave entitlement in Malta?",
            answer:
              "The minimum annual leave entitlement in Malta is 192 hours per year for a full-time employee working a standard 40-hour week. This equates to 24 working days. This is the statutory minimum under the Employment and Industrial Relations Act (EIRA) and cannot be reduced by contract.",
          },
          {
            question: "How many public holidays are there in Malta?",
            answer:
              "Malta has 14 official public holidays per year. These are: New Year's Day (1 Jan), Feast of St Paul's Shipwreck (10 Feb), Feast of St Joseph (19 Mar), Freedom Day (31 Mar), Good Friday, Workers' Day (1 May), Sette Giugno (7 Jun), Feast of St Peter and St Paul (29 Jun), Feast of the Assumption (15 Aug), Victory Day (8 Sep), Independence Day (21 Sep), Immaculate Conception (8 Dec), Republic Day (13 Dec), and Christmas Day (25 Dec).",
          },
          {
            question: "How is annual leave accrued for new employees in Malta?",
            answer:
              "New employees in Malta accrue annual leave on a pro-rata basis from the date they commence employment. Leave is earned at a rate of 1/12th of the annual entitlement for each complete month of service during the leave year. During the first year, an employee may only take leave already accrued unless the employer agrees otherwise.",
          },
          {
            question: "Can annual leave be carried over in Malta?",
            answer:
              "Under Maltese law, employees are generally expected to take their annual leave within the leave year. However, leave may be carried over to the following year by mutual agreement between the employer and employee, or if the employer was unable to grant the leave during the year. The specifics may also depend on the applicable Wage Regulation Order or employment contract.",
          },
          {
            question:
              "What is the annual leave entitlement for part-time employees in Malta?",
            answer:
              "Part-time employees in Malta are entitled to annual leave on a pro-rata basis proportional to the hours they work compared to a full-time employee. For example, a part-time employee working 20 hours per week is entitled to 50% of the full-time entitlement, which would be 96 hours (12 days) per year.",
          },
        ]}
      />
      <main role="main" aria-label="Vacation Days Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <VacationCalculator />
          <RelatedGuide
            href="/blog/malta-vacation-leave-entitlement-2026"
            title="Malta Vacation Leave Entitlement 2026"
            description="Everything about annual leave in Malta: minimum days, accrual rates, and public holiday additions."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
