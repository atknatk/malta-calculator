import { ComingSoonPage } from "@/components/coming-soon-page";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { Baby } from "lucide-react";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Maternity & Paternity Leave Calculator | Malta Calculator",
  description:
    "Calculate maternity and paternity leave in Malta. Free tool for leave duration and pay calculations.",
  alternates: pageAlternates("/calculators/maternity"),
  openGraph: {
    ...ogMetadata,
    title: "Maternity & Paternity Leave Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/maternity`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Maternity & Paternity Leave Calculator | Malta Calculator",
  },
  robots: { index: false, follow: true },
};

export default function MaternityPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Maternity Leave Calculator",
            url: `${SITE_URL}/calculators/maternity`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Maternity Leave Calculator Malta"
        description="Calculate maternity leave duration, maternity benefit payments, and employer obligations for employees in Malta."
        slug="maternity"
        category="Employment Calculator"
        features={[
          "18 weeks maternity leave entitlement",
          "Maternity benefit rate calculation",
          "Employer-paid vs SSC-paid periods",
          "Paternity and parental leave details",
          "Adoption leave entitlement",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "How many weeks of maternity leave are employees entitled to in Malta?",
            answer:
              "Employees in Malta are entitled to 18 weeks of maternity leave. This includes a compulsory period of 4 weeks before the expected birth and 4 weeks after birth. The remaining 10 weeks can be taken at the employee's discretion before or after the birth, subject to giving proper notice to the employer.",
          },
          {
            question: "What is the maternity benefit rate in Malta?",
            answer:
              "The maternity benefit in Malta is paid by the Department of Social Security at a flat weekly rate based on the national minimum wage. For 2026, the benefit is paid for the full 18 weeks of maternity leave. The employer is responsible for topping up the benefit to the employee's full salary for the first 14 weeks, with the remaining weeks covered by the Social Security benefit.",
          },
          {
            question:
              "What are employer obligations during maternity leave in Malta?",
            answer:
              "Employers in Malta must grant 18 weeks of maternity leave and are required to pay the employee's full salary for the first 14 weeks of leave (this includes the Social Security maternity benefit). Employers cannot dismiss an employee during maternity leave or for a reason connected to pregnancy. The employee's position must be kept available upon return.",
          },
          {
            question: "How much paternity leave is available in Malta?",
            answer:
              "Fathers in Malta are entitled to 2 days of paid paternity leave immediately following the birth of a child. Additionally, under the parental leave provisions, parents are entitled to 4 months of parental leave (unpaid, unless the employer agrees otherwise) per child, which can be taken until the child reaches the age of 8.",
          },
          {
            question: "Is adoption leave available in Malta?",
            answer:
              "Yes, Malta provides adoption leave. The adopting mother is entitled to maternity leave equivalent to that of a biological mother (18 weeks), provided the child is under 3 years of age at the time of adoption. The adopting father is entitled to the same paternity leave rights as a biological father. Both parents may also avail of parental leave rights.",
          },
        ]}
      />
      <ComingSoonPage
        title="Maternity & Paternity Leave"
        description="Calculate your entitled maternity leave (18 weeks) and paternity leave duration and payment in Malta."
        icon={<Baby className="h-12 w-12 text-primary" />}
        category="Family"
        features={[
          "18 weeks maternity leave",
          "10 days paternity leave",
          "Maternity benefit calculation",
          "Employer contribution periods",
        ]}
      />
    </>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
