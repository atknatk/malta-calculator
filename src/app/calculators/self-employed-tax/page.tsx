import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { Calculator } from "lucide-react";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Self-Employed Tax Calculator | Malta Calculator",
  description:
    "Calculate self-employed income tax in Malta. Free tool with deductible expenses and Part B assessment.",
  alternates: pageAlternates("/calculators/self-employed-tax"),
  openGraph: {
    ...ogMetadata,
    title: "Self-Employed Tax Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/self-employed-tax`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Self-Employed Tax Calculator | Malta Calculator",
  },
  robots: { index: false, follow: true },
};

export default function SelfEmployedTaxPage() {
  return (
    <ComingSoonPage
      title="Self-Employed Tax Calculator"
      description="Calculate income tax for self-employed individuals in Malta with deductible business expenses."
      icon={<Calculator className="h-12 w-12 text-primary" />}
      category="Self-Employment"
      features={[
        "Progressive tax rates",
        "Deductible expenses",
        "Provisional tax payments",
        "Part B assessment",
      ]}
    />
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
