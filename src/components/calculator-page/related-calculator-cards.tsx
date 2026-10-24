import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getRelatedCalculators } from "@/config/calculators";

// Şablonun "Related calculators" bölümü; veri @/config/calculators'tan
export function RelatedCalculatorCards({ slug }: { slug: string }) {
  const related = getRelatedCalculators(slug);
  if (related.length === 0) return null;

  return (
    <nav
      aria-labelledby="related-calculators-heading"
      className="mt-10 flex w-full flex-col gap-3 md:mt-14 md:gap-4 lg:mt-16"
    >
      <h2
        id="related-calculators-heading"
        className="font-cal text-[22px] leading-[1.3]"
      >
        Related calculators
      </h2>
      <div className="grid gap-3 md:grid-cols-3 md:gap-3 lg:gap-4">
        {related.map((calc) => (
          <Link
            key={calc.slug}
            href={calc.href}
            className="group flex items-start justify-between gap-3 rounded-2xl border bg-card p-4 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:p-[18px]"
          >
            <span className="flex flex-col gap-1">
              <span className="text-base font-semibold">{calc.title}</span>
              <span className="text-sm text-muted-foreground">
                {calc.tagline}
              </span>
            </span>
            <ChevronRight
              className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </nav>
  );
}
