"use client";

import { use } from "react";
import ChatDashboard from "@/app/_components/ChatDashboard";

export default function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const conversationId = Number(id);
  return <ChatDashboard activeConversationId={conversationId} />;
}
