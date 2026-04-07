import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { Stethoscope } from "lucide-react";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Sick Leave Calculator | Malta Calculator",
  description:
    "Calculate sick leave entitlement and sickness benefit in Malta. Free leave and payment calculator.",
  alternates: pageAlternates("/calculators/sick-leave"),
  openGraph: {
    ...ogMetadata,
    title: "Sick Leave Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/sick-leave`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Sick Leave Calculator | Malta Calculator",
  },
  robots: { index: false, follow: true },
};

export default function SickLeavePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Sick Leave Calculator",
            url: `${SITE_URL}/calculators/sick-leave`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Sick Leave Calculator Malta"
        description="Calculate sick leave entitlement, employer-paid sick leave days, and sickness benefit payments for employees in Malta."
        slug="sick-leave"
        category="Employment Calculator"
        features={[
          "Annual sick leave entitlement calculation",
          "Employer-paid sick leave days",
          "SSC sickness benefit rate",
          "Medical certificate requirements",
          "Maximum benefit period limits",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "How many sick leave days are employees entitled to in Malta?",
            answer:
              "Full-time employees in Malta are entitled to 2 weeks (14 calendar days or 10 working days) of sick leave per year, fully paid by the employer. This is the statutory minimum under the Organisation of Working Time Regulations. Many employers offer additional sick leave beyond this statutory minimum in their employment contracts.",
          },
          {
            question:
              "When is a medical certificate required for sick leave in Malta?",
            answer:
              "In Malta, a medical certificate from a registered doctor is generally required to certify illness. For Social Security sickness benefit purposes, a sick leave certificate (medical certificate) must be submitted to the Department of Social Security. Employers may also require a doctor's note for any absence due to illness, even for short periods, depending on the employment contract.",
          },
          {
            question: "What is the sickness benefit rate in Malta?",
            answer:
              "The SSC-funded sickness benefit in Malta is a daily flat-rate benefit paid by the Department of Social Security after the employer-paid sick leave entitlement is exhausted. The benefit is payable for up to 156 days (approximately 6 months) in any 2-year period. The rate for 2026 is set based on the applicable Social Security legislation and is subject to annual review.",
          },
          {
            question: "How long does the employer pay sick leave in Malta?",
            answer:
              "The employer is required to pay the employee's full salary for the statutory 2 weeks (10 working days) of sick leave entitlement per year. Once this entitlement is exhausted, the employee may apply for the SSC sickness benefit from the Department of Social Security, provided they have made sufficient SSC contributions and meet eligibility criteria.",
          },
          {
            question: "Can sick leave accumulate from year to year in Malta?",
            answer:
              "Under the minimum statutory provisions in Malta, sick leave entitlement does not automatically accumulate from one year to the next. Each year, employees receive a fresh entitlement. However, individual employment contracts or collective agreements may provide more favourable terms, including the carry-over of unused sick leave. You should check your specific employment contract for the applicable rules.",
          },
        ]}
      />
      <ComingSoonPage
        title="Sick Leave Calculator"
        description="Calculate sick leave entitlement and sickness benefit payments in Malta."
        icon={<Stethoscope className="h-12 w-12 text-primary" />}
        category="Leave"
        features={[
          "Employer-paid sick leave",
          "SSC-funded sickness benefit",
          "Medical certificate requirements",
          "Maximum benefit periods",
        ]}
      />
    </>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
