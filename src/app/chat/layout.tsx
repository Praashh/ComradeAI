"use client";

import { ConversationsProvider } from "@/lib/conversations-context";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConversationsProvider>{children}</ConversationsProvider>;
}
