
import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
} from "../shared-metadata";
import { SalaryCalculatorClient } from "./_components/salary-calculator";
import SalaryPlaygroundCards from "./_components/play-ground-cart";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Salary Calculator",
  openGraph: {
    ...ogMetadata,
    title: "Malta Salary Calculator",
    url: "https://maltacalculator/salary",
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Salary Calculator",
  },
};

export default async function SalaryCalculatorPage() {
  return (
    <>
      <BackButton href="/" />
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2">
        <SalaryCalculatorClient>
          <SalaryPlaygroundCards/>
        </SalaryCalculatorClient>
      </div>
    </>
  );
}

