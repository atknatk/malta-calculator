/**
 * Malta banka ürün oranları — elle güncellenen, KAYNAKLI ve TARİHLİ veri.
 *
 * DOĞRULUK İLKESİ (CLAUDE.md): Her satır birincil kaynaktan (bankanın kendi
 * sayfası) doğrulanır; `sourceUrl` + `lastVerified` zorunlu. Oranlar
 * gösterimde "indicative — bankadan teyit alın" uyarısıyla sunulur.
 *
 * Yalnızca doğrulanabilen satırlar eklenir. Bir bankanın güncel oranı
 * birincil kaynaktan teyit edilemiyorsa BURAYA EKLENMEZ (yanlış/eski oran
 * yayınlamaktansa eksik bırakmak yeğdir).
 *
 * Güncelleme takvimi: çeyreklik gözden geçirme önerilir.
 */

/** Konut kredisi (mortgage) oranı satırı. */
export interface MortgageRate {
  bank: string;
  product: string;
  /** İnsan-okur özet, örn. "2.85% variable" veya "2.10% fixed (24m), then 2.70%" */
  rateSummary: string;
  /** APRC (Annual Percentage Rate of Charge), % */
  aprc: number | null;
  /** Temsili örnek (AB mevzuatı gereği), örn. "€200,000 / 30y ≈ €827/mo" */
  example: string | null;
  sourceUrl: string;
  /** YYYY-MM-DD — birincil kaynaktan son doğrulama tarihi */
  lastVerified: string;
}

/** Mevduat / birikim oranı satırı. */
export interface SavingsRate {
  provider: string;
  /** örn. "Fixed term — 1 year" */
  product: string;
  /** Yıllık brüt faiz, % */
  ratePa: number;
  /** örn. "€100" */
  minDeposit: string | null;
  sourceUrl: string;
  lastVerified: string;
}

/**
 * Konut kredisi oranları. Yalnızca birincil kaynaktan doğrulananlar.
 */
export const MORTGAGE_RATES: MortgageRate[] = [
  {
    bank: "HSBC Malta",
    product: "Classic Home Loan (variable)",
    rateSummary: "2.85% variable",
    aprc: 2.9,
    example: "€200,000 over 30 years ≈ €827.11/mo",
    sourceUrl: "https://www.hsbc.com.mt/home-loans/products/classic-home-loan/",
    lastVerified: "2026-06-22",
  },
  {
    bank: "BNF Bank",
    product: "Home Loan (fixed then variable)",
    rateSummary: "2.10% fixed for 24 months, then 2.70% variable",
    aprc: 2.7,
    example: "€250,000 over 40 years ≈ €770.52/mo, then ≈ €849.05/mo",
    sourceUrl:
      "https://www.bnf.bank/support/articles/home-loan-general-information",
    lastVerified: "2026-06-22",
  },
];

/**
 * Mevduat / birikim oranları. MeDirect'in vadeli mevduat merdiveni
 * (birincil kaynaktan doğrulanmış). Geleneksel bankaların anlık-erişim
 * birikim oranları genelde çok düşüktür; oranları birincil kaynaktan
 * teyit edildikçe buraya eklenecektir.
 */
export const SAVINGS_RATES: SavingsRate[] = [
  {
    provider: "MeDirect",
    product: "Fixed Term Deposit — 6 months",
    ratePa: 1.9,
    minDeposit: "€100",
    sourceUrl: "https://www.medirect.com.mt/save/fixed-term-deposit/",
    lastVerified: "2026-06-22",
  },
  {
    provider: "MeDirect",
    product: "Fixed Term Deposit — 1 year",
    ratePa: 2.35,
    minDeposit: "€100",
    sourceUrl: "https://www.medirect.com.mt/save/fixed-term-deposit/",
    lastVerified: "2026-06-22",
  },
  {
    provider: "MeDirect",
    product: "Fixed Term Deposit — 2 years",
    ratePa: 2.4,
    minDeposit: "€100",
    sourceUrl: "https://www.medirect.com.mt/save/fixed-term-deposit/",
    lastVerified: "2026-06-22",
  },
  {
    provider: "MeDirect",
    product: "Fixed Term Deposit — 3 years",
    ratePa: 2.4,
    minDeposit: "€100",
    sourceUrl: "https://www.medirect.com.mt/save/fixed-term-deposit/",
    lastVerified: "2026-06-22",
  },
];

/** Resmî piyasa-ortalaması veri kaynakları (canlı entegrasyon için kanca). */
export const OFFICIAL_RATE_SOURCES = {
  ecbMir: {
    label: "ECB — MFI Interest Rate Statistics (Malta)",
    url: "https://data.ecb.europa.eu/data/datasets/MIR",
  },
  centralBankMalta: {
    label: "Central Bank of Malta — Interest Rates",
    url: "https://www.centralbankmalta.org/interest-rates-and-key-financial-market-rates",
  },
} as const;
