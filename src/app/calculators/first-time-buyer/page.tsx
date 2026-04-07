import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { Home } from "lucide-react";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "First-Time Buyer Scheme Calculator | Malta Calculator",
  description:
    "Calculate first-time buyer benefits in Malta. Stamp duty reductions and grants for first property purchase.",
  alternates: pageAlternates("/calculators/first-time-buyer"),
  openGraph: {
    ...ogMetadata,
    title: "First-Time Buyer Scheme Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/first-time-buyer`,
  },
  twitter: {
    ...twitterMetadata,
    title: "First-Time Buyer Scheme Calculator | Malta Calculator",
  },
  robots: { index: false, follow: true },
};

export default function FirstTimeBuyerPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "First-Time Buyer Calculator",
            url: `${SITE_URL}/calculators/first-time-buyer`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="First-Time Buyer Calculator Malta"
        description="Calculate stamp duty exemptions, grants, and total savings available to first-time property buyers in Malta under the government scheme."
        slug="first-time-buyer"
        category="Property Calculator"
        features={[
          "Stamp duty exemption on first €200,000",
          "Reduced stamp duty calculation",
          "First-time buyer grant eligibility",
          "Property value limit check",
          "Total savings summary",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What stamp duty exemption applies to first-time buyers in Malta?",
            answer:
              "First-time buyers in Malta benefit from a stamp duty exemption on the first €200,000 of the property purchase price. The normal stamp duty rate of 5% applies only to the portion above €200,000. This means a saving of up to €10,000 on the first €200,000 of the property value.",
          },
          {
            question: "Who qualifies as a first-time buyer in Malta?",
            answer:
              "To qualify as a first-time buyer in Malta, you must be purchasing your first residential property and must not have previously owned any immovable property in Malta or Gozo. Both Maltese citizens and EU nationals who are long-term residents may qualify. The property must be used as your primary residence.",
          },
          {
            question:
              "Is there a government grant for first-time buyers in Malta?",
            answer:
              "Yes. The Maltese government offers a grant of €10,000 to first-time buyers purchasing a property that requires restoration in an Urban Conservation Area (UCA), or a €2,000 grant for purchases of new or existing properties meeting the scheme criteria. Grant amounts and conditions may change annually with the Budget.",
          },
          {
            question:
              "Is there a maximum property value limit for the first-time buyer scheme in Malta?",
            answer:
              "There is no strict maximum property value to use the stamp duty exemption on the first €200,000. However, certain grant schemes do have property value caps. Always verify the current conditions with the Malta Commissioner for Revenue or a licensed notary before proceeding.",
          },
          {
            question: "How do I apply for first-time buyer benefits in Malta?",
            answer:
              "The stamp duty exemption is applied automatically at the time of the final deed of sale, through your notary. The notary is responsible for calculating and applying the correct stamp duty. For grants, you need to submit an application to the relevant government department (typically Housing Authority) with supporting documentation including the deed of sale, identity documents, and proof that it is your first property purchase.",
          },
        ]}
      />
      <ComingSoonPage
        title="First-Time Buyer Scheme"
        description="Calculate benefits available to first-time property buyers in Malta including stamp duty reductions and grants."
        icon={<Home className="h-12 w-12 text-primary" />}
        category="Property"
        features={[
          "Reduced stamp duty (3.5%)",
          "Property value limits",
          "Grant eligibility",
          "Residency requirements",
        ]}
      />
    </>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
