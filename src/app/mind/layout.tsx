import { requireOnboarded } from "@/lib/check-onboarding";

export default async function MindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOnboarded();
  return <>{children}</>;
}
