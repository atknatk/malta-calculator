import { TrendingUp } from "lucide-react";

interface MarketContextProps {
  /** Yıllık yüzde değer, örn. 2.05 */
  value: number;
  /** Gözlem dönemi, örn. "2026-04" */
  period: string;
  /** Serinin açıklaması */
  label: string;
  /** ECB kaynak URL'i */
  url: string;
}

/**
 * Resmî piyasa-ortalaması (ECB MIR) bilgi kutusu — saf server component.
 * Statik, kaynaklı + tarihli; banka satırlarının üzerinde "bağlam" verir.
 */
export function MarketContext({
  value,
  period,
  label,
  url,
}: MarketContextProps) {
  return (
    <aside className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
      <TrendingUp className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          {value.toFixed(2)}%
        </span>{" "}
        — {label} ({period}, ECB).{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Source
        </a>
      </p>
    </aside>
  );
}
