import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { FaqAccordion, type FaqItem } from "./faq-accordion";

interface Props {
  notes: string[];
  guide?: {
    href: string;
    title: string;
    description: string;
    readTime?: string;
  };
  faq: FaqItem[];
}

// "Good to know" + ilgili rehber (sol) ve SSS (sağ)
export function CalculatorInfoSection({ notes, guide, faq }: Props) {
  return (
    <section className="mt-10 grid w-full items-start gap-10 md:mt-14 md:grid-cols-2 md:gap-5 lg:mt-16 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-12">
      <div className="flex flex-col gap-4">
        <h2 className="font-cal text-2xl leading-[1.25] lg:text-[28px]">
          Good to know
        </h2>
        <ul className="flex flex-col gap-3">
          {notes.map((note) => (
            <li key={note} className="flex gap-3 text-[15px]">
              <CheckCircle2
                className="mt-0.5 h-[18px] w-[18px] shrink-0 text-success"
                aria-hidden="true"
              />
              <span>{note}</span>
            </li>
          ))}
        </ul>
        {guide ? (
          <Link
            href={guide.href}
            className="mt-3 flex flex-col gap-1.5 rounded-2xl border bg-card p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-secondary-ink">
              Related guide{guide.readTime ? ` · ${guide.readTime}` : ""}
            </span>
            <span className="font-cal text-[19px] leading-[1.35]">
              {guide.title}
            </span>
            <span className="text-sm text-muted-foreground">
              {guide.description}
            </span>
          </Link>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="font-cal text-2xl leading-[1.25] lg:text-[28px]">
          Frequently asked questions
        </h2>
        <FaqAccordion items={faq} />
      </div>
    </section>
  );
}
