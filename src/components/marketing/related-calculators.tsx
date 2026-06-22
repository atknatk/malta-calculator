import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getRelatedCalculators } from "@/config/calculators";

interface RelatedCalculatorsProps {
  /** Mevcut hesaplayıcının slug'ı, örn. "stamp-duty" */
  slug: string;
}

/**
 * Hesaplayıcı sayfalarının altında "Related Calculators" iç-bağlantı bloğu.
 * Saf server component — client JS eklemez, statik üretimi etkilemez.
 * İlgili hesaplayıcı yoksa hiçbir şey render etmez.
 */
export function RelatedCalculators({ slug }: RelatedCalculatorsProps) {
  const related = getRelatedCalculators(slug);
  if (related.length === 0) return null;

  return (
    <nav
      className="mt-8 pt-6 border-t border-border/50"
      aria-label="Related calculators"
    >
      <h2 className="text-sm font-medium text-muted-foreground mb-3">
        Related Calculators
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((calc) => (
          <Link
            key={calc.slug}
            href={calc.href}
            className={cn(
              "group flex items-start gap-3 p-4 rounded-xl",
              "bg-card border border-border/60",
              "hover:border-primary/40 hover:bg-primary/5",
              "transition-all duration-300",
            )}
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                {calc.title}
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {calc.tagline}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
