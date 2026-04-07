import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { Clock } from "lucide-react";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Part-Time Salary Calculator | Malta Calculator",
  description:
    "Calculate part-time salary in Malta. Free pro-rata calculations for tax, SSC, and salary for part-time employees.",
  alternates: pageAlternates("/calculators/part-time"),
  openGraph: {
    ...ogMetadata,
    title: "Part-Time Salary Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/part-time`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Part-Time Salary Calculator | Malta Calculator",
  },
  robots: { index: false, follow: true },
};

export default function PartTimePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Part-Time Salary Calculator",
            url: `${SITE_URL}/calculators/part-time`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Part-Time Salary Calculator Malta"
        description="Calculate pro-rata salary, tax, and SSC Category B contributions for part-time employees in Malta."
        slug="part-time"
        category="Employment Calculator"
        features={[
          "SSC Category B contributions for part-time workers",
          "Pro-rata salary and tax calculation",
          "Minimum wage compliance check",
          "Annual leave pro-rata entitlement",
          "Part-time vs full-time comparison",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What SSC category applies to part-time workers in Malta?",
            answer:
              "Part-time workers in Malta who earn below a certain weekly threshold fall under SSC Category B. For 2026, Category B applies to employed persons working part-time whose weekly basic wage does not exceed €179.33. The maximum weekly SSC contribution under Category B is €22.94, split between the employee and employer. Part-time workers earning above this threshold are classified under Category A (full-time rates).",
          },
          {
            question:
              "Are part-time employees entitled to pro-rata benefits in Malta?",
            answer:
              "Yes, part-time employees in Malta are entitled to pro-rata entitlements under the Part-Time Employees (Prevention of Less Favourable Treatment) Regulations. This includes pro-rata annual leave, public holidays, sick leave, and other benefits proportional to the hours worked compared to a comparable full-time employee. Part-time workers cannot be treated less favourably than full-time workers on a pro-rata basis.",
          },
          {
            question:
              "What is the minimum number of hours for part-time employment in Malta?",
            answer:
              "There is no statutory minimum number of hours for part-time employment in Malta. Any employment that is less than the standard full-time working hours (typically 40 hours per week) may be considered part-time. However, the classification for SSC purposes (Category A vs Category B) depends on the weekly wage threshold rather than a specific number of hours.",
          },
          {
            question:
              "How is income tax calculated for part-time workers in Malta?",
            answer:
              "Part-time income in Malta is subject to income tax at a flat rate of 15% (with a minimum tax of €400 per year), provided the part-time work is secondary employment and the individual elects to be taxed at the reduced rate. This option must be exercised by submitting the appropriate form to the Commissioner for Revenue. Alternatively, the income can be declared in the annual tax return and taxed at the standard progressive rates.",
          },
          {
            question:
              "Can part-time workers in Malta access unemployment and social benefits?",
            answer:
              "Part-time workers in Malta who pay SSC Category B contributions have access to a more limited range of social security benefits compared to full-time Category A contributors. Category B contributors may not qualify for all benefits available to Category A contributors. Eligibility for specific benefits such as sickness benefit, unemployment benefit, or maternity benefit depends on the contribution class and whether sufficient contributions have been made.",
          },
        ]}
      />
      <ComingSoonPage
        title="Part-Time Salary Calculator"
        description="Calculate pro-rata salary, tax, and SSC contributions for part-time employees in Malta."
        icon={<Clock className="h-12 w-12 text-primary" />}
        category="Employment"
        features={[
          "Pro-rata salary calculation",
          "Proportional SSC contributions",
          "Minimum wage compliance check",
          "Annual leave pro-rata entitlement",
        ]}
      />
    </>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
