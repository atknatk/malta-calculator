/**
 * Lead-gen (partner referral) yakalama.
 *
 * VARSAYILAN: KAPALI. Form yalnızca `NEXT_PUBLIC_LEADGEN_ENABLED=true` iken
 * render edilir ve /api/leads yalnızca o zaman kabul eder. Böylece bir partner
 * anlaşması + gizlilik (GDPR) gözden geçirmesi yapılmadan PII toplanmaz.
 *
 * Aktive etmek için: bir broker/danışman partner anlaşması sonrası
 * `.env`'e NEXT_PUBLIC_LEADGEN_ENABLED=true ekle (ve gizlilik metnini gözden
 * geçir). Bkz. docs/MONETIZATION_PLAN.md (Kanal B — yüksek bilet lead-gen).
 */

export const LEADGEN_ENABLED =
  process.env.NEXT_PUBLIC_LEADGEN_ENABLED === "true";

export interface LeadPurpose {
  heading: string;
  subtext: string;
  cta: string;
}

export const LEAD_PURPOSES: Record<string, LeadPurpose> = {
  mortgage: {
    heading: "Want a mortgage broker to help you?",
    subtext:
      "Optional — leave your details and a Malta mortgage specialist can contact you to compare options. No obligation.",
    cta: "Request a callback",
  },
  "personal-loan": {
    heading: "Want help comparing loan offers?",
    subtext:
      "Optional — leave your details and a specialist can contact you about personal loan options in Malta. No obligation.",
    cta: "Request a callback",
  },
};
