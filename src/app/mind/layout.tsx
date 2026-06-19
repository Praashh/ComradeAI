import type { Metadata } from "next";
import { requireOnboarded } from "@/lib/check-onboarding";

export const metadata: Metadata = {
  title: "Mind - Comrade AI",
  description:
    "Explore your mind graph and see how your memories and journal entries connect.",
};

export default async function MindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOnboarded();
  return <>{children}</>;
}
