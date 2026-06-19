import type { Metadata } from "next";
import { requireOnboarded } from "@/lib/check-onboarding";
import { ConversationsProvider } from "@/lib/conversations-context";

export const metadata: Metadata = {
  title: "Chat - Comrade AI",
  description:
    "Chat with Comrade AI, your AI companion who understands you through your journal entries.",
};

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOnboarded();
  return <ConversationsProvider>{children}</ConversationsProvider>;
}
