import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const features = [
  {
    title: "Auto calculations",
    description: "Tax, SSC and COLA worked out for you.",
  },
  {
    title: "Malta compliant",
    description: "Aligned with MTCA and Social Security rules.",
  },
  {
    title: "Employee management",
    description: "Add employees and generate payslips in bulk.",
  },
  {
    title: "Professional PDFs",
    description: "Download and share branded payslips.",
  },
];

// Ters yüzey bandı (bg-band): açık temada da koyu
export function PayslipCTA() {
  return (
    <section
      aria-labelledby="employers-heading"
      className="mt-10 flex w-full flex-col gap-5 rounded-[20px] border bg-band p-6 md:mt-14 md:p-8 lg:mt-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:rounded-3xl lg:px-12 lg:py-10"
    >
      <div className="flex flex-col items-start gap-2 lg:gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-band-accent lg:text-[13px]">
          For employers
        </span>
        <h2
          id="employers-heading"
          className="font-cal text-[26px] leading-[1.15] text-band-foreground lg:text-[32px]"
        >
          Generate payslips for your whole team
        </h2>
        <p className="text-[15px] text-band-muted lg:text-base">
          The same 2026 rates as this calculator, for every employee on your
          payroll.
        </p>
        <div className="mt-2 hidden items-center gap-2 lg:flex">
          <EmployerActions />
        </div>
      </div>

      {/* Mobil/tablet: kısa onay listesi, masaüstü: açıklamalı ızgara */}
      <ul className="grid grid-cols-2 gap-3 border-t border-band-border pt-4 lg:hidden">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="flex items-start gap-2 text-sm font-medium leading-[1.35] text-band-foreground"
          >
            <Check
              className="mt-px h-4 w-4 shrink-0 text-band-accent"
              aria-hidden="true"
            />
            {feature.title}
          </li>
        ))}
      </ul>
      <ul className="hidden grid-cols-2 gap-x-8 gap-y-6 lg:grid">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="flex flex-col gap-1 border-t border-band-border pt-3.5"
          >
            <span className="text-[15px] font-semibold text-band-foreground">
              {feature.title}
            </span>
            <span className="text-sm text-band-muted">
              {feature.description}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 md:flex-row lg:hidden">
        <EmployerActions />
      </div>
    </section>
  );
}

function EmployerActions() {
  return (
    <>
      <Link
        href="/sign-up"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-band-cta px-6 text-[15px] font-semibold text-band-cta-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-band-accent focus-visible:ring-offset-2 focus-visible:ring-offset-band"
      >
        Start Free
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link
        href="/pricing"
        className="inline-flex h-12 items-center justify-center rounded-[10px] px-[18px] text-[15px] font-semibold text-band-foreground transition-colors hover:bg-band-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-band-accent"
      >
        View Pricing
      </Link>
    </>
  );
}
