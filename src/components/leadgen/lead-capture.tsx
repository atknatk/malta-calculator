import { LEADGEN_ENABLED, LEAD_PURPOSES } from "@/config/leadgen";
import { LeadGenForm } from "./lead-gen-form";

interface LeadCaptureProps {
  /** LEAD_PURPOSES anahtarı, örn. "mortgage" */
  purpose: keyof typeof LEAD_PURPOSES | string;
  sourcePage?: string;
}

/**
 * Lead yakalama kartı sarmalayıcı.
 *
 * Dormant: `LEADGEN_ENABLED` (NEXT_PUBLIC_LEADGEN_ENABLED=true) olmadıkça
 * HİÇBİR ŞEY render etmez (ve client form island'ı sayfaya hiç eklenmez) —
 * yani partner/GDPR onayı gelene kadar görünmez ve PII toplanmaz.
 */
export function LeadCapture({ purpose, sourcePage }: LeadCaptureProps) {
  if (!LEADGEN_ENABLED) return null;
  const cfg = LEAD_PURPOSES[purpose];
  if (!cfg) return null;

  return (
    <section className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-primary/20">
      <h2 className="font-semibold text-foreground">{cfg.heading}</h2>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">{cfg.subtext}</p>
      <LeadGenForm
        purpose={String(purpose)}
        cta={cfg.cta}
        sourcePage={sourcePage}
      />
    </section>
  );
}
