import { requireOnboarded } from "@/lib/check-onboarding";
import { ConversationsProvider } from "@/lib/conversations-context";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOnboarded();
  return <ConversationsProvider>{children}</ConversationsProvider>;
}
