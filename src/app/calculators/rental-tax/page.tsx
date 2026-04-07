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
  title: "Rental Tax Calculator | Malta Calculator",
  description:
    "Calculate rental income tax in Malta. 15% flat rate or progressive rate comparison tool.",
  alternates: pageAlternates("/calculators/rental-tax"),
  openGraph: {
    ...ogMetadata,
    title: "Rental Tax Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/rental-tax`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Rental Tax Calculator | Malta Calculator",
  },
  robots: { index: false, follow: true },
};

export default function RentalTaxPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Rental Income Tax Calculator",
            url: `${SITE_URL}/calculators/rental-tax`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Rental Income Tax Calculator Malta"
        description="Calculate rental income tax in Malta. Compare the 15% flat rate option against standard progressive income tax rates."
        slug="rental-tax"
        category="Tax Calculator"
        features={[
          "15% flat rate vs progressive rate comparison",
          "Deductible expenses calculation",
          "Long-term vs short-term rental tax",
          "Rental income registration requirement check",
          "2026 Malta tax rates",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What is the 15% flat rate option for rental income tax in Malta?",
            answer:
              "In Malta, landlords can opt to pay a final withholding tax of 15% on gross rental income instead of declaring it as part of their normal income and paying tax at progressive rates. This option is available for income from the letting of property in Malta. The 15% is applied to the gross rental income with no deductions allowed. It is a final tax, meaning no further tax is due on that rental income.",
          },
          {
            question:
              "Should I choose the 15% flat rate or normal tax rate for rental income in Malta?",
            answer:
              "The choice between the 15% flat rate and the normal progressive tax rate depends on your total income and applicable deductions. The flat rate (15% on gross income) is simpler and may be preferable if your marginal income tax rate is higher than 15%, or if you have few deductible expenses. The normal tax route allows you to deduct expenses such as ground rent, maintenance costs, and a 20% maintenance allowance, which may result in lower tax if you have significant expenses and a lower marginal rate.",
          },
          {
            question:
              "Is it mandatory to register rental income with the tax authorities in Malta?",
            answer:
              "Yes, all rental income in Malta must be declared to the Commissioner for Revenue (CFR). If you opt for the 15% final withholding tax, you must register the rental agreement and pay the tax accordingly. Failure to declare rental income is considered tax evasion and can result in penalties, interest, and back taxes. The registration of private residential leases is also required under the Private Residential Leases Act.",
          },
          {
            question: "Who is required to pay rental income tax in Malta?",
            answer:
              "Any individual or entity in Malta that receives income from letting property (residential or commercial) is required to pay tax on that rental income. This applies to both residents and non-residents who own property in Malta. Non-residents are subject to Maltese tax on income arising in Malta, including rental income from Maltese properties.",
          },
          {
            question:
              "What expenses can be deducted from rental income in Malta?",
            answer:
              "If you choose to declare rental income under the normal progressive tax system (rather than the 15% flat rate), you can deduct certain expenses. These include: ground rent paid on the property, a 20% allowance for repairs and maintenance, interest on loans used to purchase the property, and insurance costs. Under the 15% flat rate option, no deductions are permitted as the tax is applied to gross rental income.",
          },
        ]}
      />
      <ComingSoonPage
        title="Rental Tax Calculator"
        description="Calculate rental income tax in Malta. Choose between 15% flat rate or standard progressive tax rates."
        icon={<Home className="h-12 w-12 text-primary" />}
        category="Property"
        features={[
          "15% flat rate option",
          "Progressive rate comparison",
          "Deductible expenses",
          "Long-term vs short-term rental",
        ]}
      />
    </>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
