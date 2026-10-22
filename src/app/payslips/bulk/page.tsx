import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Layers, Sparkles, UserPlus, Users } from "lucide-react";
import {
  getBulkPayslipRows,
  getCompany,
  getUsageLimits,
} from "@/app/actions/payslip-actions";
import {
  EmptyState,
  MdCard,
  PageHeader,
  mdButton,
} from "@/components/admin/admin-ui";
import BulkPayslipFlow from "./_components/bulk-payslip-flow";

const backLink = (
  <Link
    href="/payslips"
    className="inline-flex items-center gap-1 hover:text-md-on-surface"
  >
    <ArrowLeft className="size-4" />
    Payslips
  </Link>
);

// Dönem parametresi: geçersizse ya da gelecekteyse bu ay
function resolvePeriod(params: { month?: string; year?: string }): {
  month: number;
  year: number;
} {
  const now = new Date();
  const month = Number(params.month);
  const year = Number(params.year);
  if (
    Number.isInteger(month) &&
    Number.isInteger(year) &&
    month >= 1 &&
    month <= 12 &&
    year >= 2020 &&
    new Date(year, month - 1) <= now
  ) {
    return { month, year };
  }
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

export default async function BulkPayslipsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const company = await getCompany();

  if (!company) {
    redirect("/onboarding");
  }

  const header = (
    <PageHeader
      eyebrow={backLink}
      title="Bulk payslips"
      description="Prepare a whole pay period at once, review the drafts, then issue them together."
    />
  );

  // Toplu bordro Pro plan özelliği
  if (company.plan !== "pro") {
    return (
      <>
        {header}
        <MdCard className="mx-auto max-w-lg">
          <EmptyState
            icon={<Layers />}
            title="Bulk payslips are a Pro feature"
            description="Upgrade to Pro to create and issue payslips for up to 100 employees in one go."
            action={
              <Link href="/pricing" className={mdButton()}>
                <Sparkles />
                See Pro plan
              </Link>
            }
          />
        </MdCard>
      </>
    );
  }

  const period = resolvePeriod(await searchParams);
  const [rows, usage] = await Promise.all([
    getBulkPayslipRows(period.month, period.year),
    getUsageLimits(),
  ]);

  if (rows.length === 0) {
    return (
      <>
        {header}
        <MdCard className="mx-auto max-w-lg">
          <EmptyState
            icon={<Users />}
            title="Add employees first"
            description="You need at least one employee before you can create payslips."
            action={
              <Link href="/employees" className={mdButton()}>
                <UserPlus />
                Add employee
              </Link>
            }
          />
        </MdCard>
      </>
    );
  }

  return (
    <>
      {header}
      <BulkPayslipFlow
        // Dönem değişince satır durumu sıfırlansın
        key={`${period.year}-${period.month}`}
        period={period}
        rows={rows}
        issueRemaining={Math.max(0, usage.payslips.limit - usage.payslips.used)}
        issueLimit={usage.payslips.limit}
      />
    </>
  );
}
