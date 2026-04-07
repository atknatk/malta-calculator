import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { Briefcase } from "lucide-react";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "In-Work Benefit Calculator | Malta Calculator",
  description:
    "Calculate in-work benefit in Malta for low-income working families. Free eligibility and amount calculator.",
  alternates: pageAlternates("/calculators/in-work-benefit"),
  openGraph: {
    ...ogMetadata,
    title: "In-Work Benefit Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/in-work-benefit`,
  },
  twitter: {
    ...twitterMetadata,
    title: "In-Work Benefit Calculator | Malta Calculator",
  },
  robots: { index: false, follow: true },
};

export default function InWorkBenefitPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "In-Work Benefit Calculator",
            url: `${SITE_URL}/calculators/in-work-benefit`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="In-Work Benefit Calculator Malta"
        description="Calculate the In-Work Benefit available to low-income working families in Malta based on household income, family size, and employment status."
        slug="in-work-benefit"
        category="Social Benefits Calculator"
        features={[
          "Income threshold eligibility check",
          "Family size benefit adjustment",
          "Employment hours requirement verification",
          "Benefit tapering calculation",
          "Annual and monthly benefit amounts",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "What is the In-Work Benefit in Malta?",
            answer:
              "The In-Work Benefit (IWB) is a government benefit in Malta designed to supplement the income of low-wage working families. It provides a top-up payment to ensure that working pays more than not working, helping families with children who are in employment but earning below certain income thresholds.",
          },
          {
            question:
              "What are the income thresholds for the In-Work Benefit in Malta?",
            answer:
              "The In-Work Benefit income thresholds in Malta depend on family composition. For a couple with children, the benefit begins tapering when household income exceeds approximately €20,000 per year and phases out at higher income levels. Single parents have separate thresholds. The exact amounts are set annually and can be confirmed with the Social Security Department.",
          },
          {
            question: "How much is the In-Work Benefit in Malta?",
            answer:
              "The amount of the In-Work Benefit varies based on the number of dependent children and household income. Families can receive up to several thousand euros per year, paid in quarterly instalments. The benefit is reduced gradually (tapered) as income rises above the minimum threshold.",
          },
          {
            question: "Who qualifies for the In-Work Benefit in Malta?",
            answer:
              "To qualify for the In-Work Benefit in Malta you must be in paid employment or self-employment, have at least one dependent child under 23 years of age, be a Maltese or EU resident, and have household income below the specified thresholds. Both single parents and couples may qualify. At least one parent must work a minimum number of hours per week.",
          },
          {
            question: "How do I apply for the In-Work Benefit in Malta?",
            answer:
              "Applications for the In-Work Benefit are submitted to the Social Security Department in Malta. You will need to provide proof of employment (payslips or employer letter), details of all household income, proof of dependent children, and your identity documents. Applications are typically reviewed annually and the benefit is paid quarterly.",
          },
        ]}
      />
      <ComingSoonPage
        title="In-Work Benefit Calculator"
        description="Calculate the in-work benefit available to low-income working families in Malta."
        icon={<Briefcase className="h-12 w-12 text-primary" />}
        category="Family"
        features={[
          "Income thresholds",
          "Family size adjustments",
          "Employment hours requirement",
          "Tapering rates",
        ]}
      />
    </>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
