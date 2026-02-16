import { auth } from "@clerk/nextjs/server";
import { PLANS } from "@/lib/stripe";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import PricingCard from "./_components/pricing-card";

export const metadata = {
  title: "Pricing - Malta Calculator",
  description:
    "Simple, transparent pricing for Malta payslip generation. Start free, upgrade when you need more.",
};

export default async function PricingPage() {
  const { userId } = await auth();

  return (
    <MarketingLayout>
      <div className="w-full">
        {/* Hero */}
        <section className="py-12 text-center">
          <h1 className="mb-4 font-cal text-4xl font-bold text-gradient">
            Simple, Transparent Pricing
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Start generating Malta payslips for free. Upgrade when your business
            grows.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="pb-16">
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
        <section className="rounded-2xl border bg-card p-8 md:p-12">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <div>
              <h3 className="mb-2 font-semibold">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can cancel your subscription at any time. Your plan
                will remain active until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American
                Express) through our secure payment provider, Stripe.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">
                What happens when I reach my limit?
              </h3>
              <p className="text-muted-foreground">
                You will be prompted to upgrade to a higher plan. Your existing
                payslips and data remain safe.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
