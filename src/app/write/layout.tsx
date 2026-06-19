import type { Metadata } from "next";
import { requireOnboarded } from "@/lib/check-onboarding";
import { JournalsProvider } from "@/lib/journals-context";

export const metadata: Metadata = {
  title: "Write - Comrade AI",
  description:
    "Write and manage your journal entries with Comrade AI, your AI journaling companion.",
};

export default async function WriteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOnboarded();
  return <JournalsProvider>{children}</JournalsProvider>;
}
