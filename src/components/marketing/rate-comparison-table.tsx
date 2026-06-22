import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RateColumn {
  key: string;
  label: string;
  /** Sağa yasla (sayısal sütunlar için) */
  numeric?: boolean;
}

export interface RateRow {
  /** Sütun anahtarı → hücre içeriği */
  cells: Record<string, React.ReactNode>;
  /** Kaynak linki (her satır için zorunlu — doğruluk şeffaflığı) */
  sourceUrl: string;
  /** YYYY-MM-DD */
  lastVerified: string;
}

interface RateComparisonTableProps {
  columns: RateColumn[];
  rows: RateRow[];
  /** Erişilebilir tablo başlığı */
  caption: string;
}

/**
 * Banka oran kıyaslama tablosu — saf server component (sıfır client JS).
 * Her satırda kaynak + son doğrulama tarihi gösterilir.
 */
export function RateComparisonTable({
  columns,
  rows,
  caption,
}: RateComparisonTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border/60">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="bg-muted/40 text-left">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-4 py-3 font-semibold text-foreground whitespace-nowrap",
                  col.numeric && "text-right",
                )}
              >
                {col.label}
              </th>
            ))}
            <th scope="col" className="px-4 py-3 font-semibold text-foreground">
              Source
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-t border-border/50 hover:bg-primary/5 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 py-3 align-top",
                    col.numeric && "text-right tabular-nums whitespace-nowrap",
                  )}
                >
                  {row.cells[col.key] ?? "—"}
                </td>
              ))}
              <td className="px-4 py-3 align-top whitespace-nowrap">
                <a
                  href={row.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Verify
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="block text-[11px] text-muted-foreground">
                  {row.lastVerified}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
