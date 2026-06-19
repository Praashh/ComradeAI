import { requireNotOnboarded } from "@/lib/check-onboarding";
import OnboardingFlow from "@/app/_components/OnboardingFlow";

export const metadata = { title: "Welcome to Comrade AI" };

export default async function OnboardingPage() {
  await requireNotOnboarded();
  return <OnboardingFlow />;
}
