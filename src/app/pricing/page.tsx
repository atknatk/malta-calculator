import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { PLANS } from "@/lib/stripe";
import PricingCard from "./_components/pricing-card";

export const metadata = {
  title: "Pricing - Malta Calculator",
  description:
    "Simple, transparent pricing for Malta payslip generation. Start free, upgrade when you need more.",
};

export default async function PricingPage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-amber-600">
            Malta Calculator
          </Link>
          <div className="flex items-center gap-4">
            {userId ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
          Start generating Malta payslips for free. Upgrade when your business
          grows.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {/* Free */}
          <PricingCard
            plan="free"
            name={PLANS.free.name}
            price={PLANS.free.price}
            features={[...PLANS.free.features]}
            isLoggedIn={!!userId}
            isCurrent={false}
          />

          {/* Basic - Popular */}
          <PricingCard
            plan="basic"
            name={PLANS.basic.name}
            price={PLANS.basic.price}
            features={[...PLANS.basic.features]}
            isLoggedIn={!!userId}
            isCurrent={false}
            isPopular
          />

          {/* Pro */}
          <PricingCard
            plan="pro"
            name={PLANS.pro.name}
            price={PLANS.pro.price}
            features={[...PLANS.pro.features]}
            isLoggedIn={!!userId}
            isCurrent={false}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-white py-16 dark:bg-slate-800">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                Can I cancel anytime?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Yes! You can cancel your subscription at any time. Your plan
                will remain active until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                What payment methods do you accept?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We accept all major credit cards (Visa, Mastercard, American
                Express) through our secure payment provider, Stripe.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">
                What happens when I reach my limit?
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                You will be prompted to upgrade to a higher plan. Your existing
                payslips and data remain safe.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
