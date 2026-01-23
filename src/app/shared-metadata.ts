import type { Metadata } from "next";

export const SITE_NAME = "Malta Calculator";
export const SITE_URL = "https://maltacalculator.com";

export const TITLE = "Malta Salary Calculator 2026 | Tax, SSC & Net Pay";
export const DESCRIPTION =
  "Malta'da net maaşınızı hesaplayın. 2024-2026 vergi dilimleri, SSC katkıları ve COLA ile doğru hesaplama. Bekar ve evli vergi mükellefleri için ücretsiz, anlık sonuçlar. Calculate your Malta net salary with accurate tax brackets, SSC contributions, and COLA.";

export const KEYWORDS = [
  "Malta salary calculator",
  "Malta tax calculator",
  "Malta net salary",
  "Malta gross to net",
  "Malta SSC calculator",
  "Malta social security contributions",
  "Malta COLA",
  "Malta income tax",
  "Malta payroll calculator",
  "Malta 2026 tax rates",
  "Malta 2025 tax rates",
  "Malta 2024 tax rates",
  "Malta maaş hesaplama",
  "Malta vergi hesaplama",
];

export const defaultMetadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: TITLE,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const twitterMetadata: Metadata["twitter"] = {
  title: TITLE,
  description: DESCRIPTION,
  card: "summary_large_image",
  site: "@maltacalculator",
  creator: "@maltacalculator",
};

export const ogMetadata: Metadata["openGraph"] = {
  title: TITLE,
  description: DESCRIPTION,
  type: "website",
  locale: "en_MT",
  url: SITE_URL,
  siteName: SITE_NAME,
};
