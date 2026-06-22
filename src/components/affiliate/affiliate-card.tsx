import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AFFILIATE_OFFERS } from "@/config/affiliate-offers";
import { CALCULATOR_OFFERS } from "@/config/calculator-offer-map";

interface AffiliateCardProps {
  /** Mevcut hesaplayıcının slug'ı, örn. "salary" */
  slug: string;
}

/**
 * Bağlama oturan tek, temiz affiliate önerisi kartı.
 *
 * Saf server component — client JS eklemez, statik üretimi etkilemez.
 * İlgili offer yoksa VEYA offer aktif değilse hiçbir şey render etmez
 * (hesaplar onaylanana kadar siteye sıfır görünür değişiklik).
 *
 * Şeffaflık: görünür disclosure + `rel="sponsored"` outbound link.
 */
export function AffiliateCard({ slug }: AffiliateCardProps) {
  const ids = CALCULATOR_OFFERS[slug] ?? [];
  const offer = ids
    .map((id) => AFFILIATE_OFFERS[id])
    .find((o) => o && o.active);

  if (!offer) return null;

  return (
    <aside className="mt-6" aria-label="Sponsored recommendation">
      <a
        href={offer.href}
        target="_blank"
        rel={offer.rel}
        className={cn(
          "group block p-5 rounded-2xl",
          "bg-gradient-to-br from-primary/5 via-background to-secondary/5",
          "border border-primary/20",
          "hover:border-primary/40 transition-all duration-300",
        )}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Sponsored · {offer.displayUrl}
          </span>
          <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          <span className="sr-only">Sponsored: </span>
          {offer.headline}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{offer.subtext}</p>
        <span className="inline-block mt-3 text-sm font-medium text-primary">
          {offer.cta} →
        </span>
      </a>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        {offer.disclosure}
      </p>
    </aside>
  );
}
