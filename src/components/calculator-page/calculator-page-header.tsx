import Link from "next/link";

interface Crumb {
  name: string;
  href?: string;
}

interface Props {
  /** Son öğe geçerli sayfa (href'siz) */
  breadcrumbs: Crumb[];
  category: string;
  title: string;
  description: string;
  /** "Updated for 2026 · Based on …" satırı (tablet+) */
  meta?: string;
}

// Hesaplayıcı şablonu: breadcrumb, kategori etiketi, h1, açıklama
export function CalculatorPageHeader({
  breadcrumbs,
  category,
  title,
  description,
  meta,
}: Props) {
  return (
    <section className="flex w-full flex-col gap-2 pt-2 md:gap-2.5 md:pt-6 lg:gap-3 lg:pt-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.name} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-foreground hover:underline"
                >
                  {crumb.name}
                </Link>
              ) : (
                <span
                  aria-current="page"
                  className="font-medium text-foreground"
                >
                  {crumb.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <span className="mt-1 inline-flex h-[26px] items-center self-start rounded-full bg-primary/10 px-3 text-xs font-semibold text-primary-ink md:h-7 lg:mt-2 lg:text-[13px]">
        {category}
      </span>
      <h1 className="font-cal text-[34px] leading-[1.1] tracking-[-0.02em] md:text-[40px] lg:text-5xl">
        {title}
      </h1>
      <p className="max-w-[640px] text-base leading-normal text-muted-foreground md:text-[17px] md:leading-[1.55] lg:text-lg">
        {description}
      </p>
      {meta ? (
        <p className="hidden text-[13px] text-muted-foreground md:block">
          {meta}
        </p>
      ) : null}
    </section>
  );
}
