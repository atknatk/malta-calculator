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
import { NoticePeriodCalculator } from "./_components/notice-period-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Notice Period Calculator | Malta Calculator",
  description:
    "Calculate your required notice period in Malta from your years of service. Based on the Employment and Industrial Relations Act, with staff and employer rules.",
  alternates: pageAlternates("/calculators/notice-period"),
  openGraph: {
    ...ogMetadata,
    title: "Notice Period Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/notice-period`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Notice Period Calculator | Malta Calculator",
  },
};

export default function NoticePeriodPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Notice Period Calculator",
            url: `${SITE_URL}/calculators/notice-period`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Notice Period Calculator Malta"
        description="Calculate your required notice period in Malta based on years of service under the Employment and Industrial Relations Act (EIRA)."
        slug="notice-period"
        category="Employment Calculator"
        features={[
          "Notice period by years of service",
          "EIRA-compliant calculations",
          "Employer and employee notice periods",
          "Probation period notice rules",
          "2026 Malta employment law",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "How long is the notice period in Malta based on years of service?",
            answer:
              "Under Malta's Employment and Industrial Relations Act (EIRA), notice periods are: 1 week for less than 1 month of service, 2 weeks for 1–6 months, 4 weeks for 6 months–2 years, 8 weeks for 2–4 years, 10 weeks for 4–7 years, and 12 weeks for over 7 years of continuous employment.",
          },
          {
            question: "What are the EIRA rules for notice periods in Malta?",
            answer:
              "The Employment and Industrial Relations Act (EIRA) sets the minimum statutory notice periods in Malta. Employers and employees must adhere to these minimums, though employment contracts may provide for longer notice periods. Both parties can agree to waive the notice period by making a payment in lieu.",
          },
          {
            question: "What is the notice period during probation in Malta?",
            answer:
              "During a probation period in Malta, the notice period is typically 1 week. The probation period itself cannot exceed 1 year for most employees, though it may be shorter depending on the employment contract and sector.",
          },
          {
            question:
              "How much notice must an employee give when resigning in Malta?",
            answer:
              "An employee resigning in Malta must give the same statutory minimum notice as the employer, based on their length of service. For example, after 2–4 years of service, both the employer and employee must give 8 weeks' notice. The contract may specify longer periods.",
          },
          {
            question: "Is an employee paid during the notice period in Malta?",
            answer:
              "Yes, employees are entitled to their full normal pay during the notice period in Malta. Alternatively, an employer may pay a sum in lieu of notice (PILON), which is equivalent to the wages the employee would have earned during the notice period, allowing the employment to end immediately.",
          },
        ]}
      />
      <main role="main" aria-label="Notice Period Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <NoticePeriodCalculator />
          <RelatedGuide
            href="/blog/malta-notice-period-employment-guide-2026"
            title="Malta Notice Period Employment Guide 2026"
            description="Complete guide to notice periods in Malta based on years of service and employment law."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
