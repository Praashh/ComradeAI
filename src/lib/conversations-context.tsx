"use client";

import { createContext, use, useMemo } from "react";
import { api } from "@/trpc/react";

type Conversation = {
  id: number;
  userId: number;
  title: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

type ConversationsContextValue = {
  conversations: Conversation[];
  isLoading: boolean;
  refetch: () => void;
};

const ConversationsContext = createContext<ConversationsContextValue | null>(
  null,
);

export function ConversationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, refetch } = api.conversation.getAll.useQuery(
    undefined,
    { staleTime: Infinity },
  );

  const value = useMemo(
    () => ({
      conversations: data?.conversations ?? [],
      isLoading,
      refetch,
    }),
    [data?.conversations, isLoading, refetch],
  );

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}

const fallback: ConversationsContextValue = {
  conversations: [],
  isLoading: false,
  refetch: () => {
    /* empty */
  },
};

export function useConversations() {
  const context = use(ConversationsContext);
  return context ?? fallback;
}
