import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";
import { Clock } from "lucide-react";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Part-Time Salary Calculator | Malta Calculator",
  description:
    "Calculate part-time salary in Malta. Free pro-rata calculations for tax, SSC, and salary for part-time employees.",
  alternates: { canonical: `${SITE_URL}/calculators/part-time` },
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
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
