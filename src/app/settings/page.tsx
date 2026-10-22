import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, CreditCard, Sparkles } from "lucide-react";
import { getCompany, getUsageLimits } from "@/app/actions/payslip-actions";
import { PLANS } from "@/lib/stripe";
import {
  CardHeader,
  LinearProgress,
  MdCard,
  PLAN_LABELS,
  PageHeader,
  StatusChip,
  mdButton,
} from "@/components/admin/admin-ui";
import ManageSubscriptionButton from "@/app/dashboard/_components/manage-subscription-button";
import CompanySettingsForm from "./_components/company-settings-form";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const company = await getCompany();

  if (!company) {
    redirect("/onboarding");
  }

  const usage = await getUsageLimits();
  const plan = PLANS[company.plan];

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your company profile, branding and subscription"
      />

      <div className="grid items-start gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <CompanySettingsForm company={company} />
        </div>

        {/* Plan & billing */}
        <div id="billing" className="scroll-mt-24 lg:col-span-2">
          <MdCard>
            <CardHeader
              title="Plan & billing"
              subtitle="Usage resets on the 1st of every month"
              icon={<CreditCard />}
            />
            <div className="space-y-5 px-6 pb-6 pt-4">
              <div className="flex items-center justify-between rounded-2xl bg-md-surface-container p-4">
                <div>
                  <p className="text-[13px] text-md-on-surface-variant">
                    Current plan
                  </p>
                  <p className="text-2xl text-md-on-surface">
                    {PLAN_LABELS[company.plan]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl text-md-on-surface">
                    {plan.price === 0 ? "€0" : `€${plan.price}`}
                  </p>
                  <p className="text-xs text-md-on-surface-variant">
                    per month
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-md-on-surface-variant">
                      Employees
                    </span>
                    <span className="font-medium tabular-nums text-md-on-surface">
                      {usage.employees.used} / {usage.employees.limit}
                    </span>
                  </div>
                  <LinearProgress
                    value={usage.employees.used}
                    max={usage.employees.limit}
                  />
                </div>
                <div>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-md-on-surface-variant">
                      Payslips issued this month
                    </span>
                    <span className="font-medium tabular-nums text-md-on-surface">
                      {usage.payslips.used} / {usage.payslips.limit}
                    </span>
                  </div>
                  <LinearProgress
                    value={usage.payslips.used}
                    max={usage.payslips.limit}
                  />
                  <p className="mt-1.5 text-xs text-md-on-surface-variant">
                    Drafts don&apos;t count towards your limit.
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-md-on-surface">
                  Included
                  <StatusChip tone="primary">{plan.name}</StatusChip>
                </p>
                <ul className="space-y-1.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-md-on-surface-variant"
                    >
                      <Check className="size-4 text-md-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-md-outline-variant/50 pt-5">
                {company.plan !== "pro" && (
                  <Link href="/pricing" className={mdButton()}>
                    <Sparkles />
                    {company.plan === "free"
                      ? "Upgrade plan"
                      : "Upgrade to Pro"}
                  </Link>
                )}
                {company.plan !== "free" && <ManageSubscriptionButton />}
              </div>
              {company.plan !== "free" && (
                <p className="text-xs text-md-on-surface-variant">
                  Invoices, payment method and cancellation are managed securely
                  in the Stripe billing portal.
                </p>
              )}
            </div>
          </MdCard>
        </div>
      </div>
    </>
  );
}
