import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getCompany } from "@/app/actions/payslip-actions";
import OnboardingWizard from "./_components/onboarding-wizard";

export default async function OnboardingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user already has a company
  const company = await getCompany();

  if (company) {
    redirect("/dashboard");
  }

  return <OnboardingWizard />;
}
