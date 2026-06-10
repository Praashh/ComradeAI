"use client";

import { createContext, useContext } from "react";
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

  return (
    <ConversationsContext.Provider
      value={{
        conversations: data?.conversations ?? [],
        isLoading,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        refetch,
      }}
    >
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
  const context = useContext(ConversationsContext);
  return context ?? fallback;
}
