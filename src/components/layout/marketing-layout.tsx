import { MarketingFooter } from "./marketing-footer";
import { MarketingHeader } from "./marketing-header";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-8">
      <MarketingHeader className="mx-auto w-full max-w-6xl px-4 md:px-8" />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-start justify-center px-4 md:px-8">
        {children}
      </div>
      <MarketingFooter className="mx-auto w-full max-w-6xl px-4 md:px-8" />
    </main>
  );
}
