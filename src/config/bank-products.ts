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

/**
 * Mevduat / birikim sağlayıcısı — vadeli mevduat (fixed term deposit)
 * oranları vade bazında. Pivot tablo için: 1 satır = 1 sağlayıcı,
 * sütunlar = vadeler. Bir vade sunulmuyorsa/teyit edilmediyse alan atlanır
 * (tabloda "—" gösterilir).
 */
export interface SavingsProvider {
  provider: string;
  /** Yıllık brüt faiz (%) — vade bazında; eksik = teklif yok/teyitsiz */
  rates: {
    m6?: number;
    y1?: number;
    y2?: number;
    y3?: number;
  };
  /** örn. "€100" */
  minDeposit: string | null;
  sourceUrl: string;
  lastVerified: string;
}

/**
 * Konut kredisi oranları. Sayısal oranlar yalnızca birincil kaynaktan
 * doğrulanır. Bazı bankalar (BOV, Lombard) oranlarını online yayınlamaz;
 * bunlar tabloda "On request" olarak gösterilir (rateSummary), aprc/example
 * null bırakılır, sourceUrl bankanın kendi konut kredisi sayfasına gider.
 * Böylece tüm büyük yerel bankalar listede yer alır, uydurma sayı olmadan.
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
  {
    bank: "APS Bank",
    product: "Home Loan (fixed then variable)",
    rateSummary: "2.45% fixed for 60 months, then 2.90% variable",
    aprc: 2.8,
    example: "€200,000 over 40 years ≈ €657.80/mo, then ≈ €703.69/mo",
    sourceUrl: "https://www.apsbank.com.mt/home-loans/",
    lastVerified: "2026-06-22",
  },
  {
    bank: "Bank of Valletta (BOV)",
    product: "Home Loan",
    rateSummary: "On request",
    aprc: null,
    example: null,
    sourceUrl: "https://www.bov.com/home-loans-landing-page",
    lastVerified: "2026-06-22",
  },
  {
    bank: "Lombard Bank",
    product: "Home Loan",
    rateSummary: "On request",
    aprc: null,
    example: null,
    sourceUrl: "https://www.lombardmalta.com/home-loans",
    lastVerified: "2026-06-22",
  },
];

/**
 * Vadeli mevduat oranları (hepsi birincil kaynaktan doğrulanmış):
 * MeDirect, BNF, APS, HSBC. Lombard ve BOV vadeli mevduat oranlarını
 * sitelerinde net yayınlamadığı için EKLENMEDİ (teyit edilince eklenecek).
 * En yüksekten en düşüğe kabaca 1 yıl oranına göre sıralı.
 */
export const SAVINGS_RATES: SavingsProvider[] = [
  {
    provider: "MeDirect",
    rates: { m6: 1.9, y1: 2.35, y2: 2.4, y3: 2.4 },
    minDeposit: "€100",
    sourceUrl: "https://www.medirect.com.mt/save/fixed-term-deposit/",
    lastVerified: "2026-06-22",
  },
  {
    provider: "BNF Bank",
    rates: { m6: 1.0, y1: 2.0, y2: 1.5, y3: 1.5 },
    minDeposit: "€500",
    sourceUrl: "https://www.bnf.bank/interest_rates",
    lastVerified: "2026-06-22",
  },
  {
    provider: "APS Bank",
    rates: { m6: 0.5, y1: 1.2, y2: 1.3, y3: 1.4 },
    minDeposit: "€1,000",
    sourceUrl: "https://www.apsbank.com.mt/term-deposit-accounts/",
    lastVerified: "2026-06-22",
  },
  {
    provider: "HSBC Malta",
    rates: { m6: 0.5, y1: 1.0, y2: 1.05, y3: 1.2 },
    minDeposit: "€1,000",
    sourceUrl:
      "https://www.hsbc.com.mt/savings-accounts/products/term-deposit/",
    lastVerified: "2026-06-22",
  },
];

/**
 * Esnek / anlık-erişim (instant-access) birikim — neobank & dijital
 * sağlayıcılar dâhil. Bu ürünlerin oranları DEĞİŞKENdir (plana/bölgeye göre
 * değişir, sık güncellenir), bu yüzden vade-bazlı tabloya konmaz. Sabit bir
 * oran teyit edilemiyorsa rateLabel "Variable" yazılır ve indikatif bilgi
 * notes alanında TARİHLİ olarak verilir.
 */
export interface FlexibleSavings {
  provider: string;
  /** "2.00%" gibi sabit, ya da "Variable" */
  rateLabel: string;
  /** örn. "Instant access" */
  access: string;
  notes: string;
  sourceUrl: string;
  lastVerified: string;
}

export const FLEXIBLE_SAVINGS: FlexibleSavings[] = [
  {
    provider: "MeDirect — MeMax",
    rateLabel: "2.00%",
    access: "Instant access",
    notes:
      "Paid monthly and compounded. Max €2,000 deposit per month, €50,000 balance.",
    sourceUrl: "https://www.medirect.com.mt/save/me-max/",
    lastVerified: "2026-06-22",
  },
  {
    provider: "Revolut",
    rateLabel: "Variable",
    access: "Instant access",
    notes:
      "EUR Instant Access Savings; rate depends on your plan (≈2% on Standard, higher on paid plans / promos). Varies — as of Jun 2026.",
    sourceUrl: "https://www.revolut.com/savings/",
    lastVerified: "2026-06-22",
  },
  {
    provider: "Wise",
    rateLabel: "Variable",
    access: "On EUR balance",
    notes:
      "Interest on your EUR balance via money-market funds where eligible (≈1.7% recently, set by partner banks). Varies — as of Jun 2026.",
    sourceUrl: "https://wise.com/",
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
