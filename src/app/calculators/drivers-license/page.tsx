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
import { DriversLicenseCalculator } from "./_components/drivers-license-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Driver's License Fees Calculator | Malta Calculator",
  description:
    "Calculate driving license fees in Malta. New license, renewal, international permit, and category upgrade costs including tests and medical.",
  alternates: pageAlternates("/calculators/drivers-license"),
  openGraph: {
    ...ogMetadata,
    title: "Driver's License Fees Calculator Malta",
    url: `${SITE_URL}/calculators/drivers-license`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Driver's License Fees Calculator Malta",
  },
};

export default function DriversLicensePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Driver's License Cost",
            url: `${SITE_URL}/calculators/drivers-license`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Driver's License Cost Calculator Malta"
        description="Calculate driving license fees in Malta including new license, renewal, international permit, and category upgrade costs."
        slug="drivers-license"
        category="Vehicle Calculator"
        features={[
          "New license fee calculation by category",
          "License renewal cost estimation",
          "Theory and practical test fees",
          "International driving permit costs",
          "Medical examination fee breakdown",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What are the driving license categories available in Malta?",
            answer:
              "Malta uses EU standard driving license categories: AM (mopeds), A1 (light motorcycles), A2 (medium motorcycles), A (motorcycles), B (cars), BE (car with trailer), C (trucks), CE (truck with trailer), D (buses), and DE (bus with trailer). Each category has its own minimum age requirement and test fees.",
          },
          {
            question: "How much does the theory test cost in Malta?",
            answer:
              "The theory test fee in Malta is €20 per attempt. You must pass the theory test before you can proceed to the practical driving test. The test is conducted by Transport Malta and covers road signs, traffic rules, and safe driving practices.",
          },
          {
            question:
              "What is the cost of the practical driving test in Malta?",
            answer:
              "The practical driving test fee in Malta is €43 for category B (car). Fees vary by vehicle category - motorcycle tests are €43, and larger vehicle categories such as C and D may have different fee structures. If you fail, you must pay the fee again for each re-test.",
          },
          {
            question:
              "What is the minimum age to get a driving license in Malta?",
            answer:
              "In Malta, the minimum age is 16 for category AM (mopeds), 16 for A1 (with restrictions), 18 for A2 and B, 20 for A (if holding A2 for 2 years), 24 for direct access to category A, and 21 for categories C and D. Category B holders can drive accompanied from age 17 under the ADI scheme.",
          },
          {
            question:
              "Do I need to renew my driving license in Malta and how often?",
            answer:
              "In Malta, driving licenses for categories AM, A, A1, A2, and B are valid until age 70 for holders under 50, or for 10 years, whichever comes first. After age 70, renewal is every 2 years. Professional licenses (C, D) require renewal every 5 years with a medical examination. The renewal fee is approximately €15.",
          },
        ]}
      />
      <main role="main" aria-label="Driver's License Fees Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <DriversLicenseCalculator />
          <RelatedGuide
            href="/blog/malta-drivers-license-guide-2026"
            title="Malta Driver's License Guide 2026"
            description="Complete guide to getting a driving license in Malta: fees, tests, and requirements."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
