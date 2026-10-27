import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

interface CalculatorLink {
  href: string;
  label: string;
}

const groups: { title: string; links: CalculatorLink[] }[] = [
  {
    title: "Pay & Tax",
    links: [
      { href: "/net-to-gross", label: "Net to Gross" },
      { href: "/calculators/overtime", label: "Overtime" },
      { href: "/calculators/bonus-tax", label: "Bonus Tax" },
      { href: "/calculators/self-employed-tax", label: "Self-Employed Tax" },
    ],
  },
  {
    title: "Leave & Work",
    links: [
      { href: "/calculators/vacation", label: "Vacation Days" },
      { href: "/calculators/sick-leave", label: "Sick Leave" },
      { href: "/calculators/maternity", label: "Maternity Leave" },
      { href: "/calculators/notice-period", label: "Notice Period" },
    ],
  },
  {
    title: "Property & Loans",
    links: [
      { href: "/calculators/mortgage", label: "Mortgage" },
      { href: "/calculators/stamp-duty", label: "Stamp Duty" },
      { href: "/calculators/first-time-buyer", label: "First-Time Buyer" },
      {
        href: "/calculators/malta-personal-loan-rates",
        label: "Personal Loan Rates",
      },
    ],
  },
  {
    title: "Family & Retirement",
    links: [
      {
        href: "/calculators/children-allowance",
        label: "Children’s Allowance",
      },
      {
        href: "/calculators/family-reunification",
        label: "Family Reunification",
      },
      { href: "/calculators/retirement-age", label: "Retirement Age" },
      { href: "/calculators/pension", label: "Pension" },
    ],
  },
];

// Mobilde kısa liste
const popular = [
  "/net-to-gross",
  "/calculators/overtime",
  "/calculators/vacation",
  "/calculators/mortgage",
  "/calculators/family-reunification",
];
const popularLinks = popular.map((href) =>
  groups.flatMap((g) => g.links).find((l) => l.href === href)!,
);

const rowLink =
  "flex items-center justify-between font-medium text-foreground transition-colors hover:text-primary-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring";

export function MoreCalculators() {
  return (
    <section
      aria-labelledby="more-calculators-heading"
      className="mt-10 flex w-full flex-col gap-3 md:mt-14 md:gap-5 lg:mt-16"
    >
      <div className="flex items-baseline justify-between">
        <h2
          id="more-calculators-heading"
          className="font-cal text-[22px] leading-[1.33] lg:text-2xl"
        >
          <span className="md:hidden">Popular Calculators</span>
          <span className="hidden md:inline">More Malta Calculators</span>
        </h2>
        <Link
          href="/calculators"
          className="hidden items-center gap-1.5 text-sm font-semibold text-primary-ink hover:underline md:inline-flex"
        >
          All Calculators
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Mobil: popüler 5 hesaplayıcı */}
      <div className="overflow-hidden rounded-2xl border bg-card md:hidden">
        {popularLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${rowLink} h-[52px] border-b px-4 text-[15px]`}
          >
            {link.label}
            <ChevronRight
              className="h-4 w-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Link>
        ))}
        <Link
          href="/calculators"
          className="flex h-[52px] items-center justify-center gap-2 text-[15px] font-semibold text-primary-ink"
        >
          All Calculators
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Tablet ve masaüstü: 4 grup */}
      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {groups.map((group) => (
          <div
            key={group.title}
            className="rounded-2xl border bg-card px-5 pb-2 pt-5"
          >
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
              {group.title}
            </h3>
            {group.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${rowLink} h-11 border-t text-[15px]`}
              >
                {link.label}
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
