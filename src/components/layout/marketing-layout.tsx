import { MarketingFooter } from "./marketing-footer";
import { MarketingHeader } from "./marketing-header";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-8">
      <MarketingHeader className="mx-auto w-full max-w-6xl px-4 md:px-8" />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 md:px-8">
        {children}
      </main>
      <MarketingFooter />
    </div>
  );
}
