import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

interface GuideCard {
  href: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
}

const featuredGuides: GuideCard[] = [
  {
    href: "/blog/malta-tax-rates-2026-complete-guide",
    title: "Malta Tax Rates 2026",
    description:
      "Complete guide to income tax brackets for single, married, and parent taxpayers.",
    category: "Tax Guide",
    readTime: "8 min",
  },
  {
    href: "/blog/malta-ssc-contributions-2026-explained",
    title: "SSC Contributions 2026",
    description:
      "Social Security rates, weekly caps, and the 1962 age threshold explained.",
    category: "SSC Guide",
    readTime: "6 min",
  },
  {
    href: "/blog/malta-minimum-wage-2026-guide",
    title: "Minimum Wage 2026",
    description:
      "Current rate of €229.44/week and National Minimum Wage regulations.",
    category: "Salary",
    readTime: "5 min",
  },
  {
    href: "/blog/understanding-cola-malta-2026",
    title: "COLA Explained",
    description:
      "Cost of Living Adjustment and how it affects your Malta salary.",
    category: "Salary",
    readTime: "5 min",
  },
  {
    href: "/blog/malta-public-holidays-2026-complete-guide",
    title: "Public Holidays 2026",
    description: "All 14 official holidays with dates and employment rights.",
    category: "Holidays",
    readTime: "8 min",
  },
  {
    href: "/blog/malta-expat-tax-hqp-scheme-guide",
    title: "Expat Tax (HQP)",
    description: "15% flat tax rate scheme for highly qualified persons.",
    category: "Expat",
    readTime: "7 min",
  },
];

// Tablet/masaüstünde kart ızgarası, mobilde tek kart içinde liste
export function FeaturedGuides() {
  return (
    <section
      aria-labelledby="popular-guides-heading"
      className="mt-10 flex w-full flex-col gap-3 md:mt-14 md:gap-5 lg:mt-16"
    >
      <div className="flex items-baseline justify-between">
        <h2
          id="popular-guides-heading"
          className="font-cal text-[22px] leading-[1.33] lg:text-2xl"
        >
          Popular Guides
        </h2>
        <Link
          href="/blog"
          className="hidden items-center gap-1.5 text-sm font-semibold text-primary-ink hover:underline md:inline-flex"
        >
          All Guides
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card md:hidden">
        {featuredGuides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="flex min-h-16 items-center justify-between gap-3 border-b px-4 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <span className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-secondary-ink">
                {guide.category}
              </span>
              <span className="text-base font-semibold">{guide.title}</span>
            </span>
            <ChevronRight
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
          </Link>
        ))}
        <Link
          href="/blog"
          className="flex h-[52px] items-center justify-center gap-2 text-[15px] font-semibold text-primary-ink"
        >
          All Guides
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {featuredGuides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="flex flex-col gap-2 rounded-2xl border bg-card p-[22px] transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-secondary-ink">
              {guide.category}
            </span>
            <span className="font-cal text-xl leading-[1.4]">
              {guide.title}
            </span>
            <span className="text-sm text-muted-foreground">
              {guide.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
