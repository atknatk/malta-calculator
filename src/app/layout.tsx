import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import LocalFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import Background from "./_components/background";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  viewportConfig,
} from "@/app/shared-metadata";

const inter = Inter({ subsets: ["latin"] });
const calSans = LocalFont({
  src: "../../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

export const metadata: Metadata = {
  ...defaultMetadata,
  twitter: {
    ...twitterMetadata,
  },
  openGraph: {
    ...ogMetadata,
  },
};

export const viewport = viewportConfig;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${
            inter.className
            // biome-ignore lint/nursery/useSortedClasses: <explanation>
          } ${calSans.variable}`}
        >
          <SpeedInsights />
          <Analytics />
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Background>{children}</Background>
            <Toaster richColors />
            <TailwindIndicator />
          </ThemeProvider>
        </body>
        <GoogleAnalytics gaId="G-LCNYBX78G0" />
      </html>
    </ClerkProvider>
  );
}
