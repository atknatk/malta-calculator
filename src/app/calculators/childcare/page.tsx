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
import { ChildcareCalculator } from "./_components/childcare-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Free Childcare Calculator Malta 2026 | Malta Calculator",
  description:
    "Calculate your free childcare hours under Malta's Free Childcare Scheme: work-hour based entitlement, 10% contingency, commuting allowance and value.",
  keywords: [
    "malta free childcare calculator",
    "free childcare scheme malta",
    "childcare hours entitlement malta",
    "jobsplus childcare malta",
    "free childcare working parents malta",
    "childcare malta 2026",
    "childcare tax rebate malta €2000",
    "nursery hours malta",
  ],
  alternates: pageAlternates("/calculators/childcare"),
  openGraph: {
    ...ogMetadata,
    title: "Free Childcare Calculator Malta 2026 | Malta Calculator",
    url: `${SITE_URL}/calculators/childcare`,
    images: [getDynamicOgImage("Free Childcare Calculator Malta 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Free Childcare Calculator Malta 2026 | Malta Calculator",
    images: [getDynamicOgImage("Free Childcare Calculator Malta 2026")],
  },
};

export default function ChildcarePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Free Childcare Calculator",
            url: `${SITE_URL}/calculators/childcare`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Free Childcare Calculator Malta"
        description="Calculate the free childcare hours your family is entitled to under Malta's Free Childcare Scheme, based on parents' working or study hours."
        slug="childcare"
        category="Family Calculator"
        features={[
          "Work-hour based monthly entitlement",
          "10% contingency and 20h commuting allowance",
          "Student rates (20h/40h per week)",
          "Couple and single-parent households",
          "Yearly value estimate and €2,000 rebate alternative",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How does Malta's Free Childcare Scheme work?",
            answer:
              "Malta offers free childcare to parents who are in employment or education, for children from 3 months until they are eligible for Kindergarten 1. Jobsplus pays the registered childcare centre directly. The number of free hours follows the working hours of the parent who works the least, plus a 10% monthly contingency and a 20-hour monthly commuting allowance.",
          },
          {
            question: "How many free childcare hours do I get in Malta?",
            answer:
              "Your monthly entitlement equals your weekly working hours × 52 ÷ 12, plus 10% for unforeseen exigencies and 20 hours for commuting. A parent working 20 hours per week gets about 115 hours of free childcare per month; a 40-hour week yields about 211 hours.",
          },
          {
            question:
              "Do both parents need to work for free childcare in Malta?",
            answer:
              "Yes — in two-parent households both parents must be in employment (paying social security) or in education leading to a recognised qualification. Full-time students count as 40 hours per week and part-time students as 20 hours. Single parents qualify based on their own hours.",
          },
          {
            question: "Is anything not covered by the Free Childcare Scheme?",
            answer:
              "The scheme covers staff costs and consumables at the registered centre. Outings, food, nappies, wipes and other items related to the individual needs of the child are not covered and are charged by the centre separately.",
          },
          {
            question:
              "What if I don't qualify for the Free Childcare Scheme in Malta?",
            answer:
              "Families who pay for a registered childcare centre without benefiting from the scheme can claim an income tax deduction worth up to €2,000 per child per year instead. You can also re-apply once both parents are in work or education.",
          },
        ]}
      />
      <main role="main" aria-label="Free Childcare Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <ChildcareCalculator />
          <RelatedGuide
            href="/blog/malta-childrens-allowance-guide-2026"
            title="Malta Children's Allowance 2026: Complete Guide"
            description="More support for families — children's allowance rates, income thresholds and the birth bonus."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
