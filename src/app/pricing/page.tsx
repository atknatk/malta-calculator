import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PLANS } from "@/lib/stripe";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { FaqAccordion } from "@/components/calculator-page/faq-accordion";
import { PricingPlans, type PlanInfo } from "./_components/pricing-plans";

export const metadata = {
  title: "Pricing - Malta Calculator",
  description:
    "Simple, transparent pricing for Malta payslip generation. Start free, upgrade when you need more.",
};

const FAQ = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes! You can cancel your subscription at any time. Your plan will remain active until the end of your billing period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment provider, Stripe.",
  },
  {
    question: "What happens when I reach my limit?",
    answer:
      "You will be prompted to upgrade to a higher plan. Your existing payslips and data remain safe.",
  },
];

// İstemciye yalnızca gösterim verisi gider (priceId sunucuda kalır)
const plans: PlanInfo[] = (["free", "basic", "pro"] as const).map((id) => ({
  id,
  name: PLANS[id].name,
  price: PLANS[id].price,
  employees: PLANS[id].employees,
  payslipsPerMonth: PLANS[id].payslipsPerMonth,
  features: [...PLANS[id].features],
}));

export default async function PricingPage() {
  const { userId } = await auth();

  return (
    <MarketingLayout>
      <section
        aria-labelledby="pricing-title"
        className="flex w-full flex-col items-center gap-3 pt-4 text-center md:gap-4 md:pt-8 lg:pt-12"
      >
        <span className="inline-flex h-[30px] items-center rounded-full border border-primary/25 bg-[var(--glass-bg)] px-3 text-[13px] font-medium text-primary-ink">
          Payslip Generator
        </span>
        <h1
          id="pricing-title"
          className="font-cal text-[38px] leading-[1.1] tracking-[-0.02em] md:text-5xl lg:text-[56px]"
        >
          Simple, Transparent Pricing
        </h1>
        <p className="max-w-[620px] text-[17px] leading-relaxed text-muted-foreground md:text-lg lg:text-[19px]">
          Start generating Malta payslips for free. Upgrade when your business
          grows.
        </p>
      </section>

      <PricingPlans plans={plans} isLoggedIn={!!userId} />

      <section
        aria-labelledby="faq-heading"
        className="mt-12 grid w-full items-start gap-4 md:mt-16 md:gap-6 lg:mt-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-12"
      >
        <div className="flex flex-col gap-3">
          <h2
            id="faq-heading"
            className="font-cal text-2xl leading-[1.25] md:text-[28px] lg:text-[32px]"
          >
            Frequently asked questions
          </h2>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            Something else on your mind?{" "}
            <Link
              href="/contact"
              className="font-semibold text-primary-ink hover:underline"
            >
              Contact us
            </Link>
          </p>
        </div>
        <FaqAccordion items={FAQ} />
      </section>

      <section
        aria-label="Get started"
        className="mt-12 flex w-full flex-col items-start gap-5 rounded-[20px] border bg-band p-6 md:mt-16 md:p-8 lg:mt-20 lg:flex-row lg:items-center lg:justify-between lg:rounded-3xl lg:px-12 lg:py-10"
      >
        <span className="flex flex-col gap-2">
          <span className="font-cal text-2xl leading-[1.25] text-band-foreground lg:text-[30px]">
            Start with {PLANS.free.payslipsPerMonth} free payslips a month
          </span>
          <span className="text-[15px] text-band-muted lg:text-base">
            No payment until you upgrade to {PLANS.basic.name} or{" "}
            {PLANS.pro.name}.
          </span>
        </span>
        <span className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <Link
            href="/sign-up"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-band-cta px-5 text-[15px] font-semibold text-band-cta-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-band-accent focus-visible:ring-offset-2 focus-visible:ring-offset-band"
          >
            Get Started Free
          </Link>
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-band-border px-5 text-[15px] font-semibold text-band-foreground transition-colors hover:bg-band-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-band-accent"
          >
            Try the Salary Calculator
          </Link>
        </span>
      </section>
    </MarketingLayout>
  );
}
