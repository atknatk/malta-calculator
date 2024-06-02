import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google";

import LocalFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import Background from "./_components/background";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "sonner";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head />
    <body
        className={`${
          inter.className
          // biome-ignore lint/nursery/useSortedClasses: <explanation>
        } ${calSans.variable}`}
      >
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Background>{children}</Background>
          <Toaster richColors />
          <TailwindIndicator />
        </ThemeProvider>
    </body>
  </html>
  );
}

