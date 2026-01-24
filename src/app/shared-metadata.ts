import type { Metadata, Viewport } from "next";

export const SITE_NAME = "Malta Calculator";
export const SITE_URL = "https://maltacalculator.com";

export const TITLE = "Malta Salary Calculator 2026 | Free Tax, SSC & Net Pay Calculator";
export const DESCRIPTION =
  "Calculate your Malta net salary with accurate 2024-2026 tax brackets, SSC contributions, and COLA. Free instant results for single, married, and parent taxpayers. The #1 Malta salary calculator.";

export const KEYWORDS = [
  "Malta salary calculator",
  "Malta salary calculator 2026",
  "Malta tax calculator",
  "Malta net salary",
  "Malta gross to net",
  "salary calculator Malta",
  "Malta SSC calculator",
  "Malta social security contributions",
  "Malta COLA",
  "Malta income tax",
  "Malta payroll calculator",
  "Malta 2026 tax rates",
  "Malta 2025 tax rates",
  "Malta 2024 tax rates",
  "net salary Malta",
  "Malta salary",
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

// Viewport configuration to prevent iOS Safari zoom on input focus
export const viewportConfig: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};
