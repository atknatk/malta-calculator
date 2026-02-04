import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs/server";
import { serializeSalaryParams, salaryParamsCache } from "./search-params";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

/**
 * /salary page now redirects to homepage (/) since the salary calculator
 * is the main content of the homepage.
 *
 * URL parameters are preserved during redirect.
 */
export default async function SalaryCalculatorPage({
  searchParams,
}: PageProps) {
  // Parse the search params
  const params = await salaryParamsCache.parse(searchParams);

  // Build the URL with preserved params
  const queryString = serializeSalaryParams(params);

  // Redirect to homepage with preserved params
  redirect(`/${queryString}`);
}
