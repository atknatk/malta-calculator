import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { Globe } from "lucide-react";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Expatriate Tax Calculator (HQP) | Malta Calculator",
  description:
    "Calculate 15% flat tax for highly qualified persons in Malta. Malta HQP scheme calculator for expats.",
  alternates: pageAlternates("/calculators/expatriate-tax"),
  openGraph: {
    ...ogMetadata,
    title: "Expatriate Tax Calculator (HQP) | Malta Calculator",
    url: `${SITE_URL}/calculators/expatriate-tax`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Expatriate Tax Calculator (HQP) | Malta Calculator",
  },
  robots: { index: false, follow: true },
};

export default function ExpatriateTaxPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Expatriate Tax Calculator",
            url: `${SITE_URL}/calculators/expatriate-tax`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Expatriate Tax Calculator Malta"
        description="Calculate tax under Malta's Highly Qualified Persons (HQP) scheme. Flat 15% tax rate for qualifying expatriate professionals."
        slug="expatriate-tax"
        category="Tax Calculator"
        features={[
          "15% flat tax rate for HQP scheme",
          "Eligibility criteria check",
          "Minimum salary threshold verification",
          "Qualifying sectors and roles list",
          "Comparison with standard progressive tax rates",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What is the Highly Qualified Persons (HQP) scheme in Malta?",
            answer:
              "The Highly Qualified Persons (HQP) scheme in Malta provides a flat 15% income tax rate on employment income for eligible expatriates working in specified highly qualified roles. The scheme is intended to attract highly skilled professionals to Malta in key sectors including financial services, aviation, gaming, and pharmaceuticals. The 15% rate applies to qualifying employment income, subject to a minimum tax liability, for a period of up to 5 years (renewable).",
          },
          {
            question:
              "What is the 15% flat tax rate under the Malta HQP scheme?",
            answer:
              "Under the Malta HQP scheme, eligible individuals pay a flat rate of 15% tax on their qualifying employment income, regardless of their total income. This is significantly lower than the standard top income tax rate of 35%. There is a minimum annual tax of €20,000 that must be paid under the scheme. The 15% rate applies only to income derived from qualifying employment in Malta.",
          },
          {
            question:
              "What is the minimum salary requirement for the Malta HQP scheme?",
            answer:
              "To qualify for the Malta HQP scheme, the employment income must exceed a minimum threshold. For 2026, the minimum qualifying annual employment income is €82,457. Income below this threshold does not qualify for the 15% flat rate and would be taxed under the normal progressive income tax rates. The minimum threshold is reviewed periodically.",
          },
          {
            question:
              "What roles are eligible for the Malta HQP expatriate tax scheme?",
            answer:
              "The Malta HQP scheme targets highly qualified professionals in specific sectors. Eligible roles include: executives and senior management in financial services (banking, insurance, investment), aviation (pilots, engineers, senior management), gaming (senior technical and management roles), and pharmaceuticals and medical devices. The applicant must hold a recognised professional qualification and have relevant professional experience in the qualifying role.",
          },
          {
            question:
              "What are the residence requirements for the Malta HQP scheme?",
            answer:
              "To benefit from the Malta HQP scheme, the individual must be resident in Malta and employed in a qualifying role with a Maltese-based employer. The scheme is available to both EU and non-EU nationals who were not resident in Malta in the 3 years prior to taking up qualifying employment. The individual must maintain tax residency in Malta throughout the period they claim the benefit.",
          },
        ]}
      />
      <ComingSoonPage
        title="Expatriate Tax Calculator"
        description="Calculate your tax under Malta's Highly Qualified Persons (HQP) scheme with a flat 15% tax rate on qualifying income."
        icon={<Globe className="h-12 w-12 text-primary" />}
        category="Employment"
        features={[
          "15% flat tax rate calculation",
          "Eligibility criteria check",
          "Qualifying sectors and roles",
          "Comparison with standard tax rates",
        ]}
      />
    </>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
