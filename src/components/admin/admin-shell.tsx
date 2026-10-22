import type { ReactNode } from "react";
import { getCompany } from "@/app/actions/payslip-actions";
import AdminNav from "./admin-nav";

// Oturum açılmış yönetim sayfalarının ortak kabuğu: M3 navigation drawer,
// mobilde top app bar + navigation bar. Sayfalar kendi auth/redirect
// kontrollerini yapmaya devam eder.
export default async function AdminShell({
  children,
}: {
  children: ReactNode;
}): Promise<JSX.Element> {
  const company = await getCompany();

  return (
    <div className="admin-shell min-h-screen bg-md-surface text-md-on-surface print:bg-white">
      <AdminNav
        companyName={company?.name ?? null}
        companyLogo={company?.logo_url ?? null}
        plan={company?.plan ?? null}
      />
      <div className="lg:pl-72 print:pl-0">
        <main className="mx-auto w-full max-w-6xl px-4 pb-32 pt-4 sm:px-6 lg:px-10 lg:pb-16 lg:pt-10 print:max-w-none print:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
