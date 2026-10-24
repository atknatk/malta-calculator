import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface RelatedGuide {
  href: string;
  tag: string;
  title: string;
}

// Makale altındaki "More … guides"
export function GuideRelated({
  title,
  guides,
}: {
  title: string;
  guides: RelatedGuide[];
}) {
  return (
    <section
      aria-labelledby="related-guides-heading"
      className="mt-10 flex w-full flex-col gap-3 md:mt-14 md:gap-4 lg:mt-[72px] lg:gap-5"
    >
      <div className="flex items-baseline justify-between">
        <h2
          id="related-guides-heading"
          className="font-cal text-[22px] leading-[1.33] lg:text-2xl"
        >
          {title}
        </h2>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink hover:underline"
        >
          All Guides
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-3 md:gap-3.5 lg:gap-5">
        {guides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="flex flex-col gap-2 rounded-2xl border bg-card p-[18px] transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:p-[22px]"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-secondary-ink">
              {guide.tag}
            </span>
            <span className="font-cal text-lg leading-[1.35] lg:text-[19px]">
              {guide.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
