/**
 * Affiliate offer tanımları — tek kaynak.
 *
 * ÖNEMLİ: Her offer `active` bayrağı ile kontrol edilir. Hesap/anlaşma
 * onaylanana kadar `active: false` kalır ve <AffiliateCard> hiçbir şey
 * render etmez (siteye sıfır görünür değişiklik). Onaylanınca `href`
 * gerçek tracking linkiyle güncellenir ve `active: true` yapılır.
 *
 * Temizlik ilkesi: her offer bağlama oturur, görünür disclosure taşır,
 * outbound link `rel="sponsored"` ile işaretlenir. Detay: docs/MONETIZATION_PLAN.md
 */

export type OfferCategory =
  | "transfer" // money transfer / multi-currency (Wise)
  | "neobank" // günlük bankacılık (Revolut)
  | "investment" // broker / yatırım (eToro, XTB)
  | "banking" // mevduat / banka ürünü
  | "advisory" // tax / relocation danışmanı (lead-gen)
  | "mortgage"; // mortgage broker (lead-gen)

export interface AffiliateOffer {
  id: string;
  provider: string;
  category: OfferCategory;
  /** false ise hiç render edilmez (anlaşma/hesap bekleniyor) */
  active: boolean;
  headline: string;
  subtext: string;
  cta: string;
  /** Affiliate tracking URL — onaylanınca gerçek link ile değiştirilir */
  href: string;
  /** Kullanıcıya gösterilen alan adı */
  displayUrl: string;
  /** Görünür şeffaflık metni */
  disclosure: string;
  /** Outbound link rel — affiliate için her zaman "sponsored" içerir */
  rel: string;
}

const SPONSORED_REL = "sponsored noopener noreferrer";

export const AFFILIATE_OFFERS: Record<string, AffiliateOffer> = {
  wise: {
    id: "wise",
    provider: "Wise",
    category: "transfer",
    active: false,
    headline: "Send money to & from Malta with Wise",
    subtext:
      "Real mid-market exchange rates and low, transparent fees for multi-currency transfers — popular with expats and remote workers.",
    cta: "Learn more at Wise",
    href: "https://wise.com/",
    displayUrl: "wise.com",
    disclosure:
      "Sponsored. We may earn a commission if you open an account — at no extra cost to you. Indicative info; confirm current terms with the provider.",
    rel: SPONSORED_REL,
  },
  etoro: {
    id: "etoro",
    provider: "eToro",
    category: "investment",
    active: false,
    headline: "Start investing with eToro",
    subtext:
      "Commission-free stocks and a regulated multi-asset platform. Your capital is at risk.",
    cta: "Learn more at eToro",
    href: "https://www.etoro.com/",
    displayUrl: "etoro.com",
    disclosure:
      "Sponsored. We may earn a commission. Investing involves risk of loss. Indicative info; confirm current terms with the provider.",
    rel: SPONSORED_REL,
  },
  xtb: {
    id: "xtb",
    provider: "XTB",
    category: "investment",
    active: false,
    headline: "Invest with XTB",
    subtext:
      "Regulated broker with low-cost ETFs and stocks. Your capital is at risk.",
    cta: "Learn more at XTB",
    href: "https://www.xtb.com/",
    displayUrl: "xtb.com",
    disclosure:
      "Sponsored. We may earn a commission. Investing involves risk of loss. Indicative info; confirm current terms with the provider.",
    rel: SPONSORED_REL,
  },
  revolut: {
    id: "revolut",
    provider: "Revolut",
    category: "neobank",
    active: false,
    headline: "Everyday banking with Revolut",
    subtext:
      "Multi-currency account, cards and budgeting — quick to open and widely used across the EU.",
    cta: "Learn more at Revolut",
    href: "https://www.revolut.com/",
    displayUrl: "revolut.com",
    disclosure:
      "Sponsored. We may earn a commission if you sign up — at no extra cost to you. Indicative info; confirm current terms with the provider.",
    rel: SPONSORED_REL,
  },
};
