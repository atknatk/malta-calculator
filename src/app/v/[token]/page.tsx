import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

interface ShortVerifyPageProps {
  params: Promise<{ token: string }>;
}

export default async function ShortVerifyPage({
  params,
}: ShortVerifyPageProps) {
  const { token } = await params;
  redirect(`/payslip/verify/${token}`);
}
