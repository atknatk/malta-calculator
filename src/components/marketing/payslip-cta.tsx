import Link from "next/link";
import { FileText, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Auto Calculations",
    description: "Tax, SSC, COLA calculated automatically",
  },
  {
    icon: Shield,
    title: "Malta Compliant",
    description: "Aligned with CFR & Social Security rules",
  },
  {
    icon: Users,
    title: "Employee Management",
    description: "Add employees, generate payslips in bulk",
  },
  {
    icon: FileText,
    title: "Professional PDFs",
    description: "Download & share branded payslips",
  },
];

export function PayslipCTA() {
  return (
    <section className="w-full py-8">
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8 md:p-12">
        {/* Background decoration */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <FileText className="h-3 w-3" />
              For Employers
            </div>
            <h2 className="font-cal text-2xl font-bold md:text-3xl">
              Generate Professional Payslips
              <span className="text-gradient"> for Your Team</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Automate your Malta payroll. Create accurate, compliant payslips
              in minutes — not hours.
            </p>
          </div>

          {/* Features grid */}
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border bg-card/50 p-4 text-center backdrop-blur-sm"
              >
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-amber-600 hover:to-orange-700 hover:shadow-xl"
            >
              Start Generating Payslips — Free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              View pricing plans
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
