import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Megaphone } from "lucide-react";

interface Budget2027UpdateProps {
  /** Kısa başlık, örn. "What changes for work permits in 2027" */
  title?: string;
  /** Madde listesi (JSX olabilir) */
  items: ReactNode[];
  /** Ayrıntı için bağlantı */
  href?: string;
  linkLabel?: string;
}

/**
 * Budget 2027 (26 Eki 2026) güncelleme kutusu — 2026 rehberlerinin başına
 * eklenir; 2027'de değişen rakamları özetler.
 */
export function Budget2027Update({
  title = "Budget 2027 update (announced 26 October 2026)",
  items,
  href = "/blog/malta-budget-2027-guide",
  linkLabel = "Read the full Budget 2027 guide",
}: Budget2027UpdateProps) {
  return (
    <aside
      aria-label="Budget 2027 update"
      className="not-prose my-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-amber-500/10 border border-primary/20"
    >
      <div className="flex gap-3">
        <Megaphone className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Budget measures take effect from 1 January 2027 once the
            implementing legal notices are published; the 2026 figures below
            still apply until then.
          </p>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary hover:underline"
          >
            {linkLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
