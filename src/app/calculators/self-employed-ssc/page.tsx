import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";
import { Calculator } from "lucide-react";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Self-Employed SSC Calculator | Malta Calculator",
  description:
    "Calculate Class 2 SSC for self-employed in Malta. Free social security contribution calculator.",
  alternates: { canonical: `${SITE_URL}/calculators/self-employed-ssc` },
  openGraph: {
    ...ogMetadata,
    title: "Self-Employed SSC Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/self-employed-ssc`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Self-Employed SSC Calculator | Malta Calculator",
  },
  robots: { index: false, follow: true },
};

export default function SelfEmployedSSCPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Self-Employed SSC Calculator",
            url: `${SITE_URL}/calculators/self-employed-ssc`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Self-Employed SSC Calculator Malta"
        description="Calculate Class D Social Security Contributions (SSC) for self-employed persons in Malta, including weekly caps, minimum contributions, and annual totals."
        slug="self-employed-ssc"
        category="Social Security Calculator"
        features={[
          "Class D SSC rate calculation",
          "Weekly contribution cap",
          "Minimum annual contribution",
          "Annual and quarterly payment breakdown",
          "2026 SSC thresholds",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What SSC class applies to self-employed persons in Malta?",
            answer:
              "Self-employed persons in Malta pay Class 2 Social Security Contributions under Category D. The contribution rate is 15% of net annual income, split between the self-employed person (10%) and a notional employer contribution (5%). The weekly contribution is capped at €55.93 for new entrants and €49.04 for those under older rules in 2026.",
          },
          {
            question: "What is the weekly SSC cap for self-employed in Malta?",
            answer:
              "For 2026, the weekly SSC cap for self-employed (Category D) is €55.93 for persons who joined the scheme under current rules. This means the maximum annual SSC payable is approximately €2,908 regardless of how high the income is above the cap threshold of €559.31 weekly income.",
          },
          {
            question:
              "Is there a minimum SSC contribution for self-employed in Malta?",
            answer:
              "Yes. Self-employed persons in Malta must pay a minimum annual SSC even if their income is very low or nil. The minimum contribution ensures continued eligibility for social security benefits. For 2026, the minimum weekly SSC for Category D is based on the minimum contributory wage. Contact the Social Security Department for the exact current minimum.",
          },
          {
            question:
              "Can self-employed persons make voluntary SSC contributions in Malta?",
            answer:
              "Yes. If a self-employed person's income falls below the minimum threshold, they can make voluntary contributions to maintain their social security benefit record. Voluntary contributions help protect eligibility for retirement pension, sickness benefits, and other social security entitlements.",
          },
          {
            question:
              "How does self-employed SSC affect pension entitlement in Malta?",
            answer:
              "Every year of SSC contributions as a self-employed person counts as a qualifying year towards your Malta retirement pension. You need a minimum number of contribution years to qualify for the full two-thirds pension. Gaps in contributions reduce pension entitlement, so maintaining contributions even during low-income periods is advisable.",
          },
        ]}
      />
      <ComingSoonPage
        title="Self-Employed SSC Calculator"
        description="Calculate Class 2 Social Security Contributions for self-employed persons in Malta."
        icon={<Calculator className="h-12 w-12 text-primary" />}
        category="Self-Employment"
        features={[
          "Class 2 contribution rates",
          "Income-based calculation",
          "Minimum/maximum thresholds",
          "Payment schedule",
        ]}
      />
    </>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
