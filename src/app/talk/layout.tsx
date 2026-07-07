import { requireOnboarded } from "@/lib/check-onboarding";

export const metadata = {
  title: "Talk to Comrade",
  description: "Have a voice conversation with Comrade AI",
};

export default async function TalkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOnboarded();
  return <>{children}</>;
}
