import Script from "next/script";
import { cn } from "@/lib/utils";

/**
 * Dormant display-ad slotu (AdSense).
 *
 * KURAL (docs/MONETIZATION_PLAN.md, Kanal C): display reklam YALNIZCA niş
 * "para" sayfalarında (banka oran kıyaslama gibi) gösterilir — ana sayfa,
 * genel hesaplayıcılar ve blog'da ASLA. Tek, küçük, içeriği bölmeyen slot.
 *
 * `NEXT_PUBLIC_ADSENSE_CLIENT` env tanımlı DEĞİLSE hiçbir şey render etmez
 * (ve hiç client JS yüklemez) — yani onaylı bir AdSense hesabı gelene kadar
 * site tertemiz kalır. Hesap gelince env + slot id verilince otomatik açılır.
 */

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

interface AdSlotProps {
  /** AdSense ad unit (slot) id — env client ile birlikte gerekir */
  slot?: string;
  className?: string;
}

export function AdSlot({ slot, className }: AdSlotProps) {
  // Dormant: publisher id yoksa hiçbir şey (ve hiç script) yok.
  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <aside
      className={cn("mt-8 text-center", className)}
      aria-label="Advertisement"
    >
      <span className="block text-[11px] uppercase tracking-wide text-muted-foreground mb-1">
        Advertisement
      </span>
      <Script
        id="adsbygoogle-js"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
      />
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`adsbygoogle-push-${slot}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </aside>
  );
}
