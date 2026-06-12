import { requireOnboarded } from "@/lib/check-onboarding";
import { JournalsProvider } from "@/lib/journals-context";

export default async function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOnboarded();
  return <JournalsProvider>{children}</JournalsProvider>;
}
