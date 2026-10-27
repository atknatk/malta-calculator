/**
 * Server-side salary calculator wrapper
 * Hesaplama istemci bileşeninde yapılır; SSR'da aynı bileşen ilk HTML'i üretir
 */
import { SalaryCalculatorClient } from "./salary-calculator";
import type { SalarySearchParams } from "../search-params";

interface SalaryCalculatorServerProps {
  initialParams: SalarySearchParams;
  children?: React.ReactNode;
}

export function SalaryCalculatorServer({
  initialParams,
  children,
}: SalaryCalculatorServerProps) {
  return (
    <SalaryCalculatorClient initialParams={initialParams}>
      {children}
    </SalaryCalculatorClient>
  );
}
